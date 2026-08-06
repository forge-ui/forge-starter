"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MagniferLinear } from "solar-icon-set";
import {
  Breadcrumbs,
  Button,
  ButtonGroup,
  CellMuted,
  CellText,
  DataTable,
  PlusIcon,
  StatusBadge,
  TextField,
  type ColumnDef,
} from "@forge-ui-official/core";
import { siteConfig } from "@/config/site";
import { usePurchaseOrdersStore } from "@/components/purchase-orders-store";
import { PurchaseOrderFormDialog } from "@/components/purchase-order-form-dialog";
import { PurchaseOrderDetailDialog } from "@/components/purchase-order-detail-dialog";
import {
  PO_STATUS_META,
  type PurchaseOrder,
  type PurchaseOrderStatus,
} from "@/lib/purchase-orders/types";

const scopes = [
  { label: "全部", value: "all" as const },
  { label: "待我审批", value: "todo" as const },
  { label: "我发起的", value: "mine" as const },
];

function PurchaseOrdersPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, loading, error, refresh, counts, me } = usePurchaseOrdersStore();
  const [scopeIndex, setScopeIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get("create") === "1") {
      setFormOpen(true);
      router.replace("/purchase-orders/", { scroll: false });
    }
    const id = searchParams.get("id");
    if (id) {
      setDetailId(id);
      router.replace("/purchase-orders/", { scroll: false });
    }
  }, [searchParams, router]);

  useEffect(() => {
    void refresh(scopes[scopeIndex].value);
  }, [scopeIndex, refresh]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((row) => {
      if (scopeIndex === 1 && (row.status !== "pending" || row.requesterUsername === me)) {
        return false;
      }
      if (!q) return true;
      return (
        row.title.toLowerCase().includes(q)
        || row.orderNo.toLowerCase().includes(q)
        || row.supplierName.toLowerCase().includes(q)
        || row.requesterName.toLowerCase().includes(q)
      );
    });
  }, [items, search, scopeIndex, me]);

  const columns: ColumnDef<PurchaseOrder>[] = useMemo(
    () => [
      {
        key: "title",
        header: "采购单",
        flex: true,
        render: (row) => (
          <button
            type="button"
            className="flex h-10 min-w-0 flex-col justify-center text-left"
            onClick={() => setDetailId(row.id)}
          >
            <span className="truncate text-sm font-semibold text-fg-black">{row.title}</span>
            <span className="font-mono text-xs text-fg-grey-500">{row.orderNo}</span>
          </button>
        ),
      },
      {
        key: "supplier",
        header: "供应商",
        width: "w-36",
        render: (row) => <CellMuted>{row.supplierName}</CellMuted>,
      },
      {
        key: "amount",
        header: "金额",
        width: "w-28",
        render: (row) => <CellText>{row.amountLabel}</CellText>,
      },
      {
        key: "requester",
        header: "申请人",
        width: "w-28",
        render: (row) => <CellMuted>{row.requesterName}</CellMuted>,
      },
      {
        key: "status",
        header: "状态",
        width: "w-28",
        render: (row) => (
          <StatusBadge
            label={PO_STATUS_META[row.status as PurchaseOrderStatus].label}
            color={PO_STATUS_META[row.status as PurchaseOrderStatus].color}
          />
        ),
      },
      {
        key: "created",
        header: "创建",
        width: "w-36",
        render: (row) => <CellMuted>{row.created}</CellMuted>,
      },
    ],
    [],
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="text-display-l font-semibold leading-9 tracking-fg text-fg-black">
          采购单
        </h1>
        <Breadcrumbs
          color={siteConfig.accent}
          items={[
            { label: "采购", href: "/procurement/" },
            { label: "采购单" },
          ]}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <ButtonGroup
          color={siteConfig.accent}
          shape="pill"
          items={scopes.map((s, i) => ({
            label:
              i === 0
                ? `全部 (${counts.all ?? 0})`
                : i === 1
                  ? `待审批 (${counts.pending ?? 0})`
                  : s.label,
          }))}
          activeIndex={scopeIndex}
          onChange={setScopeIndex}
        />
        <div className="min-w-[200px] flex-1">
          <TextField
            color={siteConfig.accent}
            value={search}
            onChange={setSearch}
            placeholder="搜索单号 / 标题 / 供应商"
            iconLeft={<MagniferLinear size={16} />}
          />
        </div>
        <Button
          color={siteConfig.accent}
          iconLeft={<PlusIcon size={16} />}
          onClick={() => setFormOpen(true)}
        >
          发起采购
        </Button>
      </div>

      {error ? (
        <p className="rounded-2xl bg-fg-red-50 px-4 py-3 text-sm text-fg-red">{error}</p>
      ) : null}
      {loading ? (
        <p className="text-sm text-fg-grey-500">加载中…</p>
      ) : (
        <DataTable<PurchaseOrder>
          color={siteConfig.accent}
          columns={columns}
          rows={filtered}
          getRowKey={(row) => row.id}
        />
      )}

      <PurchaseOrderFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onCreated={(id) => setDetailId(id)}
      />
      <PurchaseOrderDetailDialog
        open={Boolean(detailId)}
        orderId={detailId}
        onClose={() => setDetailId(null)}
      />
    </div>
  );
}

export default function PurchaseOrdersPage() {
  return (
    <Suspense fallback={<p className="text-sm text-fg-grey-500">加载…</p>}>
      <PurchaseOrdersPageContent />
    </Suspense>
  );
}
