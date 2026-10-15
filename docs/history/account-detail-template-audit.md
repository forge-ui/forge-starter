# 账号详情模板迁移审计 · 2026-09-29

范围：仅 `app/(app)/accounts/[id]/page.tsx` 本轮改动。工作区其余 Harness、模型及账号 API 改动不在本次范围。

## 对照物

角色：detail / profile；chrome A（h1 + Breadcrumbs + PageTitleActions）。
主对照：`../forge/src/app/templates/project-template/members/[id]/page.tsx`；本仓 `/ref/profile/`。
已比较电商 `customers/[id]/_content.tsx`、CRM `customers/[id]/page.tsx`。成员详情更适合业务账号档案，采用头像侧栏 + 摘要 + Tab 主栏。
组件 case：`grid`、`card`、`tab`、`list`、`table`；弹窗继续用现有 AccountFormDialog / Modal。

## S → O → N → C

| 层 | 实际结构 | 判定 |
| --- | --- | --- |
| S | 页头 → 左头像、联系资料及备注 / 右摘要、概览和同部门标签页 | 对齐成员详情；以真实账号信息替换项目/任务演示数据 |
| O | 根纵向 stack；Kit Grid；保留 AppShell 内滚与四周 gutter | 没有第二套壳或额外页面 padding |
| N | 档案、基本资料、备注采用 rounded-card；关联表直接落节 stack | 表外无装饰白卡；无模拟折线/活动记录 |
| C | Avatar、DescriptionItem、StatCard、TabBar、DataTable、StatusBadge、Button | core 组件；真实回调；标题正文黑色，辅助信息 grey-700 |

## 逐项核查

P = `app/(app)/accounts/[id]/page.tsx`。行号基于本次最终实现；NA 不扩展审计范围。

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
| L8 | 通过 | P:234 | 表直接放节 stack；正文资料和备注使用卡壳 |
| L9 | 通过 | P:172,202 | 主次栏 Grid span；等宽摘要用 columns；375/768/1024/1440 检查 |
| L10 | 通过 | P:138 | 桌面 body 高度等于视口，内容面内滚、右/底 gutter 可见 |
| C1 | 通过 | P:8 | UI 来自 core；Modal/Toast 为本仓既有封装 |
| C2 | 通过 | P:236 | 关联表使用 DataTable，无手写 table |
| C3 | 通过 | P:95 | 无未实现 sortable |
| C4 | 通过 | P:111 | ConfirmationDialog 包在 Modal |
| C5 | 通过 | P:98,145 | 状态有中文文字 |
| C6 | 通过 | P:38,96,157,212,194 | 复制、导航、编辑、Tab 均真实处理；无模板占位操作 |
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
| Q1 | 通过 | /tmp/forge-account-detail-check.log | pnpm check 通过；15 条既有 /ref 警告 |
| Q2 | 通过 | 下方浏览器记录 | 稳定 Chrome 实点主路径，截图留档 |
| Q3 | 通过 | 本文对照物及分层记录 | 对比三个模板，采用成员详情；数据差异已说明 |
| Q4 | 通过 | Chrome dev.logs | 刷新后 error/warn=[]；无 Next 错误覆盖层 |

## 修复与差异

- 详情 1440 宽度采用 4+8，2xl 采用 3+9；避免联系邮箱在窄侧栏中频繁折行。
- 用真实计数替换模板模拟项目趋势。无项目、任务、交易、聊天数据，因此不迁入对应 Tab。
- 编辑/删除入口按当前用户权限展示；保留 Ask AI 语义登记、revision 删除以及列表筛选返回。
- 保留现有业务字段，不新增后端数据、不虚构登录历史。账号详情仅代表业务档案。
- 初版 Button variant / 表宽 prop 类型错误已修正，最终 check 通过。
- 规范核查无未修复违规；无需修改清单或模板源文件。

## 浏览器验收

环境：现有稳定 Chrome，http://127.0.0.1:3167，隔离测试库。未启动新 Chrome 进程。

1. 侧栏账号管理 → 搜索 semantic_alpha → 姓名进入详情。
2. 编辑备注打开现有账号表单，核对预填内容后取消；删除确认打开后取消。
3. 同部门 Tab → 以 Enter 打开「对话表单测试」，真实 URL 与 h1 一致。
4. 面包屑返回后仍是 `/accounts/?q=semantic_alpha`，搜索框与过滤行保留。
5. 375/768/1024/1440：documentWidth 等于 innerWidth；bodyHeight 等于视口高度。桌面侧栏展开；手机沿用壳的隐藏侧栏。
6. 表格只有自身横滚，概览、表格、弹窗截图已核 S/O/N/C；刷新后控制台 error/warn 空。

截图：`.semantic/evidence/account-detail-20260929/`，包含 reference-profile、overview-1440、overview-1024、overview-768、overview-375、department-1440、edit-dialog。
本轮为 UI 调整，没有新建或删除业务账号；没有发布线上。空数据、接口失败和权限分支代码复核，未伪称为逐一浏览器模拟。

## 左侧留白调整复验

本次将备注节从概览移至左侧档案下方（P:173,191），保持 20px 节间距及原编辑入口。逐条重新核对上方 65 项，结论不变；S/O/N/C 无新增偏差，备注保持官方 Panel 样式，无重复内容或占位数据。

稳定 Chrome 已复验左侧编辑备注打开正确账号表单并取消；整体截图 `notes-left.png` 可见左右内容与壳底 gutter。控制台 error/warn=[]；`pnpm check` 通过（15 条既有 /ref 警告），`git diff --check` 通过。此次未再次模拟全部响应式宽度；分栏断点未改，沿用上一轮响应式证据。

## 移除备注区块及 Multica 调研

按用户最新反馈，详情中移除备注展示卡片和单独编辑入口，保留现有编辑账号弹窗及已存备注字段；不删除业务数据。上文“左侧留白调整”是上一轮记录，本节为最终状态。

只读对照本地 Multica：`packages/views/members/member-detail-page.tsx` 使用 `ActorIssuesPanel`；`packages/views/common/actor-issues-panel.tsx` 区分 assigned/created 任务；`packages/views/members/member-profile-card.tsx` 展示 owned agents 并按近 30 天运行次数排序。Starter 的 admin_accounts 尚无这些关联，未将登录用户的 harness ownership 错配给业务账号。

完整 65 项再次复核：M/R/H/C/V/F/D/E 结论沿用且范围无新增功能；S 更新为左档案、右摘要及分区；O/N 去掉备注卡，保留正文卡与表格外层结构；L6/L9/L10 重新截图检查。旧表中有关备注卡/备注按钮的证据不再适用，编辑由页头按钮进入。无新增规范违规。

本地 Chrome 验证概览和同部门 Tab；截图 `notes-removed.png`；`pnpm check` 通过（15 条既有 /ref 警告），控制台 error/warn=[]，`git diff --check` 通过。未迁入 Multica 的 UI 组件或 mock 数据。
