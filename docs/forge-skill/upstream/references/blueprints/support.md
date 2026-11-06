# Blueprint: Support And Ticketing

Use for customer support, ticket queues, SLA handling, inboxes, knowledge base, and agent operations.

## System Brief Defaults

```yaml
archetype: support
primary_users:
  - role: Support agent
    jobs: [triage tickets, reply, assign, resolve]
  - role: Support lead
    jobs: [monitor SLA, balance workload, audit quality]
  - role: Admin
    jobs: [configure channels, macros, permissions]
nav_groups:
  - label: Workbench
    modules: [inbox, SLA risk, unassigned]
  - label: Support
    modules: [tickets, customers, knowledge base]
  - label: Team
    modules: [agents, workload]
  - label: Governance
    modules: [settings, audit, automations]
modules:
  - name: Tickets
    type: core
    primary_object: Ticket
  - name: Customers
    type: support
    primary_object: Customer
  - name: Knowledge Base
    type: support
    primary_object: Article
  - name: Automations
    type: governance
    primary_object: Rule
```

## State Models

Ticket states:

```text
open -> pending -> resolved -> closed
open -> assigned -> pending
pending -> waiting_customer
closed -> reopened
waiting_customer -> assigned | pending
reopened -> assigned | pending
```

## Core Routes

```text
/inbox
/tickets
/tickets/[id]
/customers
/customers/[id]
/knowledge
/knowledge/[id]/edit
/team/agents
/settings/automations
/settings/audit
```

## Forge Mapping

- Inbox: master-detail with `ListGroup` or `DataTable` plus detail panel
- Conversation: `ContactItem`, `ChatBubble`, `ChatInputBar`
- Ticket fields: `DescriptionItem`, `StatusBadge`, `TabBar`, `HistoryGrouped`
- Team workload: `StatCard`, `DataTable`, `AvatarGroup`
- Automations: `DataTable`, `Toggle`, `SelectOption`, `ConfirmationDialog`

## Avoid These Mistakes

- Do not build support as a static dashboard only; agents need an inbox and reply flow.
- Do not omit customer context next to ticket detail.
- Do not use the same actions for closed, pending, and reopened tickets.

## 实施边界

这些状态/路由是业务蓝图建议，不代表已有后端。实施前确认每条迁移的权限、责任人、失败/重试、并发与审计；support 还需确认 SLA、等待客户与重开计时口径。仅执行已授权范围。
