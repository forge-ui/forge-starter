"use client";

import { useEffect, useState } from "react";
import { Button } from "@forge-ui-official/core";
import { siteConfig } from "@/config/site";

export function SettingsNotificationsPanel() {
  const [emailNotify, setEmailNotify] = useState(true);
  const [securityNotify, setSecurityNotify] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("forge-starter:notification-prefs");
      if (!raw) return;
      const prefs = JSON.parse(raw) as {
        emailNotify?: boolean;
        securityNotify?: boolean;
      };
      if (typeof prefs.emailNotify === "boolean") setEmailNotify(prefs.emailNotify);
      if (typeof prefs.securityNotify === "boolean") setSecurityNotify(prefs.securityNotify);
    } catch {
      // ignore
    }
  }, []);

  function saveNotifications(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      window.localStorage.setItem(
        "forge-starter:notification-prefs",
        JSON.stringify({ emailNotify, securityNotify }),
      );
      setMessage(
        `系统偏好已保存：邮件 ${emailNotify ? "开" : "关"}，安全提醒 ${securityNotify ? "开" : "关"}`,
      );
    } catch {
      setError("无法写入本地偏好");
    }
  }

  return (
    <div className="rounded-xl bg-white p-6 outline outline-1 outline-offset-[-1px] outline-fg-grey-200">
      <h2 className="text-lg font-semibold text-fg-black">系统设置</h2>
      <p className="mt-1 text-sm text-fg-grey-700">
        通知与安全提醒偏好保存在本机浏览器。
      </p>
      <form onSubmit={saveNotifications} className="mt-6 flex max-w-xl flex-col gap-4">
        <label className="flex items-center justify-between gap-4 rounded-2xl border border-fg-grey-200 px-4 py-3">
          <span className="text-sm font-medium text-fg-black">邮件通知</span>
          <input
            type="checkbox"
            checked={emailNotify}
            onChange={(e) => setEmailNotify(e.target.checked)}
            className="h-4 w-4"
          />
        </label>
        <label className="flex items-center justify-between gap-4 rounded-2xl border border-fg-grey-200 px-4 py-3">
          <span className="text-sm font-medium text-fg-black">账号安全提醒</span>
          <input
            type="checkbox"
            checked={securityNotify}
            onChange={(e) => setSecurityNotify(e.target.checked)}
            className="h-4 w-4"
          />
        </label>
        {error ? <p className="text-sm text-fg-red">{error}</p> : null}
        {message ? <p className="text-sm text-fg-green-500">{message}</p> : null}
        <Button type="submit" color={siteConfig.accent}>
          保存系统设置
        </Button>
      </form>
    </div>
  );
}
