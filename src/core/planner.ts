import type { LlmClient } from './llm.js';
import { buildUserMessage } from './context.js';
import { detectDrivers, getPlatform } from './templates.js';
import type { Attachment, PlatformId, ProjectPlan } from './types.js';

const PLAN_SYSTEM_PROMPT = `你是一名有 10 年以上 ARM/MCU 量产项目经验的资深嵌入式系统架构师。用户会给出一个嵌入式开发需求，你需要输出一份结构化的工程规划 JSON，用于驱动代码生成。规划必须像真实项目立项评审一样严谨。

必须严格输出以下 JSON 结构（不要输出任何多余文字）：
{
  "projectName": "工程目录名（小写字母、数字、连字符，如 dht11-oled-monitor）",
  "platform": "stm32 | esp32 | arduino | generic-c | pico | avr | micropython | zephyr（根据需求推断，无法推断时用 generic-c）",
  "target": "目标芯片/开发板型号，如 STM32F103C8T6、ESP32-DevKitC、Arduino Uno",
  "summary": "一句话项目简介",
  "modules": ["功能模块列表，如 DHT11 温湿度采集（软件 I2C）"],
  "pinout": [{"pin": "引脚名如 PA0", "signal": "信号名如 DHT11_DATA", "note": "可选：电气要求（上拉/模式/复用外设）"}],
  "files": ["需要生成的源代码文件相对路径，如 Core/Src/main.c、Core/Inc/main.h、Core/Src/dht11.c、Core/Inc/dht11.h"],
  "buildSystem": "make | cmake | platformio"
}

架构师要求：
1. **外设资源规划**：明确每个模块使用的外设（如 USART1、I2C1、TIM2），检查资源冲突（同一 TIM/USART 不得复用给两个模块），必要时在 pinout note 中注明。
2. **引脚分配要有依据**：I2C/SPI/UART 用该芯片外设对应的典型引脚（不能凭空捏造不存在的 AF 映射）；保留 SWD 调试口（PA13/PA14）；BOOT 引脚不占用。
3. **驱动分层**：每个独立硬件（传感器、屏幕、总线设备）单独出 driver 文件（.c/.h），main.c 只做初始化与业务调度，文件名与模块名对应。
4. **files 完整性**：必须包含主程序、所有驱动源文件与头文件，路径符合平台惯例（stm32 用 Core/Src、Core/Inc；esp32 与 zephyr 用 src/ 或 main/；arduino、pico、avr、generic-c 用 src/ 与 include/；micropython 直接在根目录放 main.py / boot.py / config.py）。
5. **电气与功能细节前置**：上拉电阻需求、开漏/推挽、消抖、去耦等电气约束写进 pinout.note 或 modules 描述，生成阶段会直接引用。
6. 如果需求没有提到具体平台，优先选 generic-c 或 arduino；需求提到 RTOS 或并发任务多时在 modules 中注明任务划分方案。`;

/** 规划阶段的额外上下文 */
export interface PlanContext {
  attachments?: Attachment[];
  /** 会话历史摘要（buildMemoryBrief 生成） */
  memoryBrief?: string;
  /** 匹配到的专家技能知识块（buildSkillsContext 生成） */
  skillsBrief?: string;
}

/** 用 LLM 解析需求为工程规划；失败时回退到规则推断 */
export async function planProject(
  client: LlmClient,
  requirement: string,
  platformHint?: string,
  ctx: PlanContext = {},
): Promise<ProjectPlan> {
  const attachments = ctx.attachments ?? [];
  try {
    const plan = await client.chatJson<ProjectPlan>(
      [
        { role: 'system', content: PLAN_SYSTEM_PROMPT + (ctx.memoryBrief ?? '') + (ctx.skillsBrief ?? '') },
        buildUserMessage(requirement, attachments),
      ],
      { temperature: 0.2, maxTokens: 2000 },
    );
    if (plan && plan.projectName && plan.platform) {
      const template = getPlatform(plan.platform);
      if (template) {
        // 过滤掉标准库/驱动/构建文件，AI 只生成应用层（Core/ 下的源码）
        const rawFiles = plan.files?.length ? plan.files : template.defaultAiFiles;
        const aiFiles = rawFiles.filter(
          (f) => !f.startsWith('Drivers/') && !f.startsWith('startup_') && !f.endsWith('.ld') && f !== 'Makefile',
        );
        return {
          ...plan,
          projectName: sanitizeName(plan.projectName),
          files: aiFiles.length ? aiFiles : template.defaultAiFiles,
          drivers: plan.platform === 'stm32' ? detectDrivers(requirement) : [],
        };
      }
    }
  } catch {
    // fall through to rule-based fallback
  }
  return fallbackPlan(requirement, platformHint);
}

function sanitizeName(name: string): string {
  const clean = name.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '');
  return clean || 'embedded-project';
}

/** 规则回退：关键词推断平台 + 默认文件清单 */
export function fallbackPlan(requirement: string, platformHint?: string): ProjectPlan {
  const text = requirement.toLowerCase();
  let platform: PlatformId = 'generic-c';
  if (platformHint && getPlatform(platformHint)) {
    platform = platformHint as PlatformId;
  } else if (/(micropython|upy\b)/.test(text)) {
    platform = 'micropython';
  } else if (/(zephyr)/.test(text)) {
    platform = 'zephyr';
  } else if (/(pico|rp2040|rp2350|raspberry\s*pi)/.test(text)) {
    platform = 'pico';
  } else if (/(atmega|attiny|\bavr\b|328p)/.test(text)) {
    platform = 'avr';
  } else if (/(esp32|esp-idf)/.test(text)) {
    platform = 'esp32';
  } else if (/(esp8266)/.test(text)) {
    platform = 'arduino';
  } else if (/(stm32|stm\d|hal)/.test(text)) {
    platform = 'stm32';
  } else if (/(arduino|uno|nano|platformio)/.test(text)) {
    platform = 'arduino';
  }

  const template = getPlatform(platform)!;
  return {
    projectName: sanitizeName(
      /(?:项目|工程)?[\u4e00-\u9fa5]/.test(requirement)
        ? 'embedded-project'
        : requirement.split(/\s+/)[0] || 'embedded-project',
    ),
    platform,
    target: '待确认（请在需求中指定芯片/开发板）',
    summary: requirement,
    modules: [requirement],
    pinout: [],
    files: [...template.defaultAiFiles],
    drivers: platform === 'stm32' ? detectDrivers(requirement) : [],
    buildSystem: defaultBuildSystem(platform),
  };
}

/** 平台对应的默认构建系统 */
export function defaultBuildSystem(platform: PlatformId): string {
  switch (platform) {
    case 'esp32':
    case 'pico':
    case 'zephyr':
      return 'cmake';
    case 'arduino':
      return 'platformio';
    case 'micropython':
      return 'none (interpreted)';
    default:
      return 'make';
  }
}
