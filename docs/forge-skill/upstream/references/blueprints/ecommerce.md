# Blueprint: Commerce Operations

Use for ecommerce, retail operations, marketplace operations, order management, inventory, sellers, refunds, and product catalogs.

## System Brief Defaults

```yaml
archetype: commerce-ops
primary_users:
  - role: Operator
    jobs: [process orders, handle refunds, review stock alerts]
  - role: Merchandiser
    jobs: [manage products, categories, pricing]
  - role: Finance reviewer
    jobs: [review invoices, payments, refunds]
nav_groups:
  - label: Workbench
    modules: [overview, exception queue]
  - label: Commerce
    modules: [products, orders, customers, inventory]
  - label: Finance
    modules: [invoices, payments, refunds]
  - label: Governance
    modules: [settings, audit, integrations]
modules:
  - name: Orders
    type: core
    primary_object: Order
  - name: Products
    type: core
    primary_object: Product
  - name: Customers
    type: support
    primary_object: Customer
  - name: Invoices
    type: support
    primary_object: Invoice
  - name: Audit
    type: governance
    primary_object: AuditEvent
```

## State Models

Order states:

```text
draft -> pending_payment -> paid -> fulfillment -> shipped -> delivered
pending_payment -> cancelled
paid -> refunded
fulfillment -> exception
exception -> fulfillment | cancelled
```

Invoice states:

```text
draft -> sent -> paid
sent -> overdue
draft | sent -> void
```

Product states:

```text
draft -> active -> archived
active -> out_of_stock
out_of_stock -> active
```

## Core Routes

```text
/overview
/orders
/orders/new
/orders/[id]
/orders/[id]/edit
/orders/[id]/refund
/products
/products/new
/products/[id]
/customers
/customers/[id]
/invoices
/settings/audit
```

## Forge Mapping

- Shell: `AppLayout`
- Workbench: `StatCard`, chart cards, exception `ListGroup`
- Orders/products/customers lists: `FullWidthTable`, `Toolbar`, `StatusBadge`, `KebabMenu`, `Pagination`
- Detail: `DescriptionItem`, `TabBar`, `ListGroup`, `HistoryGrouped`, embedded `DataTable`
- Forms: `TextField`, `TextArea`, `SelectOption`, `Datepicker`, `FileUpload`, `MediaUpload`
- Dangerous actions: `ConfirmationDialog`

## Avoid These Mistakes

- Do not model orders as `active/inactive`.
- Do not give refunded, cancelled, and shipped orders the same row actions.
- Do not make the dashboard end at metrics; every exception should link to an order/customer/product queue.
- Do not hide invoices/refunds if the scope includes operations or finance.

