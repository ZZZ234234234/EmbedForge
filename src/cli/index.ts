#!/usr/bin/env node
import { Command } from 'commander';
import { runEmbedForge } from '../index.js';
import { PLATFORM_LIST } from '../core/templates.js';
import type { LlmConfig } from '../core/types.js';
import { startWebServer } from '../web/server.js';

const PROVIDER_PRESETS: Record<string, { baseURL: string; model: string }> = {
  deepseek: { baseURL: 'https://api.deepseek.com/v1', model: 'deepseek-chat' },
  openai: { baseURL: 'https://api.openai.com/v1', model: 'gpt-4o-mini' },
  openrouter: { baseURL: 'https://openrouter.ai/api/v1', model: 'openai/gpt-4o-mini' },
  ollama: { baseURL: 'http://localhost:11434/v1', model: 'qwen2.5:7b' },
};

const program = new Command();

program
  .name('embedforge')
  .description('嵌入式 AI 开发 Agent：描述需求，生成完整工程文件')
  .version('0.2.0');

program
  .command('generate')
  .description('根据需求生成嵌入式工程')
  .argument('<requirement>', '开发需求描述，例如 "STM32F103 读取 DHT11 温湿度，OLED 显示"')
  .option('-o, --out <dir>', '输出目录（默认 ./generated）')
  .option('-p, --platform <id>', '强制指定平台：stm32 | esp32 | arduino | pico | avr | micropython | zephyr | generic-c')
  .option('--provider <name>', `API 服务商预设：${Object.keys(PROVIDER_PRESETS).join(' | ')}（默认 deepseek）`)
  .option('--base-url <url>', 'OpenAI 兼容 API 端点（覆盖预设）')
  .option('--model <model>', '模型名（覆盖预设）')
  .option('--api-key <key>', 'API Key（也可用环境变量 EMBEDFORGE_API_KEY）')
  .option('--skeleton-only', '不调用 LLM，仅生成平台骨架工程（离线可用）')
  .action(async (requirement: string, opts: Record<string, string>) => {
    try {
      const llm = resolveLlm(opts);
      const { plan, result, skeletonOnly } = await runEmbedForge(requirement, llm, {
        outDir: opts.out ?? './generated',
        platform: opts.platform || undefined,
        skeletonOnly: Boolean(opts.skeletonOnly),
      });
      printResult(plan, result, skeletonOnly);
    } catch (err) {
      console.error(`\n✖ ${(err as Error).message}`);
      process.exitCode = 1;
    }
  });

program
  .command('platforms')
  .description('列出支持的嵌入式平台')
  .action(() => {
    console.log('支持的平台：');
    for (const p of PLATFORM_LIST) {
      console.log(`  ${p.id.padEnd(10)} ${p.name.padEnd(26)} ${p.description}`);
    }
  });

program
  .command('web')
  .description('启动本地 Web 界面')
  .option('--port <port>', '端口（默认 7788）')
  .option('--host <host>', '监听地址（默认 127.0.0.1）')
  .option('--base-url <url>', '默认 API 端点')
  .option('--model <model>', '默认模型')
  .option('--api-key <key>', '默认 API Key')
  .action((opts: Record<string, string>) => {
    const port = Number(opts.port ?? 7788);
    const { url } = startWebServer(
      { port, host: opts.host ?? '127.0.0.1' },
      {
        baseURL: opts.baseUrl ?? process.env.EMBEDFORGE_BASE_URL ?? 'http://localhost:11434/v1',
        model: opts.model ?? process.env.EMBEDFORGE_MODEL ?? 'qwen2.5:7b',
        apiKey: opts.apiKey ?? process.env.EMBEDFORGE_API_KEY,
      },
    );
    console.log(`EmbedForge Web UI 已启动：${url}（Ctrl+C 退出）`);
  });

function resolveLlm(opts: Record<string, string>): LlmConfig {
  const provider = opts.provider ?? process.env.EMBEDFORGE_PROVIDER ?? 'deepseek';
  const preset = PROVIDER_PRESETS[provider];
  if (!preset) throw new Error(`未知 provider: ${provider}（可用：${Object.keys(PROVIDER_PRESETS).join(', ')}）`);
  return {
    provider,
    baseURL: opts.baseUrl ?? process.env.EMBEDFORGE_BASE_URL ?? preset.baseURL,
    model: opts.model ?? process.env.EMBEDFORGE_MODEL ?? preset.model,
    apiKey: opts.apiKey ?? process.env.EMBEDFORGE_API_KEY ?? undefined,
  };
}

function printResult(
  plan: { projectName: string; platform: string; target: string; summary: string; pinout: { pin: string; signal: string }[]; modules: string[] },
  result: { outDir: string; skeletonCount: number; aiGeneratedCount: number; failedFiles: { path: string; error?: string }[]; elapsedMs: number },
  skeletonOnly: boolean,
): void {
  const mode = skeletonOnly ? '骨架模式（未调用 LLM）' : 'AI 完整生成';
  console.log(`\n✔ 工程已生成：${plan.projectName}（${mode}）`);
  console.log(`  平台：${plan.platform}　目标：${plan.target}`);
  if (plan.modules.length) console.log(`  模块：${plan.modules.join(' / ')}`);
  if (plan.pinout.length) {
    console.log('  引脚：');
    for (const p of plan.pinout) console.log(`    ${p.pin} → ${p.signal}`);
  }
  console.log(`  输出目录：${result.outDir}`);
  console.log(`  文件：骨架 ${result.skeletonCount} 个，AI 生成 ${result.aiGeneratedCount} 个，耗时 ${result.elapsedMs}ms`);
  if (result.failedFiles.length) {
    console.log(`  警告：${result.failedFiles.length} 个文件生成失败`);
    for (const f of result.failedFiles) console.log(`    - ${f.path}: ${f.error ?? ''}`);
  }
}

program.parse();
