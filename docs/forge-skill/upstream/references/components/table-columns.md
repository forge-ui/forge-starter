# table-columns

自动生成；请勿编辑 API 部分。来源：`core/src/internal/table-columns.tsx`；core **0.11.4**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ColumnDef (type)

```ts
export type ColumnDef<T> = ColumnDefBase<T> & ColumnDefAlign;
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

## TableCellEdit (type)

```ts
export type TableCellEdit<T> = {
  /** The raw value to put in the input. */
  value: (row: T) => string | number;
  /** May return a promise; the cell shows the new value only after the host updates `rows`. */
  onSave: (row: T, value: string) => void | Promise<unknown>;
  type?: "text" | "number";
  /** Return a message to reject the value. */
  validate?: (value: string, row: T) => string | null | undefined;
};
```

## TableColumnAlign (type)

```ts
export type TableColumnAlign = "left" | "right";
```

## TableValueKind (type)

```ts
export type TableValueKind = "number" | "identifier";
```
