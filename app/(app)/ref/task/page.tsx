"use client";

/**
 * Task detail — project-template/tasks/[id]
 * Left meta/members/files + right progress/checklist/activity.
 */

import { AddCircleLinear, Pen2Linear, UserPlusLinear } from "solar-icon-set";
import {
  Avatar,
  AvatarGroup,
  Button,
  Checklist,
  FileCard,
  ProgressBar,
  StatusBadge,
} from "@forge-ui-official/core";
import { RefChrome } from "@/components/reference/ref-chrome";
import { siteConfig } from "@/config/site";
import { REF_PAGES } from "@/lib/reference/catalog";

const meta = REF_PAGES.find((p) => p.slug === "task")!;

const task = {
  name: "Homepage Wireframe",
  client: "Shieldfy Inc.",
  status: "In Progress",
  dueDate: "12 Aug 2026",
  priority: "High" as const,
  progress: 62,
  members: [
    "https://api.dicebear.com/9.x/thumbs/svg?seed=m1",
    "https://api.dicebear.com/9.x/thumbs/svg?seed=m2",
    "https://api.dicebear.com/9.x/thumbs/svg?seed=m3",
  ],
};

const checklist = [
  { id: "wireframe", label: "Wireframe", done: true },
  { id: "moodboard", label: "Moodboard", done: true },
  { id: "prototype", label: "Prototype", done: false },
  { id: "review", label: "Stakeholder review", done: false },
];

const activities = [
  { title: "Status updated", body: "Moved from To Do → In Progress", time: "今天 10:12" },
  { title: "Comment", body: "Jay Parker left feedback on hero section spacing.", time: "昨天 16:40" },
  { title: "Attachment", body: "Uploaded wireframe-v2.fig", time: "昨天 11:05" },
];

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
      <div className="text-sm text-fg-grey-700">{label}</div>
      <div className="mt-1 text-base text-fg-black">{value}</div>
    </div>
  );
}

export default function RefTaskPage() {
  return (
    <RefChrome meta={meta}>
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button color="grey" variant="tertiary" iconLeft={<UserPlusLinear size={18} />}>
          Add Member
        </Button>
        <Button color={siteConfig.accent} iconLeft={<Pen2Linear size={18} />}>
          Edit
        </Button>
      </div>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="flex flex-col gap-6">
          <Panel title="General Information">
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-fg-violet-100 text-lg font-semibold text-fg-violet">
                HW
              </div>
              <div>
                <h2 className="text-xl font-semibold text-fg-black">{task.name}</h2>
                <p className="text-sm text-fg-grey-700">{task.client}</p>
              </div>
            </div>
            <Info label="Status" value={task.status} />
            <Info label="Due Date" value={task.dueDate} />
            <Info label="Priority" value={task.priority} />
          </Panel>

          <Panel
            title="Members"
            action={
              <Button color="grey" variant="tertiary" size="sm">
                <AddCircleLinear size={18} />
              </Button>
            }
          >
            <AvatarGroup overflowCount={2}>
              {task.members.map((src) => (
                <Avatar key={src} src={src} size="md" />
              ))}
            </AvatarGroup>
          </Panel>

          <Panel
            title="Attachment"
            action={
              <Button color="grey" variant="tertiary" size="sm">
                <AddCircleLinear size={18} />
              </Button>
            }
          >
            <FileCard file={{ id: "1", name: "wireframe-v2.fig", size: "2.4 MB", state: "uploaded" }} />
            <FileCard file={{ id: "2", name: "spec.pdf", size: "860 KB", state: "uploaded" }} />
          </Panel>
        </aside>

        <main className="flex flex-col gap-6">
          <Panel title="Progress">
            <div className="text-5xl font-semibold text-fg-black">{task.progress}%</div>
            <ProgressBar value={task.progress} color="yellow" />
            <div className="flex flex-wrap gap-2">
              <StatusBadge label={task.priority} color="red" />
              <StatusBadge label={task.status} color="yellow" />
            </div>
          </Panel>

          <Panel title="Description">
            <p className="text-sm leading-7 text-fg-grey-700">
              Define homepage information architecture, key modules, and responsive breakpoints before
              visual design. Align with CRM lead capture CTA and product hero variants.
            </p>
          </Panel>

          <Panel title="Checklist">
            <Checklist color={siteConfig.accent} defaultTasks={checklist} />
          </Panel>

          <Panel title="Activity">
            {activities.map((item) => (
              <div key={item.title + item.time} className="border-b border-fg-grey-100 py-3 last:border-0">
                <div className="flex items-start justify-between gap-3">
                  <h4 className="text-sm font-semibold text-fg-black">{item.title}</h4>
                  <span className="shrink-0 text-xs text-fg-grey-500">{item.time}</span>
                </div>
                <p className="mt-1 text-sm text-fg-grey-700">{item.body}</p>
              </div>
            ))}
          </Panel>
        </main>
      </section>
    </RefChrome>
  );
}
