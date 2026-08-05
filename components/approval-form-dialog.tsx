"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, SelectOption, TextArea, TextField } from "@forge-ui-official/core";
import { Modal } from "@/components/ui/modal";
import { siteConfig } from "@/config/site";
import { useApprovalsStore } from "@/components/approvals-store";
import {
  APPROVAL_TYPE_META,
  APPROVAL_TYPES,
  type ApprovalFormPayload,
  type ApprovalType,
} from "@/lib/approvals/types";

const typeOptions = APPROVAL_TYPES.map((value) => ({
  value,
  label: APPROVAL_TYPE_META[value].label,
}));

const leaveTypeOptions = [
  { value: "年假", label: "年假" },
  { value: "事假", label: "事假" },
  { value: "病假", label: "病假" },
  { value: "调休", label: "调休" },
];

const expenseCategoryOptions = [
  { value: "差旅", label: "差旅" },
  { value: "餐饮", label: "餐饮" },
  { value: "交通", label: "交通" },
  { value: "办公", label: "办公" },
  { value: "其他", label: "其他" },
];

const urgencyOptions = [
  { value: "普通", label: "普通" },
  { value: "紧急", label: "紧急" },
  { value: "特急", label: "特急" },
];

type Props = {
  open: boolean;
  onClose: () => void;
};

export function ApprovalFormDialog({ open, onClose }: Props) {
  const router = useRouter();
  const { create } = useApprovalsStore();
  const [type, setType] = useState<ApprovalType>("leave");
  const [title, setTitle] = useState("");
  const [fields, setFields] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setType("leave");
    setTitle("");
    setFields({});
    setError(null);
    setSaving(false);
  }, [open]);

  function setField(key: string, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  function buildForm(): ApprovalFormPayload {
    if (type === "leave") {
      return {
        type: "leave",
        data: {
          leaveType: fields.leaveType ?? "",
          startDate: fields.startDate ?? "",
          endDate: fields.endDate ?? "",
          days: fields.days ?? "",
          reason: fields.reason ?? "",
        },
      };
    }
    if (type === "expense") {
      return {
        type: "expense",
        data: {
          amount: fields.amount ?? "",
          category: fields.category ?? "",
          occurDate: fields.occurDate ?? "",
          description: fields.description ?? "",
        },
      };
    }
    if (type === "purchase") {
      return {
        type: "purchase",
        data: {
          itemName: fields.itemName ?? "",
          quantity: fields.quantity ?? "",
          budget: fields.budget ?? "",
          vendor: fields.vendor ?? "",
          reason: fields.reason ?? "",
        },
      };
    }
    if (type === "overtime") {
      return {
        type: "overtime",
        data: {
          workDate: fields.workDate ?? "",
          hours: fields.hours ?? "",
          reason: fields.reason ?? "",
        },
      };
    }
    return {
      type: "general",
      data: {
        summary: fields.summary ?? "",
        detail: fields.detail ?? "",
        urgency: fields.urgency ?? "普通",
      },
    };
  }

  async function submit() {
    setError(null);
    setSaving(true);
    try {
      const form = buildForm();
      const item = await create({ type, title, form });
      onClose();
      router.push(`/approvals/${item.id}/`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "发起失败");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="发起审批" width="w-[560px]">
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
        <div className="flex flex-col gap-4">
          <SelectOption
            color={siteConfig.accent}
            label="审批类型"
            width="100%"
            options={typeOptions}
            value={type}
            onChange={(v) => {
              setType(v as ApprovalType);
              setFields({});
            }}
          />
          <TextField
            color={siteConfig.accent}
            label="标题（可选）"
            value={title}
            onChange={setTitle}
            placeholder="不填则自动生成"
          />

          {type === "leave" ? (
            <>
              <SelectOption
                color={siteConfig.accent}
                label="请假类型"
                width="100%"
                options={leaveTypeOptions}
                value={fields.leaveType ?? ""}
                onChange={(v) => setField("leaveType", v)}
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <TextField
                  color={siteConfig.accent}
                  label="开始日期"
                  value={fields.startDate ?? ""}
                  onChange={(v) => setField("startDate", v)}
                  placeholder="YYYY-MM-DD"
                />
                <TextField
                  color={siteConfig.accent}
                  label="结束日期"
                  value={fields.endDate ?? ""}
                  onChange={(v) => setField("endDate", v)}
                  placeholder="YYYY-MM-DD"
                />
              </div>
              <TextField
                color={siteConfig.accent}
                label="天数"
                value={fields.days ?? ""}
                onChange={(v) => setField("days", v)}
                placeholder="如 1.5"
              />
              <TextArea
                color={siteConfig.accent}
                label="事由"
                rows={3}
                value={fields.reason ?? ""}
                onChange={(v) => setField("reason", v)}
              />
            </>
          ) : null}

          {type === "expense" ? (
            <>
              <TextField
                color={siteConfig.accent}
                label="金额（元）"
                value={fields.amount ?? ""}
                onChange={(v) => setField("amount", v)}
                placeholder="如 320.00"
              />
              <SelectOption
                color={siteConfig.accent}
                label="费用类别"
                width="100%"
                options={expenseCategoryOptions}
                value={fields.category ?? ""}
                onChange={(v) => setField("category", v)}
              />
              <TextField
                color={siteConfig.accent}
                label="发生日期"
                value={fields.occurDate ?? ""}
                onChange={(v) => setField("occurDate", v)}
                placeholder="YYYY-MM-DD"
              />
              <TextArea
                color={siteConfig.accent}
                label="费用说明"
                rows={3}
                value={fields.description ?? ""}
                onChange={(v) => setField("description", v)}
              />
            </>
          ) : null}

          {type === "purchase" ? (
            <>
              <TextField
                color={siteConfig.accent}
                label="物品名称"
                value={fields.itemName ?? ""}
                onChange={(v) => setField("itemName", v)}
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <TextField
                  color={siteConfig.accent}
                  label="数量"
                  value={fields.quantity ?? ""}
                  onChange={(v) => setField("quantity", v)}
                />
                <TextField
                  color={siteConfig.accent}
                  label="预算（元）"
                  value={fields.budget ?? ""}
                  onChange={(v) => setField("budget", v)}
                />
              </div>
              <TextField
                color={siteConfig.accent}
                label="建议供应商"
                value={fields.vendor ?? ""}
                onChange={(v) => setField("vendor", v)}
              />
              <TextArea
                color={siteConfig.accent}
                label="采购事由"
                rows={3}
                value={fields.reason ?? ""}
                onChange={(v) => setField("reason", v)}
              />
            </>
          ) : null}

          {type === "overtime" ? (
            <>
              <TextField
                color={siteConfig.accent}
                label="加班日期"
                value={fields.workDate ?? ""}
                onChange={(v) => setField("workDate", v)}
                placeholder="YYYY-MM-DD"
              />
              <TextField
                color={siteConfig.accent}
                label="时长（小时）"
                value={fields.hours ?? ""}
                onChange={(v) => setField("hours", v)}
              />
              <TextArea
                color={siteConfig.accent}
                label="加班原因"
                rows={3}
                value={fields.reason ?? ""}
                onChange={(v) => setField("reason", v)}
              />
            </>
          ) : null}

          {type === "general" ? (
            <>
              <TextField
                color={siteConfig.accent}
                label="摘要"
                value={fields.summary ?? ""}
                onChange={(v) => setField("summary", v)}
              />
              <SelectOption
                color={siteConfig.accent}
                label="紧急程度"
                width="100%"
                options={urgencyOptions}
                value={fields.urgency ?? "普通"}
                onChange={(v) => setField("urgency", v)}
              />
              <TextArea
                color={siteConfig.accent}
                label="详细说明"
                rows={4}
                value={fields.detail ?? ""}
                onChange={(v) => setField("detail", v)}
              />
            </>
          ) : null}

          {error ? <p className="text-sm text-fg-red">{error}</p> : null}
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-fg-grey-100 px-6 py-4">
        <Button color={siteConfig.accent} variant="tertiary" onClick={onClose} disabled={saving}>
          取消
        </Button>
        <Button color={siteConfig.accent} onClick={() => void submit()} disabled={saving}>
          {saving ? "提交中…" : "提交审批"}
        </Button>
      </div>
    </Modal>
  );
}
