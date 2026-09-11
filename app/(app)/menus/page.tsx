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
  StatusBadge,
  TextField,
  type ColumnDef,
} from "@forge-ui-official/core";
import { siteConfig } from "@/config/site";
import { useMenusStore } from "@/components/menus-store";
import { MenuFormDialog } from "@/components/menu-form-dialog";
import { MenuDetailDialog } from "@/components/menu-detail-dialog";
import { toast } from "@/lib/toast";
import { RBAC_STATUS_META } from "@/lib/rbac/constants";
import type { MenuRecord } from "@/lib/menus/types";

const filterTabs = [{ label: "全部" }, { label: "启用" }, { label: "停用" }];
const filterValues = ["all", "active", "disabled"] as const;

function MenusPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { menus, loading, error, deleteMenu, countsByStatus, refresh } = useMenusStore();
  const [activeFilterIndex, setActiveFilterIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const [deleteTarget, setDeleteTarget] = useState<MenuRecord | null>(null);
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
    router.replace(`/menus/?${next.toString()}`, { scroll: false });
  }

  function closeDetail() {
    setDetailId(null);
    const next = new URLSearchParams(searchParams.toString());
    next.delete("id");
    const qs = next.toString();
    router.replace(qs ? `/menus/?${qs}` : "/menus/", { scroll: false });
  }

  useEffect(() => {
    const create = searchParams.get("create") === "1";
    const edit = searchParams.get("edit");
    const id = searchParams.get("id");
    if (create) {
      setEditId(null);
      setFormOpen(true);
      router.replace("/menus/", { scroll: false });
      return;
    }
    if (edit) {
      setEditId(edit);
      setFormOpen(true);
      router.replace("/menus/", { scroll: false });
      return;
    }
    if (id) setDetailId(id);
  }, [searchParams, router]);

  const filtered = useMemo(() => {
    const statusKey = filterValues[activeFilterIndex];
    const q = search.trim().toLowerCase();
    return menus.filter((item) => {
      if (statusKey !== "all" && item.status !== statusKey) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q)
        || item.code.toLowerCase().includes(q)
        || item.path.toLowerCase().includes(q)
        || (item.parentName ?? "").toLowerCase().includes(q)
      );
    });
  }, [menus, activeFilterIndex, search]);

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

  const columns: ColumnDef<MenuRecord>[] = useMemo(
    () => [
      {
        key: "name",
        header: "菜单",
        flex: true,
        render: (row) => (
          <button
            type="button"
            className="flex h-10 min-w-0 flex-col justify-center text-left"
            onClick={() => openDetail(row.id)}
          >
            <span className="truncate text-sm font-semibold text-fg-black">
              {row.parentName ? `${row.parentName} / ${row.name}` : row.name}
            </span>
            <span className="text-xs text-fg-grey-500">{row.path}</span>
          </button>
        ),
      },
      {
        key: "code",
        header: "编码",
        width: "w-36",
        render: (row) => <CellText>{row.code}</CellText>,
      },
      {
        key: "sort",
        header: "排序",
        width: "w-20",
        render: (row) => <CellMuted>{String(row.sort)}</CellMuted>,
      },
      {
        key: "status",
        header: "状态",
        width: "w-28",
        render: (row) => (
          <StatusBadge
            label={RBAC_STATUS_META[row.status].label}
            color={RBAC_STATUS_META[row.status].color}
          />
        ),
      },
      {
        key: "kind",
        header: "类型",
        width: "w-28",
        render: (row) => <CellMuted>{row.builtin ? "内置" : "目录"}</CellMuted>,
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
            {row.builtin ? null : (
              <IconButton
                variant="ghost"
                shape="square"
                size="sm"
                aria-label="删除"
                onClick={() => setDeleteTarget(row)}
              >
                <TrashBinMinimalisticLinear size={16} />
              </IconButton>
            )}
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <div className="flex flex-col gap-6">
      <MenuFormDialog
        open={formOpen}
        onClose={closeForm}
        menuId={editId}
        onCreated={openDetail}
      />
      <MenuDetailDialog
        menuId={detailId}
        onClose={closeDetail}
        onEdit={openEdit}
      />

      {deleteTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <ConfirmationDialog
            title="删除菜单？"
            description={`确定删除「${deleteTarget.name}」？内置侧栏不会因此增减条目。`}
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
              void deleteMenu(deleteTarget.id)
                .then(() => {
                  toast.success("菜单已删除");
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
            菜单
          </h1>
          <Breadcrumbs
            color={siteConfig.accent}
            items={[
              { label: "工作台", href: "/dashboard/" },
              { label: "菜单" },
            ]}
          />
        </div>
        <Button
          color={siteConfig.accent}
          iconLeft={<PlusIcon size={16} />}
          onClick={openCreate}
        >
          新建菜单
        </Button>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <ButtonGroup
          color={siteConfig.accent}
          shape="pill"
          items={filterTabs.map((tab, index) => ({
            label:
              index === 0
                ? `全部 ${countsByStatus.all}`
                : `${tab.label} ${countsByStatus[filterValues[index]] ?? 0}`,
          }))}
          activeIndex={activeFilterIndex}
          onChange={setActiveFilterIndex}
        />
        <div className="w-full max-w-sm">
          <TextField
            color={siteConfig.accent}
            value={search}
            onChange={setSearch}
            placeholder="搜索名称、编码、路径…"
            iconLeft={<MagniferLinear size={16} />}
          />
        </div>
      </div>

      {error ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-[28px] border border-dashed border-fg-grey-200 bg-white py-16">
          <p className="text-lg font-semibold text-fg-black">无法加载菜单</p>
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
            {menus.length === 0 ? "暂无菜单" : "无匹配结果"}
          </p>
          <p className="text-sm text-fg-grey-500">
            {menus.length === 0
              ? "还没有菜单目录，点击下方创建第一条。"
              : "试试清空搜索或切换状态筛选。"}
          </p>
          {menus.length === 0 ? (
            <Button color={siteConfig.accent} onClick={openCreate}>
              新建菜单
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
        <DataTable<MenuRecord>
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

export default function MenusPage() {
  return (
    <Suspense fallback={<div className="py-10 text-sm text-fg-grey-500">加载菜单列表…</div>}>
      <MenusPageContent />
    </Suspense>
  );
}
