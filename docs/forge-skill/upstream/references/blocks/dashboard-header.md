# 看板页头

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.6.0；组件：Button。

## 最小可用示例

```tsx
import { DashboardHeader } from "@/components/blocks/dashboard-header";

export default function Example() {
  return (<DashboardHeader title="订单运营" description="近 30 天" onExport={() => { const link = document.createElement("a"); link.href = "data:text/csv;charset=utf-8,metric,value%0Aorders,1240"; link.download = "orders.csv"; link.click(); }} dateSelection={<input type="date" aria-label="统计日期" />} />);
}
```

## DashboardHeader Props

| Prop | 必填 | Type |
|---|---|---|
| title | 否 | `ReactNode` |
| description | 否 | `ReactNode` |
| action | 否 | `ReactNode` |
| dateSelection | 否 | `ReactNode` |
| primaryAction | 否 | `ReactNode` |
| onExport | 否 | `(() => void) \| undefined` |
| children | 否 | `ReactNode` |
| defaultChecked | 否 | `boolean \| undefined` |
| defaultValue | 否 | `string \| number \| readonly string[] \| undefined` |
| suppressContentEditableWarning | 否 | `boolean \| undefined` |
| suppressHydrationWarning | 否 | `boolean \| undefined` |
| accessKey | 否 | `string \| undefined` |
| autoCapitalize | 否 | `"none" \| "off" \| "on" \| "sentences" \| "words" \| "characters" \| (string & {}) \| undefined` |
| autoFocus | 否 | `boolean \| undefined` |
| className | 否 | `string \| undefined` |
| contentEditable | 否 | `(boolean \| "true" \| "false") \| "inherit" \| "plaintext-only" \| undefined` |
| contextMenu | 否 | `string \| undefined` |
| dir | 否 | `string \| undefined` |
| draggable | 否 | `(boolean \| "true" \| "false") \| undefined` |
| enterKeyHint | 否 | `"enter" \| "done" \| "go" \| "next" \| "previous" \| "search" \| "send" \| undefined` |
| hidden | 否 | `boolean \| undefined` |
| id | 否 | `string \| undefined` |
| lang | 否 | `string \| undefined` |
| nonce | 否 | `string \| undefined` |
| slot | 否 | `string \| undefined` |
| spellCheck | 否 | `(boolean \| "true" \| "false") \| undefined` |
| style | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").CSSProperties \| undefined` |
| tabIndex | 否 | `number \| undefined` |
| translate | 否 | `"yes" \| "no" \| undefined` |
| radioGroup | 否 | `string \| undefined` |
| role | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").AriaRole \| undefined` |
| about | 否 | `string \| undefined` |
| content | 否 | `string \| undefined` |
| datatype | 否 | `string \| undefined` |
| inlist | 否 | `any` |
| prefix | 否 | `string \| undefined` |
| property | 否 | `string \| undefined` |
| rel | 否 | `string \| undefined` |
| resource | 否 | `string \| undefined` |
| rev | 否 | `string \| undefined` |
| typeof | 否 | `string \| undefined` |
| vocab | 否 | `string \| undefined` |
| autoCorrect | 否 | `string \| undefined` |
| autoSave | 否 | `string \| undefined` |
| color | 否 | `string \| undefined` |
| itemProp | 否 | `string \| undefined` |
| itemScope | 否 | `boolean \| undefined` |
| itemType | 否 | `string \| undefined` |
| itemID | 否 | `string \| undefined` |
| itemRef | 否 | `string \| undefined` |
| results | 否 | `number \| undefined` |
| security | 否 | `string \| undefined` |
| unselectable | 否 | `"off" \| "on" \| undefined` |
| popover | 否 | `"" \| "auto" \| "manual" \| "hint" \| undefined` |
| popoverTargetAction | 否 | `"toggle" \| "show" \| "hide" \| undefined` |
| popoverTarget | 否 | `string \| undefined` |
| inert | 否 | `boolean \| undefined` |
| inputMode | 否 | `"none" \| "search" \| "text" \| "tel" \| "url" \| "email" \| "numeric" \| "decimal" \| undefined` |
| is | 否 | `string \| undefined` |
| exportparts | 否 | `string \| undefined` |
| part | 否 | `string \| undefined` |
| aria-activedescendant | 否 | `string \| undefined` |
| aria-atomic | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-autocomplete | 否 | `"none" \| "list" \| "inline" \| "both" \| undefined` |
| aria-braillelabel | 否 | `string \| undefined` |
| aria-brailleroledescription | 否 | `string \| undefined` |
| aria-busy | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-checked | 否 | `boolean \| "true" \| "false" \| "mixed" \| undefined` |
| aria-colcount | 否 | `number \| undefined` |
| aria-colindex | 否 | `number \| undefined` |
| aria-colindextext | 否 | `string \| undefined` |
| aria-colspan | 否 | `number \| undefined` |
| aria-controls | 否 | `string \| undefined` |
| aria-current | 否 | `boolean \| "true" \| "false" \| "page" \| "step" \| "location" \| "date" \| "time" \| undefined` |
| aria-describedby | 否 | `string \| undefined` |
| aria-description | 否 | `string \| undefined` |
| aria-details | 否 | `string \| undefined` |
| aria-disabled | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-dropeffect | 否 | `"none" \| "link" \| "copy" \| "execute" \| "move" \| "popup" \| undefined` |
| aria-errormessage | 否 | `string \| undefined` |
| aria-expanded | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-flowto | 否 | `string \| undefined` |
| aria-grabbed | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-haspopup | 否 | `boolean \| "true" \| "false" \| "dialog" \| "grid" \| "listbox" \| "menu" \| "tree" \| undefined` |
| aria-hidden | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-invalid | 否 | `boolean \| "true" \| "false" \| "grammar" \| "spelling" \| undefined` |
| aria-keyshortcuts | 否 | `string \| undefined` |
| aria-label | 否 | `string \| undefined` |
| aria-labelledby | 否 | `string \| undefined` |
| aria-level | 否 | `number \| undefined` |
| aria-live | 否 | `"off" \| "assertive" \| "polite" \| undefined` |
| aria-modal | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-multiline | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-multiselectable | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-orientation | 否 | `"horizontal" \| "vertical" \| undefined` |
| aria-owns | 否 | `string \| undefined` |
| aria-placeholder | 否 | `string \| undefined` |
| aria-posinset | 否 | `number \| undefined` |
| aria-pressed | 否 | `boolean \| "true" \| "false" \| "mixed" \| undefined` |
| aria-readonly | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-relevant | 否 | `"text" \| "additions" \| "additions removals" \| "additions text" \| "all" \| "removals" \| "removals additions" \| "removals text" \| "text additions" \| "text removals" \| undefined` |
| aria-required | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-roledescription | 否 | `string \| undefined` |
| aria-rowcount | 否 | `number \| undefined` |
| aria-rowindex | 否 | `number \| undefined` |
| aria-rowindextext | 否 | `string \| undefined` |
| aria-rowspan | 否 | `number \| undefined` |
| aria-selected | 否 | `(boolean \| "true" \| "false") \| undefined` |
| aria-setsize | 否 | `number \| undefined` |
| aria-sort | 否 | `"none" \| "ascending" \| "descending" \| "other" \| undefined` |
| aria-valuemax | 否 | `number \| undefined` |
| aria-valuemin | 否 | `number \| undefined` |
| aria-valuenow | 否 | `number \| undefined` |
| aria-valuetext | 否 | `string \| undefined` |
| dangerouslySetInnerHTML | 否 | `{ __html: string \| TrustedHTML; } \| undefined` |
| onCopy | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ClipboardEventHandler<HTMLDivElement> \| undefined` |
| onCopyCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ClipboardEventHandler<HTMLDivElement> \| undefined` |
| onCut | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ClipboardEventHandler<HTMLDivElement> \| undefined` |
| onCutCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ClipboardEventHandler<HTMLDivElement> \| undefined` |
| onPaste | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ClipboardEventHandler<HTMLDivElement> \| undefined` |
| onPasteCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ClipboardEventHandler<HTMLDivElement> \| undefined` |
| onCompositionEnd | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").CompositionEventHandler<HTMLDivElement> \| undefined` |
| onCompositionEndCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").CompositionEventHandler<HTMLDivElement> \| undefined` |
| onCompositionStart | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").CompositionEventHandler<HTMLDivElement> \| undefined` |
| onCompositionStartCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").CompositionEventHandler<HTMLDivElement> \| undefined` |
| onCompositionUpdate | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").CompositionEventHandler<HTMLDivElement> \| undefined` |
| onCompositionUpdateCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").CompositionEventHandler<HTMLDivElement> \| undefined` |
| onFocus | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").FocusEventHandler<HTMLDivElement> \| undefined` |
| onFocusCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").FocusEventHandler<HTMLDivElement> \| undefined` |
| onBlur | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").FocusEventHandler<HTMLDivElement> \| undefined` |
| onBlurCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").FocusEventHandler<HTMLDivElement> \| undefined` |
| onChange | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ChangeEventHandler<HTMLDivElement, Element> \| undefined` |
| onChangeCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ChangeEventHandler<HTMLDivElement, Element> \| undefined` |
| onBeforeInput | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").InputEventHandler<HTMLDivElement> \| undefined` |
| onBeforeInputCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").InputEventHandler<HTMLDivElement> \| undefined` |
| onInput | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").InputEventHandler<HTMLDivElement> \| undefined` |
| onInputCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").InputEventHandler<HTMLDivElement> \| undefined` |
| onReset | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactEventHandler<HTMLDivElement> \| undefined` |
| onResetCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactEventHandler<HTMLDivElement> \| undefined` |
| onSubmit | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").SubmitEventHandler<HTMLDivElement> \| undefined` |
| onSubmitCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").SubmitEventHandler<HTMLDivElement> \| undefined` |
| onInvalid | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactEventHandler<HTMLDivElement> \| undefined` |
| onInvalidCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactEventHandler<HTMLDivElement> \| undefined` |
| onLoad | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactEventHandler<HTMLDivElement> \| undefined` |
| onLoadCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactEventHandler<HTMLDivElement> \| undefined` |
| onError | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactEventHandler<HTMLDivElement> \| undefined` |
| onErrorCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactEventHandler<HTMLDivElement> \| undefined` |
| onKeyDown | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").KeyboardEventHandler<HTMLDivElement> \| undefined` |
| onKeyDownCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").KeyboardEventHandler<HTMLDivElement> \| undefined` |
| onKeyPress | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").KeyboardEventHandler<HTMLDivElement> \| undefined` |
| onKeyPressCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").KeyboardEventHandler<HTMLDivElement> \| undefined` |
| onKeyUp | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").KeyboardEventHandler<HTMLDivElement> \| undefined` |
| onKeyUpCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").KeyboardEventHandler<HTMLDivElement> \| undefined` |
| onAbort | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactEventHandler<HTMLDivElement> \| undefined` |
| onAbortCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactEventHandler<HTMLDivElement> \| undefined` |
| onCanPlay | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactEventHandler<HTMLDivElement> \| undefined` |
| onCanPlayCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactEventHandler<HTMLDivElement> \| undefined` |
| onCanPlayThrough | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactEventHandler<HTMLDivElement> \| undefined` |
| onCanPlayThroughCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactEventHandler<HTMLDivElement> \| undefined` |
| onDurationChange | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactEventHandler<HTMLDivElement> \| undefined` |
| onDurationChangeCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactEventHandler<HTMLDivElement> \| undefined` |
| onEmptied | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactEventHandler<HTMLDivElement> \| undefined` |
| onEmptiedCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactEventHandler<HTMLDivElement> \| undefined` |
| onEncrypted | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactEventHandler<HTMLDivElement> \| undefined` |
| onEncryptedCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactEventHandler<HTMLDivElement> \| undefined` |
| onEnded | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactEventHandler<HTMLDivElement> \| undefined` |
| onEndedCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactEventHandler<HTMLDivElement> \| undefined` |
| onLoadedData | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactEventHandler<HTMLDivElement> \| undefined` |
| onLoadedDataCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactEventHandler<HTMLDivElement> \| undefined` |
| onLoadedMetadata | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactEventHandler<HTMLDivElement> \| undefined` |
| onLoadedMetadataCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactEventHandler<HTMLDivElement> \| undefined` |
| onLoadStart | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactEventHandler<HTMLDivElement> \| undefined` |
| onLoadStartCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactEventHandler<HTMLDivElement> \| undefined` |
| onPause | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactEventHandler<HTMLDivElement> \| undefined` |
| onPauseCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactEventHandler<HTMLDivElement> \| undefined` |
| onPlay | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactEventHandler<HTMLDivElement> \| undefined` |
| onPlayCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactEventHandler<HTMLDivElement> \| undefined` |
| onPlaying | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactEventHandler<HTMLDivElement> \| undefined` |
| onPlayingCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactEventHandler<HTMLDivElement> \| undefined` |
| onProgress | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactEventHandler<HTMLDivElement> \| undefined` |
| onProgressCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactEventHandler<HTMLDivElement> \| undefined` |
| onRateChange | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactEventHandler<HTMLDivElement> \| undefined` |
| onRateChangeCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactEventHandler<HTMLDivElement> \| undefined` |
| onSeeked | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactEventHandler<HTMLDivElement> \| undefined` |
| onSeekedCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactEventHandler<HTMLDivElement> \| undefined` |
| onSeeking | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactEventHandler<HTMLDivElement> \| undefined` |
| onSeekingCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactEventHandler<HTMLDivElement> \| undefined` |
| onStalled | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactEventHandler<HTMLDivElement> \| undefined` |
| onStalledCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactEventHandler<HTMLDivElement> \| undefined` |
| onSuspend | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactEventHandler<HTMLDivElement> \| undefined` |
| onSuspendCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactEventHandler<HTMLDivElement> \| undefined` |
| onTimeUpdate | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactEventHandler<HTMLDivElement> \| undefined` |
| onTimeUpdateCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactEventHandler<HTMLDivElement> \| undefined` |
| onVolumeChange | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactEventHandler<HTMLDivElement> \| undefined` |
| onVolumeChangeCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactEventHandler<HTMLDivElement> \| undefined` |
| onWaiting | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactEventHandler<HTMLDivElement> \| undefined` |
| onWaitingCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactEventHandler<HTMLDivElement> \| undefined` |
| onAuxClick | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").MouseEventHandler<HTMLDivElement> \| undefined` |
| onAuxClickCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").MouseEventHandler<HTMLDivElement> \| undefined` |
| onClick | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").MouseEventHandler<HTMLDivElement> \| undefined` |
| onClickCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").MouseEventHandler<HTMLDivElement> \| undefined` |
| onContextMenu | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").MouseEventHandler<HTMLDivElement> \| undefined` |
| onContextMenuCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").MouseEventHandler<HTMLDivElement> \| undefined` |
| onDoubleClick | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").MouseEventHandler<HTMLDivElement> \| undefined` |
| onDoubleClickCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").MouseEventHandler<HTMLDivElement> \| undefined` |
| onDrag | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragEnd | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragEndCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragEnter | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragEnterCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragExit | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragExitCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragLeave | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragLeaveCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragOver | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragOverCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragStart | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").DragEventHandler<HTMLDivElement> \| undefined` |
| onDragStartCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").DragEventHandler<HTMLDivElement> \| undefined` |
| onDrop | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").DragEventHandler<HTMLDivElement> \| undefined` |
| onDropCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").DragEventHandler<HTMLDivElement> \| undefined` |
| onMouseDown | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").MouseEventHandler<HTMLDivElement> \| undefined` |
| onMouseDownCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").MouseEventHandler<HTMLDivElement> \| undefined` |
| onMouseEnter | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").MouseEventHandler<HTMLDivElement> \| undefined` |
| onMouseLeave | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").MouseEventHandler<HTMLDivElement> \| undefined` |
| onMouseMove | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").MouseEventHandler<HTMLDivElement> \| undefined` |
| onMouseMoveCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").MouseEventHandler<HTMLDivElement> \| undefined` |
| onMouseOut | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").MouseEventHandler<HTMLDivElement> \| undefined` |
| onMouseOutCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").MouseEventHandler<HTMLDivElement> \| undefined` |
| onMouseOver | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").MouseEventHandler<HTMLDivElement> \| undefined` |
| onMouseOverCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").MouseEventHandler<HTMLDivElement> \| undefined` |
| onMouseUp | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").MouseEventHandler<HTMLDivElement> \| undefined` |
| onMouseUpCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").MouseEventHandler<HTMLDivElement> \| undefined` |
| onSelect | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactEventHandler<HTMLDivElement> \| undefined` |
| onSelectCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactEventHandler<HTMLDivElement> \| undefined` |
| onTouchCancel | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").TouchEventHandler<HTMLDivElement> \| undefined` |
| onTouchCancelCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").TouchEventHandler<HTMLDivElement> \| undefined` |
| onTouchEnd | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").TouchEventHandler<HTMLDivElement> \| undefined` |
| onTouchEndCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").TouchEventHandler<HTMLDivElement> \| undefined` |
| onTouchMove | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").TouchEventHandler<HTMLDivElement> \| undefined` |
| onTouchMoveCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").TouchEventHandler<HTMLDivElement> \| undefined` |
| onTouchStart | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").TouchEventHandler<HTMLDivElement> \| undefined` |
| onTouchStartCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").TouchEventHandler<HTMLDivElement> \| undefined` |
| onPointerDown | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerDownCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerMove | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerMoveCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerUp | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerUpCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerCancel | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerCancelCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerEnter | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerLeave | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerOver | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerOverCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerOut | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").PointerEventHandler<HTMLDivElement> \| undefined` |
| onPointerOutCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").PointerEventHandler<HTMLDivElement> \| undefined` |
| onGotPointerCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").PointerEventHandler<HTMLDivElement> \| undefined` |
| onGotPointerCaptureCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").PointerEventHandler<HTMLDivElement> \| undefined` |
| onLostPointerCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").PointerEventHandler<HTMLDivElement> \| undefined` |
| onLostPointerCaptureCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").PointerEventHandler<HTMLDivElement> \| undefined` |
| onScroll | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").UIEventHandler<HTMLDivElement> \| undefined` |
| onScrollCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").UIEventHandler<HTMLDivElement> \| undefined` |
| onScrollEnd | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").UIEventHandler<HTMLDivElement> \| undefined` |
| onScrollEndCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").UIEventHandler<HTMLDivElement> \| undefined` |
| onWheel | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").WheelEventHandler<HTMLDivElement> \| undefined` |
| onWheelCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").WheelEventHandler<HTMLDivElement> \| undefined` |
| onAnimationStart | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").AnimationEventHandler<HTMLDivElement> \| undefined` |
| onAnimationStartCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").AnimationEventHandler<HTMLDivElement> \| undefined` |
| onAnimationEnd | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").AnimationEventHandler<HTMLDivElement> \| undefined` |
| onAnimationEndCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").AnimationEventHandler<HTMLDivElement> \| undefined` |
| onAnimationIteration | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").AnimationEventHandler<HTMLDivElement> \| undefined` |
| onAnimationIterationCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").AnimationEventHandler<HTMLDivElement> \| undefined` |
| onToggle | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ToggleEventHandler<HTMLDivElement> \| undefined` |
| onBeforeToggle | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ToggleEventHandler<HTMLDivElement> \| undefined` |
| onTransitionCancel | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").TransitionEventHandler<HTMLDivElement> \| undefined` |
| onTransitionCancelCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").TransitionEventHandler<HTMLDivElement> \| undefined` |
| onTransitionEnd | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").TransitionEventHandler<HTMLDivElement> \| undefined` |
| onTransitionEndCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").TransitionEventHandler<HTMLDivElement> \| undefined` |
| onTransitionRun | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").TransitionEventHandler<HTMLDivElement> \| undefined` |
| onTransitionRunCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").TransitionEventHandler<HTMLDivElement> \| undefined` |
| onTransitionStart | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").TransitionEventHandler<HTMLDivElement> \| undefined` |
| onTransitionStartCapture | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").TransitionEventHandler<HTMLDivElement> \| undefined` |
