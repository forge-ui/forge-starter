"use client";

import { useCallback, useEffect, useState } from "react";
import { Button, TextField } from "@forge-ui-official/core";
import { siteConfig } from "@/config/site";

type MeResponse = {
  ok: boolean;
  mode: string;
};

export function SettingsSecurityPanel() {
  const [mode, setMode] = useState("demo");
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void fetch("/api/auth/me/")
      .then((res) => res.json())
      .then((data: MeResponse) => setMode(data.mode ?? "demo"))
      .catch(() => undefined);
  }, []);

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

  return (
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
  );
}
