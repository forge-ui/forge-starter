"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MagniferLinear, PenLinear, TrashBinMinimalisticLinear } from "solar-icon-set";
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
import { Modal } from "@/components/ui/modal";
import { siteConfig } from "@/config/site";
import { useSuppliersStore } from "@/components/suppliers-store";
import { SupplierFormDialog } from "@/components/supplier-form-dialog";
import {
  SUPPLIER_CATEGORY_META,
  SUPPLIER_STATUS_META,
  type Supplier,
  type SupplierStatus,
} from "@/lib/suppliers/types";

const filterTabs = [
  { label: "全部" },
  { label: "合作中" },
  { label: "待审核" },
  { label: "停用" },
];
const filterValues = ["all", "active", "pending", "inactive"] as const;

function SuppliersPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { suppliers, loading, error, deleteSupplier, countsByStatus, refresh } =
    useSuppliersStore();
  const [filterIndex, setFilterIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Supplier | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get("create") === "1") {
      setEditId(null);
      setFormOpen(true);
      router.replace("/suppliers/", { scroll: false });
    }
  }, [searchParams, router]);

  const filtered = useMemo(() => {
    const statusKey = filterValues[filterIndex];
    const q = search.trim().toLowerCase();
    return suppliers.filter((s) => {
      if (statusKey !== "all" && s.status !== statusKey) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q)
        || s.code.toLowerCase().includes(q)
        || s.contactName.toLowerCase().includes(q)
        || s.contactEmail.toLowerCase().includes(q)
      );
    });
  }, [suppliers, filterIndex, search]);

  const columns: ColumnDef<Supplier>[] = useMemo(
    () => [
      {
        key: "name",
        header: "供应商",
        flex: true,
        render: (row) => (
          <button
            type="button"
            className="flex h-10 min-w-0 flex-col justify-center text-left"
            onClick={() => router.push(`/suppliers/${row.id}/`)}
          >
            <span className="truncate text-sm font-semibold text-fg-black">{row.name}</span>
            <span className="font-mono text-xs text-fg-grey-500">{row.code}</span>
          </button>
        ),
      },
      {
        key: "category",
        header: "品类",
        width: "w-28",
        render: (row) => <CellMuted>{SUPPLIER_CATEGORY_META[row.category].label}</CellMuted>,
      },
      {
        key: "contact",
        header: "联系人",
        width: "w-36",
        render: (row) => (
          <div className="flex h-10 flex-col justify-center">
            <CellText>{row.contactName || "—"}</CellText>
            <span className="text-xs text-fg-grey-500">{row.contactPhone || "—"}</span>
          </div>
        ),
      },
      {
        key: "rating",
        header: "评级",
        width: "w-20",
        render: (row) => <CellText>{`${row.rating}★`}</CellText>,
      },
      {
        key: "status",
        header: "状态",
        width: "w-28",
        render: (row) => (
          <StatusBadge
            label={SUPPLIER_STATUS_META[row.status as SupplierStatus].label}
            color={SUPPLIER_STATUS_META[row.status as SupplierStatus].color}
          />
        ),
      },
      {
        key: "actions",
        header: "",
        width: "w-24",
        render: (row) => (
          <div className="flex items-center gap-1">
            <IconButton
              variant="ghost"
              shape="square"
              size="sm"
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
              onClick={() => setDeleteTarget(row)}
            >
              <TrashBinMinimalisticLinear size={16} />
            </IconButton>
          </div>
        ),
      },
    ],
    [router],
  );

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteSupplier(deleteTarget.id);
      setDeleteTarget(null);
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : "删除失败");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-display-l font-semibold leading-9 tracking-fg text-fg-black">
            供应商
          </h1>
          <Breadcrumbs
            color={siteConfig.accent}
            items={[
              { label: "采购", href: "/procurement/" },
              { label: "供应商" },
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
          新建供应商
        </Button>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <ButtonGroup
          color={siteConfig.accent}
          shape="pill"
          items={filterTabs.map((t, i) => ({
            label:
              i === 0
                ? `全部 ${countsByStatus.all ?? 0}`
                : `${t.label} ${countsByStatus[filterValues[i]] ?? 0}`,
          }))}
          activeIndex={filterIndex}
          onChange={(i) => {
            setFilterIndex(i);
          }}
        />
        <div className="w-full max-w-sm">
          <TextField
            color={siteConfig.accent}
            value={search}
            onChange={setSearch}
            placeholder="搜索名称 / 编码 / 联系人"
            iconLeft={<MagniferLinear size={16} />}
          />
        </div>
      </div>

      {error ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-[28px] border border-dashed border-fg-grey-200 bg-white py-16">
          <p className="text-lg font-semibold text-fg-black">无法加载供应商</p>
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
            {suppliers.length === 0 ? "暂无供应商" : "无匹配结果"}
          </p>
          <p className="text-sm text-fg-grey-500">
            {suppliers.length === 0
              ? "还没有供应商，点击右上角创建第一家。"
              : "试试清空搜索或切换状态筛选。"}
          </p>
          {suppliers.length === 0 ? (
            <Button
              color={siteConfig.accent}
              onClick={() => {
                setEditId(null);
                setFormOpen(true);
              }}
            >
              新建供应商
            </Button>
          ) : null}
        </div>
      ) : (
        <DataTable<Supplier>
          color={siteConfig.accent}
          columns={columns}
          rows={filtered}
          getRowKey={(row) => row.id}
        />
      )}

      <SupplierFormDialog
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditId(null);
        }}
        supplierId={editId}
      />

      {deleteTarget ? (
        <Modal open onClose={() => setDeleteTarget(null)} title="删除供应商">
          <div className="px-6 py-4">
            <ConfirmationDialog
              title="确认删除？"
              description={`将删除「${deleteTarget.name}」。关联采购单的供应商引用会置空。`}
              color="red"
              confirmLabel={deleting ? "删除中…" : "删除"}
              cancelLabel="取消"
              onConfirm={confirmDelete}
              onCancel={() => setDeleteTarget(null)}
            />
            {deleteError ? <p className="mt-2 text-sm text-fg-red">{deleteError}</p> : null}
          </div>
        </Modal>
      ) : null}
    </div>
  );
}

export default function SuppliersPage() {
  return (
    <Suspense fallback={<p className="text-sm text-fg-grey-500">加载…</p>}>
      <SuppliersPageContent />
    </Suspense>
  );
}
