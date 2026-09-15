import { describe, expect, it } from 'vitest';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ProjectTools, AgentError, safeJoin } from '../src/core/agent.js';

function makeTempProject(): string {
  const dir = mkdtempSync(join(tmpdir(), 'ef-agent-'));
  mkdirSync(join(dir, 'Core', 'Src'), { recursive: true });
  writeFileSync(join(dir, 'Core', 'Src', 'main.c'), 'int main(void) { return 0; }\n', 'utf8');
  writeFileSync(join(dir, 'Makefile'), 'all:\n\t@echo ok\n', 'utf8');
  writeFileSync(join(dir, 'firmware.bin'), Buffer.from([0x00, 0xff]), 'utf8');
  return dir;
}

describe('safeJoin', () => {
  const root = makeTempProject();

  it('允许工程内相对路径', () => {
    expect(safeJoin(root, 'Core/Src/main.c')).toContain('main.c');
    expect(safeJoin(root, '.')).toBe(join(root));
  });

  it('拒绝 .. 越出工程目录', () => {
    expect(() => safeJoin(root, '../outside.txt')).toThrow(AgentError);
    expect(() => safeJoin(root, 'Core/../../..')).toThrow(AgentError);
  });

  it('拒绝绝对路径注入', () => {
    expect(() => safeJoin(root, 'C:\\Windows\\system32\\config')).toThrow(AgentError);
    expect(() => safeJoin(root, '/etc/passwd')).toThrow(AgentError);
  });

  it('拒绝空路径', () => {
    expect(() => safeJoin(root, '')).toThrow(/路径不能为空/);
  });
});

describe('ProjectTools', () => {
  it('list_files 列出相对路径并跳过 .git/node_modules', () => {
    const dir = makeTempProject();
    mkdirSync(join(dir, 'node_modules', 'x'), { recursive: true });
    writeFileSync(join(dir, 'node_modules', 'x', 'index.js'), 'x', 'utf8');
    try {
      const out = new ProjectTools(dir).execute('list_files', JSON.stringify({ path: '.' }));
      expect(out).toContain('Core/Src/main.c');
      expect(out).toContain('Makefile');
      expect(out).not.toContain('node_modules');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('read_file 读文本、拒绝二进制', () => {
    const dir = makeTempProject();
    try {
      const tools = new ProjectTools(dir);
      expect(tools.execute('read_file', JSON.stringify({ path: 'Core/Src/main.c' }))).toContain('int main');
      const bin = tools.execute('read_file', JSON.stringify({ path: 'firmware.bin' }));
      expect(bin).toMatch(/ERROR/);
      expect(tools.execute('read_file', JSON.stringify({ path: '../leak.txt' }))).toMatch(/ERROR/);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('write_file 创建/覆盖文件并记录变更、拒绝二进制类型', () => {
    const dir = makeTempProject();
    try {
      const tools = new ProjectTools(dir);
      const out = tools.execute(
        'write_file',
        JSON.stringify({ path: 'Core/Inc/app.h', content: '#pragma once\n' }),
      );
      expect(out).toContain('已写入 Core/Inc/app.h');
      expect(tools.filesChanged).toEqual(['Core/Inc/app.h']);

      const binOut = tools.execute(
        'write_file',
        JSON.stringify({ path: 'flash.bin', content: 'xx' }),
      );
      expect(binOut).toMatch(/ERROR/);
      expect(tools.filesChanged).toHaveLength(1);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('write_file 越出工程目录被拒绝', () => {
    const dir = makeTempProject();
    try {
      const out = new ProjectTools(dir).execute(
        'write_file',
        JSON.stringify({ path: '../evil.c', content: 'pwn' }),
      );
      expect(out).toMatch(/ERROR/);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('未知工具返回错误信息', () => {
    const dir = makeTempProject();
    try {
      expect(new ProjectTools(dir).execute('rm_rf', '{}')).toMatch(/未知工具/);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
