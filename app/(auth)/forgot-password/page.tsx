"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, TextField } from "@forge-ui/react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // TODO: 调用你的 auth 后端发送重置邮件
    console.log("forgot-password", { email });
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-[400px] flex-col gap-8">
      <header className="flex flex-col gap-3 text-center">
        <h1 className="font-display text-2xl font-semibold tracking-fg text-fg-black">
          Forgot Password
        </h1>
        <p className="text-base text-fg-grey-700">
          Enter the email address you used when you joined and we&apos;ll send reset instructions.
        </p>
      </header>

      <div className="flex flex-col gap-4">
        <TextField
          label="Email"
          placeholder="Your email..."
          value={email}
          onChange={setEmail}
        />

        <Button type="submit" color="purple" variant="primary" size="lg" className="w-full">
          Send Reset Instructions
        </Button>
      </div>

      <p className="text-center text-sm text-fg-grey-700">
        Back to log in page?{" "}
        <Link href="/login" className="font-bold text-fg-violet hover:underline">
          Back now
        </Link>
      </p>
    </form>
  );
}
