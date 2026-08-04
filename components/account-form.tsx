"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftLinear } from "solar-icon-set";
import {
  Breadcrumbs,
  Button,
  CheckIcon,
  CloseIcon,
  ConfirmationDialog,
  IconButton,
  SelectOption,
  TextArea,
  TextField,
} from "@forge-ui-official/core";
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
  mode: "create" | "edit";
  accountId?: string;
};

export function AccountForm({ mode, accountId }: Props) {
  const router = useRouter();
  const { getById, createAccount, updateAccount } = useDemoStore();
  const existing = mode === "edit" && accountId ? getById(accountId) : undefined;

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<string>(ACCOUNT_ROLES[1]);
  const [department, setDepartment] = useState<string>(ACCOUNT_DEPARTMENTS[0]);
  const [status, setStatus] = useState<AccountStatus>("pending");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [confirmSave, setConfirmSave] = useState(false);

  useEffect(() => {
    if (!existing) return;
    setName(existing.name);
    setUsername(existing.username);
    setEmail(existing.email);
    setPhone(existing.phone);
    setRole(existing.role);
    setDepartment(existing.department);
    setStatus(existing.status);
    setNotes(existing.notes);
  }, [existing]);

  if (mode === "edit" && accountId && !existing) {
    return (
      <div className="flex flex-col items-center gap-4 py-20">
        <p className="text-lg font-semibold text-fg-black">账号不存在</p>
        <Button color={siteConfig.accent} onClick={() => router.push("/accounts/")}>
          返回列表
        </Button>
      </div>
    );
  }

  function validate() {
    if (!name.trim()) return "请填写姓名";
    if (!/^[a-z0-9_]{3,32}$/.test(username.trim().toLowerCase())) {
      return "用户名需 3–32 位小写字母、数字或下划线";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "邮箱格式不正确";
    if (!phone.trim()) return "请填写手机号";
    return null;
  }

  function submit() {
    const msg = validate();
    if (msg) {
      setError(msg);
      setConfirmSave(false);
      return;
    }
    setError(null);
    const payload = {
      name,
      username,
      email,
      phone,
      role: role as AccountRole,
      department,
      status,
      notes,
    };
    if (mode === "edit" && existing) {
      const updated = updateAccount(existing.id, payload);
      if (updated) router.push(`/accounts/${updated.id}/`);
    } else {
      const created = createAccount(payload);
      router.push(`/accounts/${created.id}/`);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {confirmSave ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <ConfirmationDialog
            title="保存更改？"
            description="确认将账号信息写入演示数据。"
            confirmLabel="保存"
            cancelLabel="取消"
            color="green"
            onConfirm={submit}
            onCancel={() => setConfirmSave(false)}
          />
        </div>
      ) : null}

      {/* products/new header pattern */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <IconButton
              variant="tertiary"
              color={siteConfig.accent}
              shape="circle"
              onClick={() => router.push("/accounts/")}
            >
              <ArrowLeftLinear size={16} />
            </IconButton>
            <h1 className="text-display-l font-semibold leading-9 tracking-fg text-fg-black">
              {mode === "edit" ? "编辑账号" : "新建账号"}
            </h1>
          </div>
          <Breadcrumbs
            color={siteConfig.accent}
            items={[
              { label: "工作台", href: "/dashboard/" },
              { label: "账号管理", href: "/accounts/" },
              { label: mode === "edit" ? "编辑" : "新建" },
            ]}
          />
        </div>
        <div className="flex items-center gap-3">
          <Button
            color={siteConfig.accent}
            variant="tertiary"
            iconLeft={<CloseIcon size={16} />}
            onClick={() => router.push("/accounts/")}
          >
            取消
          </Button>
          <Button
            color={siteConfig.accent}
            iconLeft={<CheckIcon size={16} />}
            onClick={() => setConfirmSave(true)}
          >
            保存
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="rounded-xl bg-white p-6 outline outline-1 outline-offset-[-1px] outline-fg-grey-200">
            <h3 className="mb-4 text-lg font-semibold text-fg-black">基本信息</h3>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <TextField color={siteConfig.accent} label="姓名" value={name} onChange={setName} placeholder="真实姓名" />
              <TextField color={siteConfig.accent} label="用户名" value={username} onChange={setUsername} placeholder="登录名" />
              <TextField color={siteConfig.accent} label="邮箱" value={email} onChange={setEmail} type="email" />
              <TextField color={siteConfig.accent} label="手机" value={phone} onChange={setPhone} />
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 outline outline-1 outline-offset-[-1px] outline-fg-grey-200">
            <h3 className="mb-4 text-lg font-semibold text-fg-black">权限与组织</h3>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <SelectOption
                color={siteConfig.accent}
                label="角色"
                width="100%"
                options={roleOptions}
                value={role}
                onChange={setRole}
              />
              <SelectOption
                color={siteConfig.accent}
                label="部门"
                width="100%"
                options={deptOptions}
                value={department}
                onChange={setDepartment}
              />
              <SelectOption
                color={siteConfig.accent}
                label="状态"
                width="100%"
                options={statusOptions}
                value={status}
                onChange={(v) => setStatus(v as AccountStatus)}
              />
            </div>
            <div className="mt-4">
              <TextArea
                color={siteConfig.accent}
                label="备注"
                rows={4}
                value={notes}
                onChange={setNotes}
                placeholder="账号用途、审批备注…"
              />
            </div>
          </div>
          {error ? <p className="text-sm text-fg-red">{error}</p> : null}
        </div>

        {/* Right rail — products/new category/status pattern */}
        <div className="flex w-full flex-col gap-3 lg:w-[280px] lg:shrink-0">
          <div className="rounded-xl bg-white p-6 outline outline-1 outline-offset-[-1px] outline-fg-grey-200">
            <h3 className="mb-4 text-lg font-semibold text-fg-black">预览</h3>
            <div className="flex flex-col items-center text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(username || name || "account")}`}
                alt=""
                className="size-20 rounded-full bg-fg-grey-100"
              />
              <p className="mt-3 text-base font-semibold text-fg-black">{name || "未命名账号"}</p>
              <p className="mt-1 text-sm text-fg-grey-500">
                {username ? `@${username}` : "填写用户名"}
              </p>
              <p className="mt-1 text-xs text-fg-grey-500">{email || "—"}</p>
            </div>
          </div>
          <div className="rounded-xl bg-white p-6 outline outline-1 outline-offset-[-1px] outline-fg-grey-200">
            <h3 className="mb-3 text-lg font-semibold text-fg-black">摘要</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-fg-grey-500">角色</span>
                <span className="font-medium text-fg-black">{role}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-fg-grey-500">部门</span>
                <span className="font-medium text-fg-black">{department}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-fg-grey-500">状态</span>
                <span className="font-medium text-fg-black">
                  {ACCOUNT_STATUS_META[status].label}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
