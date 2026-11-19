import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { PLATFORM_TEMPLATES, getBuildFiles } from './templates.js';
import type { GeneratedFileResult, ProjectPlan, ReviewResult } from './types.js';

/** 构建系统 -> 生成工程里应该看到的构建文件特征 */
const BUILD_FILE_SIGNATURES: Record<string, string[]> = {
  make: ['Makefile', 'makefile', 'GNUmakefile'],
  cmake: ['CMakeLists.txt'],
  keil: ['.uvprojx', '.uvproj'],
  platformio: ['platformio.ini'],
};

/** 判断某构建系统是否真的在生成工程里落下了构建文件 */
export function hasBuildFile(plan: ProjectPlan, filePaths: string[]): boolean {
  const key = (plan.buildSystem || '').trim().toLowerCase();
  const sigs = BUILD_FILE_SIGNATURES[key];
  // 非四类构建系统（如 micropytohn 的 'none (interpreted)'）不校验
  if (!sigs) return true;
  return filePaths.some((p) => {
    const base = p.split('/').pop() ?? p;
    return sigs.some((sig) => (sig.startsWith('.') ? base.endsWith(sig) : base === sig));
  });
}

function buildProjectReadme(
  plan: ProjectPlan,
  aiFailed: GeneratedFileResult[],
  review?: ReviewResult | null,
  writtenPaths: string[] = [],
): string {
  const template = PLATFORM_TEMPLATES[plan.platform];
  const buildFiles = getBuildFiles(plan.platform, plan.buildSystem);
  const buildFilesPresent = hasBuildFile(plan, writtenPaths.length ? writtenPaths : buildFiles.map((b) => b.path));
  const lines: string[] = [];
  lines.push(`# ${plan.projectName}`);
  lines.push('');
  lines.push(`> ${plan.summary}`);
  lines.push('');
  lines.push('## 项目信息');
  lines.push('');
  lines.push(`- 平台：${template.info.name}`);
  lines.push(`- 目标芯片/开发板：${plan.target}`);
  lines.push(`- 构建系统：${buildFilesPresent ? plan.buildSystem : `${plan.buildSystem}（未生成构建文件，见下方说明）`}`);
  lines.push('');
  if (plan.modules.length) {
    lines.push('## 功能模块');
    lines.push('');
    plan.modules.forEach((m) => lines.push(`- ${m}`));
    lines.push('');
  }
  if (plan.pinout.length) {
    lines.push('## 引脚分配');
    lines.push('');
    lines.push('| 引脚 | 信号 | 说明 |');
    lines.push('| --- | --- | --- |');
    plan.pinout.forEach((p) => lines.push(`| ${p.pin} | ${p.signal} | ${p.note ?? '-'} |`));
    lines.push('');
  }
  lines.push('## 目录结构');
  lines.push('');
  lines.push('```text');
  const tree = new Set<string>();
  [
    ...template.skeleton.map((s) => s.path),
    ...buildFiles.map((b) => b.path),
    ...plan.files,
  ].forEach((p) => tree.add(p));
  [...tree].sort().forEach((p) => lines.push(`└─ ${p}`));
  lines.push('```');
  lines.push('');
  lines.push('## 构建与烧录');
  lines.push('');
  if (buildFilesPresent) {
    lines.push(template.info.buildHint);
  } else {
    // 该构建系统没有模板文件：如实说明，不要把用户引到一个不存在的 Makefile 上
    lines.push(
      `⚠️ 当前平台模板尚未提供 \`${plan.buildSystem}\` 构建文件（${plan.platform}）。`,
    );
    lines.push('');
    lines.push('工程源码、启动文件与链接脚本是完整的，你可以：');
    lines.push('');
    lines.push('- 改用 `--build-system make` 重新生成（若该平台支持）');
    lines.push('- 或用 STM32CubeMX / IDE 新建同型号空工程后，把本目录的 `Core/` 与 `Drivers/` 覆盖进去');
    lines.push('');
    lines.push(`参考构建方式：${template.info.buildHint}`);
  }
  if (review && review.issues.length) {
    lines.push('');
    lines.push('## 📋 AI 代码审查记录');
    lines.push('');
    lines.push('资深工程师视角的自动审查结果（已尽力自动修复 high/medium 问题，低级问题请自行确认）：');
    lines.push('');
    for (const i of review.issues) {
      lines.push(`- **[${i.severity}]** \`${i.file}\`：${i.description}`);
    }
  }
  if (aiFailed.length) {
    lines.push('');
    lines.push('## ⚠️ 生成提示');
    lines.push('');
    lines.push('以下文件由 AI 生成时失败，请手动补充或重新生成：');
    aiFailed.forEach((f) => lines.push(`- ${f.path}：${f.error ?? '未知错误'}`));
  }
  lines.push('');
  return lines.join('\n');
}

export interface WriteResult {
  outDir: string;
  writtenCount: number;
}

/**
 * 去掉 UTF-8 BOM。
 * uvprojx 带 BOM 时 Keil uVision 会直接拒绝打开工程（UV4 -b 返回 15 且不产生日志），
 * Makefile 带 BOM 时 make 报 "missing separator"。构建系统文件必须是无 BOM 的纯 UTF-8。
 */
function stripBom(text: string): string {
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
}

/** 将工程文件写入磁盘，并生成工程 README（可附带审查记录） */
export function writeProject(
  outDir: string,
  plan: ProjectPlan,
  files: GeneratedFileResult[],
  review?: ReviewResult | null,
): WriteResult {
  mkdirSync(outDir, { recursive: true });

  const okFiles = files.filter((f) => f.status === 'ok' && f.content != null);
  for (const f of okFiles) {
    const abs = join(outDir, f.path);
    mkdirSync(dirname(abs), { recursive: true });
    writeFileSync(abs, stripBom(f.content ?? ''), 'utf8');
  }

  const failed = files.filter((f) => f.status === 'error');
  const readmePath = 'README.md';
  const readmeContent = buildProjectReadme(
    plan,
    failed,
    review,
    okFiles.map((f) => f.path),
  );
  writeFileSync(join(outDir, readmePath), stripBom(readmeContent), 'utf8');

  return { outDir: relative(process.cwd(), outDir) || outDir, writtenCount: okFiles.length + 1 };
}
