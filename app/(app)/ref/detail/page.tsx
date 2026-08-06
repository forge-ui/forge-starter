"use client";

import { useRouter } from "next/navigation";
import { AltArrowLeftLinear } from "solar-icon-set";
import { Button, StatusBadge } from "@forge-ui-official/core";
import { RefChrome } from "@/components/reference/ref-chrome";
import { siteConfig } from "@/config/site";
import { REF_PAGES } from "@/lib/reference/catalog";
import { REF_RECORDS, REF_STATUS_META } from "@/lib/reference/mock-data";

const meta = REF_PAGES.find((p) => p.slug === "detail")!;
const record = REF_RECORDS[0];

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-fg-grey-100 py-3 last:border-b-0">
      <span className="shrink-0 text-sm text-fg-grey-500">{label}</span>
      <span className="text-right text-sm font-medium text-fg-black">{value || "—"}</span>
    </div>
  );
}

export default function RefDetailPage() {
  const router = useRouter();
  const status = REF_STATUS_META[record.status];

  return (
    <RefChrome meta={meta}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <button
            type="button"
            aria-label="返回参考索引"
            onClick={() => router.push("/ref/")}
            className="mt-0.5 flex shrink-0 items-center justify-center rounded-full p-3.5 text-fg-grey-700 outline outline-1 outline-offset-[-1px] outline-fg-grey-200 hover:bg-fg-grey-100"
          >
            <AltArrowLeftLinear size={20} />
          </button>
          <div>
            <p className="text-sm text-fg-grey-500">示意：页内返回 + 顶栏操作（非侧栏）</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge label={status.label} color={status.color} />
          <Button color={siteConfig.accent} variant="tertiary">
            编辑
          </Button>
          <Button color="red" variant="tertiary">
            归档
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="rounded-xl bg-white p-6 outline outline-1 outline-offset-[-1px] outline-fg-grey-200">
          <h2 className="text-lg font-semibold text-fg-black">{record.title}</h2>
          <p className="mt-1 text-sm text-fg-grey-500">
            {record.subtitle} · 负责人 {record.owner} · {record.updated}
          </p>
          <div className="mt-4">
            <Field label="编号" value={record.subtitle} />
            <Field label="金额" value={record.amount} />
            <Field label="标签" value={record.tags.join("、")} />
            <Field label="说明" value={record.description} />
          </div>
        </div>
        <aside className="self-start rounded-xl bg-white p-5 outline outline-1 outline-offset-[-1px] outline-fg-grey-200">
          <h3 className="mb-1 text-base font-semibold text-fg-black">摘要</h3>
          <Field label="状态" value={status.label} />
          <Field label="负责人" value={record.owner} />
          <Field label="更新" value={record.updated} />
          <p className="mt-3 text-xs text-fg-grey-500">侧栏只放只读 meta，禁止塞「返回列表」。</p>
        </aside>
      </div>
    </RefChrome>
  );
}
