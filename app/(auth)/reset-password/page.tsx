"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, IconButton, StyledLink, TextField } from "@forge-ui-official/core";
import { EyeLinear, EyeClosedLinear } from "solar-icon-set";

function PasswordToggle({
  shown,
  onToggle,
}: {
  shown: boolean;
  onToggle: () => void;
}) {
  return (
    <IconButton
      type="button"
      color="grey"
      variant="ghost"
      size="sm"
      onClick={onToggle}
      aria-label={shown ? "隐藏密码" : "显示密码"}
      className="!h-5 !w-5 !p-0"
    >
      {shown ? (
        <EyeLinear size={20} color="var(--fg-grey-700)" />
      ) : (
        <EyeClosedLinear size={20} color="var(--fg-grey-700)" />
      )}
    </IconButton>
  );
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmError, setConfirmError] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirm) {
      setConfirmError("两次输入的密码不一致");
      return;
    }
    setConfirmError("");
    // TODO: 调用你的 auth 后端重置密码
    // demo 重置完跳回登录页
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
          onChange={(value) => {
            setPassword(value);
            if (confirmError) setConfirmError("");
          }}
          className={showPassword ? "" : "forge-password-field"}
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
          onChange={(value) => {
            setConfirm(value);
            if (confirmError) setConfirmError("");
          }}
          state={confirmError ? "error" : "idle"}
          errorMessage={confirmError}
          className={showConfirm ? "" : "forge-password-field"}
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
        <StyledLink href="/register">立即注册</StyledLink>
      </p>
    </form>
  );
}
