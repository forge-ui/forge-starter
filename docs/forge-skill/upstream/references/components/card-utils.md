# card-utils

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/card-utils.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ALL_CARD_THEMES (value)

```ts
readonly CardTheme[]
```

## CardAvatarGroup (value)

```ts
({ avatars, theme, size, max, }: { avatars: string[]; theme: CardThemeConfig; size?: number; max?: number; }) => JSX.Element | null
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `avatars` | 是 | `string[]` |  |
| `theme` | 是 | `CardThemeConfig` |  |
| `size` | 否 | `number \| undefined` |  |
| `max` | 否 | `number \| undefined` | Maximum avatars to show before collapsing into a "+N" chip |

## CardBadgeVariant (type)

```ts
export type CardBadgeVariant = "default" | "greyBg" | "solid" | "opacity" | "white";
```

## CardDensity (type)

```ts
export type CardDensity = "default" | "compact";
```

## CardGlow (value)

```ts
({ theme }: { theme: CardThemeConfig; }) => JSX.Element | null
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `theme` | 是 | `CardThemeConfig` |  |

## CardIconChip (value)

```ts
({ icon, theme, themeKey, variant, size, }: { icon: ReactNode; theme: CardThemeConfig; themeKey?: CardTheme; variant?: CardBadgeVariant; size?: number; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `icon` | 是 | `ReactNode` |  |
| `theme` | 是 | `CardThemeConfig` |  |
| `themeKey` | 否 | `CardTheme \| undefined` | The CardTheme key — needed to resolve badge color variants |
| `variant` | 否 | `CardBadgeVariant \| undefined` |  |
| `size` | 否 | `number \| undefined` |  |

## CardKebabButton (value)

```ts
({ theme, onClick, }: { theme: CardThemeConfig; onClick?: () => void; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `theme` | 是 | `CardThemeConfig` |  |
| `onClick` | 否 | `(() => void) \| undefined` |  |

## CardTheme (type)

```ts
export type CardTheme = "white" | "black" | "purple" | "blue" | "green" | "red" | "yellow" | "cyan";
```

## CardThemeConfig (type)

```ts
export interface CardThemeConfig {
  /** Outer wrapper background + outline */
  bg: string;
  /** Primary text (value/number) color */
  valueColor: string;
  /** Title / label color */
  titleColor: string;
  /** Trend text color (badge-like indicator next to subtitle) */
  trendColor: string;
  /** Secondary text color (subtitle/helper) */
  subtextColor: string;
  /** Accent background for icon chip (used in Icon variant) */
  iconChipBg: string;
  /** Accent text/stroke for icon chip */
  iconChipText: string;
  /** Avatar border color (should match card bg so stacked avatars
   * have a visual gap in the card's own color) */
  avatarBorder: string;
  /** Decorative glow gradient (bottom-right blob) */
  glowFrom?: string;
  /** Decorative glow gradient (top-left blob) */
  glowTo?: string;
}
```

## cardThemes (value)

```ts
Record<CardTheme, CardThemeConfig>
```

## CardTrend (value)

```ts
({ trend, direction, subtitle, theme, }: { trend?: string; direction?: TrendDirection; subtitle?: string; theme: CardThemeConfig; }) => JSX.Element | null
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `trend` | 否 | `string \| undefined` |  |
| `direction` | 否 | `TrendDirection \| undefined` |  |
| `subtitle` | 否 | `string \| undefined` |  |
| `theme` | 是 | `CardThemeConfig` |  |

## CardWidth (type)

```ts
export type CardWidth = "full" | "fixed";
```

## FinancialOrbs (value)

```ts
({ theme, variant, }: { theme: FinancialThemeConfig; variant: FinancialVariant; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `theme` | 是 | `FinancialThemeConfig` |  |
| `variant` | 是 | `FinancialVariant` |  |

## FinancialTheme (type)

```ts
export type FinancialTheme = "dark" | "purple" | "blue" | "yellow" | "cyan" | "green" | "orange" | "red";
```

## FinancialThemeConfig (type)

```ts
export interface FinancialThemeConfig {
  bg: string;
  textColor: string;
  labelColor: string;
  /** Two blurred orb backgrounds — used in "glow" variant */
  glowOrbs: [string, string];
  /** Two gradient orbs — used in "gradient" variant */
  gradientOrbs: [string, string];
}
```

## financialThemes (value)

```ts
Record<FinancialTheme, FinancialThemeConfig>
```

## FinancialVariant (type)

```ts
export type FinancialVariant = "glow" | "gradient" | "flat";
```

## LegacyCardTheme (type)

```ts
export type LegacyCardTheme = "dark" | "orange";
```

## MastercardLogo (value)

```ts
() => JSX.Element
```

## resolveCardTheme (value)

```ts
(t: CardTheme | LegacyCardTheme) => CardTheme
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `toString` | 是 | `() => string` | Returns a string representation of a string. |
| `charAt` | 是 | `(pos: number) => string` | Returns the character at the specified index. |
| `charCodeAt` | 是 | `(index: number) => number` | Returns the Unicode value of the character at the specified location. |
| `concat` | 是 | `(...strings: string[]) => string` | Returns a string that contains the concatenation of two or more strings. |
| `indexOf` | 是 | `(searchString: string, position?: number) => number` | Returns the position of the first occurrence of a substring. |
| `lastIndexOf` | 是 | `(searchString: string, position?: number) => number` | Returns the last occurrence of a substring in the string. |
| `localeCompare` | 是 | `{ (that: string): number; (that: string, locales?: string \| string[], options?: Intl.CollatorOptions): number; (that: string, locales?: Intl.LocalesArgument, options?: Intl.CollatorOptions): number; }` | Determines whether two strings are equivalent in the current locale. Determines whether two strings are equivalent in the current or specified locale. |
| `match` | 是 | `{ (regexp: string \| RegExp): RegExpMatchArray \| null; (matcher: { [Symbol.match](string: string): RegExpMatchArray \| null; }): RegExpMatchArray \| null; }` | Matches a string with a regular expression, and returns an array containing the results of that search. Matches a string or an object that supports being matched against, and returns an array containing the results of that search, or null if no matches are found. |
| `replace` | 是 | `{ (searchValue: string \| RegExp, replaceValue: string): string; (searchValue: string \| RegExp, replacer: (substring: string, ...args: any[]) => string): string; (searchValue: { [Symbol.replace](string: string, replaceValue: string): string; }, replaceValue: string): string; (searchValue: { [Symbol.replace](string: string, replacer: (substring: string, ...args: any[]) => string): string; }, replacer: (substring: string, ...args: any[]) => string): string; }` | Replaces text in a string, using a regular expression or search string. Passes a string and {@linkcode replaceValue} to the `[Symbol.replace]` method on {@linkcode searchValue}. This method is expected to implement its own replacement algorithm. Replaces text in a string, using an object that supports replacement within a string. |
| `search` | 是 | `{ (regexp: string \| RegExp): number; (searcher: { [Symbol.search](string: string): number; }): number; }` | Finds the first substring match in a regular expression search. |
| `slice` | 是 | `(start?: number, end?: number) => string` | Returns a section of a string. |
| `split` | 是 | `{ (separator: string \| RegExp, limit?: number): string[]; (splitter: { [Symbol.split](string: string, limit?: number): string[]; }, limit?: number): string[]; }` | Split a string into substrings using the specified separator and return them as an array. |
| `substring` | 是 | `(start: number, end?: number) => string` | Returns the substring at the specified location within a String object. |
| `toLowerCase` | 是 | `() => string` | Converts all the alphabetic characters in a string to lowercase. |
| `toLocaleLowerCase` | 是 | `{ (locales?: string \| string[]): string; (locales?: Intl.LocalesArgument): string; }` | Converts all alphabetic characters to lowercase, taking into account the host environment's current locale. |
| `toUpperCase` | 是 | `() => string` | Converts all the alphabetic characters in a string to uppercase. |
| `toLocaleUpperCase` | 是 | `{ (locales?: string \| string[]): string; (locales?: Intl.LocalesArgument): string; }` | Returns a string where all alphabetic characters have been converted to uppercase, taking into account the host environment's current locale. |
| `trim` | 是 | `() => string` | Removes the leading and trailing white space and line terminator characters from a string. |
| `length` | 是 | `number` | Returns the length of a String object. |
| `substr` | 是 | `(from: number, length?: number) => string` | Gets a substring beginning at the specified location and having the specified length. |
| `valueOf` | 是 | `() => string` | Returns the primitive value of the specified object. |
| `codePointAt` | 是 | `(pos: number) => number \| undefined` | Returns a nonnegative integer Number less than 1114112 (0x110000) that is the code point value of the UTF-16 encoded code point starting at the string element at position pos in the String resulting from converting this object to a String. If there is no element at that position, the result is undefined. If a valid UTF-16 surrogate pair does not begin at pos, the result is the code unit at pos. |
| `includes` | 是 | `(searchString: string, position?: number) => boolean` | Returns true if searchString appears as a substring of the result of converting this object to a String, at one or more positions that are greater than or equal to position; otherwise, returns false. |
| `endsWith` | 是 | `(searchString: string, endPosition?: number) => boolean` | Returns true if the sequence of elements of searchString converted to a String is the same as the corresponding elements of this object (converted to a String) starting at endPosition – length(this). Otherwise returns false. |
| `normalize` | 是 | `{ (form: "NFC" \| "NFD" \| "NFKC" \| "NFKD"): string; (form?: string): string; }` | Returns the String value result of normalizing the string into the normalization form named by form as specified in Unicode Standard Annex #15, Unicode Normalization Forms. |
| `repeat` | 是 | `(count: number) => string` | Returns a String value that is made from count copies appended together. If count is 0, the empty string is returned. |
| `startsWith` | 是 | `(searchString: string, position?: number) => boolean` | Returns true if the sequence of elements of searchString converted to a String is the same as the corresponding elements of this object (converted to a String) starting at position. Otherwise returns false. |
| `anchor` | 是 | `(name: string) => string` | Returns an `<a>` HTML anchor element and sets the name attribute to the text value |
| `big` | 是 | `() => string` | Returns a `<big>` HTML element |
| `blink` | 是 | `() => string` | Returns a `<blink>` HTML element |
| `bold` | 是 | `() => string` | Returns a `<b>` HTML element |
| `fixed` | 是 | `() => string` | Returns a `<tt>` HTML element |
| `fontcolor` | 是 | `(color: string) => string` | Returns a `<font>` HTML element and sets the color attribute value |
| `fontsize` | 是 | `{ (size: number): string; (size: string): string; }` | Returns a `<font>` HTML element and sets the size attribute value |
| `italics` | 是 | `() => string` | Returns an `<i>` HTML element |
| `link` | 是 | `(url: string) => string` | Returns an `<a>` HTML element and sets the href attribute value |
| `small` | 是 | `() => string` | Returns a `<small>` HTML element |
| `strike` | 是 | `() => string` | Returns a `<strike>` HTML element |
| `sub` | 是 | `() => string` | Returns a `<sub>` HTML element |
| `sup` | 是 | `() => string` | Returns a `<sup>` HTML element |
| `padStart` | 是 | `(maxLength: number, fillString?: string) => string` | Pads the current string with a given string (possibly repeated) so that the resulting string reaches a given length. The padding is applied from the start (left) of the current string. |
| `padEnd` | 是 | `(maxLength: number, fillString?: string) => string` | Pads the current string with a given string (possibly repeated) so that the resulting string reaches a given length. The padding is applied from the end (right) of the current string. |
| `trimEnd` | 是 | `() => string` | Removes the trailing white space and line terminator characters from a string. |
| `trimStart` | 是 | `() => string` | Removes the leading white space and line terminator characters from a string. |
| `trimLeft` | 是 | `() => string` | Removes the leading white space and line terminator characters from a string. |
| `trimRight` | 是 | `() => string` | Removes the trailing white space and line terminator characters from a string. |
| `matchAll` | 是 | `(regexp: RegExp) => RegExpStringIterator<RegExpExecArray>` | Matches a string with a regular expression, and returns an iterable of matches containing the results of that search. |
| `replaceAll` | 是 | `{ (searchValue: string \| RegExp, replaceValue: string): string; (searchValue: string \| RegExp, replacer: (substring: string, ...args: any[]) => string): string; }` | Replace all instances of a substring in a string, using a regular expression or search string. |
| `at` | 是 | `(index: number) => string \| undefined` | Returns a new String consisting of the single UTF-16 code unit located at the specified index. |
| `isWellFormed` | 是 | `() => boolean` | Returns true if all leading surrogates and trailing surrogates appear paired and in order. |
| `toWellFormed` | 是 | `() => string` | Returns a string where all lone or out-of-order surrogates have been replaced by the Unicode replacement character (U+FFFD). |
| `__@iterator@34` | 是 | `() => StringIterator<string>` | Iterator |

## StatCardShell (value)

```ts
({ title, value, trend, trendDirection, subtitle, theme, themeKey, size, icon, iconVariant, action, chartSlot, footerSlot, density, width, className, }: { title: string; value: ReactNode; trend?: string; trendDirection?: TrendDirection; subtitle?: string; theme: CardThemeConfig; themeKey?: CardTheme; size?: StatCardSize; icon?: ReactNode; iconVariant?: CardBadgeVariant; action?: ReactNode; chartSlot?: ReactNode; footerSlot?: ReactNode; density?: CardDensity; width?: CardWidth; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 是 | `string` |  |
| `value` | 是 | `ReactNode` |  |
| `trend` | 否 | `string \| undefined` |  |
| `trendDirection` | 否 | `TrendDirection \| undefined` |  |
| `subtitle` | 否 | `string \| undefined` |  |
| `theme` | 是 | `CardThemeConfig` |  |
| `themeKey` | 否 | `CardTheme \| undefined` | Required when icon is rendered as a colored badge (size="wide" or iconVariant !== "default"). |
| `size` | 否 | `"lg" \| "sm" \| "wide" \| undefined` |  |
| `icon` | 否 | `ReactNode` |  |
| `iconVariant` | 否 | `CardBadgeVariant \| undefined` |  |
| `action` | 否 | `ReactNode` |  |
| `chartSlot` | 否 | `ReactNode` |  |
| `footerSlot` | 否 | `ReactNode` |  |
| `density` | 否 | `CardDensity \| undefined` |  |
| `width` | 否 | `CardWidth \| undefined` | Use full to fill dashboard/grid columns. Use fixed only for Figma-size showcases. |
| `className` | 否 | `string \| undefined` |  |

## StatCardSize (type)

```ts
export type StatCardSize = keyof typeof statCardSizes;
```

## statCardSizes (value)

```ts
{ readonly sm: { readonly wrapper: "p-5"; readonly fixedWidth: "w-64"; readonly value: "text-3xl leading-9"; }; readonly lg: { readonly wrapper: "p-6"; readonly fixedWidth: "w-90"; readonly value: "text-5xl leading-[60px]"; }; readonly wide: { readonly wrapper: "p-6"; readonly fixedWidth: ""; readonly value: "text-3xl leading-9"; }; }
```

## TrendDirection (type)

```ts
export type TrendDirection = "up" | "down";
```

## 何时用

**业务代码里不用**。这些是**扩卡片家族**（比如做一个新业务卡）时的 building block：

```tsx
import { StatCardShell, CardIconChip, CardTrend, cardThemes } from "@forge-ui-official/core";

export function MyCustomCard({ theme = "blue" }) {
  const t = cardThemes[theme];
  return (
    <StatCardShell theme={t}>
      <CardIconChip theme={t}><IconX /></CardIconChip>
      <h4>Metric</h4>
      <CardTrend direction="up" value="+12%" />
    </StatCardShell>
  );
}
```

业务直接用 → `StatCard` / `ProgressStatCard` 等封装好的组件。
