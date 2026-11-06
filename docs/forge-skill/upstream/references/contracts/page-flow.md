# Page Flow Contract

Use this after the module contract. It defines routes, entry points, and exits before implementation.

## Required Output

```yaml
routes:
  - path: ""
    purpose: ""
    surface: "page | modal | drawer | inspector | stepper"
entry_points:
  - from: "sidebar | workbench-kpi | queue | related-record | global-search"
    to: ""
exits:
  - from: ""
    to: ""
breadcrumbs:
  - route: ""
    trail: []
url_state_keys:
  - route: ""
    keys: []
mobile_behavior: ""
```

## Common Route Sets

Resource module:

```text
/objects
/objects/new
/objects/[id]
/objects/[id]/edit
delete/archive confirmation
```

Workflow queue:

```text
/queue
/queue?status=...
/queue/[id]
/queue/[id]/activity
approve/reject/request-changes confirmation
```

Settings module:

```text
/settings
/settings/team
/settings/roles
/settings/integrations
/settings/audit
```

## Quality Bar

- Sidebar items should resolve to real routes.
- Dashboard or workbench links should open filtered work, not dead buttons.
- Detail pages need a way back to list context.
- Route-backed modals or drawers are useful when the selected object should be shareable.

