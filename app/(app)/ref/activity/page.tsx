"use client";

import { useMemo, useState } from "react";
import { ButtonGroup, HistoryGrouped } from "@forge-ui-official/core";
import { RefChrome } from "@/components/reference/ref-chrome";
import { siteConfig } from "@/config/site";
import { REF_PAGES } from "@/lib/reference/catalog";
import { REF_ACTIVITIES } from "@/lib/reference/mock-data";

const meta = REF_PAGES.find((p) => p.slug === "activity")!;
const tabs = [{ label: "全部" }, { label: "今天" }, { label: "昨天" }];

export default function RefActivityPage() {
  const [tab, setTab] = useState(0);

  const groups = useMemo(() => {
    const filter = tabs[tab]?.label ?? "全部";
    const items = REF_ACTIVITIES.filter(
      (a) => filter === "全部" || a.group === filter,
    );
    const map = new Map<string, typeof items>();
    for (const a of items) {
      const list = map.get(a.group) ?? [];
      list.push(a);
      map.set(a.group, list);
    }
    return [...map.entries()];
  }, [tab]);

  return (
    <RefChrome meta={meta}>
      <ButtonGroup
        color={siteConfig.accent}
        shape="pill"
        items={tabs}
        activeIndex={tab}
        onChange={setTab}
      />
      <div className="rounded-xl bg-white p-6 outline outline-1 outline-offset-[-1px] outline-fg-grey-200">
        {groups.map(([group, items]) => (
          <HistoryGrouped
            key={group}
            title={group}
            className="mb-6 last:mb-0"
            color={siteConfig.accent}
            items={items.map((a) => ({
              title: `${a.actor} ${a.action}`,
              description: a.target,
              datetime: a.time,
            }))}
          />
        ))}
        {groups.length === 0 ? (
          <p className="text-sm text-fg-grey-500">该筛选下无活动</p>
        ) : null}
      </div>
    </RefChrome>
  );
}
