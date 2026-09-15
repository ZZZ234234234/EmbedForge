import { describe, expect, it } from 'vitest';
import { cleanCode } from '../src/core/generator.js';
import { PLATFORM_LIST, renderSkeleton } from '../src/core/templates.js';
import { fallbackPlan } from '../src/core/planner.js';

describe('renderSkeleton', () => {
  it('替换 {{NAME}} 占位符', () => {
    const out = renderSkeleton('# {{PROJECT_NAME}}', { PROJECT_NAME: 'demo' });
    expect(out).toBe('# demo');
  });
  it('未定义的占位符替换为空', () => {
    const out = renderSkeleton('a{{MISSING}}b', {});
    expect(out).toBe('ab');
  });
});

describe('cleanCode', () => {
  it('去除代码围栏', () => {
    const out = cleanCode('```c\nint main(void){ return 0; }\n```');
    expect(out).toContain('int main(void)');
    expect(out).not.toContain('```');
  });
  it('保留无围栏代码并补换行', () => {
    expect(cleanCode('int x = 1;')).toBe('int x = 1;\n');
  });
});

describe('fallbackPlan', () => {
  it('识别 esp32', () => {
    expect(fallbackPlan('ESP32 读取温湿度传感器').platform).toBe('esp32');
  });
  it('识别 stm32', () => {
    expect(fallbackPlan('stm32f103 HAL 项目').platform).toBe('stm32');
  });
  it('识别 arduino', () => {
    expect(fallbackPlan('arduino uno 呼吸灯').platform).toBe('arduino');
  });
  it('无关键词时用 generic-c', () => {
    expect(fallbackPlan('做一个 LED 闪烁程序').platform).toBe('generic-c');
  });
  it('platformHint 优先', () => {
    expect(fallbackPlan('随便什么', 'esp32').platform).toBe('esp32');
  });
  it('默认文件清单来自平台模板', () => {
    const p = fallbackPlan('stm32f103 项目');
    expect(p.files.length).toBeGreaterThan(0);
    expect(p.files).toContain('Core/Src/main.c');
  });
});

describe('platform list', () => {
  it('包含四个平台', () => {
    expect(PLATFORM_LIST.map((p) => p.id).sort()).toEqual([
      'arduino',
      'esp32',
      'generic-c',
      'stm32',
    ]);
  });
});
