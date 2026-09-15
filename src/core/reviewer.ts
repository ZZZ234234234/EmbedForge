import type { LlmClient } from './llm.js';
import type { GeneratedFileResult, ProjectPlan, ReviewIssue, ReviewResult } from './types.js';

/** 审查时单个文件的最大长度（超出截断） */
const MAX_FILE_DUMP = 20 * 1024;
/** 送审代码总量上限 */
const MAX_TOTAL_DUMP = 90 * 1024;

const REVIEW_SYSTEM_PROMPT = `你是一名资深嵌入式软件工程师，正在对刚生成的嵌入式工程代码做严格的技术审查。

审查维度（按优先级）：
1. 编译性：头文件 include guard、函数声明与调用一致、类型匹配、明显语法/链接错误。
2. 硬件正确性：引脚/外设配置与规划一致、时钟使能、I2C 上拉、SPI 模式、单总线时序参数是否符合数据手册。
3. 中断与并发：ISR 共享变量 volatile、ISR 内无延时/打印/malloc、临界区使用、NVIC 优先级。
4. 鲁棒性：返回值检查、超时处理、消抖、缓冲区边界、死循环风险、看门狗。
5. 工程规范：驱动与应用分层、魔数宏化、注释充分。

只报告确实存在的问题，不要为了凑数硬挑毛病。对 high/medium 级问题必须给出修复后的完整文件。

严格输出以下 JSON（不要多余文字）：
{
  "issues": [{"file": "Core/Src/main.c", "severity": "high|medium|low", "description": "问题描述（中文，含修复思路）"}],
  "fixedFiles": [{"path": "Core/Src/main.c", "content": "修复后的完整文件内容（仅对 high/medium 问题提供；无问题则空数组）"}]
}`;

/** 让资深工程师视角的 LLM 审查生成结果；失败返回 null（静默跳过，不阻塞主流程） */
export async function reviewGeneratedProject(
  client: LlmClient,
  plan: ProjectPlan,
  files: GeneratedFileResult[],
  extraContext = '',
): Promise<ReviewResult | null> {
  const aiFiles = files.filter((f) => f.status === 'ok' && f.content);
  if (!aiFiles.length) return null;

  let total = 0;
  const dump = aiFiles
    .map((f) => {
      const content = f.content!.length > MAX_FILE_DUMP
        ? f.content!.slice(0, MAX_FILE_DUMP) + '\n…（截断）'
        : f.content!;
      total += content.length;
      return `===== ${f.path} =====\n${content}`;
    })
    .join('\n\n')
    .slice(0, MAX_TOTAL_DUMP);
  if (!total) return null;

  const planBrief = [
    `平台: ${plan.platform}　芯片: ${plan.target}　构建: ${plan.buildSystem}`,
    `模块: ${plan.modules.join('、')}`,
    `引脚: ${plan.pinout.map((p) => `${p.pin}→${p.signal}`).join(', ') || '未指定'}`,
  ].join('\n');

  try {
    const parsed = await client.chatJson<{ issues?: ReviewIssue[]; fixedFiles?: { path: string; content: string }[] }>(
      [
        {
          role: 'system',
          content: REVIEW_SYSTEM_PROMPT + (extraContext ? `\n\n【参考资料约束】${extraContext}` : ''),
        },
        {
          role: 'user',
          content: `【工程规划】\n${planBrief}\n\n【待审查的完整代码】\n${dump}`,
        },
      ],
      { temperature: 0.1, maxTokens: 8000 },
    );
    if (!parsed || !Array.isArray(parsed.issues)) return null;

    const issues: ReviewIssue[] = parsed.issues
      .filter((i) => i && i.file && i.description)
      .map((i) => ({
        file: i.file,
        severity: i.severity === 'high' || i.severity === 'medium' ? i.severity : 'low',
        description: i.description,
      }));

    const fixedFiles: GeneratedFileResult[] = (parsed.fixedFiles ?? [])
      .filter((f) => f && f.path && typeof f.content === 'string' && f.content.trim())
      .map((f) => ({ path: f.path, status: 'ok' as const, content: f.content }));

    return { issues, fixedFiles };
  } catch {
    // 审查失败不阻塞生成主流程
    return null;
  }
}
