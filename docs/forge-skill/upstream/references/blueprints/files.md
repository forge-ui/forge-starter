# Blueprint: File Operations

Use for file managers, document repositories, media libraries, attachments, versions, shares, permissions, and recycle bins.

## System Brief Defaults

```yaml
archetype: files
primary_users:
  - role: Contributor
    jobs: [upload, organize, share files]
  - role: Reviewer
    jobs: [preview, approve, comment]
  - role: Admin
    jobs: [manage permissions, retention, audit]
nav_groups:
  - label: Workbench
    modules: [recent files, failed uploads, shared with me]
  - label: Library
    modules: [files, folders, tags, versions]
  - label: Sharing
    modules: [shared links, permissions]
  - label: Governance
    modules: [retention, audit, recycle bin]
modules:
  - name: Files
    type: core
    primary_object: File
  - name: Folders
    type: core
    primary_object: Folder
  - name: Shares
    type: support
    primary_object: Share
  - name: Audit
    type: governance
    primary_object: AuditEvent
```

## State Models

File states:

```text
uploading -> uploaded
uploading -> failed
uploaded -> archived
uploaded -> deleted
deleted -> uploaded (restore)
archived -> uploaded (unarchive)
failed -> uploading (retry)
```

## Core Routes

```text
/files
/files/[id]
/folders/[id]
/shared
/uploads
/recycle-bin
/settings/permissions
/settings/audit
```

## Forge Mapping

- File list: `FullWidthTable`, `Toolbar`, `FileTypeIcon`, `KebabMenu`
- Grid: `FileCard`
- Upload: `FileUpload`, progress state, retry action
- Detail: `DescriptionItem`, `TabBar`, `HistoryGrouped`, related versions table
- Permissions: `ListGroup`, `UserCard`, `AvatarGroup`, `ConfirmationDialog`

## Avoid These Mistakes

- Do not build only a gallery; file systems need permissions, versions, and delete/restore.
- Do not omit failed upload and retry states.
- Do not make delete irreversible unless the product explicitly requires it.

## 实施边界

这些状态/路由是业务蓝图建议，不代表已有后端。实施前确认每条迁移的权限、责任人、失败/重试、并发与审计；support 还需确认 SLA、等待客户与重开计时口径。仅执行已授权范围。
