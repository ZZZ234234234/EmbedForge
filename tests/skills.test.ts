import { describe, expect, it } from 'vitest';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  buildSkillsContext,
  installSkill,
  loadAllSkills,
  matchSkills,
  parseSkill,
} from '../src/core/skills.js';

describe('parseSkill', () => {
  it('解析完整 front-matter', () => {
    const raw = `---
name: stm32-gpio
description: GPIO 要点
triggers: stm32, gpio, 时钟
---
# 正文内容
- 要点一`;
    const s = parseSkill(raw, 'builtin', '/x/stm32-gpio.md');
    expect(s.name).toBe('stm32-gpio');
    expect(s.description).toBe('GPIO 要点');
    expect(s.triggers).toEqual(['stm32', 'gpio', '时钟']);
    expect(s.content).toContain('要点一');
    expect(s.source).toBe('builtin');
  });

  it('front-matter 缺失时用文件名与首个标题兜底', () => {
    const s = parseSkill('# UART 调试技巧\n内容', 'user', '/x/uart-tips.md');
    expect(s.name).toBe('uart-tips');
    expect(s.description).toContain('UART 调试技巧');
    expect(s.content).toContain('内容');
  });
});

describe('matchSkills', () => {
  const skills = [
    { name: 'a-dht', triggers: ['dht11', '温湿度'], content: 'A', source: 'builtin' as const },
    { name: 'b-oled', triggers: ['oled'], content: 'B', source: 'builtin' as const },
    { name: 'c-stm32', triggers: ['stm32'], content: 'C', source: 'builtin' as const },
  ];

  it('按触发词命中并按得分排序', () => {
    const m = matchSkills('STM32 读取 DHT11 温湿度 OLED 显示', skills, { limit: 4 });
    const names = m.map((s) => s.name);
    expect(names).toContain('a-dht');
    expect(names).toContain('b-oled');
    expect(names).toContain('c-stm32');
    // dht11 + 温湿度 双命中应排最前
    expect(names[0]).toBe('a-dht');
  });

  it('无命中返回空数组', () => {
    expect(matchSkills('完全无关的需求 xyzzy', skills)).toEqual([]);
  });

  it('forceSkills 强制注入未命中的技能', () => {
    const m = matchSkills('无关需求', skills, { forceSkills: ['c-stm32'] });
    expect(m.map((s) => s.name)).toEqual(['c-stm32']);
  });

  it('limit 限制返回数量', () => {
    expect(matchSkills('stm32 dht11 oled', skills, { limit: 1 })).toHaveLength(1);
  });
});

describe('buildSkillsContext', () => {
  it('空数组返回空字符串', () => {
    expect(buildSkillsContext([])).toBe('');
  });

  it('拼接技能名与内容', () => {
    const ctx = buildSkillsContext([
      { name: 'demo', description: '', triggers: [], content: '知识正文', source: 'builtin' },
    ]);
    expect(ctx).toContain('demo');
    expect(ctx).toContain('知识正文');
  });
});

describe('installSkill', () => {
  it('复制 md 文件到用户技能目录并拒绝非 md', () => {
    const tmp = mkdtempSync(join(tmpdir(), 'ef-skills-'));
    try {
      const src = join(tmp, 'my-skill.md');
      writeFileSync(src, '---\nname: my-skill\n---\n正文', 'utf8');
      const destDir = join(tmp, 'user-skills');
      const { name } = installSkill(src, destDir);
      expect(name).toBe('my-skill');

      const bad = join(tmp, 'not-skill.txt');
      writeFileSync(bad, 'x', 'utf8');
      expect(() => installSkill(bad, destDir)).toThrow(/\.md/);
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  });
});

describe('loadAllSkills（内置技能库）', () => {
  it('能加载仓库内置技能', () => {
    const skills = loadAllSkills();
    expect(skills.length).toBeGreaterThanOrEqual(8);
    const names = skills.map((s) => s.name);
    expect(names).toContain('sensor-dht11');
    expect(names).toContain('stm32-gpio-clock');
    expect(names).toContain('code-review-checklist');
    for (const s of skills) {
      expect(s.content.length).toBeGreaterThan(50);
      expect(s.triggers.length).toBeGreaterThan(0);
    }
  });
});
