"use client";

/**
 * OA 审批详情 — detail 角色
 * 对齐 accounts/[id]：顶栏操作按钮；侧栏只放只读摘要；回列表走壳 onBack / 面包屑
 */

import { use, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Breadcrumbs,
  Button,
  StatusBadge,
  TextArea,
} from "@forge-ui-official/core";
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
    <div className="flex items-start justify-between gap-4 border-b border-fg-grey-100 py-3 last:border-b-0">
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

export default function ApprovalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { me, loading, getById, decide, cancel, refresh } = useApprovalsStore();
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [fetched, setFetched] = useState<ApprovalRequest | null>(null);

  useEffect(() => {
    void refresh("all");
  }, [refresh]);

  useEffect(() => {
    let cancelled = false;
    void fetch(`/api/approvals/${id}/`)
      .then((res) => res.json())
      .then((data: { ok: boolean; item?: ApprovalRequest }) => {
        if (!cancelled && data.ok && data.item) setFetched(data.item);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [id]);

  const item = fetched ?? getById(id);
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
      setFetched(next);
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
      setFetched(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "撤销失败");
    } finally {
      setBusy(false);
    }
  }

  if (loading && !item) {
    return <div className="py-20 text-center text-sm text-fg-grey-500">加载中…</div>;
  }

  // 不存在：空态 + 返回列表（与 accounts 一致；正常详情靠壳 onBack / 面包屑）
  if (!item) {
    return (
      <div className="flex flex-col items-center gap-4 py-20">
        <p className="text-lg font-semibold text-fg-black">审批单不存在</p>
        <Button color={siteConfig.accent} onClick={() => router.push("/approvals/")}>
          返回列表
        </Button>
      </div>
    );
  }

  const typeMeta = APPROVAL_TYPE_META[item.type as ApprovalType];
  const statusMeta = APPROVAL_STATUS_META[item.status as ApprovalStatus];

  return (
    <div className="flex flex-col gap-6">
      {/* 顶栏：标题 + 主操作（对齐 accounts 编辑/删除位置） */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-display-l font-semibold leading-9 tracking-fg text-fg-black">
            审批详情
          </h1>
          <Breadcrumbs
            color={siteConfig.accent}
            items={[
              { label: "工作台", href: "/dashboard/" },
              { label: "审批中心", href: "/approvals/" },
              { label: item.title },
            ]}
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge label={typeMeta.label} color={typeMeta.color} />
          <StatusBadge label={statusMeta.label} color={statusMeta.color} />
          {canApprove ? (
            <>
              <Button
                color="green"
                disabled={busy}
                onClick={() => void onDecide("approve")}
              >
                通过
              </Button>
              <Button
                color="red"
                variant="tertiary"
                disabled={busy}
                onClick={() => void onDecide("reject")}
              >
                驳回
              </Button>
            </>
          ) : null}
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
        </div>
      </div>

      {error ? <p className="text-sm text-fg-red">{error}</p> : null}

      {/* 主栏表单 + 侧栏只读摘要（侧栏禁止塞导航/返回） */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-5">
          <div className="rounded-xl bg-white p-6 outline outline-1 outline-offset-[-1px] outline-fg-grey-200">
            <h2 className="text-lg font-semibold text-fg-black">{item.title}</h2>
            <p className="mt-1 text-sm text-fg-grey-500">
              申请人 {item.applicantName}（@{item.applicantUsername}） · {item.created}
            </p>
            <div className="mt-4">
              {rows.map((row) => (
                <FieldRow key={row.label} label={row.label} value={row.value} />
              ))}
            </div>
          </div>

          {canApprove ? (
            <div className="rounded-xl bg-white p-6 outline outline-1 outline-offset-[-1px] outline-fg-grey-200">
              <h3 className="text-base font-semibold text-fg-black">审批意见</h3>
              <p className="mt-1 text-sm text-fg-grey-500">
                单步审批演示；驳回时意见必填。操作按钮在页面右上角。
              </p>
              <div className="mt-4">
                <TextArea
                  color={siteConfig.accent}
                  label="意见"
                  rows={3}
                  value={comment}
                  onChange={setComment}
                  placeholder="选填；驳回必填"
                />
              </div>
            </div>
          ) : null}
        </div>

        <aside className="flex flex-col self-start rounded-xl bg-white p-5 outline outline-1 outline-offset-[-1px] outline-fg-grey-200">
          <h3 className="mb-1 text-base font-semibold text-fg-black">审批信息</h3>
          <FieldRow label="状态" value={statusMeta.label} />
          <FieldRow label="类型" value={typeMeta.label} />
          <FieldRow label="审批人" value={item.approverName || "—"} />
          <FieldRow label="处理时间" value={item.decidedAt} />
          <FieldRow label="审批意见" value={item.approverComment || "—"} />
        </aside>
      </div>
    </div>
  );
}
