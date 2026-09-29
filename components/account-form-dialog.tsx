"use client";

import { accountCreateSchema, accountPatchSchema } from "@/lib/accounts/input";
import type { Receipt } from "@/lib/semantic/operations";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, SelectOption, TextArea, TextField } from "@forge-ui-official/core";
import { toast } from "@/lib/toast";
import { Modal } from "@/components/ui/modal";
import { siteConfig } from "@/config/site";
import { useAccountsStore } from "@/components/accounts-store";
import {
  ACCOUNT_DEPARTMENTS,
  ACCOUNT_ROLES,
  ACCOUNT_STATUS_META,
  isAccountStatus,
  type AccountRole,
  type AccountStatus,
} from "@/lib/accounts/types";

const roleOptions = ACCOUNT_ROLES.map((value) => ({ value, label: value }));
const deptOptions = ACCOUNT_DEPARTMENTS.map((value) => ({ value, label: value }));
const statusOptions = (Object.keys(ACCOUNT_STATUS_META) as AccountStatus[]).map((value) => ({
  value,
  label: ACCOUNT_STATUS_META[value].label,
}));

type FormState = {
  name: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: AccountStatus;
  notes: string;
};

const emptyForm = (): FormState => ({
  name: "",
  username: "",
  email: "",
  phone: "",
  role: ACCOUNT_ROLES[1],
  department: ACCOUNT_DEPARTMENTS[0],
  status: "pending",
  notes: "",
});

type Props = {
  open: boolean;
  onClose: () => void;
  accountId?: string | null;
  goToDetailOnCreate?: boolean;
  draft?: Record<string, string> | null;
  onSaved?: (receipt?: Receipt) => void;
  operationId?: string;
  expectedRevision?: number;
};

function formFromDraft(base: FormState, draft?: Record<string, string> | null): FormState {
  if (!draft) return base;
  const status = draft.status && isAccountStatus(draft.status) ? draft.status : base.status;
  return {
    name: draft.name ?? base.name,
    username: draft.username ?? base.username,
    email: draft.email ?? base.email,
    phone: draft.phone ?? base.phone,
    role: draft.role || base.role,
    department: draft.department || base.department,
    status,
    notes: draft.notes ?? base.notes,
  };
}

export function AccountFormDialog({
  open,
  onClose,
  accountId = null,
  goToDetailOnCreate = true,
  draft = null,
  onSaved,
  operationId,
  expectedRevision,
}: Props) {
  const router = useRouter();
  const { getById, createAccount, updateAccount } = useAccountsStore();
  const mode = accountId ? "edit" : "create";
  const existing = accountId ? getById(accountId) : undefined;

  const saveKey = useRef("");
  const revision = useRef<number | undefined>(undefined);
  const initialized = useRef("");
  const [form, setForm] = useState<FormState>(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) { initialized.current = ""; return; }
    const identity = `${accountId ?? "new"}:${operationId ?? "manual"}`;
    if (initialized.current === identity) return;
    if (mode === "edit" && !existing) return;
    initialized.current = identity;
    saveKey.current = crypto.randomUUID();
    revision.current = expectedRevision ?? existing?.revision;
    setFieldErrors({});
    setSaving(false);
    if (mode === "edit" && existing) {
      setForm(formFromDraft({
        name: existing.name,
        username: existing.username,
        email: existing.email,
        phone: existing.phone,
        role: existing.role,
        department: existing.department,
        status: existing.status,
        notes: existing.notes,
      }, draft));
    } else if (mode === "create") {
      setForm(formFromDraft(emptyForm(), draft));
    }
  }, [open, mode, existing, draft, accountId, operationId, expectedRevision]);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate() {
    const errors: Partial<Record<keyof FormState, string>> = {};
    const parsed = (mode === "create" ? accountCreateSchema : accountPatchSchema).safeParse(form);
    if (!parsed.success) for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof FormState;
      if (key in form && !errors[key]) errors[key] = issue.message;
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleClose() {
    if (saving) return;
    setFieldErrors({});
    onClose();
  }

  async function submit() {
    if (saving) return;
    if (mode === "edit" && accountId && !existing) {
      toast.error("账号不存在或已删除");
      return;
    }
    if (!validate()) return;
    setSaving(true);
    setFieldErrors({});
    const payload = {
      name: form.name,
      username: mode === "edit" && existing ? existing.username : form.username,
      email: form.email,
      phone: form.phone,
      role: form.role as AccountRole,
      department: form.department,
      status: form.status,
      notes: form.notes,
    };

    try {
      if (mode === "edit" && existing) {
        const saved = await updateAccount(existing.id, payload, { operationId, key: saveKey.current, revision: revision.current });
        setSaving(false);
        setFieldErrors({});
        toast.success("账号已保存");
        onSaved?.(saved.receipt);
        onClose();
        return;
      }
      const created = await createAccount(payload, { operationId, key: saveKey.current });
      setSaving(false);
      setFieldErrors({});
      toast.success("账号已创建");
      onSaved?.(created.receipt);
      onClose();
      if (goToDetailOnCreate) {
        router.push(`/accounts/${created.id}/`);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "保存失败");
      setSaving(false);
    }
  }

  if (open && mode === "edit" && accountId && !existing) {
    return (
      <Modal open onClose={handleClose} title="编辑账号" width="w-[560px]">
        <div className="px-6 py-8 text-center">
          <p className="text-sm text-fg-grey-700">账号不存在或已删除</p>
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
      title={mode === "edit" ? "编辑账号" : "新建账号"}
      width="w-[560px]"
    >
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
        <div className="flex flex-col gap-4">
          <TextField
            color={siteConfig.accent}
            label="姓名"
            state={fieldErrors.name ? "error" : undefined}
            errorMessage={fieldErrors.name}
            value={form.name}
            onChange={(v) => setField("name", v)}
            placeholder="真实姓名"
          />
          <TextField
            color={siteConfig.accent}
            label="用户名"
            state={fieldErrors.username ? "error" : undefined}
            errorMessage={fieldErrors.username}
            value={form.username}
            onChange={(v) => setField("username", v)}
            placeholder="登录名"
            disabled={mode === "edit"}
          />
          <TextField
            color={siteConfig.accent}
            label="邮箱"
            type="email"
            state={fieldErrors.email ? "error" : undefined}
            errorMessage={fieldErrors.email}
            value={form.email}
            onChange={(v) => setField("email", v)}
            placeholder="name@example.com"
          />
          <TextField
            color={siteConfig.accent}
            label="手机"
            state={fieldErrors.phone ? "error" : undefined}
            errorMessage={fieldErrors.phone}
            value={form.phone}
            onChange={(v) => setField("phone", v)}
            placeholder="联系手机号"
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SelectOption
              color={siteConfig.accent}
              label="角色"
              state={fieldErrors.role ? "error" : undefined}
              errorMessage={fieldErrors.role}
              width="100%"
              options={roleOptions}
              value={form.role}
              onChange={(v) => setField("role", v)}
            />
            <SelectOption
              color={siteConfig.accent}
              label="部门"
              state={fieldErrors.department ? "error" : undefined}
              errorMessage={fieldErrors.department}
              width="100%"
              options={deptOptions}
              value={form.department}
              onChange={(v) => setField("department", v)}
            />
          </div>
          <SelectOption
            color={siteConfig.accent}
            label="状态"
              state={fieldErrors.status ? "error" : undefined}
              errorMessage={fieldErrors.status}
            width="100%"
            options={statusOptions}
            value={form.status}
            onChange={(v) => setField("status", v as AccountStatus)}
          />
          <TextArea
            color={siteConfig.accent}
            label="备注"
            rows={3}
            value={form.notes}
            onChange={(v) => setField("notes", v)}
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
