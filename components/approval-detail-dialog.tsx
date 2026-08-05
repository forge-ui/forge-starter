"use client";

/**
 * 审批详情弹窗 — 字段少，不走全页 detail
 */

import { useEffect, useMemo, useState } from "react";
import { Button, StatusBadge, TextArea } from "@forge-ui-official/core";
import { Modal } from "@/components/ui/modal";
import { siteConfig } from "@/config/site";
import { useApprovalsStore } from "@/components/approvals-store";
import {
  APPROVAL_STATUS_META,
  APPROVAL_TYPE_META,
  type ApprovalRequest,
  type ApprovalStatus,
  type ApprovalType,
} from "@/lib/approvals/types";

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

function formRows(item: ApprovalRequest): { label: string; value: string }[] {
  const d = item.form.data as Record<string, string>;
  if (item.type === "leave") {
    return [
      { label: "请假类型", value: d.leaveType },
      { label: "开始日期", value: d.startDate },
      { label: "结束日期", value: d.endDate },
      { label: "天数", value: d.days },
      { label: "事由", value: d.reason },
    ];
  }
  if (item.type === "expense") {
    return [
      { label: "金额", value: d.amount ? `¥ ${d.amount}` : "" },
      { label: "类别", value: d.category },
      { label: "发生日期", value: d.occurDate },
      { label: "说明", value: d.description },
    ];
  }
  if (item.type === "purchase") {
    return [
      { label: "物品", value: d.itemName },
      { label: "数量", value: d.quantity },
      { label: "预算", value: d.budget ? `¥ ${d.budget}` : "" },
      { label: "供应商", value: d.vendor },
      { label: "事由", value: d.reason },
    ];
  }
  if (item.type === "overtime") {
    return [
      { label: "加班日期", value: d.workDate },
      { label: "时长（小时）", value: d.hours },
      { label: "原因", value: d.reason },
    ];
  }
  return [
    { label: "摘要", value: d.summary },
    { label: "紧急程度", value: d.urgency },
    { label: "详细说明", value: d.detail },
  ];
}

type Props = {
  open: boolean;
  approvalId: string | null;
  onClose: () => void;
};

export function ApprovalDetailDialog({ open, approvalId, onClose }: Props) {
  const { me, getById, decide, cancel } = useApprovalsStore();
  const [item, setItem] = useState<ApprovalRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open || !approvalId) {
      setItem(null);
      setComment("");
      setError(null);
      setBusy(false);
      return;
    }

    const cached = getById(approvalId);
    if (cached) setItem(cached);

    let cancelled = false;
    setLoading(true);
    void fetch(`/api/approvals/${approvalId}/`)
      .then((res) => res.json())
      .then((data: { ok: boolean; item?: ApprovalRequest; error?: string }) => {
        if (cancelled) return;
        if (data.ok && data.item) setItem(data.item);
        else setError(data.error ?? "加载失败");
      })
      .catch(() => {
        if (!cancelled) setError("网络错误");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, approvalId, getById]);

  const rows = useMemo(() => (item ? formRows(item) : []), [item]);

  const canApprove =
    item
    && item.status === "pending"
    && me
    && item.applicantUsername !== me;
  const canCancel =
    item
    && item.status === "pending"
    && me
    && item.applicantUsername === me;

  async function onDecide(action: "approve" | "reject") {
    if (!item) return;
    setBusy(true);
    setError(null);
    try {
      const next = await decide(item.id, { action, comment });
      setItem(next);
      setComment("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "操作失败");
    } finally {
      setBusy(false);
    }
  }

  async function onCancel() {
    if (!item) return;
    setBusy(true);
    setError(null);
    try {
      const next = await cancel(item.id);
      setItem(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "撤销失败");
    } finally {
      setBusy(false);
    }
  }

  const typeMeta = item
    ? APPROVAL_TYPE_META[item.type as ApprovalType]
    : null;
  const statusMeta = item
    ? APPROVAL_STATUS_META[item.status as ApprovalStatus]
    : null;

  return (
    <Modal open={open} onClose={onClose} title="审批详情" width="w-[560px]">
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
        {loading && !item ? (
          <p className="py-8 text-center text-sm text-fg-grey-500">加载中…</p>
        ) : !item ? (
          <p className="py-8 text-center text-sm text-fg-grey-500">
            {error ?? "审批单不存在"}
          </p>
        ) : (
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h4 className="text-base font-semibold text-fg-black">{item.title}</h4>
                <p className="mt-1 text-sm text-fg-grey-500">
                  {item.applicantName}（@{item.applicantUsername}） · {item.created}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {typeMeta ? (
                  <StatusBadge label={typeMeta.label} color={typeMeta.color} />
                ) : null}
                {statusMeta ? (
                  <StatusBadge label={statusMeta.label} color={statusMeta.color} />
                ) : null}
              </div>
            </div>

            <div>
              {rows.map((row) => (
                <FieldRow key={row.label} label={row.label} value={row.value} />
              ))}
            </div>

            <div className="rounded-xl bg-fg-grey-50 px-4 py-3">
              <FieldRow label="审批人" value={item.approverName || "—"} />
              <FieldRow label="处理时间" value={item.decidedAt} />
              <FieldRow label="审批意见" value={item.approverComment || "—"} />
            </div>

            {canApprove ? (
              <TextArea
                color={siteConfig.accent}
                label="审批意见"
                rows={3}
                value={comment}
                onChange={setComment}
                placeholder="选填；驳回必填"
              />
            ) : null}

            {error ? <p className="text-sm text-fg-red">{error}</p> : null}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-fg-grey-100 px-6 py-4">
        <Button color={siteConfig.accent} variant="tertiary" onClick={onClose} disabled={busy}>
          关闭
        </Button>
        <div className="flex flex-wrap items-center gap-2">
          {canCancel ? (
            <Button
              color="red"
              variant="tertiary"
              disabled={busy}
              onClick={() => void onCancel()}
            >
              撤销申请
            </Button>
          ) : null}
          {canApprove ? (
            <>
              <Button
                color="red"
                variant="tertiary"
                disabled={busy}
                onClick={() => void onDecide("reject")}
              >
                驳回
              </Button>
              <Button
                color="green"
                disabled={busy}
                onClick={() => void onDecide("approve")}
              >
                通过
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </Modal>
  );
}
