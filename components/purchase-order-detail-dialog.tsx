"use client";

import { useEffect, useState } from "react";
import { Button, StatusBadge, TextArea } from "@forge-ui-official/core";
import { Modal } from "@/components/ui/modal";
import { siteConfig } from "@/config/site";
import { usePurchaseOrdersStore } from "@/components/purchase-orders-store";
import { PO_STATUS_META, type PurchaseOrder } from "@/lib/purchase-orders/types";

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-fg-grey-100 py-2.5 last:border-b-0">
      <span className="shrink-0 text-sm text-fg-grey-500">{label}</span>
      <span className="text-right text-sm font-medium text-fg-black whitespace-pre-wrap">
        {value || "—"}
      </span>
    </div>
  );
}

type Props = {
  open: boolean;
  orderId: string | null;
  onClose: () => void;
};

export function PurchaseOrderDetailDialog({ open, orderId, onClose }: Props) {
  const { me, getById, decide, cancel, markOrdered } = usePurchaseOrdersStore();
  const [item, setItem] = useState<PurchaseOrder | null>(null);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open || !orderId) {
      setItem(null);
      setComment("");
      setError(null);
      return;
    }
    const cached = getById(orderId);
    if (cached) setItem(cached);
    let cancelled = false;
    fetch(`/api/purchase-orders/${orderId}/`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && data.ok && data.item) setItem(data.item);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [open, orderId, getById]);

  const canDecide =
    item?.status === "pending" && item.requesterUsername !== me && Boolean(me);
  const canCancel =
    item?.status === "pending" && item.requesterUsername === me;
  const canMarkOrdered =
    item?.status === "approved"
    && (item.requesterUsername === me || item.approverUsername === me);

  async function run(action: "approve" | "reject" | "cancel" | "mark_ordered") {
    if (!item) return;
    setBusy(true);
    setError(null);
    try {
      if (action === "approve" || action === "reject") {
        await decide(item.id, { action, comment });
      } else if (action === "cancel") {
        await cancel(item.id);
      } else {
        await markOrdered(item.id);
      }
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "操作失败");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="采购单详情" width="w-[560px]">
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
        {!item ? (
          <p className="text-sm text-fg-grey-500">加载中…</p>
        ) : (
          <>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold text-fg-black">{item.title}</h3>
              <StatusBadge
                label={PO_STATUS_META[item.status].label}
                color={PO_STATUS_META[item.status].color}
              />
            </div>
            <FieldRow label="单号" value={item.orderNo} />
            <FieldRow label="供应商" value={item.supplierName} />
            <FieldRow label="金额" value={item.amountLabel} />
            <FieldRow label="申请人" value={`${item.requesterName} (${item.requesterUsername})`} />
            <FieldRow label="事由" value={item.reason} />
            <FieldRow label="创建" value={item.created} />
            {item.approverName ? (
              <>
                <FieldRow label="审批人" value={item.approverName} />
                <FieldRow label="意见" value={item.approverComment} />
                <FieldRow label="审批时间" value={item.decidedAt} />
              </>
            ) : null}

            <div className="mt-4 rounded-2xl border border-fg-grey-100 p-3">
              <p className="mb-2 text-xs font-semibold text-fg-grey-500">明细</p>
              {item.items.map((line, i) => (
                <div
                  key={`${line.name}-${i}`}
                  className="flex justify-between gap-2 border-b border-fg-grey-50 py-2 text-sm last:border-0"
                >
                  <span className="text-fg-black">
                    {line.name} × {line.quantity}
                  </span>
                  <span className="text-fg-grey-600">
                    ¥ {((line.unitPriceCents * line.quantity) / 100).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {canDecide ? (
              <div className="mt-4">
                <TextArea
                  color={siteConfig.accent}
                  label="审批意见"
                  value={comment}
                  onChange={setComment}
                  placeholder="驳回时必填"
                />
              </div>
            ) : null}
            {error ? <p className="mt-3 text-sm text-fg-red">{error}</p> : null}
          </>
        )}
      </div>
      <div className="flex flex-wrap justify-between gap-2 border-t border-fg-grey-100 px-6 py-4">
        <Button color="grey" variant="tertiary" onClick={onClose}>
          关闭
        </Button>
        <div className="flex flex-wrap gap-2">
          {canCancel ? (
            <Button color="grey" variant="tertiary" disabled={busy} onClick={() => run("cancel")}>
              撤销
            </Button>
          ) : null}
          {canMarkOrdered ? (
            <Button color={siteConfig.accent} disabled={busy} onClick={() => run("mark_ordered")}>
              标记已下单
            </Button>
          ) : null}
          {canDecide ? (
            <>
              <Button color="grey" variant="tertiary" disabled={busy} onClick={() => run("reject")}>
                驳回
              </Button>
              <Button color={siteConfig.accent} disabled={busy} onClick={() => run("approve")}>
                通过
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </Modal>
  );
}
