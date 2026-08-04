"use client";

import { useCallback, useEffect, useState } from "react";
import { Button, TextField } from "@forge-ui-official/core";
import { siteConfig } from "@/config/site";
import { emitProfileUpdated } from "@/lib/auth/profile-events";

type MeResponse = {
  ok: boolean;
  mode: string;
  user: null | {
    username: string;
    email: string;
    displayName: string;
  };
};

export function SettingsProfilePanel() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadMe = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me/");
      const data = (await res.json()) as MeResponse;
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

  return (
    <div className="rounded-xl bg-white p-6 outline outline-1 outline-offset-[-1px] outline-fg-grey-200">
      <h2 className="text-lg font-semibold text-fg-black">个人资料</h2>
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
  );
}
