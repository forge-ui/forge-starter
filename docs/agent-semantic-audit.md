# Forge 页面规范审计 — 2026-09-28

分两批审计。第一批 accounts：collection 表格 + detail 全页 + form-modal；chrome A；对照 `/ref/list-table`、现有 accounts 全页详情、`/ref/form-modal`；case 为 table/input-field/grid。第二批 models：资源工作台 + detail-modal；chrome A；对照 `/ref/resource-workspace`、`/ref/detail-modal`；case 为 grid/card/modal。

## 四层取证

| 层 | accounts | models |
|---|---|---|
| S 页面结构 | 列表、全页详情、独立表单组件；通用 hook 只传状态与接收指令 | 工作台、详情弹窗；第二适配器不改执行循环 |
| O 内容外层 | 原 AppShell；根 stack；内容面内滚 | 原 AppShell；WorkspaceSplit 内滚；截图首屏底 gutter 可见 |
| N 区块外壳 | 工具带后直接 DataTable；详情 Grid + 信息分区 | 改用既有 WorkspaceSplit/FolderNav，与资源参考页一致 |
| C 组件 | 原 Forge 表格/表单/状态组件；共享 Zod 字段错误 | Forge Grid、SurfaceCard、StatusBadge；详情用既有 Modal |

修复记录：模型页原手写供应商 aside 改为参考页既有 WorkspaceSplit/FolderNav（L1/C1）；去掉重复模型面包屑祖先（H4）；ModelCard 基础模型副行改 grey-700（V7）；账号 SelectOption 也接字段错误（F3）。业务语义和协议修改单独由测试验证。

证据文件：`app/(app)/accounts/page.tsx`（A）、`app/(app)/accounts/[id]/page.tsx`（AD）、`components/account-form-dialog.tsx`（AF）、`app/(app)/models/page.tsx`（M）、`components/model-card.tsx`（MC）、`components/model-detail-dialog.tsx`（MD）、`components/model-form-dialog.tsx`（MF）。截图位于 `.semantic/browser-account.png`、`.semantic/browser-model.png`。以下每行分别给出两批结论。

| 项 | accounts | models | 核查证据与判断 |
|---|---|---|---|
| M1 | 通过 | 通过 | config/menu.tsx 均为模块入口 |
| M2 | 通过 | 通过 | 菜单 Solar BoldDuotone 20 |
| M3 | 不适用 | 不适用 | 本次没有新模块/新菜单；既有菜单三处不变 |
| M4 | 通过 | 通过 | 入口实际存在且浏览器从侧栏进入 |
| M5 | 通过 | 通过 | 沿用既有模块分组 |
| M6 | 通过 | 通过 | 入口尾斜杠一致 |
| R1 | 通过 | 通过 | 角色已列于报告开头 |
| R2 | 通过 | 通过 | AD 全页；MD 轻详情弹窗，未增加第二套 |
| R3 | 通过 | 通过 | AF/MF 独立表单弹窗 |
| R4 | 通过 | 通过 | A create/edit query；M create/edit/id query |
| R5 | 通过 | 不适用 | 账号兼容路由维持 redirect；模型无新增兼容页 |
| H1 | 通过 | 通过 | h1 + Breadcrumbs + PageTitleActions，唯一 AskAi 宿主 |
| H2 | 通过 | 通过 | accent、末项无 href |
| H3 | 通过 | 不适用 | AD 末项 account.name；模型无动态全页 |
| H4 | 通过 | 通过 | 工作台起始；模型重复祖先已移除 |
| H5 | 通过 | 不适用 | AD 面包屑返回带列表上下文；模型关闭详情 |
| H6 | 通过 | 通过 | 无页内 PageHeader 内容卡 |
| H7 | 通过 | 通过 | 账号表状态列；详情身份行与名称绑定 |
| L1 | 通过 | 通过 | 共用 AppShell；M 改用参考页既有工作台封装 |
| L2 | 通过 | 通过 | 页面根 stack 无重复大 padding |
| L3 | 通过 | 通过 | A ButtonGroup + TextField；M 同行 Kit 搜索控件 |
| L4 | 通过 | 不适用 | AD Grid 元信息/主栏；模型轻详情 |
| L5 | 不适用 | 不适用 | 无 dashboard 修改 |
| L6 | 通过 | 通过 | 浏览器截图检查间距、圆角与对齐 |
| L7 | 通过 | 不适用 | A 固定/比例列宽，日期与操作可见；M 卡片集合 |
| L8 | 通过 | 不适用 | A 表直接在 stack；M 无 DataTable 内容区 |
| L9 | 通过 | 通过 | AD Grid/GridItem；M 卡片 Grid；工作台采用既有参考封装 |
| L10 | 通过 | 通过 | 原 AppLayout 内容面保留首屏 gutter；模型截图可见底边距 |
| C1 | 通过 | 通过 | Forge core + 已有 Modal/WorkspaceSplit 等封装 |
| C2 | 通过 | 不适用 | A DataTable；M 为资源卡片 |
| C3 | 通过 | 不适用 | A 未设置假 sortable |
| C4 | 通过 | 通过 | ConfirmationDialog 有既有遮罩宿主 |
| C5 | 通过 | 通过 | 状态均有文字 |
| C6 | 通过 | 通过 | 编辑/删除/查询/打开有实际处理器；保存已验证真实数据库 |
| C7 | 通过 | 通过 | SelectOption error props、Grid、StatusBadge 按安装包声明 |
| C8 | 通过 | 通过 | typecheck/build 确认实际导出 |
| C9 | 通过 | 不适用 | A 点击账号名称进详情，操作列仅编辑删除；M 点击卡片名称 |
| C10 | 不适用 | 不适用 | 本次页面没有详情重复指标卡 |
| V1 | 通过 | 通过 | fg token；危险图标沿用清单明确白名单 |
| V2 | 通过 | 通过 | 业务控件 siteConfig.accent |
| V3 | 通过 | 通过 | Solar 行为图标；供应商图像属于品牌资源 |
| V4 | 不适用 | 不适用 | 无图表修改 |
| V5 | 通过 | 通过 | chrome A 的 display-l 标题 |
| V6 | 通过 | 通过 | Kit StatusBadge 默认 soft |
| V7 | 通过 | 通过 | 标题/主值 black，副行 grey-700；MC 已修复 |
| F1 | 通过 | 通过 | AF/MF：Modal 与原 Kit 字段、底部动作 |
| F2 | 通过 | 通过 | 删除有页面 ConfirmationDialog；AI 不直接删库 |
| F3 | 通过 | 通过 | AF 共享 Zod + fieldErrors；MF 原有字段错误保留 |
| F4 | 通过 | 通过 | toast.success/error，无内嵌成功条 |
| F5 | 通过 | 通过 | 账号创建开全页；模型创建开详情弹窗 |
| F6 | 通过 | 通过 | 未自研 Drawer；Ask AI 使用 Kit |
| D1 | 通过 | 通过 | 原 error/retry、loading、空表/筛选空态分支保留 |
| D2 | 通过 | 不适用 | AD loading/不存在分支；模型非全页详情 |
| D3 | 通过 | 通过 | service/API/store；隔离 PG 验证账号提交 |
| D4 | 通过 | 通过 | admin_accounts/ai_models 独立于 users |
| D5 | 通过 | 通过 | A URL 筛选；M 仍为临时工作台筛选，建议后续支持可分享 URL |
| D6 | 通过 | 通过 | 业务投影和模型工具不含密钥；详情仅掩码/未填写 |
| E1 | 通过 | 通过 | 原分层保留；协议在 lib/semantic 与独立 hook |
| E2 | 通过 | 通过 | API 服务端 session/permission、Zod、中文错误 |
| E3 | 通过 | 通过 | 复用过滤函数与状态协议；无通用循环模块分支 |
| E4 | 通过 | 通过 | 页面声明 use client 并有交互 |
| Q1 | 通过 | 通过 | pnpm check；15 个 ref 历史警告，无新红线 |
| Q2 | 通过 | 通过 | Chrome 实点账号 AI→表单→保存→续办；模型 AI→详情 URL |
| Q3 | 通过 | 通过 | 对照物已声明；模型卡片与账号表格为合理业务差异 |
| Q4 | 通过 | 通过 | 本次浏览器读取 error/warn 日志为空；构建 middleware 弃用提示属既有事项 |

建议复核：模型筛选尚未写入 URL；没有对本次未修改的 dashboard/ref 历史样板债进行扩展整改。此次浏览器证据覆盖桌面视口；不代表所有移动端尺寸的视觉验收。
