#!/usr/bin/env node
import { readFileSync, readdirSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SCAN_DIRS = ["app", "components", "config"];
const PALETTE = "(?:red|blue|green|gray|grey|purple|violet|yellow|orange|pink|indigo|slate|zinc|neutral|stone|amber|lime|emerald|teal|cyan|sky|rose|fuchsia)";
const LEGACY_ICONS = /^(?:solar-icon-set|@solar-icons\/react(?:\/.*)?|lucide-react|@heroicons\/react(?:\/.*)?|react-icons(?:\/.*)?)$/;
const SECOND_UI = /^(?:antd|@mui\/.*|element-plus|@arco-design\/.*|@chakra-ui\/.*|react-bootstrap)$/;
const HEX = /#[\da-f]{3,4}(?:[\da-f]{2}){0,2}\b/gi;

function collect(directory) {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...collect(path));
    else if (/\.[jt]sx?$/.test(entry.name)) files.push(path);
  }
  return files;
}

function reference(path) {
  return path.includes("app/(app)/ref/") || path.includes("components/reference/");
}

function literalParts(node) {
  if (ts.isStringLiteralLike(node)) return [node.text];
  if (ts.isJsxExpression(node) && node.expression) return literalParts(node.expression);
  if (ts.isTemplateExpression(node)) {
    return [node.head.text, ...node.templateSpans.flatMap((span) => [...literalParts(span.expression), span.literal.text])];
  }
  if (ts.isConditionalExpression(node)) return [...literalParts(node.whenTrue), ...literalParts(node.whenFalse)];
  if (ts.isBinaryExpression(node)) return [...literalParts(node.left), ...literalParts(node.right)];
  if (ts.isCallExpression(node)) return node.arguments.flatMap(literalParts);
  if (ts.isArrayLiteralExpression(node)) return node.elements.flatMap(literalParts);
  return [];
}

export function inspectSource(text, path) {
  const source = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const imports = new Map();
  const findings = [];
  function add(id, level, node, message) {
    const line = source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1;
    if (!findings.some((finding) => finding.id === id && finding.line === line)) {
      findings.push({ id, level, path, line, message });
    }
  }
  for (const statement of source.statements) {
    if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)) continue;
    const module = statement.moduleSpecifier.text;
    const bindings = statement.importClause?.namedBindings;
    if (bindings && ts.isNamedImports(bindings)) {
      for (const element of bindings.elements) {
        imports.set(element.name.text, { module, name: element.propertyName?.text ?? element.name.text });
      }
    } else if (bindings && ts.isNamespaceImport(bindings)) {
      imports.set(bindings.name.text, { module, namespace: true });
    }
    if (LEGACY_ICONS.test(module)) add("V3-icon-entry", "error", statement, "Solar 图标只从 @forge-ui-official/core/icons 导入");
    if (SECOND_UI.test(module)) add("C1-forbidden-ui-lib", "error", statement, "禁止引入第二 UI 库");
    if (/^@forge-ui-official\/core\/(?:dist|src|components)\//.test(module)
      || /^@\/components\/(?:ui\/)?status-text$/.test(module)) {
      add("C1-legacy-import", "error", statement, "禁止旧私有路径/StatusText 入口，使用 core 公开导出");
    }
  }
  function bindingFor(name) {
    if (ts.isIdentifier(name)) return imports.get(name.text);
    if (ts.isPropertyAccessExpression(name) && ts.isIdentifier(name.expression)) {
      const binding = imports.get(name.expression.text);
      if (binding?.namespace) return { module: binding.module, name: name.name.text };
    }
  }
  function visit(node) {
    if (ts.isStringLiteralLike(node)) {
      const defaults = new RegExp(`\\b(?:text|bg|border|from|to|via|ring|fill|stroke)-${PALETTE}-\\d{2,3}\\b`);
      if (defaults.test(node.text)) add("V1-tailwind-default-color", reference(path) ? "warn" : "error", node, "颜色使用 fg-* token");
    }
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const binding = bindingFor(node.tagName);
      const attributes = node.attributes.properties.filter(ts.isJsxAttribute);
      const attribute = (name) => attributes.find((entry) => entry.name.getText(source) === name);
      const classes = literalParts(attribute("className")?.initializer ?? node).join(" ");
      if (binding?.module === "@forge-ui-official/core/icons" && path.includes("config/menu")) {
        if (!binding.name.endsWith("BoldDuotone")) add("M2-menu-icon-variant", "error", node, "侧栏菜单图标使用 BoldDuotone");
        const size = attribute("size")?.initializer;
        if (!size || !ts.isJsxExpression(size) || !size.expression || size.expression.getText(source) !== "20") {
          add("M2-menu-icon-size", "error", node, "侧栏菜单图标显式 size={20}");
        }
      }
      if (binding?.module === "@forge-ui-official/core" && binding.name === "PageHeader"
        && path.includes("app/(app)/") && path.endsWith("page.tsx") && !reference(path)) {
        add("H6-pageheader-in-page", "warn", node, "实际使用 PageHeader；按主 Screen 与 AppLayout 壳上下文复核，不能仅凭 import 定罪");
      }
      if (!reference(path) && binding?.module === "@forge-ui-official/core") {
        if (binding.name === "Label" || binding.name === "StatusText"
          || (binding.name === "StatusBadge" && literalParts(attribute("variant")?.initializer ?? node).includes("solid"))) {
          add("V6-status-badge", "error", node, "语义状态用默认 soft StatusBadge；分类/角色用纯文字");
        }
      }
      if (node.tagName.getText(source) === "h1" && /\btext-fg-grey-[3456]00\b/.test(classes)) {
        add("V7-grey-heading", "error", node, "h1 主标题用 text-fg-black，禁止 grey-300/400/500/600");
      }
      const defaults = new RegExp(`\\b(?:text|bg|border|from|to|via|ring|fill|stroke)-${PALETTE}-\\d{2,3}\\b`);
      if (defaults.test(classes)) add("V1-tailwind-default-color", reference(path) ? "warn" : "error", node, "颜色使用 fg-* token");
      if (/\bbg-fg-green-\d+\b/.test(classes) && /成功/.test(node.parent.getText(source))) {
        add("F4-inline-success", "warn", node, "操作成功反馈使用全局 toast；按上下文排除正常状态展示");
      }
      if (node.tagName.getText(source) === "table" && path.includes("app/(app)/")) {
        add("C2-handwritten-table", "warn", node, "按页面角色复核原生 table，完整列表优先 DataTable");
      }
      for (const entry of attributes) {
        if (!entry.initializer || entry.name.getText(source) === "style") continue;
        const name = entry.name.getText(source);
        if (name === "className" || /^(?:color|fill|stroke|backgroundColor|borderColor)$/.test(name)) {
          for (const value of literalParts(entry.initializer)) {
            if (HEX.test(value) || /(?:rgb|hsl)a?\(/i.test(value)) {
              add("V4-hardcoded-color", "warn", entry, "硬编码颜色，按主清单复核并改用 fg token；既有债不能作为新页面范式");
            }
            HEX.lastIndex = 0;
          }
        }
      }
    }
    if (ts.isPropertyAssignment(node)) {
      const name = node.name.getText(source).replace(/["']/g, "");
      if (path.includes("config/menu") && name === "href" && ts.isStringLiteralLike(node.initializer)) {
        const href = node.initializer.text;
        if (href === "#") add("M4-menu-placeholder", "error", node, "菜单不得使用 # 占位");
        if (/\/(?:new|edit)(?:\/|$)|\/ref(?:\/|$)|\[[^\]]+\]/.test(href)) {
          add("M1-menu-form-route", "error", node, "主菜单只挂模块入口，不挂表单、详情或参考页");
        }
      }
      if (name === "sortable" && node.initializer.kind === ts.SyntaxKind.TrueKeyword && !reference(path)) {
        add("C3-fake-sortable", "warn", node, "sortable 仅画 UI，须另验真实排序");
      }
      if (/^(?:color|backgroundColor|background|borderColor|fill|stroke)$/.test(name)) {
        for (const value of literalParts(node.initializer)) {
          if (HEX.test(value) || /(?:rgb|hsl)a?\(/i.test(value)) {
            add("V4-hardcoded-color", "warn", node, "硬编码颜色，需人工核 tokens 与允许例外");
          }
          HEX.lastIndex = 0;
        }
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
  return findings;
}

export function audit(root = ROOT) {
  return SCAN_DIRS.flatMap((directory) => collect(join(root, directory)))
    .flatMap((path) => inspectSource(readFileSync(path, "utf8"), relative(root, path)));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const findings = audit();
  for (const finding of findings) {
    console[finding.level === "error" ? "error" : "warn"](`${finding.level === "error" ? "✖" : "⚠"} [${finding.id}] ${finding.path}:${finding.line} ${finding.message}`);
  }
  const errors = findings.filter((finding) => finding.level === "error");
  if (errors.length) {
    console.error(`${errors.length} 处红线：读 docs/audit-checklist.md 与主仓 forge-skill 唯一清单，按 forge-starter-audit 完整审计，修复后重跑 pnpm check。`);
    process.exitCode = 1;
  } else {
    console.log(`tripwire ok（${findings.length} 条警告）；仅检查机械子集，不代表完整规范审计或浏览器验收通过。`);
  }
}
