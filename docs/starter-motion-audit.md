# Starter Core 动效接入与审计 · 2026-09-29

范围仅本轮动效：账号详情、Ask AI 两处 Button、公共 Modal / Toast 宿主。其余工作区改动不在本轮范围。Core 已安装 0.3.1，不升级依赖。

## 对照物与分批审计

1. 账号详情：detail / chrome A；主对照 Forge project-template/members/[id]；case tab、grid、table。完整清单如下，沿用未变结构的上轮证据，新增内容容器 P:208 与 P:243。
2. 公共弹窗/反馈：form-modal / 无页面 chrome；对照本仓 account-form-dialog、Core modal、toast 和 internal motion。保留宿主 API、560px 宽度、720px 高度上限、正文内滚与固定底栏。
3. Ask AI：对话交互组件 / 无独立 chrome；对照 /ref/agent 与 Core Button。仅删除两处 motion="none"，业务协议、按钮回调和布局未改。

## S → O → N → C

| 层 | 账号详情 | 公共宿主 | Ask AI |
| --- | --- | --- | --- |
| S | 页头、双栏、摘要、Tab、内容 | 原表单头、正文、底栏 | 原状态、处理记录、选择与确认 |
| O | AppShell 面内滚不变 | 原 fixed 遮罩 z50，Toast z100 | Kit AskAi 原有宿主 |
| N | TabsContent 包当前分区；表无卡壳 | 仅 dialog 内容加 Core surface 动画，退出后卸载 | 未新增区块 |
| C | TabBar + TabsContent | Core ToastProvider/useToast；Modal 用 Core motion class | Button 恢复默认 auto |

## 已支持组件的覆盖

读取已安装 d.ts 与同版本 Core 源码，AppLayout、Button、IconButton、TabBar、ButtonGroup、Accordion、SidebarMenu、MenuItem、DropdownPanel、KebabMenu、Tooltip、Checkbox、Checklist、Toolbar 选择器/标签、SelectOption、TextFieldSelect、SelectionControl 的 motion 默认 auto。无需逐个重复传参。Starter app/components 已无 motion="none"。

- 账号详情内容使用 TabsContent（切换触发入场，表单状态不在其内部）。
- Modal 复用 forge-motion-surface / data-state，按 Core exit token 保留卸载时长；退出阶段 inert + aria-hidden。系统 reduce 时 CSS 禁用动画，卸载计时为零。
- 保留现有 Modal 宿主：Core native dialog 位于 top layer，会遮住 body portal 的 Toast；兼容宿主维持同一层级，避免回归。未引入第三方动画库。
- Toast 从原全局 bus 桥接到 Core；保留 clear/dismiss/默认时长和四条上限。展示统一 Core 白底样式，以“操作成功/操作失败/提示”文字保留原 tone 语义。

## 账号详情逐项清单

P = app/(app)/accounts/[id]/page.tsx。除 TabsContent 外，结构证据继承 account-detail-template-audit.md 最终“移除备注”状态；旧行号仅作源位置索引。

| ID | 结果 | 证据 | 处置/说明 |
| --- | --- | --- | --- |
| M1 | 不适用 | P:45 | 未修改菜单 |
| M2 | 不适用 | P:7 | 无菜单图标变更 |
| M3 | 不适用 | P:45 | 原 accounts 详情路由，不新增模块 |
| M4 | 通过 | P:54,96,147 | 仅真实账号/列表/工作台链接 |
| M5 | 不适用 | P:45 | 导航分组不变 |
| M6 | 通过 | P:54,96,150 | 保留尾斜杠 |
| R1 | 通过 | P:171 | profile 全页详情，元信息+业务分区 |
| R2 | 通过 | P:45 | 保留用户指定的全页详情 |
| R3 | 通过 | P:104 | 编辑仍为现有弹窗 |
| R4 | 不适用 | P:104 | 未增加/修改表单深链；既有列表 edit query 保留 |
| R5 | 不适用 | P:45 | 无 redirect 文件改动 |
| H1 | 通过 | P:138 | A 页头且仅一套 |
| H2 | 通过 | P:147 | core Breadcrumbs，末项无 href |
| H3 | 通过 | P:152 | 当前实体姓名，含账号管理祖先 |
| H4 | 通过 | P:150 | 首层工作台 |
| H5 | 通过 | P:54,151 | 面包屑返回且保留筛选，不在侧栏塞返回 |
| H6 | 通过 | P:8 | 没有 PageHeader |
| H7 | 通过 | P:141,98 | 页头状态紧邻姓名；表内有状态列头 |
| L1 | 通过 | P:138 | 使用既有 AppShell；aside 是账号档案非导航 |
| L2 | 通过 | P:138 | 根 flex stack，不加 padding |
| L3 | 不适用 | P:45 | 详情页非 collection |
| L4 | 通过 | P:171 | 按成员详情主次分栏与 Tab 骨架 |
| L5 | 不适用 | P:45 | 非 dashboard |
| L6 | 通过 | P:174,202,216 | rounded-card、16/24 间距；卡片按行等高；截图核对 |
| L7 | 通过 | P:95,236 | 列宽 45/20/15/20，tableMinWidth=640，窄屏表内横滚；末列日期可见 |
| L8 | 通过 | P:234 | 表直接放节 stack；正文资料使用卡壳，备注已移除 |
| L9 | 通过 | P:172,202 | 主次栏 Grid span；等宽摘要用 columns；375/768/1024/1440 检查 |
| L10 | 通过 | P:138 | 桌面 body 高度等于视口，内容面内滚、右/底 gutter 可见 |
| C1 | 通过 | P:8 | UI 来自 core；Modal/Toast 为本仓既有封装 |
| C2 | 通过 | P:236 | 关联表使用 DataTable，无手写 table |
| C3 | 通过 | P:95 | 无未实现 sortable |
| C4 | 通过 | P:111 | ConfirmationDialog 包在 Modal |
| C5 | 通过 | P:98,145 | 状态有中文文字 |
| C6 | 通过 | P:38,96,157,212,194 | 复制、导航、编辑、Tab 均真实处理；本轮新增 TabsContent |
| C7 | 通过 | P:202,212,236 | 按已安装 d.ts 修正 Button variant 与 tableMinWidth；类型检查通过 |
| C8 | 通过 | P:8 | 所有 import 均已安装导出 |
| C9 | 通过 | P:96 | 姓名单元格按钮支持 Enter；无重复眼睛/箭头；保留 returnTo |
| C10 | 通过 | P:93,202 | 登录累计、部门启用数、全局同角色数为独立真实统计；不复制模板趋势；与“同部门其他账号”数量不同口径 |
| V1 | 通过 | P:174 | fg token；white 沿用模板中性底；危险图标使用规范白名单 |
| V2 | 通过 | P:148,158,212,236 | 业务控件 siteConfig.accent；删除保留语义 red |
| V3 | 通过 | P:7 | solar-icon-set |
| V4 | 不适用 | P:202 | 无图表，无虚构趋势 |
| V5 | 通过 | P:142 | A 标题 text-display-l |
| V6 | 通过 | P:98,145 | 默认 soft StatusBadge；角色/部门纯文本；表一列状态 |
| V7 | 通过 | P:178,219,196 | 姓名、标题、字段值黑色，辅助 grey-700，空态 grey-500 |
| F1 | 通过 | P:104 | 继续使用 AccountFormDialog，浏览器打开核验 |
| F2 | 通过 | P:111 | 删除先确认；本轮只验证取消，未删除业务数据 |
| F3 | 不适用 | P:104 | 表单字段与校验逻辑本轮未修改 |
| F4 | 通过 | P:36,40,127 | 全站 toast，无页面成功条 |
| F5 | 不适用 | P:104 | 未修改新建成功动线 |
| F6 | 通过 | P:30 | 无新增 Drawer/Sheet |
| D1 | 通过 | P:75,236 | 无账号时加载失败可重试；同部门无其他账号有空态；无筛选故不加虚构清除按钮 |
| D2 | 通过 | P:71,79 | 加载/不存在两态保留，错误另行处理 |
| D3 | 通过 | P:56 | 沿用 store/API；统计基于真实 accounts |
| D4 | 通过 | P:56 | 使用业务账号 store；不混登录 users 或伪造权限关联 |
| D5 | 通过 | P:54,96 | 返回列表保留 query；详情 Tab 为临时展示态 |
| D6 | 通过 | P:174 | 无密码、token 或模型凭证 |
| E1 | 通过 | P:45 | 页面仅展示/交互；store、form、service 独立 |
| E2 | 不适用 | P:56 | 未修改 API |
| E3 | 通过 | P:202 | 重复摘要 map 复用 StatCard；无新过度抽象 |
| E4 | 通过 | P:1,62 | client 页面含交互 |
| Q1 | 通过 | /tmp/forge-motion-check.log | pnpm check 通过；15 条既有 /ref 警告 |
| Q2 | 通过 | 下方浏览器记录 | 稳定 Chrome 实点主路径，motion-modal.png / motion-tabs.png |
| Q3 | 通过 | 本文对照物及分层记录 | 对比三个模板，采用成员详情；数据差异已说明 |
| Q4 | 通过 | Chrome dev.logs | 刷新后 error/warn=[]；无 Next 错误覆盖层 |


## 公共宿主与 Ask AI 逐项清单

M=components/ui/modal.tsx；T=components/ui/toast-provider.tsx；A=components/ask-ai-harness.tsx。按模块分别判断；不涉及业务页面骨架的条目标不适用。

| ID | 公共宿主 | Ask AI | 证据 / 处置 |
| --- | --- | --- | --- |
| M1 | 不适用 | 不适用 | 本轮不修改此项对应的菜单/页面/数据/API职责 |
| M2 | 不适用 | 不适用 | 本轮不修改此项对应的菜单/页面/数据/API职责 |
| M3 | 不适用 | 不适用 | 本轮不修改此项对应的菜单/页面/数据/API职责 |
| M4 | 不适用 | 不适用 | 本轮不修改此项对应的菜单/页面/数据/API职责 |
| M5 | 不适用 | 不适用 | 本轮不修改此项对应的菜单/页面/数据/API职责 |
| M6 | 不适用 | 不适用 | 本轮不修改此项对应的菜单/页面/数据/API职责 |
| R1 | 通过 | 通过 | M:9 form-modal；A:35 对话内交互 |
| R2 | 不适用 | 不适用 | 本轮不修改此项对应的菜单/页面/数据/API职责 |
| R3 | 通过 | 不适用 | M:9 保留弹窗，未新增独立表单页 |
| R4 | 不适用 | 不适用 | 本轮不修改此项对应的菜单/页面/数据/API职责 |
| R5 | 不适用 | 不适用 | 本轮不修改此项对应的菜单/页面/数据/API职责 |
| H1 | 不适用 | 不适用 | 本轮不修改此项对应的菜单/页面/数据/API职责 |
| H2 | 不适用 | 不适用 | 本轮不修改此项对应的菜单/页面/数据/API职责 |
| H3 | 不适用 | 不适用 | 本轮不修改此项对应的菜单/页面/数据/API职责 |
| H4 | 不适用 | 不适用 | 本轮不修改此项对应的菜单/页面/数据/API职责 |
| H5 | 不适用 | 不适用 | 本轮不修改此项对应的菜单/页面/数据/API职责 |
| H6 | 不适用 | 不适用 | 本轮不修改此项对应的菜单/页面/数据/API职责 |
| H7 | 不适用 | 不适用 | 本轮不修改此项对应的菜单/页面/数据/API职责 |
| L1 | 不适用 | 不适用 | 本轮不修改此项对应的菜单/页面/数据/API职责 |
| L2 | 不适用 | 不适用 | 本轮不修改此项对应的菜单/页面/数据/API职责 |
| L3 | 不适用 | 不适用 | 本轮不修改此项对应的菜单/页面/数据/API职责 |
| L4 | 不适用 | 不适用 | 本轮不修改此项对应的菜单/页面/数据/API职责 |
| L5 | 不适用 | 不适用 | 本轮不修改此项对应的菜单/页面/数据/API职责 |
| L6 | 通过 | 通过 | M:59 保留宽度/高度/间距；A:40,65 只恢复动效 |
| L7 | 不适用 | 不适用 | 本轮不修改此项对应的菜单/页面/数据/API职责 |
| L8 | 不适用 | 不适用 | 本轮不修改此项对应的菜单/页面/数据/API职责 |
| L9 | 不适用 | 不适用 | 本轮不修改此项对应的菜单/页面/数据/API职责 |
| L10 | 不适用 | 不适用 | 本轮不修改此项对应的菜单/页面/数据/API职责 |
| C1 | 通过 | 通过 | M:4 / T:4 / A:4 Core 与现有宿主 |
| C2 | 不适用 | 不适用 | 本轮不修改此项对应的菜单/页面/数据/API职责 |
| C3 | 不适用 | 不适用 | 本轮不修改此项对应的菜单/页面/数据/API职责 |
| C4 | 通过 | 不适用 | 账号删除 ConfirmationDialog 仍由 M 承载 |
| C5 | 通过 | 通过 | T:7 成功/失败文字；A:38 本次任务状态文字 |
| C6 | 通过 | 通过 | M:50 关闭；T:14 bus；A:48,68 回调不变 |
| C7 | 通过 | 通过 | T:21 Core toast 参数；A 默认 auto |
| C8 | 通过 | 通过 | 安装版本 d.ts 验证 ToastProvider/useToast/TabsContent 导出 |
| C9 | 不适用 | 不适用 | 本轮不修改此项对应的菜单/页面/数据/API职责 |
| C10 | 不适用 | 不适用 | 本轮不修改此项对应的菜单/页面/数据/API职责 |
| V1 | 通过 | 通过 | Core 默认 token；M 保留已有白色背景；A fg token |
| V2 | 不适用 | 通过 | A:40,65 siteConfig.accent |
| V3 | 通过 | 通过 | M 使用 Core CloseIcon；A solar |
| V4 | 不适用 | 不适用 | 本轮不修改此项对应的菜单/页面/数据/API职责 |
| V5 | 不适用 | 不适用 | 本轮不修改此项对应的菜单/页面/数据/API职责 |
| V6 | 不适用 | 通过 | A:38 soft StatusBadge 不变 |
| V7 | 通过 | 通过 | M:68 标题黑；Core toast 标题黑/描述 grey700；A 标题黑 |
| F1 | 通过 | 不适用 | M 保留 onClose/title/width/children 接口 |
| F2 | 通过 | 不适用 | 删除仍需确认，本轮未提交删除 |
| F3 | 不适用 | 不适用 | 本轮不修改此项对应的菜单/页面/数据/API职责 |
| F4 | 通过 | 不适用 | T 桥接原 lib/toast API，全站宿主 |
| F5 | 不适用 | 不适用 | 本轮不修改此项对应的菜单/页面/数据/API职责 |
| F6 | 通过 | 通过 | 未增加 Drawer/Sheet |
| D1 | 不适用 | 不适用 | 本轮不修改此项对应的菜单/页面/数据/API职责 |
| D2 | 不适用 | 不适用 | 本轮不修改此项对应的菜单/页面/数据/API职责 |
| D3 | 不适用 | 不适用 | 本轮不修改此项对应的菜单/页面/数据/API职责 |
| D4 | 不适用 | 不适用 | 本轮不修改此项对应的菜单/页面/数据/API职责 |
| D5 | 不适用 | 不适用 | 本轮不修改此项对应的菜单/页面/数据/API职责 |
| D6 | 通过 | 通过 | 无新增凭据读取或展示 |
| E1 | 通过 | 通过 | UI宿主与业务逻辑分离 |
| E2 | 不适用 | 不适用 | 本轮不修改此项对应的菜单/页面/数据/API职责 |
| E3 | 通过 | 通过 | 全站复用 M/T；A 无新增抽象 |
| E4 | 通过 | 通过 | 均为有状态交互的 client 组件 |
| Q1 | 通过 | 通过 | /tmp/forge-motion-check.log，15条既有ref警告 |
| Q2 | 通过 | 通过 | 稳定Chrome表单/Toast/Tab；A仅默认Button属性变更，Button已实际点击 |
| Q3 | 通过 | 通过 | 见上述对照物与S/O/N/C |
| Q4 | 通过 | 通过 | 最终Chrome控制台error/warn=[] |

## 修复与重验

- Core native Modal 尝试已撤回，最终保留现有宿主并共享 Core 动效样式；修复 Toast 被 top layer 遮挡的风险。
- 本地稳定 Chrome 实点：编辑打开/取消、下拉展开、删除确认后取消、同部门标签、复制 ID 触发 Toast。无业务写入。
- 最终 Modal animationName=forge-surface-in，宽560、高720；reduce 模拟为 none，已恢复系统默认。
- 最终同时打开 Toast 与 Modal，分别 z100 / z50；Toast 可显示。
- Tab 内容 animationName=forge-surface-in；reduce 为 none。
- 截图：.semantic/evidence/account-detail-20260929/motion-modal.png 和 motion-tabs.png。
- pnpm check 通过（15条已有ref警告）；控制台无error/warn。未运行生产发布。
- 规范审计：本轮无未修复违规。未重新测试所有业务模块的数据保存，也未重做所有响应式断点。

## 维护约定

默认沿用 Core motion=auto，不逐处显式关闭。共享样式类和 exit token 已在0.3.1核实；升级Core时复验Modal进出场和Toast层级。原生Modal迁移需先解决全站Toast的top-layer兼容。

## 第二轮：按 13 类复核与补漏

上一轮结论仅覆盖默认组件与几个宿主，不能代表所有业务入口均已接入。

| 类别 | Starter 当前状态 | 实际依据 |
| --- | --- | --- |
| 1 按钮 | 默认 auto | Button、IconButton、IconTrigger；Ask AI 两处 none 已删除 |
| 2 下拉框/菜单 | 默认 auto | SelectOption、TextFieldSelect、KebabMenu 等 |
| 3 菜单选项 | 默认 auto | MenuItem 与 MotionMenu 指示层 |
| 4 侧栏导航 | 默认 auto | AppLayout，子分支由 Core 管理 |
| 5 标签栏/按钮组 | 默认 auto | TabBar、ButtonGroup |
| 6 Tooltip | 默认 auto | models 提示使用 Core Tooltip |
| 7 开关/复选框 | 默认 auto | SelectionControl、Checkbox |
| 8 Checklist | 默认 auto | Ask AI presentation 与 ref/checklist、ref/task |
| 9 Modal/ConfirmationDialog | 补齐使用入口 | 公共 Modal；六个列表删除确认从旧遮罩迁入 |
| 10 Drawer | 未直接使用 | AskAi 自己的内置 dialog 未接新版 Drawer，仍缺滑入/滑出 |
| 11 Accordion | 未使用 | app/components 无 Accordion 实例；不为动效新增业务区块 |
| 12 TabsContent | 补齐 | accounts详情 + ref/profile、person（两组）、product、project |
| 13 Toast | 已接入 | 全局 bus 到 Core ToastProvider，含进出及堆叠位移 |

本轮修改模块分批：accounts / roles / menus / permissions 为 collection表格（chrome A、对照accounts列表、case table/modal）；models为资源工作台（chrome A、对照ref/resource-workspace）；settings/apps为应用列表（chrome A）。只替换删除确认宿主，保留各自取消、权限、deleting守卫和服务调用。models原z70保留。公共Modal保留退场时的上一份内容，避免deleteTarget置空后空壳退场。

参考页为独立批：profile对照project成员、person对照CRM客户、product对照电商商品、project对照project项目。仅包TabsContent，不改演示字段与外层布局。

### 分层核查

- S：六模块原页头/工具带/主体顺序不变，删除确认仍是页面浮层。参考页Tab顺序不变。
- O：没有新增页面壳、页面padding或白卡；共享Modal浮层在Grid外；默认z50，模型z70。
- N：TabsContent只包对应内容分区，未给表格增加装饰卡。客户参考页两组Tab分别持有activeKey。
- C：Core ConfirmationDialog仍是内容，宿主使用既有Modal；TabsContent来自已安装0.3.1。确认取消回调保持原行为；没有业务数据写入。

### 验证

本地Chrome实际打开账号/角色删除确认并取消，animationName=forge-surface-in。四个参考详情分别切换任务、订单、备注、Teams，内容与选中标签一致；浏览器error/warn=[]。未执行删除。菜单/权限/模型/应用的相同宿主接入经代码核对及类型检查，未逐一浏览器点开，因此不称全模块端到端测试完成。

截图：motion-confirmation.png、motion-reference.png（同上一节证据目录）。check日志：/tmp/forge-motion-complete-check.log。既有ref演示按钮、字色、栅格等历史债未在此次动效改动中扩散，仍不应复制进业务页。

### 逐条复核范围

以下逐项核查本轮删除宿主、Tab容器增量；业务字段与API保持原实现。参考页原有演示设计债另列，不将其计为动效补齐后已全页合规。

| ID | 六个列表删除确认增量 | 四个参考详情增量 | 证据/说明 |
| --- | --- | --- | --- |
| M1 | 不适用 | 不适用 | 本次增量不改变该项职责；未将原页面未审部分宣称通过 |
| M2 | 不适用 | 不适用 | 本次增量不改变该项职责；未将原页面未审部分宣称通过 |
| M3 | 不适用 | 不适用 | 本次增量不改变该项职责；未将原页面未审部分宣称通过 |
| M4 | 不适用 | 不适用 | 本次增量不改变该项职责；未将原页面未审部分宣称通过 |
| M5 | 不适用 | 不适用 | 本次增量不改变该项职责；未将原页面未审部分宣称通过 |
| M6 | 不适用 | 不适用 | 本次增量不改变该项职责；未将原页面未审部分宣称通过 |
| R1 | 不适用 | 不适用 | 本次增量不改变该项职责；未将原页面未审部分宣称通过 |
| R2 | 不适用 | 不适用 | 本次增量不改变该项职责；未将原页面未审部分宣称通过 |
| R3 | 不适用 | 不适用 | 本次增量不改变该项职责；未将原页面未审部分宣称通过 |
| R4 | 不适用 | 不适用 | 本次增量不改变该项职责；未将原页面未审部分宣称通过 |
| R5 | 不适用 | 不适用 | 本次增量不改变该项职责；未将原页面未审部分宣称通过 |
| H1 | 不适用 | 不适用 | 本次增量不改变该项职责；未将原页面未审部分宣称通过 |
| H2 | 不适用 | 不适用 | 本次增量不改变该项职责；未将原页面未审部分宣称通过 |
| H3 | 不适用 | 不适用 | 本次增量不改变该项职责；未将原页面未审部分宣称通过 |
| H4 | 不适用 | 不适用 | 本次增量不改变该项职责；未将原页面未审部分宣称通过 |
| H5 | 不适用 | 不适用 | 本次增量不改变该项职责；未将原页面未审部分宣称通过 |
| H6 | 不适用 | 不适用 | 本次增量不改变该项职责；未将原页面未审部分宣称通过 |
| H7 | 不适用 | 不适用 | 本次增量不改变该项职责；未将原页面未审部分宣称通过 |
| L1 | 通过（增量） | 通过（增量） | 只替换浮层或增加无装饰内容容器；原分栏、表宽、内滚不改；ref原栅格债仍在 |
| L2 | 通过（增量） | 通过（增量） | 只替换浮层或增加无装饰内容容器；原分栏、表宽、内滚不改；ref原栅格债仍在 |
| L3 | 不适用 | 不适用 | 本次增量不改变该项职责；未将原页面未审部分宣称通过 |
| L4 | 通过（增量） | 通过（增量） | 只替换浮层或增加无装饰内容容器；原分栏、表宽、内滚不改；ref原栅格债仍在 |
| L5 | 不适用 | 不适用 | 本次增量不改变该项职责；未将原页面未审部分宣称通过 |
| L6 | 通过（增量） | 通过（增量） | 只替换浮层或增加无装饰内容容器；原分栏、表宽、内滚不改；ref原栅格债仍在 |
| L7 | 通过（增量） | 通过（增量） | 只替换浮层或增加无装饰内容容器；原分栏、表宽、内滚不改；ref原栅格债仍在 |
| L8 | 通过（增量） | 通过（增量） | 只替换浮层或增加无装饰内容容器；原分栏、表宽、内滚不改；ref原栅格债仍在 |
| L9 | 通过（增量） | 通过（增量） | 只替换浮层或增加无装饰内容容器；原分栏、表宽、内滚不改；ref原栅格债仍在 |
| L10 | 通过（增量） | 通过（增量） | 只替换浮层或增加无装饰内容容器；原分栏、表宽、内滚不改；ref原栅格债仍在 |
| C1 | 通过 | 通过 | Modal/ConfirmationDialog/TabsContent；类型导出已核实；原确认回调保留 |
| C2 | 不适用 | 不适用 | 本次增量不改变该项职责；未将原页面未审部分宣称通过 |
| C3 | 不适用 | 不适用 | 本次增量不改变该项职责；未将原页面未审部分宣称通过 |
| C4 | 通过 | 不适用 | Modal/ConfirmationDialog/TabsContent；类型导出已核实；原确认回调保留 |
| C5 | 不适用 | 不适用 | 本次增量不改变该项职责；未将原页面未审部分宣称通过 |
| C6 | 通过（增量） | 不适用 | 删除原service及toast不变；没有新建数据源/敏感字段；ref占位操作未改 |
| C7 | 通过 | 通过 | Modal/ConfirmationDialog/TabsContent；类型导出已核实；原确认回调保留 |
| C8 | 通过 | 通过 | Modal/ConfirmationDialog/TabsContent；类型导出已核实；原确认回调保留 |
| C9 | 不适用 | 不适用 | 本次增量不改变该项职责；未将原页面未审部分宣称通过 |
| C10 | 不适用 | 不适用 | 本次增量不改变该项职责；未将原页面未审部分宣称通过 |
| V1 | 不适用 | 不适用 | 本次增量不改变该项职责；未将原页面未审部分宣称通过 |
| V2 | 不适用 | 不适用 | 本次增量不改变该项职责；未将原页面未审部分宣称通过 |
| V3 | 不适用 | 不适用 | 本次增量不改变该项职责；未将原页面未审部分宣称通过 |
| V4 | 不适用 | 不适用 | 本次增量不改变该项职责；未将原页面未审部分宣称通过 |
| V5 | 不适用 | 不适用 | 本次增量不改变该项职责；未将原页面未审部分宣称通过 |
| V6 | 不适用 | 不适用 | 本次增量不改变该项职责；未将原页面未审部分宣称通过 |
| V7 | 不适用 | 不适用 | 本次增量不改变该项职责；未将原页面未审部分宣称通过 |
| F1 | 通过 | 不适用 | Modal/ConfirmationDialog/TabsContent；类型导出已核实；原确认回调保留 |
| F2 | 通过 | 不适用 | Modal/ConfirmationDialog/TabsContent；类型导出已核实；原确认回调保留 |
| F3 | 不适用 | 不适用 | 本次增量不改变该项职责；未将原页面未审部分宣称通过 |
| F4 | 通过（增量） | 不适用 | 删除原service及toast不变；没有新建数据源/敏感字段；ref占位操作未改 |
| F5 | 不适用 | 不适用 | 本次增量不改变该项职责；未将原页面未审部分宣称通过 |
| F6 | 通过 | 不适用 | Modal/ConfirmationDialog/TabsContent；类型导出已核实；原确认回调保留 |
| D1 | 不适用 | 不适用 | 本次增量不改变该项职责；未将原页面未审部分宣称通过 |
| D2 | 不适用 | 不适用 | 本次增量不改变该项职责；未将原页面未审部分宣称通过 |
| D3 | 通过（增量） | 不适用 | 删除原service及toast不变；没有新建数据源/敏感字段；ref占位操作未改 |
| D4 | 通过（增量） | 不适用 | 删除原service及toast不变；没有新建数据源/敏感字段；ref占位操作未改 |
| D5 | 不适用 | 不适用 | 本次增量不改变该项职责；未将原页面未审部分宣称通过 |
| D6 | 通过（增量） | 不适用 | 删除原service及toast不变；没有新建数据源/敏感字段；ref占位操作未改 |
| E1 | 通过（增量） | 不适用 | 删除原service及toast不变；没有新建数据源/敏感字段；ref占位操作未改 |
| E2 | 通过（增量） | 不适用 | 删除原service及toast不变；没有新建数据源/敏感字段；ref占位操作未改 |
| E3 | 通过 | 不适用 | Modal/ConfirmationDialog/TabsContent；类型导出已核实；原确认回调保留 |
| E4 | 通过 | 通过 | Modal/ConfirmationDialog/TabsContent；类型导出已核实；原确认回调保留 |
| Q1 | 通过 | 通过 | check通过；四参考页切换已实点；六列表中账号/角色实点，其余仅静态核查 |
| Q2 | 部分验证 | 通过 | check通过；四参考页切换已实点；六列表中账号/角色实点，其余仅静态核查 |
| Q3 | 通过 | 通过 | check通过；四参考页切换已实点；六列表中账号/角色实点，其余仅静态核查 |
| Q4 | 部分验证 | 通过 | check通过；四参考页切换已实点；六列表中账号/角色实点，其余仅静态核查 |
