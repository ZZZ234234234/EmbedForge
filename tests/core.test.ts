import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanCode } from '../src/core/generator.js';
import {
  PLATFORM_LIST,
  PLATFORM_TEMPLATES,
  defaultBuildSystem,
  getBuildFiles,
  renderSkeleton,
  supportedBuildSystems,
} from '../src/core/templates.js';
import { fallbackPlan, normalizeBuildSystem } from '../src/core/planner.js';
import { writeProject } from '../src/core/writer.js';
import type { ProjectPlan } from '../src/core/types.js';

const dirs: string[] = [];
afterEach(() => {
  for (const d of dirs.splice(0)) rmSync(d, { recursive: true, force: true });
});

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
  it('识别 pico / RP2040', () => {
    expect(fallbackPlan('树莓派 pico 读取 ADC').platform).toBe('pico');
    expect(fallbackPlan('RP2040 板载 LED').platform).toBe('pico');
  });
  it('识别 avr / atmega', () => {
    expect(fallbackPlan('atmega328p 串口通信').platform).toBe('avr');
  });
  it('识别 micropython', () => {
    expect(fallbackPlan('用 micropython 驱动 OLED').platform).toBe('micropython');
  });
  it('识别 zephyr', () => {
    expect(fallbackPlan('zephyr rtos 传感器采集').platform).toBe('zephyr');
  });
  it('micropython 优先级高于 esp32 关键词', () => {
    expect(fallbackPlan('ESP32 上跑 MicroPython 点灯').platform).toBe('micropython');
  });
  it('platformHint 优先', () => {
    expect(fallbackPlan('随便什么', 'esp32').platform).toBe('esp32');
  });
  it('默认文件清单来自平台模板', () => {
    const p = fallbackPlan('stm32f103 项目');
    expect(p.files.length).toBeGreaterThan(0);
    expect(p.files).toContain('Core/Src/app.c');
    expect(p.files).not.toContain('Core/Src/main.c'); // main.c 已模板化，AI 不生成
  });
  it('micropython 默认文件为 Python 脚本', () => {
    const p = fallbackPlan('micropython 温湿度');
    expect(p.files).toContain('main.py');
    expect(p.buildSystem).toBe('none (interpreted)');
  });
});

describe('platform list', () => {
  it('包含八个平台', () => {
    expect(PLATFORM_LIST.map((p) => p.id).sort()).toEqual(
      ['arduino', 'avr', 'esp32', 'generic-c', 'micropython', 'pico', 'stm32', 'zephyr'].sort(),
    );
  });
});

describe('构建系统模板', () => {
  it('STM32 支持四种构建系统，其余平台不支持切换', () => {
    expect(supportedBuildSystems('stm32')).toEqual(['make', 'cmake', 'keil', 'platformio']);
    for (const p of ['esp32', 'pico', 'zephyr', 'arduino', 'avr', 'generic-c', 'micropython']) {
      expect(supportedBuildSystems(p)).toEqual([]);
    }
  });

  it('STM32 四种构建系统都能读到真实构建文件', () => {
    const expected: Record<string, string> = {
      make: 'Makefile',
      cmake: 'CMakeLists.txt',
      keil: '{{PROJECT_NAME_SAFE}}.uvprojx',
      platformio: 'platformio.ini',
    };
    for (const [sys, file] of Object.entries(expected)) {
      const files = getBuildFiles('stm32', sys);
      expect(files.length, `${sys} 应至少有一个构建文件`).toBeGreaterThan(0);
      expect(files.map((f) => f.path)).toContain(file);
    }
  });

  it('构建文件不会被当成 STM32 骨架混进生成工程', () => {
    const skeleton = getBuildFiles('stm32', 'make').map((f) => f.path);
    // 骨架是 loadStm32Skeleton() 读出来的，这里反向确认构建模板目录没被卷进去
    expect(skeleton.some((p) => p.startsWith('buildsystems/'))).toBe(false);
  });

  it('未支持的构建系统回退到平台默认值', () => {
    expect(normalizeBuildSystem('stm32', 'cmake')).toBe('cmake');
    expect(normalizeBuildSystem('stm32', 'ninja')).toBe('make');
    expect(normalizeBuildSystem('esp32', 'make')).toBe('cmake');
    expect(normalizeBuildSystem('micropython', 'make')).toBe('none (interpreted)');
  });

  it('构建文件路径与内容中的占位符可被渲染', () => {
    const files = getBuildFiles('stm32', 'keil');
    const proj = files.find((f) => f.path.endsWith('.uvprojx'))!;
    const vars = { PROJECT_NAME: 'demo', PROJECT_NAME_SAFE: 'demo' };
    expect(renderSkeleton(proj.path, vars)).toBe('demo.uvprojx');
    expect(renderSkeleton(proj.content, vars)).toContain('<OutputName>demo</OutputName>');
  });

  it('构建文件里的标识符一律用 ASCII 占位符，不用中文工程名', () => {
    for (const sys of ['make', 'cmake', 'keil', 'platformio']) {
      for (const f of getBuildFiles('stm32', sys)) {
        // 注释行可以带可读中文名，但任何 {{PROJECT_NAME}}（未加 _SAFE）都意味着
        // 中文工程名会直接进 CMake target / Keil 工程名 / 产物文件名
        if (/^\s*(#|;|<!--)/.test(f.content.split('\n')[0])) continue;
        expect(f.content, `${sys}/${f.path} 不应直接使用 {{PROJECT_NAME}}`).not.toContain('{{PROJECT_NAME}}');
      }
      for (const f of getBuildFiles('stm32', sys)) {
        expect(f.path, `${sys} 文件名不应使用裸 {{PROJECT_NAME}}`).not.toContain('{{PROJECT_NAME}}.');
      }
    }
  });

  it('defaultBuildSystem 与各平台骨架实际构建文件一致', () => {
    expect(defaultBuildSystem('stm32')).toBe('make');
    expect(defaultBuildSystem('esp32')).toBe('cmake');
    expect(defaultBuildSystem('arduino')).toBe('platformio');
    expect(defaultBuildSystem('micropython')).toBe('none (interpreted)');
  });
});

describe('STM32 模板可编译性（实证回归）', () => {
  it('vendor 头文件不含 Markdown 代码围栏', () => {
    // 曾出现过整批 HAL/CMSIS 头文件首行被插入 ```c 的事故，
    // 编译器会直接报 stray '`' in program，这里锁死回归。
    for (const dir of ['templates/stm32/Drivers', 'templates/stm32/Core']) {
      const root = join(process.cwd(), dir);
      const stack = [root];
      while (stack.length) {
        const d = stack.pop()!;
        for (const e of readdirSync(d, { withFileTypes: true })) {
          const full = join(d, e.name);
          if (e.isDirectory()) { stack.push(full); continue; }
          if (!/\.(c|h|s)$/.test(e.name)) continue;
          const first = readFileSync(full, 'utf8').split('\n')[0];
          expect(first.startsWith('```'), `${full} 首行是代码围栏`).toBe(false);
        }
      }
    }
  });

  it('HAL 源文件与 hal_conf 启用的模块必须一一对应', () => {
    const halSrcDir = join(process.cwd(), 'templates/stm32/Drivers/STM32F1xx_HAL_Driver/Src');
    const confPath = join(process.cwd(), 'templates/stm32/Core/Inc/stm32f1xx_hal_conf.h');
    const srcs = readdirSync(halSrcDir).filter((f) => f.endsWith('.c'));
    const conf = readFileSync(confPath, 'utf8');

    // hal_conf 里生效的宏（排除注释块里的）
    const enabled = new Set<string>();
    for (const line of conf.split('\n')) {
      const m = line.match(/^#define\s+HAL_(\w+?)_MODULE_ENABLED/);
      if (m) enabled.add(m[1]);
    }

    // 每个 HAL 源文件都应有对应模块宏启用，否则该 .c 编译出来是空的
    for (const s of srcs) {
      // stm32f1xx_hal.c 是 HAL 核心（HAL_Init / HAL_Delay / HAL_IncTick），
      // 由 HAL_MODULE_ENABLED 控制，没有独立的 HAL_XXX_MODULE_ENABLED
      if (s === 'stm32f1xx_hal.c') {
        expect(conf, '核心 hal.c 需要 HAL_MODULE_ENABLED').toMatch(/^#define\s+HAL_MODULE_ENABLED/m);
        continue;
      }
      const mod = s.replace(/^stm32f1xx_hal_/, '').replace(/\.c$/, '').toUpperCase();
      const base = mod.replace(/_EX$/, '');
      expect(
        enabled.has(base) || enabled.has(mod),
        `${s} 存在但 hal_conf 未启用 HAL_${base}_MODULE_ENABLED`,
      ).toBe(true);
    }
  });

  it('system_stm32f1xx.c 提供 AHBPrescTable（HAL_RCC_ClockConfig 依赖）', () => {
    const p = join(process.cwd(), 'templates/stm32/Core/Src/system_stm32f1xx.c');
    const src = readFileSync(p, 'utf8');
    // 缺这个符号会导致链接期 undefined reference to `AHBPrescTable'
    expect(src).toMatch(/const\s+uint8_t\s+AHBPrescTable/);
    expect(src).toMatch(/const\s+uint8_t\s+APBPrescTable/);
  });

  it('Keil 工程提供 ARM 语法启动文件，且不与 GNU 版混用', () => {
    const keilDir = join(process.cwd(), 'templates/stm32/buildsystems/keil');
    const armStartup = join(keilDir, 'startup_stm32f103xb_arm.s');
    expect(existsSync(armStartup), '缺少 ARM 语法启动文件').toBe(true);
    // ARM 语法用分号注释与 AREA 伪指令；GNU 语法用 /* */ 与 .syntax unified
    const arm = readFileSync(armStartup, 'utf8');
    expect(arm).toMatch(/AREA\s+RESET/i);
    expect(arm).not.toMatch(/\.syntax\s+unified/);

    // uvprojx 必须引用的是 ARM 那份
    const uvprojx = readFileSync(join(keilDir, '{{PROJECT_NAME_SAFE}}.uvprojx'), 'utf8');
    expect(uvprojx).toContain('startup_stm32f103xb_arm.s');
  });

  it('Keil uvprojx 引用的骨架/驱动文件都真实存在', () => {
    const keilDir = join(process.cwd(), 'templates/stm32/buildsystems/keil');
    const uvprojx = readFileSync(join(keilDir, '{{PROJECT_NAME_SAFE}}.uvprojx'), 'utf8');
    const refs = [...uvprojx.matchAll(/<FilePath>\.\\([^<]+)<\/FilePath>/g)].map((m) =>
      m[1].replace(/\\/g, '/'),
    );
    const projRoot = join(process.cwd(), 'templates/stm32');
    for (const r of refs) {
      // app.c / app.h 是 AI 按需求生成的，模板目录里本来就没有
      if (r === 'Core/Src/app.c') continue;
      // Keil 模板里的启动文件放在 buildsystems/keil 下，其余在工程根
      const inRoot = join(projRoot, r);
      const inKeil = join(keilDir, r);
      expect(existsSync(inRoot) || existsSync(inKeil), `uvprojx 引用了不存在的文件: ${r}`).toBe(true);
    }
  });

  it('Keil 工程启用 scatter 文件，保证向量表落在 Flash 起始处', () => {
    const keilDir = join(process.cwd(), 'templates/stm32/buildsystems/keil');
    const uvprojx = readFileSync(join(keilDir, '{{PROJECT_NAME_SAFE}}.uvprojx'), 'utf8');
    // useFile=0（默认）时 armlink 会把 BL __scatterload 排到 0x08000000，
    // 向量表后移，芯片上电取到 BL 而非初始 SP，表现为不启动
    expect(uvprojx).toMatch(/<useFile>1<\/useFile>/);
    expect(uvprojx).toMatch(/<ScatterFile>\.\{\{PROJECT_NAME_SAFE\}\}\.sct<\/ScatterFile>/);

    const sct = readFileSync(join(keilDir, '{{PROJECT_NAME_SAFE}}.sct'), 'utf8');
    expect(sct).toMatch(/LR_IROM1\s+0x08000000/);
    expect(sct).toMatch(/RW_IRAM1\s+0x20000000/);
    // RESET 段必须 +First，否则向量表不在 0x08000000
    expect(sct).toMatch(/RESET,\s*\+First/);
  });

  it('Keil 工程启用 C99（BSP 驱动用了 for 内声明）', () => {
    const keilDir = join(process.cwd(), 'templates/stm32/buildsystems/keil');
    const uvprojx = readFileSync(join(keilDir, '{{PROJECT_NAME_SAFE}}.uvprojx'), 'utf8');
    // AC5 默认 C90：for (int i=0; ...) 会报 #29: expected an expression
    expect(uvprojx).toMatch(/<uC99>1<\/uC99>/);
  });

  it('构建系统模板文件不带 UTF-8 BOM', () => {
    // uvprojx 带 BOM 时 UV4 直接拒绝打开工程（返回 15 且不产生日志）；
    // Makefile 带 BOM 时 make 报 "missing separator"。
    // 这两个坑都实际踩过，用文件字节锁死。
    const roots = [
      join(process.cwd(), 'templates/stm32/buildsystems'),
    ];
    for (const root of roots) {
      const stack = [root];
      while (stack.length) {
        const d = stack.pop()!;
        for (const e of readdirSync(d, { withFileTypes: true })) {
          const full = join(d, e.name);
          if (e.isDirectory()) { stack.push(full); continue; }
          const b = readFileSync(full);
          const hasBom = b.length >= 3 && b[0] === 0xef && b[1] === 0xbb && b[2] === 0xbf;
          expect(hasBom, `${full} 带 UTF-8 BOM`).toBe(false);
        }
      }
    }
  });

  it('生成的构建文件不带 BOM（writer 会剥掉）', () => {
    const out = mkdtempSync(join(tmpdir(), 'ef-bom-'));
    dirs.push(out);
    const plan: ProjectPlan = {
      projectName: 'demo',
      platform: 'stm32',
      target: 'STM32F103C8T6',
      summary: 'demo',
      modules: [],
      pinout: [],
      files: [],
      buildSystem: 'make',
    };
    // 故意在内容开头塞 BOM，模拟编辑器存成带 BOM 的 UTF-8
    writeProject(out, plan, [
      { path: 'Makefile', status: 'ok', content: '\uFEFFall:\n' },
    ]);
    const b = readFileSync(join(out, 'Makefile'));
    expect(b[0]).not.toBe(0xef);
    expect(b.toString('utf8').startsWith('all:')).toBe(true);
  });

  it('Keil 工程的 Core 组包含 app.c（AI 生成的入口实现）', () => {
    const keilDir = join(process.cwd(), 'templates/stm32/buildsystems/keil');
    const uvprojx = readFileSync(join(keilDir, '{{PROJECT_NAME_SAFE}}.uvprojx'), 'utf8');
    // app.c 不进分组时，UV4 链接阶段报 L6218E: Undefined symbol app_init
    expect(uvprojx).toMatch(/<FilePath>\.\\Core\\Src\\app\.c<\/FilePath>/);
  });

  it('Arduino 模板的 -D 宏名是合法 C 标识符（不含中文）', () => {
    const tpl = PLATFORM_TEMPLATES.arduino.skeleton.find((s) => s.path === 'platformio.ini')!;
    const rendered = renderSkeleton(tpl.content, {
      PROJECT_NAME: 'led-闪烁加按键',
      PROJECT_NAME_SAFE_UPPER: 'LED',
    });
    for (const m of rendered.matchAll(/-D(\w+)=/g)) {
      expect(/^[A-Za-z_][A-Za-z0-9_]*$/.test(m[1]), `非法宏名: ${m[1]}`).toBe(true);
    }
  });
});
