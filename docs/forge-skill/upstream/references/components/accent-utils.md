# accent-utils

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/accent-utils.ts`；core **0.8.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## AccentColor (type)

```ts
export type AccentColor = "purple" | "blue" | "black";
```

## accentColors (value)

```ts
Record<AccentColor, AccentConfig>
```

## AccentConfig (type)

```ts
export interface AccentConfig {
  /** Solid background (buttons, checked state, selected pill) */
  bg: string;
  /** Text color */
  text: string;
  /** Outline / border color */
  outline: string;
  /** Light tinted background (icon badges, tag bg, light button) */
  bgTint: string;
  /** Border class (for components using border instead of outline) */
  border: string;
  /** Secondary text that reads on top of accent.bg (e.g. subtitle on a solid accent card) */
  onAccentMuted: string;
  /** CSS color value matching `bg` — for SVG fill / stroke / icon color props that don't accept className */
  hex: string;
  /** Monochromatic shade ramp (deep → light), 5 stops. For multi-segment charts. */
  ramp: readonly [string, string, string, string, string];
  /** CSS color values matching `ramp` stops — for SVG conic gradients / stroke colors */
  rampHex: readonly [string, string, string, string, string];
}
```
