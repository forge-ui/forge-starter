"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, IconButton, StyledLink, TextField } from "@forge-ui-official/core";
import { EyeLinear, EyeClosedLinear } from "solar-icon-set";
import { SocialButton, OrDivider } from "../_social-button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // TODO: 接入你自己的 auth 逻辑（NextAuth / Clerk / Supabase / 自建 API）
    // demo 直接跳后台首页
    router.push("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-[400px] flex-col gap-8">
      <header className="flex flex-col gap-3 text-center">
        <h1 className="font-display text-2xl font-semibold tracking-fg text-fg-black">
          欢迎回来
        </h1>
        <p className="text-base text-fg-grey-700">
          请输入账号信息登录。
        </p>
      </header>

      <div className="flex flex-col gap-4">
        <SocialButton provider="google" action="登录" />
        <SocialButton provider="facebook" action="登录" />
      </div>

      <OrDivider />

      <div className="flex flex-col gap-4">
        <TextField
          label="用户名 / 邮箱"
          placeholder="输入用户名或邮箱..."
          value={email}
          onChange={setEmail}
        />

        <TextField
          label="密码"
          placeholder="输入密码..."
          value={password}
          onChange={setPassword}
          className={showPassword ? "" : "forge-password-field"}
          headerAction={
            <StyledLink href="/forgot-password">
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

        <Button type="submit" color="purple" variant="primary" size="lg" className="w-full">
          登录
        </Button>
      </div>

      <p className="text-center text-sm text-fg-grey-700">
        还没账号？{" "}
        <StyledLink href="/register">立即注册</StyledLink>
      </p>
    </form>
  );
}
