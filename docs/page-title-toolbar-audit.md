# 页标题迁移规范审计（2026-10-10）

本审计覆盖七个修改页面的规范与标题交互；不代表 CRUD 写入、模型调用或全仓业务正确性验收。按模块分别核查；下表每个模块覆盖清单全部条目。

## 对照物

| 页面 | 角色 | chrome | 对照页 | case |
|---|---|---|---|---|
| accounts | collection | B | /ref/list-table | toolbar；表格另核 table，分栏另核 grid |
| accounts/[id] | detail/profile | B | 既有账号档案骨架 + CRM customers/[id] 页头 | toolbar；表格另核 table，分栏另核 grid |
| roles | collection | B | /ref/list-table | toolbar；表格另核 table，分栏另核 grid |
| menus | collection | B | /ref/list-table | toolbar；表格另核 table，分栏另核 grid |
| permissions | collection | B | /ref/list-table | toolbar；表格另核 table，分栏另核 grid |
| models | resource-workspace | B | /ref/resource-workspace | toolbar；表格另核 table，分栏另核 grid |
| settings/apps | collection/settings | B | /ref/list-table | toolbar；表格另核 table，分栏另核 grid |

## 分层记录

| 层 | 看到的结构 | 对照与结论 |
|---|---|---|
| S | 列表页头→单条筛选→DataTable；模型页头→供应商工作台；详情页头→档案侧栏/指标/Tab | 保留对应角色主体，未改业务骨架 |
| O | AppShell 内纵向 stack；未新增整页白卡或 padding | 桌面首屏四周 gutter 可见，windowScroll=0 |
| N | 表直接落 stack；描述卡保留 DescriptionItem；模型 Grid 卡组 | 无新表外套卡；同部门关联为空，因此该表仅源码检查 |
| C | PageTitleToolbar/Breadcrumbs/ToolbarActions/AskAiEntry；原按钮和 handlers | 标题统一；使用 legacy 组合接口，H1 的 variant 要求尚未达到 |

## 结论

标题迁移与封装删除已完成，七页浏览器标题操作通过。审计保留一类未关闭偏差（H1，影响七页）：采用 core 仍支持但标记 deprecated 的组合接口，未使用固定 variant 预设。为全局 AskAi 实例保活，不逐页传 askAi 创建实例。不能将 check 通过表述为预设 API 合规。

修复：RBAC 三页编码/路径副行及错误说明文字由 grey-500 改为 grey-700；账号状态从标题旁移入带标签的 DescriptionItem；模型页面包屑移除旧 mt-1。

## 对照偏差与建议复核

- H1：core 0.3.10 预设只接受 askAi 配置且内部创建 AskAi，未提供入口 ReactNode 插槽；后续 core 提供插槽后才能完整迁移 variant/breadcrumbItems/结构化 action。
- D5：角色、菜单、权限和模型原搜索筛选保存在 React state；本次标题迁移未更改。列为既有判断项。
- D3：应用登记按产品约定保存在浏览器 localStorage，非业务数据库实体。
- 账号详情同部门关联表当前零条数据，只验证空态及 JSX 列配置，未制造业务数据。
- 未执行写库、创建权限、删除数据或发送模型请求。

## 清单反哺建议

本次只纠正清单内已删除封装的引用，未放宽 variant 规则。保活入口与预设 API 的兼容口径需未来 core 能力补齐后再决定。

## 逐模块核查

### accounts

| 条目 | 状态 | 证据 | 处置/说明 |
|---|---|---|---|
| M1 | 通过 | `config/menu.tsx:22` | 菜单只挂模块入口 |
| M2 | 通过 | `config/menu.tsx:24` | 侧栏 BoldDuotone size=20 |
| M3 | 不适用 | `config/site.ts:19` | 本次未增加模块；已注册路由 hideHeader=true |
| M4 | 通过 | `config/menu.tsx:22` | 菜单地址均有业务路由 |
| M5 | 通过 | `config/menu.tsx:21` | 资料与改密走头像菜单 |
| M6 | 通过 | `config/menu.tsx:27` | 菜单尾斜杠统一 |
| R1 | 通过 | `app/(app)/accounts/page.tsx:61` | 按页面角色保持骨架 |
| R2 | 通过 | `app/(app)/accounts/page.tsx:61` | 原详情形态保留 |
| R3 | 通过 | `app/(app)/accounts/page.tsx:61` | 新建编辑保留独立表单弹窗 |
| R4 | 通过 | `app/(app)/accounts/page.tsx:61` | 原 create/edit/id 深链处理保留 |
| R5 | 不适用 | `app/(app)/accounts/page.tsx:61` | 本次未修改兼容 redirect 路由 |
| H1 | 违规 | `app/(app)/accounts/page.tsx:17` | 正文已使用 Kit，但仍用 legacy breadcrumbs/actions；core 预设无保活入口插槽，未满足 variant 要求 |
| H2 | 通过 | `app/(app)/accounts/page.tsx:17` | Breadcrumbs 在标题组件内；祖先有 href、末项无 href |
| H3 | 不适用 | `app/(app)/accounts/page.tsx:17` | 非动态详情路由 |
| H4 | 通过 | `app/(app)/accounts/page.tsx:17` | 首层工作台 /dashboard/ |
| H5 | 不适用 | `app/(app)/accounts/page.tsx:17` | 非全页详情 |
| H6 | 通过 | `app/(app)/accounts/page.tsx:17` | 无页内 PageHeader、无双标题 |
| H7 | 通过 | `app/(app)/accounts/page.tsx:17` | 状态归属由字段或表列明确 |
| L1 | 通过 | `app/(app)/layout.tsx:1` | 由 AppShell 统一包裹 |
| L2 | 通过 | `app/(app)/accounts/page.tsx:197` | 根纵向 stack，无新增页面 padding |
| L3 | 通过 | `app/(app)/accounts/page.tsx:197` | 页头后单条筛选搜索工具带 |
| L4 | 不适用 | `app/(app)/accounts/page.tsx:197` | 非全页详情 |
| L5 | 不适用 | `app/(app)/accounts/page.tsx:197` | 非 dashboard |
| L6 | 通过 | `app/(app)/accounts/page.tsx:197` | Kit 页头字号与间距，截图检查 |
| L7 | 通过 | `app/(app)/accounts/page.tsx:197` | 表列类型和日期操作宽度，截图检查 |
| L8 | 通过 | `app/(app)/accounts/page.tsx:197` | DataTable 直接落 stack，无外层装饰白卡 |
| L9 | 不适用 | `app/(app)/accounts/page.tsx:197` | 无页面级分栏或等宽卡组 |
| L10 | 通过 | `app/(app)/accounts/page.tsx:197` | 截图首屏底 gutter 可见；内容面内滚 |
| C1 | 通过 | `app/(app)/accounts/page.tsx:3` | UI 由 core 与既有宿主组合 |
| C2 | 通过 | `app/(app)/accounts/page.tsx:3` | 列表用 DataTable |
| C3 | 通过 | `app/(app)/accounts/page.tsx:3` | 无 sortable:true 假排序 |
| C4 | 通过 | `app/(app)/accounts/page.tsx:3` | ConfirmationDialog 包 Modal |
| C5 | 通过 | `app/(app)/accounts/page.tsx:3` | 状态带明确中文文字 |
| C6 | 通过 | `app/(app)/accounts/page.tsx:3` | 迁移后的标题按钮接原 handler；实际点开弹窗 |
| C7 | 通过 | `app/(app)/accounts/page.tsx:3` | 组合 props 在 core 0.3.10 类型中仍支持；预设偏差见 H1 |
| C8 | 通过 | `app/(app)/accounts/page.tsx:3` | 组件真实导出，typecheck 通过 |
| C9 | 通过 | `app/(app)/accounts/page.tsx:3` | 详情从名称入口打开；保留原上下文；操作列仅编辑删除 |
| C10 | 不适用 | `app/(app)/accounts/page.tsx:3` | 非详情指标 |
| V1 | 通过 | `app/(app)/accounts/page.tsx:33` | fg token；危险图标沿用允许色 |
| V2 | 通过 | `app/(app)/accounts/page.tsx:33` | Breadcrumbs 和业务按钮跟 siteConfig.accent；删除语义 red |
| V3 | 通过 | `app/(app)/accounts/page.tsx:33` | 现有 solar 图标；PlusIcon 来自 Kit |
| V4 | 不适用 | `app/(app)/accounts/page.tsx:33` | 范围内无图表 |
| V5 | 通过 | `app/(app)/accounts/page.tsx:33` | 标题统一为 Kit PageTitleToolbar 字号 |
| V6 | 通过 | `app/(app)/accounts/page.tsx:33` | 状态为 soft StatusBadge；分类纯文字 |
| V7 | 通过 | `app/(app)/accounts/page.tsx:33` | 主文字黑；修正 RBAC 编码/路径副行和错误文字为 grey-700 |
| F1 | 通过 | `app/(app)/accounts/page.tsx:36` | 标题操作打开原 Modal 表单 |
| F2 | 通过 | `app/(app)/accounts/page.tsx:36` | 删除接确认卡，未执行删除 |
| F3 | 通过 | `components/account-form-dialog.tsx:220` | 关联表单已具字段 errorMessage，静态检查 |
| F4 | 通过 | `app/(app)/accounts/page.tsx:36` | 操作反馈沿用全站 toast |
| F5 | 通过 | `app/(app)/accounts/page.tsx:36` | 创建后动线沿用原 onCreated/onSaved；未提交新数据 |
| F6 | 通过 | `app/(app)/accounts/page.tsx:36` | 没有新增 Drawer/Sheet |
| D1 | 通过 | `app/(app)/accounts/page.tsx:1` | 保留异步错误重试、加载、双空态 |
| D2 | 不适用 | `app/(app)/accounts/page.tsx:1` | 非全页详情 |
| D3 | 通过 | `app/(app)/accounts/page.tsx:1` | 沿用 service/API/store，本次未改持久化 |
| D4 | 通过 | `lib/db/schema.ts:1` | 业务表与 users 分离，schema未变 |
| D5 | 通过 | `app/(app)/accounts/page.tsx:1` | 列表筛选/搜索 query 原逻辑保留 |
| D6 | 通过 | `app/(app)/accounts/page.tsx:1` | 无新增敏感字段；模型详情使用 apiKeyMasked |
| E1 | 通过 | `app/(app)/accounts/page.tsx:1` | 沿用 page、独立 form-dialog、store、service 组织 |
| E2 | 通过 | `app/(app)/accounts/page.tsx:1` | 现有资源 API 使用 requirePermission/jsonOk/jsonError/Zod；未修改 |
| E3 | 通过 | `app/(app)/accounts/page.tsx:1` | 标题布局直接用 core，不再自定义 WithAsk 封装 |
| E4 | 通过 | `app/(app)/accounts/page.tsx:1` | use client 页面包含交互 |
| Q1 | 通过 | `package.json:15` | pnpm check 通过；ref 15 条历史警告 |
| Q2 | 通过 | `app/(app)/accounts/page.tsx:17` | 浏览器侧栏进入主页面，标题按钮点开并截图 |
| Q3 | 通过 | `app/(app)/accounts/page.tsx:17` | 按角色选 ref 与 CRM toolbar；结构偏差明确说明 |
| Q4 | 通过 | `app/(app)/accounts/page.tsx:17` | 浏览器 dev.logs warn/error 返回空，未见 overlay 错误 |

截图：`tmp/toolbar-review-20261010/accounts.png`。

### accounts/[id]

| 条目 | 状态 | 证据 | 处置/说明 |
|---|---|---|---|
| M1 | 通过 | `config/menu.tsx:22` | 菜单只挂模块入口 |
| M2 | 通过 | `config/menu.tsx:24` | 侧栏 BoldDuotone size=20 |
| M3 | 不适用 | `config/site.ts:19` | 本次未增加模块；已注册路由 hideHeader=true |
| M4 | 通过 | `config/menu.tsx:22` | 菜单地址均有业务路由 |
| M5 | 通过 | `config/menu.tsx:21` | 资料与改密走头像菜单 |
| M6 | 通过 | `config/menu.tsx:27` | 菜单尾斜杠统一 |
| R1 | 通过 | `app/(app)/accounts/[id]/page.tsx:41` | 按页面角色保持骨架 |
| R2 | 通过 | `app/(app)/accounts/[id]/page.tsx:41` | 原详情形态保留 |
| R3 | 通过 | `app/(app)/accounts/[id]/page.tsx:41` | 新建编辑保留独立表单弹窗 |
| R4 | 通过 | `app/(app)/accounts/[id]/page.tsx:41` | 原 create/edit/id 深链处理保留 |
| R5 | 不适用 | `app/(app)/accounts/[id]/page.tsx:41` | 本次未修改兼容 redirect 路由 |
| H1 | 违规 | `app/(app)/accounts/[id]/page.tsx:11` | 正文已使用 Kit，但仍用 legacy breadcrumbs/actions；core 预设无保活入口插槽，未满足 variant 要求 |
| H2 | 通过 | `app/(app)/accounts/[id]/page.tsx:11` | Breadcrumbs 在标题组件内；祖先有 href、末项无 href |
| H3 | 通过 | `app/(app)/accounts/[id]/page.tsx:11` | 面包屑末项 account.name，中间层账号列表 |
| H4 | 通过 | `app/(app)/accounts/[id]/page.tsx:11` | 首层工作台 /dashboard/ |
| H5 | 通过 | `app/(app)/accounts/[id]/page.tsx:11` | 祖先链接 listHref 保留筛选上下文 |
| H6 | 通过 | `app/(app)/accounts/[id]/page.tsx:11` | 无页内 PageHeader、无双标题 |
| H7 | 通过 | `app/(app)/accounts/[id]/page.tsx:11` | 状态归属由字段或表列明确 |
| L1 | 通过 | `app/(app)/layout.tsx:1` | 由 AppShell 统一包裹 |
| L2 | 通过 | `app/(app)/accounts/[id]/page.tsx:75` | 根纵向 stack，无新增页面 padding |
| L3 | 不适用 | `app/(app)/accounts/[id]/page.tsx:75` | 非列表 |
| L4 | 通过 | `app/(app)/accounts/[id]/page.tsx:75` | 档案侧栏 + 主栏指标/Tab/资料 |
| L5 | 不适用 | `app/(app)/accounts/[id]/page.tsx:75` | 非 dashboard |
| L6 | 通过 | `app/(app)/accounts/[id]/page.tsx:75` | Kit 页头字号与间距，截图检查 |
| L7 | 通过 | `app/(app)/accounts/[id]/page.tsx:75` | 关联表百分比列配置；当前无同部门关联，视觉数据态未验证 |
| L8 | 通过 | `app/(app)/accounts/[id]/page.tsx:75` | DataTable 直接落 stack，无外层装饰白卡 |
| L9 | 通过 | `app/(app)/accounts/[id]/page.tsx:75` | Grid/GridItem 4+8，指标 Grid columns=3 |
| L10 | 通过 | `app/(app)/accounts/[id]/page.tsx:75` | 截图首屏底 gutter 可见；内容面内滚 |
| C1 | 通过 | `app/(app)/accounts/[id]/page.tsx:3` | UI 由 core 与既有宿主组合 |
| C2 | 不适用 | `app/(app)/accounts/[id]/page.tsx:3` | 详情嵌套表按 L7/L8 检查 |
| C3 | 通过 | `app/(app)/accounts/[id]/page.tsx:3` | 无 sortable:true 假排序 |
| C4 | 通过 | `app/(app)/accounts/[id]/page.tsx:3` | ConfirmationDialog 包 Modal |
| C5 | 通过 | `app/(app)/accounts/[id]/page.tsx:3` | 状态带明确中文文字 |
| C6 | 通过 | `app/(app)/accounts/[id]/page.tsx:3` | 迁移后的标题按钮接原 handler；实际点开弹窗 |
| C7 | 通过 | `app/(app)/accounts/[id]/page.tsx:3` | 组合 props 在 core 0.3.10 类型中仍支持；预设偏差见 H1 |
| C8 | 通过 | `app/(app)/accounts/[id]/page.tsx:3` | 组件真实导出，typecheck 通过 |
| C9 | 通过 | `app/(app)/accounts/[id]/page.tsx:3` | 详情从名称入口打开；保留原上下文；操作列仅编辑删除 |
| C10 | 通过 | `app/(app)/accounts/[id]/page.tsx:3` | 登录、部门启用与角色账号数含独立统计含义 |
| V1 | 通过 | `app/(app)/accounts/[id]/page.tsx:28` | fg token；危险图标沿用允许色 |
| V2 | 通过 | `app/(app)/accounts/[id]/page.tsx:28` | Breadcrumbs 和业务按钮跟 siteConfig.accent；删除语义 red |
| V3 | 通过 | `app/(app)/accounts/[id]/page.tsx:28` | 现有 solar 图标；PlusIcon 来自 Kit |
| V4 | 不适用 | `app/(app)/accounts/[id]/page.tsx:28` | 范围内无图表 |
| V5 | 通过 | `app/(app)/accounts/[id]/page.tsx:28` | 标题统一为 Kit PageTitleToolbar 字号 |
| V6 | 通过 | `app/(app)/accounts/[id]/page.tsx:28` | 状态为 soft StatusBadge；分类纯文字 |
| V7 | 通过 | `app/(app)/accounts/[id]/page.tsx:28` | 主文字黑；修正 RBAC 编码/路径副行和错误文字为 grey-700 |
| F1 | 通过 | `app/(app)/accounts/[id]/page.tsx:31` | 标题操作打开原 Modal 表单 |
| F2 | 通过 | `app/(app)/accounts/[id]/page.tsx:31` | 删除接确认卡，未执行删除 |
| F3 | 通过 | `components/account-form-dialog.tsx:220` | 关联表单已具字段 errorMessage，静态检查 |
| F4 | 通过 | `app/(app)/accounts/[id]/page.tsx:31` | 操作反馈沿用全站 toast |
| F5 | 通过 | `app/(app)/accounts/[id]/page.tsx:31` | 创建后动线沿用原 onCreated/onSaved；未提交新数据 |
| F6 | 通过 | `app/(app)/accounts/[id]/page.tsx:31` | 没有新增 Drawer/Sheet |
| D1 | 不适用 | `app/(app)/accounts/[id]/page.tsx:1` | 详情加载状态按 D2 检查 |
| D2 | 通过 | `app/(app)/accounts/[id]/page.tsx:1` | loading/error/not found 分支齐全 |
| D3 | 通过 | `app/(app)/accounts/[id]/page.tsx:1` | 沿用 service/API/store，本次未改持久化 |
| D4 | 通过 | `lib/db/schema.ts:1` | 业务表与 users 分离，schema未变 |
| D5 | 通过 | `app/(app)/accounts/[id]/page.tsx:1` | 列表筛选/搜索 query 原逻辑保留 |
| D6 | 通过 | `app/(app)/accounts/[id]/page.tsx:1` | 无新增敏感字段；模型详情使用 apiKeyMasked |
| E1 | 通过 | `app/(app)/accounts/[id]/page.tsx:1` | 沿用 page、独立 form-dialog、store、service 组织 |
| E2 | 通过 | `app/(app)/accounts/[id]/page.tsx:1` | 现有资源 API 使用 requirePermission/jsonOk/jsonError/Zod；未修改 |
| E3 | 通过 | `app/(app)/accounts/[id]/page.tsx:1` | 标题布局直接用 core，不再自定义 WithAsk 封装 |
| E4 | 通过 | `app/(app)/accounts/[id]/page.tsx:1` | use client 页面包含交互 |
| Q1 | 通过 | `package.json:15` | pnpm check 通过；ref 15 条历史警告 |
| Q2 | 通过 | `app/(app)/accounts/[id]/page.tsx:11` | 浏览器侧栏进入主页面，标题按钮点开并截图 |
| Q3 | 通过 | `app/(app)/accounts/[id]/page.tsx:11` | 按角色选 ref 与 CRM toolbar；结构偏差明确说明 |
| Q4 | 通过 | `app/(app)/accounts/[id]/page.tsx:11` | 浏览器 dev.logs warn/error 返回空，未见 overlay 错误 |

截图：`tmp/toolbar-review-20261010/account-detail.png`。

### roles

| 条目 | 状态 | 证据 | 处置/说明 |
|---|---|---|---|
| M1 | 通过 | `config/menu.tsx:22` | 菜单只挂模块入口 |
| M2 | 通过 | `config/menu.tsx:24` | 侧栏 BoldDuotone size=20 |
| M3 | 不适用 | `config/site.ts:19` | 本次未增加模块；已注册路由 hideHeader=true |
| M4 | 通过 | `config/menu.tsx:22` | 菜单地址均有业务路由 |
| M5 | 通过 | `config/menu.tsx:21` | 资料与改密走头像菜单 |
| M6 | 通过 | `config/menu.tsx:27` | 菜单尾斜杠统一 |
| R1 | 通过 | `app/(app)/roles/page.tsx:40` | 按页面角色保持骨架 |
| R2 | 通过 | `app/(app)/roles/page.tsx:40` | 原详情形态保留 |
| R3 | 通过 | `app/(app)/roles/page.tsx:40` | 新建编辑保留独立表单弹窗 |
| R4 | 通过 | `app/(app)/roles/page.tsx:40` | 原 create/edit/id 深链处理保留 |
| R5 | 不适用 | `app/(app)/roles/page.tsx:40` | 本次未修改兼容 redirect 路由 |
| H1 | 违规 | `app/(app)/roles/page.tsx:14` | 正文已使用 Kit，但仍用 legacy breadcrumbs/actions；core 预设无保活入口插槽，未满足 variant 要求 |
| H2 | 通过 | `app/(app)/roles/page.tsx:14` | Breadcrumbs 在标题组件内；祖先有 href、末项无 href |
| H3 | 不适用 | `app/(app)/roles/page.tsx:14` | 非动态详情路由 |
| H4 | 通过 | `app/(app)/roles/page.tsx:14` | 首层工作台 /dashboard/ |
| H5 | 不适用 | `app/(app)/roles/page.tsx:14` | 非全页详情 |
| H6 | 通过 | `app/(app)/roles/page.tsx:14` | 无页内 PageHeader、无双标题 |
| H7 | 通过 | `app/(app)/roles/page.tsx:14` | 状态归属由字段或表列明确 |
| L1 | 通过 | `app/(app)/layout.tsx:1` | 由 AppShell 统一包裹 |
| L2 | 通过 | `app/(app)/roles/page.tsx:143` | 根纵向 stack，无新增页面 padding |
| L3 | 通过 | `app/(app)/roles/page.tsx:143` | 页头后单条筛选搜索工具带 |
| L4 | 不适用 | `app/(app)/roles/page.tsx:143` | 非全页详情 |
| L5 | 不适用 | `app/(app)/roles/page.tsx:143` | 非 dashboard |
| L6 | 通过 | `app/(app)/roles/page.tsx:143` | Kit 页头字号与间距，截图检查 |
| L7 | 通过 | `app/(app)/roles/page.tsx:143` | 表列类型和日期操作宽度，截图检查 |
| L8 | 通过 | `app/(app)/roles/page.tsx:143` | DataTable 直接落 stack，无外层装饰白卡 |
| L9 | 不适用 | `app/(app)/roles/page.tsx:143` | 无页面级分栏或等宽卡组 |
| L10 | 通过 | `app/(app)/roles/page.tsx:143` | 截图首屏底 gutter 可见；内容面内滚 |
| C1 | 通过 | `app/(app)/roles/page.tsx:3` | UI 由 core 与既有宿主组合 |
| C2 | 通过 | `app/(app)/roles/page.tsx:3` | 列表用 DataTable |
| C3 | 通过 | `app/(app)/roles/page.tsx:3` | 无 sortable:true 假排序 |
| C4 | 通过 | `app/(app)/roles/page.tsx:3` | ConfirmationDialog 包 Modal |
| C5 | 通过 | `app/(app)/roles/page.tsx:3` | 状态带明确中文文字 |
| C6 | 通过 | `app/(app)/roles/page.tsx:3` | 迁移后的标题按钮接原 handler；实际点开弹窗 |
| C7 | 通过 | `app/(app)/roles/page.tsx:3` | 组合 props 在 core 0.3.10 类型中仍支持；预设偏差见 H1 |
| C8 | 通过 | `app/(app)/roles/page.tsx:3` | 组件真实导出，typecheck 通过 |
| C9 | 通过 | `app/(app)/roles/page.tsx:3` | 详情从名称入口打开；保留原上下文；操作列仅编辑删除 |
| C10 | 不适用 | `app/(app)/roles/page.tsx:3` | 非详情指标 |
| V1 | 通过 | `app/(app)/roles/page.tsx:28` | fg token；危险图标沿用允许色 |
| V2 | 通过 | `app/(app)/roles/page.tsx:28` | Breadcrumbs 和业务按钮跟 siteConfig.accent；删除语义 red |
| V3 | 通过 | `app/(app)/roles/page.tsx:28` | 现有 solar 图标；PlusIcon 来自 Kit |
| V4 | 不适用 | `app/(app)/roles/page.tsx:28` | 范围内无图表 |
| V5 | 通过 | `app/(app)/roles/page.tsx:28` | 标题统一为 Kit PageTitleToolbar 字号 |
| V6 | 通过 | `app/(app)/roles/page.tsx:28` | 状态为 soft StatusBadge；分类纯文字 |
| V7 | 通过 | `app/(app)/roles/page.tsx:28` | 主文字黑；修正 RBAC 编码/路径副行和错误文字为 grey-700 |
| F1 | 通过 | `app/(app)/roles/page.tsx:31` | 标题操作打开原 Modal 表单 |
| F2 | 通过 | `app/(app)/roles/page.tsx:31` | 删除接确认卡，未执行删除 |
| F3 | 通过 | `components/role-form-dialog.tsx:170` | 关联表单已具字段 errorMessage，静态检查 |
| F4 | 通过 | `app/(app)/roles/page.tsx:31` | 操作反馈沿用全站 toast |
| F5 | 通过 | `app/(app)/roles/page.tsx:31` | 创建后动线沿用原 onCreated/onSaved；未提交新数据 |
| F6 | 通过 | `app/(app)/roles/page.tsx:31` | 没有新增 Drawer/Sheet |
| D1 | 通过 | `app/(app)/roles/page.tsx:1` | 保留异步错误重试、加载、双空态 |
| D2 | 不适用 | `app/(app)/roles/page.tsx:1` | 非全页详情 |
| D3 | 通过 | `app/(app)/roles/page.tsx:1` | 沿用 service/API/store，本次未改持久化 |
| D4 | 通过 | `lib/db/schema.ts:1` | 业务表与 users 分离，schema未变 |
| D5 | 违规（判断项） | `app/(app)/roles/page.tsx:1` | 既有筛选搜索仍为 React state；本次保留，建议后续处理 |
| D6 | 通过 | `app/(app)/roles/page.tsx:1` | 无新增敏感字段；模型详情使用 apiKeyMasked |
| E1 | 通过 | `app/(app)/roles/page.tsx:1` | 沿用 page、独立 form-dialog、store、service 组织 |
| E2 | 通过 | `app/(app)/roles/page.tsx:1` | 现有资源 API 使用 requirePermission/jsonOk/jsonError/Zod；未修改 |
| E3 | 通过 | `app/(app)/roles/page.tsx:1` | 标题布局直接用 core，不再自定义 WithAsk 封装 |
| E4 | 通过 | `app/(app)/roles/page.tsx:1` | use client 页面包含交互 |
| Q1 | 通过 | `package.json:15` | pnpm check 通过；ref 15 条历史警告 |
| Q2 | 通过 | `app/(app)/roles/page.tsx:14` | 浏览器侧栏进入主页面，标题按钮点开并截图 |
| Q3 | 通过 | `app/(app)/roles/page.tsx:14` | 按角色选 ref 与 CRM toolbar；结构偏差明确说明 |
| Q4 | 通过 | `app/(app)/roles/page.tsx:14` | 浏览器 dev.logs warn/error 返回空，未见 overlay 错误 |

截图：`tmp/toolbar-review-20261010/roles.png`。

### menus

| 条目 | 状态 | 证据 | 处置/说明 |
|---|---|---|---|
| M1 | 通过 | `config/menu.tsx:22` | 菜单只挂模块入口 |
| M2 | 通过 | `config/menu.tsx:24` | 侧栏 BoldDuotone size=20 |
| M3 | 不适用 | `config/site.ts:19` | 本次未增加模块；已注册路由 hideHeader=true |
| M4 | 通过 | `config/menu.tsx:22` | 菜单地址均有业务路由 |
| M5 | 通过 | `config/menu.tsx:21` | 资料与改密走头像菜单 |
| M6 | 通过 | `config/menu.tsx:27` | 菜单尾斜杠统一 |
| R1 | 通过 | `app/(app)/menus/page.tsx:40` | 按页面角色保持骨架 |
| R2 | 通过 | `app/(app)/menus/page.tsx:40` | 原详情形态保留 |
| R3 | 通过 | `app/(app)/menus/page.tsx:40` | 新建编辑保留独立表单弹窗 |
| R4 | 通过 | `app/(app)/menus/page.tsx:40` | 原 create/edit/id 深链处理保留 |
| R5 | 不适用 | `app/(app)/menus/page.tsx:40` | 本次未修改兼容 redirect 路由 |
| H1 | 违规 | `app/(app)/menus/page.tsx:14` | 正文已使用 Kit，但仍用 legacy breadcrumbs/actions；core 预设无保活入口插槽，未满足 variant 要求 |
| H2 | 通过 | `app/(app)/menus/page.tsx:14` | Breadcrumbs 在标题组件内；祖先有 href、末项无 href |
| H3 | 不适用 | `app/(app)/menus/page.tsx:14` | 非动态详情路由 |
| H4 | 通过 | `app/(app)/menus/page.tsx:14` | 首层工作台 /dashboard/ |
| H5 | 不适用 | `app/(app)/menus/page.tsx:14` | 非全页详情 |
| H6 | 通过 | `app/(app)/menus/page.tsx:14` | 无页内 PageHeader、无双标题 |
| H7 | 通过 | `app/(app)/menus/page.tsx:14` | 状态归属由字段或表列明确 |
| L1 | 通过 | `app/(app)/layout.tsx:1` | 由 AppShell 统一包裹 |
| L2 | 通过 | `app/(app)/menus/page.tsx:144` | 根纵向 stack，无新增页面 padding |
| L3 | 通过 | `app/(app)/menus/page.tsx:144` | 页头后单条筛选搜索工具带 |
| L4 | 不适用 | `app/(app)/menus/page.tsx:144` | 非全页详情 |
| L5 | 不适用 | `app/(app)/menus/page.tsx:144` | 非 dashboard |
| L6 | 通过 | `app/(app)/menus/page.tsx:144` | Kit 页头字号与间距，截图检查 |
| L7 | 通过 | `app/(app)/menus/page.tsx:144` | 表列类型和日期操作宽度，截图检查 |
| L8 | 通过 | `app/(app)/menus/page.tsx:144` | DataTable 直接落 stack，无外层装饰白卡 |
| L9 | 不适用 | `app/(app)/menus/page.tsx:144` | 无页面级分栏或等宽卡组 |
| L10 | 通过 | `app/(app)/menus/page.tsx:144` | 截图首屏底 gutter 可见；内容面内滚 |
| C1 | 通过 | `app/(app)/menus/page.tsx:3` | UI 由 core 与既有宿主组合 |
| C2 | 通过 | `app/(app)/menus/page.tsx:3` | 列表用 DataTable |
| C3 | 通过 | `app/(app)/menus/page.tsx:3` | 无 sortable:true 假排序 |
| C4 | 通过 | `app/(app)/menus/page.tsx:3` | ConfirmationDialog 包 Modal |
| C5 | 通过 | `app/(app)/menus/page.tsx:3` | 状态带明确中文文字 |
| C6 | 通过 | `app/(app)/menus/page.tsx:3` | 迁移后的标题按钮接原 handler；实际点开弹窗 |
| C7 | 通过 | `app/(app)/menus/page.tsx:3` | 组合 props 在 core 0.3.10 类型中仍支持；预设偏差见 H1 |
| C8 | 通过 | `app/(app)/menus/page.tsx:3` | 组件真实导出，typecheck 通过 |
| C9 | 通过 | `app/(app)/menus/page.tsx:3` | 详情从名称入口打开；保留原上下文；操作列仅编辑删除 |
| C10 | 不适用 | `app/(app)/menus/page.tsx:3` | 非详情指标 |
| V1 | 通过 | `app/(app)/menus/page.tsx:28` | fg token；危险图标沿用允许色 |
| V2 | 通过 | `app/(app)/menus/page.tsx:28` | Breadcrumbs 和业务按钮跟 siteConfig.accent；删除语义 red |
| V3 | 通过 | `app/(app)/menus/page.tsx:28` | 现有 solar 图标；PlusIcon 来自 Kit |
| V4 | 不适用 | `app/(app)/menus/page.tsx:28` | 范围内无图表 |
| V5 | 通过 | `app/(app)/menus/page.tsx:28` | 标题统一为 Kit PageTitleToolbar 字号 |
| V6 | 通过 | `app/(app)/menus/page.tsx:28` | 状态为 soft StatusBadge；分类纯文字 |
| V7 | 通过 | `app/(app)/menus/page.tsx:28` | 主文字黑；修正 RBAC 编码/路径副行和错误文字为 grey-700 |
| F1 | 通过 | `app/(app)/menus/page.tsx:31` | 标题操作打开原 Modal 表单 |
| F2 | 通过 | `app/(app)/menus/page.tsx:31` | 删除接确认卡，未执行删除 |
| F3 | 通过 | `components/menu-form-dialog.tsx:183` | 关联表单已具字段 errorMessage，静态检查 |
| F4 | 通过 | `app/(app)/menus/page.tsx:31` | 操作反馈沿用全站 toast |
| F5 | 通过 | `app/(app)/menus/page.tsx:31` | 创建后动线沿用原 onCreated/onSaved；未提交新数据 |
| F6 | 通过 | `app/(app)/menus/page.tsx:31` | 没有新增 Drawer/Sheet |
| D1 | 通过 | `app/(app)/menus/page.tsx:1` | 保留异步错误重试、加载、双空态 |
| D2 | 不适用 | `app/(app)/menus/page.tsx:1` | 非全页详情 |
| D3 | 通过 | `app/(app)/menus/page.tsx:1` | 沿用 service/API/store，本次未改持久化 |
| D4 | 通过 | `lib/db/schema.ts:1` | 业务表与 users 分离，schema未变 |
| D5 | 违规（判断项） | `app/(app)/menus/page.tsx:1` | 既有筛选搜索仍为 React state；本次保留，建议后续处理 |
| D6 | 通过 | `app/(app)/menus/page.tsx:1` | 无新增敏感字段；模型详情使用 apiKeyMasked |
| E1 | 通过 | `app/(app)/menus/page.tsx:1` | 沿用 page、独立 form-dialog、store、service 组织 |
| E2 | 通过 | `app/(app)/menus/page.tsx:1` | 现有资源 API 使用 requirePermission/jsonOk/jsonError/Zod；未修改 |
| E3 | 通过 | `app/(app)/menus/page.tsx:1` | 标题布局直接用 core，不再自定义 WithAsk 封装 |
| E4 | 通过 | `app/(app)/menus/page.tsx:1` | use client 页面包含交互 |
| Q1 | 通过 | `package.json:15` | pnpm check 通过；ref 15 条历史警告 |
| Q2 | 通过 | `app/(app)/menus/page.tsx:14` | 浏览器侧栏进入主页面，标题按钮点开并截图 |
| Q3 | 通过 | `app/(app)/menus/page.tsx:14` | 按角色选 ref 与 CRM toolbar；结构偏差明确说明 |
| Q4 | 通过 | `app/(app)/menus/page.tsx:14` | 浏览器 dev.logs warn/error 返回空，未见 overlay 错误 |

截图：`tmp/toolbar-review-20261010/menus.png`。

### permissions

| 条目 | 状态 | 证据 | 处置/说明 |
|---|---|---|---|
| M1 | 通过 | `config/menu.tsx:22` | 菜单只挂模块入口 |
| M2 | 通过 | `config/menu.tsx:24` | 侧栏 BoldDuotone size=20 |
| M3 | 不适用 | `config/site.ts:19` | 本次未增加模块；已注册路由 hideHeader=true |
| M4 | 通过 | `config/menu.tsx:22` | 菜单地址均有业务路由 |
| M5 | 通过 | `config/menu.tsx:21` | 资料与改密走头像菜单 |
| M6 | 通过 | `config/menu.tsx:27` | 菜单尾斜杠统一 |
| R1 | 通过 | `app/(app)/permissions/page.tsx:42` | 按页面角色保持骨架 |
| R2 | 通过 | `app/(app)/permissions/page.tsx:42` | 原详情形态保留 |
| R3 | 通过 | `app/(app)/permissions/page.tsx:42` | 新建编辑保留独立表单弹窗 |
| R4 | 通过 | `app/(app)/permissions/page.tsx:42` | 原 create/edit/id 深链处理保留 |
| R5 | 不适用 | `app/(app)/permissions/page.tsx:42` | 本次未修改兼容 redirect 路由 |
| H1 | 违规 | `app/(app)/permissions/page.tsx:14` | 正文已使用 Kit，但仍用 legacy breadcrumbs/actions；core 预设无保活入口插槽，未满足 variant 要求 |
| H2 | 通过 | `app/(app)/permissions/page.tsx:14` | Breadcrumbs 在标题组件内；祖先有 href、末项无 href |
| H3 | 不适用 | `app/(app)/permissions/page.tsx:14` | 非动态详情路由 |
| H4 | 通过 | `app/(app)/permissions/page.tsx:14` | 首层工作台 /dashboard/ |
| H5 | 不适用 | `app/(app)/permissions/page.tsx:14` | 非全页详情 |
| H6 | 通过 | `app/(app)/permissions/page.tsx:14` | 无页内 PageHeader、无双标题 |
| H7 | 通过 | `app/(app)/permissions/page.tsx:14` | 状态归属由字段或表列明确 |
| L1 | 通过 | `app/(app)/layout.tsx:1` | 由 AppShell 统一包裹 |
| L2 | 通过 | `app/(app)/permissions/page.tsx:154` | 根纵向 stack，无新增页面 padding |
| L3 | 通过 | `app/(app)/permissions/page.tsx:154` | 页头后单条筛选搜索工具带 |
| L4 | 不适用 | `app/(app)/permissions/page.tsx:154` | 非全页详情 |
| L5 | 不适用 | `app/(app)/permissions/page.tsx:154` | 非 dashboard |
| L6 | 通过 | `app/(app)/permissions/page.tsx:154` | Kit 页头字号与间距，截图检查 |
| L7 | 通过 | `app/(app)/permissions/page.tsx:154` | 表列类型和日期操作宽度，截图检查 |
| L8 | 通过 | `app/(app)/permissions/page.tsx:154` | DataTable 直接落 stack，无外层装饰白卡 |
| L9 | 不适用 | `app/(app)/permissions/page.tsx:154` | 无页面级分栏或等宽卡组 |
| L10 | 通过 | `app/(app)/permissions/page.tsx:154` | 截图首屏底 gutter 可见；内容面内滚 |
| C1 | 通过 | `app/(app)/permissions/page.tsx:3` | UI 由 core 与既有宿主组合 |
| C2 | 通过 | `app/(app)/permissions/page.tsx:3` | 列表用 DataTable |
| C3 | 通过 | `app/(app)/permissions/page.tsx:3` | 无 sortable:true 假排序 |
| C4 | 通过 | `app/(app)/permissions/page.tsx:3` | ConfirmationDialog 包 Modal |
| C5 | 通过 | `app/(app)/permissions/page.tsx:3` | 状态带明确中文文字 |
| C6 | 通过 | `app/(app)/permissions/page.tsx:3` | 迁移后的标题按钮接原 handler；实际点开弹窗 |
| C7 | 通过 | `app/(app)/permissions/page.tsx:3` | 组合 props 在 core 0.3.10 类型中仍支持；预设偏差见 H1 |
| C8 | 通过 | `app/(app)/permissions/page.tsx:3` | 组件真实导出，typecheck 通过 |
| C9 | 通过 | `app/(app)/permissions/page.tsx:3` | 详情从名称入口打开；保留原上下文；操作列仅编辑删除 |
| C10 | 不适用 | `app/(app)/permissions/page.tsx:3` | 非详情指标 |
| V1 | 通过 | `app/(app)/permissions/page.tsx:27` | fg token；危险图标沿用允许色 |
| V2 | 通过 | `app/(app)/permissions/page.tsx:27` | Breadcrumbs 和业务按钮跟 siteConfig.accent；删除语义 red |
| V3 | 通过 | `app/(app)/permissions/page.tsx:27` | 现有 solar 图标；PlusIcon 来自 Kit |
| V4 | 不适用 | `app/(app)/permissions/page.tsx:27` | 范围内无图表 |
| V5 | 通过 | `app/(app)/permissions/page.tsx:27` | 标题统一为 Kit PageTitleToolbar 字号 |
| V6 | 通过 | `app/(app)/permissions/page.tsx:27` | 状态为 soft StatusBadge；分类纯文字 |
| V7 | 通过 | `app/(app)/permissions/page.tsx:27` | 主文字黑；修正 RBAC 编码/路径副行和错误文字为 grey-700 |
| F1 | 通过 | `app/(app)/permissions/page.tsx:30` | 标题操作打开原 Modal 表单 |
| F2 | 通过 | `app/(app)/permissions/page.tsx:30` | 删除接确认卡，未执行删除 |
| F3 | 通过 | `components/permission-form-dialog.tsx:179` | 关联表单已具字段 errorMessage，静态检查 |
| F4 | 通过 | `app/(app)/permissions/page.tsx:30` | 操作反馈沿用全站 toast |
| F5 | 通过 | `app/(app)/permissions/page.tsx:30` | 创建后动线沿用原 onCreated/onSaved；未提交新数据 |
| F6 | 通过 | `app/(app)/permissions/page.tsx:30` | 没有新增 Drawer/Sheet |
| D1 | 通过 | `app/(app)/permissions/page.tsx:1` | 保留异步错误重试、加载、双空态 |
| D2 | 不适用 | `app/(app)/permissions/page.tsx:1` | 非全页详情 |
| D3 | 通过 | `app/(app)/permissions/page.tsx:1` | 沿用 service/API/store，本次未改持久化 |
| D4 | 通过 | `lib/db/schema.ts:1` | 业务表与 users 分离，schema未变 |
| D5 | 违规（判断项） | `app/(app)/permissions/page.tsx:1` | 既有筛选搜索仍为 React state；本次保留，建议后续处理 |
| D6 | 通过 | `app/(app)/permissions/page.tsx:1` | 无新增敏感字段；模型详情使用 apiKeyMasked |
| E1 | 通过 | `app/(app)/permissions/page.tsx:1` | 沿用 page、独立 form-dialog、store、service 组织 |
| E2 | 通过 | `app/(app)/permissions/page.tsx:1` | 现有资源 API 使用 requirePermission/jsonOk/jsonError/Zod；未修改 |
| E3 | 通过 | `app/(app)/permissions/page.tsx:1` | 标题布局直接用 core，不再自定义 WithAsk 封装 |
| E4 | 通过 | `app/(app)/permissions/page.tsx:1` | use client 页面包含交互 |
| Q1 | 通过 | `package.json:15` | pnpm check 通过；ref 15 条历史警告 |
| Q2 | 通过 | `app/(app)/permissions/page.tsx:14` | 浏览器侧栏进入主页面，标题按钮点开并截图 |
| Q3 | 通过 | `app/(app)/permissions/page.tsx:14` | 按角色选 ref 与 CRM toolbar；结构偏差明确说明 |
| Q4 | 通过 | `app/(app)/permissions/page.tsx:14` | 浏览器 dev.logs warn/error 返回空，未见 overlay 错误 |

截图：`tmp/toolbar-review-20261010/permissions.png`。

### models

| 条目 | 状态 | 证据 | 处置/说明 |
|---|---|---|---|
| M1 | 通过 | `config/menu.tsx:22` | 菜单只挂模块入口 |
| M2 | 通过 | `config/menu.tsx:24` | 侧栏 BoldDuotone size=20 |
| M3 | 不适用 | `config/site.ts:19` | 本次未增加模块；已注册路由 hideHeader=true |
| M4 | 通过 | `config/menu.tsx:22` | 菜单地址均有业务路由 |
| M5 | 通过 | `config/menu.tsx:21` | 资料与改密走头像菜单 |
| M6 | 通过 | `config/menu.tsx:27` | 菜单尾斜杠统一 |
| R1 | 通过 | `app/(app)/models/page.tsx:41` | 按页面角色保持骨架 |
| R2 | 通过 | `app/(app)/models/page.tsx:41` | 原详情形态保留 |
| R3 | 通过 | `app/(app)/models/page.tsx:41` | 新建编辑保留独立表单弹窗 |
| R4 | 通过 | `app/(app)/models/page.tsx:41` | 原 create/edit/id 深链处理保留 |
| R5 | 不适用 | `app/(app)/models/page.tsx:41` | 本次未修改兼容 redirect 路由 |
| H1 | 违规 | `app/(app)/models/page.tsx:17` | 正文已使用 Kit，但仍用 legacy breadcrumbs/actions；core 预设无保活入口插槽，未满足 variant 要求 |
| H2 | 通过 | `app/(app)/models/page.tsx:17` | Breadcrumbs 在标题组件内；祖先有 href、末项无 href |
| H3 | 不适用 | `app/(app)/models/page.tsx:17` | 非动态详情路由 |
| H4 | 通过 | `app/(app)/models/page.tsx:17` | 首层工作台 /dashboard/ |
| H5 | 不适用 | `app/(app)/models/page.tsx:17` | 非全页详情 |
| H6 | 通过 | `app/(app)/models/page.tsx:17` | 无页内 PageHeader、无双标题 |
| H7 | 通过 | `app/(app)/models/page.tsx:17` | 状态归属由字段或表列明确 |
| L1 | 通过 | `app/(app)/layout.tsx:1` | 由 AppShell 统一包裹 |
| L2 | 通过 | `app/(app)/models/page.tsx:70` | 根纵向 stack，无新增页面 padding |
| L3 | 通过 | `app/(app)/models/page.tsx:70` | 页头后单条筛选搜索工具带 |
| L4 | 不适用 | `app/(app)/models/page.tsx:70` | 非全页详情 |
| L5 | 不适用 | `app/(app)/models/page.tsx:70` | 非 dashboard |
| L6 | 通过 | `app/(app)/models/page.tsx:70` | Kit 页头字号与间距，截图检查 |
| L7 | 不适用 | `app/(app)/models/page.tsx:70` | 资源卡片工作台，无 DataTable |
| L8 | 不适用 | `app/(app)/models/page.tsx:70` | 资源卡片工作台，无 DataTable |
| L9 | 通过 | `app/(app)/models/page.tsx:70` | WorkspaceSplit + FolderNav + Grid 模型卡组 |
| L10 | 通过 | `app/(app)/models/page.tsx:70` | 截图首屏底 gutter 可见；内容面内滚 |
| C1 | 通过 | `app/(app)/models/page.tsx:3` | UI 由 core 与既有宿主组合 |
| C2 | 不适用 | `app/(app)/models/page.tsx:3` | 资源卡片工作台，无 DataTable |
| C3 | 通过 | `app/(app)/models/page.tsx:3` | 无 sortable:true 假排序 |
| C4 | 通过 | `app/(app)/models/page.tsx:3` | ConfirmationDialog 包 Modal |
| C5 | 通过 | `app/(app)/models/page.tsx:3` | 状态带明确中文文字 |
| C6 | 通过 | `app/(app)/models/page.tsx:3` | 迁移后的标题按钮接原 handler；实际点开弹窗 |
| C7 | 通过 | `app/(app)/models/page.tsx:3` | 组合 props 在 core 0.3.10 类型中仍支持；预设偏差见 H1 |
| C8 | 通过 | `app/(app)/models/page.tsx:3` | 组件真实导出，typecheck 通过 |
| C9 | 通过 | `app/(app)/models/page.tsx:3` | 详情从名称入口打开；保留原上下文；操作列仅编辑删除 |
| C10 | 不适用 | `app/(app)/models/page.tsx:3` | 非详情指标 |
| V1 | 通过 | `app/(app)/models/page.tsx:27` | fg token；危险图标沿用允许色 |
| V2 | 通过 | `app/(app)/models/page.tsx:27` | Breadcrumbs 和业务按钮跟 siteConfig.accent；删除语义 red |
| V3 | 通过 | `app/(app)/models/page.tsx:27` | 现有 solar 图标；PlusIcon 来自 Kit |
| V4 | 不适用 | `app/(app)/models/page.tsx:27` | 范围内无图表 |
| V5 | 通过 | `app/(app)/models/page.tsx:27` | 标题统一为 Kit PageTitleToolbar 字号 |
| V6 | 通过 | `app/(app)/models/page.tsx:27` | 状态为 soft StatusBadge；分类纯文字 |
| V7 | 通过 | `app/(app)/models/page.tsx:27` | 主文字黑；修正 RBAC 编码/路径副行和错误文字为 grey-700 |
| F1 | 通过 | `app/(app)/models/page.tsx:32` | 标题操作打开原 Modal 表单 |
| F2 | 通过 | `app/(app)/models/page.tsx:32` | 删除接确认卡，未执行删除 |
| F3 | 通过 | `components/model-form-dialog.tsx:197` | 关联表单已具字段 errorMessage，静态检查 |
| F4 | 通过 | `app/(app)/models/page.tsx:32` | 操作反馈沿用全站 toast |
| F5 | 通过 | `app/(app)/models/page.tsx:32` | 创建后动线沿用原 onCreated/onSaved；未提交新数据 |
| F6 | 通过 | `app/(app)/models/page.tsx:32` | 没有新增 Drawer/Sheet |
| D1 | 通过 | `app/(app)/models/page.tsx:1` | 保留异步错误重试、加载、双空态 |
| D2 | 不适用 | `app/(app)/models/page.tsx:1` | 非全页详情 |
| D3 | 通过 | `app/(app)/models/page.tsx:1` | 沿用 service/API/store，本次未改持久化 |
| D4 | 通过 | `lib/db/schema.ts:1` | 业务表与 users 分离，schema未变 |
| D5 | 违规（判断项） | `app/(app)/models/page.tsx:1` | 既有筛选搜索仍为 React state；本次保留，建议后续处理 |
| D6 | 通过 | `app/(app)/models/page.tsx:1` | 无新增敏感字段；模型详情使用 apiKeyMasked |
| E1 | 通过 | `app/(app)/models/page.tsx:1` | 沿用 page、独立 form-dialog、store、service 组织 |
| E2 | 通过 | `app/(app)/models/page.tsx:1` | 现有资源 API 使用 requirePermission/jsonOk/jsonError/Zod；未修改 |
| E3 | 通过 | `app/(app)/models/page.tsx:1` | 标题布局直接用 core，不再自定义 WithAsk 封装 |
| E4 | 通过 | `app/(app)/models/page.tsx:1` | use client 页面包含交互 |
| Q1 | 通过 | `package.json:15` | pnpm check 通过；ref 15 条历史警告 |
| Q2 | 通过 | `app/(app)/models/page.tsx:17` | 浏览器侧栏进入主页面，标题按钮点开并截图 |
| Q3 | 通过 | `app/(app)/models/page.tsx:17` | 按角色选 ref 与 CRM toolbar；结构偏差明确说明 |
| Q4 | 通过 | `app/(app)/models/page.tsx:17` | 浏览器 dev.logs warn/error 返回空，未见 overlay 错误 |

截图：`tmp/toolbar-review-20261010/models.png`。

### settings/apps

| 条目 | 状态 | 证据 | 处置/说明 |
|---|---|---|---|
| M1 | 通过 | `config/menu.tsx:22` | 菜单只挂模块入口 |
| M2 | 通过 | `config/menu.tsx:24` | 侧栏 BoldDuotone size=20 |
| M3 | 不适用 | `config/site.ts:19` | 本次未增加模块；已注册路由 hideHeader=true |
| M4 | 通过 | `config/menu.tsx:22` | 菜单地址均有业务路由 |
| M5 | 通过 | `config/menu.tsx:21` | 资料与改密走头像菜单 |
| M6 | 通过 | `config/menu.tsx:27` | 菜单尾斜杠统一 |
| R1 | 通过 | `app/(app)/settings/apps/page.tsx:55` | 按页面角色保持骨架 |
| R2 | 通过 | `app/(app)/settings/apps/page.tsx:55` | 原详情形态保留 |
| R3 | 通过 | `app/(app)/settings/apps/page.tsx:55` | 新建编辑保留独立表单弹窗 |
| R4 | 通过 | `app/(app)/settings/apps/page.tsx:55` | 原 create/edit/id 深链处理保留 |
| R5 | 不适用 | `app/(app)/settings/apps/page.tsx:55` | 本次未修改兼容 redirect 路由 |
| H1 | 违规 | `app/(app)/settings/apps/page.tsx:22` | 正文已使用 Kit，但仍用 legacy breadcrumbs/actions；core 预设无保活入口插槽，未满足 variant 要求 |
| H2 | 通过 | `app/(app)/settings/apps/page.tsx:22` | Breadcrumbs 在标题组件内；祖先有 href、末项无 href |
| H3 | 不适用 | `app/(app)/settings/apps/page.tsx:22` | 非动态详情路由 |
| H4 | 通过 | `app/(app)/settings/apps/page.tsx:22` | 首层工作台 /dashboard/ |
| H5 | 不适用 | `app/(app)/settings/apps/page.tsx:22` | 非全页详情 |
| H6 | 通过 | `app/(app)/settings/apps/page.tsx:22` | 无页内 PageHeader、无双标题 |
| H7 | 通过 | `app/(app)/settings/apps/page.tsx:22` | 状态归属由字段或表列明确 |
| L1 | 通过 | `app/(app)/layout.tsx:1` | 由 AppShell 统一包裹 |
| L2 | 通过 | `app/(app)/settings/apps/page.tsx:146` | 根纵向 stack，无新增页面 padding |
| L3 | 通过 | `app/(app)/settings/apps/page.tsx:146` | 页头后单条筛选搜索工具带 |
| L4 | 不适用 | `app/(app)/settings/apps/page.tsx:146` | 非全页详情 |
| L5 | 不适用 | `app/(app)/settings/apps/page.tsx:146` | 非 dashboard |
| L6 | 通过 | `app/(app)/settings/apps/page.tsx:146` | Kit 页头字号与间距，截图检查 |
| L7 | 通过 | `app/(app)/settings/apps/page.tsx:146` | 表列类型和日期操作宽度，截图检查 |
| L8 | 通过 | `app/(app)/settings/apps/page.tsx:146` | DataTable 直接落 stack，无外层装饰白卡 |
| L9 | 不适用 | `app/(app)/settings/apps/page.tsx:146` | 无页面级分栏或等宽卡组 |
| L10 | 通过 | `app/(app)/settings/apps/page.tsx:146` | 截图首屏底 gutter 可见；内容面内滚 |
| C1 | 通过 | `app/(app)/settings/apps/page.tsx:3` | UI 由 core 与既有宿主组合 |
| C2 | 通过 | `app/(app)/settings/apps/page.tsx:3` | 列表用 DataTable |
| C3 | 通过 | `app/(app)/settings/apps/page.tsx:3` | 无 sortable:true 假排序 |
| C4 | 通过 | `app/(app)/settings/apps/page.tsx:3` | ConfirmationDialog 包 Modal |
| C5 | 通过 | `app/(app)/settings/apps/page.tsx:3` | 状态带明确中文文字 |
| C6 | 通过 | `app/(app)/settings/apps/page.tsx:3` | 迁移后的标题按钮接原 handler；实际点开弹窗 |
| C7 | 通过 | `app/(app)/settings/apps/page.tsx:3` | 组合 props 在 core 0.3.10 类型中仍支持；预设偏差见 H1 |
| C8 | 通过 | `app/(app)/settings/apps/page.tsx:3` | 组件真实导出，typecheck 通过 |
| C9 | 通过 | `app/(app)/settings/apps/page.tsx:3` | 详情从名称入口打开；保留原上下文；操作列仅编辑删除 |
| C10 | 不适用 | `app/(app)/settings/apps/page.tsx:3` | 非详情指标 |
| V1 | 通过 | `app/(app)/settings/apps/page.tsx:34` | fg token；危险图标沿用允许色 |
| V2 | 通过 | `app/(app)/settings/apps/page.tsx:34` | Breadcrumbs 和业务按钮跟 siteConfig.accent；删除语义 red |
| V3 | 通过 | `app/(app)/settings/apps/page.tsx:34` | 现有 solar 图标；PlusIcon 来自 Kit |
| V4 | 不适用 | `app/(app)/settings/apps/page.tsx:34` | 范围内无图表 |
| V5 | 通过 | `app/(app)/settings/apps/page.tsx:34` | 标题统一为 Kit PageTitleToolbar 字号 |
| V6 | 通过 | `app/(app)/settings/apps/page.tsx:34` | 状态为 soft StatusBadge；分类纯文字 |
| V7 | 通过 | `app/(app)/settings/apps/page.tsx:34` | 主文字黑；修正 RBAC 编码/路径副行和错误文字为 grey-700 |
| F1 | 通过 | `app/(app)/settings/apps/page.tsx:44` | 标题操作打开原 Modal 表单 |
| F2 | 通过 | `app/(app)/settings/apps/page.tsx:44` | 删除接确认卡，未执行删除 |
| F3 | 通过 | `components/app-form-dialog.tsx:193` | 关联表单已具字段 errorMessage，静态检查 |
| F4 | 通过 | `app/(app)/settings/apps/page.tsx:44` | 操作反馈沿用全站 toast |
| F5 | 通过 | `app/(app)/settings/apps/page.tsx:44` | 创建后动线沿用原 onCreated/onSaved；未提交新数据 |
| F6 | 通过 | `app/(app)/settings/apps/page.tsx:44` | 没有新增 Drawer/Sheet |
| D1 | 通过 | `app/(app)/settings/apps/page.tsx:1` | 同步 registry 双空态；异步库加载不适用 |
| D2 | 不适用 | `app/(app)/settings/apps/page.tsx:1` | 非全页详情 |
| D3 | 通过 | `app/(app)/settings/apps/page.tsx:1` | 产品明确应用登记保存浏览器 registry；未冒充业务落库 |
| D4 | 不适用 | `lib/db/schema.ts:1` | 应用登记 localStorage，无新增业务表/API |
| D5 | 通过 | `app/(app)/settings/apps/page.tsx:1` | 列表筛选/搜索 query 原逻辑保留 |
| D6 | 通过 | `app/(app)/settings/apps/page.tsx:1` | 无新增敏感字段；模型详情使用 apiKeyMasked |
| E1 | 通过 | `app/(app)/settings/apps/page.tsx:1` | 沿用 page、独立 form-dialog、store、service 组织 |
| E2 | 不适用 | `app/(app)/settings/apps/page.tsx:1` | 应用登记 localStorage，无新增业务表/API |
| E3 | 通过 | `app/(app)/settings/apps/page.tsx:1` | 标题布局直接用 core，不再自定义 WithAsk 封装 |
| E4 | 通过 | `app/(app)/settings/apps/page.tsx:1` | use client 页面包含交互 |
| Q1 | 通过 | `package.json:15` | pnpm check 通过；ref 15 条历史警告 |
| Q2 | 通过 | `app/(app)/settings/apps/page.tsx:22` | 浏览器侧栏进入主页面，标题按钮点开并截图 |
| Q3 | 通过 | `app/(app)/settings/apps/page.tsx:22` | 按角色选 ref 与 CRM toolbar；结构偏差明确说明 |
| Q4 | 通过 | `app/(app)/settings/apps/page.tsx:22` | 浏览器 dev.logs warn/error 返回空，未见 overlay 错误 |

截图：`tmp/toolbar-review-20261010/apps.png`。

## 重验记录

- pnpm check：2026-10-10 再次通过，ref 历史颜色警告 15 条。
- git diff --check：通过。
- 七页均从侧栏点击进入（账号详情从名称按钮）；各新建按钮、详情编辑和删除确认均实际打开，随后取消。
- Ask AI：账号页输入草稿，跳账号详情再切角色页，打开助手草稿仍存在；验证后清空。
- desktop 1440×900、mobile 375×812：账号页头可见，移动端动作换行；截图留档。
- 浏览器检查 warn/error 日志为空。
- 同部门关联数据态未执行，已在模块 L7 中注明。
- 浏览器优先尝试现有 Chrome；插件失败与用户操作中断后采用内置浏览器，未启动系统 Chrome 新进程或新 profile。
