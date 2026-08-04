"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, IconButton, StyledLink, TextField } from "@forge-ui-official/core";
import { EyeLinear, EyeClosedLinear } from "solar-icon-set";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get("token") ?? "", [searchParams]);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/reset-password/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "重置失败");
        return;
      }
      router.replace(data.redirectTo ?? "/login/");
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
          设置新密码
        </h1>
        <p className="text-base text-fg-grey-700">
          {token ? "请输入新密码（至少 8 位）。" : "缺少重置令牌，请从邮件或开发链接重新进入。"}
        </p>
      </header>

      <div className="flex flex-col gap-4">
        <TextField
          label="新密码"
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
        <Button type="submit" color="purple" variant="primary" size="lg" className="w-full" disabled={loading || !token}>
          {loading ? "保存中…" : "更新密码"}
        </Button>
      </div>

      <p className="text-center text-sm text-fg-grey-700">
        <StyledLink href="/login/">返回登录</StyledLink>
      </p>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<p className="text-sm text-fg-grey-700">加载中…</p>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
