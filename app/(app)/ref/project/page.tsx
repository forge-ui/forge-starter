"use client";

/**
 * Project detail multi-tab — project-template/projects/[id]
 * Header strip + TabBar: overview / task(kanban) / attachment / teams
 */

import { useState } from "react";
import Link from "next/link";
import {
  AddCircleLinear,
  CalendarMinimalisticLinear,
  Pen2Linear,
  UserPlusLinear,
} from "solar-icon-set";
import {
  Avatar,
  AvatarGroup,
  Button,
  FileCard,
  ProgressBar,
  StatusBadge,
  TabBar,
} from "@forge-ui-official/core";
import { RefChrome } from "@/components/reference/ref-chrome";
import { siteConfig } from "@/config/site";
import { REF_PAGES } from "@/lib/reference/catalog";

const meta = REF_PAGES.find((p) => p.slug === "project")!;

const project = {
  name: "Website Redesign",
  status: "In Progress" as const,
  client: "Shieldfy Inc.",
  budget: "$40,000",
  spent: "$24,800",
  dueDate: "30 Sep 2026",
  progress: 62,
  description:
    "Full marketing site redesign with CRM lead capture, product pages, and design-system handoff.",
  members: [
    { name: "Linda Blair", role: "PM", avatar: "https://api.dicebear.com/9.x/thumbs/svg?seed=linda" },
    { name: "Jay Parker", role: "Design", avatar: "https://api.dicebear.com/9.x/thumbs/svg?seed=jay" },
    { name: "Mia Chen", role: "Eng", avatar: "https://api.dicebear.com/9.x/thumbs/svg?seed=mia" },
    { name: "Josh Adam", role: "QA", avatar: "https://api.dicebear.com/9.x/thumbs/svg?seed=josh" },
  ],
};

const tabs = ["Overview", "Task", "Attachment", "Teams"] as const;

function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-fg-grey-200 bg-white p-6">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-fg-black">{title}</h3>
        {action}
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-sm text-fg-grey-500">{label}</div>
      <div className="mt-1 text-base text-fg-black">{value}</div>
    </div>
  );
}

export default function RefProjectPage() {
  const [tab, setTab] = useState(0);

  return (
    <RefChrome meta={meta}>
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button color="grey" variant="tertiary" iconLeft={<AddCircleLinear size={18} />}>
          Invite
        </Button>
        <Button color={siteConfig.accent} iconLeft={<Pen2Linear size={18} />}>
          Edit
        </Button>
      </div>

      <section className="rounded-[32px] bg-fg-grey-50 p-6 sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex size-16 items-center justify-center rounded-3xl bg-fg-violet text-xl font-semibold text-white">
              WR
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-fg-black sm:text-3xl">{project.name}</h2>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <StatusBadge label={project.status} color="yellow" />
                <AvatarGroup>
                  {project.members.slice(0, 3).map((m) => (
                    <Avatar key={m.name} src={m.avatar} size="sm" />
                  ))}
                </AvatarGroup>
                <Button color="grey" variant="tertiary" size="sm" iconLeft={<UserPlusLinear size={16} />}>
                  Invite
                </Button>
              </div>
            </div>
          </div>
          <Button
            color="grey"
            variant="tertiary"
            iconLeft={<CalendarMinimalisticLinear size={18} />}
          >
            {project.dueDate}
          </Button>
        </div>
      </section>

      <TabBar
        color={siteConfig.accent}
        surface="page"
        tabs={tabs.map((label, i) => ({ label, active: tab === i }))}
        onChange={setTab}
      />

      {tab === 0 && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
          <aside className="flex flex-col gap-6">
            <Panel title="General Information">
              <Info label="Status" value={project.status} />
              <Info label="Client" value={project.client} />
              <Info label="Budget" value={project.budget} />
              <Info label="Due Date" value={project.dueDate} />
            </Panel>
            <Panel title="Teams">
              {project.members.map((m) => (
                <div key={m.name} className="flex items-center gap-3">
                  <Avatar src={m.avatar} size="md" />
                  <div>
                    <div className="text-sm font-semibold text-fg-black">{m.name}</div>
                    <div className="text-xs text-fg-grey-500">{m.role}</div>
                  </div>
                </div>
              ))}
            </Panel>
            <Panel title="Attachment">
              <FileCard file={{ id: "a1", name: "brief.pdf", size: "420 KB", state: "uploaded" }} />
              <FileCard file={{ id: "a2", name: "moodboard.fig", size: "3.1 MB", state: "uploaded" }} />
            </Panel>
          </aside>
          <main className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Panel title="Progress">
                <div className="text-4xl font-semibold text-fg-black">{project.progress}%</div>
                <ProgressBar value={project.progress} color="purple" />
              </Panel>
              <Panel title="Budget Spent">
                <div className="text-4xl font-semibold text-fg-black">{project.spent}</div>
                <ProgressBar value={project.progress} color="red" />
              </Panel>
            </div>
            <Panel title="Description">
              <p className="text-sm leading-7 text-fg-grey-700">{project.description}</p>
            </Panel>
            <Panel title="Comments">
              {project.members.slice(0, 2).map((m, index) => (
                <div key={m.name} className="flex gap-3 rounded-2xl border border-fg-grey-200 p-4">
                  <Avatar src={m.avatar} size="md" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="text-sm font-semibold text-fg-black">{m.name}</h4>
                      <span className="text-xs text-fg-grey-500">
                        {index === 0 ? "25 Jan 08:30" : "23 Jan 14:00"}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-fg-grey-600">
                      Looks good overall — can we tighten the lead form spacing?
                    </p>
                  </div>
                </div>
              ))}
              <Button color={siteConfig.accent} className="self-end">
                Post Comment
              </Button>
            </Panel>
          </main>
        </div>
      )}

      {tab === 1 && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-fg-grey-600">
            Task tab 内嵌 Kanban。完整独立泳道范式见{" "}
            <Link href="/ref/kanban/" className="font-medium text-fg-blue hover:underline">
              /ref/kanban
            </Link>
            ；任务详情见{" "}
            <Link href="/ref/task/" className="font-medium text-fg-blue hover:underline">
              /ref/task
            </Link>
            。
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {["To Do", "In Progress", "Done", "Blocked"].map((col, i) => (
              <section key={col} className="rounded-2xl border border-fg-grey-200 bg-fg-grey-50 p-4">
                <h3 className="mb-3 text-sm font-semibold text-fg-black">{col}</h3>
                <Link
                  href="/ref/task/"
                  className="block rounded-2xl border border-fg-grey-200 bg-white p-4 hover:border-fg-blue-200"
                >
                  <StatusBadge
                    label={i === 3 ? "High" : i === 1 ? "Medium" : "Low"}
                    color={i === 3 ? "red" : i === 1 ? "yellow" : "green"}
                  />
                  <p className="mt-3 text-sm font-semibold text-fg-black">
                    {i === 0 ? "Content inventory" : i === 1 ? "Homepage Wireframe" : i === 2 ? "Kickoff deck" : "Legal copy"}
                  </p>
                  <div className="mt-3">
                    <ProgressBar value={[8, 62, 100, 45][i]} color={i === 2 ? "green" : i === 3 ? "red" : "yellow"} />
                  </div>
                </Link>
              </section>
            ))}
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {["brief.pdf", "moodboard.fig", "wireframe-v2.fig", "spec.pdf", "assets.zip", "kickoff.ppt"].map(
            (name) => (
              <FileCard
                key={name}
                file={{ id: name, name, size: "100 KB", state: "uploaded" }}
              />
            ),
          )}
        </div>
      )}

      {tab === 3 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {project.members.map((m) => (
            <div
              key={m.name}
              className="flex items-center justify-between rounded-[24px] border border-fg-grey-200 bg-white p-5"
            >
              <div className="flex items-center gap-3">
                <Avatar src={m.avatar} size="md" />
                <div>
                  <div className="text-sm font-semibold text-fg-black">{m.name}</div>
                  <div className="text-xs text-fg-grey-500">{m.role}</div>
                </div>
              </div>
              <Button color="grey" variant="tertiary" size="sm" iconLeft={<UserPlusLinear size={16} />}>
                Message
              </Button>
            </div>
          ))}
        </div>
      )}
    </RefChrome>
  );
}
