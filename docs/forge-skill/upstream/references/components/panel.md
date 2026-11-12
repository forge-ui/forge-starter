# panel

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/panel.tsx`；core **0.8.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## Panel (value)

```ts
({ title, subtitle, action, footer, children, variant, as: Element, asChild, gap, className, ...props }: PanelProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 否 | `ReactNode` |  |
| `subtitle` | 否 | `ReactNode` |  |
| `action` | 否 | `ReactNode` |  |
| `footer` | 否 | `ReactNode` |  |
| `children` | 是 | `ReactNode` |  |
| `variant` | 否 | `"template" \| "dashboard" \| "custom" \| undefined` |  |
| `as` | 否 | `"article" \| "div" \| "section" \| "aside" \| undefined` |  |
| `asChild` | 否 | `boolean \| undefined` |  |
| `gap` | 否 | `"md" \| "sm" \| "none" \| undefined` |  |
| `color` | 否 | `string \| undefined` |  |
| `defaultChecked` | 否 | `boolean \| undefined` |  |
| `defaultValue` | 否 | `string \| number \| readonly string[] \| undefined` |  |
| `suppressContentEditableWarning` | 否 | `boolean \| undefined` |  |
| `suppressHydrationWarning` | 否 | `boolean \| undefined` |  |
| `accessKey` | 否 | `string \| undefined` |  |
| `autoCapitalize` | 否 | `"none" \| "off" \| "on" \| "sentences" \| "words" \| "characters" \| (string & {}) \| undefined` |  |
| `autoFocus` | 否 | `boolean \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `contentEditable` | 否 | `Booleanish \| "inherit" \| "plaintext-only" \| undefined` |  |
| `contextMenu` | 否 | `string \| undefined` |  |
| `dir` | 否 | `string \| undefined` |  |
| `draggable` | 否 | `Booleanish \| undefined` |  |
| `enterKeyHint` | 否 | `"enter" \| "done" \| "go" \| "next" \| "previous" \| "search" \| "send" \| undefined` |  |
| `hidden` | 否 | `boolean \| undefined` |  |
| `id` | 否 | `string \| undefined` |  |
| `lang` | 否 | `string \| undefined` |  |
| `nonce` | 否 | `string \| undefined` |  |
| `slot` | 否 | `string \| undefined` |  |
| `spellCheck` | 否 | `Booleanish \| undefined` |  |
| `style` | 否 | `CSSProperties \| undefined` |  |
| `tabIndex` | 否 | `number \| undefined` |  |
| `translate` | 否 | `"yes" \| "no" \| undefined` |  |
| `radioGroup` | 否 | `string \| undefined` |  |
| `role` | 否 | `AriaRole \| undefined` |  |
| `about` | 否 | `string \| undefined` |  |
| `content` | 否 | `string \| undefined` |  |
| `datatype` | 否 | `string \| undefined` |  |
| `inlist` | 否 | `any` |  |
| `prefix` | 否 | `string \| undefined` |  |
| `property` | 否 | `string \| undefined` |  |
| `rel` | 否 | `string \| undefined` |  |
| `resource` | 否 | `string \| undefined` |  |
| `rev` | 否 | `string \| undefined` |  |
| `typeof` | 否 | `string \| undefined` |  |
| `vocab` | 否 | `string \| undefined` |  |
| `autoCorrect` | 否 | `string \| undefined` |  |
| `autoSave` | 否 | `string \| undefined` |  |
| `itemProp` | 否 | `string \| undefined` |  |
| `itemScope` | 否 | `boolean \| undefined` |  |
| `itemType` | 否 | `string \| undefined` |  |
| `itemID` | 否 | `string \| undefined` |  |
| `itemRef` | 否 | `string \| undefined` |  |
| `results` | 否 | `number \| undefined` |  |
| `security` | 否 | `string \| undefined` |  |
| `unselectable` | 否 | `"off" \| "on" \| undefined` |  |
| `popover` | 否 | `"" \| "auto" \| "manual" \| "hint" \| undefined` |  |
| `popoverTargetAction` | 否 | `"toggle" \| "show" \| "hide" \| undefined` |  |
| `popoverTarget` | 否 | `string \| undefined` |  |
| `inert` | 否 | `boolean \| undefined` |  |
| `inputMode` | 否 | `"none" \| "search" \| "text" \| "tel" \| "url" \| "email" \| "numeric" \| "decimal" \| undefined` | Hints at the type of data that might be entered by the user while editing the element or its contents |
| `is` | 否 | `string \| undefined` | Specify that a standard HTML element should behave like a defined custom built-in element |
| `exportparts` | 否 | `string \| undefined` |  |
| `part` | 否 | `string \| undefined` |  |
| `aria-activedescendant` | 否 | `string \| undefined` | Identifies the currently active element when DOM focus is on a composite widget, textbox, group, or application. |
| `aria-atomic` | 否 | `Booleanish \| undefined` | Indicates whether assistive technologies will present all, or only parts of, the changed region based on the change notifications defined by the aria-relevant attribute. |
| `aria-autocomplete` | 否 | `"none" \| "list" \| "inline" \| "both" \| undefined` | Indicates whether inputting text could trigger display of one or more predictions of the user's intended value for an input and specifies how predictions would be presented if they are made. |
| `aria-braillelabel` | 否 | `string \| undefined` | Defines a string value that labels the current element, which is intended to be converted into Braille. |
| `aria-brailleroledescription` | 否 | `string \| undefined` | Defines a human-readable, author-localized abbreviated description for the role of an element, which is intended to be converted into Braille. |
| `aria-busy` | 否 | `Booleanish \| undefined` |  |
| `aria-checked` | 否 | `boolean \| "true" \| "false" \| "mixed" \| undefined` | Indicates the current "checked" state of checkboxes, radio buttons, and other widgets. |
| `aria-colcount` | 否 | `number \| undefined` | Defines the total number of columns in a table, grid, or treegrid. |
| `aria-colindex` | 否 | `number \| undefined` | Defines an element's column index or position with respect to the total number of columns within a table, grid, or treegrid. |
| `aria-colindextext` | 否 | `string \| undefined` | Defines a human readable text alternative of aria-colindex. |
| `aria-colspan` | 否 | `number \| undefined` | Defines the number of columns spanned by a cell or gridcell within a table, grid, or treegrid. |
| `aria-controls` | 否 | `string \| undefined` | Identifies the element (or elements) whose contents or presence are controlled by the current element. |
| `aria-current` | 否 | `boolean \| "true" \| "false" \| "page" \| "step" \| "location" \| "date" \| "time" \| undefined` | Indicates the element that represents the current item within a container or set of related elements. |
| `aria-describedby` | 否 | `string \| undefined` | Identifies the element (or elements) that describes the object. |
| `aria-description` | 否 | `string \| undefined` | Defines a string value that describes or annotates the current element. |
| `aria-details` | 否 | `string \| undefined` | Identifies the element that provides a detailed, extended description for the object. |
| `aria-disabled` | 否 | `Booleanish \| undefined` | Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable. |
| `aria-dropeffect` | 否 | `"none" \| "link" \| "copy" \| "execute" \| "move" \| "popup" \| undefined` | Indicates what functions can be performed when a dragged object is released on the drop target. |
| `aria-errormessage` | 否 | `string \| undefined` | Identifies the element that provides an error message for the object. |
| `aria-expanded` | 否 | `Booleanish \| undefined` | Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed. |
| `aria-flowto` | 否 | `string \| undefined` | Identifies the next element (or elements) in an alternate reading order of content which, at the user's discretion, allows assistive technology to override the general default of reading in document source order. |
| `aria-grabbed` | 否 | `Booleanish \| undefined` | Indicates an element's "grabbed" state in a drag-and-drop operation. |
| `aria-haspopup` | 否 | `boolean \| "true" \| "false" \| "dialog" \| "grid" \| "listbox" \| "menu" \| "tree" \| undefined` | Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element. |
| `aria-hidden` | 否 | `Booleanish \| undefined` | Indicates whether the element is exposed to an accessibility API. |
| `aria-invalid` | 否 | `boolean \| "true" \| "false" \| "grammar" \| "spelling" \| undefined` | Indicates the entered value does not conform to the format expected by the application. |
| `aria-keyshortcuts` | 否 | `string \| undefined` | Indicates keyboard shortcuts that an author has implemented to activate or give focus to an element. |
| `aria-label` | 否 | `string \| undefined` | Defines a string value that labels the current element. |
| `aria-labelledby` | 否 | `string \| undefined` | Identifies the element (or elements) that labels the current element. |
| `aria-level` | 否 | `number \| undefined` | Defines the hierarchical level of an element within a structure. |
| `aria-live` | 否 | `"off" \| "assertive" \| "polite" \| undefined` | Indicates that an element will be updated, and describes the types of updates the user agents, assistive technologies, and user can expect from the live region. |
| `aria-modal` | 否 | `Booleanish \| undefined` | Indicates whether an element is modal when displayed. |
| `aria-multiline` | 否 | `Booleanish \| undefined` | Indicates whether a text box accepts multiple lines of input or only a single line. |
| `aria-multiselectable` | 否 | `Booleanish \| undefined` | Indicates that the user may select more than one item from the current selectable descendants. |
| `aria-orientation` | 否 | `"horizontal" \| "vertical" \| undefined` | Indicates whether the element's orientation is horizontal, vertical, or unknown/ambiguous. |
| `aria-owns` | 否 | `string \| undefined` | Identifies an element (or elements) in order to define a visual, functional, or contextual parent/child relationship between DOM elements where the DOM hierarchy cannot be used to represent the relationship. |
| `aria-placeholder` | 否 | `string \| undefined` | Defines a short hint (a word or short phrase) intended to aid the user with data entry when the control has no value. A hint could be a sample value or a brief description of the expected format. |
| `aria-posinset` | 否 | `number \| undefined` | Defines an element's number or position in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM. |
| `aria-pressed` | 否 | `boolean \| "true" \| "false" \| "mixed" \| undefined` | Indicates the current "pressed" state of toggle buttons. |
| `aria-readonly` | 否 | `Booleanish \| undefined` | Indicates that the element is not editable, but is otherwise operable. |
| `aria-relevant` | 否 | `"text" \| "additions" \| "additions removals" \| "additions text" \| "all" \| "removals" \| "removals additions" \| "removals text" \| "text additions" \| "text removals" \| undefined` | Indicates what notifications the user agent will trigger when the accessibility tree within a live region is modified. |
| `aria-required` | 否 | `Booleanish \| undefined` | Indicates that user input is required on the element before a form may be submitted. |
| `aria-roledescription` | 否 | `string \| undefined` | Defines a human-readable, author-localized description for the role of an element. |
| `aria-rowcount` | 否 | `number \| undefined` | Defines the total number of rows in a table, grid, or treegrid. |
| `aria-rowindex` | 否 | `number \| undefined` | Defines an element's row index or position with respect to the total number of rows within a table, grid, or treegrid. |
| `aria-rowindextext` | 否 | `string \| undefined` | Defines a human readable text alternative of aria-rowindex. |
| `aria-rowspan` | 否 | `number \| undefined` | Defines the number of rows spanned by a cell or gridcell within a table, grid, or treegrid. |
| `aria-selected` | 否 | `Booleanish \| undefined` | Indicates the current "selected" state of various widgets. |
| `aria-setsize` | 否 | `number \| undefined` | Defines the number of items in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM. |
| `aria-sort` | 否 | `"none" \| "ascending" \| "descending" \| "other" \| undefined` | Indicates if items in a table or grid are sorted in ascending or descending order. |
| `aria-valuemax` | 否 | `number \| undefined` | Defines the maximum allowed value for a range widget. |
| `aria-valuemin` | 否 | `number \| undefined` | Defines the minimum allowed value for a range widget. |
| `aria-valuenow` | 否 | `number \| undefined` | Defines the current value for a range widget. |
| `aria-valuetext` | 否 | `string \| undefined` | Defines the human readable text alternative of aria-valuenow for a range widget. |
| `dangerouslySetInnerHTML` | 否 | `{ __html: string \| TrustedHTML; } \| undefined` |  |
| `onCopy` | 否 | `ClipboardEventHandler<HTMLDivElement> \| undefined` |  |
| `onCopyCapture` | 否 | `ClipboardEventHandler<HTMLDivElement> \| undefined` |  |
| `onCut` | 否 | `ClipboardEventHandler<HTMLDivElement> \| undefined` |  |
| `onCutCapture` | 否 | `ClipboardEventHandler<HTMLDivElement> \| undefined` |  |
| `onPaste` | 否 | `ClipboardEventHandler<HTMLDivElement> \| undefined` |  |
| `onPasteCapture` | 否 | `ClipboardEventHandler<HTMLDivElement> \| undefined` |  |
| `onCompositionEnd` | 否 | `CompositionEventHandler<HTMLDivElement> \| undefined` |  |
| `onCompositionEndCapture` | 否 | `CompositionEventHandler<HTMLDivElement> \| undefined` |  |
| `onCompositionStart` | 否 | `CompositionEventHandler<HTMLDivElement> \| undefined` |  |
| `onCompositionStartCapture` | 否 | `CompositionEventHandler<HTMLDivElement> \| undefined` |  |
| `onCompositionUpdate` | 否 | `CompositionEventHandler<HTMLDivElement> \| undefined` |  |
| `onCompositionUpdateCapture` | 否 | `CompositionEventHandler<HTMLDivElement> \| undefined` |  |
| `onFocus` | 否 | `FocusEventHandler<HTMLDivElement> \| undefined` |  |
| `onFocusCapture` | 否 | `FocusEventHandler<HTMLDivElement> \| undefined` |  |
| `onBlur` | 否 | `FocusEventHandler<HTMLDivElement> \| undefined` |  |
| `onBlurCapture` | 否 | `FocusEventHandler<HTMLDivElement> \| undefined` |  |
| `onChange` | 否 | `ChangeEventHandler<HTMLDivElement, Element> \| undefined` |  |
| `onChangeCapture` | 否 | `ChangeEventHandler<HTMLDivElement, Element> \| undefined` |  |
| `onBeforeInput` | 否 | `InputEventHandler<HTMLDivElement> \| undefined` |  |
| `onBeforeInputCapture` | 否 | `InputEventHandler<HTMLDivElement> \| undefined` |  |
| `onInput` | 否 | `InputEventHandler<HTMLDivElement> \| undefined` |  |
| `onInputCapture` | 否 | `InputEventHandler<HTMLDivElement> \| undefined` |  |
| `onReset` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onResetCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onSubmit` | 否 | `SubmitEventHandler<HTMLDivElement> \| undefined` |  |
| `onSubmitCapture` | 否 | `SubmitEventHandler<HTMLDivElement> \| undefined` |  |
| `onInvalid` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onInvalidCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onLoad` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onLoadCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onError` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onErrorCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onKeyDown` | 否 | `KeyboardEventHandler<HTMLDivElement> \| undefined` |  |
| `onKeyDownCapture` | 否 | `KeyboardEventHandler<HTMLDivElement> \| undefined` |  |
| `onKeyPress` | 否 | `KeyboardEventHandler<HTMLDivElement> \| undefined` |  |
| `onKeyPressCapture` | 否 | `KeyboardEventHandler<HTMLDivElement> \| undefined` |  |
| `onKeyUp` | 否 | `KeyboardEventHandler<HTMLDivElement> \| undefined` |  |
| `onKeyUpCapture` | 否 | `KeyboardEventHandler<HTMLDivElement> \| undefined` |  |
| `onAbort` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onAbortCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onCanPlay` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onCanPlayCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onCanPlayThrough` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onCanPlayThroughCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onDurationChange` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onDurationChangeCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onEmptied` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onEmptiedCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onEncrypted` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onEncryptedCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onEnded` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onEndedCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onLoadedData` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onLoadedDataCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onLoadedMetadata` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onLoadedMetadataCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onLoadStart` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onLoadStartCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onPause` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onPauseCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onPlay` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onPlayCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onPlaying` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onPlayingCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onProgress` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onProgressCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onRateChange` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onRateChangeCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onSeeked` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onSeekedCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onSeeking` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onSeekingCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onStalled` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onStalledCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onSuspend` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onSuspendCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onTimeUpdate` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onTimeUpdateCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onVolumeChange` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onVolumeChangeCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onWaiting` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onWaitingCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onAuxClick` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onAuxClickCapture` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onClick` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onClickCapture` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onContextMenu` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onContextMenuCapture` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onDoubleClick` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onDoubleClickCapture` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onDrag` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDragCapture` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDragEnd` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDragEndCapture` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDragEnter` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDragEnterCapture` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDragExit` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDragExitCapture` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDragLeave` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDragLeaveCapture` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDragOver` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDragOverCapture` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDragStart` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDragStartCapture` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDrop` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onDropCapture` | 否 | `DragEventHandler<HTMLDivElement> \| undefined` |  |
| `onMouseDown` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onMouseDownCapture` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onMouseEnter` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onMouseLeave` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onMouseMove` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onMouseMoveCapture` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onMouseOut` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onMouseOutCapture` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onMouseOver` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onMouseOverCapture` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onMouseUp` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onMouseUpCapture` | 否 | `MouseEventHandler<HTMLDivElement> \| undefined` |  |
| `onSelect` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onSelectCapture` | 否 | `ReactEventHandler<HTMLDivElement> \| undefined` |  |
| `onTouchCancel` | 否 | `TouchEventHandler<HTMLDivElement> \| undefined` |  |
| `onTouchCancelCapture` | 否 | `TouchEventHandler<HTMLDivElement> \| undefined` |  |
| `onTouchEnd` | 否 | `TouchEventHandler<HTMLDivElement> \| undefined` |  |
| `onTouchEndCapture` | 否 | `TouchEventHandler<HTMLDivElement> \| undefined` |  |
| `onTouchMove` | 否 | `TouchEventHandler<HTMLDivElement> \| undefined` |  |
| `onTouchMoveCapture` | 否 | `TouchEventHandler<HTMLDivElement> \| undefined` |  |
| `onTouchStart` | 否 | `TouchEventHandler<HTMLDivElement> \| undefined` |  |
| `onTouchStartCapture` | 否 | `TouchEventHandler<HTMLDivElement> \| undefined` |  |
| `onPointerDown` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onPointerDownCapture` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onPointerMove` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onPointerMoveCapture` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onPointerUp` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onPointerUpCapture` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onPointerCancel` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onPointerCancelCapture` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onPointerEnter` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onPointerLeave` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onPointerOver` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onPointerOverCapture` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onPointerOut` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onPointerOutCapture` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onGotPointerCapture` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onGotPointerCaptureCapture` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onLostPointerCapture` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onLostPointerCaptureCapture` | 否 | `PointerEventHandler<HTMLDivElement> \| undefined` |  |
| `onScroll` | 否 | `UIEventHandler<HTMLDivElement> \| undefined` |  |
| `onScrollCapture` | 否 | `UIEventHandler<HTMLDivElement> \| undefined` |  |
| `onScrollEnd` | 否 | `UIEventHandler<HTMLDivElement> \| undefined` |  |
| `onScrollEndCapture` | 否 | `UIEventHandler<HTMLDivElement> \| undefined` |  |
| `onWheel` | 否 | `WheelEventHandler<HTMLDivElement> \| undefined` |  |
| `onWheelCapture` | 否 | `WheelEventHandler<HTMLDivElement> \| undefined` |  |
| `onAnimationStart` | 否 | `AnimationEventHandler<HTMLDivElement> \| undefined` |  |
| `onAnimationStartCapture` | 否 | `AnimationEventHandler<HTMLDivElement> \| undefined` |  |
| `onAnimationEnd` | 否 | `AnimationEventHandler<HTMLDivElement> \| undefined` |  |
| `onAnimationEndCapture` | 否 | `AnimationEventHandler<HTMLDivElement> \| undefined` |  |
| `onAnimationIteration` | 否 | `AnimationEventHandler<HTMLDivElement> \| undefined` |  |
| `onAnimationIterationCapture` | 否 | `AnimationEventHandler<HTMLDivElement> \| undefined` |  |
| `onToggle` | 否 | `ToggleEventHandler<HTMLDivElement> \| undefined` |  |
| `onBeforeToggle` | 否 | `ToggleEventHandler<HTMLDivElement> \| undefined` |  |
| `onTransitionCancel` | 否 | `TransitionEventHandler<HTMLDivElement> \| undefined` |  |
| `onTransitionCancelCapture` | 否 | `TransitionEventHandler<HTMLDivElement> \| undefined` |  |
| `onTransitionEnd` | 否 | `TransitionEventHandler<HTMLDivElement> \| undefined` |  |
| `onTransitionEndCapture` | 否 | `TransitionEventHandler<HTMLDivElement> \| undefined` |  |
| `onTransitionRun` | 否 | `TransitionEventHandler<HTMLDivElement> \| undefined` |  |
| `onTransitionRunCapture` | 否 | `TransitionEventHandler<HTMLDivElement> \| undefined` |  |
| `onTransitionStart` | 否 | `TransitionEventHandler<HTMLDivElement> \| undefined` |  |
| `onTransitionStartCapture` | 否 | `TransitionEventHandler<HTMLDivElement> \| undefined` |  |

## PanelProps (type)

```ts
export interface PanelProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  variant?: "dashboard" | "template" | "custom";
  as?: "div" | "section" | "aside" | "article";
  asChild?: boolean;
  gap?: "none" | "sm" | "md";
}
```

## 选型建议

模板风格标题容器用 Panel；dashboard 为圆角24px、边框、padding16，template 兼容原共享容器。SurfaceCard 原有分区内容容器不变，不做全局替换。title/subtitle/action/footer 为插槽；无插槽时只渲染 children。

导入自 `@forge-ui-official/core`；交互示例 `/cases/dashboard-kit`，Blocks 画廊 `/blocks`。源码实现不等于截图验收或 npm 已发布。
