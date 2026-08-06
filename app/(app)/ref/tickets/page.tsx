"use client";

/**
 * Support tickets — support tickets list + thread
 * List + conversation thread with attachments (not chat IM, not queue approve).
 */

import { useMemo, useState } from "react";
import {
  Button,
  ButtonGroup,
  StatusBadge,
  TextArea,
} from "@forge-ui-official/core";
import { RefChrome } from "@/components/reference/ref-chrome";
import { siteConfig } from "@/config/site";
import { REF_PAGES } from "@/lib/reference/catalog";

const meta = REF_PAGES.find((p) => p.slug === "tickets")!;

type TicketStatus = "open" | "replied" | "closed";

type Ticket = {
  id: string;
  title: string;
  status: TicketStatus;
  updated: string;
  preview: string;
};

type Message = {
  id: string;
  role: "user" | "admin";
  author: string;
  content: string;
  time: string;
  attachments?: string[];
};

const tickets: Ticket[] = [
  {
    id: "t1",
    title: "无法导出账号列表",
    status: "open",
    updated: "今天 11:20",
    preview: "点导出后一直转圈…",
  },
  {
    id: "t2",
    title: "发票抬头修改",
    status: "replied",
    updated: "昨天 16:05",
    preview: "请改成 Shieldfy Inc.",
  },
  {
    id: "t3",
    title: "升级 Pro 套餐咨询",
    status: "closed",
    updated: "01 Aug",
    preview: "已确认年付折扣",
  },
];

const messagesByTicket: Record<string, Message[]> = {
  t1: [
    {
      id: "m1",
      role: "user",
      author: "王敏",
      content: "在账号列表点「导出」后转圈超过 2 分钟，没有下载文件。浏览器 Chrome 128。",
      time: "今天 10:48",
      attachments: ["https://placehold.co/120x80/e2e8f0/64748b?text=screen"],
    },
    {
      id: "m2",
      role: "admin",
      author: "Support · Linda",
      content: "收到。请提供大约筛选条件与导出条数范围，我们在看任务队列。",
      time: "今天 11:05",
    },
    {
      id: "m3",
      role: "user",
      author: "王敏",
      content: "筛选状态=启用，约 1200 条。",
      time: "今天 11:20",
    },
  ],
  t2: [
    {
      id: "m4",
      role: "user",
      author: "李哲",
      content: "上月发票抬头写错了，能否重开？",
      time: "昨天 14:10",
    },
    {
      id: "m5",
      role: "admin",
      author: "Support · Jay",
      content: "可以。请回复正确抬头与税号，我们作废原票后重发。",
      time: "昨天 16:05",
    },
  ],
  t3: [
    {
      id: "m6",
      role: "user",
      author: "陈思",
      content: "年付 Pro 是否有折扣？",
      time: "31 Jul",
    },
    {
      id: "m7",
      role: "admin",
      author: "Support · Mia",
      content: "年付 8 折，已邮件发送报价单。",
      time: "01 Aug",
    },
  ],
};

const statusMeta: Record<TicketStatus, { label: string; color: "blue" | "yellow" | "grey" }> = {
  open: { label: "Open", color: "blue" },
  replied: { label: "Replied", color: "yellow" },
  closed: { label: "Closed", color: "grey" },
};

const filters = [{ label: "全部" }, { label: "Open" }, { label: "Replied" }, { label: "Closed" }];

export default function RefTicketsPage() {
  const [filter, setFilter] = useState(0);
  const [activeId, setActiveId] = useState("t1");
  const [draft, setDraft] = useState("");

  const list = useMemo(() => {
    if (filter === 0) return tickets;
    const map: TicketStatus[] = ["open", "replied", "closed"];
    return tickets.filter((t) => t.status === map[filter - 1]);
  }, [filter]);

  const active = tickets.find((t) => t.id === activeId) ?? tickets[0];
  const messages = messagesByTicket[active.id] ?? [];

  return (
    <RefChrome meta={meta}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ButtonGroup
          color={siteConfig.accent}
          shape="pill"
          items={filters.map((f) => ({ label: f.label }))}
          activeIndex={filter}
          onChange={setFilter}
        />
        <Button color={siteConfig.accent}>新建工单</Button>
      </div>

      <div className="grid min-h-[560px] grid-cols-1 gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        {/* Ticket list */}
        <div className="flex flex-col overflow-hidden rounded-[24px] border border-fg-grey-200 bg-white">
          <div className="border-b border-fg-grey-100 px-4 py-3">
            <h3 className="text-sm font-semibold text-fg-black">工单列表</h3>
            <p className="text-xs text-fg-grey-500">用户侧 / 运营侧同一线程范式</p>
          </div>
          <div className="flex flex-col gap-1 p-2">
            {list.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveId(t.id)}
                className={`rounded-2xl px-3 py-3 text-left transition ${
                  t.id === activeId
                    ? "bg-fg-blue-50 outline outline-1 outline-fg-blue-200"
                    : "hover:bg-fg-grey-50"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-semibold text-fg-black">{t.title}</span>
                  <StatusBadge
                    label={statusMeta[t.status].label}
                    color={statusMeta[t.status].color}
                  />
                </div>
                <p className="mt-1 truncate text-xs text-fg-grey-500">{t.preview}</p>
                <p className="mt-1 text-[11px] text-fg-grey-400">{t.updated}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Thread */}
        <div className="flex min-w-0 flex-col overflow-hidden rounded-[24px] border border-fg-grey-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-fg-grey-100 px-5 py-4">
            <div>
              <h3 className="text-base font-semibold text-fg-black">{active.title}</h3>
              <p className="text-xs text-fg-grey-500">#{active.id.toUpperCase()} · {active.updated}</p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge
                label={statusMeta[active.status].label}
                color={statusMeta[active.status].color}
              />
              {active.status !== "closed" ? (
                <Button color="grey" variant="tertiary" size="sm">
                  关闭工单
                </Button>
              ) : null}
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-5">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === "admin" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    m.role === "admin"
                      ? "bg-fg-grey-50 outline outline-1 outline-fg-grey-200"
                      : "bg-fg-blue-50 outline outline-1 outline-fg-blue-100"
                  }`}
                >
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-fg-black">{m.author}</span>
                    <span className="text-[11px] text-fg-grey-400">{m.time}</span>
                  </div>
                  <p className="text-sm leading-6 text-fg-grey-700">{m.content}</p>
                  {m.attachments?.length ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {m.attachments.map((url) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={url}
                          src={url}
                          alt=""
                          className="h-16 w-24 rounded-lg border border-fg-grey-200 object-cover"
                        />
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-fg-grey-100 p-4">
            <TextArea
              color={siteConfig.accent}
              label="回复"
              value={draft}
              onChange={setDraft}
              placeholder="输入回复内容…（示意，不提交）"
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <Button color="grey" variant="tertiary" size="sm">
                添加附件
              </Button>
              <Button color={siteConfig.accent} size="sm">
                发送回复
              </Button>
            </div>
          </div>
        </div>
      </div>
    </RefChrome>
  );
}
