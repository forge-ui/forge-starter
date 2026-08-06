"use client";

import { useEffect, useState } from "react";
import { Button, SelectOption, TextArea, TextField } from "@forge-ui-official/core";
import { Modal } from "@/components/ui/modal";
import { siteConfig } from "@/config/site";
import { usePurchaseOrdersStore } from "@/components/purchase-orders-store";
import { useSuppliersStore } from "@/components/suppliers-store";

type Line = { name: string; quantity: string; unitPrice: string };

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated?: (id: string) => void;
};

export function PurchaseOrderFormDialog({ open, onClose, onCreated }: Props) {
  const { create } = usePurchaseOrdersStore();
  const { suppliers } = useSuppliersStore();
  const [title, setTitle] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [reason, setReason] = useState("");
  const [lines, setLines] = useState<Line[]>([
    { name: "", quantity: "1", unitPrice: "100" },
  ]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setTitle("");
    setSupplierId(suppliers[0]?.id ?? "");
    setReason("");
    setLines([{ name: "", quantity: "1", unitPrice: "100" }]);
    setError(null);
    setSaving(false);
  }, [open, suppliers]);

  const supplierOptions = suppliers
    .filter((s) => s.status === "active" || s.status === "pending")
    .map((s) => ({ value: s.id, label: `${s.name} (${s.code})` }));

  async function handleSubmit() {
    if (!title.trim()) {
      setError("请填写标题");
      return;
    }
    if (!supplierId) {
      setError("请选择供应商");
      return;
    }
    const items = lines.map((l) => ({
      name: l.name.trim(),
      quantity: Number(l.quantity) || 0,
      unitPriceCents: Math.round((Number(l.unitPrice) || 0) * 100),
    }));
    setSaving(true);
    setError(null);
    try {
      const item = await create({
        title,
        supplierId,
        items,
        reason,
      });
      onClose();
      onCreated?.(item.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "创建失败");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="发起采购单" width="w-[640px]">
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-5">
        <TextField
          color={siteConfig.accent}
          label="标题"
          value={title}
          onChange={setTitle}
          placeholder="例：Q3 笔记本采购"
        />
        <SelectOption
          color={siteConfig.accent}
          label="供应商"
          width="100%"
          options={
            supplierOptions.length
              ? supplierOptions
              : [{ value: "", label: "暂无供应商，请先创建" }]
          }
          value={supplierId}
          onChange={setSupplierId}
        />
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-fg-black">明细行</p>
            <Button
              color="grey"
              variant="tertiary"
              size="sm"
              onClick={() =>
                setLines((prev) => [...prev, { name: "", quantity: "1", unitPrice: "0" }])
              }
            >
              加一行
            </Button>
          </div>
          {lines.map((line, index) => (
            <div key={index} className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_80px_100px_auto]">
              <TextField
                color={siteConfig.accent}
                label={index === 0 ? "物品" : undefined}
                value={line.name}
                onChange={(v) =>
                  setLines((prev) =>
                    prev.map((l, i) => (i === index ? { ...l, name: v } : l)),
                  )
                }
                placeholder="名称"
              />
              <TextField
                color={siteConfig.accent}
                label={index === 0 ? "数量" : undefined}
                value={line.quantity}
                onChange={(v) =>
                  setLines((prev) =>
                    prev.map((l, i) => (i === index ? { ...l, quantity: v } : l)),
                  )
                }
              />
              <TextField
                color={siteConfig.accent}
                label={index === 0 ? "单价(元)" : undefined}
                value={line.unitPrice}
                onChange={(v) =>
                  setLines((prev) =>
                    prev.map((l, i) => (i === index ? { ...l, unitPrice: v } : l)),
                  )
                }
              />
              <div className={index === 0 ? "flex items-end pb-0.5" : "flex items-center"}>
                <Button
                  color="grey"
                  variant="tertiary"
                  size="sm"
                  disabled={lines.length <= 1}
                  onClick={() => setLines((prev) => prev.filter((_, i) => i !== index))}
                >
                  删
                </Button>
              </div>
            </div>
          ))}
        </div>
        <TextArea
          color={siteConfig.accent}
          label="采购事由"
          value={reason}
          onChange={setReason}
        />
        {error ? <p className="text-sm text-fg-red">{error}</p> : null}
      </div>
      <div className="flex justify-end gap-2 border-t border-fg-grey-100 px-6 py-4">
        <Button color="grey" variant="tertiary" onClick={onClose} disabled={saving}>
          取消
        </Button>
        <Button color={siteConfig.accent} onClick={handleSubmit} disabled={saving}>
          {saving ? "提交中…" : "提交审批"}
        </Button>
      </div>
    </Modal>
  );
}
