"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, SelectOption, TextArea, TextField } from "@forge-ui-official/core";
import { Modal } from "@/components/ui/modal";
import { siteConfig } from "@/config/site";
import { useDemoStore } from "@/components/demo-store";
import {
  ACCOUNT_DEPARTMENTS,
  ACCOUNT_ROLES,
  ACCOUNT_STATUS_META,
  type AccountRole,
  type AccountStatus,
} from "@/lib/demo/accounts";

const roleOptions = ACCOUNT_ROLES.map((value) => ({ value, label: value }));
const deptOptions = ACCOUNT_DEPARTMENTS.map((value) => ({ value, label: value }));
const statusOptions = (Object.keys(ACCOUNT_STATUS_META) as AccountStatus[]).map((value) => ({
  value,
  label: ACCOUNT_STATUS_META[value].label,
}));

type Props = {
  open: boolean;
  onClose: () => void;
  /** Navigate to detail after create (default true) */
  goToDetail?: boolean;
};

const empty = {
  name: "",
  username: "",
  email: "",
  phone: "",
  role: ACCOUNT_ROLES[1] as string,
  department: ACCOUNT_DEPARTMENTS[0] as string,
  status: "pending" as AccountStatus,
  notes: "",
};

export function AccountCreateDialog({ open, onClose, goToDetail = true }: Props) {
  const router = useRouter();
  const { createAccount } = useDemoStore();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setForm(empty);
    setError(null);
  }

  function handleClose() {
    reset();
    onClose();
  }

  function setField<K extends keyof typeof empty>(key: K, value: (typeof empty)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate() {
    if (!form.name.trim()) return "请填写姓名";
    if (!/^[a-z0-9_]{3,32}$/.test(form.username.trim().toLowerCase())) {
      return "用户名需 3–32 位小写字母、数字或下划线";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return "邮箱格式不正确";
    if (!form.phone.trim()) return "请填写手机号";
    return null;
  }

  function submit() {
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }
    const created = createAccount({
      name: form.name,
      username: form.username,
      email: form.email,
      phone: form.phone,
      role: form.role as AccountRole,
      department: form.department,
      status: form.status,
      notes: form.notes,
    });
    handleClose();
    if (goToDetail) {
      router.push(`/accounts/${created.id}/`);
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title="新建账号" width="w-[560px]">
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
        <div className="flex flex-col gap-4">
          <TextField
            color={siteConfig.accent}
            label="姓名"
            value={form.name}
            onChange={(v) => setField("name", v)}
            placeholder="真实姓名"
          />
          <TextField
            color={siteConfig.accent}
            label="用户名"
            value={form.username}
            onChange={(v) => setField("username", v)}
            placeholder="登录名"
          />
          <TextField
            color={siteConfig.accent}
            label="邮箱"
            type="email"
            value={form.email}
            onChange={(v) => setField("email", v)}
            placeholder="name@example.com"
          />
          <TextField
            color={siteConfig.accent}
            label="手机"
            value={form.phone}
            onChange={(v) => setField("phone", v)}
            placeholder="联系手机号"
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SelectOption
              color={siteConfig.accent}
              label="角色"
              width="100%"
              options={roleOptions}
              value={form.role}
              onChange={(v) => setField("role", v)}
            />
            <SelectOption
              color={siteConfig.accent}
              label="部门"
              width="100%"
              options={deptOptions}
              value={form.department}
              onChange={(v) => setField("department", v)}
            />
          </div>
          <SelectOption
            color={siteConfig.accent}
            label="状态"
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
          {error ? <p className="text-sm text-fg-red">{error}</p> : null}
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-fg-grey-100 px-6 py-4">
        <Button color={siteConfig.accent} variant="tertiary" onClick={handleClose}>
          取消
        </Button>
        <Button color={siteConfig.accent} onClick={submit}>
          创建
        </Button>
      </div>
    </Modal>
  );
}
