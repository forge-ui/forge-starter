# form

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/forms/form.tsx`；core **0.11.6**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## Fieldset (value)

```ts
({ legend, children, disabled, className }: FieldsetProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `legend` | 是 | `ReactNode` |  |
| `children` | 是 | `ReactNode` |  |
| `disabled` | 否 | `boolean \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## FieldsetProps (type)

```ts
export interface FieldsetProps {
  legend: ReactNode;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
}
```

## Form (value)

```ts
({ children, onSubmit, errors, validationMode, className }: FormProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `children` | 是 | `ReactNode` |  |
| `onSubmit` | 否 | `((values: FormValues) => void) \| undefined` | Runs only when every field is valid; receives values keyed by field `name`. |
| `errors` | 否 | `Record<string, string \| string[]> \| undefined` | Server-side errors keyed by field `name`; shown until that field changes. |
| `validationMode` | 否 | `FormValidationMode \| undefined` | When fields validate. Invalid fields always re-validate as the user types. |
| `className` | 否 | `string \| undefined` |  |

## FormField (value)

```ts
({ name, children, label, description, validate, messages, disabled, className }: FormFieldProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `name` | 是 | `string` | Submitted key; also the key for `Form` `errors`. |
| `children` | 是 | `ReactNode` | One field-aware control (see list above). |
| `label` | 否 | `ReactNode` |  |
| `description` | 否 | `ReactNode` |  |
| `validate` | 否 | `((value: unknown, values: FormValues) => string \| string[] \| null \| void \| Promise<string \| string[] \| null \| void>) \| undefined` | Custom rule; return an error message (or messages) to mark the field invalid. May be async. |
| `messages` | 否 | `Partial<Record<ValidityKey, string>> \| undefined` | Replace the browser's built-in messages, e.g. `{ valueMissing: "请填写邮箱" }`. |
| `disabled` | 否 | `boolean \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## FormFieldProps (type)

```ts
export interface FormFieldProps {
  /** Submitted key; also the key for `Form` `errors`. */
  name: string;
  /** One field-aware control (see list above). */
  children: ReactNode;
  label?: ReactNode;
  description?: ReactNode;
  /** Custom rule; return an error message (or messages) to mark the field invalid. May be async. */
  validate?: (value: unknown, values: FormValues) => string | string[] | null | void | Promise<string | string[] | null | void>;
  /** Replace the browser's built-in messages, e.g. `{ valueMissing: "请填写邮箱" }`. */
  messages?: Partial<Record<ValidityKey, string>>;
  disabled?: boolean;
  className?: string;
}
```

## FormProps (type)

```ts
export interface FormProps {
  children: ReactNode;
  /** Runs only when every field is valid; receives values keyed by field `name`. */
  onSubmit?: (values: FormValues) => void;
  /** Server-side errors keyed by field `name`; shown until that field changes. */
  errors?: Record<string, string | string[]>;
  /** When fields validate. Invalid fields always re-validate as the user types. */
  validationMode?: FormValidationMode;
  className?: string;
}
```

## FormValidationMode (type)

```ts
export type FormValidationMode = "onSubmit" | "onBlur" | "onChange";
```

## FormValues (type)

```ts
export type FormValues = Record<string, unknown>;
```
