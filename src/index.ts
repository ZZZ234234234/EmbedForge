import { resolve } from 'node:path';
import { exec } from 'node:child_process';
import {
  SessionStore,
  buildMemoryBrief,
  buildTextContext,
  recordTurn,
} from './core/context.js';
import { generateProject } from './core/generator.js';
import { LlmClient, LlmError } from './core/llm.js';
import { defaultBuildSystem, planProject } from './core/planner.js';
import { reviewGeneratedProject } from './core/reviewer.js';
import {
  buildSkillsContext,
  installSkill,
  loadAllSkills,
  matchSkills,
  parseSkill,
  userSkillsDir,
} from './core/skills.js';
import { PLATFORM_LIST, detectDrivers, getPlatform } from './core/templates.js';
import type {
  AgentRunResult,
  Attachment,
  GenerateResult,
  LlmConfig,
  PlatformId,
  ProjectPlan,
  ReviewResult,
  SessionMemory,
} from './core/types.js';
import type { Skill } from './core/skills.js';
import { writeProject } from './core/writer.js';
import { runAgentTask } from './core/agent.js';

export * from './core/types.js';
export { LlmClient, LlmError } from './core/llm.js';
export { planProject, fallbackPlan, defaultBuildSystem } from './core/planner.js';
export { generateProject, cleanCode } from './core/generator.js';
export { writeProject } from './core/writer.js';
export { reviewGeneratedProject } from './core/reviewer.js';
export {
  runAgentTask,
  ProjectTools,
  safeJoin,
  AgentError,
} from './core/agent.js';
export {
  loadAllSkills,
  matchSkills,
  buildSkillsContext,
  installSkill,
  parseSkill,
  userSkillsDir,
} from './core/skills.js';
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
  /** 构建系统：make / cmake / keil / platformio（默认 make，仅 STM32 支持全部四种） */
  buildSystem?: string;
  /** 关闭 LLM：仅生成骨架工程 */
  skeletonOnly?: boolean;
  /** 上传的附件（文本文件 / 图片） */
  attachments?: Attachment[];
  /** 续接已有会话 id（多轮记忆）；不传则新建会话 */
  sessionId?: string;
  /** 会话记忆存储目录 */
  sessionStoreDir?: string;
  /** 技能白名单：仅使用这些技能（按 name）；不传则按需求自动匹配全部内置技能 */
  skills?: string[];
  /** 禁用所有技能（小项目省 token，不传则默认启用自动匹配） */
  noSkills?: boolean;
  /** 关闭资深工程师代码审查（默认开启） */
  noReview?: boolean;
}

export interface RunResult {
  plan: ProjectPlan;
  result: GenerateResult;
  skeletonOnly: boolean;
  session: SessionMemory;
  /** 本次注入的专家技能 */
  skillsUsed: Skill[];
  /** 代码审查结果（未启用或失败时为 null） */
  review: ReviewResult | null;
  /** 工程输出目录绝对路径 */
  outDir: string;
}

const DEFAULT_OUT_DIR = './generated';

/** EmbedForge 顶层入口：需求（+附件+记忆+技能）→ 规划 → 生成 → 审查 → 写入 */
export async function runEmbedForge(
  requirement: string,
  llm: LlmConfig,
  opts: GenerateOptions = {},
): Promise<RunResult> {
  const started = Date.now();
  const client = new LlmClient(llm);
  const attachments = opts.attachments ?? [];
  const noSkills = !!opts.noSkills;
  const skillWhitelist = opts.skills ?? [];

  // 会话记忆：续接已有会话或新建
  const store = new SessionStore(opts.sessionStoreDir);
  let session = (opts.sessionId && store.load(opts.sessionId)) || store.create();
  const memoryBrief = buildMemoryBrief(session);
  // 代码生成阶段的额外上下文（文本附件 + 历史；图片只在规划阶段发送）
  const extraContext = buildTextContext(attachments) + memoryBrief;

  const allSkills = loadAllSkills();
  // 技能池过滤：noSkills 清空；白名单则只保留指定技能
  const availableSkills = noSkills
    ? []
    : skillWhitelist.length
      ? allSkills.filter((s) => skillWhitelist.includes(s.name))
      : allSkills;
  const skeletonOnly = !!opts.skeletonOnly;
  const preMatched = skeletonOnly ? [] : matchSkills(requirement, availableSkills, { forceSkills: [] });

  let plan: ProjectPlan;
  if (skeletonOnly) {
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
      drivers: platform === 'stm32' ? detectDrivers(requirement) : [],
      buildSystem: defaultBuildSystem(platform),
    };
  } else {
    plan = await planProject(client, requirement, opts.platform, {
      attachments,
      memoryBrief,
      skillsBrief: buildSkillsContext(preMatched),
    });
  }

  // 规划后再匹配一次（modules/pinout 信息更充分），强制注入的技能始终生效
  const planText = `${plan.summary} ${plan.modules.join(' ')} ${plan.platform}`;
  const matchedSkills = skeletonOnly
    ? []
    : matchSkills(requirement, availableSkills, { planText, forceSkills: [] });
  const skillsContext = buildSkillsContext(matchedSkills);

  // 用户指定构建系统则覆盖（make / cmake / keil / platformio）
  if (opts.buildSystem) plan.buildSystem = opts.buildSystem;

  const generated = await generateProject(client, plan, extraContext, skillsContext);

  // 资深工程师代码审查：发现问题自动回写修复
  let review: ReviewResult | null = null;
  if (!skeletonOnly && !opts.noReview) {
    review = await reviewGeneratedProject(client, plan, generated.files, buildTextContext(attachments));
    if (review?.fixedFiles.length) {
      for (const fixed of review.fixedFiles) {
        const target = generated.files.find((f) => f.path === fixed.path && f.status === 'ok');
        if (target) target.content = fixed.content;
      }
    }
  }

  const outDir = resolve(opts.outDir ?? DEFAULT_OUT_DIR);
  const written = writeProject(outDir, plan, generated.files, review);

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
    review,
  };
  return { plan, result, skeletonOnly, session, skillsUsed: matchedSkills, review, outDir };
}

function sanitizeDirName(name: string): string {
  const clean = name.toLowerCase().replace(/[^a-z0-9一-龥-]+/g, '-').replace(/^-+|-+$/g, '');
  return clean || 'embedded-project';
}

/**
 * 跨平台打开文件夹（Windows 资源管理器 / macOS Finder / Linux xdg-open）。
 * 失败时静默忽略（无头环境/CI 不影响主流程）。
 */
export function openFolder(dir: string): void {
  try {
    const cmd =
      process.platform === 'win32'
        ? `explorer "${dir}"`
        : process.platform === 'darwin'
          ? `open "${dir}"`
          : `xdg-open "${dir}"`;
    exec(cmd, () => { /* 忽略结果 */ });
  } catch {
    /* 忽略 */
  }
}
