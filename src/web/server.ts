import { createServer as createHttpServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { runEmbedForge } from '../index.js';
import type { LlmConfig, WebServerConfig } from '../core/types.js';
import { UI_HTML } from './ui.js';

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk: Buffer) => {
      data += chunk;
      if (data.length > 2 * 1024 * 1024) {
        reject(new Error('请求体过大'));
        req.destroy();
      }
    });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

function sendJson(res: ServerResponse, status: number, obj: unknown): void {
  const body = JSON.stringify(obj);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(body);
}

/** 启动 EmbedForge Web UI（本地服务） */
export function startWebServer(
  cfg: WebServerConfig,
  defaults: Partial<LlmConfig> = {},
): { server: ReturnType<typeof createHttpServer>; url: string } {
  const server = createHttpServer(async (req, res) => {
    try {
      const url = req.url ?? '/';
      if (req.method === 'GET' && (url === '/' || url === '/index.html')) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(UI_HTML);
        return;
      }
      if (req.method === 'POST' && url === '/api/generate') {
        const raw = await readBody(req);
        const body = JSON.parse(raw) as {
          requirement?: string;
          baseURL?: string;
          model?: string;
          apiKey?: string;
          platform?: string;
        };
        const requirement = (body.requirement ?? '').trim();
        if (!requirement) {
          sendJson(res, 400, { error: '缺少需求描述' });
          return;
        }
        const llm: LlmConfig = {
          provider: 'web',
          baseURL: body.baseURL?.trim() || defaults.baseURL || 'http://localhost:11434/v1',
          model: body.model?.trim() || defaults.model || 'qwen2.5:7b',
          apiKey: body.apiKey?.trim() || defaults.apiKey || undefined,
        };
        const { plan, result } = await runEmbedForge(requirement, llm, {
          platform: body.platform || undefined,
          outDir: './generated',
        });
        sendJson(res, 200, { plan, result });
        return;
      }
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not Found');
    } catch (err) {
      sendJson(res, 500, { error: (err as Error).message });
    }
  });

  server.listen(cfg.port, cfg.host);
  return { server, url: `http://${cfg.host}:${cfg.port}` };
}
