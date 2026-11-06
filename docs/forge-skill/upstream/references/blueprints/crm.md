# Blueprint: CRM And Pipeline

Use for CRM, sales pipeline, contacts, companies, deals, activities, account management, and forecasts.

## System Brief Defaults

```yaml
archetype: crm
primary_users:
  - role: Sales rep
    jobs: [manage leads, update deals, log activities]
  - role: Sales manager
    jobs: [review pipeline, forecast revenue, coach reps]
  - role: Admin
    jobs: [configure pipeline, fields, permissions]
nav_groups:
  - label: Workbench
    modules: [pipeline health, my activities, at-risk deals]
  - label: Sales
    modules: [deals, contacts, companies]
  - label: Activity
    modules: [tasks, notes, calendar]
  - label: Governance
    modules: [settings, audit]
modules:
  - name: Deals
    type: core
    primary_object: Deal
  - name: Contacts
    type: core
    primary_object: Contact
  - name: Companies
    type: support
    primary_object: Company
  - name: Activities
    type: support
    primary_object: Activity
```

## State Models

Deal states:

```text
lead -> qualified -> proposal -> negotiation -> won
qualified | proposal | negotiation -> lost
won -> archived
```

Activity states:

```text
scheduled -> completed
scheduled -> overdue
scheduled -> cancelled
```

## Core Routes

```text
/workbench
/deals
/deals/new
/deals/[id]
/contacts
/contacts/[id]
/companies
/companies/[id]
/activities
/settings/pipeline
/settings/audit
```

## Forge Mapping

- Pipeline: card/kanban style with `TaskCard`/business cards, filters, and status columns
- Lists: `FullWidthTable`, `Toolbar`, `StatusBadge`, `Pagination`
- Detail: `TabBar`, `DescriptionItem`, `ListGroup`, `HistoryGrouped`, related activity table
- Calendar/tasks: calendar components, `ListGroup`, `Datepicker`

## Avoid These Mistakes

- Do not show deals without stage, value, owner, next activity, and close date.
- Do not isolate contacts from companies and deals.
- Do not make forecast metrics unclickable; they should drill into filtered deals.

