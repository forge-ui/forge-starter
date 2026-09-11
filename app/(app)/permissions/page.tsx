"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  MagniferLinear,
  PenLinear,
  TrashBinMinimalisticLinear,
} from "solar-icon-set";
import {
  Breadcrumbs,
  Button,
  ButtonGroup,
  CellMuted,
  CellText,
  ConfirmationDialog,
  DataTable,
  IconButton,
  PlusIcon,
  TextField,
  type ColumnDef,
} from "@forge-ui-official/core";
import { siteConfig } from "@/config/site";
import { usePermissionsStore } from "@/components/permissions-store";
import { PermissionFormDialog } from "@/components/permission-form-dialog";
import { PermissionDetailDialog } from "@/components/permission-detail-dialog";
import { toast } from "@/lib/toast";
import {
  RBAC_ACTION_META,
  RBAC_RESOURCE_META,
  RBAC_RESOURCES,
} from "@/lib/rbac/constants";
import type { PermissionRecord } from "@/lib/permissions/types";

const filterValues = ["all", ...RBAC_RESOURCES] as const;

function PermissionsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    permissions,
    loading,
    error,
    deletePermission,
    countsByResource,
    refresh,
  } = usePermissionsStore();
  const [activeFilterIndex, setActiveFilterIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const [deleteTarget, setDeleteTarget] = useState<PermissionRecord | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);

  function openCreate() {
    setEditId(null);
    setFormOpen(true);
  }

  function openEdit(id: string) {
    setEditId(id);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditId(null);
  }

  function openDetail(id: string) {
    setDetailId(id);
    const next = new URLSearchParams(searchParams.toString());
    next.set("id", id);
    next.delete("create");
    next.delete("edit");
    router.replace(`/permissions/?${next.toString()}`, { scroll: false });
  }

  function closeDetail() {
    setDetailId(null);
    const next = new URLSearchParams(searchParams.toString());
    next.delete("id");
    const qs = next.toString();
    router.replace(qs ? `/permissions/?${qs}` : "/permissions/", { scroll: false });
  }

  useEffect(() => {
    const create = searchParams.get("create") === "1";
    const edit = searchParams.get("edit");
    const id = searchParams.get("id");
    if (create) {
      setEditId(null);
      setFormOpen(true);
      router.replace("/permissions/", { scroll: false });
      return;
    }
    if (edit) {
      setEditId(edit);
      setFormOpen(true);
      router.replace("/permissions/", { scroll: false });
      return;
    }
    if (id) setDetailId(id);
  }, [searchParams, router]);

  const filtered = useMemo(() => {
    const resourceKey = filterValues[activeFilterIndex];
    const q = search.trim().toLowerCase();
    return permissions.filter((item) => {
      if (resourceKey !== "all" && item.resource !== resourceKey) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q)
        || item.code.toLowerCase().includes(q)
        || item.description.toLowerCase().includes(q)
        || RBAC_RESOURCE_META[item.resource].label.includes(q)
        || RBAC_ACTION_META[item.action].label.includes(q)
      );
    });
  }, [permissions, activeFilterIndex, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  useEffect(() => {
    setCurrentPage(1);
  }, [search, activeFilterIndex]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const pageRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage]);

  const columns: ColumnDef<PermissionRecord>[] = useMemo(
    () => [
      {
        key: "name",
        header: "权限",
        flex: true,
        render: (row) => (
          <button
            type="button"
            className="flex h-10 min-w-0 flex-col justify-center text-left"
            onClick={() => openDetail(row.id)}
          >
            <span className="truncate text-sm font-semibold text-fg-black">{row.name}</span>
            <span className="text-xs text-fg-grey-500">{row.code}</span>
          </button>
        ),
      },
      {
        key: "resource",
        header: "资源",
        width: "w-28",
        render: (row) => <CellText>{RBAC_RESOURCE_META[row.resource].label}</CellText>,
      },
      {
        key: "action",
        header: "操作",
        width: "w-24",
        render: (row) => <CellMuted>{RBAC_ACTION_META[row.action].label}</CellMuted>,
      },
      {
        key: "roles",
        header: "授权角色",
        width: "w-28",
        render: (row) => <CellText>{String(row.roleCount)}</CellText>,
      },
      {
        key: "created",
        header: "创建",
        width: "w-32",
        render: (row) => <CellMuted>{row.created}</CellMuted>,
      },
      {
        key: "actions",
        header: "操作",
        width: "w-24",
        render: (row) => (
          <div className="flex h-10 items-center justify-end gap-2">
            <IconButton
              variant="ghost"
              shape="square"
              size="sm"
              aria-label="编辑"
              onClick={() => openEdit(row.id)}
            >
              <PenLinear size={16} />
            </IconButton>
            <IconButton
              variant="ghost"
              shape="square"
              size="sm"
              aria-label="删除"
              onClick={() => setDeleteTarget(row)}
            >
              <TrashBinMinimalisticLinear size={16} />
            </IconButton>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <div className="flex flex-col gap-6">
      <PermissionFormDialog
        open={formOpen}
        onClose={closeForm}
        permissionId={editId}
        onCreated={openDetail}
      />
      <PermissionDetailDialog
        permissionId={detailId}
        onClose={closeDetail}
        onEdit={openEdit}
      />

      {deleteTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <ConfirmationDialog
            title="删除权限？"
            description={`确定删除「${deleteTarget.name}」？角色上的对应授权会一并移除。`}
            color="red"
            icon={<TrashBinMinimalisticLinear size={32} color="#EA580C" />}
            confirmLabel={deleting ? "删除中…" : "删除"}
            cancelLabel="取消"
            onCancel={() => {
              if (deleting) return;
              setDeleteTarget(null);
            }}
            onConfirm={() => {
              if (deleting) return;
              setDeleting(true);
              void deletePermission(deleteTarget.id)
                .then(() => {
                  toast.success("权限已删除");
                  setDeleteTarget(null);
                  if (detailId === deleteTarget.id) closeDetail();
                })
                .catch((err: unknown) => {
                  toast.error(err instanceof Error ? err.message : "删除失败");
                })
                .finally(() => setDeleting(false));
            }}
          />
        </div>
      ) : null}

      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-display-l font-semibold leading-9 tracking-fg text-fg-black">
            权限
          </h1>
          <Breadcrumbs
            color={siteConfig.accent}
            items={[
              { label: "工作台", href: "/dashboard/" },
              { label: "权限" },
            ]}
          />
        </div>
        <Button
          color={siteConfig.accent}
          iconLeft={<PlusIcon size={16} />}
          onClick={openCreate}
        >
          新建权限
        </Button>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <ButtonGroup
          color={siteConfig.accent}
          shape="pill"
          items={filterValues.map((key) => ({
            label:
              key === "all"
                ? `全部 ${countsByResource.all}`
                : `${RBAC_RESOURCE_META[key].label} ${countsByResource[key] ?? 0}`,
          }))}
          activeIndex={activeFilterIndex}
          onChange={setActiveFilterIndex}
        />
        <div className="w-full max-w-sm">
          <TextField
            color={siteConfig.accent}
            value={search}
            onChange={setSearch}
            placeholder="搜索名称、编码、资源…"
            iconLeft={<MagniferLinear size={16} />}
          />
        </div>
      </div>

      {error ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-[28px] border border-dashed border-fg-grey-200 bg-white py-16">
          <p className="text-lg font-semibold text-fg-black">无法加载权限</p>
          <p className="max-w-md text-center text-sm text-fg-grey-500">{error}</p>
          <Button color={siteConfig.accent} onClick={() => void refresh()}>
            重试
          </Button>
        </div>
      ) : loading ? (
        <div className="rounded-[28px] border border-fg-grey-200 bg-white py-16 text-center text-sm text-fg-grey-500">
          加载中…
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-[28px] border border-dashed border-fg-grey-200 bg-white py-16">
          <p className="text-lg font-semibold text-fg-black">
            {permissions.length === 0 ? "暂无权限" : "无匹配结果"}
          </p>
          <p className="text-sm text-fg-grey-500">
            {permissions.length === 0
              ? "还没有权限点，点击下方创建第一条。"
              : "试试清空搜索或切换资源筛选。"}
          </p>
          {permissions.length === 0 ? (
            <Button color={siteConfig.accent} onClick={openCreate}>
              新建权限
            </Button>
          ) : (
            <Button
              color={siteConfig.accent}
              variant="tertiary"
              onClick={() => {
                setSearch("");
                setActiveFilterIndex(0);
              }}
            >
              清除筛选
            </Button>
          )}
        </div>
      ) : (
        <DataTable<PermissionRecord>
          color={siteConfig.accent}
          columns={columns}
          rows={pageRows}
          getRowKey={(row) => row.id}
          showPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          paginationLabel={`显示 ${pageRows.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, filtered.length)} / 共 ${filtered.length} 条`}
        />
      )}
    </div>
  );
}

export default function PermissionsPage() {
  return (
    <Suspense fallback={<div className="py-10 text-sm text-fg-grey-500">加载权限列表…</div>}>
      <PermissionsPageContent />
    </Suspense>
  );
}
