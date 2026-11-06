# Icons — @forge-ui-official/core/icons

Forge 项目唯一 icon 源。禁止用 `lucide-react`、inline SVG 等，**除**文件类型 icon（`public/images/file-icons/*.svg` 是 Figma 原图资产）。

## 基础用法

```tsx
import { MagniferLinear, BellBoldDuotone } from "@forge-ui-official/core/icons";

<MagniferLinear size={16} color="#71717A" />
<BellBoldDuotone size={24} color="var(--fg-violet)" />
```

## Variant 后缀（决定视觉风格）

| 后缀 | 视觉 | 何时用 |
|---|---|---|
| `Linear` | 细描边 | 功能性图标（搜索 / 复制 / 编辑 / 删除） |
| `Bold` | 粗实心 | 少用，几乎被 BoldDuotone 取代 |
| `BoldDuotone` | 双色实心（主色 + 半透明填充） | **装饰性 / widget 图标**（通知铃 / 日历 / 邮件等顶部 icon） |
| `LineDuotone` | 双色细线 | 偶用，线条 + 淡填充 |
| `Outline` | 单色粗描边 | 少用 |
| `Broken` | 破线装饰 | 少用 |

**Figma 规范**：widget 图标用 `BoldDuotone`，功能图标用 `Linear`。

## 项目统一色值

- **默认灰**：`#71717A`（等价 `fg-grey-700` 附近），90% 场景的功能图标直接传这个
- 语义色：传 `var(--fg-*)` 或 hex（如 `color="var(--fg-red)"` 表示危险色）
- 白字按钮上的 icon：`color="#fff"`

## 必踩的两个坑（反复犯）

1. core/icons 默认使用 currentColor，支持 className 继承色；显式 color 会覆盖继承色。
2. **wrapper 压扁 SVG**。外层给 `p-3` 或固定 `height` 会把 icon 挤扁。外层**只给正方形 box**（如 `w-5 h-5` + `inline-flex items-center justify-center`），padding 通过 `p-{n}` 放在更外层容器上。

## 常用 icon 索引（按语义分类）

### 导航 / 布局

- 菜单折叠：`HamburgerMenuLinear`
- 下拉箭头：`AltArrowDownLinear`
- 上下左右箭头：`AltArrow{Up,Down,Left,Right}Linear`
- 外链：`ArrowRightUpLinear`
- 返回：`AltArrowLeftLinear`
- 首页：`HomeLinear` / `HomeBoldDuotone`

### 操作 / 工具

- 搜索：`MagniferLinear`
- 复制：`CopyLinear`
- 编辑：`PenLinear` / `PenNewSquareLinear`
- 删除：`TrashBinMinimalisticLinear` / `TrashBinTrashLinear`
- 设置：`SettingsLinear`
- 添加：`AddCircleLinear` / `AddSquareLinear` / `PlusLinear`
- 关闭：`CloseCircleLinear` / `CloseSquareLinear`
- 更多：`MenuDotsLinear` / `MenuDotsBold`
- 过滤：`FilterLinear`
- 排序：`SortFromTopToBottomBold`
- 下载：`DownloadLinear` / `ExportLinear`
- 上传：`UploadLinear`

### 反馈 / 状态

- 勾选：`CheckCircleLinear` / `CheckReadLinear`
- 问号：`QuestionCircleLinear` / `InfoCircleLinear`
- 警告：`DangerLinear` / `DangerCircleLinear`
- 错误：`CloseCircleLinear`
- 星标：`StarLinear` / `StarBoldDuotone`
- 收藏：`HeartLinear` / `BookmarkLinear`
- 点赞：`LikeLinear`

### 用户 / 社交

- 头像：`UserLinear` / `UserCircleLinear`
- 多人：`UsersGroupTwoRoundedLinear`
- 消息：`LetterBoldDuotone` / `ChatRoundLineLinear`
- 通知：`BellBoldDuotone`
- 聊天：`ChatDotsLinear` / `ChatRoundLinear`

### 内容

- 日历：`CalendarBoldDuotone` / `CalendarLinear`
- 时间：`ClockCircleLinear` / `AlarmLinear`
- 文档：`DocumentLinear` / `DocumentsLinear` / `DocumentTextLinear`
- 文件：`FileLinear` / `FolderLinear`
- 图片：`GalleryLinear` / `GalleryAddLinear`
- 链接：`LinkCircleLinear`

### 商业

- 购物车：`CartLargeBoldDuotone` / `CartBoldDuotone`
- 货币：`WalletMoneyLinear` / `WalletMoneyLinear`
- 信用卡：`CardLinear` / `CardTransferLinear`
- 标签：`TagLinear` / `TagPriceLinear`

## 常见组合模式

```tsx
// 1. 灰色默认 icon（内容区）
<MagniferLinear size={16} color="#71717A" />

// 2. 主色点睛 icon（CTA 左侧）
<PlusLinear size={18} color="#fff" />
<IconButton><StarBoldDuotone size={20} color="var(--fg-violet)" /></IconButton>

// 3. BoldDuotone widget（顶部 TopBar / PageHeader）
<BellBoldDuotone size={24} color="var(--fg-grey-700)" />
<CalendarBoldDuotone size={20} color="var(--fg-violet)" />

// 4. 危险操作
<TrashBinMinimalisticLinear size={18} color="var(--fg-red)" />
```

## 查找 icon 名字

如果不确定某语义的 icon 名：

```bash
ls node_modules/@forge-ui-official/core/icons/dist/icons/ | grep -i <关键词>
```

常用关键词 → 文件名 映射：用"搜索 = magnifer"、"邮件 = letter"、"钱包 = wallet"、"编辑 = pen"、"删除 = trash" 等英文词 grep。
