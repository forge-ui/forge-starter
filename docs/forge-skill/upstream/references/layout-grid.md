# Forge layout grid

Read this before choosing page columns or adapting a page to a narrow viewport. APIs are exported from `@forge-ui-official/core`; see `/components/grid` and `/cases/grid` for runnable examples. Existing consumers need a Core version that actually exports Grid/GridItem; do not invent imports against an older installed package.

## Template first

First verify that the template fits the business task. For new page structures, read [page-design-dimensional](page-design-dimensional.md): basic forms, grouped forms, settings and read-only detail have distinct structures. The product rail below is scenario-specific, not a generic form default.

Choose the closest Forge template and page role before choosing tracks. Inherit its fixed versus proportional columns, spacing density and wide-screen hierarchy. Record the source template and justify breakpoint changes with actual content-width evidence. Grid defaults are API defaults, not permission to replace template spacing.

- Analytics uses four equal metric columns and an 8:4 chart/auxiliary split; its lower rows use three and two equal columns from lg.
- Product creation uses a flexible main form plus a fixed 280px right rail, 12px outer gap and 8px field/card gaps.
- Seller detail uses a fixed 336px left rail plus flexible detail content, with 16px outer gap.
- Keep narrow-screen stacking. Fixed rails may use page-level static CSS Grid or Flex; do not convert them to 8:4 just to use GridItem. Toolbars and automatic-width action columns do not need proportional spans.
- Case rulers illustrate geometry. Generic 24-column/offset exercises are optional API capabilities, not default template patterns.

## Ownership

- `AppLayout` owns sidebar, topbar and page padding. Do not add the same padding again to Grid.
- `Grid` owns tracks and gaps; `GridItem` owns span and start. Cards own their content and adapt through existing APIs such as `width="full"`.
- Dashboards/tables normally use available width. Standalone forms should generally cap content at 960px; forms with an auxiliary area use a responsive main/aside layout.
- Use Flex for toolbars, button groups and other one-dimensional arrangements. Do not replace every div with Grid.

## API and defaults

`Grid`: `columns` (1–24, default 12), `gap` (default 16px), `rowGap`, `columnGap`, `alignItems` (`start | center | end | stretch | baseline`, default stretch).

`GridItem`: `span` (1–24 or `full`, default full), `start` (1–24 or `auto`, default auto). Full spans the whole row and ignores start. Use `auto` to reset a previous breakpoint's start. At every breakpoint ensure numeric spans and starts fit the parent tracks; otherwise native CSS Grid creates implicit tracks.

Columns, gaps, span and start accept either a scalar or `{ base, sm, md, lg, xl, "2xl" }`. Breakpoints are viewport widths 640/768/1024/1280/1536px; unspecified values inherit upward. Empty objects use defaults. This is not a container-query API: check available width with the sidebar expanded too.

Gap values are **pixels**, limited to 0/4/8/12/16/20/24/32/48. An explicit axis gap overrides `gap` from its first specified breakpoint onward. Before that it follows `gap`; `0` is a valid override.

Both components accept normal div attributes, className, style and ref and work in server components. Custom classes/style are explicit CSS overrides; prefer the layout props. Nested grids reset their own variables rather than inheriting their parent's settings.

## Composition

```tsx
import { Grid, GridItem, StatCard } from "@forge-ui-official/core";

// Plain direct children auto-place into one cell each.
<Grid columns={{ base: 1, sm: 2, lg: 4 }} gap={16}>
  {metrics.map(metric => <StatCard key={metric.title} {...metric} width="full" />)}
</Grid>

// Analytics proportional chart/auxiliary layout (not a fixed form rail).
<Grid gap={16} alignItems="start">
  <GridItem span={{ base: "full", lg: 8 }}>Main content</GridItem>
  <GridItem span={{ base: "full", lg: 4 }}>Auxiliary content</GridItem>
</Grid>

// Product template: preserve fixed rail and original density; stack below xl.
<div className="grid grid-cols-1 items-start gap-3 xl:grid-cols-[minmax(0,1fr)_280px]">
  <div className="min-w-0"><Grid columns={{ base: 1, sm: 2 }} gap={8}>…</Grid></div>
  <div className="min-w-0">Auxiliary fields</div>
</div>
```

Keep DOM order aligned with reading and keyboard order. Decide equal height per row, not globally; do not force all card grids to auto-rows-fr or fixed minimum heights. Charts need an intentional height. Long identifiers need wrapping/truncation chosen by content meaning; tables keep horizontal scrolling in their own container. `min-width: 0` permits shrinking but does not itself wrap long strings.

## Layout audit

- Record the source template; compare fixed rail widths, proportional tracks, field/action widths, gaps and breakpoint changes before checking overflow.

- Capture before/after at 375, 768, 1024 and 1440px; also inspect the breakpoints used by the page on both sides.
- Test expanded/collapsed sidebar and mobile overlay. Check actual content width, not only viewport width.
- No duplicated page padding, unintended implicit columns, or new document-level horizontal scroll.
- No clipped text/controls; long content must remain accessible. Wide tables scroll locally.
- Confirm relevant buttons, menus, fields, tabs and dialogs still work. Preserve pre-existing mock behavior; do not claim data was saved when a template only opens a dialog.
- Retain URL, screenshot and operation result. Record pre-existing failures separately; technical checks do not constitute user acceptance.

References: [Ant Design](https://ant.design/components/grid-cn/), [MUI](https://mui.com/material-ui/react-grid/), [Chakra UI](https://chakra-ui.com/docs/components/grid).

## 几何与验收单一来源

看板尺寸、轨道公式与模板出处统一见 [页面规范](page-recommended-standard.md#看板screen-优先与分层几何)；验收统一见 [审计清单](audit-checklist.md)。固定280/336px业务侧栏不是比例Grid的默认替代品。
