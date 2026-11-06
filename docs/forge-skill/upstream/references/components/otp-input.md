# otp-input

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/otp-input.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## OtpInput (value)

```ts
({ length, locale, value: controlled, defaultValue, onChange, onComplete, verify, onSuccess, disabled, autoFocus, name, inputLabel, hint, verifyingLabel, clearOnError, successLabel, errorLabel, motion: motionPreference, className }: OtpInputProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `length` | 否 | `number \| undefined` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `value` | 否 | `string \| undefined` |  |
| `defaultValue` | 否 | `string \| undefined` |  |
| `onChange` | 否 | `((value: string) => void) \| undefined` |  |
| `onComplete` | 否 | `((value: string) => void) \| undefined` |  |
| `verify` | 否 | `((value: string) => boolean \| Promise<boolean>) \| undefined` | Check on the server. No built-in passcode or simulated verification. |
| `onSuccess` | 否 | `((value: string) => void) \| undefined` |  |
| `disabled` | 否 | `boolean \| undefined` |  |
| `autoFocus` | 否 | `boolean \| undefined` |  |
| `name` | 否 | `string \| undefined` |  |
| `inputLabel` | 否 | `string \| undefined` |  |
| `hint` | 否 | `ReactNode` |  |
| `verifyingLabel` | 否 | `string \| undefined` |  |
| `successLabel` | 否 | `string \| undefined` |  |
| `errorLabel` | 否 | `string \| undefined` |  |
| `clearOnError` | 否 | `boolean \| undefined` | Clear a rejected code after its error animation. Set false to keep it for editing. |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## OtpInputProps (type)

```ts
export type OtpInputProps = {
  length?: number;
  locale?: "zh" | "en";
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  /** Check on the server. No built-in passcode or simulated verification. */
  verify?: (value: string) => boolean | Promise<boolean>;
  onSuccess?: (value: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
  name?: string;
  inputLabel?: string;
  hint?: ReactNode;
  verifyingLabel?: string;
  successLabel?: string;
  errorLabel?: string;
  /** Clear a rejected code after its error animation. Set false to keep it for editing. */
  clearOnError?: boolean;
  motion?: MotionPreference;
  className?: string;
};
```
