"use client";

import { useState } from "react";
import { Button, StyledLink, TextField } from "@forge-ui-official/core";

export default function ForgotPasswordPage() {
  const [login, setLogin] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    setDevResetUrl(null);
    try {
      const res = await fetch("/api/auth/forgot-password/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "请求失败");
        return;
      }
      setMessage(data.message ?? "已处理");
      if (data.devResetUrl) setDevResetUrl(data.devResetUrl);
    } catch {
      setError("网络错误，请重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-[400px] flex-col gap-8">
      <header className="flex flex-col gap-3 text-center">
        <h1 className="font-display text-2xl font-semibold tracking-fg text-fg-black">
          找回密码
        </h1>
        <p className="text-base text-fg-grey-700">
          输入用户名或邮箱。配置了 SMTP 会发邮件；否则开发环境会返回重置链接。
        </p>
      </header>

      <div className="flex flex-col gap-4">
        <TextField
          label="用户名或邮箱"
          placeholder="输入用户名或邮箱..."
          value={login}
          onChange={setLogin}
        />
        {error ? <p className="text-sm text-fg-red">{error}</p> : null}
        {message ? <p className="text-sm text-fg-grey-700">{message}</p> : null}
        {devResetUrl ? (
          <p className="break-all text-sm text-fg-blue-500">
            开发重置链接：{" "}
            <a className="underline" href={devResetUrl}>
              {devResetUrl}
            </a>
          </p>
        ) : null}
        <Button type="submit" color="blue" variant="primary" size="lg" className="w-full" disabled={loading}>
          {loading ? "提交中…" : "发送重置说明"}
        </Button>
      </div>

      <p className="text-center text-sm text-fg-grey-700">
        <StyledLink href="/login/">返回登录</StyledLink>
      </p>
    </form>
  );
}
