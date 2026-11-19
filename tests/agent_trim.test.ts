import { describe, expect, it } from 'vitest';
import { trimAgentHistory } from '../src/core/agent.js';
import type { ChatMessage } from '../src/core/llm.js';

const sys: ChatMessage = { role: 'system', content: 'S'.repeat(500) + 'SYSTEM_MARK' };

function user(t: string): ChatMessage {
  return { role: 'user', content: t };
}
function assistantCall(id: string, n = 100): ChatMessage {
  return {
    role: 'assistant',
    content: '',
    tool_calls: [{ id, type: 'function', function: { name: 'read_file', arguments: '{}' } }],
  };
}
function toolMsg(id: string, n: number): ChatMessage {
  return { role: 'tool', tool_call_id: id, name: 'read_file', content: 'T'.repeat(n) };
}

/** 校验消息序列对 OpenAI 兼容端点合法：每条 tool 消息都能找到归属的 assistant tool_call */
function isValidSequence(msgs: ChatMessage[]): boolean {
  const seen = new Set<string>();
  for (const m of msgs) {
    if (m.role === 'assistant' && m.tool_calls) for (const tc of m.tool_calls) seen.add(tc.id);
    if (m.role === 'tool') {
      if (!m.tool_call_id || !seen.has(m.tool_call_id)) return false;
    }
  }
  return true;
}

describe('trimAgentHistory', () => {
  it('消息很少时原样返回', () => {
    const msgs = [sys, user('hi')];
    expect(trimAgentHistory(msgs, 128_000)).toBe(msgs);
  });

  it('始终保留 system 消息', () => {
    const msgs: ChatMessage[] = [sys];
    for (let i = 0; i < 50; i++) msgs.push(assistantCall(`c${i}`), toolMsg(`c${i}`, 20_000));
    const out = trimAgentHistory(msgs, 8_000);
    expect(out[0]).toBe(sys);
    expect(out[0].content).toContain('SYSTEM_MARK');
  });

  it('超大上下文保留更多历史', () => {
    const msgs: ChatMessage[] = [sys];
    for (let i = 0; i < 40; i++) msgs.push(assistantCall(`c${i}`), toolMsg(`c${i}`, 10_000));
    const small = trimAgentHistory(msgs, 16_000);
    const large = trimAgentHistory(msgs, 1_000_000);
    expect(large.length).toBeGreaterThanOrEqual(small.length);
    // 1M 窗口应几乎全保留
    expect(large.length).toBeGreaterThan(60);
  });

  it('裁剪后消息序列仍然合法（tool 消息不孤悬）', () => {
    const msgs: ChatMessage[] = [sys];
    for (let i = 0; i < 30; i++) msgs.push(assistantCall(`c${i}`), toolMsg(`c${i}`, 30_000));
    for (const budget of [4_000, 8_000, 16_000, 32_000, 64_000]) {
      const out = trimAgentHistory(msgs, budget);
      expect(isValidSequence(out), `budget=${budget} 产生了非法序列`).toBe(true);
    }
  });

  it('裁剪不改变最新消息', () => {
    const msgs: ChatMessage[] = [sys];
    for (let i = 0; i < 20; i++) msgs.push(assistantCall(`c${i}`), toolMsg(`c${i}`, 30_000));
    const last = toolMsg('c19', 1000);
    msgs.push(last);
    const out = trimAgentHistory(msgs, 8_000);
    expect(out[out.length - 1]).toBe(last);
  });

  it('预算极小时仍返回可用的最小序列', () => {
    const msgs: ChatMessage[] = [sys];
    for (let i = 0; i < 10; i++) msgs.push(assistantCall(`c${i}`), toolMsg(`c${i}`, 50_000));
    const out = trimAgentHistory(msgs, 100);
    expect(out.length).toBeGreaterThanOrEqual(1);
    expect(out[0]).toBe(sys);
    expect(isValidSequence(out)).toBe(true);
  });
});
