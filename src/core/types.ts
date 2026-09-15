/** 支持的嵌入式平台标识 */
export type PlatformId = 'stm32' | 'esp32' | 'arduino' | 'generic-c';

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
  /** 需要生成的源代码文件清单（相对工程根目录） */
  files: string[];
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
}

/** Web 服务配置 */
export interface WebServerConfig {
  port: number;
  host: string;
}
