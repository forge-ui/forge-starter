import { sourceFingerprint } from "./fingerprint";
export { sourceFingerprint } from "./fingerprint";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { relative, resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { Project, Node, SyntaxKind } from "ts-morph";
import { moduleContracts, CONTRACT_VERSION } from "../../lib/semantic/contracts";

export type Evidence = { file: string; line: number; endLine: number; hash: string };
export type Fact = { id: string; kind: string; label: string; evidence: Evidence[]; origin: "extracted" | "declared"; module?: string };
export type Edge = { from: string; to: string; kind: string; evidence: Evidence; origin: "extracted" | "declared" };
export type Index = { version: string; snapshotId: string; commit: string; files: Record<string, string>; facts: Fact[]; edges: Edge[]; unresolved: Array<{ file: string; line: number; reason: string }>; elapsedMs: number };
export const hash = (s: string) => createHash("sha256").update(s).digest("hex");

export function buildIndex(root: string): Index {
  const started = Date.now();
  const project = new Project({ tsConfigFilePath: resolve(root, "tsconfig.json"), skipAddingFilesFromTsConfig: true });
  project.addSourceFilesAtPaths(["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}", "lib/**/*.{ts,tsx}", "config/**/*.{ts,tsx}"].map((p) => resolve(root, p)));
  const sources = project.getSourceFiles().filter((f) => !f.getFilePath().includes("/ref/") && !f.getFilePath().includes("/reference/"));
  const files: Record<string, string> = {};
  for (const source of sources) files[relative(root, source.getFilePath())] = hash(source.getFullText());
  const facts: Fact[] = [], edges: Edge[] = [], unresolved: Index["unresolved"] = [];
  const included = new Set(Object.keys(files));
  function evidence(node: Node): Evidence {
    const file = relative(root, node.getSourceFile().getFilePath());
    return { file, line: node.getStartLineNumber(), endLine: node.getEndLineNumber(), hash: files[file] ?? "" };
  }
  function symbolId(node: Node) {
    const file = relative(root, node.getSourceFile().getFilePath());
    const named = node as Node & { getName?: () => string | undefined };
    const parent = node.getParent();
    const local = (Node.isVariableDeclaration(node) && parent?.getParent()?.getParent()?.getKind() !== SyntaxKind.SourceFile)
      || (Node.isFunctionDeclaration(node) && parent?.getKind() !== SyntaxKind.SourceFile);
    return `symbol:${file}#${named.getName?.() || "default"}${local ? `@${node.getStart()}` : ""}`;
  }
  for (const source of sources) {
    const file = relative(root, source.getFilePath());
    facts.push({ id: `file:${file}`, kind: /page\.tsx$/.test(file) ? "page-source" : /route\.ts$/.test(file) ? "api-source" : "file", label: file, evidence: [evidence(source)], origin: "extracted" });
    for (const declaration of source.getImportDeclarations()) {
      const target = declaration.getModuleSpecifierSourceFile();
      const path = target && relative(root, target.getFilePath());
      if (path && included.has(path)) edges.push({ from: `file:${file}`, to: `file:${path}`, kind: "imports", evidence: evidence(declaration), origin: "extracted" });
    }
    for (const node of source.getDescendants()) {
      if (Node.isFunctionDeclaration(node) || Node.isVariableDeclaration(node) || Node.isInterfaceDeclaration(node) || Node.isTypeAliasDeclaration(node)) {
        facts.push({ id: symbolId(node), kind: "symbol", label: node.getName() || "default", evidence: [evidence(node)], origin: "extracted" });
        edges.push({ from: `file:${file}`, to: symbolId(node), kind: "declares", evidence: evidence(node), origin: "extracted" });
      }
      if (Node.isIdentifier(node)) {
        let ref = node.getSymbol();
        if (ref?.isAlias()) ref = ref.getAliasedSymbol();
        for (const declaration of ref?.getDeclarations() ?? []) {
          const path = relative(root, declaration.getSourceFile().getFilePath());
          if (included.has(path) && (Node.isFunctionDeclaration(declaration) || Node.isVariableDeclaration(declaration) || Node.isTypeAliasDeclaration(declaration) || Node.isInterfaceDeclaration(declaration))) {
            if (node.getParent() === declaration) continue;
            edges.push({ from: `file:${file}`, to: symbolId(declaration), kind: "references", evidence: evidence(node), origin: "extracted" });
          }
        }
      }
      if (!Node.isCallExpression(node)) continue;
      const expression = node.getExpression();
      const name = expression.getText();
      if (Node.isPropertyAccessExpression(expression) && ["from", "insert", "update", "delete"].includes(expression.getName())) {
        const arg = node.getArguments()[0];
        let symbol = arg?.getSymbol();
        if (symbol?.isAlias()) symbol = symbol.getAliasedSymbol();
        for (const declaration of symbol?.getDeclarations() ?? []) {
          if (!Node.isVariableDeclaration(declaration)) continue;
          const init = declaration.getInitializer();
          if (!init || !Node.isCallExpression(init) || init.getExpression().getText() !== "pgTable") continue;
          const table = init.getArguments()[0];
          if (table && Node.isStringLiteral(table)) edges.push({ from: `file:${file}`, to: `table:${table.getLiteralText()}`, kind: expression.getName() === "from" ? "reads-table" : "writes-table", evidence: evidence(node), origin: "extracted" });
        }
      }
      if (name === "fetch") {
        const arg = node.getArguments()[0];
        if (arg && Node.isStringLiteral(arg)) {
          const route = arg.getLiteralText().replace(/\/$/, "");
          const path = `app${route}/route.ts`;
          if (included.has(path)) edges.push({ from: `file:${file}`, to: `file:${path}`, kind: "requests", evidence: evidence(node), origin: "extracted" });
          else unresolved.push({ file, line: node.getStartLineNumber(), reason: "fetch 目标不是本地静态 API 路由" });
        } else unresolved.push({ file, line: node.getStartLineNumber(), reason: "动态 fetch URL；通过显式业务契约补充" });
      }
      let symbol = expression.getSymbol();
      if (symbol?.isAlias()) symbol = symbol.getAliasedSymbol();
      for (const declaration of symbol?.getDeclarations() ?? []) {
        const target = relative(root, declaration.getSourceFile().getFilePath());
        if (!included.has(target)) continue;
        if (Node.isFunctionDeclaration(declaration) || Node.isVariableDeclaration(declaration)) {
          edges.push({ from: `file:${file}`, to: symbolId(declaration), kind: "calls", evidence: evidence(node), origin: "extracted" });
        }
      }
      if (name === "pgTable") {
        const arg = node.getArguments()[0];
        const fields = node.getArguments()[1];
        if (arg && Node.isStringLiteral(arg) && fields && Node.isObjectLiteralExpression(fields)) {
          const table = arg.getLiteralText();
          facts.push({ id: `table:${table}`, kind: "table", label: table, evidence: [evidence(node)], origin: "extracted" });
          for (const field of fields.getProperties()) if (Node.isPropertyAssignment(field)) {
            const id = `field:${table}.${field.getName()}`;
            facts.push({ id, kind: "field", label: field.getName(), evidence: [evidence(field)], origin: "extracted" });
            edges.push({ from: `table:${table}`, to: id, kind: "has-field", evidence: evidence(field), origin: "extracted" });
          }
        }
      }
    }
  }
  const contractSource = project.getSourceFile(resolve(root, "lib/semantic/contracts.ts"));
  for (const [module, contract] of Object.entries(moduleContracts)) {
    if (!contractSource) continue;
    const ev = evidence(contractSource);
    facts.push({ id: `entity:${contract.entity}`, kind: "entity", label: contract.label, module, evidence: [ev], origin: "declared" });
    edges.push({ from: `entity:${contract.entity}`, to: `table:${contract.table}`, kind: "stored-in", origin: "declared", evidence: ev });
    for (const action of contract.actions) {
      facts.push({ id: `action:${action}`, kind: "action", label: action, module, evidence: [ev], origin: "declared" });
      edges.push({ from: `action:${action}`, to: `entity:${contract.entity}`, kind: "acts-on", origin: "declared", evidence: ev });
    }
    for (const [role, file] of Object.entries(contract.sources)) {
      if (included.has(file)) edges.push({ from: `entity:${contract.entity}`, to: `file:${file}`, kind: role, origin: "declared", evidence: ev });
      else unresolved.push({ file, line: ev.line, reason: `契约 ${module}.${role} 指向缺失文件` });
    }
    for (const field of contract.fields) if (!facts.some((f) => f.id === `field:${contract.table}.${field}`)) unresolved.push({ file: contract.sources.table, line: 1, reason: `声明字段缺少表定义: ${field}` });
  }
  const ids = new Set(facts.map((f) => f.id));
  for (const edge of edges) if (!ids.has(edge.to)) unresolved.push({ file: edge.evidence.file, line: edge.evidence.line, reason: `未解析目标 ${edge.to}` });
  let commit = "unversioned";
  try { commit = execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim(); } catch { /* fixture */ }
  const sortedFiles = Object.fromEntries(Object.entries(files).sort(([a], [b]) => a.localeCompare(b)));
  return { version: CONTRACT_VERSION, snapshotId: sourceFingerprint(root), commit, files: sortedFiles, facts, edges, unresolved, elapsedMs: Date.now() - started };
}

export function queryIndex(index: Index, command: string, target: string) {
  const contract = Object.entries(moduleContracts).find(([id, c]) => id === target || c.entity === target || target.startsWith(`${id}.`));
  if (command === "describe-entity" || command === "trace-action" || command === "impact") {
    if (!contract) throw new Error("未知实体或动作");
    const [module, c] = contract;
    if (command === "trace-action" && !(c.actions as readonly string[]).includes(target)) throw new Error("动作未登记");
    const paths = new Set<string>(Object.values(c.sources));
    return { snapshotId: index.snapshotId, command, module, facts: index.facts.filter((f) => f.module === module || f.id === `table:${c.table}` || f.id.startsWith(`field:${c.table}.`)),
      relationships: index.edges.filter((e) => e.from === `entity:${c.entity}` || paths.has(e.evidence.file)),
      ...(command === "impact" ? { requiredReview: Object.entries(c.sources).map(([role, file]) => ({ role, file, reason: "字段变更检查规则；需逐项判断是否改动", hash: index.files[file] })), possible: index.edges.filter((e) => paths.has(e.to.replace(/^file:/, "")) && !paths.has(e.evidence.file)) } : {}),
      unresolved: index.unresolved.filter((u) => paths.has(u.file)), limitation: "声明关系不等于静态证明；动态调用须人工核查。影响清单是必审位置，不宣称所有位置都必改。" };
  }
  if (command === "find-references") {
    const facts = index.facts.filter((f) => f.id === target || f.label === target);
    const ids = new Set(facts.map((f) => f.id));
    return { snapshotId: index.snapshotId, facts, references: index.edges.filter((e) => ids.has(e.to)), limitation: "基于 TypeScript 符号解析；动态访问可能无法解析。" };
  }
  throw new Error("未知查询");
}
