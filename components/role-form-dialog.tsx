"use client";

import { useEffect, useMemo, useState } from "react";
import { Button, SelectOption, TextArea, TextField } from "@forge-ui-official/core";
import { Modal } from "@/components/ui/modal";
import { siteConfig } from "@/config/site";
import { useRolesStore } from "@/components/roles-store";
import { usePermissionsStore } from "@/components/permissions-store";
import { toast } from "@/lib/toast";
import { RBAC_STATUS_META, type RbacStatus } from "@/lib/rbac/constants";

type FormState = {
  name: string;
  code: string;
  description: string;
  status: RbacStatus;
  permissionIds: string[];
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

const emptyForm = (): FormState => ({
  name: "",
  code: "",
  description: "",
  status: "active",
  permissionIds: [],
});

type Props = {
  open: boolean;
  onClose: () => void;
  roleId?: string | null;
  onCreated?: (id: string) => void;
};

const statusOptions = (Object.keys(RBAC_STATUS_META) as RbacStatus[]).map((value) => ({
  value,
  label: RBAC_STATUS_META[value].label,
}));

export function RoleFormDialog({ open, onClose, roleId = null, onCreated }: Props) {
  const { getById, createRole, updateRole } = useRolesStore();
  const { permissions, refresh: refreshPermissions } = usePermissionsStore();
  const mode = roleId ? "edit" : "create";
  const existing = roleId ? getById(roleId) : undefined;

  const [form, setForm] = useState<FormState>(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);

  const permissionOptions = useMemo(
    () =>
      permissions.map((item) => ({
        value: item.id,
        label: `${item.name}（${item.code}）`,
      })),
    [permissions],
  );

  useEffect(() => {
    if (!open) return;
    setFieldErrors({});
    setSaving(false);
    if (mode === "edit" && existing) {
      setForm({
        name: existing.name,
        code: existing.code,
        description: existing.description,
        status: existing.status,
        permissionIds: existing.permissionIds,
      });
    } else if (mode === "create") {
      setForm(emptyForm());
    }
  }, [open, mode, existing]);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): FieldErrors {
    const errors: FieldErrors = {};
    if (!form.name.trim()) errors.name = "请填写角色名称";
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
    if (mode === "edit" && roleId && !existing) {
      toast.error("角色不存在或已删除");
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
      description: form.description,
      status: form.status,
      permissionIds: form.permissionIds,
    };
    try {
      if (mode === "edit" && existing) {
        await updateRole(existing.id, payload);
        await refreshPermissions();
        toast.success("角色已保存");
        setSaving(false);
        onClose();
        return;
      }
      const created = await createRole(payload);
      await refreshPermissions();
      toast.success("角色已创建");
      setSaving(false);
      onClose();
      onCreated?.(created.id);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "保存失败");
      setSaving(false);
    }
  }

  if (open && mode === "edit" && roleId && !existing) {
    return (
      <Modal open onClose={handleClose} title="编辑角色" width="w-[560px]">
        <div className="px-6 py-8 text-center">
          <p className="text-sm text-fg-grey-700">角色不存在或已删除</p>
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
      title={mode === "edit" ? "编辑角色" : "新建角色"}
      width="w-[560px]"
    >
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
        <div className="flex flex-col gap-4">
          <TextField
            color={siteConfig.accent}
            label="名称"
            value={form.name}
            onChange={(v) => setField("name", v)}
            placeholder="如：运营"
            state={fieldErrors.name ? "error" : undefined}
            errorMessage={fieldErrors.name}
          />
          <TextField
            color={siteConfig.accent}
            label="编码"
            value={form.code}
            onChange={(v) => setField("code", v)}
            placeholder="operator"
            disabled={mode === "edit"}
            state={fieldErrors.code ? "error" : undefined}
            errorMessage={fieldErrors.code}
          />
          <SelectOption
            color={siteConfig.accent}
            label="状态"
            width="100%"
            options={statusOptions}
            value={form.status}
            onChange={(v) => setField("status", v as RbacStatus)}
          />
          <SelectOption
            type="multiple"
            color={siteConfig.accent}
            label="权限"
            width="100%"
            placeholder="选择该角色可执行的权限"
            options={permissionOptions}
            value={form.permissionIds}
            onChange={(values) => setField("permissionIds", values)}
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
