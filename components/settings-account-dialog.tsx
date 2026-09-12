"use client";

import { useEffect, useState } from "react";
import { Button, TextField, Toggle } from "@forge-ui-official/core";
import { Modal } from "@/components/ui/modal";
import { siteConfig } from "@/config/site";
import { emitProfileUpdated } from "@/lib/auth/profile-events";
import { toast } from "@/lib/toast";

export type SettingsAccountDialogKind = "profile" | "security" | "notifications";

type Props = {
  kind: SettingsAccountDialogKind | null;
  onClose: () => void;
};

export function SettingsAccountDialog({ kind, onClose }: Props) {
  if (kind === "profile") return <ProfileDialog open onClose={onClose} />;
  if (kind === "security") return <SecurityDialog open onClose={onClose} />;
  if (kind === "notifications") return <NotificationsDialog open onClose={onClose} />;
  return null;
}

function ProfileDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState<{ displayName?: string; email?: string }>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setSaving(false);
    void fetch("/api/auth/me/")
      .then((res) => res.json())
      .then((data: {
        user?: { displayName: string; email: string; username: string } | null;
      }) => {
        if (!data.user) return;
        setDisplayName(data.user.displayName);
        setEmail(data.user.email);
        setUsername(data.user.username);
      })
      .catch(() => toast.error("无法加载资料"));
  }, [open]);

  function handleClose() {
    if (saving) return;
    onClose();
  }

  async function submit() {
    const next: { displayName?: string; email?: string } = {};
    if (!displayName.trim()) next.displayName = "显示名不能为空";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = "邮箱格式不正确";
    setErrors(next);
    if (Object.keys(next).length) return;

    setSaving(true);
    try {
      const res = await fetch("/api/auth/profile/", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: displayName.trim(),
          email: email.trim(),
        }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        error?: string;
        message?: string;
        user?: { displayName: string; email: string; username: string };
      };
      if (!res.ok || !data.ok) {
        const message = data.error ?? "保存失败";
        if (message.includes("邮箱")) setErrors({ email: message });
        else toast.error(message);
        return;
      }
      if (data.user) {
        emitProfileUpdated({
          displayName: data.user.displayName,
          email: data.user.email,
          username: data.user.username,
        });
      }
      toast.success(data.message ?? "资料已保存");
      onClose();
    } catch {
      toast.error("网络错误，请稍后重试");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title="编辑资料" width="w-[480px]">
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-fg-grey-700">
            显示名会同步到侧栏头像菜单；用户名用于登录，不可修改。
          </p>
          <TextField
            color={siteConfig.accent}
            label="显示名"
            value={displayName}
            onChange={(value) => {
              setDisplayName(value);
              setErrors((prev) => ({ ...prev, displayName: undefined }));
            }}
            state={errors.displayName ? "error" : undefined}
            errorMessage={errors.displayName}
          />
          <TextField
            color={siteConfig.accent}
            label="用户名"
            value={username}
            onChange={() => undefined}
            disabled
          />
          <TextField
            color={siteConfig.accent}
            label="邮箱"
            type="email"
            value={email}
            onChange={(value) => {
              setEmail(value);
              setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            state={errors.email ? "error" : undefined}
            errorMessage={errors.email}
          />
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-fg-grey-100 px-6 py-4">
        <Button color={siteConfig.accent} variant="tertiary" onClick={handleClose} disabled={saving}>
          取消
        </Button>
        <Button color={siteConfig.accent} onClick={() => void submit()} disabled={saving}>
          {saving ? "保存中…" : "保存"}
        </Button>
      </div>
    </Modal>
  );
}

function SecurityDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [mode, setMode] = useState("demo");
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errors, setErrors] = useState<{
    currentPassword?: string;
    password?: string;
    passwordConfirm?: string;
  }>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setCurrentPassword("");
    setPassword("");
    setPasswordConfirm("");
    setErrors({});
    setSaving(false);
    void fetch("/api/auth/me/")
      .then((res) => res.json())
      .then((data: { mode?: string }) => setMode(data.mode ?? "demo"))
      .catch(() => undefined);
  }, [open]);

  function handleClose() {
    if (saving) return;
    onClose();
  }

  async function submit() {
    const next: typeof errors = {};
    if (!currentPassword) next.currentPassword = "请输入当前密码";
    if (password.length < 8) next.password = "新密码至少 8 位";
    if (password !== passwordConfirm) next.passwordConfirm = "两次输入的密码不一致";
    setErrors(next);
    if (Object.keys(next).length) return;

    setSaving(true);
    try {
      const res = await fetch("/api/auth/change-password/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword: password,
        }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        error?: string;
        message?: string;
      };
      if (!res.ok || !data.ok) {
        const message = data.error ?? "修改密码失败";
        if (message.includes("当前密码")) setErrors({ currentPassword: message });
        else toast.error(message);
        return;
      }
      toast.success(data.message ?? "密码已更新");
      onClose();
    } catch {
      toast.error("网络错误，请稍后重试");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title="修改密码" width="w-[480px]">
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-fg-grey-700">
            {mode === "local"
              ? "验证当前密码后写入新密码哈希。"
              : "演示模式会走完整校验流程，但不写入数据库。"}
          </p>
          <TextField
            color={siteConfig.accent}
            label="当前密码"
            type="password"
            value={currentPassword}
            onChange={(value) => {
              setCurrentPassword(value);
              setErrors((prev) => ({ ...prev, currentPassword: undefined }));
            }}
            placeholder={mode === "demo" ? "演示模式可填任意当前密码" : "当前登录密码"}
            state={errors.currentPassword ? "error" : undefined}
            errorMessage={errors.currentPassword}
          />
          <TextField
            color={siteConfig.accent}
            label="新密码"
            type="password"
            value={password}
            onChange={(value) => {
              setPassword(value);
              setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            placeholder="至少 8 位"
            state={errors.password ? "error" : undefined}
            errorMessage={errors.password}
          />
          <TextField
            color={siteConfig.accent}
            label="确认新密码"
            type="password"
            value={passwordConfirm}
            onChange={(value) => {
              setPasswordConfirm(value);
              setErrors((prev) => ({ ...prev, passwordConfirm: undefined }));
            }}
            state={errors.passwordConfirm ? "error" : undefined}
            errorMessage={errors.passwordConfirm}
          />
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-fg-grey-100 px-6 py-4">
        <Button color={siteConfig.accent} variant="tertiary" onClick={handleClose} disabled={saving}>
          取消
        </Button>
        <Button color={siteConfig.accent} onClick={() => void submit()} disabled={saving}>
          {saving ? "提交中…" : "更新密码"}
        </Button>
      </div>
    </Modal>
  );
}

function NotificationsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [emailNotify, setEmailNotify] = useState(true);
  const [securityNotify, setSecurityNotify] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSaving(false);
    try {
      const raw = window.localStorage.getItem("forge-starter:notification-prefs");
      if (!raw) {
        setEmailNotify(true);
        setSecurityNotify(true);
        return;
      }
      const prefs = JSON.parse(raw) as {
        emailNotify?: boolean;
        securityNotify?: boolean;
      };
      setEmailNotify(typeof prefs.emailNotify === "boolean" ? prefs.emailNotify : true);
      setSecurityNotify(typeof prefs.securityNotify === "boolean" ? prefs.securityNotify : true);
    } catch {
      setEmailNotify(true);
      setSecurityNotify(true);
    }
  }, [open]);

  function handleClose() {
    if (saving) return;
    onClose();
  }

  function submit() {
    setSaving(true);
    try {
      window.localStorage.setItem(
        "forge-starter:notification-prefs",
        JSON.stringify({ emailNotify, securityNotify }),
      );
      toast.success(
        `系统偏好已保存：邮件${emailNotify ? "开" : "关"}，安全提醒${securityNotify ? "开" : "关"}`,
      );
      onClose();
    } catch {
      toast.error("无法写入本地偏好");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title="系统设置" width="w-[480px]">
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-fg-grey-700">
            通知与安全提醒偏好保存在本机浏览器。
          </p>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-fg-black">邮件通知</p>
              <p className="text-xs text-fg-grey-500">账号相关邮件提醒</p>
            </div>
            <Toggle color={siteConfig.accent} checked={emailNotify} onChange={setEmailNotify} />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-fg-black">账号安全提醒</p>
              <p className="text-xs text-fg-grey-500">登录异常与改密通知</p>
            </div>
            <Toggle
              color={siteConfig.accent}
              checked={securityNotify}
              onChange={setSecurityNotify}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-fg-grey-100 px-6 py-4">
        <Button color={siteConfig.accent} variant="tertiary" onClick={handleClose} disabled={saving}>
          取消
        </Button>
        <Button color={siteConfig.accent} onClick={submit} disabled={saving}>
          保存
        </Button>
      </div>
    </Modal>
  );
}
