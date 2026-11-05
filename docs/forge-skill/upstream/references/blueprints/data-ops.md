# Blueprint: Data And Reporting Operations

Use for reporting consoles, datasets, imports, scheduled exports, dashboards, data quality, and background jobs.

## System Brief Defaults

```yaml
archetype: data-ops
primary_users:
  - role: Analyst
    jobs: [build reports, inspect data quality, export results]
  - role: Operator
    jobs: [monitor imports, retry failed jobs, publish datasets]
  - role: Admin
    jobs: [manage sources, permissions, schedules]
nav_groups:
  - label: Workbench
    modules: [freshness, failed jobs, popular reports]
  - label: Data
    modules: [datasets, sources, import jobs]
  - label: Reporting
    modules: [reports, templates, exports]
  - label: Governance
    modules: [permissions, audit, schedules]
modules:
  - name: Datasets
    type: core
    primary_object: Dataset
  - name: Reports
    type: core
    primary_object: Report
  - name: Jobs
    type: support
    primary_object: Job
  - name: Exports
    type: support
    primary_object: Export
```

## State Models

Job states:

```text
queued -> running -> success
running -> failed
failed -> retrying -> running
success -> archived
```

Report states:

```text
draft -> scheduled -> published
published -> archived
```

## Core Routes

```text
/workbench
/datasets
/datasets/new
/datasets/[id]
/reports
/reports/new
/reports/[id]
/jobs
/jobs/[id]
/exports
/settings/schedules
/settings/audit
```

## Forge Mapping

- Workbench: `StatCard`, charts, job warning `ListGroup`
- Dataset/report lists: `FullWidthTable`, `Toolbar`, `StatusBadge`
- Job center: `DataTable`, `ProgressBar`, `StatusBadge`, retry actions
- Import wizard: `Stepper`, `FileUpload`, preview `DataTable`
- Report detail: chart cards, detail table, export action, `HistoryGrouped`

## Avoid These Mistakes

- Do not make reports only charts; include freshness, source, filters, detail rows, and export behavior.
- Do not hide failed jobs in transient toasts; job status needs a durable surface.
- Do not skip import validation and preview for uploaded data.

