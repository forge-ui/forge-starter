"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, IconButton, StyledLink, TextField } from "@forge-ui-official/core";
import { EyeLinear, EyeClosedLinear } from "solar-icon-set";
import { SocialButton, OrDivider } from "../_social-button";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, displayName }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "注册失败");
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
          注册账号
        </h1>
        <p className="text-base text-fg-grey-700">
          本地账号写入 PostgreSQL。演示模式下请直接登录。
        </p>
      </header>

      <div className="flex flex-col gap-4">
        <SocialButton provider="google" action="注册" />
        <SocialButton provider="facebook" action="注册" />
      </div>

      <OrDivider />

      <div className="flex flex-col gap-4">
        <TextField label="用户名" placeholder="小写字母、数字、下划线" value={username} onChange={setUsername} autoComplete="username" />
        <TextField label="显示名" placeholder="可选" value={displayName} onChange={setDisplayName} />
        <TextField label="邮箱" placeholder="you@example.com" value={email} onChange={setEmail} autoComplete="email" />
        <TextField
          label="密码"
          type={showPassword ? "text" : "password"}
          placeholder="至少 8 位"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
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
          {loading ? "提交中…" : "注册"}
        </Button>
      </div>

      <p className="text-center text-sm text-fg-grey-700">
        已有账号？{" "}
        <StyledLink href="/login/">去登录</StyledLink>
      </p>
    </form>
  );
}
