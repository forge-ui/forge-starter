"use client";

import { Button, PlusIcon } from "@forge-ui-official/core";
import { RefChrome } from "@/components/reference/ref-chrome";
import { siteConfig } from "@/config/site";
import { REF_PAGES } from "@/lib/reference/catalog";

const meta = REF_PAGES.find((p) => p.slug === "empty")!;

export default function RefEmptyPage() {
  return (
    <RefChrome meta={meta}>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="flex flex-col items-center gap-3 rounded-[28px] border border-dashed border-fg-grey-200 bg-white py-16">
          <p className="text-lg font-semibold text-fg-black">暂无数据</p>
          <p className="max-w-xs text-center text-sm text-fg-grey-500">
            库为空时的空态：说明原因 + 主按钮创建。
          </p>
          <Button color={siteConfig.accent} iconLeft={<PlusIcon size={16} />}>
            新建第一条
          </Button>
        </div>
        <div className="flex flex-col items-center gap-3 rounded-[28px] border border-dashed border-fg-grey-200 bg-white py-16">
          <p className="text-lg font-semibold text-fg-black">无匹配结果</p>
          <p className="max-w-xs text-center text-sm text-fg-grey-500">
            有数据但筛选/搜索为空：提示清空条件，不一定显示新建。
          </p>
          <Button color={siteConfig.accent} variant="tertiary">
            清空筛选
          </Button>
        </div>
      </div>
    </RefChrome>
  );
}
