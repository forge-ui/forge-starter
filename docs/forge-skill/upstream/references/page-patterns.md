# Admin Page Patterns

Use this reference before designing common SaaS admin pages. Pick the page type first, then compose the screen from Forge components instead of hand-rolling UI.

Think in reusable page blocks, similar to shadcn Blocks: shell, toolbar, data body, feedback state, and confirmation flow. Prefer real Forge cases/templates as the source of truth.

## Page Selection Decision Tree

Before composing JSX, choose the page model:

1. If the request asks for a system/platform/admin/back-office, read `contracts/system-brief.md`, choose a `blueprints/*.md` archetype, and produce a System Brief before choosing page components.
2. If the request names a business object users manage, treat it as a resource module and read `contracts/module-contract.md` plus `admin-module-playbook.md` first.
3. If the user asks for metrics, trends, anomalies, or reports, start with analytics/reporting, then add drill-down links to lists/details.
4. If the user asks for approval, generation, import, publishing, tickets, or review, model a workflow queue with explicit states and actions.
5. If the user asks for settings, permissions, integrations, notifications, or rules, model grouped configuration with save/reset behavior and danger zones.
6. If the page mixes multiple intents, give each intent a clear surface: dashboard for insight, list/detail for operations, settings for configuration.

For dashboards, start from the ten Screens in [screens](screens.md); missing primitives require FORGE-GAP. Pick the nearest Forge template after the page model is clear. For example, ecommerce products/orders/customers are good CRUD references; project-template projects/members/files/invoices/tasks are good operational module references; dashboards are good entry pages, not replacements for CRUD flows.

When a blueprint exists, prefer its module map and state model over inventing generic fields. The page pattern decides the surface; the blueprint decides the business logic.

For system generation, combine patterns instead of picking only one: app shell + workbench/dashboard + core list/detail + mutation form/dialog + settings/audit/supporting surface.

## Pattern Map

| Page / flow | Structure | Forge components | Source examples |
|---|---|---|---|
| Full admin system | domain sidebar + workbench + core modules + supporting settings/audit | `AppLayout`, `StatCard`, `FullWidthTable`, `TabBar`, `ListGroup`, `HistoryGrouped`, `ConfirmationDialog` | project-template overview/projects/tasks/members/files/invoices |
| App shell / navigation | sidebar + topbar + breadcrumbs + user/team entry | `AppLayout`, `SidebarMenu`, `TopBar`, `PageHeader`, `Breadcrumbs` | `components/layouts-app-layout.md`, dashboard-builder templates |
| Auth | brand area + form + secondary links + loading/error states | `TextField`, `Button`, `Checkbox`, `StyledLink` | compose from form primitives; no Forge auth template yet |
| Dashboard | KPI grid + charts + activity/list/map | `StatCard`, `ProgressStatCard`, `ChartCard`, chart family, `MapCard`, `ActivityCard`, `ListGroup` | `cases/card`, `cases/chart`, `templates/(dashboards)/dashboards/*` |
| Analytics / reporting | metric summary + trends + dimension filters + detail table | `Toolbar`, `ChartCard`, chart family, `DataTable`, `StatCard`, `ButtonGroup` | analytics, CRM, finance dashboards |
| List page | `AppLayout` + `Toolbar` + `FullWidthTable`/`DataTable` + pagination/actions | `Toolbar`, `ToolbarSearchInput`, `ToolbarFilterButton`, `ToolbarActions`, `FullWidthTable`, `DataTable`, `StatusBadge`, `Pagination`, `KebabMenu` | `cases/toolbar`, `cases/table`, ecommerce/project templates |
| Detail page | back/breadcrumbs + summary + fields + related data + timeline | `AppLayout pageHeaderVariant="detail"`, `Breadcrumbs`, `DescriptionItem`, `ListGroup`, `HistoryGrouped`, `DataTable` | `cases/page-header`, `cases/list`, `cases/history` |
| Master-detail workspace | left list/search + right preview/detail + quick actions | `ToolbarSearchInput`, `ListGroup`, `DataTable`, `TabBar`, `DescriptionItem`, `ChatBubble` | project client/member detail templates |
| Right drawer / inspector | list/table/queue stays visible + selected object summary/actions | `DataTable`, `ListGroup`, `DescriptionItem`, `TabBar`, `HistoryGrouped`, `ConfirmationDialog` | task/user/file processing workspaces |
| Create / edit | sectioned form + submit actions + upload/validation | `TextField`, `TextArea`, `SelectOption`, `Datepicker`, `FileUpload`, `MediaUpload`, `Button`, `Stepper` | `cases/input-field`, ecommerce `new` pages |
| Bulk import/export | selection state + actions, or stepper import flow | `DataTable`, `ToolbarActions`, `FileUpload`, `Stepper`, `StatusBadge` | list templates + form cases |
| Delete / danger | row/detail/settings action + confirmation | `KebabMenu`, `IconButton`, `Button color="red"`, `ConfirmationDialog` | `cases/menu`, `cases/modal` |
| Messages / notifications | conversation list + message detail, or notification list | `ContactItem`, `NotificationItem`, `ChatBubble`, `ChatInputBar`, `ListGroup` | `cases/chat`, `cases/menu` |
| Calendar | toolbar + view switch + calendar + event side panel | `FullCalendar`, `SmallCalendar`, `SmallDailyCalendar`, `EventCard`, `EventTag`, `ButtonGroup` | `cases/calendar`, `cases/tab` |
| File manager | search/filter + table/grid + upload + preview/permissions | `Toolbar`, `DataTable`, `FileCard`, `FileTypeIcon`, `FileUpload`, `KebabMenu` | project files/templates |
| Invoice / billing | invoice list + payment status + document detail + send/download/print | `DataTable`, `StatusBadge`, `DescriptionItem`, `Button`, `ConfirmationDialog` | project invoices, ecommerce invoice detail |
| Team / members | member directory + roles + profile detail + related work/chat | `UserCard`, `AvatarGroup`, `DataTable`, `TabBar`, `ChatBubble`, `LineChartStatCard` | project members templates |
| Profile | profile card + stats + activity + related projects/files | `ProfileCard`, `Avatar`, `UserCard`, `StatCard`, `ActivityCard`, `ProjectCard`, `ListGroup` | `cases/menu`, `cases/card`, `cases/list` |
| Settings | grouped settings + tabs + controls + danger zone | `TabBar`, `ListGroup`, `ListItem`, `TextField`, `SelectOption`, `Toggle`, `ConfirmationDialog` | `cases/tab`, `cases/list`, `cases/input-field` |
| Stepper / wizard | stepper + current step form + previous/next/save draft | `Stepper`, forms, `Button`, `ProgressBar`, `DescriptionItem` | `cases/pagination-stepper`, `cases/input-field` |
| Card / kanban | toolbar + filters + grid/columns + card actions | `ProjectCard`, `TaskCard`, `UserCard`, `ProgressCard`, `FilterGroup`, `KebabMenu` | `cases/card`, `cases/filter` |
| Chat / IM | conversation sidebar + message stream + input | `ContactItem`, `ChatBubble`, `ChatInputBar`, `TabBar` | `cases/chat` |
| Agent workspace | thread list + thinking / tools / streamed answer + HITL + prompt bar | `AppLayout`, `ThinkingTrace`, `ToolChips`, `StreamingAnswer`, `ApprovalCard`, `RecommendationCard`, `ContextCards`, `AgentTaskRows`, `ChatInputBar`, `AgentDiffTable`, `AgentCodeBlock`, `InsightCards`, `CommandSearch`, `AgentFlowchart`, `ChatBubble` | `cases/agent`, `templates/agent` |
| Audit / activity | filters + timeline + actor + object + before/after summary | `HistoryGrouped`, `HistoryItem`, `ActivityCard`, `ToolbarDatepicker`, `ToolbarFilterButton` | `cases/history` |
| Search results | search + category filters + list/table results + empty state | `ToolbarSearchInput`, `FilterGroup`, `ListGroup`, `DataTable`, `Pagination` | `cases/filter`, `cases/list` |
| Async job center | job list + progress/status + failure report + retry/download | `DataTable`, `StatusBadge`, `ProgressBar`, `NotificationItem`, `Button` | import/export/generate/report workflows |
| First-run / empty setup | empty state + guided primary action + sample/import option | `AppLayout`, `Button`, `FileUpload`, `Stepper`, `ListGroup`, `Checklist` | create/import onboarding flows; `cases/checklist` |

## Universal Admin Skeleton

1. Reuse the host AppLayout; add one only when the host has no shell.
2. Build navigation from business domains: dashboard/workbench, operations, relationships, output/finance, governance/settings.
3. Use `pageHeaderVariant="home"` for dashboard/list pages and `pageHeaderVariant="detail"` for detail/create/edit pages.
4. Use `Toolbar` for search, filters, view switches, export/import, and primary actions.
5. Choose the main body component: `FullWidthTable`, `DataTable`, cards, `ListGroup`, charts, calendar, file, or chat.
6. Add feedback states: loading, empty, error, permission denied, success.
7. Put row actions in `KebabMenu` / `CellActions`; use `ConfirmationDialog` for destructive actions.
8. Put bulk actions in `ToolbarActions` or the table selection state, not scattered around the page.
9. Run a layout integrity check: full width, equal-height rows, no accidental large blank card areas, no mobile overflow.

## Layout Integrity

Read [the layout grid contract](layout-grid.md) for Grid/GridItem props, page width ownership and responsive audit steps. Choose the closest template first and inherit its fixed/proportional columns, spacing and breakpoints before composing components. Do not stack arbitrary `div`s and hope the page fills correctly.

Rules:

- Page body should use `w-full`, `min-w-0`, `flex-1`, and `min-h-0` where needed so content can fill and shrink correctly.
- Use `Grid` and responsive `GridItem` spans for proportional dashboard regions, with explicit gaps matching the source template. Preserve fixed form/detail rails (product 280px, seller 336px) with static CSS Grid/Flex and narrow-screen stacking; do not force them into 8:4.
- If same-row cards have very different content density, do not leave a large blank area. Change the row span, split dense/sparse cards, or use `flex flex-col justify-between h-full` inside the sparse card.
- Choose equal-height cards only when the row benefits from them; do not force `auto-rows-fr` or minimum heights on every card grid.
- Charts need stable height, such as `h-[280px]`, `min-h-[320px]`, or `aspect-[16/9]`; do not let SVG/canvas natural height define the layout.
- Right-side todo/message/template cards placed next to large charts need enough visual density: footer actions, status summaries, grouped headings, or a smaller row span.
- Equal-width card groups use `<Grid columns={{ base: 1, sm: 2, lg: 4 }}>` and existing full-width card props. Verify available space with the sidebar expanded.
- Any `overflow-y-auto` region needs a clear parent height or a `min-h-0` chain, otherwise scroll/fill behavior will break.

Self-check:

- Does the first viewport have one side full and the other side mostly empty?
- Are lower modules misaligned because previous row heights are inconsistent?
- Does the layout fill naturally at 1440px, 1920px, and mobile widths?
- Do CTAs, stats, list items, chart legends, and footers create a complete visual block inside each card?

## App Shell / Auth

- Use `AppLayout` for all authenticated admin pages; do not rebuild sidebar/topbar/profile navigation.
- Group navigation by business domain: dashboard, core objects, collaboration, finance, settings.
- Use `pageHeaderVariant="home"` for dashboards/lists and `pageHeaderVariant="detail"` for detail/edit/invoice/task pages.
- Use `Breadcrumbs` for nested resources.
- Forge currently has no auth template source. For login/signup/reset/invite pages, compose the skeleton from `TextField`, `Checkbox`, `Button`, and `StyledLink`.
- Auth forms should cover loading, validation error, disabled submit, and success redirect states.

## Dashboard

- First row: 3-5 KPIs with `StatCard` / `ProgressStatCard`.
- Middle: main chart + secondary chart with `ChartCard` and chart family components.
- Bottom: activity, top lists, map, or tasks with `ActivityCard`, `ListGroup`, `MapCard`, `TaskCard`.
- Keep labels short, show units, and use `trend` / `trendDirection` for movement.
- Dashboard/workbench cards should navigate to work: each KPI, anomaly, task, or shortcut should imply a filtered list, queue, detail page, or action.

## Analytics / Reporting

- Top: `Toolbar` with date range, dimension filters, export, refresh.
- Summary: `StatCard` for key metrics such as revenue, conversion, activity, cost, anomalies.
- Body: `ChartCard` + chart family for trend, comparison, and breakdown.
- Detail: `DataTable` under the charts for sortable/paginated records.
- Make the time range and filter context visible; reporting pages are not trustworthy without them.

## List Page

- Header: title + `primaryAction` for New/Create.
- Toolbar: search, status filter, date filter, tabs or view switch, export, bulk actions.
- Table: 6-8 columns; status uses `StatusBadge`; main entity uses image/avatar text cell; final column uses `KebabMenu` or `CellKebabMenu`.
- Use `FullWidthTable` for full-page management lists. Use `DataTable` for embedded dashboard/detail tables.
- Footer: `Pagination`.
- Actions: view detail, edit, duplicate, archive, delete. Delete must confirm.
- Keep search, filters, sort, page, pageSize, and view mode in URL when the list is an operational view users may share or revisit.
- Show bulk actions only after selection. For cross-page selection, clarify whether the action applies to current page or all matching records.
- For saved views such as "Overdue", "Needs review", or "My items", show the active segment and make clearing filters obvious.
- `ToolbarSearchInput` is display-only today. For controlled search that updates URL state, use `TextField` with a search icon or a project wrapper exposing `value` and `onChange`.

## Detail / Master-Detail

- Use detail header with back behavior and breadcrumbs.
- Top summary: status, owner, key dates, important metrics.
- Field groups: `DescriptionItem` in logical sections.
- Related data: `DataTable` / `ListGroup`; history/audit: `HistoryGrouped`.
- For master-detail workspaces, use left search/list and right preview/detail; collapse to list -> detail on mobile.

## Create / Edit / Import

- Section forms by business meaning: basic info, configuration, permissions, files, confirmation.
- Short forms are single column; complex forms may use two columns.
- File/image fields use `FileUpload`, `MediaUpload`, `ProfileImgUpload`.
- Multi-step flows use `Stepper`; final step shows a summary before submit.
- Import flows should be upload -> map fields -> preview validation -> confirm import.

## File Manager

- Toolbar: search, type filter, upload, create folder, view switch.
- Table view: `FullWidthTable` for name, type, size, owner, updated time, permission.
- Grid view: `FileCard` + `KebabMenu` for download, rename, move, delete.
- Use `FileUpload` for upload and `FileTypeIcon` for file type.
- Cover permissions, upload progress, failed retry, empty folder, and destructive delete confirmation.

## Invoice / Billing

- List: `FullWidthTable` with invoice id, client, project, amount, due date, status.
- Status: `StatusBadge` for paid, pending, overdue, draft, void.
- Detail: summary, company/client info, line items, totals, tax/discount, actions.
- Actions: send, download, print, edit, void/delete. Void/delete must confirm.

## Team / Members / Profile

- Directory: `DataTable` or `UserCard` grid with avatar, role, team, status, last active.
- Filters: role, status, team, permission group.
- Detail: profile, stats, projects, tasks, files, chat; switch sections with `TabBar`.
- Permission changes, member removal, and invite reset should confirm.

## Messages / Chat / Agent

- Conversation list: `ContactItem`.
- Message stream: `ChatBubble`.
- Composer: `ChatInputBar`.
- Results/artifacts should render as table, card, chart, file preview, or tabs, not only plain text.
- Cover empty, loading, error, and retry states.

## Calendar

- Toolbar + `ButtonGroup` for month/week/day.
- Main area: `FullCalendar`; side area can use `SmallCalendar` and today's `EventCard`s.
- Use `EventTag` for type/status.
- Event forms need title, time, participants, reminders, and recurrence when required.

## Settings

- Group settings into sections with `ListGroup`.
- Use `TabBar` for categories.
- Use `Toggle` for booleans, `SelectOption` for enums, `TextField` / `TextArea` for text.
- Put account deletion / reset / revoke actions in a separated danger zone with red confirmation.

## Audit / Activity

- Filter by time, actor, object, and action with toolbar controls.
- Use `HistoryGrouped` by date; use `HistoryItem` / `ActivityCard` for entries.
- Each entry should include actor, action, object, time, and result.
- For field changes, show before/after in compact descriptions.

## Search / States

- Search pages need search, category filters, sorting, result count, pagination, and empty state.
- Loading should keep the page frame stable.
- Empty state should explain why and offer create/upload/clear filters.
- Error state should offer retry.
- Permission state should say what access is missing without leaking sensitive data.

## Complete Module Checklist

For a full admin module, consider whether it needs:

1. Dashboard: metrics and anomalies.
2. List: search, filters, sort, pagination, bulk actions.
3. Detail: summary, field groups, related data, history.
4. Create/Edit: sectioned forms, validation, uploads, draft save.
5. Delete/Archive: confirmation, impact, restore policy.
6. Files: attachments, upload, preview, permissions.
7. Billing: invoice, payment, refund, export.
8. Team/Permission: members, roles, invites, removal.
9. Audit: logs, approvals, activity.
10. Settings: global config, notifications, integrations, danger zone.

## 业务拆解补充

每页明确页面目的、字段、状态、权限及下一步动作。文件管理须包含上传/处理中/失败重试/预览权限；发票要有发送、下载与账单状态；团队页说明成员角色与可操作边界。列表、详情、编辑共享实体标识与状态，不把卡片网格当成业务闭环。布局仍以主模板及 Grid 契约为准，不继承旧副本的 gap-6、无条件等高或 auto-rows-fr。
