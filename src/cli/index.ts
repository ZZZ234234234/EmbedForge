#!/usr/bin/env node
import { Command } from 'commander';
import {
  runEmbedForge,
  runAgentTask,
  SessionStore,
  loadAttachmentFromPath,
  loadAllSkills,
  installSkill,
  userSkillsDir,
  openFolder,
} from '../index.js';
import { LlmClient } from '../core/llm.js';
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
  .description('嵌入式 AI 开发 Agent：描述需求，生成完整工程文件；支持技能知识库与 Agent 文件工具')
  .version('0.8.0');

program
  .command('generate')
  .description('根据需求生成嵌入式工程（可带附件、可续接会话，AI 生成后自动做资深工程师审查）')
  .argument('<requirement>', '开发需求描述，例如 "STM32F103 读取 DHT11 温湿度，OLED 显示"')
  .option('-o, --out <dir>', '输出目录（默认 ./generated）')
  .option('-p, --platform <id>', '强制指定平台：stm32 | esp32 | arduino | pico | avr | micropython | zephyr | generic-c')
    .option('--build-system <name>', '构建系统：make | cmake | keil | platformio（默认 make，仅 STM32 支持全部四种）')
.option('--provider <name>', `API 服务商预设：${Object.keys(PROVIDER_PRESETS).join(' | ')}（默认 deepseek）`)
  .option('--base-url <url>', 'OpenAI 兼容 API 端点（覆盖预设）')
  .option('--model <model>', '模型名（覆盖预设；图片识别需用多模态模型如 gpt-4o/qwen-vl）')
  .option('--api-key <key>', 'API Key（也可用环境变量 EMBEDFORGE_API_KEY）')
  .option('--attach <path>', '附件（数据手册/代码/原理图图片），可重复指定多次', collect, [])
  .option('--session <id>', '续接已有会话 id（保留上下文记忆）')
  .option('--skill <name>', '技能白名单（仅使用这些技能），可重复指定；不传则自动匹配全部', collect, [])
  .option('--no-skills', '禁用所有专家技能（小项目省 token）')
  .option('--no-review', '跳过生成后的 AI 代码审查（默认开启审查并自动修复问题）')
  .option('--skeleton-only', '不调用 LLM，仅生成平台骨架工程（离线可用）')
  .action(async (requirement: string, opts: Record<string, unknown>) => {
    try {
      const llm = resolveLlm(opts as Record<string, string>);
      const attachPaths = (opts.attach as string[]) ?? [];
      const attachments = attachPaths.map((p) => loadAttachmentFromPath(p));
      const { plan, result, skeletonOnly, session, skillsUsed, review, outDir } = await runEmbedForge(
        requirement,
        llm,
        {
          outDir: (opts.out as string) ?? './generated',
          platform: (opts.platform as string) || undefined,
                    buildSystem: (opts.buildSystem as string) || undefined,
skeletonOnly: Boolean(opts.skeletonOnly),
          attachments,
          sessionId: opts.session as string | undefined,
          skills: (opts.skill as string[]) ?? [],
          noSkills: Boolean(opts.noSkills),
          noReview: Boolean(opts.noReview),
        },
      );
      printResult(plan, result, skeletonOnly, session.id, attachments.length, skillsUsed, review);
      openFolder(outDir);
    } catch (err) {
      console.error(`\n✖ ${(err as Error).message}`);
      process.exitCode = 1;
    }
  });

program
  .command('agent')
  .description('Agent 模式：让 AI 直接在已有工程目录里干活（浏览/读文件/改文件，可迭代修改现有项目）')
  .argument('<task>', '任务描述，例如 "阅读这个工程，把 LED 改成 PWM 呼吸灯并补上按键长按调节亮度"')
  .option('-d, --dir <path>', '工程目录（默认当前目录）', '.')
  .option('--allow-shell', '允许执行 shell 命令（如 make/pio run 编译验证）', false)
  .option('--max-steps <n>', '最大工具调用轮数（默认 24）')
  .option('--skill <name>', '强制注入的技能，可重复指定多次', collect, [])
  .option('--provider <name>', `API 服务商预设：${Object.keys(PROVIDER_PRESETS).join(' | ')}（默认 deepseek）`)
  .option('--base-url <url>', 'OpenAI 兼容 API 端点（覆盖预设）')
  .option('--model <model>', '模型名（需支持 function calling，如 deepseek-chat、gpt-4o）')
  .option('--api-key <key>', 'API Key（也可用环境变量 EMBEDFORGE_API_KEY）')
  .action(async (task: string, opts: Record<string, unknown>) => {
    try {
      const llmConfig = resolveLlm(opts as Record<string, string>);
      const maxSteps = opts.maxSteps ? Number(opts.maxSteps) : undefined;
      console.log(`\n⚙ Agent 启动：${llmConfig.model} @ ${llmConfig.baseURL}`);
      console.log(`  工程目录：${opts.dir}${opts.allowShell ? '（允许 shell 命令）' : ''}\n`);
      const result = await runAgentTask(new LlmClient(llmConfig), task, opts.dir as string, {
        allowShell: Boolean(opts.allowShell),
        maxSteps,
        skills: loadAllSkills(),
        forceSkills: (opts.skill as string[]) ?? [],
      });
      console.log(`\n✔ Agent 完成（${result.steps.length} 次工具调用，耗时 ${result.elapsedMs}ms）`);
      if (result.filesChanged.length) {
        console.log('  修改的文件：');
        for (const f of result.filesChanged) console.log(`    - ${f}`);
      }
      console.log(`\n${result.report}`);
      if (result.truncated) {
        console.log('\n⚠ 已达最大步数，任务未完全结束，可再次运行继续。');
        process.exitCode = 2;
      }
    } catch (err) {
      console.error(`\n✖ ${(err as Error).message}`);
      process.exitCode = 1;
    }
  });

const skillsCmd = program
  .command('skills')
  .description('管理技能知识库（内置专家知识 + 用户自定义技能）');

skillsCmd
  .command('list')
  .alias('ls')
  .description('列出全部可用技能')
  .action(() => {
    const skills = loadAllSkills();
    if (!skills.length) {
      console.log('暂无技能。');
      return;
    }
    console.log(`共 ${skills.length} 个技能（内置 ${skills.filter((s) => s.source === 'builtin').length} / 用户 ${skills.filter((s) => s.source === 'user').length}）：\n`);
    for (const s of skills) {
      console.log(`  ${s.name.padEnd(26)} [${s.source === 'user' ? '用户' : '内置'}] ${s.description}`);
      console.log(`  ${''.padEnd(26)}   触发词：${s.triggers.join(', ')}`);
    }
    console.log(`\n用户技能目录：${userSkillsDir()}（放入 .md 文件即可，用 skills add 安装）`);
  });

skillsCmd
  .command('show')
  .description('查看技能内容')
  .argument('<name>', '技能名')
  .action((name: string) => {
    const skill = loadAllSkills().find((s) => s.name.toLowerCase() === name.toLowerCase());
    if (!skill) {
      console.error(`未找到技能: ${name}（用 embedforge skills list 查看全部）`);
      process.exitCode = 1;
      return;
    }
    console.log(`# ${skill.name}  [${skill.source === 'user' ? '用户' : '内置'}]`);
    console.log(`${skill.description}\n触发词：${skill.triggers.join(', ')}\n`);
    console.log(skill.content);
  });

skillsCmd
  .command('add')
  .description('安装自定义技能（.md 文件，带 name/description/triggers front-matter）')
  .argument('<file>', 'Markdown 技能文件路径')
  .action((file: string) => {
    try {
      const { name, dir } = installSkill(file);
      console.log(`✔ 技能已安装：${name}\n  位置：${dir}\n  之后 generate/agent 会按触发词自动匹配，也可 --skill ${name} 强制注入`);
    } catch (err) {
      console.error(`✖ ${(err as Error).message}`);
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
  result: { outDir: string; skeletonCount: number; aiGeneratedCount: number; failedFiles: { path: string; error?: string }[]; elapsedMs: number; review?: { issues: { file: string; severity: string; description: string }[]; fixedFiles: unknown[] } | null },
  skeletonOnly: boolean,
  sessionId: string,
  attachmentCount: number,
  skillsUsed: { name: string }[],
  review: { issues: { file: string; severity: string; description: string }[]; fixedFiles: unknown[] } | null,
): void {
  const mode = skeletonOnly ? '骨架模式（未调用 LLM）' : 'AI 完整生成';
  console.log(`\n✔ 工程已生成：${plan.projectName}（${mode}）`);
  console.log(`  平台：${plan.platform}　目标：${plan.target}`);
  if (plan.modules.length) console.log(`  模块：${plan.modules.join(' / ')}`);
  if (plan.pinout.length) {
    console.log('  引脚：');
    for (const p of plan.pinout) console.log(`    ${p.pin} → ${p.signal}`);
  }
  if (skillsUsed.length) console.log(`  技能：${skillsUsed.map((s) => s.name).join(', ')}`);
  console.log(`  输出目录：${result.outDir}`);
  if (attachmentCount) console.log(`  附件：已带入上下文 ${attachmentCount} 个`);
  console.log(`  文件：骨架 ${result.skeletonCount} 个，AI 生成 ${result.aiGeneratedCount} 个，耗时 ${result.elapsedMs}ms`);
  if (review) {
    const high = review.issues.filter((i) => i.severity === 'high').length;
    const medium = review.issues.filter((i) => i.severity === 'medium').length;
    const low = review.issues.filter((i) => i.severity === 'low').length;
    console.log(`  审查：发现 ${review.issues.length} 个问题（高 ${high} / 中 ${medium} / 低 ${low}），已自动修复 ${review.fixedFiles.length} 个文件`);
    for (const i of review.issues.filter((x) => x.severity !== 'low').slice(0, 5)) {
      console.log(`    [${i.severity}] ${i.file}: ${i.description.slice(0, 80)}`);
    }
    if (review.issues.length > 5) console.log('    …');
  }
  console.log(`  会话 id：${sessionId}（用 --session ${sessionId} 可在此工程上继续迭代）`);
  if (result.failedFiles.length) {
    console.log(`  警告：${result.failedFiles.length} 个文件生成失败`);
    for (const f of result.failedFiles) console.log(`    - ${f.path}: ${f.error ?? ''}`);
  }
}

program.parse();
