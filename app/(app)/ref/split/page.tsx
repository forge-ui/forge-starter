"use client";

import { useState } from "react";
import { MagniferLinear } from "solar-icon-set";
import { Button, StatusBadge, TextField } from "@forge-ui-official/core";
import { RefChrome } from "@/components/reference/ref-chrome";
import { siteConfig } from "@/config/site";
import { REF_PAGES } from "@/lib/reference/catalog";
import { REF_RECORDS, REF_STATUS_META } from "@/lib/reference/mock-data";

const meta = REF_PAGES.find((p) => p.slug === "split")!;

export default function RefSplitPage() {
  const [activeId, setActiveId] = useState(REF_RECORDS[0]?.id ?? "");
  const [search, setSearch] = useState("");
  const list = REF_RECORDS.filter(
    (r) =>
      !search.trim()
      || r.title.toLowerCase().includes(search.toLowerCase())
      || r.owner.toLowerCase().includes(search.toLowerCase()),
  );
  const active = REF_RECORDS.find((r) => r.id === activeId) ?? list[0];

  return (
    <RefChrome meta={meta}>
      <div className="grid min-h-[480px] grid-cols-1 gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="flex flex-col gap-3 rounded-xl bg-white p-4 outline outline-1 outline-offset-[-1px] outline-fg-grey-200">
          <TextField
            color={siteConfig.accent}
            value={search}
            onChange={setSearch}
            placeholder="搜索列表…"
            iconLeft={<MagniferLinear size={16} />}
          />
          <ul className="flex flex-1 flex-col gap-1 overflow-y-auto">
            {list.map((row) => {
              const on = row.id === active?.id;
              return (
                <li key={row.id}>
                  <button
                    type="button"
                    onClick={() => setActiveId(row.id)}
                    className={`flex w-full flex-col gap-1 rounded-xl px-3 py-2.5 text-left transition ${
                      on ? "bg-fg-blue-50 outline outline-1 outline-fg-blue-200" : "hover:bg-fg-grey-50"
                    }`}
                  >
                    <span className="truncate text-sm font-semibold text-fg-black">{row.title}</span>
                    <span className="flex items-center justify-between gap-2 text-xs text-fg-grey-500">
                      <span>{row.owner}</span>
                      <StatusBadge
                        label={REF_STATUS_META[row.status].label}
                        color={REF_STATUS_META[row.status].color}
                      />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="rounded-xl bg-white p-6 outline outline-1 outline-offset-[-1px] outline-fg-grey-200">
          {active ? (
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-fg-black">{active.title}</h2>
                  <p className="mt-1 text-sm text-fg-grey-500">
                    {active.subtitle} · {active.updated}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button color={siteConfig.accent} variant="tertiary">
                    次要
                  </Button>
                  <Button color={siteConfig.accent}>主操作</Button>
                </div>
              </div>
              <StatusBadge
                label={REF_STATUS_META[active.status].label}
                color={REF_STATUS_META[active.status].color}
              />
              <p className="text-sm leading-6 text-fg-grey-700">{active.description}</p>
              <dl className="grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-fg-grey-500">负责人</dt>
                  <dd className="font-medium text-fg-black">{active.owner}</dd>
                </div>
                <div>
                  <dt className="text-fg-grey-500">金额</dt>
                  <dd className="font-medium text-fg-black">{active.amount}</dd>
                </div>
              </dl>
            </div>
          ) : (
            <p className="text-sm text-fg-grey-500">选择左侧记录</p>
          )}
        </div>
      </div>
    </RefChrome>
  );
}
