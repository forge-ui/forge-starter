# 卡片轮播

分类：财务。以可切换的卡片展示多个账户，适用于钱包和财务首页。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：CreditCard、PageDot。

## 最小可用示例

```tsx
import { CardCarousel } from "@/components/blocks/card-carousel";

export default function Example() {
  return (<CardCarousel cards={[{ id: "main", holderName: "运营账户", cardNumber: "9090" }]} showPagination />);
}
```

## CardCarousel Props

| Prop | 必填 | Type |
|---|---|---|
| cards | 是 | `({ locale?: "zh" \| "en"; cardNumberLabel?: string; holderNameLabel?: string; cardNumber?: string; holderName?: string; expiry?: string; theme?: import("@forge-ui-official/core").FinancialTheme; variant?: import("@forge-ui-official/core").FinancialVariant; width?: import("@forge-ui-official/core").CardWidth; className?: string; } & { id: string; })[]` |
| size | 否 | `"default" \| "compact" \| undefined` |
| index | 否 | `number \| undefined` |
| defaultIndex | 否 | `number \| undefined` |
| onIndexChange | 否 | `((index: number) => void) \| undefined` |
| showPagination | 否 | `boolean \| undefined` |
