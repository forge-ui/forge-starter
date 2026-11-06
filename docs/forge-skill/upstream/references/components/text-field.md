# text-field

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/forms/text-field.tsx`；core **0.4.7**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## TextField (value)

```ts
ForwardRefExoticComponent<{ state?: TextFieldState; shape?: TextFieldShape; color?: TextFieldColor; label?: string; labelPlacement?: "outside" | "floating"; locale?: "zh" | "en"; activeTag?: string; errorMessage?: string; headerAction?: ReactNode; iconLeft?: ReactNode; iconRight?: ReactNode; suffix?: ReactNode; tags?: TextFieldTag[]; onRemoveTag?: (value: string) => void; onChange?: (value: string) => void; className?: string; inputClassName?: string; } & Omit<InputHTMLAttributes<HTMLInputElement>, "color" | "onChange" | "size"> & RefAttributes<HTMLInputElement>>
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `state` | 否 | `FieldState \| undefined` |  |
| `shape` | 否 | `FieldShape \| undefined` |  |
| `color` | 否 | `AccentColor \| undefined` |  |
| `label` | 否 | `string \| undefined` |  |
| `labelPlacement` | 否 | `"outside" \| "floating" \| undefined` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `activeTag` | 否 | `string \| undefined` | Tag highlighted before removal, controlled by the caller. |
| `errorMessage` | 否 | `string \| undefined` |  |
| `headerAction` | 否 | `ReactNode` |  |
| `iconLeft` | 否 | `ReactNode` |  |
| `iconRight` | 否 | `ReactNode` |  |
| `suffix` | 否 | `ReactNode` |  |
| `tags` | 否 | `TextFieldTag[] \| undefined` |  |
| `onRemoveTag` | 否 | `((value: string) => void) \| undefined` |  |
| `onChange` | 否 | `((value: string) => void) \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `inputClassName` | 否 | `string \| undefined` |  |
| `disabled` | 否 | `boolean \| undefined` |  |
| `form` | 否 | `string \| undefined` |  |
| `formAction` | 否 | `string \| ((formData: FormData) => void \| Promise<void>) \| undefined` |  |
| `formEncType` | 否 | `string \| undefined` |  |
| `formMethod` | 否 | `string \| undefined` |  |
| `formNoValidate` | 否 | `boolean \| undefined` |  |
| `formTarget` | 否 | `string \| undefined` |  |
| `name` | 否 | `string \| undefined` |  |
| `type` | 否 | `HTMLInputTypeAttribute \| undefined` |  |
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
| `onCopy` | 否 | `ClipboardEventHandler<HTMLInputElement> \| undefined` |  |
| `onCopyCapture` | 否 | `ClipboardEventHandler<HTMLInputElement> \| undefined` |  |
| `onCut` | 否 | `ClipboardEventHandler<HTMLInputElement> \| undefined` |  |
| `onCutCapture` | 否 | `ClipboardEventHandler<HTMLInputElement> \| undefined` |  |
| `onPaste` | 否 | `ClipboardEventHandler<HTMLInputElement> \| undefined` |  |
| `onPasteCapture` | 否 | `ClipboardEventHandler<HTMLInputElement> \| undefined` |  |
| `onCompositionEnd` | 否 | `CompositionEventHandler<HTMLInputElement> \| undefined` |  |
| `onCompositionEndCapture` | 否 | `CompositionEventHandler<HTMLInputElement> \| undefined` |  |
| `onCompositionStart` | 否 | `CompositionEventHandler<HTMLInputElement> \| undefined` |  |
| `onCompositionStartCapture` | 否 | `CompositionEventHandler<HTMLInputElement> \| undefined` |  |
| `onCompositionUpdate` | 否 | `CompositionEventHandler<HTMLInputElement> \| undefined` |  |
| `onCompositionUpdateCapture` | 否 | `CompositionEventHandler<HTMLInputElement> \| undefined` |  |
| `onFocus` | 否 | `FocusEventHandler<HTMLInputElement> \| undefined` |  |
| `onFocusCapture` | 否 | `FocusEventHandler<HTMLInputElement> \| undefined` |  |
| `onBlur` | 否 | `FocusEventHandler<HTMLInputElement> \| undefined` |  |
| `onBlurCapture` | 否 | `FocusEventHandler<HTMLInputElement> \| undefined` |  |
| `onChangeCapture` | 否 | `ChangeEventHandler<HTMLInputElement, Element> \| undefined` |  |
| `onBeforeInput` | 否 | `InputEventHandler<HTMLInputElement> \| undefined` |  |
| `onBeforeInputCapture` | 否 | `InputEventHandler<HTMLInputElement> \| undefined` |  |
| `onInput` | 否 | `InputEventHandler<HTMLInputElement> \| undefined` |  |
| `onInputCapture` | 否 | `InputEventHandler<HTMLInputElement> \| undefined` |  |
| `onReset` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onResetCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onSubmit` | 否 | `SubmitEventHandler<HTMLInputElement> \| undefined` |  |
| `onSubmitCapture` | 否 | `SubmitEventHandler<HTMLInputElement> \| undefined` |  |
| `onInvalid` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onInvalidCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onLoad` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onLoadCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onError` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onErrorCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onKeyDown` | 否 | `KeyboardEventHandler<HTMLInputElement> \| undefined` |  |
| `onKeyDownCapture` | 否 | `KeyboardEventHandler<HTMLInputElement> \| undefined` |  |
| `onKeyPress` | 否 | `KeyboardEventHandler<HTMLInputElement> \| undefined` |  |
| `onKeyPressCapture` | 否 | `KeyboardEventHandler<HTMLInputElement> \| undefined` |  |
| `onKeyUp` | 否 | `KeyboardEventHandler<HTMLInputElement> \| undefined` |  |
| `onKeyUpCapture` | 否 | `KeyboardEventHandler<HTMLInputElement> \| undefined` |  |
| `onAbort` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onAbortCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onCanPlay` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onCanPlayCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onCanPlayThrough` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onCanPlayThroughCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onDurationChange` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onDurationChangeCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onEmptied` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onEmptiedCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onEncrypted` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onEncryptedCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onEnded` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onEndedCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onLoadedData` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onLoadedDataCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onLoadedMetadata` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onLoadedMetadataCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onLoadStart` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onLoadStartCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onPause` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onPauseCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onPlay` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onPlayCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onPlaying` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onPlayingCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onProgress` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onProgressCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onRateChange` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onRateChangeCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onSeeked` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onSeekedCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onSeeking` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onSeekingCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onStalled` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onStalledCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onSuspend` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onSuspendCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onTimeUpdate` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onTimeUpdateCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onVolumeChange` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onVolumeChangeCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onWaiting` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onWaitingCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onAuxClick` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onAuxClickCapture` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onClick` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onClickCapture` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onContextMenu` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onContextMenuCapture` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onDoubleClick` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onDoubleClickCapture` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onDrag` | 否 | `DragEventHandler<HTMLInputElement> \| undefined` |  |
| `onDragCapture` | 否 | `DragEventHandler<HTMLInputElement> \| undefined` |  |
| `onDragEnd` | 否 | `DragEventHandler<HTMLInputElement> \| undefined` |  |
| `onDragEndCapture` | 否 | `DragEventHandler<HTMLInputElement> \| undefined` |  |
| `onDragEnter` | 否 | `DragEventHandler<HTMLInputElement> \| undefined` |  |
| `onDragEnterCapture` | 否 | `DragEventHandler<HTMLInputElement> \| undefined` |  |
| `onDragExit` | 否 | `DragEventHandler<HTMLInputElement> \| undefined` |  |
| `onDragExitCapture` | 否 | `DragEventHandler<HTMLInputElement> \| undefined` |  |
| `onDragLeave` | 否 | `DragEventHandler<HTMLInputElement> \| undefined` |  |
| `onDragLeaveCapture` | 否 | `DragEventHandler<HTMLInputElement> \| undefined` |  |
| `onDragOver` | 否 | `DragEventHandler<HTMLInputElement> \| undefined` |  |
| `onDragOverCapture` | 否 | `DragEventHandler<HTMLInputElement> \| undefined` |  |
| `onDragStart` | 否 | `DragEventHandler<HTMLInputElement> \| undefined` |  |
| `onDragStartCapture` | 否 | `DragEventHandler<HTMLInputElement> \| undefined` |  |
| `onDrop` | 否 | `DragEventHandler<HTMLInputElement> \| undefined` |  |
| `onDropCapture` | 否 | `DragEventHandler<HTMLInputElement> \| undefined` |  |
| `onMouseDown` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onMouseDownCapture` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onMouseEnter` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onMouseLeave` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onMouseMove` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onMouseMoveCapture` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onMouseOut` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onMouseOutCapture` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onMouseOver` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onMouseOverCapture` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onMouseUp` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onMouseUpCapture` | 否 | `MouseEventHandler<HTMLInputElement> \| undefined` |  |
| `onSelect` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onSelectCapture` | 否 | `ReactEventHandler<HTMLInputElement> \| undefined` |  |
| `onTouchCancel` | 否 | `TouchEventHandler<HTMLInputElement> \| undefined` |  |
| `onTouchCancelCapture` | 否 | `TouchEventHandler<HTMLInputElement> \| undefined` |  |
| `onTouchEnd` | 否 | `TouchEventHandler<HTMLInputElement> \| undefined` |  |
| `onTouchEndCapture` | 否 | `TouchEventHandler<HTMLInputElement> \| undefined` |  |
| `onTouchMove` | 否 | `TouchEventHandler<HTMLInputElement> \| undefined` |  |
| `onTouchMoveCapture` | 否 | `TouchEventHandler<HTMLInputElement> \| undefined` |  |
| `onTouchStart` | 否 | `TouchEventHandler<HTMLInputElement> \| undefined` |  |
| `onTouchStartCapture` | 否 | `TouchEventHandler<HTMLInputElement> \| undefined` |  |
| `onPointerDown` | 否 | `PointerEventHandler<HTMLInputElement> \| undefined` |  |
| `onPointerDownCapture` | 否 | `PointerEventHandler<HTMLInputElement> \| undefined` |  |
| `onPointerMove` | 否 | `PointerEventHandler<HTMLInputElement> \| undefined` |  |
| `onPointerMoveCapture` | 否 | `PointerEventHandler<HTMLInputElement> \| undefined` |  |
| `onPointerUp` | 否 | `PointerEventHandler<HTMLInputElement> \| undefined` |  |
| `onPointerUpCapture` | 否 | `PointerEventHandler<HTMLInputElement> \| undefined` |  |
| `onPointerCancel` | 否 | `PointerEventHandler<HTMLInputElement> \| undefined` |  |
| `onPointerCancelCapture` | 否 | `PointerEventHandler<HTMLInputElement> \| undefined` |  |
| `onPointerEnter` | 否 | `PointerEventHandler<HTMLInputElement> \| undefined` |  |
| `onPointerLeave` | 否 | `PointerEventHandler<HTMLInputElement> \| undefined` |  |
| `onPointerOver` | 否 | `PointerEventHandler<HTMLInputElement> \| undefined` |  |
| `onPointerOverCapture` | 否 | `PointerEventHandler<HTMLInputElement> \| undefined` |  |
| `onPointerOut` | 否 | `PointerEventHandler<HTMLInputElement> \| undefined` |  |
| `onPointerOutCapture` | 否 | `PointerEventHandler<HTMLInputElement> \| undefined` |  |
| `onGotPointerCapture` | 否 | `PointerEventHandler<HTMLInputElement> \| undefined` |  |
| `onGotPointerCaptureCapture` | 否 | `PointerEventHandler<HTMLInputElement> \| undefined` |  |
| `onLostPointerCapture` | 否 | `PointerEventHandler<HTMLInputElement> \| undefined` |  |
| `onLostPointerCaptureCapture` | 否 | `PointerEventHandler<HTMLInputElement> \| undefined` |  |
| `onScroll` | 否 | `UIEventHandler<HTMLInputElement> \| undefined` |  |
| `onScrollCapture` | 否 | `UIEventHandler<HTMLInputElement> \| undefined` |  |
| `onScrollEnd` | 否 | `UIEventHandler<HTMLInputElement> \| undefined` |  |
| `onScrollEndCapture` | 否 | `UIEventHandler<HTMLInputElement> \| undefined` |  |
| `onWheel` | 否 | `WheelEventHandler<HTMLInputElement> \| undefined` |  |
| `onWheelCapture` | 否 | `WheelEventHandler<HTMLInputElement> \| undefined` |  |
| `onAnimationStart` | 否 | `AnimationEventHandler<HTMLInputElement> \| undefined` |  |
| `onAnimationStartCapture` | 否 | `AnimationEventHandler<HTMLInputElement> \| undefined` |  |
| `onAnimationEnd` | 否 | `AnimationEventHandler<HTMLInputElement> \| undefined` |  |
| `onAnimationEndCapture` | 否 | `AnimationEventHandler<HTMLInputElement> \| undefined` |  |
| `onAnimationIteration` | 否 | `AnimationEventHandler<HTMLInputElement> \| undefined` |  |
| `onAnimationIterationCapture` | 否 | `AnimationEventHandler<HTMLInputElement> \| undefined` |  |
| `onToggle` | 否 | `ToggleEventHandler<HTMLInputElement> \| undefined` |  |
| `onBeforeToggle` | 否 | `ToggleEventHandler<HTMLInputElement> \| undefined` |  |
| `onTransitionCancel` | 否 | `TransitionEventHandler<HTMLInputElement> \| undefined` |  |
| `onTransitionCancelCapture` | 否 | `TransitionEventHandler<HTMLInputElement> \| undefined` |  |
| `onTransitionEnd` | 否 | `TransitionEventHandler<HTMLInputElement> \| undefined` |  |
| `onTransitionEndCapture` | 否 | `TransitionEventHandler<HTMLInputElement> \| undefined` |  |
| `onTransitionRun` | 否 | `TransitionEventHandler<HTMLInputElement> \| undefined` |  |
| `onTransitionRunCapture` | 否 | `TransitionEventHandler<HTMLInputElement> \| undefined` |  |
| `onTransitionStart` | 否 | `TransitionEventHandler<HTMLInputElement> \| undefined` |  |
| `onTransitionStartCapture` | 否 | `TransitionEventHandler<HTMLInputElement> \| undefined` |  |
| `list` | 否 | `string \| undefined` |  |
| `step` | 否 | `string \| number \| undefined` |  |
| `src` | 否 | `string \| undefined` |  |
| `accept` | 否 | `string \| undefined` |  |
| `alt` | 否 | `string \| undefined` |  |
| `autoComplete` | 否 | `HTMLInputAutoCompleteAttribute \| undefined` |  |
| `capture` | 否 | `boolean \| "user" \| "environment" \| undefined` |  |
| `checked` | 否 | `boolean \| undefined` |  |
| `height` | 否 | `string \| number \| undefined` |  |
| `max` | 否 | `string \| number \| undefined` |  |
| `maxLength` | 否 | `number \| undefined` |  |
| `min` | 否 | `string \| number \| undefined` |  |
| `minLength` | 否 | `number \| undefined` |  |
| `multiple` | 否 | `boolean \| undefined` |  |
| `pattern` | 否 | `string \| undefined` |  |
| `placeholder` | 否 | `string \| undefined` |  |
| `readOnly` | 否 | `boolean \| undefined` |  |
| `required` | 否 | `boolean \| undefined` |  |
| `width` | 否 | `string \| number \| undefined` |  |
| `ref` | 否 | `Ref<HTMLInputElement> \| undefined` | Allows getting a ref to the component instance. Once the component unmounts, React will set `ref.current` to `null` (or call the ref with `null` if you passed a callback ref). |
| `key` | 否 | `Key \| null \| undefined` |  |

## TextFieldColor (type)

```ts
export type TextFieldColor = FieldColor;
```

## TextFieldProps (type)

```ts
export type TextFieldProps = {
  state?: TextFieldState;
  shape?: TextFieldShape;
  color?: TextFieldColor;
  label?: string;
  labelPlacement?: "outside" | "floating";
  locale?: "zh" | "en";
  /** Tag highlighted before removal, controlled by the caller. */
  activeTag?: string;
  errorMessage?: string;
  headerAction?: ReactNode;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  suffix?: ReactNode;
  tags?: TextFieldTag[];
  onRemoveTag?: (value: string) => void;
  onChange?: (value: string) => void;
  className?: string;
  inputClassName?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "color" | "size" | "onChange">;
```

## TextFieldShape (type)

```ts
export type TextFieldShape = FieldShape;
```

## TextFieldState (type)

```ts
export type TextFieldState = FieldState;
```
