#!/usr/bin/env node
import { Command } from 'commander';
import { runEmbedForge, SessionStore, loadAttachmentFromPath } from '../index.js';
import { PLATFORM_LIST } from '../core/templates.js';
import type { LlmConfig } from '../core/types.js';
import { startWebServer } from '../web/server.js';

const PROVIDER_PRESETS: Record<string, { baseURL: string; model: string }> = {
  deepseek: { baseURL: 'https://api.deepseek.com/v1', model: 'deepseek-chat' },
  openai: { baseURL: 'https://api.openai.com/v1', model: 'gpt-4o-mini' },
  openrouter: { baseURL: 'https://openrouter.ai/api/v1', model: 'openai/gpt-4o-mini' },
  ollama: { baseURL: 'http://localhost:11434/v1', model: 'qwen2.5:7b' },
};

/** commander 可重复选项收集器 */
function collect(value: string, previous: string[]): string[] {
  return previous.concat([value]);
}

const program = new Command();

program
  .name('embedforge')
  .description('嵌入式 AI 开发 Agent：描述需求，生成完整工程文件')
  .version('0.3.0');

program
  .command('generate')
  .description('根据需求生成嵌入式工程（可带附件、可续接会话）')
  .argument('<requirement>', '开发需求描述，例如 "STM32F103 读取 DHT11 温湿度，OLED 显示"')
  .option('-o, --out <dir>', '输出目录（默认 ./generated）')
  .option('-p, --platform <id>', '强制指定平台：stm32 | esp32 | arduino | pico | avr | micropython | zephyr | generic-c')
  .option('--provider <name>', `API 服务商预设：${Object.keys(PROVIDER_PRESETS).join(' | ')}（默认 deepseek）`)
  .option('--base-url <url>', 'OpenAI 兼容 API 端点（覆盖预设）')
  .option('--model <model>', '模型名（覆盖预设；图片识别需用多模态模型如 gpt-4o/qwen-vl）')
  .option('--api-key <key>', 'API Key（也可用环境变量 EMBEDFORGE_API_KEY）')
  .option('--attach <path>', '附件（数据手册/代码/原理图图片），可重复指定多次', collect, [])
  .option('--session <id>', '续接已有会话 id（保留上下文记忆）')
  .option('--skeleton-only', '不调用 LLM，仅生成平台骨架工程（离线可用）')
  .action(async (requirement: string, opts: Record<string, unknown>) => {
    try {
      const llm = resolveLlm(opts as Record<string, string>);
      const attachPaths = (opts.attach as string[]) ?? [];
      const attachments = attachPaths.map((p) => loadAttachmentFromPath(p));
      const { plan, result, skeletonOnly, session } = await runEmbedForge(requirement, llm, {
        outDir: (opts.out as string) ?? './generated',
        platform: (opts.platform as string) || undefined,
        skeletonOnly: Boolean(opts.skeletonOnly),
        attachments,
        sessionId: opts.session as string | undefined,
      });
      printResult(plan, result, skeletonOnly, session.id, attachments.length);
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
      console.log(`  ${p.id.padEnd(11)} ${p.name.padEnd(30)} ${p.description}`);
    }
  });

program
  .command('sessions')
  .description('列出本地保存的会话（上下文记忆）')
  .action(() => {
    const store = new SessionStore();
    const ids = store.list();
    if (!ids.length) {
      console.log('暂无本地会话。');
      return;
    }
    for (const id of ids) {
      const s = store.load(id);
      if (s) {
        console.log(`  ${id}　${s.turns.length} 轮　最近：${s.turns.at(-1)?.requirement ?? '-'}`);
      }
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
  sessionId: string,
  attachmentCount: number,
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
  if (attachmentCount) console.log(`  附件：已带入上下文 ${attachmentCount} 个`);
  console.log(`  文件：骨架 ${result.skeletonCount} 个，AI 生成 ${result.aiGeneratedCount} 个，耗时 ${result.elapsedMs}ms`);
  console.log(`  会话 id：${sessionId}（用 --session ${sessionId} 可在此工程上继续迭代）`);
  if (result.failedFiles.length) {
    console.log(`  警告：${result.failedFiles.length} 个文件生成失败`);
    for (const f of result.failedFiles) console.log(`    - ${f.path}: ${f.error ?? ''}`);
  }
}

program.parse();
