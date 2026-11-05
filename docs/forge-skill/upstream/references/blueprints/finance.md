# Blueprint: Finance Operations

Use for invoices, payments, refunds, subscriptions, payouts, disputes, taxes, and financial reporting.

## System Brief Defaults

```yaml
archetype: finance
primary_users:
  - role: Finance operator
    jobs: [review invoices, reconcile payments, handle refunds]
  - role: Manager
    jobs: [monitor overdue risk, approve voids, export reports]
  - role: Admin
    jobs: [manage tax, integrations, permissions]
nav_groups:
  - label: Workbench
    modules: [cash position, overdue, exceptions]
  - label: Finance
    modules: [invoices, payments, refunds, subscriptions]
  - label: Reporting
    modules: [exports, statements]
  - label: Governance
    modules: [tax settings, audit, integrations]
modules:
  - name: Invoices
    type: core
    primary_object: Invoice
  - name: Payments
    type: core
    primary_object: Payment
  - name: Refunds
    type: support
    primary_object: Refund
  - name: Exports
    type: support
    primary_object: Export
```

## State Models

Invoice states:

```text
draft -> sent -> paid
sent -> overdue
draft | sent -> void
paid -> refunded
```

Payment states:

```text
pending -> succeeded
pending -> failed
succeeded -> disputed
succeeded -> refunded
```

## Core Routes

```text
/workbench
/invoices
/invoices/new
/invoices/[id]
/payments
/payments/[id]
/refunds
/exports
/settings/tax
/settings/audit
```

## Forge Mapping

- Lists: `FullWidthTable`, `Toolbar`, `StatusBadge`, `Pagination`
- Invoice detail: `DescriptionItem`, line-item `DataTable`, `Button`, `HistoryGrouped`
- Export/job surfaces: `DataTable`, `ProgressBar`, `StatusBadge`
- Settings: `ListGroup`, `Toggle`, `SelectOption`, `TextField`
- Destructive finance actions: `ConfirmationDialog`

## Avoid These Mistakes

- Do not treat paid, overdue, void, and refunded invoices the same.
- Do not omit audit history for financial state changes.
- Do not hide export/reconciliation jobs as temporary notifications.

