# data-table

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/data-table.tsx`；core **0.4.7**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## CellActionKey (type)

```ts
export type CellActionKey =
  | "mail"
  | "phone"
  | "chat"
  | "eye"
  | "pen"
  | "trash";
```

## CellActions (value)

```ts
({ actions, showKebab, iconColor, onAction, onKebab, }: { actions?: CellActionKey[]; showKebab?: boolean; iconColor?: string; onAction?: (key: CellActionKey) => void; onKebab?: () => void; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `actions` | 否 | `CellActionKey[] \| undefined` |  |
| `showKebab` | 否 | `boolean \| undefined` |  |
| `iconColor` | 否 | `string \| undefined` |  |
| `onAction` | 否 | `((key: CellActionKey) => void) \| undefined` |  |
| `onKebab` | 否 | `(() => void) \| undefined` |  |

## CellCode (value)

```ts
({ code }: { code: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `code` | 是 | `string` |  |

## CellContentType (type)

```ts
export type CellContentType =
  | "text"
  | "text-subtitle"
  | "image-text"
  | "image-text-subtitle"
  | "user"
  | "user-subtitle"
  | "badge-icon"
  | "badge-icon-subtitle"
  | "avatar-group"
  | "status-badge"
  | "progress-badge"
  | "kebab-menu"
  | "custom";
```

## CellFile (value)

```ts
({ name, size, icon, }: { name: string; size?: string; icon?: ReactNode; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `name` | 是 | `string` |  |
| `size` | 否 | `string \| undefined` |  |
| `icon` | 否 | `ReactNode` |  |

## CellImageText (value)

```ts
({ src, title, subtitle, rounded, }: { src: string; title: string; subtitle?: string; rounded?: "lg" | "full"; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `src` | 是 | `string` |  |
| `title` | 是 | `string` |  |
| `subtitle` | 否 | `string \| undefined` |  |
| `rounded` | 否 | `"lg" \| "full" \| undefined` |  |

## CellKebabMenu (value)

```ts
({ onClick, }: { onClick?: () => void; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `onClick` | 否 | `(() => void) \| undefined` |  |

## CellLink (value)

```ts
({ label, color, onClick, }: { label: string; color?: CellLinkColor; onClick?: () => void; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `label` | 是 | `string` |  |
| `color` | 否 | `"purple" \| "blue" \| "green" \| "black" \| "red" \| undefined` |  |
| `onClick` | 否 | `(() => void) \| undefined` |  |

## CellLinkColor (type)

```ts
export type CellLinkColor = keyof typeof cellLinkColors;
```

## CellMuted (value)

```ts
({ children }: { children: ReactNode; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `children` | 是 | `ReactNode` |  |

## CellNumber (value)

```ts
({ value, trend, badge, badgeColor, subdued, align, }: { value: string; trend?: "up" | "down"; badge?: string; badgeColor?: ProgressBadgeColor; subdued?: boolean; align?: TableColumnAlign; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `value` | 是 | `string` |  |
| `trend` | 否 | `"up" \| "down" \| undefined` |  |
| `badge` | 否 | `string \| undefined` |  |
| `badgeColor` | 否 | `"green" \| "red" \| "grey" \| undefined` |  |
| `subdued` | 否 | `boolean \| undefined` |  |
| `align` | 否 | `TableColumnAlign \| undefined` | 表格数字默认右对齐（`--forge-table-align-number`）。 左对齐必须显式传入 `align="left"`，并在列上填写 `alignOverrideReason`。 |

## CellProgressBar (value)

```ts
({ value, percent, color, }: { value: string; percent: number; color?: ProgressBarColor; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `value` | 是 | `string` |  |
| `percent` | 是 | `number` |  |
| `color` | 否 | `"purple" \| "blue" \| "orange" \| "green" \| "yellow" \| "cyan" \| "black" \| "red" \| "gray" \| undefined` |  |

## CellProgressValue (value)

```ts
({ value, badge, badgeColor, align, }: { value: string; badge: string; badgeColor?: ProgressBadgeColor; align?: TableColumnAlign; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `value` | 是 | `string` |  |
| `badge` | 是 | `string` |  |
| `badgeColor` | 否 | `"green" \| "red" \| "grey" \| undefined` |  |
| `align` | 否 | `TableColumnAlign \| undefined` | 表格内的数量、金额、百分比默认右对齐。左对齐须显式传入。 |

## CellRating (value)

```ts
({ score, color, }: { score: string | number; color?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `score` | 是 | `string \| number` |  |
| `color` | 否 | `string \| undefined` |  |

## CellStatusDot (value)

```ts
({ label, color, emphasis, }: { label: string; color?: StatusDotColor; emphasis?: "strong" | "subtle"; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `label` | 是 | `string` |  |
| `color` | 否 | `"purple" \| "blue" \| "green" \| "yellow" \| "cyan" \| "black" \| "red" \| "grey" \| undefined` |  |
| `emphasis` | 否 | `"strong" \| "subtle" \| undefined` |  |

## CellText (value)

```ts
({ children }: { children: ReactNode; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `children` | 是 | `ReactNode` |  |

## CellTextSubtitle (value)

```ts
({ title, subtitle, }: { title: string; subtitle?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 是 | `string` |  |
| `subtitle` | 否 | `string \| undefined` |  |

## ColumnDef (type)

```ts
export type ColumnDef<T> = ColumnDefBase<T> & ColumnDefAlign;
```

## DataTable (value)

```ts
<T>({ title, subtitle, badge, columns, rows, headerActions, color, showCheckbox, checkboxColor, selectedRowKeys, onSelectedRowKeysChange, selectedRows, onSelectRow, onSelectAll, onSort, sortColumnKey, sortDirection, getRowKey, emptyState, footerLeft, footerRight, showPagination, currentPage, totalPages, onPageChange, paginationLabel, tableMinWidth, className, }: DataTableProps<T>) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 否 | `string \| undefined` |  |
| `subtitle` | 否 | `string \| undefined` |  |
| `badge` | 否 | `ReactNode` |  |
| `columns` | 是 | `ColumnDef<T>[]` |  |
| `rows` | 是 | `T[]` |  |
| `headerActions` | 否 | `ReactNode` |  |
| `color` | 否 | `DataTableColor \| undefined` |  |
| `showCheckbox` | 否 | `boolean \| undefined` |  |
| `checkboxColor` | 否 | `"purple" \| "blue" \| "orange" \| "green" \| "black" \| "red" \| undefined` |  |
| `selectedRowKeys` | 否 | `ReadonlySet<Key> \| undefined` | Stable selected row identities. Pair with getRowKey for sort/filter-safe selection. |
| `onSelectedRowKeysChange` | 否 | `((keys: Set<Key>) => void) \| undefined` | Receives a new Set after a stable-key selection change. The input Set is never mutated. |
| `selectedRows` | 否 | `Set<number> \| undefined` |  |
| `onSelectRow` | 否 | `((index: number, checked: boolean) => void) \| undefined` |  |
| `onSelectAll` | 否 | `((checked: boolean) => void) \| undefined` |  |
| `onSort` | 否 | `((columnKey: string) => void) \| undefined` |  |
| `sortColumnKey` | 否 | `string \| undefined` |  |
| `sortDirection` | 否 | `"asc" \| "desc" \| undefined` |  |
| `getRowKey` | 否 | `((row: T, index: number) => Key) \| undefined` |  |
| `emptyState` | 否 | `ReactNode` |  |
| `footerLeft` | 否 | `ReactNode` |  |
| `footerRight` | 否 | `ReactNode` |  |
| `showPagination` | 否 | `boolean \| undefined` |  |
| `currentPage` | 否 | `number \| undefined` |  |
| `totalPages` | 否 | `number \| undefined` |  |
| `onPageChange` | 否 | `((page: number) => void) \| undefined` |  |
| `paginationLabel` | 否 | `string \| undefined` |  |
| `tableMinWidth` | 否 | `Property.MinWidth<string \| number> \| undefined` | Minimum width of the table content. Overflow stays inside the component. |
| `className` | 否 | `string \| undefined` |  |

## DataTableColor (type)

```ts
export type DataTableColor = "purple" | "blue" | "black";
```

## DataTableProps (type)

```ts
export type DataTableProps<T> = {
  title?: string;
  subtitle?: string;
  badge?: ReactNode;
  columns: ColumnDef<T>[];
  rows: T[];
  headerActions?: ReactNode;
  color?: DataTableColor;
  showCheckbox?: boolean;
  checkboxColor?: CheckboxColor;
  /** Stable selected row identities. Pair with getRowKey for sort/filter-safe selection. */
  selectedRowKeys?: ReadonlySet<Key>;
  /** Receives a new Set after a stable-key selection change. The input Set is never mutated. */
  onSelectedRowKeysChange?: (keys: Set<Key>) => void;
  /** @deprecated Prefer selectedRowKeys for selection that survives sorting and filtering. */
  selectedRows?: Set<number>;
  onSelectRow?: (index: number, checked: boolean) => void;
  onSelectAll?: (checked: boolean) => void;
  onSort?: (columnKey: string) => void;
  sortColumnKey?: string;
  sortDirection?: "asc" | "desc";
  getRowKey?: (row: T, index: number) => Key;
  emptyState?: ReactNode;
  footerLeft?: ReactNode;
  footerRight?: ReactNode;
  showPagination?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  paginationLabel?: string;
  /** Minimum width of the table content. Overflow stays inside the component. */
  tableMinWidth?: CSSProperties["minWidth"];
  className?: string;
};
```

## FullWidthTable (value)

```ts
<T>({ title, subtitle, badge, columns, rows, headerActions, color, showCheckbox, checkboxColor, selectedRowKeys, onSelectedRowKeysChange, selectedRows, onSelectRow, onSelectAll, onSort, sortColumnKey, sortDirection, getRowKey, emptyState, footerLeft, footerRight, showPagination, currentPage, totalPages, onPageChange, paginationLabel, tableMinWidth, showRowCount, rowCountOptions, currentRowCount, onRowCountChange, totalRows, className, }: FullWidthTableProps<T>) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 否 | `string \| undefined` |  |
| `subtitle` | 否 | `string \| undefined` |  |
| `badge` | 否 | `ReactNode` |  |
| `columns` | 是 | `ColumnDef<T>[]` |  |
| `rows` | 是 | `T[]` |  |
| `headerActions` | 否 | `ReactNode` |  |
| `color` | 否 | `DataTableColor \| undefined` |  |
| `showCheckbox` | 否 | `boolean \| undefined` |  |
| `checkboxColor` | 否 | `"purple" \| "blue" \| "orange" \| "green" \| "black" \| "red" \| undefined` |  |
| `selectedRowKeys` | 否 | `ReadonlySet<Key> \| undefined` | Stable selected row identities. Pair with getRowKey for sort/filter-safe selection. |
| `onSelectedRowKeysChange` | 否 | `((keys: Set<Key>) => void) \| undefined` | Receives a new Set after a stable-key selection change. The input Set is never mutated. |
| `selectedRows` | 否 | `Set<number> \| undefined` |  |
| `onSelectRow` | 否 | `((index: number, checked: boolean) => void) \| undefined` |  |
| `onSelectAll` | 否 | `((checked: boolean) => void) \| undefined` |  |
| `onSort` | 否 | `((columnKey: string) => void) \| undefined` |  |
| `sortColumnKey` | 否 | `string \| undefined` |  |
| `sortDirection` | 否 | `"asc" \| "desc" \| undefined` |  |
| `getRowKey` | 否 | `((row: T, index: number) => Key) \| undefined` |  |
| `emptyState` | 否 | `ReactNode` |  |
| `footerLeft` | 否 | `ReactNode` |  |
| `footerRight` | 否 | `ReactNode` |  |
| `showPagination` | 否 | `boolean \| undefined` |  |
| `currentPage` | 否 | `number \| undefined` |  |
| `totalPages` | 否 | `number \| undefined` |  |
| `onPageChange` | 否 | `((page: number) => void) \| undefined` |  |
| `paginationLabel` | 否 | `string \| undefined` |  |
| `tableMinWidth` | 否 | `Property.MinWidth<string \| number> \| undefined` | Minimum width of the table content. Overflow stays inside the component. |
| `className` | 否 | `string \| undefined` |  |
| `showRowCount` | 否 | `boolean \| undefined` |  |
| `rowCountOptions` | 否 | `number[] \| undefined` |  |
| `currentRowCount` | 否 | `number \| undefined` |  |
| `onRowCountChange` | 否 | `((count: number) => void) \| undefined` |  |
| `totalRows` | 否 | `number \| undefined` | Exact total record count. Omit it when the data source does not provide one. |

## FullWidthTableProps (type)

```ts
export type FullWidthTableProps<T> = DataTableProps<T> & {
  showRowCount?: boolean;
  rowCountOptions?: number[];
  currentRowCount?: number;
  onRowCountChange?: (count: number) => void;
  /** Exact total record count. Omit it when the data source does not provide one. */
  totalRows?: number;
};
```

## ProgressBadge (value)

```ts
({ label, color, }: { label: string; color?: ProgressBadgeColor; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `label` | 是 | `string` |  |
| `color` | 否 | `"green" \| "red" \| "grey" \| undefined` |  |

## ProgressBadgeColor (type)

```ts
export type ProgressBadgeColor = keyof typeof progressBadgeColors;
```

## ProgressBarColor (type)

```ts
export type ProgressBarColor = ProgressColor;
```

## resolveTableColumnAlign (value)

```ts
<T>(column: Pick<ColumnDef<T>, "key" | "valueKind" | "align" | "alignOverrideReason">) => TableColumnAlign
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `key` | 是 | `string` |  |
| `valueKind` | 否 | `"number" \| "identifier" \| undefined` | 省略或 identifier：标识与普通文本，默认左对齐。列头与内容同向。 金额、数量、单价、百分比及同类可比较数值。省略 align 即右对齐。 |
| `align` | 否 | `TableColumnAlign \| undefined` | 数字列离开默认右对齐。必须同时填写非空 `alignOverrideReason`。 漏写原因会在运行时警告，并标上 `data-forge-align-violation`。 |
| `alignOverrideReason` | 否 | `string \| undefined` | 标识列一般不需要。数字列禁止用这个字段代替 `valueKind: "number"`。 |

## StatusBadge (value)

```ts
({ label, color, variant, }: { label: string; color?: StatusBadgeColor; variant?: StatusBadgeVariant; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `label` | 是 | `string` |  |
| `color` | 否 | `"purple" \| "blue" \| "green" \| "yellow" \| "cyan" \| "red" \| "grey" \| undefined` |  |
| `variant` | 否 | `StatusBadgeVariant \| undefined` |  |

## StatusBadgeColor (type)

```ts
export type StatusBadgeColor = keyof typeof statusBadgeSolidColors;
```

## StatusBadgeVariant (type)

```ts
export type StatusBadgeVariant = "soft" | "solid";
```

## StatusDotColor (type)

```ts
export type StatusDotColor = keyof typeof statusDotColors;
```

## TableCell (value)

```ts
({ variant, children, className, sortable, onSort, checkbox, checked, onCheckedChange, checkboxColor, leadIcon, }: TableCellProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `variant` | 否 | `TableCellVariant \| undefined` |  |
| `children` | 否 | `ReactNode` |  |
| `className` | 否 | `string \| undefined` |  |
| `sortable` | 否 | `boolean \| undefined` |  |
| `onSort` | 否 | `(() => void) \| undefined` |  |
| `checkbox` | 否 | `boolean \| undefined` |  |
| `checked` | 否 | `boolean \| undefined` |  |
| `onCheckedChange` | 否 | `((checked: boolean) => void) \| undefined` |  |
| `checkboxColor` | 否 | `"purple" \| "blue" \| "orange" \| "green" \| "black" \| "red" \| undefined` |  |
| `leadIcon` | 否 | `ReactNode` |  |

## TableCellProps (type)

```ts
export type TableCellProps = {
  variant?: TableCellVariant;
  children?: ReactNode;
  className?: string;
  sortable?: boolean;
  onSort?: () => void;
  checkbox?: boolean;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  checkboxColor?: CheckboxColor;
  leadIcon?: ReactNode;
};
```

## TableCellVariant (type)

```ts
export type TableCellVariant = "header" | "body";
```

## TableColumnAlign (type)

```ts
export type TableColumnAlign = "left" | "right";
```

## TableValueKind (type)

```ts
export type TableValueKind = "number" | "identifier";
```

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
