# Blueprint: Project Operations

Use for project management, client delivery, agency operations, internal work management, tasks, files, members, milestones, and invoices.

## System Brief Defaults

```yaml
archetype: project-ops
primary_users:
  - role: Project manager
    jobs: [track health, assign tasks, manage blockers]
  - role: Contributor
    jobs: [complete tasks, upload files, comment on work]
  - role: Client or finance reviewer
    jobs: [review deliverables, approve invoices]
nav_groups:
  - label: Workbench
    modules: [overview, my work, blockers]
  - label: Delivery
    modules: [projects, tasks, milestones, files]
  - label: People
    modules: [clients, members]
  - label: Finance
    modules: [invoices]
  - label: Governance
    modules: [settings, audit]
modules:
  - name: Projects
    type: core
    primary_object: Project
  - name: Tasks
    type: core
    primary_object: Task
  - name: Files
    type: support
    primary_object: File
  - name: Members
    type: support
    primary_object: Member
  - name: Invoices
    type: support
    primary_object: Invoice
```

## State Models

Project states:

```text
planning -> active -> at_risk -> completed
active -> completed
at_risk -> active
at_risk -> completed
active -> paused
paused -> active
active | at_risk -> archived
```

Task states:

```text
todo -> in_progress -> review -> done
in_progress -> blocked
blocked -> in_progress
review -> changes_requested -> in_progress
```

## Core Routes

```text
/overview
/projects
/projects/new
/projects/[id]
/projects/[id]/edit
/projects/[id]/tasks
/projects/[id]/files
/projects/[id]/members
/tasks
/members
/files
/invoices
/settings/audit
```

## Forge Mapping

- Closest templates: `/templates/project-template/{overview,projects,members,files,invoices,clients}`; task list `/templates/task-board`, detail `/templates/project-template/tasks/[id]`
- Shell: `AppLayout`
- Project/task lists: `FullWidthTable`, `Toolbar`, `StatusBadge`, `KebabMenu`, `Pagination`
- Project detail: `TabBar`, `DescriptionItem`, related `DataTable`, `HistoryGrouped`
- Cards or kanban: `ProjectCard`, `TaskCard`, `ProgressCard`, `FilterGroup`
- Files: `FileCard`, `FileUpload`, `FileTypeIcon`
- Members: `UserCard`, `AvatarGroup`

## Avoid These Mistakes

- Do not make project detail a plain field card; include tasks, files, members, invoices, and activity.
- Do not show tasks without assignee, due date, priority, status, and blocker handling.
- Do not make dashboard shortcuts dead cards; they should link to overdue tasks, blockers, or project detail.

## 实施边界

这些状态/路由是业务蓝图建议，不代表已有后端。实施前确认每条迁移的权限、责任人、失败/重试、并发与审计；support 还需确认 SLA、等待客户与重开计时口径。仅执行已授权范围。
