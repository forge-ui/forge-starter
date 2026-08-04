"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Breadcrumbs,
  Button,
  StatusBadge,
  TextField,
} from "@forge-ui-official/core";
import { siteConfig } from "@/config/site";
import { emitProfileUpdated } from "@/lib/auth/profile-events";
import { SettingsAppsPanel } from "@/components/settings-apps-panel";

type MeResponse = {
  ok: boolean;
  mode: string;
  user: null | {
    username: string;
    email: string;
    displayName: string;
  };
};

type TabId = "profile" | "security" | "notifications" | "apps";

const tabs: { id: TabId; label: string }[] = [
  { id: "profile", label: "个人资料" },
  { id: "security", label: "修改密码" },
  { id: "apps", label: "应用管理" },
  { id: "notifications", label: "系统设置" },
];

function parseTab(value: string | null): TabId {
  if (value === "security" || value === "password") return "security";
  if (value === "notifications" || value === "system") return "notifications";
  if (value === "apps" || value === "applications") return "apps";
  return "profile";
}

function SettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = parseTab(searchParams.get("tab"));

  const [mode, setMode] = useState("demo");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [emailNotify, setEmailNotify] = useState(true);
  const [securityNotify, setSecurityNotify] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadMe = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me/");
      const data = (await res.json()) as MeResponse;
      setMode(data.mode ?? "demo");
      if (data.user) {
        setDisplayName(data.user.displayName);
        setEmail(data.user.email);
        setUsername(data.user.username);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    void loadMe();
  }, [loadMe]);

  useEffect(() => {
    setMessage(null);
    setError(null);
  }, [tab]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("forge-starter:notification-prefs");
      if (!raw) return;
      const prefs = JSON.parse(raw) as {
        emailNotify?: boolean;
        securityNotify?: boolean;
      };
      if (typeof prefs.emailNotify === "boolean") setEmailNotify(prefs.emailNotify);
      if (typeof prefs.securityNotify === "boolean") setSecurityNotify(prefs.securityNotify);
    } catch {
      // ignore
    }
  }, []);

  function setTab(next: TabId) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", next);
    router.replace(`/settings/?${params.toString()}`);
  }

  async function saveProfile(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    if (!displayName.trim()) {
      setError("显示名不能为空");
      return;
    }
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
        setError(data.error ?? "保存失败");
        return;
      }
      if (data.user) {
        setDisplayName(data.user.displayName);
        setEmail(data.user.email);
        setUsername(data.user.username);
        emitProfileUpdated({
          displayName: data.user.displayName,
          email: data.user.email,
          username: data.user.username,
        });
      }
      setMessage(data.message ?? "资料已保存");
    } catch {
      setError("网络错误，请稍后重试");
    } finally {
      setSaving(false);
    }
  }

  async function saveSecurity(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    if (!currentPassword) {
      setError("请输入当前密码");
      return;
    }
    if (password.length < 8) {
      setError("新密码至少 8 位");
      return;
    }
    if (password !== passwordConfirm) {
      setError("两次输入的密码不一致");
      return;
    }
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
        setError(data.error ?? "修改密码失败");
        return;
      }
      setCurrentPassword("");
      setPassword("");
      setPasswordConfirm("");
      setMessage(data.message ?? "密码已更新");
    } catch {
      setError("网络错误，请稍后重试");
    } finally {
      setSaving(false);
    }
  }

  function saveNotifications(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      window.localStorage.setItem(
        "forge-starter:notification-prefs",
        JSON.stringify({ emailNotify, securityNotify }),
      );
      setMessage(
        `系统偏好已保存：邮件 ${emailNotify ? "开" : "关"}，安全提醒 ${securityNotify ? "开" : "关"}`,
      );
    } catch {
      setError("无法写入本地偏好");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-display-l font-semibold leading-9 tracking-fg text-fg-black">
            设置
          </h1>
          <Breadcrumbs
            color={siteConfig.accent}
            items={[
              { label: "工作台", href: "/dashboard/" },
              { label: "设置" },
            ]}
          />
        </div>
        <StatusBadge
          label={mode === "local" ? "AUTH local" : "AUTH demo"}
          color={mode === "local" ? "green" : "blue"}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((item) => (
          <Button
            key={item.id}
            color={siteConfig.accent}
            variant={tab === item.id ? "primary" : "tertiary"}
            size="sm"
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </Button>
        ))}
      </div>

      {tab === "profile" ? (
        <div className="rounded-xl bg-white p-6 outline outline-1 outline-offset-[-1px] outline-fg-grey-200">
          <h2 className="text-lg font-semibold text-fg-black">编辑资料</h2>
          <p className="mt-1 text-sm text-fg-grey-700">
            显示名会同步到侧栏头像菜单；用户名用于登录，不可修改。
          </p>
          <form onSubmit={saveProfile} className="mt-6 flex max-w-xl flex-col gap-4">
            <TextField
              color={siteConfig.accent}
              label="显示名"
              value={displayName}
              onChange={setDisplayName}
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
              value={email}
              onChange={setEmail}
              type="email"
            />
            {error ? <p className="text-sm text-fg-red">{error}</p> : null}
            {message ? <p className="text-sm text-fg-green-500">{message}</p> : null}
            <Button type="submit" color={siteConfig.accent} disabled={saving}>
              {saving ? "保存中…" : "保存资料"}
            </Button>
          </form>
        </div>
      ) : null}

      {tab === "security" ? (
        <div className="rounded-xl bg-white p-6 outline outline-1 outline-offset-[-1px] outline-fg-grey-200">
          <h2 className="text-lg font-semibold text-fg-black">修改密码</h2>
          <p className="mt-1 text-sm text-fg-grey-700">
            {mode === "local"
              ? "验证当前密码后写入新密码哈希。"
              : "演示模式会走完整校验流程，但不写入数据库。"}
          </p>
          <form onSubmit={saveSecurity} className="mt-6 flex max-w-xl flex-col gap-4">
            <TextField
              color={siteConfig.accent}
              label="当前密码"
              type="password"
              value={currentPassword}
              onChange={setCurrentPassword}
              placeholder={mode === "demo" ? "演示模式可填任意当前密码" : "当前登录密码"}
            />
            <TextField
              color={siteConfig.accent}
              label="新密码"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="至少 8 位"
            />
            <TextField
              color={siteConfig.accent}
              label="确认新密码"
              type="password"
              value={passwordConfirm}
              onChange={setPasswordConfirm}
            />
            {error ? <p className="text-sm text-fg-red">{error}</p> : null}
            {message ? <p className="text-sm text-fg-green-500">{message}</p> : null}
            <Button type="submit" color={siteConfig.accent} disabled={saving}>
              {saving ? "提交中…" : "更新密码"}
            </Button>
          </form>
        </div>
      ) : null}

      {tab === "apps" ? <SettingsAppsPanel /> : null}

      {tab === "notifications" ? (
        <div className="rounded-xl bg-white p-6 outline outline-1 outline-offset-[-1px] outline-fg-grey-200">
          <h2 className="text-lg font-semibold text-fg-black">系统设置</h2>
          <p className="mt-1 text-sm text-fg-grey-700">
            通知与安全提醒偏好保存在本机浏览器（localStorage）。
          </p>
          <form onSubmit={saveNotifications} className="mt-6 flex max-w-xl flex-col gap-4">
            <label className="flex items-center justify-between gap-4 rounded-2xl border border-fg-grey-200 px-4 py-3">
              <span className="text-sm font-medium text-fg-black">邮件通知</span>
              <input
                type="checkbox"
                checked={emailNotify}
                onChange={(e) => setEmailNotify(e.target.checked)}
                className="h-4 w-4"
              />
            </label>
            <label className="flex items-center justify-between gap-4 rounded-2xl border border-fg-grey-200 px-4 py-3">
              <span className="text-sm font-medium text-fg-black">账号安全提醒</span>
              <input
                type="checkbox"
                checked={securityNotify}
                onChange={(e) => setSecurityNotify(e.target.checked)}
                className="h-4 w-4"
              />
            </label>
            {error ? <p className="text-sm text-fg-red">{error}</p> : null}
            {message ? <p className="text-sm text-fg-green-500">{message}</p> : null}
            <Button type="submit" color={siteConfig.accent}>
              保存系统设置
            </Button>
          </form>
        </div>
      ) : null}
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-10 text-sm text-fg-grey-500">加载设置…</div>
      }
    >
      <SettingsContent />
    </Suspense>
  );
}
