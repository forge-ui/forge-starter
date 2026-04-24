"use client";

import Link from "next/link";
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
      aria-label={shown ? "Hide password" : "Show password"}
      className="flex items-center justify-center text-fg-grey-700 hover:text-fg-black"
    >
      {shown ? <EyeLinear size={20} /> : <EyeClosedLinear size={20} />}
    </button>
  );
}

export default function ResetPasswordPage() {
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
    console.log("reset-password", { password });
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-[400px] flex-col gap-8">
      <header className="flex flex-col gap-2 text-center">
        <h1 className="font-display text-2xl font-semibold tracking-fg text-fg-black">
          Reset Password
        </h1>
      </header>

      <div className="flex flex-col gap-4">
        <TextField
          label="New Password"
          placeholder="Your password..."
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
          label="Confirm Password"
          placeholder="Your password..."
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
          Reset Password
        </Button>
      </div>

      <p className="text-center text-sm text-fg-grey-700">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-bold text-fg-violet hover:underline">
          Register now
        </Link>
      </p>
    </form>
  );
}
