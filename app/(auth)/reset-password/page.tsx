"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, TextField } from "@forge-ui/react";
import { EyeLinear, EyeClosedLinear } from "solar-icon-set";

function PasswordToggle({
  shown,
  onToggle,
}: {
  shown: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={shown ? "隐藏密码" : "显示密码"}
      className="flex items-center justify-center text-fg-grey-700 hover:text-fg-black"
    >
      {shown ? <EyeLinear size={20} /> : <EyeClosedLinear size={20} />}
    </button>
  );
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirm) {
      // TODO: 做你自己的错误展示（TextField 支持 state="error" + errorMessage）
      console.warn("passwords do not match");
      return;
    }
    // TODO: 调用你的 auth 后端重置密码
    // demo 重置完跳回登录页
    console.log("reset-password", { password });
    router.push("/login");
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-[400px] flex-col gap-8">
      <header className="flex flex-col gap-2 text-center">
        <h1 className="font-display text-2xl font-semibold tracking-fg text-fg-black">
          重置密码
        </h1>
      </header>

      <div className="flex flex-col gap-4">
        <TextField
          label="新密码"
          placeholder="输入新密码..."
          value={password}
          onChange={setPassword}
          iconRight={
            <PasswordToggle
              shown={showPassword}
              onToggle={() => setShowPassword((v) => !v)}
            />
          }
        />

        <TextField
          label="确认密码"
          placeholder="再次输入新密码..."
          value={confirm}
          onChange={setConfirm}
          iconRight={
            <PasswordToggle
              shown={showConfirm}
              onToggle={() => setShowConfirm((v) => !v)}
            />
          }
        />

        <Button type="submit" color="purple" variant="primary" size="lg" className="w-full">
          重置密码
        </Button>
      </div>

      <p className="text-center text-sm text-fg-grey-700">
        还没账号？{" "}
        <Link href="/register" className="font-bold text-fg-violet hover:underline">
          立即注册
        </Link>
      </p>
    </form>
  );
}
