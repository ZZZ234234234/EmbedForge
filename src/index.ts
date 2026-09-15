import { resolve } from 'node:path';
import { generateProject } from './core/generator.js';
import { LlmClient, LlmError } from './core/llm.js';
import { planProject } from './core/planner.js';
import { PLATFORM_LIST, getPlatform } from './core/templates.js';
import type { GenerateResult, LlmConfig, PlatformId, ProjectPlan } from './core/types.js';
import { writeProject } from './core/writer.js';

export * from './core/types.js';
export { LlmClient, LlmError } from './core/llm.js';
export { planProject, fallbackPlan } from './core/planner.js';
export { generateProject, cleanCode } from './core/generator.js';
export { writeProject } from './core/writer.js';
export { PLATFORM_LIST, PLATFORM_TEMPLATES, getPlatform } from './core/templates.js';

export interface GenerateOptions {
  /** 输出目录（相对当前工作目录） */
  outDir?: string;
  /** 强制指定平台（跳过 LLM 平台推断） */
  platform?: string;
  /** 关闭 LLM：仅生成骨架工程 */
  skeletonOnly?: boolean;
}

export interface RunResult {
  plan: ProjectPlan;
  result: GenerateResult;
  skeletonOnly: boolean;
}

const DEFAULT_OUT_DIR = './generated';

/** EmbedForge 顶层入口：需求 → 规划 → 生成 → 写入 */
export async function runEmbedForge(
  requirement: string,
  llm: LlmConfig,
  opts: GenerateOptions = {},
): Promise<RunResult> {
  const started = Date.now();
  const client = new LlmClient(llm);

  let plan: ProjectPlan;
  if (opts.skeletonOnly) {
    const platform = (opts.platform ?? 'generic-c') as PlatformId;
    if (!getPlatform(platform)) throw new Error(`不支持的平台: ${platform}`);
    plan = {
      projectName: sanitizeDirName(requirement),
      platform,
      target: '未指定',
      summary: requirement,
      modules: [],
      pinout: [],
      files: [],
      buildSystem:
        platform === 'esp32' ? 'cmake' : platform === 'arduino' ? 'platformio' : 'make',
    };
  } else {
    plan = await planProject(client, requirement, opts.platform);
  }

  const generated = await generateProject(client, plan);
  const outDir = resolve(opts.outDir ?? DEFAULT_OUT_DIR);
  const written = writeProject(outDir, plan, generated.files);

  const failedFiles = generated.files.filter((f) => f.status === 'error');
  const result: GenerateResult = {
    projectName: plan.projectName,
    platform: plan.platform,
    target: plan.target,
    outDir: written.outDir,
    files: generated.files,
    skeletonCount: generated.skeletonCount,
    aiGeneratedCount: generated.aiGeneratedCount,
    failedFiles,
    elapsedMs: Date.now() - started,
  };
  return { plan, result, skeletonOnly: !!opts.skeletonOnly };
}

function sanitizeDirName(name: string): string {
  const clean = name.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5-]+/g, '-').replace(/^-+|-+$/g, '');
  return clean || 'embedded-project';
}
