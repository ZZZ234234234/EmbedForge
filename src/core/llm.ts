import type { LlmConfig } from './types.js';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatOptions {
  temperature?: number;
  maxTokens?: number;
  /** 期望输出 JSON 对象（自动附加 JSON 约束提示并尝试解析） */
  jsonMode?: boolean;
}

export class LlmError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = 'LlmError';
  }
}

/** OpenAI 兼容 Chat Completions 客户端 */
export class LlmClient {
  constructor(private readonly cfg: LlmConfig) {}

  async chat(messages: ChatMessage[], opts: ChatOptions = {}): Promise<string> {
    const { baseURL, apiKey, model, timeoutMs = 120_000 } = this.cfg;
    const url = baseURL.replace(/\/+$/, '') + '/chat/completions';

    const body: Record<string, unknown> = {
      model,
      messages,
      temperature: opts.temperature ?? 0.4,
      stream: false,
    };
    if (opts.maxTokens) body.max_tokens = opts.maxTokens;
    if (opts.jsonMode) {
      body.response_format = { type: 'json_object' };
      messages = [...messages];
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new LlmError(`LLM 请求失败 (${res.status}): ${text.slice(0, 300)}`, res.status);
      }
      const data = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const content = data.choices?.[0]?.message?.content;
      if (content == null) throw new LlmError('LLM 返回内容为空');
      return content;
    } catch (err) {
      if (err instanceof LlmError) throw err;
      if (err instanceof Error && err.name === 'AbortError') {
        throw new LlmError(`LLM 请求超时（${timeoutMs}ms）`);
      }
      throw new LlmError(`LLM 请求失败: ${(err as Error).message}`);
    } finally {
      clearTimeout(timer);
    }
  }

  /** 请求 JSON 输出；若解析失败返回 null */
  async chatJson<T>(messages: ChatMessage[], opts: ChatOptions = {}): Promise<T | null> {
    const raw = await this.chat(messages, { ...opts, jsonMode: true });
    try {
      // 兼容模型在 JSON 外层包裹 ```json ... ``` 的情况
      const cleaned = raw.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
      return JSON.parse(cleaned) as T;
    } catch {
      return null;
    }
  }
}
