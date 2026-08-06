"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, SelectOption, TextArea, TextField } from "@forge-ui-official/core";
import { Modal } from "@/components/ui/modal";
import { siteConfig } from "@/config/site";
import { useSuppliersStore } from "@/components/suppliers-store";
import {
  SUPPLIER_CATEGORIES,
  SUPPLIER_CATEGORY_META,
  SUPPLIER_STATUS_META,
  type SupplierCategory,
  type SupplierStatus,
} from "@/lib/suppliers/types";

const categoryOptions = SUPPLIER_CATEGORIES.map((value) => ({
  value,
  label: SUPPLIER_CATEGORY_META[value].label,
}));
const statusOptions = (Object.keys(SUPPLIER_STATUS_META) as SupplierStatus[]).map((value) => ({
  value,
  label: SUPPLIER_STATUS_META[value].label,
}));
const ratingOptions = [1, 2, 3, 4, 5].map((n) => ({
  value: String(n),
  label: `${n} 星`,
}));

type FormState = {
  name: string;
  code: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  category: SupplierCategory;
  status: SupplierStatus;
  rating: string;
  address: string;
  notes: string;
};

const emptyForm = (): FormState => ({
  name: "",
  code: "",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  category: "general",
  status: "pending",
  rating: "3",
  address: "",
  notes: "",
});

type Props = {
  open: boolean;
  onClose: () => void;
  supplierId?: string | null;
  goToDetailOnCreate?: boolean;
};

export function SupplierFormDialog({
  open,
  onClose,
  supplierId = null,
  goToDetailOnCreate = true,
}: Props) {
  const router = useRouter();
  const { getById, createSupplier, updateSupplier } = useSuppliersStore();
  const mode = supplierId ? "edit" : "create";
  const existing = supplierId ? getById(supplierId) : undefined;

  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setSaving(false);
    if (mode === "edit" && existing) {
      setForm({
        name: existing.name,
        code: existing.code,
        contactName: existing.contactName,
        contactEmail: existing.contactEmail,
        contactPhone: existing.contactPhone,
        category: existing.category,
        status: existing.status,
        rating: String(existing.rating),
        address: existing.address,
        notes: existing.notes,
      });
    } else if (mode === "create") {
      setForm(emptyForm());
    }
  }, [open, mode, existing]);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit() {
    if (!form.name.trim()) {
      setError("请填写供应商名称");
      return;
    }
    if (mode === "create" && !/^[A-Za-z0-9_-]{2,24}$/.test(form.code.trim())) {
      setError("编码需 2–24 位字母数字 _ -");
      return;
    }
    setSaving(true);
    setError(null);
    const payload = {
      name: form.name,
      code: form.code.toUpperCase(),
      contactName: form.contactName,
      contactEmail: form.contactEmail,
      contactPhone: form.contactPhone,
      category: form.category,
      status: form.status,
      rating: Number(form.rating) || 3,
      address: form.address,
      notes: form.notes,
    };
    try {
      if (mode === "edit" && supplierId) {
        await updateSupplier(supplierId, payload);
        onClose();
      } else {
        const created = await createSupplier(payload);
        onClose();
        if (goToDetailOnCreate) router.push(`/suppliers/${created.id}/`);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "保存失败");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === "edit" ? "编辑供应商" : "新建供应商"}
      width="w-[560px]"
    >
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-5">
        <TextField
          color={siteConfig.accent}
          label="名称"
          value={form.name}
          onChange={(v) => setField("name", v)}
        />
        <TextField
          color={siteConfig.accent}
          label="编码"
          value={form.code}
          onChange={(v) => setField("code", v)}
          disabled={mode === "edit"}
          placeholder="SUP-HW-001"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            color={siteConfig.accent}
            label="联系人"
            value={form.contactName}
            onChange={(v) => setField("contactName", v)}
          />
          <TextField
            color={siteConfig.accent}
            label="电话"
            value={form.contactPhone}
            onChange={(v) => setField("contactPhone", v)}
          />
        </div>
        <TextField
          color={siteConfig.accent}
          label="邮箱"
          value={form.contactEmail}
          onChange={(v) => setField("contactEmail", v)}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SelectOption
            color={siteConfig.accent}
            label="品类"
            width="100%"
            options={categoryOptions}
            value={form.category}
            onChange={(v) => setField("category", v as SupplierCategory)}
          />
          <SelectOption
            color={siteConfig.accent}
            label="状态"
            width="100%"
            options={statusOptions}
            value={form.status}
            onChange={(v) => setField("status", v as SupplierStatus)}
          />
          <SelectOption
            color={siteConfig.accent}
            label="评级"
            width="100%"
            options={ratingOptions}
            value={form.rating}
            onChange={(v) => setField("rating", v)}
          />
        </div>
        <TextField
          color={siteConfig.accent}
          label="地址"
          value={form.address}
          onChange={(v) => setField("address", v)}
        />
        <TextArea
          color={siteConfig.accent}
          label="备注"
          value={form.notes}
          onChange={(v) => setField("notes", v)}
        />
        {error ? <p className="text-sm text-fg-red">{error}</p> : null}
      </div>
      <div className="flex justify-end gap-2 border-t border-fg-grey-100 px-6 py-4">
        <Button color="grey" variant="tertiary" onClick={onClose} disabled={saving}>
          取消
        </Button>
        <Button color={siteConfig.accent} onClick={handleSubmit} disabled={saving}>
          {saving ? "保存中…" : "保存"}
        </Button>
      </div>
    </Modal>
  );
}
