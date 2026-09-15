import { existsSync, mkdirSync, copyFileSync, readFileSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

/** 一个技能：资深嵌入式工程师的领域知识模块（Markdown + front-matter） */
export interface Skill {
  /** 唯一标识（front-matter name 或文件名） */
  name: string;
  /** 一句话描述 */
  description: string;
  /** 触发关键词（与需求/规划做匹配，小写） */
  triggers: string[];
  /** Markdown 正文（注入 prompt 的知识内容） */
  content: string;
  /** 来源：随包内置 / 用户自定义 */
  source: 'builtin' | 'user';
  /** 磁盘路径 */
  filePath?: string;
}

/** 内置技能目录（dist/core → 工程根 skills/；npm 包同理） */
const BUILTIN_SKILLS_DIR = fileURLToPath(new URL('../../skills/', import.meta.url));

/** 用户自定义技能目录（~/.embedforge/skills） */
export function userSkillsDir(): string {
  return join(homedir(), '.embedforge', 'skills');
}

/**
 * 解析技能 Markdown：front-matter（--- 包裹的 name/description/triggers）+ 正文。
 * front-matter 缺失时用文件名与首行兜底，保证随手丢进来的 md 也能当技能用。
 */
export function parseSkill(raw: string, source: Skill['source'], filePath: string): Skill {
  const fallbackName = filePath.split(/[\\/]/).pop()!.replace(/\.md$/i, '');
  const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!fm) {
    const firstLine = raw.split(/\r?\n/).find((l) => l.trim().startsWith('#'))
      ?? raw.split(/\r?\n/).find((l) => l.trim()) ?? fallbackName;
    return {
      name: fallbackName,
      description: firstLine.replace(/^#+\s*/, '').trim().slice(0, 80),
      triggers: [fallbackName.toLowerCase()],
      content: raw.trim(),
      source,
      filePath,
    };
  }
  const meta: Record<string, string> = {};
  for (const line of fm[1].split(/\r?\n/)) {
    const m = line.match(/^(\w[\w-]*)\s*:\s*(.*)$/);
    if (m) meta[m[1].toLowerCase()] = m[2].trim();
  }
  const triggers = (meta.triggers ?? '')
    .split(/[,，;；]/)
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
  return {
    name: meta.name || fallbackName,
    description: meta.description || '',
    triggers: triggers.length ? triggers : [fallbackName.toLowerCase()],
    content: raw.slice(fm[0].length).trim(),
    source,
    filePath,
  };
}

function loadSkillsFromDir(dir: string, source: Skill['source']): Skill[] {
  if (!existsSync(dir)) return [];
  const skills: Skill[] = [];
  for (const f of readdirSync(dir)) {
    if (!f.toLowerCase().endsWith('.md')) continue;
    const filePath = join(dir, f);
    try {
      skills.push(parseSkill(readFileSync(filePath, 'utf8'), source, filePath));
    } catch {
      // 单个技能文件损坏不影响其余技能
    }
  }
  return skills;
}

/** 加载全部技能：内置 + 用户自定义（同名时用户技能优先） */
export function loadAllSkills(builtinDir = BUILTIN_SKILLS_DIR, userDir = userSkillsDir()): Skill[] {
  const builtin = loadSkillsFromDir(builtinDir, 'builtin');
  const user = loadSkillsFromDir(userDir, 'user');
  const seen = new Set(user.map((s) => s.name));
  return [...user, ...builtin.filter((s) => !seen.has(s.name))];
}

/**
 * 按需求/规划匹配技能：统计触发词命中数，返回命中最多的前 limit 个。
 * forceSkills 中的技能无论是否命中都强制带上。
 */
export function matchSkills(
  requirement: string,
  skills: Skill[],
  opts: { planText?: string; limit?: number; forceSkills?: string[] } = {},
): Skill[] {
  const haystack = `${requirement} ${opts.planText ?? ''}`.toLowerCase();
  const scored = skills
    .map((s) => ({
      skill: s,
      score: s.triggers.reduce((n, t) => n + (t && haystack.includes(t) ? 1 : 0), 0),
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, opts.limit ?? 4)
    .map((x) => x.skill);

  const picked = [...scored];
  for (const name of opts.forceSkills ?? []) {
    const target = name.toLowerCase();
    const hit = skills.find((s) => s.name.toLowerCase() === target);
    if (hit && !picked.includes(hit)) picked.push(hit);
  }
  return picked;
}

/** 把匹配到的技能拼成可注入 system prompt 的知识块 */
export function buildSkillsContext(matched: Skill[]): string {
  if (!matched.length) return '';
  const blocks = matched.map(
    (s) => `### 技能：${s.name}（${s.source === 'user' ? '用户自定义' : '内置'}）\n${s.content}`,
  );
  return `\n\n【专业知识模块 · 生成代码时必须遵循其中的时序参数、电气约束与代码规范；与默认假设冲突时以本模块为准】\n${blocks.join('\n\n')}`;
}

/** 安装技能：把一个 .md 文件复制到用户技能目录 */
export function installSkill(srcPath: string, userDir = userSkillsDir()): { name: string; dir: string } {
  if (!srcPath.toLowerCase().endsWith('.md')) {
    throw new Error(`技能文件必须是 .md 格式: ${srcPath}`);
  }
  if (!existsSync(srcPath)) throw new Error(`文件不存在: ${srcPath}`);
  mkdirSync(userDir, { recursive: true });
  const name = srcPath.split(/[\\/]/).pop()!;
  copyFileSync(srcPath, join(userDir, name));
  // 安装后立即解析一次，尽早暴露格式问题
  parseSkill(readFileSync(join(userDir, name), 'utf8'), 'user', join(userDir, name));
  return { name: name.replace(/\.md$/i, ''), dir: userDir };
}
