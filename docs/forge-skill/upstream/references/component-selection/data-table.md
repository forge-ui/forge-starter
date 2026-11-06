## 选型

| 场景 | 选 |
|---|---|
| 后台列表（订单 / 客户 / 商品） | `DataTable` 6-8 列 |
| 全宽铺满页 | `FullWidthTable` |
| 行内编辑菜单 | 最后一列放 `CellKebabMenu` |
| 状态列 | `StatusBadge` 或 `CellStatusDot` |
| 进度列 | `CellProgressValue` / `CellProgressBar` |
| 操作列 | `CellActions` / `CellKebabMenu` / `CellLink` |
| 文件列 | `CellFile` |

## 列宽预算与数字对齐

`flex: true` 是身份列标记，不是 CSS 剩余空间分配比例；默认预算为 240px，内容最大宽 280px。未设 width 的首列也按身份列计算。其他列默认 128px，操作列 88px，复选列 56px；例如 1 个身份列 + 4 个普通列 + 操作列 + 复选列的默认表宽下限为 896px。窄容器在表格区域内横滚，不挤压全页。

显式 `width: "w-[180px]"` 不会参与 JS 数值解析；需要精确预算时同时设 `minWidth: 180`（正数 px），它既参与 `getDefaultTableMinWidth`，也设置该列单元格的 CSS min-width。身份列的 minWidth 不应高于 280px 上限。整表 `tableMinWidth` 只覆盖总预算，不替各列分配宽度。

金额、件数、单价、百分比列在 ColumnDef 上设 `valueKind: "number"`，表头和内容一起默认右对齐；不能只在 render 里把 CellNumber 或文本右对齐，否则表头仍是左对齐。订单号、日期、电话是 identifier，默认左对齐。数字列确需左对齐时须同时提供 `align: "left"` 和非空 `alignOverrideReason`，单元格同向。
