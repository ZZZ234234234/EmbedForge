import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import type { ProjectPlan } from '../src/core/types.js';
import { writeProject } from '../src/core/writer.js';

const dirs: string[] = [];

function makePlan(over: Partial<ProjectPlan> = {}): ProjectPlan {
  return {
    projectName: 'demo',
    platform: 'stm32',
    target: 'STM32F103C8T6',
    summary: 'demo project',
    modules: ['LED 控制'],
    pinout: [{ pin: 'PC13', signal: 'LED' }],
    files: ['Core/Src/main.c', 'Core/Inc/main.h'],
    buildSystem: 'make',
    ...over,
  };
}

afterEach(() => {
  for (const d of dirs.splice(0)) rmSync(d, { recursive: true, force: true });
});

describe('writeProject', () => {
  it('写入骨架与 AI 文件并生成 README', () => {
    const out = mkdtempSync(join(tmpdir(), 'ef-test-'));
    dirs.push(out);
    const plan = makePlan();
    const files = [
      { path: 'Makefile', status: 'ok' as const, content: '# make' },
      { path: 'Core/Src/main.c', status: 'ok' as const, content: 'int main(void){}\n' },
      { path: 'Core/Inc/main.h', status: 'error' as const, error: 'timeout' },
    ];
    const res = writeProject(out, plan, files);
    expect(res.writtenCount).toBe(3);
    expect(readFileSync(join(out, 'Makefile'), 'utf8')).toBe('# make');
    expect(readFileSync(join(out, 'README.md'), 'utf8')).toContain('demo');
    expect(readFileSync(join(out, 'README.md'), 'utf8')).toContain('PC13');
  });

  it('失败文件不落盘但写入 README 提示', () => {
    const out = mkdtempSync(join(tmpdir(), 'ef-test-'));
    dirs.push(out);
    const plan = makePlan();
    const files = [
      { path: 'Core/Src/main.c', status: 'error' as const, error: 'LLM 超时' },
    ];
    const res = writeProject(out, plan, files);
    expect(res.writtenCount).toBe(1);
    expect(readFileSync(join(out, 'README.md'), 'utf8')).toContain('LLM 超时');
  });

  it('构建文件存在时 README 正常给出构建说明', () => {
    const out = mkdtempSync(join(tmpdir(), 'ef-test-'));
    dirs.push(out);
    const plan = makePlan({ buildSystem: 'make' });
    const files = [
      { path: 'Makefile', status: 'ok' as const, content: 'all:\n' },
      { path: 'Core/Src/main.c', status: 'ok' as const, content: 'int main(void){}\n' },
    ];
    writeProject(out, plan, files);
    const readme = readFileSync(join(out, 'README.md'), 'utf8');
    expect(readme).toContain('- 构建系统：make');
    expect(readme).not.toContain('尚未提供');
  });

  it('构建文件缺失时 README 明确告警而不是指向不存在的 Makefile', () => {
    const out = mkdtempSync(join(tmpdir(), 'ef-test-'));
    dirs.push(out);
    // 声称 cmake，但工程里只有 main.c，没有任何 CMakeLists.txt
    const plan = makePlan({ buildSystem: 'cmake' });
    const files = [
      { path: 'Core/Src/main.c', status: 'ok' as const, content: 'int main(void){}\n' },
    ];
    writeProject(out, plan, files);
    const readme = readFileSync(join(out, 'README.md'), 'utf8');
    expect(readme).toContain('尚未提供');
    expect(readme).toContain('未生成构建文件');
  });

  it('README 目录结构包含构建文件', () => {
    const out = mkdtempSync(join(tmpdir(), 'ef-test-'));
    dirs.push(out);
    const plan = makePlan({ buildSystem: 'make' });
    writeProject(out, plan, [
      { path: 'Core/Src/main.c', status: 'ok' as const, content: 'int main(void){}\n' },
    ]);
    const readme = readFileSync(join(out, 'README.md'), 'utf8');
    expect(readme).toContain('Makefile');
  });
});
