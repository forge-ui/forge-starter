"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, TextField } from "@forge-ui/react";
import { EyeLinear, EyeClosedLinear } from "solar-icon-set";
import { SocialButton, OrDivider } from "../_social-button";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // TODO: 接入你自己的 auth 逻辑
    // demo 直接跳后台首页
    console.log("register", { name, username, email, password });
    router.push("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-[400px] flex-col gap-8">
      <header className="flex flex-col gap-3 text-center">
        <h1 className="font-display text-2xl font-semibold tracking-fg text-fg-black">
          注册账号
        </h1>
        <p className="text-base text-fg-grey-700">
          填写信息开始使用。
        </p>
      </header>

      <div className="flex flex-col gap-4">
        <SocialButton provider="google" action="注册" />
        <SocialButton provider="facebook" action="注册" />
      </div>

      <OrDivider />

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <TextField label="姓名" placeholder="你的姓名..." value={name} onChange={setName} />
          <TextField
            label="用户名"
            placeholder="选一个用户名..."
            value={username}
            onChange={setUsername}
          />
        </div>

        <TextField
          label="邮箱"
          placeholder="you@example.com"
          value={email}
          onChange={setEmail}
        />

        <TextField
          label="密码"
          placeholder="设置一个强密码..."
          value={password}
          onChange={setPassword}
          iconRight={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "隐藏密码" : "显示密码"}
              className="flex items-center justify-center text-fg-grey-700 hover:text-fg-black"
            >
              {showPassword ? <EyeLinear size={20} /> : <EyeClosedLinear size={20} />}
            </button>
          }
        />

        <Button type="submit" color="purple" variant="primary" size="lg" className="w-full">
          创建账号
        </Button>
      </div>

      <p className="text-center text-sm text-fg-grey-700">
        已有账号？{" "}
        <Link href="/login" className="font-bold text-fg-violet hover:underline">
          去登录
        </Link>
      </p>
    </form>
  );
}
