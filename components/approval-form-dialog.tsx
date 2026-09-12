"use client";

import { useEffect, useState } from "react";
import { Button, SelectOption, TextArea, TextField } from "@forge-ui-official/core";
import { Modal } from "@/components/ui/modal";
import { siteConfig } from "@/config/site";
import { useApprovalsStore } from "@/components/approvals-store";
import { toast } from "@/lib/toast";
import {
  APPROVAL_TYPE_META,
  APPROVAL_TYPES,
  type ApprovalFormPayload,
  type ApprovalRequest,
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
  onCreated?: (item: ApprovalRequest) => void;
};

export function ApprovalFormDialog({ open, onClose, onCreated }: Props) {
  const { create } = useApprovalsStore();
  const [type, setType] = useState<ApprovalType>("leave");
  const [title, setTitle] = useState("");
  const [fields, setFields] = useState<Record<string, string>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setType("leave");
    setTitle("");
    setFields({});
    setFieldErrors({});
    setSaving(false);
  }, [open]);

  function setField(key: string, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: "" }));
  }

  function validate(form: ApprovalFormPayload): Record<string, string> {
    const errors: Record<string, string> = {};
    const d = form.data as Record<string, string>;
    if (type === "leave") {
      if (!d.leaveType?.trim()) errors.leaveType = "请选择请假类型";
      if (!d.startDate?.trim()) errors.startDate = "请填写开始日期";
      if (!d.endDate?.trim()) errors.endDate = "请填写结束日期";
      if (!d.reason?.trim()) errors.reason = "请填写请假事由";
    } else if (type === "expense") {
      if (!d.amount?.trim()) errors.amount = "请填写报销金额";
      if (!d.category?.trim()) errors.category = "请选择费用类别";
      if (!d.description?.trim()) errors.description = "请填写费用说明";
    } else if (type === "purchase") {
      if (!d.itemName?.trim()) errors.itemName = "请填写采购物品";
      if (!d.quantity?.trim()) errors.quantity = "请填写数量";
      if (!d.budget?.trim()) errors.budget = "请填写预算金额";
    } else if (type === "overtime") {
      if (!d.workDate?.trim()) errors.workDate = "请填写加班日期";
      if (!d.hours?.trim()) errors.hours = "请填写加班时长";
      if (!d.reason?.trim()) errors.reason = "请填写加班原因";
    } else {
      if (!d.summary?.trim()) errors.summary = "请填写申请摘要";
      if (!d.detail?.trim()) errors.detail = "请填写详细说明";
    }
    return errors;
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

  function handleClose() {
    if (saving) return;
    onClose();
  }

  async function submit() {
    const form = buildForm();
    const errors = validate(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setSaving(true);
    try {
      const item = await create({ type, title, form });
      toast.success("审批已提交");
      setSaving(false);
      onClose();
      onCreated?.(item);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "发起失败");
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title="发起审批" width="w-[560px]">
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
              setFieldErrors({});
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
              {fieldErrors.leaveType ? (
                <p className="text-sm text-fg-red">{fieldErrors.leaveType}</p>
              ) : null}
              <TextField
                color={siteConfig.accent}
                label="开始日期"
                value={fields.startDate ?? ""}
                onChange={(v) => setField("startDate", v)}
                placeholder="YYYY-MM-DD"
                state={fieldErrors.startDate ? "error" : undefined}
                errorMessage={fieldErrors.startDate}
              />
              <TextField
                color={siteConfig.accent}
                label="结束日期"
                value={fields.endDate ?? ""}
                onChange={(v) => setField("endDate", v)}
                placeholder="YYYY-MM-DD"
                state={fieldErrors.endDate ? "error" : undefined}
                errorMessage={fieldErrors.endDate}
              />
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
                state={fieldErrors.reason ? "error" : undefined}
                errorMessage={fieldErrors.reason}
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
                state={fieldErrors.amount ? "error" : undefined}
                errorMessage={fieldErrors.amount}
              />
              <SelectOption
                color={siteConfig.accent}
                label="费用类别"
                width="100%"
                options={expenseCategoryOptions}
                value={fields.category ?? ""}
                onChange={(v) => setField("category", v)}
              />
              {fieldErrors.category ? (
                <p className="text-sm text-fg-red">{fieldErrors.category}</p>
              ) : null}
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
                state={fieldErrors.description ? "error" : undefined}
                errorMessage={fieldErrors.description}
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
                state={fieldErrors.itemName ? "error" : undefined}
                errorMessage={fieldErrors.itemName}
              />
              <TextField
                color={siteConfig.accent}
                label="数量"
                value={fields.quantity ?? ""}
                onChange={(v) => setField("quantity", v)}
                state={fieldErrors.quantity ? "error" : undefined}
                errorMessage={fieldErrors.quantity}
              />
              <TextField
                color={siteConfig.accent}
                label="预算（元）"
                value={fields.budget ?? ""}
                onChange={(v) => setField("budget", v)}
                state={fieldErrors.budget ? "error" : undefined}
                errorMessage={fieldErrors.budget}
              />
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
                state={fieldErrors.workDate ? "error" : undefined}
                errorMessage={fieldErrors.workDate}
              />
              <TextField
                color={siteConfig.accent}
                label="时长（小时）"
                value={fields.hours ?? ""}
                onChange={(v) => setField("hours", v)}
                state={fieldErrors.hours ? "error" : undefined}
                errorMessage={fieldErrors.hours}
              />
              <TextArea
                color={siteConfig.accent}
                label="加班原因"
                rows={3}
                value={fields.reason ?? ""}
                onChange={(v) => setField("reason", v)}
                state={fieldErrors.reason ? "error" : undefined}
                errorMessage={fieldErrors.reason}
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
                state={fieldErrors.summary ? "error" : undefined}
                errorMessage={fieldErrors.summary}
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
                state={fieldErrors.detail ? "error" : undefined}
                errorMessage={fieldErrors.detail}
              />
            </>
          ) : null}
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-fg-grey-100 px-6 py-4">
        <Button color={siteConfig.accent} variant="tertiary" onClick={handleClose} disabled={saving}>
          取消
        </Button>
        <Button color={siteConfig.accent} onClick={() => void submit()} disabled={saving}>
          {saving ? "提交中…" : "提交审批"}
        </Button>
      </div>
    </Modal>
  );
}
