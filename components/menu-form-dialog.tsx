"use client";

import { useEffect, useMemo, useState } from "react";
import { Button, SelectOption, TextArea, TextField } from "@forge-ui-official/core";
import { Modal } from "@/components/ui/modal";
import { siteConfig } from "@/config/site";
import { useMenusStore } from "@/components/menus-store";
import { toast } from "@/lib/toast";
import { RBAC_STATUS_META, type RbacStatus } from "@/lib/rbac/constants";

const ROOT_PARENT = "__root__";

type FormState = {
  name: string;
  code: string;
  path: string;
  parentId: string;
  sort: string;
  status: RbacStatus;
  description: string;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

const emptyForm = (): FormState => ({
  name: "",
  code: "",
  path: "/",
  parentId: ROOT_PARENT,
  sort: "100",
  status: "active",
  description: "",
});

const statusOptions = (Object.keys(RBAC_STATUS_META) as RbacStatus[]).map((value) => ({
  value,
  label: RBAC_STATUS_META[value].label,
}));

type Props = {
  open: boolean;
  onClose: () => void;
  menuId?: string | null;
  onCreated?: (id: string) => void;
};

export function MenuFormDialog({ open, onClose, menuId = null, onCreated }: Props) {
  const { menus, getById, createMenu, updateMenu } = useMenusStore();
  const mode = menuId ? "edit" : "create";
  const existing = menuId ? getById(menuId) : undefined;
  const [form, setForm] = useState<FormState>(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);

  const parentOptions = useMemo(
    () => [
      { value: ROOT_PARENT, label: "一级菜单（无上级）" },
      ...menus
        .filter((item) => !item.parentId && item.id !== existing?.id)
        .map((item) => ({ value: item.id, label: item.name })),
    ],
    [menus, existing?.id],
  );

  useEffect(() => {
    if (!open) return;
    setFieldErrors({});
    setSaving(false);
    if (mode === "edit" && existing) {
      setForm({
        name: existing.name,
        code: existing.code,
        path: existing.path,
        parentId: existing.parentId ?? ROOT_PARENT,
        sort: String(existing.sort),
        status: existing.status,
        description: existing.description,
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
    if (!form.name.trim()) errors.name = "请填写菜单名称";
    if (mode === "create") {
      if (!/^[a-z][a-z0-9_:-]{1,47}$/.test(form.code.trim().toLowerCase())) {
        errors.code = "编码需 2–48 位，以小写字母开头，仅含小写字母、数字、_ : -";
      }
    }
    if (!form.path.trim() || !form.path.trim().startsWith("/")) {
      errors.path = "路径需以 / 开头";
    }
    const sort = Number(form.sort);
    if (!Number.isInteger(sort) || sort < 0 || sort > 9999) {
      errors.sort = "排序需为 0–9999 的整数";
    }
    return errors;
  }

  function handleClose() {
    if (saving) return;
    setFieldErrors({});
    onClose();
  }

  async function submit() {
    if (mode === "edit" && menuId && !existing) {
      toast.error("菜单不存在或已删除");
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
      path: form.path,
      parentId: form.parentId === ROOT_PARENT ? null : form.parentId,
      sort: Number(form.sort),
      status: form.status,
      description: form.description,
    };
    try {
      if (mode === "edit" && existing) {
        await updateMenu(existing.id, payload);
        toast.success("菜单已保存");
        setSaving(false);
        onClose();
        return;
      }
      const created = await createMenu(payload);
      toast.success("菜单已创建");
      setSaving(false);
      onClose();
      onCreated?.(created.id);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "保存失败");
      setSaving(false);
    }
  }

  if (open && mode === "edit" && menuId && !existing) {
    return (
      <Modal open onClose={handleClose} title="编辑菜单" width="w-[560px]">
        <div className="px-6 py-8 text-center">
          <p className="text-sm text-fg-grey-700">菜单不存在或已删除</p>
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
      title={mode === "edit" ? "编辑菜单" : "新建菜单"}
      width="w-[560px]"
    >
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
        <div className="flex flex-col gap-4">
          <TextField
            color={siteConfig.accent}
            label="名称"
            value={form.name}
            onChange={(v) => setField("name", v)}
            placeholder="如：角色"
            state={fieldErrors.name ? "error" : undefined}
            errorMessage={fieldErrors.name}
          />
          <TextField
            color={siteConfig.accent}
            label="编码"
            value={form.code}
            onChange={(v) => setField("code", v)}
            placeholder="roles"
            disabled={mode === "edit"}
            state={fieldErrors.code ? "error" : undefined}
            errorMessage={fieldErrors.code}
          />
          <TextField
            color={siteConfig.accent}
            label="路径"
            value={form.path}
            onChange={(v) => setField("path", v)}
            placeholder="/roles/"
            disabled={existing?.builtin}
            state={fieldErrors.path ? "error" : undefined}
            errorMessage={fieldErrors.path}
          />
          {!existing?.builtin ? (
            <SelectOption
              color={siteConfig.accent}
              label="上级菜单"
              width="100%"
              options={parentOptions}
              value={form.parentId}
              onChange={(v) => setField("parentId", v)}
            />
          ) : null}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextField
              color={siteConfig.accent}
              label="排序"
              value={form.sort}
              onChange={(v) => setField("sort", v)}
              placeholder="10"
              state={fieldErrors.sort ? "error" : undefined}
              errorMessage={fieldErrors.sort}
            />
            <SelectOption
              color={siteConfig.accent}
              label="状态"
              width="100%"
              options={statusOptions}
              value={form.status}
              onChange={(v) => setField("status", v as RbacStatus)}
            />
          </div>
          <TextArea
            color={siteConfig.accent}
            label="说明"
            rows={3}
            value={form.description}
            onChange={(v) => setField("description", v)}
            placeholder={
              existing?.builtin
                ? "内置菜单与侧栏模块 ID 对齐；启用状态不改变侧栏显示"
                : "自定义菜单仅登记在目录中，不会自动出现在侧栏"
            }
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
