# inline-diff

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/agent/inline-diff.tsx`；core **0.11.4**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## InlineDiff (value)

```ts
({ segments, title, onApply, onDecisionsChange, applyLabel, locale, size, className }: InlineDiffProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `segments` | 是 | `InlineDiffSegment[]` |  |
| `title` | 否 | `ReactNode` |  |
| `onApply` | 否 | `((text: string, decisions: Record<string, InlineDiffDecision>) => void) \| undefined` | Called with the text that results from the current decisions. |
| `onDecisionsChange` | 否 | `((decisions: Record<string, InlineDiffDecision>) => void) \| undefined` |  |
| `applyLabel` | 否 | `string \| undefined` |  |
| `locale` | 否 | `AgentLocale \| undefined` |  |
| `size` | 否 | `"md" \| "sm" \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## InlineDiffDecision (type)

```ts
export type InlineDiffDecision = "pending" | "accepted" | "rejected";
```

## InlineDiffProps (type)

```ts
export type InlineDiffProps = {
  segments: InlineDiffSegment[];
  title?: ReactNode;
  /** Called with the text that results from the current decisions. */
  onApply?: (text: string, decisions: Record<string, InlineDiffDecision>) => void;
  onDecisionsChange?: (decisions: Record<string, InlineDiffDecision>) => void;
  applyLabel?: string;
  locale?: AgentLocale;
  size?: "md" | "sm";
  className?: string;
};
```

## InlineDiffSegment (type)

```ts
export type InlineDiffSegment =
  | { type: "same"; text: string }
  | { type: "change"; id: string; before: string; after: string; /** Why the agent changed it; shown on hover. */ reason?: string };
```

## resolveInlineDiff (value)

```ts
(segments: InlineDiffSegment[], decisions: Record<string, InlineDiffDecision>) => string
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `length` | 是 | `number` | Gets or sets the length of the array. This is a number one higher than the highest index in the array. |
| `toString` | 是 | `() => string` | Returns a string representation of an array. |
| `toLocaleString` | 是 | `{ (): string; (locales: string \| string[], options?: Intl.NumberFormatOptions & Intl.DateTimeFormatOptions): string; }` | Returns a string representation of an array. The elements are converted to string using their toLocaleString methods. |
| `pop` | 是 | `() => InlineDiffSegment \| undefined` | Removes the last element from an array and returns it. If the array is empty, undefined is returned and the array is not modified. |
| `push` | 是 | `(...items: InlineDiffSegment[]) => number` | Appends new elements to the end of an array, and returns the new length of the array. |
| `concat` | 是 | `{ (...items: ConcatArray<InlineDiffSegment>[]): InlineDiffSegment[]; (...items: (InlineDiffSegment \| ConcatArray<InlineDiffSegment>)[]): InlineDiffSegment[]; }` | Combines two or more arrays. This method returns a new array without modifying any existing arrays. |
| `join` | 是 | `(separator?: string) => string` | Adds all the elements of an array into a string, separated by the specified separator string. |
| `reverse` | 是 | `() => InlineDiffSegment[]` | Reverses the elements in an array in place. This method mutates the array and returns a reference to the same array. |
| `shift` | 是 | `() => InlineDiffSegment \| undefined` | Removes the first element from an array and returns it. If the array is empty, undefined is returned and the array is not modified. |
| `slice` | 是 | `(start?: number, end?: number) => InlineDiffSegment[]` | Returns a copy of a section of an array. For both start and end, a negative index can be used to indicate an offset from the end of the array. For example, -2 refers to the second to last element of the array. |
| `sort` | 是 | `(compareFn?: ((a: InlineDiffSegment, b: InlineDiffSegment) => number) \| undefined) => InlineDiffSegment[]` | Sorts an array in place. This method mutates the array and returns a reference to the same array. |
| `splice` | 是 | `{ (start: number, deleteCount?: number): InlineDiffSegment[]; (start: number, deleteCount: number, ...items: InlineDiffSegment[]): InlineDiffSegment[]; }` | Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements. |
| `unshift` | 是 | `(...items: InlineDiffSegment[]) => number` | Inserts new elements at the start of an array, and returns the new length of the array. |
| `indexOf` | 是 | `(searchElement: InlineDiffSegment, fromIndex?: number) => number` | Returns the index of the first occurrence of a value in an array, or -1 if it is not present. |
| `lastIndexOf` | 是 | `(searchElement: InlineDiffSegment, fromIndex?: number) => number` | Returns the index of the last occurrence of a specified value in an array, or -1 if it is not present. |
| `every` | 是 | `{ <S extends InlineDiffSegment>(predicate: (value: InlineDiffSegment, index: number, array: InlineDiffSegment[]) => value is S, thisArg?: any): this is S[]; (predicate: (value: InlineDiffSegment, index: number, array: InlineDiffSegment[]) => unknown, thisArg?: any): boolean; }` | Determines whether all the members of an array satisfy the specified test. |
| `some` | 是 | `(predicate: (value: InlineDiffSegment, index: number, array: InlineDiffSegment[]) => unknown, thisArg?: any) => boolean` | Determines whether the specified callback function returns true for any element of an array. |
| `forEach` | 是 | `(callbackfn: (value: InlineDiffSegment, index: number, array: InlineDiffSegment[]) => void, thisArg?: any) => void` | Performs the specified action for each element in an array. |
| `map` | 是 | `<U>(callbackfn: (value: InlineDiffSegment, index: number, array: InlineDiffSegment[]) => U, thisArg?: any) => U[]` | Calls a defined callback function on each element of an array, and returns an array that contains the results. |
| `filter` | 是 | `{ <S extends InlineDiffSegment>(predicate: (value: InlineDiffSegment, index: number, array: InlineDiffSegment[]) => value is S, thisArg?: any): S[]; (predicate: (value: InlineDiffSegment, index: number, array: InlineDiffSegment[]) => unknown, thisArg?: any): InlineDiffSegment[]; }` | Returns the elements of an array that meet the condition specified in a callback function. |
| `reduce` | 是 | `{ (callbackfn: (previousValue: InlineDiffSegment, currentValue: InlineDiffSegment, currentIndex: number, array: InlineDiffSegment[]) => InlineDiffSegment): InlineDiffSegment; (callbackfn: (previousValue: InlineDiffSegment, currentValue: InlineDiffSegment, currentIndex: number, array: InlineDiffSegment[]) => InlineDiffSegment, initialValue: InlineDiffSegment): InlineDiffSegment; <U>(callbackfn: (previousValue: U, currentValue: InlineDiffSegment, currentIndex: number, array: InlineDiffSegment[]) => U, initialValue: U): U; }` | Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function. |
| `reduceRight` | 是 | `{ (callbackfn: (previousValue: InlineDiffSegment, currentValue: InlineDiffSegment, currentIndex: number, array: InlineDiffSegment[]) => InlineDiffSegment): InlineDiffSegment; (callbackfn: (previousValue: InlineDiffSegment, currentValue: InlineDiffSegment, currentIndex: number, array: InlineDiffSegment[]) => InlineDiffSegment, initialValue: InlineDiffSegment): InlineDiffSegment; <U>(callbackfn: (previousValue: U, currentValue: InlineDiffSegment, currentIndex: number, array: InlineDiffSegment[]) => U, initialValue: U): U; }` | Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function. |
| `find` | 是 | `{ <S extends InlineDiffSegment>(predicate: (value: InlineDiffSegment, index: number, obj: InlineDiffSegment[]) => value is S, thisArg?: any): S \| undefined; (predicate: (value: InlineDiffSegment, index: number, obj: InlineDiffSegment[]) => unknown, thisArg?: any): InlineDiffSegment \| undefined; }` | Returns the value of the first element in the array where predicate is true, and undefined otherwise. |
| `findIndex` | 是 | `(predicate: (value: InlineDiffSegment, index: number, obj: InlineDiffSegment[]) => unknown, thisArg?: any) => number` | Returns the index of the first element in the array where predicate is true, and -1 otherwise. |
| `fill` | 是 | `(value: InlineDiffSegment, start?: number, end?: number) => InlineDiffSegment[]` | Changes all array elements from `start` to `end` index to a static `value` and returns the modified array |
| `copyWithin` | 是 | `(target: number, start: number, end?: number) => InlineDiffSegment[]` | Returns the this object after copying a section of the array identified by start and end to the same array starting at position target |
| `entries` | 是 | `() => ArrayIterator<[number, InlineDiffSegment]>` | Returns an iterable of key, value pairs for every entry in the array |
| `keys` | 是 | `() => ArrayIterator<number>` | Returns an iterable of keys in the array |
| `values` | 是 | `() => ArrayIterator<InlineDiffSegment>` | Returns an iterable of values in the array |
| `includes` | 是 | `(searchElement: InlineDiffSegment, fromIndex?: number) => boolean` | Determines whether an array includes a certain element, returning true or false as appropriate. |
| `flatMap` | 是 | `<U, This = undefined>(callback: (this: This, value: InlineDiffSegment, index: number, array: InlineDiffSegment[]) => U \| readonly U[], thisArg?: This \| undefined) => U[]` | Calls a defined callback function on each element of an array. Then, flattens the result into a new array. This is identical to a map followed by flat with depth 1. |
| `flat` | 是 | `<A, D extends number = 1>(this: A, depth?: D \| undefined) => FlatArray<A, D>[]` | Returns a new array with all sub-array elements concatenated into it recursively up to the specified depth. |
| `at` | 是 | `(index: number) => InlineDiffSegment \| undefined` | Returns the item located at the specified index. |
| `findLast` | 是 | `{ <S extends InlineDiffSegment>(predicate: (value: InlineDiffSegment, index: number, array: InlineDiffSegment[]) => value is S, thisArg?: any): S \| undefined; (predicate: (value: InlineDiffSegment, index: number, array: InlineDiffSegment[]) => unknown, thisArg?: any): InlineDiffSegment \| undefined; }` | Returns the value of the last element in the array where predicate is true, and undefined otherwise. |
| `findLastIndex` | 是 | `(predicate: (value: InlineDiffSegment, index: number, array: InlineDiffSegment[]) => unknown, thisArg?: any) => number` | Returns the index of the last element in the array where predicate is true, and -1 otherwise. |
| `toReversed` | 是 | `() => InlineDiffSegment[]` | Returns a copy of an array with its elements reversed. |
| `toSorted` | 是 | `(compareFn?: ((a: InlineDiffSegment, b: InlineDiffSegment) => number) \| undefined) => InlineDiffSegment[]` | Returns a copy of an array with its elements sorted. |
| `toSpliced` | 是 | `{ (start: number, deleteCount: number, ...items: InlineDiffSegment[]): InlineDiffSegment[]; (start: number, deleteCount?: number): InlineDiffSegment[]; }` | Copies an array and removes elements and, if necessary, inserts new elements in their place. Returns the copied array. Copies an array and removes elements while returning the remaining elements. |
| `with` | 是 | `(index: number, value: InlineDiffSegment) => InlineDiffSegment[]` | Copies an array, then overwrites the value at the provided index with the given value. If the index is negative, then it replaces from the end of the array. |
| `__@iterator@34` | 是 | `() => ArrayIterator<InlineDiffSegment>` | Iterator |
| `__@unscopables@36` | 是 | `{ [x: number]: boolean \| undefined; length?: boolean \| undefined; toString?: boolean \| undefined; toLocaleString?: boolean \| undefined; pop?: boolean \| undefined; push?: boolean \| undefined; concat?: boolean \| undefined; join?: boolean \| undefined; reverse?: boolean \| undefined; shift?: boolean \| undefined; slice?: boolean \| undefined; sort?: boolean \| undefined; splice?: boolean \| undefined; unshift?: boolean \| undefined; indexOf?: boolean \| undefined; lastIndexOf?: boolean \| undefined; every?: boolean \| undefined; some?: boolean \| undefined; forEach?: boolean \| undefined; map?: boolean \| undefined; filter?: boolean \| undefined; reduce?: boolean \| undefined; reduceRight?: boolean \| undefined; find?: boolean \| undefined; findIndex?: boolean \| undefined; fill?: boolean \| undefined; copyWithin?: boolean \| undefined; entries?: boolean \| undefined; keys?: boolean \| undefined; values?: boolean \| undefined; includes?: boolean \| undefined; flatMap?: boolean \| undefined; flat?: boolean \| undefined; at?: boolean \| undefined; findLast?: boolean \| undefined; findLastIndex?: boolean \| undefined; toReversed?: boolean \| undefined; toSorted?: boolean \| undefined; toSpliced?: boolean \| undefined; with?: boolean \| undefined; [Symbol.iterator]?: boolean \| undefined; readonly [Symbol.unscopables]?: boolean \| undefined; }` | Is an object whose properties have the value 'true' when they will be absent when used in a 'with' statement. |

## 选型

- AI 改写文字，用户逐处接受/拒绝 → `InlineDiff`

不要用：
- 表格行的增删改 → `AgentDiffTable`
- 代码改动 → `AgentCodeBlock`
- 字段前后对比后确认 → `Approval`
