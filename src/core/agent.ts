import { exec } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { isAbsolute, join, relative, resolve, sep } from 'node:path';
import { promisify } from 'node:util';
import type { ChatMessage, LlmClient, ToolDefinition } from './llm.js';
import type { AgentRunResult, AgentStep } from './types.js';
import { buildSkillsContext, matchSkills, type Skill } from './skills.js';

const execAsync = promisify(exec);

/** 可读写的文本扩展名（二进制拒绝） */
const EDITABLE_EXTS = new Set([
  '.c', '.h', '.cpp', '.hpp', '.cc', '.cxx', '.s', '.S', '.py', '.txt', '.md', '.markdown',
  '.ini', '.toml', '.cfg', '.conf', '.json', '.yaml', '.yml', '.cmake', '.mk', '.ld', '.ioc',
  '.dts', '.dtsi', '.overlay', '.sh', '.bat', '.csv', '.log', '.rst', '.html', '.css', '.js', '.ts',
]);
/** 只读不可写（潜在敏感/构建产物） */
const READONLY_OK = new Set(['.gitignore', '.gitattributes', 'makefile', 'platformio.ini']);

/** 递归列目录时跳过的目录名 */
const SKIP_DIRS = new Set(['.git', 'node_modules', 'build', 'dist', 'Debug', '.pio', 'managed_components']);

const MAX_FILE_BYTES = 256 * 1024;
const MAX_LIST_ENTRIES = 400;
const MAX_TOOL_OUTPUT = 16 * 1024;
const DEFAULT_MAX_STEPS = 24;

export class AgentError extends Error {}

/** 把工程内相对路径安全地解析为绝对路径，拒绝越出工程目录 */
export function safeJoin(projectDir: string, relPath: string): string {
  if (!relPath || typeof relPath !== 'string') throw new AgentError('路径不能为空');
  const root = resolve(projectDir);
  const abs = resolve(root, relPath);
  if (abs !== root && !abs.startsWith(root + sep)) {
    throw new AgentError(`路径越出工程目录，已拒绝: ${relPath}`);
  }
  return abs;
}

function extOf(path: string): string {
  const base = path.split(/[\\/]/).pop() ?? '';
  const dot = base.lastIndexOf('.');
  return dot > 0 ? base.slice(dot).toLowerCase() : '';
}

/** Agent 可操作文件的工具集（读写均限制在工程目录内） */
export class ProjectTools {
  constructor(
    /** 工程根目录（所有文件操作限制在此目录内） */
    readonly projectDir: string,
    private readonly allowShell: boolean = false,
  ) {
    if (!existsSync(projectDir) || !statSync(projectDir).isDirectory()) {
      throw new AgentError(`工程目录不存在: ${projectDir}`);
    }
  }

  /** 变更记录（write_file 成功的相对路径，去重保序） */
  readonly filesChanged: string[] = [];
  private readonly steps: AgentStep[] = [];

  getStepLog(): AgentStep[] {
    return this.steps;
  }

  private record(tool: string, args: string, ok: boolean, summary: string): void {
    this.steps.push({ tool, args: args.slice(0, 200), ok, summary: summary.slice(0, 400) });
  }

  private checkWritable(abs: string): void {
    const ext = extOf(abs);
    const base = abs.split(/[\\/]/).pop()!.toLowerCase();
    if (EDITABLE_EXTS.has(ext) || READONLY_OK.has(base) || ext === '') {
      return;
    }
    throw new AgentError(`拒绝写入二进制/不认识的文件类型: ${ext || '(无扩展名)'}`);
  }

  /** 工具执行入口；返回给模型的结果文本（截断） */
  execute(name: string, argsJson: string): string {
    let out: string;
    try {
      const args = argsJson ? (JSON.parse(argsJson) as Record<string, unknown>) : {};
      switch (name) {
        case 'list_files':
          out = this.listFiles(String(args.path ?? '.'));
          break;
        case 'read_file':
          out = this.readFile(String(args.path ?? ''));
          break;
        case 'write_file':
          out = this.writeFile(String(args.path ?? ''), String(args.content ?? ''));
          break;
        default:
          out = `未知工具: ${name}`;
      }
    } catch (err) {
      out = `ERROR: ${(err as Error).message}`;
    }
    return out.slice(0, MAX_TOOL_OUTPUT);
  }

  /** shell 命令执行（仅 --allow-shell 时由循环调用） */
  async executeShell(command: string): Promise<string> {
    try {
      const { stdout, stderr } = await execAsync(command, {
        cwd: this.projectDir,
        timeout: 120_000,
        maxBuffer: 1024 * 1024,
      });
      const out = `exit=0\n${stdout}\n${stderr}`.trim();
      this.record('run_command', command, true, out.slice(0, 400));
      return out.slice(0, MAX_TOOL_OUTPUT) || '(无输出)';
    } catch (err) {
      const e = err as { stdout?: string; stderr?: string; message: string };
      const out = `ERROR: ${e.message}\n${e.stdout ?? ''}\n${e.stderr ?? ''}`.trim();
      this.record('run_command', command, false, out.slice(0, 400));
      return out.slice(0, MAX_TOOL_OUTPUT);
    }
  }

  private listFiles(relPath: string): string {
    const root = safeJoin(this.projectDir, relPath);
    if (!statSync(root).isDirectory()) throw new AgentError(`不是目录: ${relPath}`);
    const lines: string[] = [];
    const walk = (dir: string, depth: number): void => {
      if (depth > 6 || lines.length >= MAX_LIST_ENTRIES) return;
      for (const entry of readdirSync(dir).sort()) {
        if (SKIP_DIRS.has(entry)) continue;
        const abs = join(dir, entry);
        const rel = relative(this.projectDir, abs).split(sep).join('/');
        const st = statSync(abs);
        if (st.isDirectory()) {
          lines.push(`${rel}/`);
          walk(abs, depth + 1);
        } else {
          lines.push(`${rel} (${st.size}B)`);
        }
        if (lines.length >= MAX_LIST_ENTRIES) {
          lines.push(`…（超过 ${MAX_LIST_ENTRIES} 项，已截断）`);
          return;
        }
      }
    };
    walk(root, 0);
    const result = lines.join('\n') || '(空目录)';
    this.record('list_files', relPath, true, `${lines.length} 项`);
    return result;
  }

  private readFile(relPath: string): string {
    const abs = safeJoin(this.projectDir, relPath);
    if (!existsSync(abs) || !statSync(abs).isFile()) throw new AgentError(`文件不存在: ${relPath}`);
    const ext = extOf(abs);
    const base = abs.split(/[\\/]/).pop()!.toLowerCase();
    if (!EDITABLE_EXTS.has(ext) && !READONLY_OK.has(base) && ext !== '') {
      throw new AgentError(`不支持读取的文件类型: ${ext}（仅文本/代码文件）`);
    }
    const buf = readFileSync(abs);
    let text = buf.subarray(0, MAX_FILE_BYTES).toString('utf8');
    if (buf.length > MAX_FILE_BYTES) text += '\n…（文件过长，已截断）';
    this.record('read_file', relPath, true, `${buf.length}B`);
    return text || '(空文件)';
  }

  private writeFile(relPath: string, content: string): string {
    const abs = safeJoin(this.projectDir, relPath);
    this.checkWritable(abs);
    if (content.length > MAX_FILE_BYTES * 2) throw new AgentError('写入内容过大');
    mkdirSync(resolve(abs, '..'), { recursive: true });
    writeFileSync(abs, content, 'utf8');
    const rel = relative(this.projectDir, abs).split(sep).join('/');
    if (!this.filesChanged.includes(rel)) this.filesChanged.push(rel);
    this.record('write_file', `${relPath} (${content.length}B)`, true, '已写入');
    return `已写入 ${rel}（${Buffer.byteLength(content, 'utf8')} 字节）`;
  }
}

const TOOL_DEFS: ToolDefinition[] = [
  {
    type: 'function',
    function: {
      name: 'list_files',
      description: '递归列出工程目录中的文件（相对路径 + 大小）。开始工作前先浏览工程结构。',
      parameters: {
        type: 'object',
        properties: {
          path: { type: 'string', description: '要列出的目录，相对工程根目录，默认 "." ' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'read_file',
      description: '读取工程内的文本/代码文件内容（源码、Makefile、配置等）。',
      parameters: {
        type: 'object',
        properties: {
          path: { type: 'string', description: '相对工程根目录的文件路径' },
        },
        required: ['path'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'write_file',
      description: '创建或覆盖工程内的文本/代码文件。修改现有文件时必须先 read_file 再 write_file 完整内容。',
      parameters: {
        type: 'object',
        properties: {
          path: { type: 'string', description: '相对工程根目录的文件路径' },
          content: { type: 'string', description: '完整的文件内容' },
        },
        required: ['path', 'content'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'run_command',
      description: '在工程目录执行 shell 命令（如 make、pio run 编译验证）。仅在启用 --allow-shell 时可用。',
      parameters: {
        type: 'object',
        properties: {
          command: { type: 'string', description: '要执行的命令' },
        },
        required: ['command'],
      },
    },
  },
];

function buildAgentSystemPrompt(projectDir: string, skillsContext: string, allowShell: boolean): string {
  return `你是一名资深嵌入式软件工程师（10 年以上 ARM/MCU 开发经验），正在一个真实的工程目录里工作，工程根目录：${projectDir}

你可以调用工具来浏览工程、读取源码、修改文件${allowShell ? '、运行编译命令' : ''}。所有文件操作都被限制在工程目录内。

工作准则：
1. 动手前先 list_files 浏览结构，再 read_file 读相关源码，弄清现有设计（引脚表、驱动分层、命名习惯）后再改。
2. 修改文件时用 write_file 输出完整文件内容（不是片段/补丁）；新文件同样用 write_file。
3. 遵循工程既有代码风格与分层；头文件接口同步更新；交叉引用（main.c 调用的驱动函数）保持一致。
4. 代码要生产级质量：返回值检查、超时、消抖、volatile/ISR 安全、无魔数。
5. 一步一步来：每次只做一小步，看到工具结果再决定下一步。不要在一次回复里重复调用同一工具读同一文件。
6. 完成后，用简洁的中文总结：改了哪些文件、每个文件改了什么、如何验证（编译/烧录/测试步骤）${allowShell ? '' : '。你无法运行编译命令，请在总结中给出验证命令让用户执行'}。${skillsContext}`;
}

/** Agent 循环选项 */
export interface AgentOptions {
  /** 是否允许 shell 命令（编译验证），默认关闭 */
  allowShell?: boolean;
  /** 最大工具调用轮数，默认 24 */
  maxSteps?: number;
  /** 可用技能列表（调用方 loadAllSkills 后传入） */
  skills?: Skill[];
  /** 强制注入的技能名 */
  forceSkills?: string[];
  /** 会话历史简述（可迭代既有任务） */
  memoryBrief?: string;
}

/** 运行一次 Agent 任务：LLM + 文件工具循环，直到模型给出最终报告 */
export async function runAgentTask(
  client: LlmClient,
  task: string,
  projectDir: string,
  opts: AgentOptions = {},
): Promise<AgentRunResult> {
  const started = Date.now();
  const tools = new ProjectTools(projectDir, opts.allowShell ?? false);

  const matched: Skill[] = matchSkills(task, opts.skills ?? [], { forceSkills: opts.forceSkills });
  const skillsContext = buildSkillsContext(matched);

  const system = buildAgentSystemPrompt(resolve(projectDir), skillsContext, opts.allowShell ?? false)
    + (opts.memoryBrief ?? '');
  const messages: ChatMessage[] = [
    { role: 'system', content: system },
    { role: 'user', content: task },
  ];

  const maxSteps = opts.maxSteps ?? DEFAULT_MAX_STEPS;
  let truncated = false;
  let report = '';

  for (let step = 0; step < maxSteps; step++) {
    const res = await client.chatWithTools(messages, TOOL_DEFS, { maxTokens: 8000 });

    if (!res.toolCalls.length) {
      report = res.content ?? '(模型未给出总结)';
      break;
    }

    messages.push({
      role: 'assistant',
      content: res.content ?? '',
      tool_calls: res.toolCalls,
    });

    for (const tc of res.toolCalls) {
      let result: string;
      if (tc.function.name === 'run_command') {
        const cmd = (() => {
          try {
            return (JSON.parse(tc.function.arguments) as { command?: string }).command ?? '';
          } catch {
            return '';
          }
        })();
        if (!opts.allowShell) {
          result = 'ERROR: shell 命令未启用（需要 --allow-shell）';
        } else {
          result = await tools.executeShell(cmd);
        }
      } else {
        result = tools.execute(tc.function.name, tc.function.arguments);
      }
      messages.push({
        role: 'tool',
        tool_call_id: tc.id,
        name: tc.function.name,
        content: result,
      });
    }
    if (step === maxSteps - 1) truncated = true;
  }

  if (!report && truncated) {
    report = '已达到最大步数限制，任务未完全结束。可再次运行以继续。';
  }

  return {
    report,
    steps: tools.getStepLog(),
    filesChanged: tools.filesChanged,
    elapsedMs: Date.now() - started,
    truncated,
  };
}
