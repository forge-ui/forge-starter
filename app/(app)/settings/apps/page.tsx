"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { AppDetailDialog } from "@/components/app-detail-dialog";
import { useAccess } from "@/components/access-store";
import { toast } from "@/lib/toast";
import { Modal } from "@/components/ui/modal";

/**
 * 应用管理 — collection CRUD (list + header action + modal form)
 * Same IA as accounts list / ecommerce customers.
 */

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import {
  MagniferLinear,
  PenLinear,
  TrashBinMinimalisticLinear,
} from "solar-icon-set";
import {
  Breadcrumbs,
  PageTitleToolbar,
  ToolbarActions,
  Button,
  ButtonGroup,
  CellText,
  ConfirmationDialog,
  DataTable,
  IconButton,
  PlusIcon,
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
import { getDefaultAppRegistry } from "@/lib/apps/defaults";
import { loadAppRegistry, saveAppRegistry } from "@/lib/apps/registry";
import { AppFormDialog } from "@/components/app-form-dialog";
import { AskAiEntry } from "@/components/ask-ai-entry";

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

export default function SettingsAppsPage() {
  return <Suspense><SettingsAppsContent /></Suspense>;
}

function SettingsAppsContent() {
  const { can } = useAccess();
  const canCreate = can("settings", "update");
  const canUpdate = can("settings", "update");
  const canDelete = can("settings", "update");
  const router = useRouter();
  const searchParams = useSearchParams();
  const detailId = searchParams.get("id");
  const [apps, setApps] = useState<AppEntry[]>(() => getDefaultAppRegistry());
  const [search, setSearch] = useState(() => searchParams.get("q") ?? "");
  const [filterIndex, setFilterIndex] = useState(() => Math.max(0, filterValues.findIndex((value) => value === searchParams.get("type"))));
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AppEntry | null>(null);

  const openDetail = useCallback((id: string | null) => {
    const query = new URLSearchParams(searchParams.toString());
    if (search) query.set("q", search); else query.delete("q");
    if (filterIndex) query.set("type", filterValues[filterIndex]!); else query.delete("type");
    if (id) query.set("id", id); else query.delete("id");
    router.replace(`/settings/apps/${query.size ? `?${query}` : ""}`, { scroll: false });
  }, [router, searchParams, search, filterIndex]);

  useEffect(() => {
    const edit = searchParams.get("edit");
    const create = searchParams.get("create") === "1";
    if ((!edit || !canUpdate) && (!create || !canCreate)) return;
    setEditId(edit);
    setFormOpen(true);
    const query = new URLSearchParams(searchParams.toString());
    query.delete("edit"); query.delete("create");
    router.replace(`/settings/apps/${query.size ? `?${query}` : ""}`, { scroll: false });
  }, [searchParams, router, canUpdate, canCreate]);

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
        width: "w-[28%]",
        // Avoid CellText (flex-1) beside badges — it shoves badges to the cell edge.
        render: (row) => (
          <button type="button" onClick={() => openDetail(row.id)} className="flex h-10 min-w-0 max-w-full flex-col justify-center gap-0.5 text-left focus-visible:outline-2 focus-visible:outline-offset-2">
            <span className="truncate text-sm font-semibold leading-5 tracking-fg text-fg-black">
              {row.name}
            </span>
            <span className="truncate text-xs leading-4 text-fg-grey-700">
              {row.subtitle || "—"}
            </span>
          </button>
        ),
      },
      {
        key: "kind",
        header: "类型",
        width: "w-[12%]",
        render: (row) => (
          <CellText>
            {row.isCurrentProduct ? "宿主应用" : kindLabel(row.kind)}
          </CellText>
        ),
      },
      {
        key: "entry",
        header: "入口 / 菜单",
        width: "w-[35%]",
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
        width: "w-[15%]",
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
      ...(canUpdate || canDelete ? [{
        key: "actions",
        header: "操作",
        width: "w-[10%]",
        render: (row) => (
          <div className="flex h-10 items-center justify-end gap-2">
            <>
                {canUpdate ? <IconButton
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
                </IconButton> : null}
                {canDelete && !row.isCurrentProduct ? <IconButton
                  variant="ghost"
                  shape="square"
                  size="sm"
                  aria-label="删除"
                  onClick={() => setDeleteTarget(row)}
                >
                  <TrashBinMinimalisticLinear size={16} />
                </IconButton> : null}
            </>
          </div>
        ),
      } as ColumnDef<AppEntry>] : []),
    ],
    [openDetail, canUpdate, canDelete],
  );

  function confirmDelete() {
    if (!canDelete || !deleteTarget || deleteTarget.isCurrentProduct) return;
    const all = loadAppRegistry().filter((a) => a.id !== deleteTarget.id);
    try { saveAppRegistry(all); } catch { toast.error("删除失败，请检查浏览器存储是否可用"); return; }
    toast.success("应用已删除");
    setDeleteTarget(null);
    refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <AppDetailDialog app={apps.find((app) => app.id === detailId)} open={detailId != null} onClose={() => openDetail(null)} onEdit={canUpdate ? (id) => { setEditId(id); setFormOpen(true); } : undefined} />
      <AppFormDialog
        open={formOpen && (editId ? canUpdate : canCreate)}
        onClose={() => {
          setFormOpen(false);
          setEditId(null);
        }}
        appId={editId}
        onSaved={(id) => { refresh(); openDetail(id); }}
      />

      <Modal open={deleteTarget != null} onClose={() => setDeleteTarget(null)}>
        {deleteTarget ? (
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
        ) : null}
      </Modal>

      <PageTitleToolbar
        title="应用管理"
        breadcrumbs={
          <Breadcrumbs
            color={siteConfig.accent}
            items={[
              { label: "工作台", href: "/dashboard/" },
              { label: "应用管理" },
            ]}
          />
        }
        actions={
          <ToolbarActions className="flex-wrap">
            <AskAiEntry />
            {canCreate ? <Button
              color={siteConfig.accent}
              iconLeft={<PlusIcon size={16} />}
              onClick={() => {
                setEditId(null);
                setFormOpen(true);
              }}
            >
              新建应用
            </Button> : null}
          </ToolbarActions>
        }
        className="shrink-0 flex-col items-stretch gap-3 sm:flex-row sm:items-end [&>div:first-child]:min-w-0"
      />

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
          {apps.length === 0 && canCreate ? (
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
