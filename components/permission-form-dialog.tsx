"use client";

import { useEffect, useState } from "react";
import { Button, SelectOption, TextArea, TextField } from "@forge-ui-official/core";
import { Modal } from "@/components/ui/modal";
import { siteConfig } from "@/config/site";
import { usePermissionsStore } from "@/components/permissions-store";
import { toast } from "@/lib/toast";
import {
  RBAC_ACTION_META,
  RBAC_ACTIONS,
  RBAC_RESOURCE_META,
  RBAC_RESOURCES,
  type RbacAction,
  type RbacResource,
} from "@/lib/rbac/constants";

type FormState = {
  name: string;
  code: string;
  resource: RbacResource;
  action: RbacAction;
  description: string;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

const emptyForm = (): FormState => ({
  name: "",
  code: "accounts:read",
  resource: "accounts",
  action: "read",
  description: "",
});

const resourceOptions = RBAC_RESOURCES.map((value) => ({
  value,
  label: RBAC_RESOURCE_META[value].label,
}));

const actionOptions = RBAC_ACTIONS.map((value) => ({
  value,
  label: RBAC_ACTION_META[value].label,
}));

type Props = {
  open: boolean;
  onClose: () => void;
  permissionId?: string | null;
  onCreated?: (id: string) => void;
};

export function PermissionFormDialog({
  open,
  onClose,
  permissionId = null,
  onCreated,
}: Props) {
  const { getById, createPermission, updatePermission } = usePermissionsStore();
  const mode = permissionId ? "edit" : "create";
  const existing = permissionId ? getById(permissionId) : undefined;
  const [form, setForm] = useState<FormState>(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setFieldErrors({});
    setSaving(false);
    if (mode === "edit" && existing) {
      setForm({
        name: existing.name,
        code: existing.code,
        resource: existing.resource,
        action: existing.action,
        description: existing.description,
      });
    } else if (mode === "create") {
      setForm(emptyForm());
    }
  }, [open, mode, existing]);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (mode === "create" && (key === "resource" || key === "action")) {
        next.code = `${next.resource}:${next.action}`;
      }
      return next;
    });
    setFieldErrors((prev) => ({ ...prev, [key]: undefined, code: undefined }));
  }

  function validate(): FieldErrors {
    const errors: FieldErrors = {};
    if (!form.name.trim()) errors.name = "请填写权限名称";
    if (mode === "create") {
      if (!/^[a-z][a-z0-9_:-]{1,47}$/.test(form.code.trim().toLowerCase())) {
        errors.code = "编码需 2–48 位，以小写字母开头，仅含小写字母、数字、_ : -";
      }
    }
    return errors;
  }

  function handleClose() {
    if (saving) return;
    setFieldErrors({});
    onClose();
  }

  async function submit() {
    if (mode === "edit" && permissionId && !existing) {
      toast.error("权限不存在或已删除");
      return;
    }
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name,
      code: mode === "edit" && existing ? existing.code : form.code,
      resource: form.resource,
      action: form.action,
      description: form.description,
    };
    try {
      if (mode === "edit" && existing) {
        await updatePermission(existing.id, payload);
        toast.success("权限已保存");
        setSaving(false);
        onClose();
        return;
      }
      const created = await createPermission(payload);
      toast.success("权限已创建");
      setSaving(false);
      onClose();
      onCreated?.(created.id);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "保存失败");
      setSaving(false);
    }
  }

  if (open && mode === "edit" && permissionId && !existing) {
    return (
      <Modal open onClose={handleClose} title="编辑权限" width="w-[560px]">
        <div className="px-6 py-8 text-center">
          <p className="text-sm text-fg-grey-700">权限不存在或已删除</p>
          <div className="mt-4">
            <Button color={siteConfig.accent} onClick={handleClose}>
              关闭
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={mode === "edit" ? "编辑权限" : "新建权限"}
      width="w-[560px]"
    >
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
        <div className="flex flex-col gap-4">
          <TextField
            color={siteConfig.accent}
            label="名称"
            value={form.name}
            onChange={(v) => setField("name", v)}
            placeholder="如：查看账号"
            state={fieldErrors.name ? "error" : undefined}
            errorMessage={fieldErrors.name}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SelectOption
              color={siteConfig.accent}
              label="资源"
              width="100%"
              options={resourceOptions}
              value={form.resource}
              onChange={(v) => setField("resource", v as RbacResource)}
            />
            <SelectOption
              color={siteConfig.accent}
              label="操作"
              width="100%"
              options={actionOptions}
              value={form.action}
              onChange={(v) => setField("action", v as RbacAction)}
            />
          </div>
          <TextField
            color={siteConfig.accent}
            label="编码"
            value={form.code}
            onChange={(v) => setField("code", v)}
            placeholder="accounts:read"
            disabled={mode === "edit"}
            state={fieldErrors.code ? "error" : undefined}
            errorMessage={fieldErrors.code}
          />
          <TextArea
            color={siteConfig.accent}
            label="说明"
            rows={3}
            value={form.description}
            onChange={(v) => setField("description", v)}
            placeholder="可选"
          />
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-fg-grey-100 px-6 py-4">
        <Button color={siteConfig.accent} variant="tertiary" onClick={handleClose} disabled={saving}>
          取消
        </Button>
        <Button color={siteConfig.accent} onClick={() => void submit()} disabled={saving}>
          {saving ? "保存中…" : mode === "edit" ? "保存" : "创建"}
        </Button>
      </div>
    </Modal>
  );
}
