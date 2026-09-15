import type { LlmClient } from './llm.js';
import { PLATFORM_TEMPLATES, renderSkeleton } from './templates.js';
import type { GeneratedFileResult, ProjectPlan } from './types.js';

/** 并发生成上限 */
const CONCURRENCY = 3;

function buildSystemPrompt(plan: ProjectPlan, alreadyDone: string[]): string {
  const template = PLATFORM_TEMPLATES[plan.platform];
  const structureLines = [
    ...template.skeleton.map((f) => `- ${f.path}（骨架，已存在）`),
    ...plan.files.map((f) => `- ${f}（待生成）`),
  ].join('\n');
  return `你是一名资深嵌入式软件工程师，正在为 "${plan.projectName}" 项目编写代码。

【平台】${template.info.name}
【目标芯片/开发板】${plan.target}
【构建系统】${plan.buildSystem}
【项目简介】${plan.summary}
【功能模块】${plan.modules.map((m) => `- ${m}`).join('\n')}
【引脚分配】${
    plan.pinout.length
      ? plan.pinout.map((p) => `- ${p.pin}: ${p.signal}${p.note ? ` (${p.note})` : ''}`).join('\n')
      : '无指定，请使用合理默认'
  }
【工程结构】
${structureLines}

要求：
1. 只输出该文件的完整代码，不要输出任何解释、注释头或多余文字。
2. 代码符合平台惯例（HAL / ESP-IDF / Arduino API），生产级质量：错误检查、超时处理、注释精简。
3. 头文件要带 include guard；C 代码用 C11。
4. 外部可见接口在头文件中声明；不要重复定义已在其他文件中声明的符号。
5. 用中英文注释均可，保持简洁。
6. 不要使用尚未声明的外部库（除平台标准库/框架）。`;
}

/** 清洗模型输出：去除代码围栏和首尾空白 */
export function cleanCode(raw: string): string {
  const trimmed = raw.trim();
  const fenced = trimmed.match(/^```[a-zA-Z0-9-]*\n([\s\S]*?)\n```$/);
  if (fenced) return fenced[1].trimEnd() + '\n';
  return trimmed.endsWith('\n') ? trimmed : trimmed + '\n';
}

async function generateOneFile(
  client: LlmClient,
  plan: ProjectPlan,
  filePath: string,
  alreadyDone: string[],
): Promise<GeneratedFileResult> {
  try {
    const content = await client.chat(
      [
        { role: 'system', content: buildSystemPrompt(plan, alreadyDone) },
        { role: 'user', content: `请生成文件：${filePath}` },
      ],
      { temperature: 0.2, maxTokens: 8000 },
    );
    return { path: filePath, status: 'ok', content: cleanCode(content) };
  } catch (err) {
    return { path: filePath, status: 'error', error: (err as Error).message };
  }
}

/** 简易并发限制器 */
async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const i = cursor++;
      results[i] = await fn(items[i], i);
    }
  });
  await Promise.all(workers);
  return results;
}

/** 生成全部工程文件（骨架 + AI 文件） */
export async function generateProject(
  client: LlmClient,
  plan: ProjectPlan,
): Promise<{ files: GeneratedFileResult[]; skeletonCount: number; aiGeneratedCount: number }> {
  const template = PLATFORM_TEMPLATES[plan.platform];
  const vars = {
    PROJECT_NAME: plan.projectName,
    PROJECT_NAME_UPPER: plan.projectName.toUpperCase().replace(/-/g, '_'),
  };

  const skeletonFiles: GeneratedFileResult[] = template.skeleton.map((f) => ({
    path: f.path,
    status: 'ok' as const,
    content: renderSkeleton(f.content, vars),
  }));

  const aiFiles = await mapWithConcurrency(
    plan.files.filter((p) => !template.skeleton.some((s) => s.path === p)),
    CONCURRENCY,
    (filePath) => generateOneFile(client, plan, filePath, plan.files),
  );

  return {
    files: [...skeletonFiles, ...aiFiles],
    skeletonCount: skeletonFiles.length,
    aiGeneratedCount: aiFiles.filter((f) => f.status === 'ok').length,
  };
}
