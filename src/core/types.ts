/** 支持的嵌入式平台标识 */
export type PlatformId =
  | 'stm32'
  | 'esp32'
  | 'arduino'
  | 'generic-c'
  | 'pico'
  | 'avr'
  | 'micropython'
  | 'zephyr';

/** 平台元信息 */
export interface PlatformInfo {
  id: PlatformId;
  name: string;
  description: string;
  /** 构建/工具链说明（写入工程 README） */
  buildHint: string;
}

/** LLM 服务配置（OpenAI 兼容） */
export interface LlmConfig {
  /** 服务标识，如 deepseek / openai / ollama */
  provider: string;
  /** OpenAI 兼容端点，如 https://api.deepseek.com/v1 */
  baseURL: string;
  apiKey?: string;
  model: string;
  /** 单文件生成超时（毫秒） */
  timeoutMs?: number;
}

/** 需求解析结果（LLM 输出的结构化工程规划） */
export interface ProjectPlan {
  /** 工程名称（目录名） */
  projectName: string;
  platform: PlatformId;
  /** 目标芯片/开发板 */
  target: string;
  /** 一句话项目简介 */
  summary: string;
  /** 功能模块列表 */
  modules: string[];
  /** 引脚分配说明，如 [{ pin: 'PA0', signal: 'DHT11_DATA' }] */
  pinout: PinMapping[];
  /** 需要生成的源代码文件清单（相对工程根目录，仅应用层，标准库和外设驱动由模板提供） */
  files: string[];
  /** 自动匹配的外设驱动 id（如 dht11 / ssd1306 / button / led_pwm / uart_debug），由模板注入，不调 LLM */
  drivers: string[];
  /** 构建系统，如 make / cmake / platformio */
  buildSystem: string;
}

export interface PinMapping {
  pin: string;
  signal: string;
  note?: string;
}

/** 生成后的工程文件 */
export interface ProjectFile {
  path: string;
  content: string;
  /** 来源：模板骨架 / AI 生成 / 静态 */
  source: 'template' | 'ai' | 'static';
}

/** 单文件生成结果 */
export interface GeneratedFileResult {
  path: string;
  status: 'ok' | 'error';
  content?: string;
  error?: string;
}

/** 完整生成结果 */
export interface GenerateResult {
  projectName: string;
  platform: PlatformId;
  target: string;
  outDir: string;
  files: GeneratedFileResult[];
  /** 骨架文件（模板自带）数量 */
  skeletonCount: number;
  /** AI 生成文件数量 */
  aiGeneratedCount: number;
  failedFiles: GeneratedFileResult[];
  /** 总耗时（毫秒） */
  elapsedMs: number;
  /** 资深工程师代码审查结果（未启用/失败时为 null） */
  review?: ReviewResult | null;
}

/** Web 服务配置 */
export interface WebServerConfig {
  port: number;
  host: string;
}

/** 附件类型：文本文件或图片 */
export type AttachmentKind = 'text' | 'image';

/** 上传给 AI 的附件（文件 / 图片） */
export interface Attachment {
  /** 原始文件名 */
  name: string;
  kind: AttachmentKind;
  /** 文本类附件的内容 */
  text?: string;
  /** 图片类附件的 data URL（data:image/png;base64,...） */
  dataUrl?: string;
  /** 文件大小（字节） */
  size: number;
}

/** 一轮对话记录（用于上下文记忆） */
export interface MemoryTurn {
  /** 用户需求/指令 */
  requirement: string;
  /** 当时生成的工程规划摘要 */
  planSummary: string;
  /** 当时生成/修改的文件路径 */
  files: string[];
  at: string;
}

/** 会话记忆：跨多轮保留需求、规划与附件信息 */
export interface SessionMemory {
  id: string;
  createdAt: string;
  updatedAt: string;
  turns: MemoryTurn[];
  /** 最近一次附件文件名（内容不持久化图片 base64，仅记录元信息） */
  attachmentNames: string[];
}

/* ================= Agent（工具调用循环） ================= */

/** Agent 执行的一步工具调用 */
export interface AgentStep {
  tool: string;
  /** 入参摘要（超长截断） */
  args: string;
  ok: boolean;
  /** 执行结果摘要 */
  summary: string;
}

/** Agent 任务执行结果 */
export interface AgentRunResult {
  /** 模型给出的最终报告 */
  report: string;
  steps: AgentStep[];
  /** 本次被写入/修改的文件（相对工程目录） */
  filesChanged: string[];
  elapsedMs: number;
  /** 是否因达到最大步数而中止 */
  truncated: boolean;
}

/* ================= 代码审查 ================= */

export interface ReviewIssue {
  file: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
}

/** 审查结果：问题清单 + 修复后的文件 */
export interface ReviewResult {
  issues: ReviewIssue[];
  fixedFiles: GeneratedFileResult[];
}
