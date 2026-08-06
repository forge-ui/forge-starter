"use client";

import { useMemo, useState } from "react";
import { MagniferLinear } from "solar-icon-set";
import {
  Button,
  ButtonGroup,
  PlusIcon,
  StatusBadge,
  TextField,
} from "@forge-ui-official/core";
import { RefChrome } from "@/components/reference/ref-chrome";
import { siteConfig } from "@/config/site";
import { REF_PAGES } from "@/lib/reference/catalog";
import { REF_RECORDS, REF_STATUS_META } from "@/lib/reference/mock-data";

const meta = REF_PAGES.find((p) => p.slug === "list-cards")!;
const filters = [
  { label: "全部", value: "all" },
  { label: "进行中", value: "active" },
  { label: "待处理", value: "pending" },
];

export default function RefListCardsPage() {
  const [filterIndex, setFilterIndex] = useState(0);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const key = filters[filterIndex]?.value ?? "all";
    const q = search.trim().toLowerCase();
    return REF_RECORDS.filter((row) => {
      if (key !== "all" && row.status !== key) return false;
      if (!q) return true;
      return row.title.toLowerCase().includes(q) || row.owner.toLowerCase().includes(q);
    });
  }, [filterIndex, search]);

  return (
    <RefChrome meta={meta}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ButtonGroup
          color={siteConfig.accent}
          shape="pill"
          items={filters.map((f) => ({ label: f.label }))}
          activeIndex={filterIndex}
          onChange={setFilterIndex}
        />
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-56">
            <TextField
              color={siteConfig.accent}
              value={search}
              onChange={setSearch}
              placeholder="搜索…"
              iconLeft={<MagniferLinear size={16} />}
            />
          </div>
          <Button color={siteConfig.accent} iconLeft={<PlusIcon size={16} />}>
            新建
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((row) => (
          <article
            key={row.id}
            className="flex flex-col gap-3 rounded-2xl bg-white p-5 outline outline-1 outline-offset-[-1px] outline-fg-grey-200"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h2 className="truncate text-base font-semibold text-fg-black">{row.title}</h2>
                <p className="mt-0.5 text-xs text-fg-grey-500">
                  {row.subtitle} · {row.owner}
                </p>
              </div>
              <StatusBadge
                label={REF_STATUS_META[row.status].label}
                color={REF_STATUS_META[row.status].color}
              />
            </div>
            <p className="line-clamp-2 text-sm leading-6 text-fg-grey-600">{row.description}</p>
            <div className="mt-auto flex flex-wrap gap-1.5">
              {row.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-fg-grey-50 px-2 py-0.5 text-xs font-medium text-fg-grey-600"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-fg-grey-100 pt-3 text-xs text-fg-grey-500">
              <span>{row.amount}</span>
              <span>{row.updated}</span>
            </div>
          </article>
        ))}
      </div>
    </RefChrome>
  );
}
