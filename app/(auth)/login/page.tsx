"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, IconButton, StyledLink, TextField } from "@forge-ui-official/core";
import { EyeLinear, EyeClosedLinear } from "solar-icon-set";
import { SocialButton, OrDivider } from "../_social-button";

export default function LoginPage() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "登录失败");
        return;
      }
      router.replace(data.redirectTo ?? "/dashboard/");
      router.refresh();
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
          欢迎回来
        </h1>
        <p className="text-base text-fg-grey-700">
          使用用户名或邮箱登录。演示模式任意账号可进入。
        </p>
      </header>

      <div className="flex flex-col gap-4">
        <SocialButton provider="google" action="登录" />
        <SocialButton provider="facebook" action="登录" />
      </div>

      <OrDivider />

      <div className="flex flex-col gap-4">
        <TextField
          label="用户名或邮箱"
          placeholder="输入用户名或邮箱..."
          value={login}
          onChange={setLogin}
          autoComplete="username"
        />

        <TextField
          label="密码"
          type={showPassword ? "text" : "password"}
          placeholder="输入密码..."
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          headerAction={
            <StyledLink href="/forgot-password/">
              忘记密码
            </StyledLink>
          }
          iconRight={
            <IconButton
              type="button"
              color="grey"
              variant="ghost"
              size="sm"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "隐藏密码" : "显示密码"}
              className="!h-5 !w-5 !p-0"
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

      <p className="text-center text-sm text-fg-grey-700">
        还没账号？{" "}
        <StyledLink href="/register/">立即注册</StyledLink>
      </p>
    </form>
  );
}
