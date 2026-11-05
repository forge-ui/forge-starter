import assert from "node:assert/strict";
import test from "node:test";
import { inspectSource } from "../../scripts/audit-tripwire.mjs";

const page = "app/(app)/example/page.tsx";
const ids = (source, path = page) => inspectSource(source, path).map((finding) => finding.id);

test("V3 accepts Solar currentColor and semantic classes", () => {
  assert.deepEqual(ids('import { HomeLinear } from "@forge-ui-official/core/icons"; const view = <HomeLinear color="currentColor" className="text-fg-blue-500" />;'), []);
});

test("V3 rejects legacy icon libraries but ignores comments", () => {
  assert.ok(ids('import { HomeLinear } from "solar-icon-set";').includes("V3-icon-entry"));
  assert.deepEqual(ids('// import { HomeLinear } from "solar-icon-set";'), []);
});

test("H6 checks actual aliased and namespace JSX, not imports", () => {
  assert.deepEqual(ids('import { PageHeader } from "@forge-ui-official/core";'), []);
  for (const source of [
    'import { PageHeader as Heading } from "@forge-ui-official/core"; const view = <Heading />;',
    'import * as Kit from "@forge-ui-official/core"; const view = <Kit.PageHeader />;',
  ]) {
    const findings = inspectSource(source, page);
    assert.equal(findings[0].id, "H6-pageheader-in-page");
    assert.equal(findings[0].level, "warn");
    assert.deepEqual(ids(source, "app/(app)/ref/example/page.tsx"), []);
  }
});

test("V7 catches all forbidden heading greys and conditional classes", () => {
  for (const shade of [300, 400, 500, 600]) {
    assert.ok(ids(`<h1 className={active ? "text-fg-grey-${shade}" : "text-fg-black"}>标题</h1>`).includes("V7-grey-heading"));
  }
  assert.deepEqual(ids('<h3 className="text-fg-grey-500">时间</h3>'), []);
  assert.deepEqual(ids('// <h1 className="text-fg-grey-500">标题</h1>'), []);
});

test("new checks cover private imports, colors and menu icons", () => {
  assert.ok(ids('import { Button } from "@forge-ui-official/core/dist/button";').includes("C1-legacy-import"));
  assert.ok(ids('<div style={{ color: "#ff0000" }} />').includes("V4-hardcoded-color"));
  assert.ok(ids('<div className="bg-red-500" />').includes("V1-tailwind-default-color"));
  assert.ok(ids('const classes = "bg-red-500"; const view = <div className={classes} />;').includes("V1-tailwind-default-color"));
  assert.ok(ids('import { HomeLinear } from "@forge-ui-official/core/icons"; const icon = <HomeLinear />;', "config/menu.tsx").includes("M2-menu-icon-variant"));
  assert.deepEqual(ids('import { HomeBoldDuotone } from "@forge-ui-official/core/icons"; const icon = <HomeBoldDuotone size={20} />;', "config/menu.tsx"), []);
});

test("soft statuses pass and inline success remains a review warning", () => {
  assert.deepEqual(ids('import { StatusBadge } from "@forge-ui-official/core"; const view = <StatusBadge />;'), []);
  assert.ok(ids('import { StatusBadge } from "@forge-ui-official/core"; const view = <StatusBadge variant="solid" />;').includes("V6-status-badge"));
  assert.ok(ids('<div className="bg-fg-green-50">创建成功</div>').includes("F4-inline-success"));
});
