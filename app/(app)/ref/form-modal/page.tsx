"use client";

import { useState } from "react";
import { Button, PlusIcon, SelectOption, TextField } from "@forge-ui-official/core";
import { Modal } from "@/components/ui/modal";
import { RefChrome } from "@/components/reference/ref-chrome";
import { siteConfig } from "@/config/site";
import { REF_PAGES } from "@/lib/reference/catalog";

const meta = REF_PAGES.find((p) => p.slug === "form-modal")!;
const typeOptions = [
  { value: "leave", label: "请假" },
  { value: "expense", label: "报销" },
  { value: "general", label: "通用" },
];

export default function RefFormModalPage() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("leave");
  const [title, setTitle] = useState("");

  return (
    <RefChrome meta={meta}>
      <div className="flex flex-col items-start gap-4 rounded-xl bg-white p-8 outline outline-1 outline-offset-[-1px] outline-fg-grey-200">
        <p className="text-sm text-fg-grey-600">
          字段不多时：列表页主按钮打开 Modal，不要整页表单。
        </p>
        <Button
          color={siteConfig.accent}
          iconLeft={<PlusIcon size={16} />}
          onClick={() => setOpen(true)}
        >
          打开新建弹窗
        </Button>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="新建记录" width="w-[480px]">
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          <div className="flex flex-col gap-4">
            <SelectOption
              color={siteConfig.accent}
              label="类型"
              width="100%"
              options={typeOptions}
              value={type}
              onChange={setType}
            />
            <TextField
              color={siteConfig.accent}
              label="标题"
              value={title}
              onChange={setTitle}
              placeholder="可选"
            />
          </div>
        </div>
        <div className="flex justify-between border-t border-fg-grey-100 px-6 py-4">
          <Button color={siteConfig.accent} variant="tertiary" onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button color={siteConfig.accent} onClick={() => setOpen(false)}>
            提交
          </Button>
        </div>
      </Modal>
    </RefChrome>
  );
}
