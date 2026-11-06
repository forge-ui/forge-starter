# Blueprint: Governance And Settings

Use for settings, users, roles, permissions, audit logs, integrations, API keys, webhooks, notifications, and system rules.

## System Brief Defaults

```yaml
archetype: governance
primary_users:
  - role: Admin
    jobs: [configure system, manage users, review audit]
  - role: Security reviewer
    jobs: [inspect permissions, rotate keys, investigate events]
nav_groups:
  - label: Settings
    modules: [general, team, roles, notifications]
  - label: Integrations
    modules: [connected apps, API keys, webhooks]
  - label: Governance
    modules: [audit, policies, danger zone]
modules:
  - name: Team
    type: core
    primary_object: User
  - name: Roles
    type: core
    primary_object: Role
  - name: Integrations
    type: support
    primary_object: Integration
  - name: Audit
    type: governance
    primary_object: AuditEvent
```

## State Models

User states:

```text
invited -> active
active -> suspended
suspended -> active
active | suspended -> deactivated
```

API key states:

```text
active -> rotated
active | rotated -> revoked
```

Integration states:

```text
disconnected -> connected
connected -> failing
failing -> connected
connected -> disconnected
```

## Core Routes

```text
/settings
/settings/team
/settings/roles
/settings/integrations
/settings/api-keys
/settings/webhooks
/settings/notifications
/settings/audit
/settings/danger
```

## Forge Mapping

- Settings groups: `ListGroup`, `TabBar`, `ButtonGroup`
- Team: `UserCard`, `AvatarGroup`, `FullWidthTable`, `StatusBadge`
- Roles/rules: `DataTable`, `Toggle`, `SelectOption`
- Audit: `HistoryGrouped`, `Toolbar`, filters
- Danger actions: `ConfirmationDialog`

## Avoid These Mistakes

- Do not put dangerous actions next to normal save buttons.
- Do not expose API key values after creation unless the product explicitly supports it.
- Do not omit actor, action, object, time, and result from audit events.

