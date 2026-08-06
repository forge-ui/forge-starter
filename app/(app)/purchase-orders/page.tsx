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
    <div className="flex flex-col gap-6">
      {/* Title row: left title+crumbs, right primary action (accounts pattern) */}
      <div className="flex items-start justify-between gap-4">
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
        <Button
          color={siteConfig.accent}
          iconLeft={<PlusIcon size={16} />}
          onClick={() => setFormOpen(true)}
        >
          发起采购
        </Button>
      </div>

      {/* Tool row: filters left, search right (not flex-1 stretch) */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <ButtonGroup
          color={siteConfig.accent}
          shape="pill"
          items={scopes.map((s, i) => ({
            label:
              i === 0
                ? `全部 ${counts.all ?? 0}`
                : i === 1
                  ? `待审批 ${counts.pending ?? 0}`
                  : s.label,
          }))}
          activeIndex={scopeIndex}
          onChange={setScopeIndex}
        />
        <div className="w-full max-w-sm">
          <TextField
            color={siteConfig.accent}
            value={search}
            onChange={setSearch}
            placeholder="搜索单号 / 标题 / 供应商"
            iconLeft={<MagniferLinear size={16} />}
          />
        </div>
      </div>

      {error ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-[28px] border border-dashed border-fg-grey-200 bg-white py-16">
          <p className="text-lg font-semibold text-fg-black">无法加载采购单</p>
          <p className="max-w-md text-center text-sm text-fg-grey-500">{error}</p>
          <Button color={siteConfig.accent} onClick={() => void refresh(scopes[scopeIndex].value)}>
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
            {items.length === 0 ? "暂无采购单" : "无匹配结果"}
          </p>
          <p className="text-sm text-fg-grey-500">
            {items.length === 0
              ? "还没有采购单，点击右上角发起第一单。"
              : "试试清空搜索或切换筛选。"}
          </p>
          {items.length === 0 ? (
            <Button color={siteConfig.accent} onClick={() => setFormOpen(true)}>
              发起采购
            </Button>
          ) : null}
        </div>
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
