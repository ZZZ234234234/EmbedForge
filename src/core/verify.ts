import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import type { VerifyResult } from './types.js';

export type { VerifyResult };


/** 一步命令 */
interface Step {
  cmd: string;
  args: string[];
}

/** 各构建系统对应的探测命令与产物路径 */
interface BuildSpec {
  /** 探测工具链可用的命令（如 --version） */
  probe: Step;
  /** 实际编译命令，按顺序执行；任一步失败即整体失败 */
  build: Step[];
  /** 相对工程根目录的产物候选路径 */
  artifacts: string[];
  /** 产物文件名优先级（越靠前越优先），用于排除 CMake 的编译器探测文件 */
  preferNames?: RegExp;
}

const SPECS: Record<string, BuildSpec> = {
  make: {
    probe: { cmd: 'make', args: ['--version'] },
    build: [{ cmd: 'make', args: [] }],
    artifacts: ['build', 'out'],
  },
  cmake: {
    probe: { cmd: 'cmake', args: ['--version'] },
    // 必须先 configure 再 build：单跑 --preset 只会生成构建系统，不产出固件
    build: [
      { cmd: 'cmake', args: ['--preset', 'debug'] },
      { cmd: 'cmake', args: ['--build', '--preset', 'debug'] },
    ],
    artifacts: ['build', 'build-release'],
    // 排除 CMake 编译器探测产生的 CMakeDetermineCompilerABI_C.bin
    preferNames: /^(?!CMakeDetermine).*\.(bin|elf)$/i,
  },
  platformio: {
    probe: { cmd: 'pio', args: ['--version'] },
    build: [{ cmd: 'pio', args: ['run'] }],
    artifacts: ['.pio/build'],
  },
};

/** 从编译输出里摘出关键错误行，避免整篇日志刷屏 */
export function extractErrors(output: string, limit = 12): string[] {
  const lines = output.split(/\r?\n/);
  const bad = lines.filter((l) =>
    /(\berror\b|错误|undefined reference|No such file|fatal error|C\d{4}E|L\d{4}E|\*\*\*)/i.test(l),
  );
  return bad.slice(0, limit).map((l) => l.trim()).filter(Boolean);
}

/** 递归找目录下最新的产物（.elf/.bin/.hex/.axf/.uf2） */
function findArtifact(
  root: string,
  depth = 0,
  preferNames?: RegExp,
): { path: string; size: number } | null {
  if (!existsSync(root) || depth > 4) return null;
  type Candidate = { path: string; size: number; mtime: number };
  const found: Candidate[] = [];
  const walk = (dir: string, d: number): void => {
    if (d > 4) return;
    let entries: string[];
    try {
      entries = readdirSync(dir, { withFileTypes: true })
        .map((e) => e.name);
    } catch {
      return;
    }
    for (const name of entries) {
      const full = join(dir, name);
      try {
        const st = statSync(full);
        if (st.isDirectory()) {
          walk(full, d + 1);
          continue;
        }
        if (!/\.(elf|bin|hex|axf|uf2)$/i.test(name)) continue;
        // 有优先规则时，不符合的直接跳过（如 CMake 的编译器探测产物）
        if (preferNames && !preferNames.test(name)) continue;
        found.push({ path: full, size: st.size, mtime: st.mtimeMs });
      } catch {
        /* 忽略无权访问项 */
      }
    }
  };
  walk(root, depth);
  if (!found.length) return null;
  // 取最新生成的产物（同一构建可能同时留下 .elf 与 .bin）
  found.sort((a, b) => b.mtime - a.mtime);
  return { path: found[0].path, size: found[0].size };
}

/**
 * 在生成工程目录里尝试编译，验证源码真能过工具链。
 *
 * 设计要点：
 * - 工具链缺失时返回 attempted=false 与明确原因，不当作失败（用户环境问题，不是代码问题）
 * - 只做本地构建，不上传任何东西
 * - 输出截断，避免终端刷屏
 */
export function verifyProject(
  projectDir: string,
  buildSystem: string,
  opts: { timeoutMs?: number; cwd?: string; env?: Record<string, string> } = {},
): VerifyResult {
  const started = Date.now();
  const key = (buildSystem || '').trim().toLowerCase();
  const spec = SPECS[key];

  const done = (r: Omit<VerifyResult, 'elapsedMs'>): VerifyResult => ({
    ...r,
    elapsedMs: Date.now() - started,
  });

  if (!spec) {
    return done({
      attempted: false,
      ok: false,
      command: '',
      exitCode: null,
      output: '',
      reason: `构建系统 "${buildSystem}" 不支持自动编译验证（支持：${Object.keys(SPECS).join(' / ')}）`,
    });
  }

  // 1) 探测工具链
  const probe = spawnSync(spec.probe.cmd, spec.probe.args, {
    cwd: opts.cwd ?? projectDir,
    encoding: 'utf8',
    timeout: 20_000,
    shell: false,
  });
  if (probe.error || probe.status !== 0) {
    return done({
      attempted: false,
      ok: false,
      command: `${spec.probe.cmd} ${spec.probe.args.join(' ')}`,
      exitCode: null,
      output: '',
      reason: `未找到可用的 ${spec.probe.cmd}（请先安装对应工具链）`,
    });
  }

  // 2) 依次执行构建步骤，任一步失败即终止
  const buildCmd = spec.build.map((s) => `${s.cmd} ${s.args.join(' ')}`.trim()).join(' && ');
  const env = { ...process.env, ...(opts.env ?? {}), PLATFORMIO_SETTING_ENABLE_TELEMETRY: 'no' };
  const timeouts = opts.timeoutMs ?? 300_000;
  const outs: string[] = [];

  for (const step of spec.build) {
    const res = spawnSync(step.cmd, step.args, {
      cwd: projectDir,
      encoding: 'utf8',
      timeout: timeouts,
      shell: false,
      env,
    });
    const stepOut = `${res.stdout ?? ''}\n${res.stderr ?? ''}`;
    outs.push(stepOut);

    const stepOk = !res.error && res.status === 0;
    if (!stepOk) {
      const rawOut = outs.join('\n');
      const output = rawOut.length > 8000 ? `…（前部省略）\n${rawOut.slice(-8000)}` : rawOut;
      return done({
        attempted: true,
        ok: false,
        command: buildCmd,
        exitCode: res.status ?? null,
        output,
        reason: res.error
          ? res.error.message
          : `步骤 \`${step.cmd} ${step.args.join(' ')}\` 失败`,
      });
    }
  }

  const rawOut = outs.join('\n');
  // 编译日志可能极长，仅保留尾部
  const output = rawOut.length > 8000 ? `…（前部省略）\n${rawOut.slice(-8000)}` : rawOut;

  // 3) 找产物
  let artifact: { path: string; size: number } | null = null;
  for (const rel of spec.artifacts) {
    const dir = join(projectDir, rel);
    if (!existsSync(dir)) continue;
    artifact = findArtifact(dir, 0, spec.preferNames);
    if (artifact) break;
  }

  return done({
    attempted: true,
    ok: true,
    command: buildCmd,
    exitCode: 0,
    output,
    artifact: artifact?.path,
    artifactSize: artifact?.size,
  });
}

/** 把验证结果格式化为一行可读文本（写入工程 README / 终端） */
export function formatVerifyResult(r: VerifyResult): string {
  if (!r.attempted) {
    return `⚪ 未执行编译验证：${r.reason ?? '未知原因'}`;
  }
  if (r.ok) {
    const size = r.artifactSize != null ? `，产物 ${r.artifactSize} 字节` : '';
    return `✅ 编译验证通过（${r.command}，${(r.elapsedMs / 1000).toFixed(1)}s${size}）`;
  }
  const errs = extractErrors(r.output, 3);
  return `❌ 编译验证失败（${r.command}，退出码 ${r.exitCode}）${errs.length ? `\n   ${errs.join('\n   ')}` : ''}`;
}
