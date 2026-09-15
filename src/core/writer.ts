import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { PLATFORM_TEMPLATES } from './templates.js';
import type { GeneratedFileResult, ProjectPlan, ReviewResult } from './types.js';

function buildProjectReadme(plan: ProjectPlan, aiFailed: GeneratedFileResult[], review?: ReviewResult | null): string {
  const template = PLATFORM_TEMPLATES[plan.platform];
  const lines: string[] = [];
  lines.push(`# ${plan.projectName}`);
  lines.push('');
  lines.push(`> ${plan.summary}`);
  lines.push('');
  lines.push('## 项目信息');
  lines.push('');
  lines.push(`- 平台：${template.info.name}`);
  lines.push(`- 目标芯片/开发板：${plan.target}`);
  lines.push(`- 构建系统：${plan.buildSystem}`);
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
  [...template.skeleton.map((s) => s.path), ...plan.files].forEach((p) => tree.add(p));
  [...tree].sort().forEach((p) => lines.push(`└─ ${p}`));
  lines.push('```');
  lines.push('');
  lines.push('## 构建与烧录');
  lines.push('');
  lines.push(template.info.buildHint);
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
    writeFileSync(abs, f.content ?? '', 'utf8');
  }

  const failed = files.filter((f) => f.status === 'error');
  const readmePath = 'README.md';
  const readmeContent = buildProjectReadme(plan, failed, review);
  writeFileSync(join(outDir, readmePath), readmeContent, 'utf8');

  return { outDir: relative(process.cwd(), outDir) || outDir, writtenCount: okFiles.length + 1 };
}
