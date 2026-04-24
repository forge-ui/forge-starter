"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, TextField } from "@forge-ui/react";
import { EyeLinear, EyeClosedLinear } from "solar-icon-set";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // TODO: 接入你自己的 auth 逻辑
    console.log("register", { name, email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-[400px] flex-col gap-8">
      <header className="flex flex-col gap-3 text-center">
        <h1 className="font-display text-2xl font-semibold tracking-fg text-fg-black">
          Create an Account
        </h1>
        <p className="text-base text-fg-grey-700">
          Fill in your details to get started.
        </p>
      </header>

      <div className="flex flex-col gap-4">
        <TextField
          label="Full Name"
          placeholder="Your name..."
          value={name}
          onChange={setName}
        />

        <TextField
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChange={setEmail}
        />

        <TextField
          label="Password"
          placeholder="Choose a strong password..."
          value={password}
          onChange={setPassword}
          iconRight={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="flex items-center justify-center text-fg-grey-700 hover:text-fg-black"
            >
              {showPassword ? <EyeLinear size={20} /> : <EyeClosedLinear size={20} />}
            </button>
          }
        />

        <Button type="submit" color="purple" variant="primary" size="lg" className="w-full">
          Create account
        </Button>
      </div>

      <p className="text-center text-sm text-fg-grey-700">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-fg-violet hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
