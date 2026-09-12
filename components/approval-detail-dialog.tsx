"use client";

import { useEffect, useState } from "react";
import { Button, DescriptionItem, StatusBadge, TextArea } from "@forge-ui-official/core";
import { Modal } from "@/components/ui/modal";
import { siteConfig } from "@/config/site";
import { useApprovalsStore } from "@/components/approvals-store";
import { toast } from "@/lib/toast";
import { apiFetch, parseApiJson } from "@/lib/api/browser";
import {
  APPROVAL_STATUS_META,
  APPROVAL_TYPE_META,
  type ApprovalRequest,
} from "@/lib/approvals/types";

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
  approvalId: string | null;
  onClose: () => void;
};

export function ApprovalDetailDialog({ approvalId, onClose }: Props) {
  const { me, getById, decide, cancel } = useApprovalsStore();
  const cached = approvalId ? getById(approvalId) : undefined;
  const [item, setItem] = useState<ApprovalRequest | null>(cached ?? null);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!approvalId) {
      setItem(null);
      setComment("");
      setBusy(false);
      return;
    }
    const fromStore = getById(approvalId);
    if (fromStore) setItem(fromStore);

    let cancelled = false;
    void apiFetch(`/api/approvals/${approvalId}/`)
      .then((res) => parseApiJson<{ item?: ApprovalRequest }>(res))
      .then((data) => {
        if (cancelled) return;
        if (data.ok && data.item) setItem(data.item);
      })
      .catch(() => {
        /* keep cached */
      });

    return () => {
      cancelled = true;
    };
  }, [approvalId, getById]);

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
    try {
      const next = await decide(item.id, { action, comment });
      setItem(next);
      setComment("");
      toast.success(action === "approve" ? "已通过" : "已驳回");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "操作失败");
    } finally {
      setBusy(false);
    }
  }

  async function onCancel() {
    if (!item) return;
    setBusy(true);
    try {
      const next = await cancel(item.id);
      setItem(next);
      toast.success("已撤销申请");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "撤销失败");
    } finally {
      setBusy(false);
    }
  }

  const statusMeta = item ? APPROVAL_STATUS_META[item.status] : null;

  return (
    <Modal open={approvalId != null} onClose={onClose} title="审批详情" width="w-[520px]">
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
        {item ? (
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-base font-semibold text-fg-black">{item.title}</h4>
              {statusMeta ? (
                <StatusBadge label={statusMeta.label} color={statusMeta.color} />
              ) : null}
            </div>
            <DescriptionItem label="类型" content={APPROVAL_TYPE_META[item.type].label} />
            <DescriptionItem
              label="申请人"
              content={`${item.applicantName}（@${item.applicantUsername}）`}
            />
            <DescriptionItem label="提交时间" content={item.created} />
            {formRows(item).map((row) => (
              <DescriptionItem key={row.label} label={row.label} content={row.value || "—"} />
            ))}
            <DescriptionItem label="审批人" content={item.approverName || "—"} />
            <DescriptionItem label="处理时间" content={item.decidedAt} />
            <DescriptionItem label="审批意见" content={item.approverComment || "—"} />
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
          </div>
        ) : (
          <p className="text-sm text-fg-grey-500">审批单不存在或已删除</p>
        )}
      </div>
      <div className="flex items-center justify-between border-t border-fg-grey-100 px-6 py-4">
        <Button color={siteConfig.accent} variant="tertiary" onClick={onClose} disabled={busy}>
          关闭
        </Button>
        <div className="flex flex-wrap items-center gap-2">
          {canCancel ? (
            <Button color="red" variant="tertiary" disabled={busy} onClick={() => void onCancel()}>
              撤销申请
            </Button>
          ) : null}
          {canApprove ? (
            <>
              <Button color="red" variant="tertiary" disabled={busy} onClick={() => void onDecide("reject")}>
                驳回
              </Button>
              <Button color="green" disabled={busy} onClick={() => void onDecide("approve")}>
                通过
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </Modal>
  );
}
