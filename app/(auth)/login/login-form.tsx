"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, IconButton, StyledLink, TextField } from "@forge-ui-official/core";
import { EyeLinear, EyeClosedLinear } from "solar-icon-set";
import { apiFetch, parseApiJson } from "@/lib/api/browser";
import type { AuthMode } from "@/lib/auth/config";
import { loginAction } from "./actions";

export function LoginForm({
  mode,
  initialError = null,
}: {
  mode: AuthMode;
  initialError?: string | null;
}) {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);
    const nextLogin = String(fd.get("login") ?? login).trim();
    const nextPassword = String(fd.get("password") ?? password);
    if (!nextLogin || !nextPassword) {
      setError("请输入用户名或邮箱和密码");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch("/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: nextLogin, password: nextPassword }),
      });
      const data = await parseApiJson<{ ok?: boolean; error?: string; redirectTo?: string }>(res);
      if (!res.ok || !data.ok) {
        setError(data.error ?? "登录失败");
        return;
      }
      router.replace(data.redirectTo ?? "/dashboard/");
      router.refresh();
    } catch (err) {
      const aborted = err instanceof DOMException && err.name === "AbortError";
      setError(aborted ? "登录超时，请重试" : "网络错误，请重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      action={loginAction}
      onSubmit={handleSubmit}
      className="flex w-full max-w-[400px] flex-col gap-8"
    >
      <header className="flex flex-col gap-3 text-center">
        <h1 className="font-display text-2xl font-semibold tracking-fg text-fg-black">
          欢迎回来
        </h1>
        <p className="text-base text-fg-grey-700">
          {mode === "demo"
            ? "演示模式任意账号可进入。用户名 operator / auditor / readonly 会按角色藏菜单，其余账号为超级管理员。"
            : "使用用户名或邮箱登录。"}
        </p>
      </header>

      <div className="flex flex-col gap-4">
        <TextField
          name="login"
          label="用户名或邮箱"
          placeholder="输入用户名或邮箱..."
          value={login}
          onChange={setLogin}
          autoComplete="username"
        />

        <TextField
          name="password"
          label="密码"
          type={showPassword ? "text" : "password"}
          placeholder="输入密码..."
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          headerAction={
            mode === "local" ? (
              <StyledLink href="/forgot-password/">忘记密码</StyledLink>
            ) : undefined
          }
          iconRight={
            <IconButton
              type="button"
              color="grey"
              variant="ghost"
              size="sm"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "隐藏密码" : "显示密码"}
            >
              {showPassword ? (
                <EyeLinear size={20} color="var(--fg-grey-700)" />
              ) : (
                <EyeClosedLinear size={20} color="var(--fg-grey-700)" />
              )}
            </IconButton>
          }
        />

        {error ? <p className="text-sm text-fg-red">{error}</p> : null}

        <Button type="submit" color="blue" variant="primary" size="lg" className="w-full" disabled={loading}>
          {loading ? "登录中…" : "登录"}
        </Button>
      </div>

      {mode === "local" ? (
        <p className="text-center text-sm text-fg-grey-700">
          还没账号？{" "}
          <StyledLink href="/register/">立即注册</StyledLink>
        </p>
      ) : null}
    </form>
  );
}
