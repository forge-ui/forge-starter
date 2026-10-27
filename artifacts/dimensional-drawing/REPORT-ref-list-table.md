# 接线自测：列表表解剖（2026-10-27）

这是 dimensional-drawing 接到 audit / new-page 之后的短路径证明，不是对 `/ref/list-table` 的全清单审计。页面源码未改。

## 对照物

| 页面 | 角色 | chrome | 对照页 | case |
| --- | --- | --- | --- | --- |
| `/ref/list-table` | collection 表格 | A（`hideHeader: true`，页内 h1） | 本页即参照页 | `toolbar` `table` |

## 解剖图（缺 HTML = FAIL）

| 对象 | HTML（相对仓库根） | 可选 PNG | 关键码 | [TBD] / CONFLICT |
| --- | --- | --- | --- | --- |
| `/ref/list-table` 整页 + 表 | `artifacts/dimensional-drawing/ref-list-table.html` | `artifacts/dimensional-drawing/ref-list-table.png` | G2=20，S5=20，单元格 20/14，R1=20，Rsurf=24，Z1=32，MW=712 | ASK 尺寸 [TBD]；视口宽 [TBD]；状态列 112/128、操作列 96/88 为 CONFLICT |
| 垫层演练 24→32 | `artifacts/dimensional-drawing/cell-pad-24-to-32.html` | `artifacts/dimensional-drawing/cell-pad-24-to-32.png` | 前：TableCell `px-6` = 24；后：演练垫 32 | 32 不是源码值，不改产品 |

浏览器打开 HTML 即可。PNG 是同一张图的导出，不是第 3 步页面验收截图。

## 结论

解剖门：通过（HTML 可打开）。清单逐条、运行中页面截图：本次不审 `/ref` 业务页，标不适用。Kit 的 Dialog / DataTable 示例不在本仓。

## 图上读到的源码差

- DataTable 网格 `tableColumnClass` 是 `px-5 py-3.5`（20/14）。导出的 `TableCell` 是 `px-6 py-4`（24/16），本页网格没用它。
- 本页操作是 `IconButton` `size="sm"`（32）。`CellActions` 是 24，本页未用。
- `getDefaultTableMinWidth` = 712（身份 240 + 三列 128 + 操作 88）。页面 class：状态 `w-28` = 112，操作 `w-24` = 96。两边都写在图上，标 CONFLICT。

## 怎么打开

仓库根目录：

```text
artifacts/dimensional-drawing/ref-list-table.html
artifacts/dimensional-drawing/cell-pad-24-to-32.html
```

画法范例副本：`.agents/skills/dimensional-drawing/examples/list-table-sheet.html`。
