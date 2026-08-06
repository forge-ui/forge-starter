"use client";

/**
 * Full-page form — crm-template/leads/new
 * https://www.forgeui.org/templates/crm-template/leads/new
 */

import { useState } from "react";
import { Button, SelectOption, TextArea, TextField } from "@forge-ui-official/core";
import { RefChrome } from "@/components/reference/ref-chrome";
import { siteConfig } from "@/config/site";
import { REF_PAGES } from "@/lib/reference/catalog";

const meta = REF_PAGES.find((p) => p.slug === "form-page")!;

const sourceOptions = [
  { value: "website", label: "官网" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "referral", label: "转介" },
  { value: "campaign", label: "活动" },
];

const statusOptions = [
  { value: "new", label: "New" },
  { value: "hot", label: "Hot" },
  { value: "warm", label: "Warm" },
  { value: "cold", label: "Cold" },
];

export default function RefFormPage() {
  const [name, setName] = useState("Lisa Greg");
  const [email, setEmail] = useState("lisagreg@mail.com");
  const [phone, setPhone] = useState("+1 987 555 909");
  const [company, setCompany] = useState("Shieldfy");
  const [source, setSource] = useState("website");
  const [status, setStatus] = useState("new");
  const [notes, setNotes] = useState("Requested a CRM walkthrough and pricing by team size.");

  return (
    <RefChrome meta={meta}>
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button color={siteConfig.accent} variant="tertiary">
          取消
        </Button>
        <Button color={siteConfig.accent}>保存线索</Button>
      </div>

      <div className="rounded-[28px] bg-white p-6 outline outline-1 outline-offset-[-1px] outline-fg-grey-200 sm:p-8">
        <h2 className="text-base font-semibold text-fg-black">新建线索（整页表单）</h2>
        <p className="mt-1 text-sm text-fg-grey-500">
          对齐 CRM leads/new：双列表单 + 底部说明 + 主操作。字段多为默认形态。
        </p>

        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <TextField color={siteConfig.accent} label="姓名" value={name} onChange={setName} />
          <TextField color={siteConfig.accent} label="邮箱" value={email} onChange={setEmail} />
          <TextField color={siteConfig.accent} label="电话" value={phone} onChange={setPhone} />
          <TextField color={siteConfig.accent} label="公司" value={company} onChange={setCompany} />
          <SelectOption
            color={siteConfig.accent}
            label="来源"
            width="100%"
            options={sourceOptions}
            value={source}
            onChange={setSource}
          />
          <SelectOption
            color={siteConfig.accent}
            label="状态"
            width="100%"
            options={statusOptions}
            value={status}
            onChange={setStatus}
          />
        </div>

        <div className="mt-5">
          <TextArea
            color={siteConfig.accent}
            label="跟进备注"
            rows={4}
            value={notes}
            onChange={setNotes}
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button color="grey" variant="tertiary">
            取消
          </Button>
          <Button color={siteConfig.accent}>保存线索</Button>
        </div>
      </div>
    </RefChrome>
  );
}
