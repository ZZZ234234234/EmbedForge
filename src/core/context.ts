import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import type { ContentPart } from './llm.js';
import type {
  Attachment,
  GeneratedFileResult,
  MemoryTurn,
  ProjectPlan,
  SessionMemory,
} from './types.js';

/** 默认上下文窗口（token）。DeepSeek 等主流模型的常见长上下文规格 */
export const DEFAULT_CONTEXT_TOKENS = 128_000;
/** 记忆可使用上下文的比例，其余留给 system prompt、需求正文与模型输出 */
const MEMORY_BUDGET_RATIO = 0.45;

/** 可作为文本读取的扩展名 */
const TEXT_EXTS = new Set([
  '.txt', '.md', '.markdown', '.rst', '.log', '.csv',
  '.c', '.h', '.cpp', '.hpp', '.cc', '.cxx', '.s', '.S',
  '.py', '.ini', '.toml', '.cfg', '.conf', '.json', '.yaml', '.yml',
  '.cmake', '.mk', '.ioc', '.dts', '.dtsi', '.sh',
]);

/** 可作为图片（多模态）读取的扩展名 */
const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif']);

const IMAGE_MIME: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
};

/** 单个文本附件最大字节数（超出截断） */
const MAX_TEXT_BYTES = 256 * 1024;
/** 单个图片最大字节数 */
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export class AttachmentError extends Error {}

/** 从本地路径加载附件（CLI 使用） */
export function loadAttachmentFromPath(filePath: string): Attachment {
  if (!existsSync(filePath)) throw new AttachmentError(`附件不存在: ${filePath}`);
  const ext = extname(filePath).toLowerCase();
  const name = filePath.split(/[\\/]/).pop() ?? filePath;
  const buf = readFileSync(filePath);

  if (IMAGE_EXTS.has(ext)) {
    if (buf.length > MAX_IMAGE_BYTES) {
      throw new AttachmentError(`图片 ${name} 超过 5MB 限制`);
    }
    const mime = IMAGE_MIME[ext] ?? 'image/png';
    return {
      name,
      kind: 'image',
      size: buf.length,
      dataUrl: `data:${mime};base64,${buf.toString('base64')}`,
    };
  }

  if (TEXT_EXTS.has(ext) || ext === '') {
    const truncated = buf.subarray(0, MAX_TEXT_BYTES);
    const text = truncated.toString('utf8');
    return {
      name,
      kind: 'text',
      size: buf.length,
      text: buf.length > MAX_TEXT_BYTES ? text + '\n…（附件过长，已截断）' : text,
    };
  }

  throw new AttachmentError(
    `不支持的附件类型: ${ext || '(无扩展名)'}（支持文本/代码文件与 png/jpg/webp/gif 图片）`,
  );
}

/** 从 Web 上传内容构造图片/文本附件 */
export function attachmentFromContent(
  name: string,
  content: string,
  /** 图片为 data URL；文本为原始内容 */
  kind: 'text' | 'image',
): Attachment {
  if (kind === 'image') {
    return { name, kind: 'image', dataUrl: content, size: content.length };
  }
  return { name, kind: 'text', text: content, size: content.length };
}

/** 把文本类附件拼成可注入 prompt 的上下文块 */
export function buildTextContext(attachments: Attachment[]): string {
  const texts = attachments.filter((a) => a.kind === 'text' && a.text);
  if (!texts.length) return '';
  const blocks = texts.map(
    (a) => `### 附件：${a.name}\n\`\`\`\n${a.text}\n\`\`\``,
  );
  return `\n\n【用户上传的参考资料，生成代码时必须结合其中的引脚、寄存器、协议等约束】\n${blocks.join('\n\n')}`;
}

/** 把图片附件转为多模态 content parts */
export function buildImageParts(attachments: Attachment[]): ContentPart[] {
  return attachments
    .filter((a) => a.kind === 'image' && a.dataUrl)
    .map((a) => ({
      type: 'image_url' as const,
      image_url: { url: a.dataUrl!, detail: 'high' as const },
    }));
}

/** 构造一条多模态用户消息（需求文本 + 文本附件 + 图片） */
export function buildUserMessage(
  requirement: string,
  attachments: Attachment[],
): { role: 'user'; content: string | ContentPart[] } {
  const textContext = buildTextContext(attachments);
  const imageParts = buildImageParts(attachments);
  const text = `开发需求：${requirement}${textContext}`;
  if (!imageParts.length) return { role: 'user', content: text };
  return { role: 'user', content: [{ type: 'text', text }, ...imageParts] };
}

/* ================= 会话记忆（本地持久化） ================= */

export class SessionStore {
  constructor(private readonly rootDir = join(process.cwd(), '.embedforge', 'sessions')) {
    mkdirSync(this.rootDir, { recursive: true });
  }

  private pathFor(id: string): string {
    return join(this.rootDir, `${id}.json`);
  }

  create(): SessionMemory {
    const now = new Date().toISOString();
    const id = `s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
    return { id, createdAt: now, updatedAt: now, turns: [], attachmentNames: [] };
  }

  load(id: string): SessionMemory | null {
    const p = this.pathFor(id);
    if (!existsSync(p)) return null;
    return JSON.parse(readFileSync(p, 'utf8')) as SessionMemory;
  }

  save(memory: SessionMemory): SessionMemory {
    memory.updatedAt = new Date().toISOString();
    writeFileSync(this.pathFor(memory.id), JSON.stringify(memory, null, 2), 'utf8');
    return memory;
  }

  list(): string[] {
    if (!existsSync(this.rootDir)) return [];
    return readdirSync(this.rootDir)
      .filter((f) => f.endsWith('.json'))
      .map((f) => f.replace(/\.json$/, ''));
  }
}

/** 记录一轮生成结果到记忆（不按轮数裁剪，轮数上限由 buildMemoryBrief 按 token 预算决定） */
export function recordTurn(
  memory: SessionMemory,
  requirement: string,
  plan: ProjectPlan,
  attachmentNames: string[],
): SessionMemory {
  const turn: MemoryTurn = {
    requirement,
    planSummary: `${plan.projectName} / ${plan.platform} / ${plan.target} / 模块: ${plan.modules.join('、')}`,
    files: plan.files,
    at: new Date().toISOString(),
  };
  memory.turns.push(turn);
  for (const n of attachmentNames) {
    if (!memory.attachmentNames.includes(n)) memory.attachmentNames.push(n);
  }
  return memory;
}

/** 把本轮写入的源码存为快照（覆盖上一份，不累积） */
export function recordCodeSnapshot(
  memory: SessionMemory,
  files: GeneratedFileResult[],
  budgetBytes: number,
): SessionMemory {
  const candidates = files
    .filter((f) => f.status === 'ok' && f.content && isSourceFile(f.path))
    .sort((a, b) => a.path.localeCompare(b.path));

  const kept: { path: string; content: string }[] = [];
  let used = 0;
  let omitted = 0;
  for (const f of candidates) {
    const content = f.content ?? '';
    if (used + content.length > budgetBytes) {
      omitted++;
      continue;
    }
    used += content.length;
    kept.push({ path: f.path, content });
  }

  memory.codeSnapshot = {
    at: new Date().toISOString(),
    files: kept,
    omitted,
  };
  return memory;
}

/** 参与快照的源码后缀（厂商库与构建产物不进快照，否则会把预算吃光） */
const SNAPSHOT_EXTS = ['.c', '.h', '.cpp', '.hpp', '.py', '.ino'];

function isSourceFile(path: string): boolean {
  if (/^(Drivers|Libraries|managed_components|\.pio)\//i.test(path)) return false;
  return SNAPSHOT_EXTS.some((ext) => path.toLowerCase().endsWith(ext));
}

/**
 * 粗略估算 token 数。
 * 中文按 1 字 ≈ 1 token，英文按 4 字符 ≈ 1 token，取偏保守的估计，
 * 宁可少放内容也不要超出模型窗口。
 */
export function estimateTokens(text: string): number {
  let cjk = 0;
  let other = 0;
  for (const ch of text) {
    if (ch.charCodeAt(0) > 0x2e7f) cjk++;
    else other++;
  }
  return Math.ceil(cjk + other / 3.5);
}

/** 把历史记忆压缩为可注入 system prompt 的上下文（按 token 预算，而非固定轮数） */
export function buildMemoryBrief(
  memory: SessionMemory | null,
  opts: { contextTokens?: number; reserveRatio?: number } = {},
): string {
  if (!memory || !memory.turns.length) return '';

  const total = opts.contextTokens && opts.contextTokens > 0 ? opts.contextTokens : DEFAULT_CONTEXT_TOKENS;
  // 给 system prompt、需求正文、模型输出留出空间，记忆只占其中一部分
  const budget = Math.max(1000, Math.floor(total * (opts.reserveRatio ?? MEMORY_BUDGET_RATIO)));

  const header =
    '\n\n【同一会话的历史记录，用户的新指令是在这些工程基础上迭代，请保持工程名、平台与引脚约定一致，不要推翻已有设计，除非用户明确要求】';

  const render = (t: MemoryTurn, i: number): string =>
    `第 ${i + 1} 轮｜需求: ${t.requirement}｜工程: ${t.planSummary}｜文件: ${t.files.join(', ')}`;

  // 从最新一轮往前取，直到用完预算；保证最新一轮始终在内
  const picked: string[] = [];
  let used = estimateTokens(header);
  for (let i = memory.turns.length - 1; i >= 0; i--) {
    const line = render(memory.turns[i], i);
    const cost = estimateTokens(line) + 1;
    if (picked.length > 0 && used + cost > budget) break;
    picked.unshift(line);
    used += cost;
  }

  const omittedTurns = memory.turns.length - picked.length;
  const parts: string[] = [header];
  if (omittedTurns > 0) {
    // 说明截断事实，避免模型误以为会话刚开始
    parts.push(`（较早的 ${omittedTurns} 轮因上下文预算已省略，如需细节请要求用户重述）`);
  }
  parts.push(picked.join('\n'));

  if (memory.attachmentNames.length) {
    parts.push(`已上传参考资料: ${memory.attachmentNames.join(', ')}`);
  }

  // 最近一次的源码：多轮迭代时必须能看到上一版实现，否则只能凭规划摘要猜
  const snap = memory.codeSnapshot;
  if (snap && snap.files.length) {
    const snapTokens = estimateTokens(snap.files.map((f) => f.content).join(''));
    if (used + snapTokens <= budget) {
      const blocks = snap.files.map((f) => `### ${f.path}\n\`\`\`\n${f.content}\n\`\`\``);
      parts.push(
        `\n【上一轮生成的源码快照（${snap.at}）。迭代时请在此基础上修改，不要凭记忆重写】` +
          (snap.omitted > 0 ? `\n（另有 ${snap.omitted} 个文件因体积省略）` : '') +
          `\n${blocks.join('\n\n')}`,
      );
    } else {
      parts.push(
        `\n【上一轮生成的源码快照因体积超出上下文预算未载入，文件清单：】\n${snap.files.map((f) => `- ${f.path}`).join('\n')}`,
      );
    }
  }

  return parts.join('\n');
}
