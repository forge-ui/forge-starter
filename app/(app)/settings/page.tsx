"use client";

import { useEffect, useState } from "react";
import { SurfaceCard, StatusBadge, TextField } from "@forge-ui-official/core";

type MeResponse = {
  ok: boolean;
  mode: string;
  user: null | {
    username: string;
    email: string;
    displayName: string;
  };
};

export default function SettingsPage() {
  const [mode, setMode] = useState("demo");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    fetch("/api/auth/me/")
      .then((res) => res.json())
      .then((data: MeResponse) => {
        setMode(data.mode ?? "demo");
        if (data.user) {
          setDisplayName(data.user.displayName);
          setEmail(data.user.email);
          setUsername(data.user.username);
        }
      })
      .catch(() => undefined);
  }, []);

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <SurfaceCard className="p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-fg-black">账号与模式</h2>
            <p className="mt-1 text-sm text-fg-grey-700">当前会话信息（只读示意）。</p>
          </div>
          <StatusBadge label={mode === "local" ? "local" : "demo"} color={mode === "local" ? "green" : "purple"} />
        </div>
        <div className="flex flex-col gap-4">
          <TextField label="显示名" value={displayName} onChange={setDisplayName} />
          <TextField label="用户名" value={username} onChange={setUsername} />
          <TextField label="邮箱" value={email} onChange={setEmail} />
        </div>
        <p className="mt-4 text-sm text-fg-grey-700">
          `AUTH_MODE=local` 时用户存 PostgreSQL；邮件重置走自定义 SMTP。详见 `.env.example` 与 PRODUCT.md。
        </p>
      </SurfaceCard>
    </div>
  );
}
