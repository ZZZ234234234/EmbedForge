import { resolve } from 'node:path';
import {
  SessionStore,
  buildMemoryBrief,
  buildTextContext,
  recordTurn,
} from './core/context.js';
import { generateProject } from './core/generator.js';
import { LlmClient, LlmError } from './core/llm.js';
import { defaultBuildSystem, planProject } from './core/planner.js';
import { PLATFORM_LIST, getPlatform } from './core/templates.js';
import type {
  Attachment,
  GenerateResult,
  LlmConfig,
  PlatformId,
  ProjectPlan,
  SessionMemory,
} from './core/types.js';
import { writeProject } from './core/writer.js';

export * from './core/types.js';
export { LlmClient, LlmError } from './core/llm.js';
export { planProject, fallbackPlan, defaultBuildSystem } from './core/planner.js';
export { generateProject, cleanCode } from './core/generator.js';
export { writeProject } from './core/writer.js';
export { PLATFORM_LIST, PLATFORM_TEMPLATES, getPlatform } from './core/templates.js';
export {
  SessionStore,
  loadAttachmentFromPath,
  attachmentFromContent,
  buildUserMessage,
  buildTextContext,
  buildMemoryBrief,
  recordTurn,
} from './core/context.js';

export interface GenerateOptions {
  /** 输出目录（相对当前工作目录） */
  outDir?: string;
  /** 强制指定平台（跳过 LLM 平台推断） */
  platform?: string;
  /** 关闭 LLM：仅生成骨架工程 */
  skeletonOnly?: boolean;
  /** 上传的附件（文本文件 / 图片） */
  attachments?: Attachment[];
  /** 续接已有会话 id（多轮记忆）；不传则新建会话 */
  sessionId?: string;
  /** 会话记忆存储目录 */
  sessionStoreDir?: string;
}

export interface RunResult {
  plan: ProjectPlan;
  result: GenerateResult;
  skeletonOnly: boolean;
  session: SessionMemory;
}

const DEFAULT_OUT_DIR = './generated';

/** EmbedForge 顶层入口：需求（+附件+记忆）→ 规划 → 生成 → 写入 */
export async function runEmbedForge(
  requirement: string,
  llm: LlmConfig,
  opts: GenerateOptions = {},
): Promise<RunResult> {
  const started = Date.now();
  const client = new LlmClient(llm);
  const attachments = opts.attachments ?? [];

  // 会话记忆：续接已有会话或新建
  const store = new SessionStore(opts.sessionStoreDir);
  let session = (opts.sessionId && store.load(opts.sessionId)) || store.create();
  const memoryBrief = buildMemoryBrief(session);
  // 代码生成阶段的额外上下文（文本附件 + 历史；图片只在规划阶段发送）
  const extraContext = buildTextContext(attachments) + memoryBrief;

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
      buildSystem: defaultBuildSystem(platform),
    };
  } else {
    plan = await planProject(client, requirement, opts.platform, {
      attachments,
      memoryBrief,
    });
  }

  const generated = await generateProject(client, plan, extraContext);
  const outDir = resolve(opts.outDir ?? DEFAULT_OUT_DIR);
  const written = writeProject(outDir, plan, generated.files);

  // 记录本轮到记忆并持久化
  recordTurn(session, requirement, plan, attachments.map((a) => a.name));
  session = store.save(session);

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
  return { plan, result, skeletonOnly: !!opts.skeletonOnly, session };
}

function sanitizeDirName(name: string): string {
  const clean = name.toLowerCase().replace(/[^a-z0-9一-龥-]+/g, '-').replace(/^-+|-+$/g, '');
  return clean || 'embedded-project';
}
