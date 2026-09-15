import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import type { ContentPart } from './llm.js';
import type { Attachment, MemoryTurn, ProjectPlan, SessionMemory } from './types.js';

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

/** 记录一轮生成结果到记忆 */
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
  // 只保留最近 10 轮，避免上下文无限膨胀
  if (memory.turns.length > 10) memory.turns = memory.turns.slice(-10);
  for (const n of attachmentNames) {
    if (!memory.attachmentNames.includes(n)) memory.attachmentNames.push(n);
  }
  return memory;
}

/** 把历史记忆压缩为可注入 system prompt 的简短上下文 */
export function buildMemoryBrief(memory: SessionMemory | null): string {
  if (!memory || !memory.turns.length) return '';
  const lines = memory.turns.map(
    (t, i) =>
      `第 ${i + 1} 轮｜需求: ${t.requirement}｜工程: ${t.planSummary}｜文件: ${t.files.join(', ')}`,
  );
  const files = memory.attachmentNames.length
    ? `\n已上传参考资料: ${memory.attachmentNames.join(', ')}`
    : '';
  return `\n\n【同一会话的历史记录，用户的新指令是在这些工程基础上迭代，请保持工程名、平台与引脚约定一致，不要推翻已有设计，除非用户明确要求】\n${lines.join('\n')}${files}`;
}
