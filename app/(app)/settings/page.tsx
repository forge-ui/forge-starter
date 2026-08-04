"use client";

import { useEffect, useState } from "react";
import {
  Button,
  StatusBadge,
  SurfaceCard,
  TextField,
} from "@forge-ui-official/core";
import { siteConfig } from "@/config/site";

type MeResponse = {
  ok: boolean;
  mode: string;
  user: null | {
    username: string;
    email: string;
    displayName: string;
  };
};

type TabId = "profile" | "security" | "notifications";

const tabs: { id: TabId; label: string }[] = [
  { id: "profile", label: "个人资料" },
  { id: "security", label: "安全" },
  { id: "notifications", label: "通知" },
];

export default function SettingsPage() {
  const [tab, setTab] = useState<TabId>("profile");
  const [mode, setMode] = useState("demo");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [emailNotify, setEmailNotify] = useState(true);
  const [productNotify, setProductNotify] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me/")
      .then((res) => res.json())
      .then((data: MeResponse) => {
        setMode(data.mode ?? "demo");
        if (data.user) {
          setDisplayName(data.user.displayName);
          setEmail(data.user.email);
          setUsername(data.user.username);
        }
      })
      .catch(() => undefined);
  }, []);

  function saveProfile(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    if (!displayName.trim()) {
      setError("显示名不能为空");
      return;
    }
    setMessage("资料已保存（演示：仅更新本页状态，未写回数据库）");
  }

  function saveSecurity(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    if (password.length < 8) {
      setError("新密码至少 8 位");
      return;
    }
    if (password !== passwordConfirm) {
      setError("两次输入的密码不一致");
      return;
    }
    setPassword("");
    setPasswordConfirm("");
    setMessage("密码修改流程已演示完成（未调用改密 API，local 模式可接 /api）");
  }

  function saveNotifications(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setMessage(
      `通知偏好已保存：邮件 ${emailNotify ? "开" : "关"}，产品动态 ${productNotify ? "开" : "关"}`,
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-display-l font-semibold leading-9 tracking-fg text-fg-black">
            设置
          </h1>
          <p className="mt-1 text-sm text-fg-grey-700">账号、安全与通知偏好</p>
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
            onClick={() => {
              setTab(item.id);
              setMessage(null);
              setError(null);
            }}
          >
            {item.label}
          </Button>
        ))}
      </div>

      {tab === "profile" ? (
        <SurfaceCard className="p-6">
          <h2 className="text-lg font-semibold text-fg-black">个人资料</h2>
          <p className="mt-1 text-sm text-fg-grey-700">展示名用于侧栏与列表中的责任人展示。</p>
          <form onSubmit={saveProfile} className="mt-6 flex max-w-xl flex-col gap-4">
            <TextField color={siteConfig.accent} label="显示名" value={displayName} onChange={setDisplayName} />
            <TextField color={siteConfig.accent} label="用户名" value={username} onChange={setUsername} />
            <TextField color={siteConfig.accent} label="邮箱" value={email} onChange={setEmail} />
            {error ? <p className="text-sm text-fg-red">{error}</p> : null}
            {message ? <p className="text-sm text-fg-green-500">{message}</p> : null}
            <Button type="submit" color={siteConfig.accent}>
              保存资料
            </Button>
          </form>
        </SurfaceCard>
      ) : null}

      {tab === "security" ? (
        <SurfaceCard className="p-6">
          <h2 className="text-lg font-semibold text-fg-black">安全</h2>
          <p className="mt-1 text-sm text-fg-grey-700">
            演示改密表单。`AUTH_MODE=local` 时可接到自建 API + 密码哈希校验。
          </p>
          <form onSubmit={saveSecurity} className="mt-6 flex max-w-xl flex-col gap-4">
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
            <Button type="submit" color={siteConfig.accent}>
              更新密码
            </Button>
          </form>
        </SurfaceCard>
      ) : null}

      {tab === "notifications" ? (
        <SurfaceCard className="p-6">
          <h2 className="text-lg font-semibold text-fg-black">通知</h2>
          <p className="mt-1 text-sm text-fg-grey-700">控制演示环境中的通知偏好。</p>
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
              <span className="text-sm font-medium text-fg-black">产品动态</span>
              <input
                type="checkbox"
                checked={productNotify}
                onChange={(e) => setProductNotify(e.target.checked)}
                className="h-4 w-4"
              />
            </label>
            {message ? <p className="text-sm text-fg-green-500">{message}</p> : null}
            <Button type="submit" color={siteConfig.accent}>
              保存通知设置
            </Button>
          </form>
        </SurfaceCard>
      ) : null}
    </div>
  );
}
