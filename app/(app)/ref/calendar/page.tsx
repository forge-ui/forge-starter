"use client";

/**
 * Calendar — micellaneous-template/calendar
 * https://www.forgeui.org/templates/micellaneous-template/calendar
 */

import { useState } from "react";
import {
  Avatar,
  Button,
  ButtonGroup,
  FullCalendar,
  SurfaceCard,
} from "@forge-ui-official/core";
import { RefChrome } from "@/components/reference/ref-chrome";
import { siteConfig } from "@/config/site";
import { REF_PAGES } from "@/lib/reference/catalog";

const meta = REF_PAGES.find((p) => p.slug === "calendar")!;

const events = [
  { day: 5, label: "周会", color: "blue" as const, hour: 9 },
  { day: 8, label: "客户拜访", color: "green" as const, hour: 14 },
  { day: 12, label: "发版窗口", color: "yellow" as const, hour: 10 },
  { day: 15, label: "面试", color: "purple" as const, hour: 16 },
  { day: 20, label: "复盘", color: "red" as const, hour: 11 },
];

const guests = ["王敏", "李哲", "陈思", "赵倩", "周凯"];

export default function RefCalendarPage() {
  const [viewIndex, setViewIndex] = useState(0);
  const views = [
    { label: "月", value: "month" as const },
    { label: "周", value: "week" as const },
    { label: "日", value: "day" as const },
  ];
  const view = views[viewIndex]?.value ?? "month";
  const [showDetail, setShowDetail] = useState(true);

  return (
    <RefChrome meta={meta}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ButtonGroup
          color={siteConfig.accent}
          shape="pill"
          items={views.map((v) => ({ label: v.label }))}
          activeIndex={viewIndex}
          onChange={setViewIndex}
        />
        <div className="flex gap-2">
          <Button
            color={siteConfig.accent}
            variant="tertiary"
            onClick={() => setShowDetail((v) => !v)}
          >
            {showDetail ? "隐藏详情面板" : "显示详情面板"}
          </Button>
          <Button color={siteConfig.accent}>新建日程</Button>
        </div>
      </div>

      <FullCalendar
        view={view}
        color={siteConfig.accent}
        year={2026}
        month={7}
        day={12}
        events={events}
        onCloseDetail={() => setShowDetail(false)}
        detailPanel={
          showDetail ? (
            <SurfaceCard className="max-h-[520px] w-[min(100%,380px)] overflow-auto shadow-xl" padding="md">
              <div className="flex items-start gap-3">
                <span className="mt-1 size-3 shrink-0 rounded bg-fg-blue" />
                <div>
                  <p className="text-lg font-semibold text-fg-black">周会</p>
                  <p className="mt-1 text-sm text-fg-grey-500">周一 12 Aug · 09:00–10:00</p>
                </div>
              </div>
              <p className="mt-4 text-sm font-semibold text-fg-black">说明</p>
              <p className="mt-1 text-sm leading-6 text-fg-grey-600">
                对照 micellaneous calendar：主区 FullCalendar，可选右侧/浮层详情。
              </p>
              <Button className="mt-4" color={siteConfig.accent}>
                加入会议
              </Button>
              <p className="mt-5 text-sm font-semibold text-fg-black">参与人</p>
              <div className="mt-2 flex flex-col gap-2">
                {guests.map((name) => (
                  <div key={name} className="flex items-center gap-2">
                    <Avatar
                      src={`https://api.dicebear.com/9.x/thumbs/svg?seed=${name}`}
                      size="sm"
                    />
                    <span className="text-sm text-fg-grey-700">{name}</span>
                  </div>
                ))}
              </div>
            </SurfaceCard>
          ) : undefined
        }
      />
    </RefChrome>
  );
}
