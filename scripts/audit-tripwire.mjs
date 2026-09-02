#!/usr/bin/env node
/**
 * 页面规范绊线（tripwire）。
 *
 * 定位：不追求覆盖率（完整覆盖由 LLM 审计负责），只用少量零误报的机械信号
 * 确保"审计一定会发生"。命中 error 级信号时以非零退出码失败，
 * 失败文案是写给 coding agent 看的：引导其执行完整审计流程。
 *
 * 维护原则：只加"grep 级、零误报"的规则；有歧义的判断一律交给
 * .agents/skills/forge-starter-audit（LLM 审计），不要在这里堆 AST 逻辑。
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;

const SCAN_DIRS = ["app/(app)", "app/(auth)", "components", "config"];
const EXTS = new Set([".tsx", ".ts"]);

/** 收集待扫描文件 */
function collect(dir, acc = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return acc;
  }
  for (const name of entries) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) collect(p, acc);
    else if (EXTS.has(name.slice(name.lastIndexOf(".")))) acc.push(p);
  }
  return acc;
}

const TAILWIND_PALETTE =
  "(?:red|blue|green|gray|grey|purple|violet|yellow|orange|pink|indigo|slate|zinc|neutral|stone|amber|lime|emerald|teal|cyan|sky|rose|fuchsia)";

/**
 * error 级：命中即失败。
 * 每条: { id, 说明, test(file, text) => [{line, snippet}] }
 */
const RULES = [
  {
    id: "V1-tailwind-default-color",
    level: "error",
    doc: "颜色只能用 fg-* token（audit-checklist V1）",
    pattern: new RegExp(
      `\\b(?:text|bg|border|from|to|via|ring|fill|stroke)-${TAILWIND_PALETTE}-\\d{2,3}\\b`,
      "g",
    ),
    // /ref 画廊为展示型历史债（生产默认 404），降级见 warn 版规则
    files: (f) => !f.includes("app/(app)/ref/"),
  },
  {
    id: "V1-tailwind-default-color-ref",
    level: "warn",
    doc: "/ref 画廊存在默认色历史债（audit-checklist 样板债），新页面禁止照抄",
    pattern: new RegExp(
      `\\b(?:text|bg|border|from|to|via|ring|fill|stroke)-${TAILWIND_PALETTE}-\\d{2,3}\\b`,
      "g",
    ),
    files: (f) => f.includes("app/(app)/ref/"),
  },
  {
    id: "C1-forbidden-ui-lib",
    level: "error",
    doc: "禁止引入第二 UI 库（audit-checklist C1）",
    pattern:
      /from\s+["'](?:antd|@mui\/[^"']+|element-plus|@arco-design\/[^"']+|@chakra-ui\/[^"']+|react-bootstrap)["']/g,
    files: () => true,
  },
  {
    id: "M1-menu-form-route",
    level: "error",
    doc: "主菜单不得挂表单/详情路由（audit-checklist M1）",
    pattern: /href:\s*["'][^"']*\/(?:new|edit)\/?["']/g,
    files: (f) => f.includes("config/menu"),
  },
  {
    id: "M4-menu-placeholder",
    level: "error",
    doc: "菜单不得有 # 占位项（audit-checklist M4）",
    pattern: /href:\s*["']#["']/g,
    files: (f) => f.includes("config/menu"),
  },
  {
    id: "M2-menu-icon-variant",
    level: "error",
    doc: "侧栏菜单 icon 必须 *BoldDuotone（audit-checklist M2）",
    // menu.tsx 里出现非 BoldDuotone 的 solar 图标 JSX
    pattern: /<[A-Z][A-Za-z]*(?:Linear|Outline|Broken|LineDuotone|Bold)\s/g,
    files: (f) => f.includes("config/menu"),
  },
  {
    id: "V3-icon-classname-color",
    level: "error",
    doc: "solar 图标禁止用 className 上色，走 color prop（audit-checklist V3）",
    // 大写开头组件 + className 含 text- 色（fg 或调色板）
    pattern: new RegExp(
      `<[A-Z][A-Za-z]*(?:Linear|Bold|BoldDuotone|Outline|Broken)\\s[^>]*className=["'][^"']*text-(?:fg-)?${TAILWIND_PALETTE}`,
      "g",
    ),
    files: () => true,
  },
  {
    id: "F4-inline-success-banner",
    level: "warn",
    doc: "疑似页内成功提示条，反馈应走 toast（audit-checklist F4）",
    pattern: /(?:创建成功|保存成功|操作成功)[^"']*["'][^\n]*(?:bg-fg-green|border-fg-green)/g,
    files: () => true,
  },
  {
    id: "C2-handwritten-table",
    level: "warn",
    doc: "疑似手搓 <table>，全页列表应使用 DataTable（audit-checklist C2）",
    pattern: /<table[\s>]/g,
    files: (f) => f.includes("app/(app)"),
  },
  {
    id: "C3-fake-sortable",
    level: "warn",
    doc: "sortable: true 只画 UI 不排序，确认已实现排序逻辑（audit-checklist C3）",
    pattern: /sortable:\s*true/g,
    files: (f) => !f.includes("app/(app)/ref/"),
  },
  {
    id: "V6-status-badge",
    level: "error",
    doc: "语义状态用 Kit StatusBadge 默认 soft；禁止 variant=\"solid\"、Label、本仓 StatusText（audit-checklist V6）",
    pattern: /\bStatusText\b|variant=["']solid["']|<Label\s/g,
    files: (f) =>
      !f.includes("app/(app)/ref/")
      && !f.includes("components/reference/"),
  },
];

const hits = { error: [], warn: [] };

for (const dir of SCAN_DIRS) {
  for (const file of collect(join(ROOT, dir))) {
    const rel = relative(ROOT, file);
    const text = readFileSync(file, "utf8");
    const lines = text.split("\n");
    for (const rule of RULES) {
      if (!rule.files(rel)) continue;
      for (const m of text.matchAll(rule.pattern)) {
        const line = text.slice(0, m.index).split("\n").length;
        hits[rule.level].push({
          rule,
          loc: `${rel}:${line}`,
          snippet: lines[line - 1].trim().slice(0, 120),
        });
      }
    }
  }
}

for (const h of hits.warn) {
  console.warn(`⚠ [${h.rule.id}] ${h.loc}\n    ${h.snippet}\n    ${h.rule.doc}`);
}
for (const h of hits.error) {
  console.error(`✖ [${h.rule.id}] ${h.loc}\n    ${h.snippet}\n    ${h.rule.doc}`);
}

if (hits.error.length > 0) {
  console.error(
    [
      "",
      `绊线检测到 ${hits.error.length} 处规范违规。这通常意味着本次改动未按 Forge 规范执行。`,
      "",
      ">>> 给 coding agent 的指令 <<<",
      "1. 阅读 docs/audit-checklist.md（页面规范单一事实来源）；",
      "2. 按 .agents/skills/forge-starter-audit/SKILL.md 对本次改动执行完整四步审计；",
      "3. 修复全部红线违规后重新运行 pnpm check。",
      "注意：绊线只覆盖极少数机械信号，通过绊线 ≠ 合规，完整审计不可省略。",
    ].join("\n"),
  );
  process.exit(1);
}

console.log(
  `tripwire ok（${hits.warn.length} 条警告）。提醒：绊线通过 ≠ 合规，页面改动仍须执行 forge-starter-audit 完整审计。`,
);
