"use client";

/**
 * CRM person/customer detail — crm-template/customers/[id] (John Bushmill style)
 * https://www.forgeui.org/templates/crm-template/customers/john-bushmill
 */

import { useMemo, useState } from "react";
import {
  ChatRoundLinear,
  PenLinear,
  PhoneCallingLinear,
} from "solar-icon-set";
import {
  Avatar,
  Button,
  DataTable,
  HistoryGrouped,
  StatusBadge,
  TabBar,
  type ColumnDef,
} from "@forge-ui-official/core";
import { RefChrome } from "@/components/reference/ref-chrome";
import { siteConfig } from "@/config/site";
import { REF_PAGES } from "@/lib/reference/catalog";
import { REF_ACTIVITIES } from "@/lib/reference/mock-data";

const meta = REF_PAGES.find((p) => p.slug === "person")!;

const person = {
  name: "John Bushmill",
  title: "采购总监",
  company: "Shieldfy Inc.",
  email: "johnb@mail.com",
  phone: "+1 987 555 909",
  location: "Austin, TX",
  status: "Active",
  owner: "Linda Blair",
  avatar: "https://api.dicebear.com/9.x/thumbs/svg?seed=john-bushmill",
  tags: ["Enterprise", "Renewal"],
};

const tabs = ["动态", "交易", "通话", "会议", "附件", "备注"];

type Tx = { id: string; name: string; amount: string; status: string; color: "green" | "yellow" | "red" };

const transactions: Tx[] = [
  { id: "INV23064", name: "Website Redesign", amount: "$2,121.00", status: "Paid", color: "green" },
  { id: "INV23051", name: "Support Retainer", amount: "$890.00", status: "Pending", color: "yellow" },
  { id: "INV23040", name: "Onboarding", amount: "$1,200.00", status: "Paid", color: "green" },
];

export default function RefPersonPage() {
  const [tab, setTab] = useState(0);
  const [profileTab, setProfileTab] = useState(0);

  const txColumns: ColumnDef<Tx>[] = useMemo(
    () => [
      {
        key: "name",
        header: "交易",
        flex: true,
        render: (row) => (
          <div className="flex h-10 flex-col justify-center">
            <span className="text-sm font-semibold text-fg-black">{row.name}</span>
            <span className="text-xs text-fg-grey-500">{row.id}</span>
          </div>
        ),
      },
      {
        key: "amount",
        header: "金额",
        width: "w-28",
        render: (row) => <span className="text-sm text-fg-grey-700">{row.amount}</span>,
      },
      {
        key: "status",
        header: "状态",
        width: "w-28",
        render: (row) => (
          <div className="flex h-10 items-center">
            <StatusBadge label={row.status} color={row.color} />
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <RefChrome meta={meta}>
      {/* Header strip like CRM customer detail */}
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-[28px] bg-white p-5 outline outline-1 outline-offset-[-1px] outline-fg-grey-200">
        <div className="flex min-w-0 items-center gap-4">
          <Avatar src={person.avatar} size="lg" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold text-fg-black">{person.name}</h2>
              <StatusBadge label={person.status} color="green" />
            </div>
            <p className="mt-1 text-sm text-fg-grey-500">
              {person.title} · {person.company}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {person.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-fg-blue-50 px-2 py-0.5 text-xs font-medium text-fg-blue"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button color={siteConfig.accent} variant="tertiary" iconLeft={<PhoneCallingLinear size={16} />}>
            通话
          </Button>
          <Button color={siteConfig.accent} variant="tertiary" iconLeft={<ChatRoundLinear size={16} />}>
            消息
          </Button>
          <Button color={siteConfig.accent} iconLeft={<PenLinear size={16} />}>
            编辑
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
        {/* Left profile panel: Details / Address */}
        <aside className="rounded-[28px] bg-white p-5 outline outline-1 outline-offset-[-1px] outline-fg-grey-200">
          <div className="mb-3 border-b border-fg-grey-200">
            <TabBar
              color={siteConfig.accent}
              tabs={[
                { label: "资料", active: profileTab === 0 },
                { label: "地址", active: profileTab === 1 },
              ]}
              onChange={setProfileTab}
            />
          </div>
          {profileTab === 0 ? (
            <dl className="space-y-3 text-sm">
              {[
                ["邮箱", person.email],
                ["电话", person.phone],
                ["公司", person.company],
                ["职位", person.title],
                ["负责人", person.owner],
                ["地区", person.location],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3 border-b border-fg-grey-100 pb-2">
                  <dt className="text-fg-grey-500">{k}</dt>
                  <dd className="text-right font-medium text-fg-black">{v}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <dl className="space-y-3 text-sm">
              {[
                ["街道", "1200 Congress Ave"],
                ["城市", "Austin"],
                ["州/省", "TX"],
                ["邮编", "78701"],
                ["国家", "United States"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3 border-b border-fg-grey-100 pb-2">
                  <dt className="text-fg-grey-500">{k}</dt>
                  <dd className="text-right font-medium text-fg-black">{v}</dd>
                </div>
              ))}
            </dl>
          )}
        </aside>

        {/* Right multi-tabs */}
        <div className="min-w-0">
          <div className="border-b border-fg-grey-200">
            <TabBar
              color={siteConfig.accent}
              surface="page"
              tabs={tabs.map((label, i) => ({ label, active: i === tab }))}
              onChange={setTab}
            />
          </div>

          <div className="mt-4">
            {tab === 0 ? (
              <div className="rounded-xl bg-white p-5 outline outline-1 outline-offset-[-1px] outline-fg-grey-200">
                <HistoryGrouped
                  title="客户动态"
                  color={siteConfig.accent}
                  items={REF_ACTIVITIES.map((a) => ({
                    title: `${a.actor} ${a.action}`,
                    description: a.target,
                    datetime: `${a.group} ${a.time}`,
                  }))}
                />
              </div>
            ) : null}

            {tab === 1 ? (
              <DataTable<Tx>
                color={siteConfig.accent}
                columns={txColumns}
                rows={transactions}
                getRowKey={(row) => row.id}
              />
            ) : null}

            {tab === 2 || tab === 3 ? (
              <div className="rounded-xl bg-white p-6 outline outline-1 outline-offset-[-1px] outline-fg-grey-200">
                <p className="text-sm text-fg-grey-600">
                  {tab === 2 ? "通话" : "会议"}计划列表示意（可接日程/记录 API）。
                </p>
                <ul className="mt-4 space-y-3">
                  {["14:00 产品演示", "16:30 续约沟通"].map((item) => (
                    <li
                      key={item}
                      className="flex items-center justify-between rounded-xl border border-fg-grey-100 px-4 py-3 text-sm"
                    >
                      <span className="font-medium text-fg-black">{item}</span>
                      <StatusBadge label="已排期" color="blue" />
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {tab === 4 ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {["Contract.pdf", "NDA.docx", "Pricing.xlsx"].map((name) => (
                  <div
                    key={name}
                    className="flex items-center justify-between rounded-xl bg-white px-4 py-3 outline outline-1 outline-offset-[-1px] outline-fg-grey-200"
                  >
                    <span className="text-sm font-medium text-fg-black">{name}</span>
                    <Button color={siteConfig.accent} variant="tertiary">
                      下载
                    </Button>
                  </div>
                ))}
              </div>
            ) : null}

            {tab === 5 ? (
              <div className="rounded-xl bg-white p-6 outline outline-1 outline-offset-[-1px] outline-fg-grey-200">
                <p className="text-sm leading-6 text-fg-grey-700">
                  客户要求按团队规模报价，优先演示权限与审批流。续约窗口在 Q3。
                </p>
                <p className="mt-3 text-xs text-fg-grey-500">Linda Blair · 2 天前</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </RefChrome>
  );
}
