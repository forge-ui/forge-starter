> 适用边界：以 SKILL.md 的用户授权范围为先。单页/局部任务只用相关契约；仅设计时不实施，已授权实施时再接对应模块与验证。状态默认 soft StatusBadge。

# Admin Module Playbook

Use this before building back-office systems or modules. The goal is to make the agent think like an admin product designer first, then compose Forge UI components second.

Good admin screens are not reports with many cards. They are work surfaces for managing objects, reviewing state, taking action, and recovering from mistakes.

A professional admin product is not one CRUD page. It is a connected system: navigation, workbench, resource modules, detail surfaces, mutation flows, settings, permissions, and audit trail all reinforce each other.

## Research Baseline

This playbook combines Forge templates with common patterns from mature admin ecosystems:

- React Admin models a back-office product around `Resource` definitions with list, create, edit, and show surfaces.
- Refine models resources with list/create/edit/show routes and standard table/form/show/delete actions.
- Ant Design Pro / ProComponents centers enterprise pages around query filters, ProTable, editable tables, modal/drawer forms, descriptions, and page containers.
- Modern shadcn admin templates commonly split by feature module, keep table filter/sort/page state in the URL, use drawers for mutation forms, and expose bulk actions only when rows are selected.
- Data table guidance from enterprise design systems converges on the same idea: tables are for finding, comparing, selecting, and acting on records, not just displaying text.

## Decision Pass

Before writing code, classify the task. A product can combine multiple types.

| Intent | Signals in the request | Primary model | Usual Forge surfaces |
|---|---|---|---|
| Resource management | orders, customers, projects, tasks, files, templates, users, invoices, rules | object lifecycle | list, detail, create/edit, delete/confirm, filters, batch actions |
| Analytics / monitoring | metrics, trends, dashboard, report, status, anomalies | insight and drill-down | KPI cards, charts, detail table, date filters, export |
| Workflow processing | approval, ticket, import, generate, publish, review, assign | queue + state machine | queue/list, detail panel, stepper, status actions, activity log |
| Collaboration | messages, comments, members, client communication, agent chat | conversation around objects | conversation list, chat stream, attachments, related object panel |
| Configuration | settings, permissions, integrations, notification, rules | grouped controls | settings sections, forms, toggles, reset/save, danger zone |

If the user asks for a single dashboard, keep it focused on insight. If the user asks for a module, product area, or management system, include the lifecycle surfaces that make the module usable.

## System Blueprint

Use this when the user asks for a "system", "platform", "admin", "后台", "业务系统", or anything broader than a single page.

```text
Product / domain:
Primary users:
Business goal:
Navigation groups:
Core modules:
Supporting modules:
Global dashboard / workbench:
High-frequency queues:
Cross-module links:
Shared objects:
Settings / permissions:
Audit / activity:
Notifications / jobs:
Data import / export:
```

System Brief format:

```text
This system helps <roles> operate <domain>.
Navigation: Dashboard, <core domain group>, <collaboration/workflow>, <finance/files>, Settings.
Core modules: <Module A>, <Module B>, <Module C>.
Workbench: shows KPIs, exceptions, assigned work, recent activity, and shortcuts into resource lists.
Operational loops: <queue -> detail -> action -> feedback>, <create/import -> validate -> review -> publish>.
Governance: roles, permissions, audit, settings, import/export, notification/job center.
Closest Forge references: project-template overview/projects/tasks/members/files/invoices, ecommerce products/orders/customers.
```

For system requests, build at least:

- App shell with domain navigation, not placeholder menu labels.
- Workbench/dashboard with metrics that link to work queues and resource lists.
- One core resource module with list, detail/inspector, create/edit, delete/archive confirmation, and state-driven row actions.
- One supporting module or surface: settings, permissions, files, invoices, members, messages, audit, or job center.
- Cross-module links so the UI feels like a product: customer -> orders, project -> tasks/files/members, invoice -> client/project, task -> assignee/activity.

If scope authorizes one screen, deliver that screen only; do not add a workbench or another module without approval.

## System Archetypes

Pick an archetype before choosing components. It gives the AI the expected modules and routes.

| Archetype | Typical modules | Workbench content | Operational loop |
|---|---|---|---|
| Project operations | overview, projects, tasks, members, files, invoices, clients, settings | project health, overdue tasks, blockers, recent files, invoice alerts | project list -> project detail -> task/file/member action -> activity |
| Commerce operations | overview, products, orders, customers, sellers, categories, invoices, refunds, settings | sales KPIs, pending orders, stock alerts, customer issues | order queue -> order detail -> fulfill/refund/message -> history |
| Data/reporting console | datasets, reports, templates, jobs, exports, permissions, audit | job status, failed imports, popular reports, freshness | upload/import -> validate -> map -> publish/export -> audit |
| Support/ticketing | inbox, tickets, customers, SLA, knowledge base, agents, settings | SLA risk, unassigned tickets, priority queue, agent load | queue -> ticket detail -> assign/reply/resolve -> satisfaction |
| Workflow/approval | requests, approvals, rules, teams, documents, audit, settings | pending approvals, risky changes, bottlenecks | request queue -> detail -> approve/reject/request changes -> audit |

For each archetype, the sidebar should expose the modules users work through daily. A dashboard alone is an entry point, not the whole product.

## Object Canvas

Fill this before composing UI. For substantial modules, share a short Module Brief with the user before writing the first JSX.

```text
Module:
Primary object:
Secondary objects:
User roles:
Object states:
State transitions:
High-frequency actions:
Dangerous actions:
Bulk actions:
Filters:
Sorts:
Search fields:
Detail tabs:
Form sections:
Audit / history:
Empty / loading / error / permission states:
Success behavior:
```

For a resource-management module, also sketch the resource contract:

```text
Resource name:
List route:
Create route or modal:
Show/detail route:
Edit route or modal:
Delete/archive action:
Bulk actions:
Import/export actions:
URL state: search, filters, sort, page, pageSize, view
```

Module Brief format:

```text
This module manages <object> for <roles>.
Core surfaces: list, detail, create/edit, <workflow/settings if needed>.
Main actions: <3-5 actions>.
State model: <states> with <important transitions>.
List behavior: <search/filter/sort/page/url/bulk>.
Mutation surfaces: <modal/drawer/full route/inline>.
Feedback states: <loading/empty/no results/error/permission/success>.
Closest Forge references: <template/case names>.
```

Keep the brief short. Its job is to stop the agent from writing a report-like dashboard when the product needs an operational module.

When generating a system, produce both a System Brief and a Module Brief for the first core module.

## Routing and Surface Decision

Choose the surface by product need, not by habit.

| Surface | Use when | Examples |
|---|---|---|
| Full route | shareable, bookmarkable, back-button friendly, complex form/detail, heavy data | `/orders/[id]`, `/products/[id]/edit` |
| Drawer / inspector | preserve list context while reading or making medium edits | task detail from queue, user update drawer |
| Modal form | 1-5 fields, quick action, low navigation value | assign owner, add member, change due date |
| Inline edit | table-like low-risk fields with obvious save/cancel | rule priority, simple status, display name |
| Stepper route/modal | ordered workflow or import with validation/review | CSV import, onboarding, report generation |

In Next.js App Router, if a modal/drawer should be shareable, consider route-backed UI using parallel/intercepting routes. If it is a transient quick action, local state is fine.

Examples from Forge templates:

- Ecommerce products: product list, product detail, new product, edit product, delete confirmation, product orders tab, reviews tab.
- Ecommerce orders: order list, order detail, invoice page, new order, delete confirmation, status badges, date/filter toolbar.
- Project template projects: project list with table/card switch, add/edit/delete modal, project detail tabs, kanban tasks, attachments, members.
- Project template members: member directory, table/card switch, add/edit/delete modal, member detail tabs for projects, tasks, and chat.
- Project template files/invoices: table, filters, pagination, delete confirmation, file/invoice-specific row actions.

## Page Map Patterns

### Resource Management

Typical routes or screens:

```text
/objects                 list / table / grid
/objects/new             create
/objects/[id]            detail
/objects/[id]/edit       edit
delete/archive           confirmation dialog
bulk action              selection toolbar
import/export            toolbar action or stepper
```

Use routes for complex forms or content-heavy detail pages. Use modals for small add/edit flows such as adding a member, editing a task date, assigning a user, or uploading an attachment.

Resource surface choices:

- Full page create/edit: many fields, multiple sections, uploads, permissions, review step, or risky changes.
- Drawer create/edit: medium complexity, user should keep list context visible, common in tasks/users/settings.
- Modal form: 1-5 fields, quick add/edit/assign/change date.
- Inline edit: table-like configuration, low-risk fields, obvious save/cancel behavior.
- Detail page: object needs tabs, related records, files, comments, history, or status operations.
- Master-detail: user must scan a queue/list while processing one selected object.

### Right Drawer / Inspector

Typical surfaces:

- Left/main area: table, grid, queue, or calendar.
- Right drawer: selected object summary, fields, related activity, comments, and primary actions.
- Drawer state can be local for quick inspection or URL-backed when users need to share the selected object.
- Use this for tasks, tickets, users, files, alerts, and approvals when users repeatedly scan many records.

### Analytics With Drill-Down

Typical surfaces:

- Dashboard with KPI cards, trend charts, anomaly/todo list.
- Date range and dimension filters in the toolbar.
- Detail table below charts for drill-down.
- Links from KPI/chart/table row to the underlying resource list or detail page.
- Export action when the report is likely to be shared.

### Workflow Queue

Typical surfaces:

- Queue list with status, assignee, SLA/due date, priority, and last update.
- Detail page or right panel with object summary, form/process controls, comments, attachments, and activity.
- State actions: approve, reject, assign, start, pause, publish, archive.
- Confirmation for irreversible state changes.

### Settings / Rules

Typical surfaces:

- Category navigation with `TabBar`, `ButtonGroup`, or `ListGroup`.
- Each setting group has a title, description, current value/control, and save/reset behavior.
- Rule tables need status, owner, last updated, enable/disable, duplicate, delete.
- Dangerous account/system operations live in a separated danger area.

### Configuration Deep Dive

Common SaaS configuration modules:

- Integrations: provider cards, connect/disconnect, test connection, last sync, scopes.
- API keys: create, copy once, rotate, revoke, scopes, last used.
- Webhooks: endpoint URL, subscribed events, signing secret, delivery logs, retry.
- Notifications: event x channel matrix, per-role defaults, quiet hours.
- Members and roles: invite, role, team, suspend/remove, MFA/SSO policy.
- Billing: plan, usage meter, upgrade/downgrade, payment method, invoice history.

## List Page Contract

A management list usually needs:

- Page title and primary action: New/Create/Add.
- Toolbar: search, status/type filter, date range, view switch, import/export, display count.
- Table or grid body: main object cell, key fields, status, owner, updated/due date, actions.
- Sorting for columns users compare: date, amount, status, priority, progress.
- Pagination or show count for long lists.
- Row click opens detail; explicit row actions handle edit, duplicate, archive, delete.
- Selection enables batch actions: archive, assign, change status, delete, export.
- Empty state explains whether no records exist or filters hide results.
- URL state for shareable operational views when useful: search, filters, sort, page, pageSize, and view mode.
- Column visibility or display settings when the dataset has many optional fields.
- Saved views or segments for repeated operational filters, such as "Overdue", "Needs review", "High priority", "My items".
- Pinned columns for wide operational tables when identity/actions must remain visible.
- Density mode when the same table serves both review and bulk operation workflows.

Forge mapping:

- Toolbar: `Toolbar`, `ToolbarSearchInput`, `ToolbarFilterButton`, `ToolbarDatepicker`, `ToolbarShowSelect`, `ToolbarActions`.
- Data: `FullWidthTable` for full-page management lists; `DataTable` for embedded dashboard/detail tables; `StatusBadge`, `CellActions`, `CellKebabMenu`, `KebabMenu`, `Pagination`.
- Confirmation: `ConfirmationDialog` with controlled `open` / `onOpenChange`; omit `open` only for inline content in an existing host shell. Do not double-wrap controlled mode.
- Feedback: use inline form/list feedback for validation and recoverable errors. Forge exports `ToastProvider` and `useToast` (`toast`, `dismiss`, `update`). Place the hook below the provider or reuse the host notification system; durable failures still need inline feedback. `NotificationItem` remains suitable for notification centers and job lists.

From design systems: data table toolbars commonly host primary actions, search, filtering, table settings, and utilities; selected rows should reveal batch actions rather than forcing repetitive row-by-row work.

List anatomy:

```text
Page header:
  title, description, primary action, optional secondary actions
Toolbar:
  search, filters, date range, view switch, import/export, display settings
Bulk bar:
  appears only when rows are selected
Table/grid:
  identity column, comparable fields, status, owner, dates, actions
Footer:
  pagination, selected count, total count
Feedback:
  loading, empty, no-filter-results, error, permission denied
```

Bulk action rules:

- Make it clear whether selection covers current page only or all matching records.
- For cross-page selection, expose a "select all matching" choice.
- For async bulk jobs, show progress via toast/notification/job center.
- For partial failure, show "n of m failed" with a detail table or downloadable report.
- Bulk delete or irreversible bulk changes may require typed confirmation.

Filtering rules:

- Keep high-frequency filters visible.
- Move advanced filters into a panel.
- Show applied filters as chips or clearable state when space allows.
- Store search/filter/sort/page in URL when the view should survive refresh/share/back.

List implementation skeleton:

```tsx
"use client";

import {
  Button,
  CellText,
  CellTextSubtitle,
  FullWidthTable,
  KebabMenu,
  StatusBadge,
  TextField,
  Toolbar,
  ToolbarActions,
  ToolbarDatepicker,
  ToolbarFilterButton,
  type ColumnDef,
  type KebabMenuItem,
} from "@forge-ui-official/core";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AddCircleLinear, EyeLinear, PenLinear, TrashBinTrashLinear, MagniferLinear } from "@forge-ui-official/core/icons";

type OrderStatus = "draft" | "pending" | "paid" | "void";
type OrderRow = { id: string; number: string; customer: string; status: OrderStatus; updatedAt: string };
// Replace openOrder/openEdit/openDeleteConfirm with route pushes or dialog state from the host app.

const statusColor = {
  draft: "grey",
  pending: "yellow",
  paid: "green",
  void: "red",
} as const;

function useTableUrlState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(patch).forEach(([key, value]) => {
      if (value == null || value === "") next.delete(key);
      else next.set(key, value);
    });
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };
}

function getOrderActions(row: OrderRow): KebabMenuItem[] {
  const base: KebabMenuItem[] = [
    { label: "View", icon: <EyeLinear size={16} color="#71717A" />, onSelect: () => openOrder(row.id) },
    { label: "Edit", icon: <PenLinear size={16} color="#71717A" />, onSelect: () => openEdit(row.id) },
  ];
  if (row.status !== "paid") {
    base.push({
      label: "Delete",
      icon: <TrashBinTrashLinear size={16} color="var(--fg-red)" />,
      danger: true,
      onSelect: () => openDeleteConfirm(row.id),
    });
  }
  return base;
}

const columns: ColumnDef<OrderRow>[] = [
  { key: "number", header: "Order", sortable: true, flex: true,
    render: (row) => <CellTextSubtitle title={row.number} subtitle={row.customer} /> },
  { key: "status", header: "Status", width: "w-32",
    render: (row) => <StatusBadge label={row.status} color={statusColor[row.status]} /> },
  { key: "updatedAt", header: "Updated", sortable: true, width: "w-40",
    render: (row) => <CellText>{row.updatedAt}</CellText> },
  { key: "actions", header: "", width: "w-16",
    render: (row) => <KebabMenu items={getOrderActions(row)} /> },
];

export function OrdersList({ rows, selectedRows }: { rows: OrderRow[]; selectedRows: Set<number> }) {
  const setUrlState = useTableUrlState();

  return (
    <div className="flex w-full flex-col gap-4">
      <Toolbar
        left={
          <TextField
            placeholder="Search orders..."
            iconLeft={<MagniferLinear size={20} color="#71717A" />}
            onChange={(value) => setUrlState({ q: value, page: "1" })}
            className="w-80"
          />
        }
        right={
          <ToolbarActions>
            <ToolbarDatepicker label="Last 30 days" />
            <ToolbarFilterButton label="Filters" />
            <Button iconLeft={<AddCircleLinear size={16} color="white" />}>New order</Button>
          </ToolbarActions>
        }
      />
      <FullWidthTable<OrderRow>
        title="Orders"
        subtitle="Manage order lifecycle, payment status, and customer follow-up."
        columns={columns}
        rows={rows}
        showCheckbox
        selectedRows={selectedRows}
        showPagination
        currentPage={1}
        totalPages={8}
        onPageChange={(page) => setUrlState({ page: String(page) })}
        onSort={(sort) => setUrlState({ sort, page: "1" })}
        paginationLabel="Showing 1-20 of 156"
      />
    </div>
  );
}
```

`ToolbarSearchInput` is display-only today. When search needs to update URL state, use `TextField` with a search icon or a project wrapper that exposes `value` and `onChange`.

## Detail Page Contract

A detail page usually needs:

- Back navigation and breadcrumbs.
- Header summary: name/id, status, owner, key date, primary action.
- Summary cards only when they explain the object, not as decoration.
- Field groups: business identity, ownership, dates, financials, configuration.
- Related data: orders, tasks, files, members, invoices, usage, comments.
- History/audit: who changed what and when.
- Contextual actions: edit, duplicate, export, assign, change status, archive/delete.
- Danger actions with clear impact.
- A clear path back to the filtered list, not only browser back.

Forge mapping:

- Header: `AppLayout pageHeaderVariant="detail"`, `Breadcrumbs`, `PageHeader`.
- Fields: `DescriptionItem`, `ListGroup`, `ListItem`. `DescriptionItem` uses `content`, not `value`; `ListGroup` requires `title` and `items`.
- Related records: `TabBar`, `DataTable`, `FileCard`, `ChatBubble`, `HistoryGrouped`.

Detail tab candidates:

- Overview: summary and core fields.
- Activity: audit, status changes, comments.
- Related records: orders, tasks, invoices, usage, members.
- Files: attachments and uploads.
- Conversation: comments, chat, agent messages.
- Settings/configuration: rule fields, permissions, integration config.

Inspector/detail skeleton:

```tsx
<TabBar
  tabs={[
    { label: "Overview", active: true },
    { label: "Activity" },
  ]}
  onChange={(index) => setActiveTab(index)}
/>
<ListGroup
  title="Order profile"
  subtitle="Key fields and current routing owner."
  items={
    <>
      <DescriptionItem label="Order" content={order.number} />
      <DescriptionItem label="Customer" content={order.customer} />
      <DescriptionItem label="Owner" content={order.owner} />
      <ListItem title="Current status" subtitle={order.status} />
    </>
  }
/>
```

`TabBar` uses `tabs`, not `items/value`; active state lives on each tab item.

## Create / Edit Contract

A create/edit surface usually needs:

- Clear title: Create X, Edit X, Add member, Upload file.
- Sections by business meaning: basic info, configuration, permissions/owner, files, review.
- Defaults where safe; placeholders are not labels.
- Validation state near the relevant field.
- Save/Create primary action; Cancel/Back secondary action.
- For edit: show current status and warn when changing fields that affect downstream usage.
- For complex create/import: use a stepper with review before submit.
- Unsaved-change handling for multi-section forms, long forms, and edit routes.
- Server/API errors mapped to fields when possible; otherwise show a page/form-level error.
- Validation should exist at both client and server/API boundaries when the app has real mutations.
- On submit failure, show field errors, a summary/banner when useful, and guide the user to the first failing section.
- Long forms may need draft save or autosave; edit routes may need concurrent-edit handling.
- Conditional fields and repeatable field arrays should be driven by the object schema, not ad hoc visibility hacks.

Forge mapping:

- Forms: `TextField`, `TextArea`, `SelectOption`, `Datepicker`, `Checkbox`, `FileUpload`, `MediaUpload`, `Stepper`.
- Actions: `Button`, `IconButton`.
- Confirmation: `ConfirmationDialog` for cancel/discard or destructive state changes.

Form layout choices:

- Single-column: short forms and mobile.
- Two-column: dense business forms where fields are independent.
- Sectioned: complex entities; each section has heading, helper text, and grouped fields.
- Stepper: onboarding, import, complex creation, multi-stage workflow.
- Drawer/modal: quick add/edit while preserving table context.

Field error mapping skeleton:

```tsx
"use client";

import { useActionState, useState } from "react";
import { Button, TextField } from "@forge-ui-official/core";
import { createOrder, type OrderFormState } from "../actions";

export function OrderForm() {
  const [customer, setCustomer] = useState("");
  const [amount, setAmount] = useState("");
  const [state, action, pending] = useActionState<OrderFormState, FormData>(
    createOrder,
    {},
  );

  return (
    <form action={action} className="grid gap-5">
      <input type="hidden" name="customer" value={customer} />
      <input type="hidden" name="amount" value={amount} />
      <TextField
        id="customer"
        label="Customer"
        placeholder="Acme Inc."
        value={customer}
        onChange={setCustomer}
        state={state.fieldErrors?.customer ? "error" : "idle"}
        errorMessage={state.fieldErrors?.customer}
      />
      <TextField
        id="amount"
        label="Amount"
        placeholder="1200"
        suffix="USD"
        value={amount}
        onChange={setAmount}
        state={state.fieldErrors?.amount ? "error" : "idle"}
        errorMessage={state.fieldErrors?.amount}
      />
      {state.message && <p className="text-sm text-fg-grey-700">{state.message}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
```

`TextField` uses `state="error"` plus `errorMessage`; do not show validation only in a toast. `TextFieldProps` extends native input attributes (except `color`, `size`, `onChange`), so `name` and `type` are accepted; its `onChange` receives a string, not an event. Check form serialization for non-native controls separately.

## Data and State Lifecycle

Professional admin modules must account for data lifecycle:

- Loading: skeleton or stable frame; avoid layout jumps.
- Empty: no records yet; offer create/import when allowed.
- No results: filters/search hide records; offer clear filters.
- Error: explain failed operation and offer retry.
- Permission denied: explain missing access without leaking sensitive data.
- Mutating: disable duplicate submit, show progress, keep user context.
- Success: toast/inline feedback and navigate to list/detail as appropriate.
- Optimistic updates: only when rollback is understandable.
- Deleted/archived objects: decide whether they disappear, move to archive, or show restore.
- Partial degraded state: if one block fails but the list loads, degrade that block instead of failing the whole page.

State should drive actions. Do not show the same actions for every row if object status makes some actions invalid.

## Action and Dialog Rules

Common actions:

- Create, view, edit, duplicate, delete, archive, restore.
- Assign owner/member.
- Change status: enable/disable, publish/unpublish, approve/reject, mark paid, mark resolved.
- Import, export, download, print, send.
- Add attachment/comment/member/task.

Use inline actions for common row-level operations. Use overflow menus for less frequent actions. Use confirmation dialogs for destructive or irreversible actions. Use a form modal when the action has 1-5 fields and does not need a full page.

Dialog/drawer selection:

- Confirmation dialog: delete, archive, revoke, reset, void invoice, discard changes.
- Form modal: quick add/edit/assign/change status with a small field count.
- Drawer: create/update while keeping list context, especially modern admin templates. Forge exports controlled `Drawer` with `open`, `onOpenChange`, `title`, `children`, optional `footer` and `side`; verify installed-version props. A route-backed panel remains a separate navigation choice; do not infer a `Sheet` export.
- Full route: complex create/edit, deep validation, uploads, multi-step workflows.
- Alert/banner: non-blocking warnings such as sync delay, read-only mode, partial failure.

For high-risk deletion, require explicit confirmation text when appropriate, especially bulk delete or irreversible account/system operations.

Compatibility inline-mode skeleton (intentionally omits `open` inside one native dialog; new standalone confirmations should prefer controlled mode):

```tsx
"use client";

import { useRef } from "react";
import { ConfirmationDialog } from "@forge-ui-official/core";

export function DeleteOrderDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button type="button" onClick={() => dialogRef.current?.showModal()}>
        Delete
      </button>
      <dialog ref={dialogRef} className="rounded-card bg-transparent p-0 backdrop:bg-fg-black/40">
        <ConfirmationDialog
          color="red"
          title="Delete order"
          description="This removes the order from active operations."
          confirmLabel="Delete"
          onCancel={() => dialogRef.current?.close()}
          onConfirm={() => {
            dialogRef.current?.close();
            // call the delete server action or submit a hidden form here
          }}
        />
      </dialog>
    </>
  );
}
```

Optimistic and async actions:

- Optimistic is suitable for low-risk toggles, archive, row reorder, or dismiss operations with clear rollback.
- Avoid optimistic UI for payments, permission changes, irreversible deletes, and multi-record mutations unless rollback is explicit.
- Long-running operations should become jobs: show progress, allow leaving the page, and surface completion/failure later.

## State Model

Every module should model object states, not just labels.

Examples:

- Product: Draft, Published, Out of Stock, Archived.
- Order: New, Processing, Shipped, Delivered, Cancelled, Refunded.
- Project: Draft, In Progress, Blocked, Completed, Archived.
- Task: Not Started, In Progress, Blocked, Finished.
- Invoice: Draft, Sent, Paid, Pending, Overdue, Void.
- File: Uploading, Uploaded, Failed, Archived.

States influence available actions. For example, paid invoices may allow download/print but not delete; active rules may require disable before delete; uploaded files may allow preview/download/delete while failed files need retry/remove.

State transition rules:

- Treat states as a small state machine, not independent badges.
- For each state, decide allowed actions, disabled actions, and the reason.
- Disabled actions should explain why when useful; hide only actions the current role should never see.
- Irreversible transitions should explain side effects, such as cancelling pending work or revoking access.

State/action matrix example:

| Object | State | Likely actions |
|---|---|---|
| Invoice | Draft | edit, send, delete |
| Invoice | Sent/Pending | mark paid, resend, download, void |
| Invoice | Paid | download, print, refund/adjust if supported |
| Task | Not Started | start, assign, edit, delete |
| Task | In Progress | complete, block, comment, add file |
| Rule | Active | disable, duplicate, view usage |
| Rule | Disabled | enable, edit, delete |

Typed row action map example:

```tsx
import type { KebabMenuItem } from "@forge-ui-official/core";
import { EyeLinear, PenLinear, TrashBinTrashLinear } from "@forge-ui-official/core/icons";

type InvoiceStatus = "draft" | "sent" | "paid" | "void";
type Invoice = { id: string; status: InvoiceStatus };
// Replace viewInvoice/editInvoice/markPaid/etc. with host app routes or mutations.

const INVOICE_ACTIONS: Record<InvoiceStatus, (invoice: Invoice) => KebabMenuItem[]> = {
  draft: (invoice) => [
    { label: "View", icon: <EyeLinear size={16} color="#71717A" />, onSelect: () => viewInvoice(invoice.id) },
    { label: "Edit", icon: <PenLinear size={16} color="#71717A" />, onSelect: () => editInvoice(invoice.id) },
    { label: "Delete", icon: <TrashBinTrashLinear size={16} color="var(--fg-red)" />, danger: true, onSelect: () => confirmDelete(invoice.id) },
  ],
  sent: (invoice) => [
    { label: "View", icon: <EyeLinear size={16} color="#71717A" />, onSelect: () => viewInvoice(invoice.id) },
    { label: "Mark paid", onSelect: () => markPaid(invoice.id) },
    { label: "Void", danger: true, onSelect: () => confirmVoid(invoice.id) },
  ],
  paid: (invoice) => [
    { label: "View", icon: <EyeLinear size={16} color="#71717A" />, onSelect: () => viewInvoice(invoice.id) },
    { label: "Download", onSelect: () => downloadInvoice(invoice.id) },
    { label: "Print", onSelect: () => printInvoice(invoice.id) },
  ],
  void: (invoice) => [
    { label: "View", icon: <EyeLinear size={16} color="#71717A" />, onSelect: () => viewInvoice(invoice.id) },
  ],
};

// In a table column:
// render: (row) => <KebabMenu items={INVOICE_ACTIONS[row.status](row)} />
```

## Permissions and Roles

Admin UI should reflect role and permission boundaries:

- Hide actions the role can never perform.
- Disable actions that are temporarily unavailable and explain why.
- Separate visibility permission from mutation permission.
- Include ownership/assignee fields when workflows depend on responsibility.
- Dangerous actions should remain discoverable to authorized users but visually separated.
- Permission states need useful next steps: request access, switch workspace, contact admin.

## Information Architecture

Navigation should follow user work, not database tables alone:

- Put high-frequency modules near the top of sidebar.
- Group by domain: Dashboard, Operations, Customers, Projects, Finance, Team, Settings.
- Use dashboard pages as entry points to work queues and resource lists.
- Use resource pages for daily operations.
- Use settings pages for low-frequency configuration.
- Use labels users recognize from the business, not implementation names.

System-level navigation pattern:

```text
Dashboard / Workbench
Operations
  Core object A
  Core object B
  Queue / approvals / tasks
Relationships
  Customers / clients / members
  Files / documents / messages
Finance / output
  Invoices / reports / exports
Governance
  Settings / roles / audit / integrations
```

The page title, sidebar, breadcrumbs, table row links, detail tabs, and action labels should all agree on this information architecture. If they feel unrelated, the UI will look like a component demo rather than a system.

## Next.js / Module Organization

When building in a Next.js-style project, organize a module so business logic and UI surfaces are discoverable:

```text
app/<module>/page.tsx
app/<module>/new/page.tsx
app/<module>/[id]/page.tsx
app/<module>/[id]/edit/page.tsx
app/<module>/_components/
app/<module>/_data.ts
app/<module>/_schema.ts
```

For small template/demo modules, modal/drawer state can live in the page. For real apps, prefer feature-local components:

```text
features/<module>/
  components/<module>-table.tsx
  components/<module>-columns.tsx
  components/<module>-dialogs.tsx
  components/<module>-form.tsx
  data/schema.ts
```

Modern admin templates often use:

- table columns in a separate file,
- provider/context for dialog state,
- URL-synced table state,
- shared confirm dialog,
- shared table toolbar/pagination/bulk actions,
- schema validation for mutation forms.

Next.js App Router conventions:

- Use `searchParams` as the source of truth for shareable list search/filter/sort/page state.
- In Next.js 16, `searchParams` in Server Components is async. Type it as a `Promise` and `await` it before reading filters.
- Use `loading.tsx` or Suspense boundaries to keep admin pages responsive.
- Mutations can use Server Actions or route handlers depending on the host app convention.
- Revalidate list/detail data after successful mutations.
- Admin lists and details are usually dynamic user/workspace data; avoid caching them as static marketing content.
- Keep client components focused on interactivity: tables, filters, forms, dialogs, drawers, optimistic state.

Minimal App Router skeleton:

```tsx
// app/orders/page.tsx
import { OrdersScreen } from "./_components/orders-screen";
import { listOrders } from "./_data";

type Search = {
  q?: string;
  status?: string;
  sort?: string;
  page?: string;
  pageSize?: string;
};

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const params = await searchParams;
  const data = await listOrders({
    q: params.q ?? "",
    status: params.status ?? "all",
    sort: params.sort ?? "updatedAt:desc",
    page: Number(params.page ?? 1),
    pageSize: Number(params.pageSize ?? 20),
  });

  return <OrdersScreen data={data} initialParams={params} />;
}
```

```tsx
// app/orders/_components/orders-screen.tsx
"use client";

import { AppLayout } from "@forge-ui-official/core";
import { useState } from "react";
import { OrdersTable } from "./orders-table";

type Search = { q?: string; status?: string; sort?: string; page?: string; pageSize?: string };
type OrdersResult = { rows: OrderRow[]; total: number };
// CreateOrderDialog is the host app's create form dialog. Keep AppLayout in this client component when it needs onClick actions.

export function OrdersScreen({
  data,
  initialParams,
}: {
  data: OrdersResult;
  initialParams: Search;
}) {
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <>
      <AppLayout
        pageTitle="Orders"
        primaryAction={{ label: "New order", onClick: () => setCreateOpen(true) }}
      >
        <OrdersTable data={data} initialParams={initialParams} />
      </AppLayout>
      {createOpen && <CreateOrderDialog onClose={() => setCreateOpen(false)} />}
    </>
  );
}
```

`AppLayout` is a client component. Server pages should pass serializable data into a client screen when header actions need `onClick`; do not pass functions from a Server Component into `primaryAction`.

教学片段：下列 _data 层必须在实际写入之前执行会话、租户、对象权限与状态迁移校验；未接入时不得用于真实数据。

```tsx
// app/orders/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { archiveOrderById } from "./_data";

export type ArchiveState = {
  ok?: boolean;
  fieldErrors?: Record<string, string>;
  message?: string;
};

export async function archiveOrder(
  _previous: ArchiveState,
  formData: FormData,
): Promise<ArchiveState> {
  const id = String(formData.get("id") ?? "");
  if (!id) return { fieldErrors: { id: "Order id is required" } };

  await archiveOrderById(id);
  revalidatePath("/orders");
  revalidatePath(`/orders/${id}`);
  return { ok: true, message: "Order archived" };
}
```

```tsx
// app/orders/_components/archive-order-dialog.tsx
"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ConfirmationDialog } from "@forge-ui-official/core";
import { archiveOrder, type ArchiveState } from "../actions";

export function ArchiveOrderDialog({ orderId }: { orderId: string }) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState<ArchiveState, FormData>(
    archiveOrder,
    {},
  );

  useEffect(() => {
    if (state.ok) {
      // Use the host toast system if it exists; otherwise close the dialog
      // and show inline success in the table/detail surface.
      dialogRef.current?.close();
      router.refresh();
    }
  }, [router, state.ok]);

  return (
    <>
      <button type="button" onClick={() => dialogRef.current?.showModal()}>
        Archive
      </button>
      <form ref={formRef} action={action} className="sr-only">
        <input type="hidden" name="id" value={orderId} />
      </form>
      <dialog ref={dialogRef} className="rounded-card bg-transparent p-0 backdrop:bg-fg-black/40">
        <div className="flex flex-col gap-3">
          {state.message && <p className="text-sm text-fg-grey-700">{state.message}</p>}
          {state.fieldErrors?.id && <p className="text-sm text-fg-red">{state.fieldErrors.id}</p>}
          <ConfirmationDialog
            title="Archive order"
            description="Archived orders leave the active queue."
            color="red"
            confirmLabel={pending ? "Archiving..." : "Archive"}
            onCancel={() => dialogRef.current?.close()}
            onConfirm={() => formRef.current?.requestSubmit()}
          />
        </div>
      </dialog>
    </>
  );
}
```

Optimistic row action skeleton:

```tsx
"use client";

import { useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateOrderStatus } from "../actions";

type Order = { id: string; status: "active" | "paused" };

function StatusToggle({ row }: { row: Order }) {
  const router = useRouter();
  const [optimistic, setOptimistic] = useOptimistic(row.status);
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        const next = optimistic === "active" ? "paused" : "active";
        startTransition(async () => {
          setOptimistic(next);
          const result = await updateOrderStatus(row.id, next);
          if (!result.ok) {
            // Show inline/toast feedback using the host app system.
            setOptimistic(row.status);
            router.refresh();
          }
        });
      }}
    >
      {optimistic}
    </button>
  );
}
```

Route-backed modal/drawer sketch:

```text
app/orders/page.tsx
app/orders/[id]/page.tsx
app/orders/@modal/(.)[id]/page.tsx
app/orders/@modal/default.tsx
```

`@modal/default.tsx` should return `null`. Use route-backed modal/drawer only when the selected object needs share/back/refresh behavior. Quick transient dialogs can stay in local state.

## Content Density

Admin pages should feel operational, not like a written report.

- Replace long explanatory prose with labels, statuses, row metadata, helper text, and tooltips.
- Prefer short action labels: Create, Edit, Export, Assign, Archive.
- Use cards for repeated entities or summaries; use tables for comparison and operations.
- Use dashboard copy to clarify metrics, not to explain the whole feature.
- Every prominent block should answer: what is this, what changed, what can the user do next?

Make the content behave like a system:

- KPIs should link to the underlying filtered list or queue.
- Todo/exception cards should have owner, priority, due/SLA, and action.
- Detail surfaces should show related objects, not only fields.
- Settings should include real control groups such as integrations, roles, notifications, API keys, webhooks, or billing.
- Activity/audit should show actor, action, object, time, and result.
- Empty states should offer create/import/connect/sample data, depending on the module.

Translate prose into operational UI:

- "Users can manage templates" -> template list, create action, status, last updated, row actions.
- "Admins review anomalies" -> queue with severity/status/owner, detail panel, resolve/assign actions.
- "Configure rules" -> settings groups, rule table, enable/disable, test, duplicate, delete.
- "Generate reports" -> form/stepper, output table, download/export, history.

## Admin Anti-Patterns

Watch for these failure modes:

- Turning a management module into a report page with many descriptive cards and no object actions.
- Hiding search/filter/sort/pagination in custom UI instead of using a recognizable toolbar/table pattern.
- Putting a naked delete button in a row without a menu or confirmation path.
- Showing the same actions for every row regardless of object state.
- Keeping filter/page state only in local React state when the view should be shareable.
- Using toast-only validation instead of field-level feedback.
- Making a detail page with only fields and no related records, history, or next action.
- Using color alone for status; pair color with text and, when useful, icon/shape.
- Creating long explanatory copy where labels, statuses, row metadata, helper text, or tooltips would work better.
- Building only one CRUD table when the user asked for a system.
- Using sidebar items that do not correspond to visible modules or routes.
- Showing KPIs that do not link to any list, queue, or detail page.
- Omitting settings, permissions, audit, imports/exports, or job/notification feedback from a business system.

## Generation Checklist

Before coding, decide:

- Is the user asking for a page, a module, or a system?
- If system: what is the navigation/module map?
- What is the workbench/dashboard entry into daily operations?
- What supporting surfaces make it feel complete: settings, permissions, files, billing, messages, audit, jobs?
- What is the primary object?
- Does it have lifecycle states?
- Is this page mainly for insight, management, workflow, collaboration, or configuration?
- What are the top 3 user actions?
- Which actions are row-level, page-level, bulk, or dangerous?
- Does the module need list/detail/create/edit screens or a smaller modal flow?
- What filters and sorts help users find work?
- What detail tabs reveal related data?
- What empty/error/permission states are needed?
- Which Forge template is closest: ecommerce products/orders/customers/categories/sellers, project projects/members/clients/files/invoices/tasks, dashboard analytics/crm/finance/project?
- What resource contract will be implemented: list/create/show/edit/delete, or a deliberate subset?
- Which table state should live in URL?
- Which mutations need modal, drawer, full page, or inline edit?
- Which actions are hidden/disabled by role or object state?
- What does success do: stay, close modal, refresh table, navigate detail, or return to list?

Then write the UI.

## 中文实施补充

先定义对象画布：对象标识、负责人、生命周期、权限、输入输出、证据和下一步动作，再选择页面地图。导入导出等异步任务要提供进度、失败原因、重试和结果下载。配置模块需给出测试结果、影响范围、回滚和审计；仅设计任务不接接口或扩展为完整系统。

## 服务端示例安全前提

以上 Server Action 是教学片段，不是可直接部署的安全实现。archiveOrderById 必须在实际持久化之前验证当前会话、租户归属、对象级权限和允许状态迁移；只检查 id 或隐藏按钮不构成授权。未接入这些能力不得接真实数据或报告上线就绪。
