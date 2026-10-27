---
name: dimensional-drawing
description: >
  Make an Apple-style monochrome dimensional drawing of a whole Forge Starter
  page or layout — one sheet, variable codes, architecture slots. Required by
  forge-starter-audit (missing HTML fails the audit; a written skip is still
  a fail) and by forge-starter-new-page (design is not complete without it).
  Component-level Kit examples live in the forge repo; this copy draws starter
  pages, dialogs and tables. Never invent numbers; unknown dims stay [TBD].
  Not a runtime dependency. Upstream MIT: enesozturk/dimensional-drawing.
---

# Dimensional drawing

Draw one subject the way Apple's accessory dimensional drawings do (developer.apple.com/accessories/dimensional-drawings): everything on one sheet, notes top-left, views spread across the sheet with smaller detail views, tables beside the views that use them. Output is one self-contained HTML file (on claude.ai, publish it as an Artifact). Worked examples: `examples/dialog-sheet.html`, `examples/card-sheet.html`, and `examples/list-table-sheet.html` next to this file — copy their drawing kit instead of starting from zero. In this repo, audit and new-page deliveries also save a copy under `artifacts/dimensional-drawing/`.

## Forge Starter（优先于下文的「单个组件」默认）

搭 starter 页面、或审计已有页面时，用本 skill 画**整页 / Dialog / 表**的结构图。它只出独立 HTML，不代替 `forge-starter-new-page` 写 UI，也不改产品功能代码。

**强制（DD4-1 / DD4-2 / DD4-3）**

- `forge-starter-audit` 主路径必须调用本 skill。没有 HTML = 审计 **FAIL**。写了跳过原因也不通过。
- `forge-starter-new-page` 把设计标完成之前必须出图（整页，或该页关键 Dialog / 表）。无图不得交审。
- 交付路径：`artifacts/dimensional-drawing/<模块>-<对象>.html`（相对仓库根）。`examples/` 是画法范例，不代替这份交付。
- 解剖图不是浏览器验收截图。截图通道挂了，不能用来跳过这张图。
- 仍只是 Agent skill：不进 `package.json`，不进 runtime，不打进 `@forge-ui-official/core`。
- Dialog / DataTable 各一张 Kit 解剖示例和文档门禁句在 **forge 仓**做。本仓不补 Kit。

组件级尺寸图的 Kit 示例在 forge 仓；starter 用同一套画法画页面、本页 Dialog 和本页表。

- 变量来自页面源码、Forge token 或已经量到的值。源码里没有的写 `[TBD]`，禁止编造数字。
- 画架构槽位（`TITLE SLOT · FLEX` 等），不画真实文案。
- 需要对照正在跑的页面时，用本机已经打开的 Chrome。不要为了出图另起 Playwright 或系统 Chrome，也不要把这张图当成 `forge-starter-audit` 的浏览器验收。
- 上游 MIT：https://github.com/enesozturk/dimensional-drawing （Enes Ozturk，提交 `5c457437c8c83524308aad3b7443e81adcc13153`）。许可证见 `LICENSE`，纳入说明见 `SOURCE.md`。
- 成片是可选的 `dimensional-drawing-motion`，不是页面交付的一部分。

## House rules

1. **Monochrome.** Black line on white paper, grays only. No accent color anywhere. Tell things apart by line weight, dash pattern, hatch and light gray fill. Single light theme by design (`color-scheme: light`, every color explicit).
2. **Architecture, not content.** For UI, draw slots, never real copy: lead box with an X, `TITLE SLOT · FLEX`, `TRAIL` / `ACTION` (hug), `CONTENT SLOT · FILL`, `META SLOT · FLEX · WRAPS`, `LABEL SLOT`, `VALUE SLOT`. No text-width dimensions. Size words: HUG (sized by content), FLEX (takes remaining space), FILL (parent width).
3. **Variables, not numbers.** Every dimension on the drawing is a code; tables give code, variable name, value. Derived values are formulas with the result: `H1 header-min = 2·S1+H3 = 64`, `R2 r-inner = R1−B−S6 = 11`, `E1 = BL+SP−Y`, `E2 = BL+SP`, `E3 = BL+SP+Y`.
4. **Unbranded.** No product or company names, logos or wordmarks in the drawing, title block or footer unless the user asks. Use neutral names (`UI-CARD-001`, "UI component reference").
5. **Never invent values.** Anything not in the source is `[TBD]` (e.g. viewport margin, overflow behavior, unpublished physical dims) and is drawn as a proportional schematic.

## Code system

| Prefix | Meaning | Examples |
|---|---|---|
| S# | spacing | S1 container pad, S2 inner pad, S3 stack gap, S4 min gap flex↔hug, S5 lead gap, S6 inner inset |
| H# / Z# / I# | heights / square sizes / icon size | H1 header-min, H2 footer-h, H3 action-h, H5 input-h, Z1 lead, I1 icon |
| B, W | border, width (range or fixed) | W = 420–680 |
| R# | radius | R1 container, R2 inner (derived), R3 control, R4 pill = h ÷ 2 |
| Y, BL, SP, E# | shadow offset/blur/spread, envelope | E1 top, E2 side, E3 bottom |
| T1, V1, MH | touch min, viewport margin, max height | MH = 100vh − 2·V1 |

## Page structure

1. **Title block (HTML, top).** Styled like the drawing: 1.2 px black frame, radius 16, 0.8 px black cell rules, plain caps lettering (Arimo/Helvetica), 9.5 px labels, caps values. Cells: big title (light caps, letter-spaced) + one-line scope, DWG NO., REV, SHEETS, UNITS, SCALE, SOURCE. Then `NOTES: (UNLESS OTHERWISE SPECIFIED)` general notes in two aligned columns (do not scale; units; slots are placeholders; codes and formulas; HUG/FLEX/FILL; [TBD]; grayscale). Then a row of 6–7 key variables (`W · card-w 420–680`, `H1 · header-min 2·S1 + H3`…), formulas in lowercase.
2. **Drawing sheet(s).** One SVG per sheet, `viewBox="0 0 1700 1060"`, `width:100%; min-width:1100px` inside an `overflow-x:auto` frame. Rounded sheet border. No title block on the sheet (it costs space); identity goes in a footer line under the sheet: `DATE | UI COMPONENT REFERENCE` left, `NAME, ARCHITECTURE | n` right.
3. Prefer **one sheet**. Add a sheet only when one can't hold it legibly; every extra sheet keeps the identical structure, and notes cross-reference (`SEE SHEET 2`).

## Sheet layout (one sheet)

- **Notes** top-left: boxed numbers `[1]` that also appear on the drawing next to the feature; un-numbered lines for general rules.
- **Plan view** top-center at 0.9–1.1:1: wireframe with slots; ordinate/chain dims top and bottom (codes, FLEX/HUG words, overall W with range label), region chain left (H1 / HUG / H2, overall `(REF n)`), inner chain right (S1 / H3 / S1 / S2 / S3 …), radius callouts, dash-dot centerlines, boxed note numbers, and dashed detail circles with labels (`DETAIL C`) pointing at features drawn larger elsewhere.
- **Under the notes:** shadow envelope (card outline, hatched footprint, dash-dot envelope, E1/E2/E3).
- **Left/bottom-left:** exploded axonometric of the layer stack with labels and leaders on the left (canvas → [scrim] → shadow → container → inset surfaces → slots & controls).
- **Bottom row:** nested-corner detail (shared center, B and S6, `R2 = R1 − B − S6`), radius details (one quarter-arc per radius, 2–2.4:1), inner/body detail at ~0.65:1, plus component-specific details.
- **Right column:** variable tables (Spacing, Size, Radius, Shadow, plus Viewport / Keep-out when relevant).

## Component-specific views (pick what applies)

- Card / list row: body well insets, stack gap, flex vs hug footer, touch target.
- Dialog / sheet / popover: viewport placement (centered on both axes, full-bleed scrim, MH box, V1 [TBD], envelope inside the viewport), scrim layer in the exploded view, header controls (lead R4, close Z2 with centered icon `(Z2−I1)÷2`), field detail (label → S4 → input H5, pad S9, R3), footer actions (end-aligned, secondary pill, gap S7, primary R3, per-button pad).
- Button / chip / input: detail at 2–4:1, states side by side, hit area vs drawn height.
- Navigation / page layout: plan per breakpoint, column grid, safe areas.
- **Physical products:** third-angle top / front / right views + section A–A (hatched cut solids), a positions sheet area (packed, deployed, parts removed) and a size-range strip to scale; units mm; published specs only, sources listed, conflicts flagged `CONFLICT`, everything else [TBD]; no logos or surface textures.

## Measuring a UI component

Read the real source (repo file, Storybook story, design-canvas file, artifact, URL). Strip zoom and template holes, render in Playwright, wait for fonts, walk the box tree (`getBoundingClientRect` + `getComputedStyle`: padding, gap, radius, border, min-height, flex-shrink, min-width). Survey every instance with grep counts so the variables reflect the system, not one example.

## Drawing kit (SVG, inline JS)

Use one `begin(svgId)` per sheet that creates a `<defs>` with a unique arrow marker and a 45° hatch pattern id, and draws the sheet border. Helpers, all in sheet units:

```js
dimH(x1,x2,y,ext1Y,ext2Y,label,{below,dx,dy,c})   // horizontal dim; <28px span → arrows outside
dimV(y1,y2,x,ext1X,ext2X,label,{side:'l'|'r'})    // vertical dim; no side → rotated label
callout(px,py,ex,ey,label,dir)                    // dot + leader + shoulder + text
rad(cornerX,cornerY,r,'tl'|'tr'|'bl'|'br',label,len)
nb(x,y,n)                                          // boxed note number
detailRef(cx,cy,r,label,lx,ly)                     // dashed circle + leader
table(x,y,title,[[code,variable,value]…])          // widths 40/88/96, returns next y
notes([[n,text]…])                                 // n=0 → unnumbered
```

Conventions: object outline 1.6 px; dim lines 0.7 px; extension lines 0.55 px, 3 px off the feature, 5 px overshoot; 7 px filled arrows; dim text 11 px with a white `paint-order: stroke` knockout; slot labels 9 px caps letter-spaced; view titles 12 px caps letter-spaced with a 9.5 px subtitle (`SCALE 0.9:1 · …`). Slots dashed 4 3; hug elements light gray fill; inset surfaces lighter gray; phantom/region lines long-dash; envelopes dash-dot; keep-outs hatched.

Pitfalls: a CSS `fill` rule on a class overrides a `fill="url(#hatch)"` attribute, so hatched shapes need a class without `fill`. Inside transformed groups (exploded view) use `vector-effect: non-scaling-stroke`, and set CSS-variable fills via `style`, not attributes. Stagger labels in tight chains with `dx`/`dy`. Exploded projection: `matrix(.94s, .17s, −.34s, .47s, tx, ty−z)`.

## Before publishing

- Every code on the drawing exists in a table; every formula closes (header = 2·S1 + H3, overall = sum of regions).
- No brand text; no color (grep for hex values outside the gray tokens); no content-dependent widths.
- Render once with Playwright at 1800 px wide, look at the screenshot for overlapping labels and elements crossing the sheet border, fix in one pass, then deliver (publish as an Artifact on claude.ai, or save the .html).

To animate the finished sheet, use the `dimensional-drawing-motion` skill.

Reply in one or two sentences: what was drawn, and any [TBD] values the team should define.