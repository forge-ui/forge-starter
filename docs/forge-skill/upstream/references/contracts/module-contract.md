# Module Contract

Use this after the System Brief and before composing a core admin module.

The module contract defines the business object lifecycle, not the visual layout.

## Required Output

```yaml
module: ""
primary_object: ""
secondary_objects: []
roles_permissions:
  - role: ""
    can: []
states: []
transitions:
  - from: ""
    action: ""
    to: ""
    guard: ""
state_action_matrix:
  - state: ""
    available_actions: []
    disabled_actions: []
list_contract:
  route: ""
  search_fields: []
  filters: []
  sorts: []
  url_state: ["search", "filters", "sort", "page", "pageSize"]
  bulk_actions: []
  row_actions: []
detail_contract:
  route: ""
  header_fields: []
  tabs: []
  related_records: []
  primary_actions: []
mutation_surfaces:
  create: "route | modal | drawer | inline"
  edit: "route | modal | drawer | inline"
  delete_or_archive: "confirm-dialog"
feedback_states:
  loading: true
  empty: true
  no_results: true
  error: true
  permission: true
  success: true
closest_template: ""
```

## Quality Bar

- Row actions should depend on object state. Avoid the same action set on every row.
- Detail must include related records or activity; a field-only detail page is incomplete.
- Create/edit forms should be grouped by business meaning, not by visual convenience.
- Dangerous actions must use controlled `ConfirmationDialog`, or inline content inside one existing shell.
- List state should be in URL when the view is operational or shareable.

