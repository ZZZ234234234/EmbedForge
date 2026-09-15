import { describe, expect, it } from 'vitest';
import {
  attachmentFromContent,
  buildImageParts,
  buildMemoryBrief,
  buildTextContext,
  buildUserMessage,
  recordTurn,
  SessionStore,
} from '../src/core/context.js';
import type { ProjectPlan, SessionMemory } from '../src/core/types.js';

function makePlan(over: Partial<ProjectPlan> = {}): ProjectPlan {
  return {
    projectName: 'demo',
    platform: 'stm32',
    target: 'STM32F103',
    summary: 'demo',
    modules: ['LED'],
    pinout: [],
    files: ['Core/Src/main.c'],
    buildSystem: 'make',
    ...over,
  };
}

describe('attachmentFromContent', () => {
  it('文本附件', () => {
    const a = attachmentFromContent('note.txt', 'hello', 'text');
    expect(a.kind).toBe('text');
    expect(a.text).toBe('hello');
  });
  it('图片附件保留 dataUrl', () => {
    const a = attachmentFromContent('schematic.png', 'data:image/png;base64,AAA', 'image');
    expect(a.kind).toBe('image');
    expect(a.dataUrl).toContain('base64');
  });
});

describe('buildTextContext', () => {
  it('包含文本附件内容，忽略图片', () => {
    const ctx = buildTextContext([
      attachmentFromContent('datasheet.md', 'PA0 is DHT11', 'text'),
      attachmentFromContent('pic.png', 'data:image/png;base64,x', 'image'),
    ]);
    expect(ctx).toContain('datasheet.md');
    expect(ctx).toContain('PA0 is DHT11');
    expect(ctx).not.toContain('base64');
  });
  it('无文本附件时返回空串', () => {
    expect(buildTextContext([])).toBe('');
  });
});

describe('buildUserMessage', () => {
  it('纯文本时 content 为字符串', () => {
    const m = buildUserMessage('点灯', []);
    expect(typeof m.content).toBe('string');
    expect(m.content).toContain('点灯');
  });
  it('带图片时 content 为多模态数组', () => {
    const m = buildUserMessage('看原理图', [
      attachmentFromContent('sch.png', 'data:image/png;base64,AAA', 'image'),
    ]);
    expect(Array.isArray(m.content)).toBe(true);
    const parts = m.content as unknown as { type: string }[];
    expect(parts.some((p) => p.type === 'image_url')).toBe(true);
  });
});

describe('session memory', () => {
  it('recordTurn 记录轮次与附件名', () => {
    const s: SessionMemory = {
      id: 's1',
      createdAt: '',
      updatedAt: '',
      turns: [],
      attachmentNames: [],
    };
    recordTurn(s, '点灯', makePlan(), ['sch.png']);
    expect(s.turns).toHaveLength(1);
    expect(s.attachmentNames).toContain('sch.png');
  });

  it('最多保留 10 轮', () => {
    const s: SessionMemory = { id: 's2', createdAt: '', updatedAt: '', turns: [], attachmentNames: [] };
    for (let i = 0; i < 12; i++) recordTurn(s, `需求${i}`, makePlan({ projectName: `p${i}` }), []);
    expect(s.turns).toHaveLength(10);
    expect(s.turns[9].requirement).toBe('需求11');
  });

  it('buildMemoryBrief 包含历史需求', () => {
    const s: SessionMemory = { id: 's3', createdAt: '', updatedAt: '', turns: [], attachmentNames: [] };
    recordTurn(s, '第一轮：点灯', makePlan(), []);
    const brief = buildMemoryBrief(s);
    expect(brief).toContain('第一轮：点灯');
    expect(brief).toContain('历史记录');
  });

  it('空会话 brief 为空', () => {
    expect(buildMemoryBrief(null)).toBe('');
  });

  it('SessionStore 可保存并读回', () => {
    const store = new SessionStore();
    const s = store.create();
    recordTurn(s, '测试', makePlan(), []);
    store.save(s);
    const loaded = store.load(s.id);
    expect(loaded?.turns).toHaveLength(1);
    expect(store.list()).toContain(s.id);
  });

  it('buildImageParts 只收集图片', () => {
    const parts = buildImageParts([
      attachmentFromContent('a.txt', 'x', 'text'),
      attachmentFromContent('a.png', 'data:image/png;base64,x', 'image'),
    ]);
    expect(parts).toHaveLength(1);
  });
});
