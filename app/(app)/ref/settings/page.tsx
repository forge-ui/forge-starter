"use client";

import { useState } from "react";
import { Button, TextField, Toggle } from "@forge-ui-official/core";
import { RefChrome } from "@/components/reference/ref-chrome";
import { siteConfig } from "@/config/site";
import { REF_PAGES } from "@/lib/reference/catalog";

const meta = REF_PAGES.find((p) => p.slug === "settings")!;

export default function RefSettingsPage() {
  const [name, setName] = useState("演示工作区");
  const [notify, setNotify] = useState(true);
  const [digest, setDigest] = useState(false);

  return (
    <RefChrome meta={meta}>
      <div className="mx-auto flex w-full max-w-xl flex-col gap-5">
        <section className="rounded-xl bg-white p-6 outline outline-1 outline-offset-[-1px] outline-fg-grey-200">
          <h2 className="text-base font-semibold text-fg-black">基本设置</h2>
          <div className="mt-4">
            <TextField color={siteConfig.accent} label="工作区名称" value={name} onChange={setName} />
          </div>
          <div className="mt-4">
            <Button color={siteConfig.accent}>保存</Button>
          </div>
        </section>
        <section className="rounded-xl bg-white p-6 outline outline-1 outline-offset-[-1px] outline-fg-grey-200">
          <h2 className="text-base font-semibold text-fg-black">通知</h2>
          <div className="mt-4 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-fg-black">站内通知</p>
                <p className="text-xs text-fg-grey-500">审批与提及即时推送</p>
              </div>
              <Toggle color={siteConfig.accent} checked={notify} onChange={setNotify} />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-fg-black">每日摘要邮件</p>
                <p className="text-xs text-fg-grey-500">需要配置 SMTP</p>
              </div>
              <Toggle color={siteConfig.accent} checked={digest} onChange={setDigest} />
            </div>
          </div>
        </section>
        <section className="rounded-xl bg-white p-6 outline outline-1 outline-offset-[-1px] outline-fg-red-100">
          <h2 className="text-base font-semibold text-fg-red">危险区</h2>
          <p className="mt-2 text-sm text-fg-grey-600">删除工作区需二次确认（示意按钮无真实删除）。</p>
          <div className="mt-4">
            <Button color="red" variant="tertiary">
              删除工作区
            </Button>
          </div>
        </section>
      </div>
    </RefChrome>
  );
}
