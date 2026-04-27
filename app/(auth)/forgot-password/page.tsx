"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, TextField } from "@forge-ui/react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // TODO: 调用你的 auth 后端发送重置邮件
    // demo 直接跳到重置密码页
    console.log("forgot-password", { email });
    router.push("/reset-password");
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-[400px] flex-col gap-8">
      <header className="flex flex-col gap-3 text-center">
        <h1 className="font-display text-2xl font-semibold tracking-fg text-fg-black">
          忘记密码
        </h1>
        <p className="text-base text-fg-grey-700">
          输入注册时用的邮箱，我们会把重置链接发到你的邮箱。
        </p>
      </header>

      <div className="flex flex-col gap-4">
        <TextField
          label="邮箱"
          placeholder="你的邮箱..."
          value={email}
          onChange={setEmail}
        />

        <Button type="submit" color="purple" variant="primary" size="lg" className="w-full">
          发送重置邮件
        </Button>
      </div>

      <p className="text-center text-sm text-fg-grey-700">
        想起来了？{" "}
        <Link href="/login" className="font-bold text-fg-violet hover:underline">
          返回登录
        </Link>
      </p>
    </form>
  );
}
