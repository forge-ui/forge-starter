# text-area

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/forms/text-area.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## TextArea (value)

```ts
ForwardRefExoticComponent<{ state?: TextAreaState; shape?: TextAreaShape; color?: TextAreaColor; label?: string; errorMessage?: string; autoGrow?: boolean; headerAction?: ReactNode; onChange?: (value: string) => void; className?: string; textareaClassName?: string; } & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "color" | "onChange"> & RefAttributes<HTMLTextAreaElement>>
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `state` | 否 | `FieldState \| undefined` |  |
| `shape` | 否 | `FieldShape \| undefined` |  |
| `color` | 否 | `AccentColor \| undefined` |  |
| `label` | 否 | `string \| undefined` |  |
| `errorMessage` | 否 | `string \| undefined` |  |
| `autoGrow` | 否 | `boolean \| undefined` |  |
| `headerAction` | 否 | `ReactNode` |  |
| `onChange` | 否 | `((value: string) => void) \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `textareaClassName` | 否 | `string \| undefined` |  |
| `disabled` | 否 | `boolean \| undefined` |  |
| `form` | 否 | `string \| undefined` |  |
| `name` | 否 | `string \| undefined` |  |
| `value` | 否 | `string \| number \| readonly string[] \| undefined` |  |
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
| `title` | 否 | `string \| undefined` |  |
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
| `children` | 否 | `ReactNode` |  |
| `dangerouslySetInnerHTML` | 否 | `{ __html: string \| TrustedHTML; } \| undefined` |  |
| `onCopy` | 否 | `ClipboardEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onCopyCapture` | 否 | `ClipboardEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onCut` | 否 | `ClipboardEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onCutCapture` | 否 | `ClipboardEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onPaste` | 否 | `ClipboardEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onPasteCapture` | 否 | `ClipboardEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onCompositionEnd` | 否 | `CompositionEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onCompositionEndCapture` | 否 | `CompositionEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onCompositionStart` | 否 | `CompositionEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onCompositionStartCapture` | 否 | `CompositionEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onCompositionUpdate` | 否 | `CompositionEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onCompositionUpdateCapture` | 否 | `CompositionEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onFocus` | 否 | `FocusEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onFocusCapture` | 否 | `FocusEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onBlur` | 否 | `FocusEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onBlurCapture` | 否 | `FocusEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onChangeCapture` | 否 | `ChangeEventHandler<HTMLTextAreaElement, Element> \| undefined` |  |
| `onBeforeInput` | 否 | `InputEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onBeforeInputCapture` | 否 | `InputEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onInput` | 否 | `InputEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onInputCapture` | 否 | `InputEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onReset` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onResetCapture` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onSubmit` | 否 | `SubmitEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onSubmitCapture` | 否 | `SubmitEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onInvalid` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onInvalidCapture` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onLoad` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onLoadCapture` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onError` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onErrorCapture` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onKeyDown` | 否 | `KeyboardEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onKeyDownCapture` | 否 | `KeyboardEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onKeyPress` | 否 | `KeyboardEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onKeyPressCapture` | 否 | `KeyboardEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onKeyUp` | 否 | `KeyboardEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onKeyUpCapture` | 否 | `KeyboardEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onAbort` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onAbortCapture` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onCanPlay` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onCanPlayCapture` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onCanPlayThrough` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onCanPlayThroughCapture` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onDurationChange` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onDurationChangeCapture` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onEmptied` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onEmptiedCapture` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onEncrypted` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onEncryptedCapture` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onEnded` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onEndedCapture` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onLoadedData` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onLoadedDataCapture` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onLoadedMetadata` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onLoadedMetadataCapture` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onLoadStart` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onLoadStartCapture` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onPause` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onPauseCapture` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onPlay` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onPlayCapture` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onPlaying` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onPlayingCapture` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onProgress` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onProgressCapture` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onRateChange` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onRateChangeCapture` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onSeeked` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onSeekedCapture` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onSeeking` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onSeekingCapture` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onStalled` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onStalledCapture` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onSuspend` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onSuspendCapture` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onTimeUpdate` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onTimeUpdateCapture` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onVolumeChange` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onVolumeChangeCapture` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onWaiting` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onWaitingCapture` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onAuxClick` | 否 | `MouseEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onAuxClickCapture` | 否 | `MouseEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onClick` | 否 | `MouseEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onClickCapture` | 否 | `MouseEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onContextMenu` | 否 | `MouseEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onContextMenuCapture` | 否 | `MouseEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onDoubleClick` | 否 | `MouseEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onDoubleClickCapture` | 否 | `MouseEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onDrag` | 否 | `DragEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onDragCapture` | 否 | `DragEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onDragEnd` | 否 | `DragEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onDragEndCapture` | 否 | `DragEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onDragEnter` | 否 | `DragEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onDragEnterCapture` | 否 | `DragEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onDragExit` | 否 | `DragEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onDragExitCapture` | 否 | `DragEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onDragLeave` | 否 | `DragEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onDragLeaveCapture` | 否 | `DragEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onDragOver` | 否 | `DragEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onDragOverCapture` | 否 | `DragEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onDragStart` | 否 | `DragEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onDragStartCapture` | 否 | `DragEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onDrop` | 否 | `DragEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onDropCapture` | 否 | `DragEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onMouseDown` | 否 | `MouseEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onMouseDownCapture` | 否 | `MouseEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onMouseEnter` | 否 | `MouseEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onMouseLeave` | 否 | `MouseEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onMouseMove` | 否 | `MouseEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onMouseMoveCapture` | 否 | `MouseEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onMouseOut` | 否 | `MouseEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onMouseOutCapture` | 否 | `MouseEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onMouseOver` | 否 | `MouseEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onMouseOverCapture` | 否 | `MouseEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onMouseUp` | 否 | `MouseEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onMouseUpCapture` | 否 | `MouseEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onSelect` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onSelectCapture` | 否 | `ReactEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onTouchCancel` | 否 | `TouchEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onTouchCancelCapture` | 否 | `TouchEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onTouchEnd` | 否 | `TouchEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onTouchEndCapture` | 否 | `TouchEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onTouchMove` | 否 | `TouchEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onTouchMoveCapture` | 否 | `TouchEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onTouchStart` | 否 | `TouchEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onTouchStartCapture` | 否 | `TouchEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onPointerDown` | 否 | `PointerEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onPointerDownCapture` | 否 | `PointerEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onPointerMove` | 否 | `PointerEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onPointerMoveCapture` | 否 | `PointerEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onPointerUp` | 否 | `PointerEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onPointerUpCapture` | 否 | `PointerEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onPointerCancel` | 否 | `PointerEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onPointerCancelCapture` | 否 | `PointerEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onPointerEnter` | 否 | `PointerEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onPointerLeave` | 否 | `PointerEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onPointerOver` | 否 | `PointerEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onPointerOverCapture` | 否 | `PointerEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onPointerOut` | 否 | `PointerEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onPointerOutCapture` | 否 | `PointerEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onGotPointerCapture` | 否 | `PointerEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onGotPointerCaptureCapture` | 否 | `PointerEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onLostPointerCapture` | 否 | `PointerEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onLostPointerCaptureCapture` | 否 | `PointerEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onScroll` | 否 | `UIEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onScrollCapture` | 否 | `UIEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onScrollEnd` | 否 | `UIEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onScrollEndCapture` | 否 | `UIEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onWheel` | 否 | `WheelEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onWheelCapture` | 否 | `WheelEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onAnimationStart` | 否 | `AnimationEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onAnimationStartCapture` | 否 | `AnimationEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onAnimationEnd` | 否 | `AnimationEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onAnimationEndCapture` | 否 | `AnimationEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onAnimationIteration` | 否 | `AnimationEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onAnimationIterationCapture` | 否 | `AnimationEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onToggle` | 否 | `ToggleEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onBeforeToggle` | 否 | `ToggleEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onTransitionCancel` | 否 | `TransitionEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onTransitionCancelCapture` | 否 | `TransitionEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onTransitionEnd` | 否 | `TransitionEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onTransitionEndCapture` | 否 | `TransitionEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onTransitionRun` | 否 | `TransitionEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onTransitionRunCapture` | 否 | `TransitionEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onTransitionStart` | 否 | `TransitionEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `onTransitionStartCapture` | 否 | `TransitionEventHandler<HTMLTextAreaElement> \| undefined` |  |
| `autoComplete` | 否 | `string \| undefined` |  |
| `maxLength` | 否 | `number \| undefined` |  |
| `minLength` | 否 | `number \| undefined` |  |
| `placeholder` | 否 | `string \| undefined` |  |
| `readOnly` | 否 | `boolean \| undefined` |  |
| `required` | 否 | `boolean \| undefined` |  |
| `cols` | 否 | `number \| undefined` |  |
| `dirName` | 否 | `string \| undefined` |  |
| `rows` | 否 | `number \| undefined` |  |
| `wrap` | 否 | `string \| undefined` |  |
| `ref` | 否 | `Ref<HTMLTextAreaElement> \| undefined` | Allows getting a ref to the component instance. Once the component unmounts, React will set `ref.current` to `null` (or call the ref with `null` if you passed a callback ref). |
| `key` | 否 | `Key \| null \| undefined` |  |

## TextAreaColor (type)

```ts
export type TextAreaColor = FieldColor;
```

## TextAreaProps (type)

```ts
export type TextAreaProps = {
  state?: TextAreaState;
  shape?: TextAreaShape;
  color?: TextAreaColor;
  label?: string;
  errorMessage?: string;
  autoGrow?: boolean;
  headerAction?: ReactNode;
  onChange?: (value: string) => void;
  className?: string;
  textareaClassName?: string;
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "color" | "onChange">;
```

## TextAreaShape (type)

```ts
export type TextAreaShape = FieldShape;
```

## TextAreaState (type)

```ts
export type TextAreaState = FieldState;
```
