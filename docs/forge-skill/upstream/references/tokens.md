# Forge Design Tokens — quick reference

Snapshot of `@forge-ui-official/core/styles.css`. When picking a color, pick a semantic alias first (`accent`, `text-muted`, `border`); reach for raw primitives (`fg-violet-500`) only when none fit.

Tailwind usage: `bg-fg-violet-500` / `text-fg-grey-700` / `border-fg-grey-200`. CSS: `var(--fg-violet)` / `var(--accent)`.

## Primitive palette (`--fg-*`)

The 7 color families plus grey and white share the same 10-shade scale. Aliases point at `500`.

### Violet (optional theme — alias `--fg-violet`)
| Shade | Hex | Typical use |
|---|---|---|
| 50 | `#F1EBFD` | soft background for violet surfaces |
| 100 | `#D3C2F8` | chip / tag background |
| 200 | `#BEA4F5` | |
| 300 | `#A17AF1` | |
| 400 | `#8E61EE` | |
| **500** | `#7239EA` | **primary brand** |
| 600 | `#6834D5` | hover |
| 700 | `#5128A6` | deep surfaces |
| 800 | `#3F1F81` | |
| 900 | `#301862` | high-contrast text on violet |

### Blue
| Shade | Hex |
|---|---|
| 50 | `#EBEEFF` |
| 100 | `#C0CAFF` |
| 200 | `#A2B0FF` |
| 300 | `#788CFF` |
| 400 | `#5D75FF` |
| **500** | `#3553FF` |
| 600 | `#304CE8` |
| 700 | `#263BB5` |
| 800 | `#1D2E8C` |
| 900 | `#16236B` |

### Green
| Shade | Hex |
|---|---|
| 50 | `#E6F8F0` |
| 100 | `#B3E9D2` |
| 200 | `#8EDFBC` |
| 300 | `#5AD09D` |
| 400 | `#3AC78A` |
| **500** | `#09B96D` |
| 600 | `#08A863` |
| 700 | `#06834D` |
| 800 | `#05663C` |
| 900 | `#044E2E` |

### Red (alias `--fg-red`)
| Shade | Hex |
|---|---|
| 50 | `#FFEDE9` |
| 100 | `#FFC7BB` |
| 200 | `#FFAC9A` |
| 300 | `#FE866C` |
| 400 | `#FE6E4F` |
| **500** | `#FE4A23` |
| 600 | `#E74320` |
| 700 | `#B43519` |
| 800 | `#8C2913` |
| 900 | `#6B1F0F` |

### Yellow (alias `--fg-yellow`)
| Shade | Hex |
|---|---|
| 50 | `#FEF9E6` |
| 100 | `#FCEBB1` |
| 200 | `#FBE28B` |
| 300 | `#F9D555` |
| 400 | `#F8CD35` |
| **500** | `#F6C002` |
| 600 | `#E0AF02` |
| 700 | `#AF8801` |
| 800 | `#876A01` |
| 900 | `#675101` |

### Cyan
| Shade | Hex |
|---|---|
| 50 | `#ECFAFB` |
| 100 | `#C5F0F3` |
| 200 | `#A9E8ED` |
| 300 | `#81DEE4` |
| 400 | `#69D8DF` |
| **500** | `#43CED7` |
| 600 | `#3DBBC4` |
| 700 | `#309299` |
| 800 | `#257176` |
| 900 | `#1C575A` |

### Black (alias `--fg-black`)
⚠ `fg-black-500` is `#000A19`, not pure `#000`. The whole scale is a cool near-black range for text + deep backgrounds.

| Shade | Hex |
|---|---|
| 50 | `#E6E7E8` |
| 100 | `#B0B3B8` |
| 200 | `#8A8E95` |
| 300 | `#545B65` |
| 400 | `#333B47` |
| **500** | `#000A19` |
| 600 | `#000917` |
| 700 | `#000712` |
| 800 | `#00060E` |
| 900 | `#00040B` |

### Grey
| Shade | Hex |
|---|---|
| 50 | `#FAFAFA` |
| 100 | `#EBEBEB` |
| 200 | `#E1E1E1` |
| 300 | `#D3D3D3` |
| 400 | `#CACACA` |
| 500 | `#BDBDBD` |
| 600 | `#ACACAC` |
| 700 | `#868686` |
| 800 | `#686868` |
| 900 | `#4F4F4F` |

Default muted icon color: `#71717A` (slightly bluer than `fg-grey-700`, standardized across the Kit).

### White
`--fg-white` = `#FFFFFF`.

---

## Semantic tokens (light theme — defaults)

Always prefer these over primitives when the meaning matches.

| Token | Value | Use for |
|---|---|---|
| `--background` | `fg-white` | page background |
| `--foreground` | `fg-black` | primary text / icon on background |
| `--surface` | `fg-grey-50` | raised card background |
| `--surface-foreground` | `fg-black` | text on surface |
| `--overlay` | `rgba(0,10,25,0.40)` | modal scrim |
| `--accent` | `fg-blue` | primary action |
| `--accent-foreground` | `fg-white` | text on accent |
| `--accent-soft` | `fg-blue-100` | soft accent background |
| `--accent-soft-foreground` | `fg-blue` | text on soft accent |
| `--text-primary` | `fg-black` | body text |
| `--text-secondary` | `fg-grey-900` | secondary text |
| `--text-muted` | `fg-grey-700` | muted text, helper text |
| `--text-disabled` | `fg-grey-500` | disabled text |
| `--border` | `fg-grey-200` | default border / divider |
| `--border-muted` | `fg-grey-100` | softer divider |
| `--divider` | `fg-grey-200` | horizontal rules |
| `--danger` | `fg-red` | destructive action |
| `--danger-foreground` | `fg-white` | text on danger |
| `--warning` | `fg-yellow` | warning state |
| `--warning-foreground` | `fg-black` | text on warning |
| `--warning-soft` | `fg-yellow-50` | soft warning background |
| `--warning-muted` | `fg-yellow-600` | warning text |
| `--focus` | `fg-blue` | focus ring |
| `--hover` | `fg-grey-100` | hover background |

## Dark mode

Set `data-theme="dark"` on `<html>` (or on any container; a nested `data-theme="light"` restores light). Dark mode redefines the grey, black and color primitives, so `bg-fg-grey-*`, `text-fg-black` and `text-fg-grey-*` keep working without changes.

- Surfaces (cards, panels, inputs, popovers): `bg-background`. Page background: `bg-fg-grey-50` or `bg-surface`. Do not use `bg-white` / `bg-fg-white` for surfaces — they stay white in dark.
- Keep `bg-white` only for things that must stay white on a colored fill (switch knob, dot inside a checked radio, white pill on a colored sidebar).
- `bg-fg-black` fills (dark buttons, tooltips, black cards) stay dark in dark mode via `--fg-black-fill`, so white text on them is fine. `text-fg-black` flips to the light ink.
- Colored text (`text-fg-blue`, `text-fg-green`…) switches to a lighter shade automatically; `bg-fg-*-50/100/200` tints become dark tints; 700–900 text steps become light.
- In CSS, never hard-code `#fff` / `white` as a background; use `var(--background)`. Mixing a tint: `color-mix(in srgb, var(--fg-blue) 8%, var(--background))`.
- Brand themes from forgeui.org/docs/theme include the matching dark scale.

## Shape + elevation

| Token | Value | Use |
|---|---|---|
| `--radius-card` | `20px` | card / modal corner |
| `--radius-xs` | `4px` | tight corner (input) |
| `--shadow-subtle` | `0px 4px 30px 0px rgba(102,112,133,0.03)` | whisper-soft |
| `--shadow-card` | `0px 4px 30px 0px rgba(77,84,100,0.05)` | default card |
| `--shadow-elevated` | `0px 4px 30px 0px rgba(77,84,100,0.20)` | popover / modal |

## Type

| Token | Value |
|---|---|
| `--font-sans` | Manrope (body) |
| `--font-display` | Plus Jakarta Sans (headings) |
| `--text-display-l` | `28px` |
| `--text-2xs` | `10px` |
| `--tracking-fg` | `0.5px` (standard letter-spacing for Forge) |

Tailwind utility for the standard letter-spacing: `tracking-fg`.

## 中文应用约定

先按文本、背景、边框、焦点语义选择 token；图表颜色保持指标语义一致，不用颜色制造无业务意义的分类。内容区跟随父容器，页面 padding 由 AppLayout 负责。

## 默认主题与名称映射

默认 accent/focus 是 **blue**，依据 core/src/styles/tokens.css:185–241；purple/black 是可选主题，不是所有页面的默认。7 个色族为 violet、blue、green、red、yellow、cyan、black，另有 grey 与 white。CSS token `fg-violet` 对应组件 color prop `"purple"`；二者是不同命名层，不要写 color="violet"。主题继承宿主，未授权不修改全局 Token。
