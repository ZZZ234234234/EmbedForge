import { describe, expect, it } from 'vitest';
import {
  attachmentFromContent,
  buildImageParts,
  buildMemoryBrief,
  buildTextContext,
  buildUserMessage,
  DEFAULT_CONTEXT_TOKENS,
  estimateTokens,
  recordCodeSnapshot,
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

  it('不再按固定轮数丢弃历史（长会话全量保留）', () => {
    const s: SessionMemory = { id: 's2', createdAt: '', updatedAt: '', turns: [], attachmentNames: [] };
    for (let i = 0; i < 40; i++) recordTurn(s, `需求${i}`, makePlan({ projectName: `p${i}` }), []);
    // 记录阶段不裁剪，轮数上限交给 buildMemoryBrief 按上下文预算决定
    expect(s.turns).toHaveLength(40);
    expect(s.turns[39].requirement).toBe('需求39');
  });

  it('大上下文窗口能带更多轮历史', () => {
    const s: SessionMemory = { id: 's3a', createdAt: '', updatedAt: '', turns: [], attachmentNames: [] };
    // 每轮塞较长需求，才能在 4k 与 128k 之间拉开可见差距
    const long = '采集多路传感器并通过 OLED 显示，同时用串口上报'.repeat(40);
    for (let i = 0; i < 40; i++) {
      recordTurn(s, `需求${i}: ${long}`, makePlan({ projectName: `p${i}` }), []);
    }
    const small = buildMemoryBrief(s, { contextTokens: 4_000 });
    const large = buildMemoryBrief(s, { contextTokens: 128_000 });
    // 128k 窗口应比 4k 窗口保留更多轮次
    expect(large.length).toBeGreaterThan(small.length);
    expect(large).toContain('需求39');
    expect(small).toContain('需求39'); // 最新一轮必须始终保留
    // 小窗口应发生了省略
    expect(small).toMatch(/较早的 \d+ 轮因上下文预算已省略/);
    expect(large).not.toMatch(/因上下文预算已省略/);
  });

  it('上下文不足时明确标注省略了多少轮，而不是静默截断', () => {
    const s: SessionMemory = { id: 's3b', createdAt: '', updatedAt: '', turns: [], attachmentNames: [] };
    for (let i = 0; i < 60; i++) recordTurn(s, `需求${i}`, makePlan({ projectName: `p${i}` }), []);
    const brief = buildMemoryBrief(s, { contextTokens: 4_000 });
    expect(brief).toMatch(/较早的 \d+ 轮因上下文预算已省略/);
  });

  it('recordCodeSnapshot 保留源码并遵守字节预算', () => {
    const s: SessionMemory = { id: 's3c', createdAt: '', updatedAt: '', turns: [], attachmentNames: [] };
    const files = [
      { path: 'Core/Src/app.c', status: 'ok' as const, content: 'a'.repeat(1000) },
      { path: 'Core/Inc/app.h', status: 'ok' as const, content: 'b'.repeat(500) },
      // 厂商库不应进快照
      { path: 'Drivers/STM32F1xx_HAL_Driver/Src/stm32f1xx_hal.c', status: 'ok' as const, content: 'x'.repeat(9000) },
      { path: 'Makefile', status: 'ok' as const, content: 'all:' },
    ];
    recordCodeSnapshot(s, files, 2000);
    const snap = s.codeSnapshot!;
    expect(snap.files.map((f) => f.path)).toEqual(['Core/Inc/app.h', 'Core/Src/app.c']);
    expect(snap.files.some((f) => f.path.startsWith('Drivers/'))).toBe(false);
  });

  it('快照内容会进入 memory brief，供下一轮迭代参照', () => {
    const s: SessionMemory = { id: 's3d', createdAt: '', updatedAt: '', turns: [], attachmentNames: [] };
    recordTurn(s, '点灯', makePlan(), []);
    recordCodeSnapshot(s, [
      { path: 'Core/Src/app.c', status: 'ok', content: 'void app_loop(void){ /* MARKER_X */ }' },
    ], 10_000);
    const brief = buildMemoryBrief(s, { contextTokens: 128_000 });
    expect(brief).toContain('源码快照');
    expect(brief).toContain('MARKER_X');
  });

  it('estimateTokens 对中文给出保守估计', () => {
    expect(estimateTokens('中文')).toBeGreaterThanOrEqual(2);
    expect(estimateTokens('')).toBe(0);
  });

  it('1M 上下文可携带远多于 128k 的历史', () => {
    const s: SessionMemory = { id: 's-big', createdAt: '', updatedAt: '', turns: [], attachmentNames: [] };
    const long = '采集温湿度并通过 OLED 显示，同时串口上报数据'.repeat(60);
    for (let i = 0; i < 200; i++) {
      recordTurn(s, `需求${i}: ${long}`, makePlan({ projectName: `p${i}` }), []);
    }
    const k128 = buildMemoryBrief(s, { contextTokens: 128_000 });
    const m1 = buildMemoryBrief(s, { contextTokens: 1_000_000 });
    // 1M 窗口应保留明显更多轮次
    expect(m1.length).toBeGreaterThan(k128.length);
    // 两者都必须包含最新一轮
    expect(k128).toContain('需求199');
    expect(m1).toContain('需求199');
    // 1M 窗口下也能回溯到更早的轮次
    expect(m1).toContain('需求0');
  });

  it('缺省上下文窗口为 128k', () => {
    const s: SessionMemory = { id: 's-default', createdAt: '', updatedAt: '', turns: [], attachmentNames: [] };
    const long = '需求描述'.repeat(200);
    for (let i = 0; i < 80; i++) recordTurn(s, `${i}:${long}`, makePlan(), []);
    const def = buildMemoryBrief(s);
    const explicit = buildMemoryBrief(s, { contextTokens: DEFAULT_CONTEXT_TOKENS });
    expect(def).toBe(explicit);
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
