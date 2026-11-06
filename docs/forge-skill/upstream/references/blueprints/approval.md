# Blueprint: Approval Workflow

Use for approvals, reviews, publishing workflows, requests, compliance checks, document approval, expense approval, and change control.

## System Brief Defaults

```yaml
archetype: approval
primary_users:
  - role: Requester
    jobs: [create request, track status, respond to changes]
  - role: Reviewer
    jobs: [review queue, approve, reject, request changes]
  - role: Admin
    jobs: [configure rules, monitor audit, manage permissions]
nav_groups:
  - label: Workbench
    modules: [my queue, SLA risk, recent decisions]
  - label: Requests
    modules: [all requests, drafts, submitted]
  - label: Review
    modules: [approval queue, escalations]
  - label: Governance
    modules: [rules, roles, audit]
modules:
  - name: Requests
    type: core
    primary_object: Request
  - name: Approval Queue
    type: core
    primary_object: ApprovalTask
  - name: Rules
    type: governance
    primary_object: ApprovalRule
  - name: Audit
    type: governance
    primary_object: AuditEvent
```

## State Models

Request states:

```text
draft -> submitted -> reviewing -> approved
reviewing -> rejected
reviewing -> changes_requested -> submitted
approved -> published
```

Approval task states:

```text
pending -> claimed -> approved
pending | claimed -> rejected
claimed -> changes_requested
pending -> escalated
```

## Core Routes

```text
/workbench
/requests
/requests/new
/requests/[id]
/requests/[id]/edit
/approval-queue
/approval-queue/[id]
/rules
/rules/new
/settings/roles
/settings/audit
```

## Forge Mapping

- Queue: `FullWidthTable`, `Toolbar`, `StatusBadge`, `Pagination`
- Detail/inspector: `DescriptionItem`, `TabBar`, `ListGroup`, `HistoryGrouped`
- Request creation: `Stepper`, `TextField`, `TextArea`, `SelectOption`, `FileUpload`
- Rule configuration: `DataTable`, `Toggle`, `SelectOption`
- Decisions: controlled `ConfirmationDialog` (or inline mode inside an existing shell) for approve/reject/request changes when impact matters

## Avoid These Mistakes

- Do not treat approval as normal CRUD only; it needs queue ownership, state transitions, and audit.
- Do not allow approve/reject without showing impact and required comments when the domain requires it.
- Do not omit rules and audit in admin-facing approval systems.

