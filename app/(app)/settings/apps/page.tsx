"use client";

/**
 * 应用管理 — collection CRUD (list + header action + modal form)
 * Same IA as accounts list / ecommerce customers.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  MagniferLinear,
  PenLinear,
  TrashBinMinimalisticLinear,
} from "solar-icon-set";
import {
  Breadcrumbs,
  Button,
  ButtonGroup,
  ConfirmationDialog,
  DataTable,
  IconButton,
  PlusIcon,
  StatusBadge,
  TextField,
  type ColumnDef,
} from "@forge-ui-official/core";
import { siteConfig } from "@/config/site";
import {
  APP_AUTH_META,
  APP_KIND_META,
  modulesLabel,
  type AppEntry,
  type AppKind,
} from "@/config/apps";
import { loadAppRegistry, saveAppRegistry } from "@/lib/apps/registry";
import { AppFormDialog } from "@/components/app-form-dialog";

const filterTabs = [
  { label: "全部" },
  { label: "外部链接" },
  { label: "外部系统" },
  { label: "内部应用" },
];
const filterValues = ["all", "link", "external", "internal"] as const;

function kindLabel(kind: AppKind) {
  return APP_KIND_META[kind]?.label ?? kind;
}

function kindColor(kind: AppKind): "blue" | "green" | "yellow" | "grey" {
  if (kind === "internal") return "blue";
  if (kind === "external") return "yellow";
  return "grey";
}

export default function SettingsAppsPage() {
  const [apps, setApps] = useState<AppEntry[]>([]);
  const [search, setSearch] = useState("");
  const [filterIndex, setFilterIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AppEntry | null>(null);

  const refresh = useCallback(() => {
    // Include host product (基础后台) as default row; other apps from registry.
    setApps(loadAppRegistry());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const filtered = useMemo(() => {
    const kind = filterValues[filterIndex];
    const q = search.trim().toLowerCase();
    return apps.filter((a) => {
      if (kind !== "all" && a.kind !== kind) return false;
      if (!q) return true;
      return (
        a.name.toLowerCase().includes(q)
        || a.subtitle.toLowerCase().includes(q)
        || (a.href ?? "").toLowerCase().includes(q)
        || kindLabel(a.kind).includes(q)
      );
    });
  }, [apps, filterIndex, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterIndex]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const pageRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage]);

  const columns: ColumnDef<AppEntry>[] = useMemo(
    () => [
      {
        key: "name",
        header: "应用",
        sortable: true,
        flex: true,
        // Avoid CellText (flex-1) beside badges — it shoves badges to the cell edge.
        render: (row) => (
          <div className="flex h-10 min-w-0 flex-col justify-center gap-0.5">
            <span className="truncate text-sm font-semibold leading-5 tracking-fg text-fg-black">
              {row.name}
            </span>
            <span className="truncate text-xs leading-4 text-fg-grey-500">
              {row.subtitle || "—"}
            </span>
          </div>
        ),
      },
      {
        key: "kind",
        header: "类型",
        width: "w-32",
        render: (row) => (
          <div className="flex h-10 items-center justify-start">
            <StatusBadge
              label={row.isCurrentProduct ? "宿主应用" : kindLabel(row.kind)}
              color={row.isCurrentProduct ? "green" : kindColor(row.kind)}
            />
          </div>
        ),
      },
      {
        key: "entry",
        header: "入口 / 菜单",
        width: "w-56",
        render: (row) => (
          <div className="flex h-10 items-center">
            <span className="truncate text-sm font-medium text-fg-grey-700">
              {row.kind === "internal" ? modulesLabel(row) : row.href || "—"}
            </span>
          </div>
        ),
      },
      {
        key: "auth",
        header: "认证",
        width: "w-36",
        render: (row) => (
          <div className="flex h-10 items-center">
            <span className="truncate text-sm font-medium text-fg-grey-700">
              {row.kind === "link"
                ? "—"
                : row.kind === "internal"
                  ? "本平台"
                  : APP_AUTH_META[row.authMode].label}
            </span>
          </div>
        ),
      },
      {
        key: "actions",
        header: "操作",
        width: "w-24",
        render: (row) => (
          <div className="flex h-10 items-center justify-end gap-2">
            {row.isCurrentProduct ? (
              <span className="text-sm text-fg-grey-500">—</span>
            ) : (
              <>
                <IconButton
                  variant="ghost"
                  shape="square"
                  size="sm"
                  aria-label="编辑"
                  onClick={() => {
                    setEditId(row.id);
                    setFormOpen(true);
                  }}
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
              </>
            )}
          </div>
        ),
      },
    ],
    [],
  );

  function confirmDelete() {
    if (!deleteTarget || deleteTarget.isCurrentProduct) return;
    const all = loadAppRegistry().filter((a) => a.id !== deleteTarget.id);
    saveAppRegistry(all);
    setDeleteTarget(null);
    refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <AppFormDialog
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditId(null);
        }}
        appId={editId}
        onSaved={refresh}
      />

      {deleteTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <ConfirmationDialog
            title="删除应用？"
            description={`确定删除「${deleteTarget.name}」？将从侧栏应用切换器中移除。`}
            color="red"
            icon={<TrashBinMinimalisticLinear size={32} color="#EA580C" />}
            confirmLabel="删除"
            cancelLabel="取消"
            onCancel={() => setDeleteTarget(null)}
            onConfirm={confirmDelete}
          />
        </div>
      ) : null}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-display-l font-semibold leading-9 tracking-fg text-fg-black">
            应用管理
          </h1>
          <Breadcrumbs
            color={siteConfig.accent}
            items={[
              { label: "工作台", href: "/dashboard/" },
              { label: "应用管理" },
            ]}
          />
        </div>
        <Button
          color={siteConfig.accent}
          iconLeft={<PlusIcon size={16} />}
          onClick={() => {
            setEditId(null);
            setFormOpen(true);
          }}
        >
          新建应用
        </Button>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <ButtonGroup
          color={siteConfig.accent}
          shape="pill"
          items={filterTabs.map((tab, index) => {
            const key = filterValues[index];
            const count =
              key === "all"
                ? apps.length
                : apps.filter((a) => a.kind === key).length;
            return { label: `${tab.label} ${count}` };
          })}
          activeIndex={filterIndex}
          onChange={setFilterIndex}
        />
        <div className="w-full max-w-sm">
          <TextField
            color={siteConfig.accent}
            value={search}
            onChange={setSearch}
            placeholder="搜索名称、地址…"
            iconLeft={<MagniferLinear size={16} />}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-[28px] border border-dashed border-fg-grey-200 bg-white py-16">
          <p className="text-lg font-semibold text-fg-black">
            {apps.length === 0 ? "暂无应用" : "无匹配结果"}
          </p>
          <p className="text-sm text-fg-grey-500">
            {apps.length === 0
              ? "默认应包含本超管后台；若列表为空请刷新页面。也可新建其它应用。"
              : "试试清空搜索或切换类型筛选。"}
          </p>
          {apps.length === 0 ? (
            <Button
              color={siteConfig.accent}
              onClick={() => {
                setEditId(null);
                setFormOpen(true);
              }}
            >
              新建应用
            </Button>
          ) : (
            <Button
              color={siteConfig.accent}
              variant="tertiary"
              onClick={() => {
                setSearch("");
                setFilterIndex(0);
              }}
            >
              清除筛选
            </Button>
          )}
        </div>
      ) : (
        <DataTable<AppEntry>
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
