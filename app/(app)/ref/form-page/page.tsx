"use client";

import { useState } from "react";
import { Button, SelectOption, TextArea, TextField } from "@forge-ui-official/core";
import { RefChrome } from "@/components/reference/ref-chrome";
import { siteConfig } from "@/config/site";
import { REF_PAGES } from "@/lib/reference/catalog";

const meta = REF_PAGES.find((p) => p.slug === "form-page")!;

const statusOptions = [
  { value: "draft", label: "草稿" },
  { value: "pending", label: "待审批" },
  { value: "active", label: "进行中" },
];

export default function RefFormPage() {
  const [title, setTitle] = useState("");
  const [owner, setOwner] = useState("");
  const [status, setStatus] = useState("draft");
  const [budget, setBudget] = useState("");
  const [notes, setNotes] = useState("");

  return (
    <RefChrome meta={meta}>
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-5">
        <section className="rounded-xl bg-white p-6 outline outline-1 outline-offset-[-1px] outline-fg-grey-200">
          <h2 className="text-base font-semibold text-fg-black">基础信息</h2>
          <div className="mt-4 flex flex-col gap-4">
            <TextField color={siteConfig.accent} label="标题" value={title} onChange={setTitle} />
            <TextField color={siteConfig.accent} label="负责人" value={owner} onChange={setOwner} />
            <SelectOption
              color={siteConfig.accent}
              label="状态"
              width="100%"
              options={statusOptions}
              value={status}
              onChange={setStatus}
            />
          </div>
        </section>
        <section className="rounded-xl bg-white p-6 outline outline-1 outline-offset-[-1px] outline-fg-grey-200">
          <h2 className="text-base font-semibold text-fg-black">预算与说明</h2>
          <div className="mt-4 flex flex-col gap-4">
            <TextField
              color={siteConfig.accent}
              label="预算（元）"
              value={budget}
              onChange={setBudget}
              placeholder="如 10000"
            />
            <TextArea color={siteConfig.accent} label="说明" rows={4} value={notes} onChange={setNotes} />
          </div>
        </section>
        <div className="flex justify-end gap-2">
          <Button color={siteConfig.accent} variant="tertiary">
            取消
          </Button>
          <Button color={siteConfig.accent}>保存（示意）</Button>
        </div>
      </div>
    </RefChrome>
  );
}
