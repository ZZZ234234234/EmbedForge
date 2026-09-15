import type { LlmClient } from './llm.js';
import { getPlatform } from './templates.js';
import type { PlatformId, ProjectPlan } from './types.js';

const PLAN_SYSTEM_PROMPT = `你是一名资深嵌入式系统架构师。用户会给出一个嵌入式开发需求，你需要输出一份结构化的工程规划 JSON，用于驱动代码生成。

必须严格输出以下 JSON 结构（不要输出任何多余文字）：
{
  "projectName": "工程目录名（小写字母、数字、连字符，如 dht11-oled-monitor）",
  "platform": "stm32 | esp32 | arduino | generic-c（根据需求推断，无法推断时用 generic-c）",
  "target": "目标芯片/开发板型号，如 STM32F103C8T6、ESP32-DevKitC、Arduino Uno",
  "summary": "一句话项目简介",
  "modules": ["功能模块列表，如 DHT11 温湿度采集"],
  "pinout": [{"pin": "引脚名如 PA0", "signal": "信号名如 DHT11_DATA", "note": "可选说明"}],
  "files": ["需要生成的源代码文件相对路径，如 Core/Src/main.c、Core/Inc/main.h、src/app.c"],
  "buildSystem": "make | cmake | platformio"
}

要求：
1. files 中必须包含主程序文件（如 main.c / main.cpp）和必要的头文件，路径要与平台惯例一致（stm32 用 Core/Src、Core/Inc；esp32 用 main/；arduino 用 src/；generic-c 用 src/ 与 include/）。
2. 引脚分配要合理，常用外设接口（I2C/SPI/UART）给出典型引脚。
3. 如果需求没有提到具体平台，优先选 generic-c 或 arduino。`;

/** 用 LLM 解析需求为工程规划；失败时回退到规则推断 */
export async function planProject(
  client: LlmClient,
  requirement: string,
  platformHint?: string,
): Promise<ProjectPlan> {
  try {
    const plan = await client.chatJson<ProjectPlan>(
      [
        { role: 'system', content: PLAN_SYSTEM_PROMPT },
        { role: 'user', content: `开发需求：${requirement}` },
      ],
      { temperature: 0.2, maxTokens: 2000 },
    );
    if (plan && plan.projectName && plan.platform) {
      const template = getPlatform(plan.platform);
      if (template) {
        return {
          ...plan,
          projectName: sanitizeName(plan.projectName),
          files: plan.files?.length ? plan.files : template.defaultAiFiles,
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
  } else if (/(esp32|esp-idf)/.test(text)) {
    platform = 'esp32';
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
    buildSystem:
      platform === 'esp32' ? 'cmake' : platform === 'arduino' ? 'platformio' : 'make',
  };
}
