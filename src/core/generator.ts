import type { LlmClient } from './llm.js';
import { getDriverFiles, PLATFORM_TEMPLATES, renderSkeleton } from './templates.js';
import type { GeneratedFileResult, ProjectPlan } from './types.js';

/** 并发生成上限 */
const CONCURRENCY = 3;

function buildSystemPrompt(plan: ProjectPlan, alreadyDone: string[], extraContext = '', skillsContext = ''): string {
  const template = PLATFORM_TEMPLATES[plan.platform];
  const driverFiles = getDriverFiles(plan.drivers || []);
  const structureLines = [
    ...template.skeleton.map((f) => `- ${f.path}（骨架，已存在）`),
    ...driverFiles.map((f) => `- ${f.path}（外设驱动模板，已存在，可直接 #include 调用）`),
    ...plan.files.map((f) => `- ${f}（待生成）`),
  ].join('\n');
  return `你是一名有 10 年以上 ARM/MCU 量产项目经验的资深嵌入式软件工程师，正在为 "${plan.projectName}" 项目编写生产级代码。你的代码要能通过严格的技术评审。

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
${structureLines}${extraContext}${skillsContext}

【应用层约定】
- main.c 已由骨架提供标准框架（HAL_Init / 时钟配置 / GPIO 使能 / 调用 app_init() / while(1) 调 app_loop()），不要重新生成 main.c。
- 你只需生成 app.c 和 app.h：app.h 声明 app_init(void) 和 app_loop(void)；app.c 实现这两个函数，所有业务逻辑（外设初始化、传感器读取、显示刷新、状态机）都写在这里。
- 外设驱动模板已在 Drivers/BSP/ 下，直接 #include "dht11.h" / "ssd1306.h" / "button.h" / "led_pwm.h" / "uart_debug.h" 调用即可，不要重写驱动。

工程标准（评审红线，逐条落实）：
1. 只输出该文件的完整代码，不要输出任何解释、注释头或多余文字。
2. 代码符合平台惯例（HAL / ESP-IDF / Arduino API / Pico SDK / Zephyr / MicroPython），C 用 C11。
3. **驱动与应用分层**：硬件驱动独立成模块（xxx.c/xxx.h），接口在头文件声明并带简要注释；main.c 只做初始化与业务调度。
4. **错误处理**：所有 HAL/总线调用检查返回值，总线操作带超时；失败路径明确（重试/降级/置错误标志），不允许 void 吞错。
5. **中断安全**：ISR 只做取数据/置标志/入队，共享变量加 volatile，多字节共享数据用临界区保护；ISR 内禁止延时、printf、malloc。
6. **时序可靠**：微秒级延时用 DWT/硬件定时器实现（禁止空循环估延时）；传感器时序参数按数据手册，注释注明出处。
7. **主循环结构**：业务用状态机或非阻塞调度，禁止用大 while+delay 阻塞式写业务逻辑；按键用消抖。
8. 魔数提取为具名宏（寄存器地址、超时时间、阈值）；头文件带 include guard；外部接口声明与实现一致。
9. 不要使用尚未声明的外部库（除平台标准库/框架）。
10. 若参考资料/知识模块与你的默认假设冲突，以用户上传的资料与知识模块为准。`;
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
  extraContext = '',
  skillsContext = '',
): Promise<GeneratedFileResult> {
  try {
    const content = await client.chat(
      [
        { role: 'system', content: buildSystemPrompt(plan, alreadyDone, extraContext, skillsContext) },
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

/** 生成全部工程文件（骨架 + AI 文件）；skillsContext 会注入每个文件的生成提示 */
export async function generateProject(
  client: LlmClient,
  plan: ProjectPlan,
  extraContext = '',
  skillsContext = '',
): Promise<{ files: GeneratedFileResult[]; skeletonCount: number; aiGeneratedCount: number }> {
  const template = PLATFORM_TEMPLATES[plan.platform];
  const vars = {
    PROJECT_NAME: plan.projectName,
    PROJECT_NAME_UPPER: plan.projectName.toUpperCase().replace(/-/g, '_'),
  };

  const driverFiles = getDriverFiles(plan.drivers || []);
  const skeletonPaths = new Set([
    ...template.skeleton.map((s) => s.path),
    ...driverFiles.map((d) => d.path),
  ]);

  const skeletonFiles: GeneratedFileResult[] = [
    ...template.skeleton.map((f) => ({
      path: f.path,
      status: 'ok' as const,
      content: renderSkeleton(f.content, vars),
    })),
    ...driverFiles.map((f) => ({
      path: f.path,
      status: 'ok' as const,
      content: f.content,
    })),
  ];

  const aiFiles = await mapWithConcurrency(
    plan.files.filter((p) => !skeletonPaths.has(p)),
    CONCURRENCY,
    (filePath) => generateOneFile(client, plan, filePath, plan.files, extraContext, skillsContext),
  );

  return {
    files: [...skeletonFiles, ...aiFiles],
    skeletonCount: skeletonFiles.length,
    aiGeneratedCount: aiFiles.filter((f) => f.status === 'ok').length,
  };
}
