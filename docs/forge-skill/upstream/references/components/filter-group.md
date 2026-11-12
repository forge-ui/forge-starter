# filter-group

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/filter-group.tsx`；core **0.8.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## FilterGroup (value)

```ts
({ title, color, content, defaultOpen, hasSelection, }: { title?: string; color?: FilterGroupColor; content?: FilterGroupContent; defaultOpen?: boolean; hasSelection?: boolean; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 否 | `string \| undefined` |  |
| `color` | 否 | `AccentColor \| undefined` |  |
| `content` | 否 | `FilterGroupContent \| undefined` |  |
| `defaultOpen` | 否 | `boolean \| undefined` |  |
| `hasSelection` | 否 | `boolean \| undefined` |  |

## FilterGroupCheckboxOption (type)

```ts
export type FilterGroupCheckboxOption = {
  value: string;
  label: string;
  checked?: boolean;
  colorDot?: string;
};
```

## FilterGroupColor (type)

```ts
export type FilterGroupColor = AccentColor;
```

## FilterGroupContent (type)

```ts
export type FilterGroupContent =
  | { type: "empty" }
  | {
      type: "checkbox";
      options: FilterGroupCheckboxOption[];
      onToggle?: (value: string, checked: boolean) => void;
    }
  | {
      type: "radio";
      options: FilterGroupRadioOption[];
      onSelect?: (value: string) => void;
    }
  | {
      type: "range";
      minLabel?: string;
      maxLabel?: string;
      minPlaceholder?: string;
      maxPlaceholder?: string;
      minValue?: string;
      maxValue?: string;
      onMinChange?: (value: string) => void;
      onMaxChange?: (value: string) => void;
    };
```

## FilterGroupRadioOption (type)

```ts
export type FilterGroupRadioOption = {
  value: string;
  label: string;
  checked?: boolean;
};
```

## 选型

- 侧边筛选器分组（多个 FilterGroup 叠起来）→ 每个一个 `FilterGroup`
- 外层触发按钮 → `FilterTrigger`
- 整个筛选面板 → `FilterPanel`
