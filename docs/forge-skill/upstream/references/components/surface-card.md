# surface-card

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/surface-card.tsx`；core **0.8.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## SurfaceCard (value)

```ts
({ title, subtitle, action, children, footer, padding, className, headerClassName, contentClassName, footerClassName, effect, motion, ...props }: { title?: ReactNode; subtitle?: ReactNode; action?: ReactNode; children: ReactNode; footer?: ReactNode; padding?: SurfaceCardPadding; className?: string; headerClassName?: string; contentClassName?: string; footerClassName?: string; effect?: "tilt" | "layered"; motion?: MotionPreference; } & Omit<HTMLAttributes<HTMLElement>, "title">) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 否 | `ReactNode` |  |
| `subtitle` | 否 | `ReactNode` |  |
| `action` | 否 | `ReactNode` |  |
| `children` | 是 | `ReactNode` |  |
| `footer` | 否 | `ReactNode` |  |
| `padding` | 否 | `SurfaceCardPadding \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `headerClassName` | 否 | `string \| undefined` |  |
| `contentClassName` | 否 | `string \| undefined` |  |
| `footerClassName` | 否 | `string \| undefined` |  |
| `effect` | 否 | `"tilt" \| "layered" \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `color` | 否 | `string \| undefined` |  |
| `defaultChecked` | 否 | `boolean \| undefined` |  |
| `defaultValue` | 否 | `string \| number \| readonly string[] \| undefined` |  |
| `suppressContentEditableWarning` | 否 | `boolean \| undefined` |  |
| `suppressHydrationWarning` | 否 | `boolean \| undefined` |  |
| `accessKey` | 否 | `string \| undefined` |  |
| `autoCapitalize` | 否 | `"none" \| "off" \| "on" \| "sentences" \| "words" \| "characters" \| (string & {}) \| undefined` |  |
| `autoFocus` | 否 | `boolean \| undefined` |  |
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
| `onCopy` | 否 | `ClipboardEventHandler<HTMLElement> \| undefined` |  |
| `onCopyCapture` | 否 | `ClipboardEventHandler<HTMLElement> \| undefined` |  |
| `onCut` | 否 | `ClipboardEventHandler<HTMLElement> \| undefined` |  |
| `onCutCapture` | 否 | `ClipboardEventHandler<HTMLElement> \| undefined` |  |
| `onPaste` | 否 | `ClipboardEventHandler<HTMLElement> \| undefined` |  |
| `onPasteCapture` | 否 | `ClipboardEventHandler<HTMLElement> \| undefined` |  |
| `onCompositionEnd` | 否 | `CompositionEventHandler<HTMLElement> \| undefined` |  |
| `onCompositionEndCapture` | 否 | `CompositionEventHandler<HTMLElement> \| undefined` |  |
| `onCompositionStart` | 否 | `CompositionEventHandler<HTMLElement> \| undefined` |  |
| `onCompositionStartCapture` | 否 | `CompositionEventHandler<HTMLElement> \| undefined` |  |
| `onCompositionUpdate` | 否 | `CompositionEventHandler<HTMLElement> \| undefined` |  |
| `onCompositionUpdateCapture` | 否 | `CompositionEventHandler<HTMLElement> \| undefined` |  |
| `onFocus` | 否 | `FocusEventHandler<HTMLElement> \| undefined` |  |
| `onFocusCapture` | 否 | `FocusEventHandler<HTMLElement> \| undefined` |  |
| `onBlur` | 否 | `FocusEventHandler<HTMLElement> \| undefined` |  |
| `onBlurCapture` | 否 | `FocusEventHandler<HTMLElement> \| undefined` |  |
| `onChange` | 否 | `ChangeEventHandler<HTMLElement, Element> \| undefined` |  |
| `onChangeCapture` | 否 | `ChangeEventHandler<HTMLElement, Element> \| undefined` |  |
| `onBeforeInput` | 否 | `InputEventHandler<HTMLElement> \| undefined` |  |
| `onBeforeInputCapture` | 否 | `InputEventHandler<HTMLElement> \| undefined` |  |
| `onInput` | 否 | `InputEventHandler<HTMLElement> \| undefined` |  |
| `onInputCapture` | 否 | `InputEventHandler<HTMLElement> \| undefined` |  |
| `onReset` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onResetCapture` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onSubmit` | 否 | `SubmitEventHandler<HTMLElement> \| undefined` |  |
| `onSubmitCapture` | 否 | `SubmitEventHandler<HTMLElement> \| undefined` |  |
| `onInvalid` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onInvalidCapture` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onLoad` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onLoadCapture` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onError` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onErrorCapture` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onKeyDown` | 否 | `KeyboardEventHandler<HTMLElement> \| undefined` |  |
| `onKeyDownCapture` | 否 | `KeyboardEventHandler<HTMLElement> \| undefined` |  |
| `onKeyPress` | 否 | `KeyboardEventHandler<HTMLElement> \| undefined` |  |
| `onKeyPressCapture` | 否 | `KeyboardEventHandler<HTMLElement> \| undefined` |  |
| `onKeyUp` | 否 | `KeyboardEventHandler<HTMLElement> \| undefined` |  |
| `onKeyUpCapture` | 否 | `KeyboardEventHandler<HTMLElement> \| undefined` |  |
| `onAbort` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onAbortCapture` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onCanPlay` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onCanPlayCapture` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onCanPlayThrough` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onCanPlayThroughCapture` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onDurationChange` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onDurationChangeCapture` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onEmptied` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onEmptiedCapture` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onEncrypted` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onEncryptedCapture` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onEnded` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onEndedCapture` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onLoadedData` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onLoadedDataCapture` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onLoadedMetadata` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onLoadedMetadataCapture` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onLoadStart` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onLoadStartCapture` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onPause` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onPauseCapture` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onPlay` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onPlayCapture` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onPlaying` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onPlayingCapture` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onProgress` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onProgressCapture` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onRateChange` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onRateChangeCapture` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onSeeked` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onSeekedCapture` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onSeeking` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onSeekingCapture` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onStalled` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onStalledCapture` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onSuspend` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onSuspendCapture` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onTimeUpdate` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onTimeUpdateCapture` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onVolumeChange` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onVolumeChangeCapture` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onWaiting` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onWaitingCapture` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onAuxClick` | 否 | `MouseEventHandler<HTMLElement> \| undefined` |  |
| `onAuxClickCapture` | 否 | `MouseEventHandler<HTMLElement> \| undefined` |  |
| `onClick` | 否 | `MouseEventHandler<HTMLElement> \| undefined` |  |
| `onClickCapture` | 否 | `MouseEventHandler<HTMLElement> \| undefined` |  |
| `onContextMenu` | 否 | `MouseEventHandler<HTMLElement> \| undefined` |  |
| `onContextMenuCapture` | 否 | `MouseEventHandler<HTMLElement> \| undefined` |  |
| `onDoubleClick` | 否 | `MouseEventHandler<HTMLElement> \| undefined` |  |
| `onDoubleClickCapture` | 否 | `MouseEventHandler<HTMLElement> \| undefined` |  |
| `onDrag` | 否 | `DragEventHandler<HTMLElement> \| undefined` |  |
| `onDragCapture` | 否 | `DragEventHandler<HTMLElement> \| undefined` |  |
| `onDragEnd` | 否 | `DragEventHandler<HTMLElement> \| undefined` |  |
| `onDragEndCapture` | 否 | `DragEventHandler<HTMLElement> \| undefined` |  |
| `onDragEnter` | 否 | `DragEventHandler<HTMLElement> \| undefined` |  |
| `onDragEnterCapture` | 否 | `DragEventHandler<HTMLElement> \| undefined` |  |
| `onDragExit` | 否 | `DragEventHandler<HTMLElement> \| undefined` |  |
| `onDragExitCapture` | 否 | `DragEventHandler<HTMLElement> \| undefined` |  |
| `onDragLeave` | 否 | `DragEventHandler<HTMLElement> \| undefined` |  |
| `onDragLeaveCapture` | 否 | `DragEventHandler<HTMLElement> \| undefined` |  |
| `onDragOver` | 否 | `DragEventHandler<HTMLElement> \| undefined` |  |
| `onDragOverCapture` | 否 | `DragEventHandler<HTMLElement> \| undefined` |  |
| `onDragStart` | 否 | `DragEventHandler<HTMLElement> \| undefined` |  |
| `onDragStartCapture` | 否 | `DragEventHandler<HTMLElement> \| undefined` |  |
| `onDrop` | 否 | `DragEventHandler<HTMLElement> \| undefined` |  |
| `onDropCapture` | 否 | `DragEventHandler<HTMLElement> \| undefined` |  |
| `onMouseDown` | 否 | `MouseEventHandler<HTMLElement> \| undefined` |  |
| `onMouseDownCapture` | 否 | `MouseEventHandler<HTMLElement> \| undefined` |  |
| `onMouseEnter` | 否 | `MouseEventHandler<HTMLElement> \| undefined` |  |
| `onMouseLeave` | 否 | `MouseEventHandler<HTMLElement> \| undefined` |  |
| `onMouseMove` | 否 | `MouseEventHandler<HTMLElement> \| undefined` |  |
| `onMouseMoveCapture` | 否 | `MouseEventHandler<HTMLElement> \| undefined` |  |
| `onMouseOut` | 否 | `MouseEventHandler<HTMLElement> \| undefined` |  |
| `onMouseOutCapture` | 否 | `MouseEventHandler<HTMLElement> \| undefined` |  |
| `onMouseOver` | 否 | `MouseEventHandler<HTMLElement> \| undefined` |  |
| `onMouseOverCapture` | 否 | `MouseEventHandler<HTMLElement> \| undefined` |  |
| `onMouseUp` | 否 | `MouseEventHandler<HTMLElement> \| undefined` |  |
| `onMouseUpCapture` | 否 | `MouseEventHandler<HTMLElement> \| undefined` |  |
| `onSelect` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onSelectCapture` | 否 | `ReactEventHandler<HTMLElement> \| undefined` |  |
| `onTouchCancel` | 否 | `TouchEventHandler<HTMLElement> \| undefined` |  |
| `onTouchCancelCapture` | 否 | `TouchEventHandler<HTMLElement> \| undefined` |  |
| `onTouchEnd` | 否 | `TouchEventHandler<HTMLElement> \| undefined` |  |
| `onTouchEndCapture` | 否 | `TouchEventHandler<HTMLElement> \| undefined` |  |
| `onTouchMove` | 否 | `TouchEventHandler<HTMLElement> \| undefined` |  |
| `onTouchMoveCapture` | 否 | `TouchEventHandler<HTMLElement> \| undefined` |  |
| `onTouchStart` | 否 | `TouchEventHandler<HTMLElement> \| undefined` |  |
| `onTouchStartCapture` | 否 | `TouchEventHandler<HTMLElement> \| undefined` |  |
| `onPointerDown` | 否 | `PointerEventHandler<HTMLElement> \| undefined` |  |
| `onPointerDownCapture` | 否 | `PointerEventHandler<HTMLElement> \| undefined` |  |
| `onPointerMove` | 否 | `PointerEventHandler<HTMLElement> \| undefined` |  |
| `onPointerMoveCapture` | 否 | `PointerEventHandler<HTMLElement> \| undefined` |  |
| `onPointerUp` | 否 | `PointerEventHandler<HTMLElement> \| undefined` |  |
| `onPointerUpCapture` | 否 | `PointerEventHandler<HTMLElement> \| undefined` |  |
| `onPointerCancel` | 否 | `PointerEventHandler<HTMLElement> \| undefined` |  |
| `onPointerCancelCapture` | 否 | `PointerEventHandler<HTMLElement> \| undefined` |  |
| `onPointerEnter` | 否 | `PointerEventHandler<HTMLElement> \| undefined` |  |
| `onPointerLeave` | 否 | `PointerEventHandler<HTMLElement> \| undefined` |  |
| `onPointerOver` | 否 | `PointerEventHandler<HTMLElement> \| undefined` |  |
| `onPointerOverCapture` | 否 | `PointerEventHandler<HTMLElement> \| undefined` |  |
| `onPointerOut` | 否 | `PointerEventHandler<HTMLElement> \| undefined` |  |
| `onPointerOutCapture` | 否 | `PointerEventHandler<HTMLElement> \| undefined` |  |
| `onGotPointerCapture` | 否 | `PointerEventHandler<HTMLElement> \| undefined` |  |
| `onGotPointerCaptureCapture` | 否 | `PointerEventHandler<HTMLElement> \| undefined` |  |
| `onLostPointerCapture` | 否 | `PointerEventHandler<HTMLElement> \| undefined` |  |
| `onLostPointerCaptureCapture` | 否 | `PointerEventHandler<HTMLElement> \| undefined` |  |
| `onScroll` | 否 | `UIEventHandler<HTMLElement> \| undefined` |  |
| `onScrollCapture` | 否 | `UIEventHandler<HTMLElement> \| undefined` |  |
| `onScrollEnd` | 否 | `UIEventHandler<HTMLElement> \| undefined` |  |
| `onScrollEndCapture` | 否 | `UIEventHandler<HTMLElement> \| undefined` |  |
| `onWheel` | 否 | `WheelEventHandler<HTMLElement> \| undefined` |  |
| `onWheelCapture` | 否 | `WheelEventHandler<HTMLElement> \| undefined` |  |
| `onAnimationStart` | 否 | `AnimationEventHandler<HTMLElement> \| undefined` |  |
| `onAnimationStartCapture` | 否 | `AnimationEventHandler<HTMLElement> \| undefined` |  |
| `onAnimationEnd` | 否 | `AnimationEventHandler<HTMLElement> \| undefined` |  |
| `onAnimationEndCapture` | 否 | `AnimationEventHandler<HTMLElement> \| undefined` |  |
| `onAnimationIteration` | 否 | `AnimationEventHandler<HTMLElement> \| undefined` |  |
| `onAnimationIterationCapture` | 否 | `AnimationEventHandler<HTMLElement> \| undefined` |  |
| `onToggle` | 否 | `ToggleEventHandler<HTMLElement> \| undefined` |  |
| `onBeforeToggle` | 否 | `ToggleEventHandler<HTMLElement> \| undefined` |  |
| `onTransitionCancel` | 否 | `TransitionEventHandler<HTMLElement> \| undefined` |  |
| `onTransitionCancelCapture` | 否 | `TransitionEventHandler<HTMLElement> \| undefined` |  |
| `onTransitionEnd` | 否 | `TransitionEventHandler<HTMLElement> \| undefined` |  |
| `onTransitionEndCapture` | 否 | `TransitionEventHandler<HTMLElement> \| undefined` |  |
| `onTransitionRun` | 否 | `TransitionEventHandler<HTMLElement> \| undefined` |  |
| `onTransitionRunCapture` | 否 | `TransitionEventHandler<HTMLElement> \| undefined` |  |
| `onTransitionStart` | 否 | `TransitionEventHandler<HTMLElement> \| undefined` |  |
| `onTransitionStartCapture` | 否 | `TransitionEventHandler<HTMLElement> \| undefined` |  |

## SurfaceCardPadding (type)

```ts
export type SurfaceCardPadding = "none" | "sm" | "md" | "lg";
```

## 选型

当前已导出的 SurfaceCard 提供中性内容容器；API 以本页生成部分为准。它不自动证明计划中的模板风格标题 Panel 已完成。先对照 Screen；需要新增公共契约时用 FORGE-GAP 请求决定。
