import { createServer as createHttpServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { attachmentFromContent, openFolder, runEmbedForge } from '../index.js';
import type { LlmConfig, WebServerConfig } from '../core/types.js';
import { UI_HTML } from './ui.js';

/** 请求体上限：图片 base64 后较大，放宽到 12MB */
const MAX_BODY = 12 * 1024 * 1024;

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk: Buffer) => {
      data += chunk;
      if (data.length > MAX_BODY) {
        reject(new Error('请求体过大（超过 12MB）'));
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

interface RawAttachment {
  name?: string;
  kind?: 'text' | 'image';
  content?: string;
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
          sessionId?: string;
          attachments?: RawAttachment[];
        };
        const requirement = (body.requirement ?? '').trim();
        if (!requirement) {
          sendJson(res, 400, { error: '缺少需求描述' });
          return;
        }
        const attachments = (body.attachments ?? [])
          .filter((a) => a.name && a.content && a.kind)
          .map((a) => attachmentFromContent(a.name!, a.content!, a.kind!));

        const llm: LlmConfig = {
          provider: 'web',
          baseURL: body.baseURL?.trim() || defaults.baseURL || 'http://localhost:11434/v1',
          model: body.model?.trim() || defaults.model || 'qwen2.5:7b',
          apiKey: body.apiKey?.trim() || defaults.apiKey || undefined,
        };
        console.log(
          `[generate] baseURL=${llm.baseURL} model=${llm.model} hasKey=${Boolean(llm.apiKey)} platform=${body.platform || 'auto'} req="${requirement.slice(0, 60)}"`,
        );
        const { plan, result, session, outDir } = await runEmbedForge(requirement, llm, {
          platform: body.platform || undefined,
          outDir: './generated',
          attachments,
          sessionId: body.sessionId,
        });
        if (result.failedFiles.length) {
          for (const f of result.failedFiles) {
            console.error(`[generate] FAILED ${f.path}: ${f.error ?? 'unknown'}`);
          }
        } else {
          console.log(`[generate] OK ${result.aiGeneratedCount} AI files generated`);
        }
        openFolder(outDir);
        sendJson(res, 200, { plan, result, session: { id: session.id, turns: session.turns } });
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
