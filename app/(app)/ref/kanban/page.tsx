"use client";

/**
 * Kanban board — embedded in project-template/projects/[id] → Task tab
 * (not a standalone forge route; extracted here for AI discovery).
 */

import Link from "next/link";
import { AddCircleLinear } from "solar-icon-set";
import {
  Avatar,
  AvatarGroup,
  Button,
  ProgressBar,
  StatusBadge,
} from "@forge-ui-official/core";
import { RefChrome } from "@/components/reference/ref-chrome";
import { siteConfig } from "@/config/site";
import { REF_PAGES } from "@/lib/reference/catalog";

const meta = REF_PAGES.find((p) => p.slug === "kanban")!;

type BoardTask = {
  id: string;
  name: string;
  blurb: string;
  priority: "High" | "Medium" | "Low";
  progress: number;
  dueDate: string;
  members: string[];
};

const columns: { title: string; tone: "grey" | "yellow" | "green" | "red"; tasks: BoardTask[] }[] = [
  {
    title: "To Do",
    tone: "grey",
    tasks: [
      {
        id: "t1",
        name: "User interview notes",
        blurb: "Synthesize 6 stakeholder interviews into opportunity areas.",
        priority: "Medium",
        progress: 0,
        dueDate: "14 Aug",
        members: [
          "https://api.dicebear.com/9.x/thumbs/svg?seed=k1",
          "https://api.dicebear.com/9.x/thumbs/svg?seed=k2",
        ],
      },
      {
        id: "t2",
        name: "Content inventory",
        blurb: "Audit existing landing modules before redesign.",
        priority: "Low",
        progress: 8,
        dueDate: "16 Aug",
        members: ["https://api.dicebear.com/9.x/thumbs/svg?seed=k3"],
      },
    ],
  },
  {
    title: "In Progress",
    tone: "yellow",
    tasks: [
      {
        id: "t3",
        name: "Homepage Wireframe",
        blurb: "IA + responsive breakpoints for hero and lead CTA.",
        priority: "High",
        progress: 62,
        dueDate: "12 Aug",
        members: [
          "https://api.dicebear.com/9.x/thumbs/svg?seed=k4",
          "https://api.dicebear.com/9.x/thumbs/svg?seed=k5",
          "https://api.dicebear.com/9.x/thumbs/svg?seed=k6",
        ],
      },
      {
        id: "t4",
        name: "Design tokens sync",
        blurb: "Align purple/blue accents with forge kit tokens.",
        priority: "Medium",
        progress: 40,
        dueDate: "13 Aug",
        members: ["https://api.dicebear.com/9.x/thumbs/svg?seed=k7"],
      },
    ],
  },
  {
    title: "Done",
    tone: "green",
    tasks: [
      {
        id: "t5",
        name: "Kickoff deck",
        blurb: "Goals, timeline, and success metrics approved.",
        priority: "Low",
        progress: 100,
        dueDate: "01 Aug",
        members: [
          "https://api.dicebear.com/9.x/thumbs/svg?seed=k8",
          "https://api.dicebear.com/9.x/thumbs/svg?seed=k9",
        ],
      },
    ],
  },
  {
    title: "Blocked",
    tone: "red",
    tasks: [
      {
        id: "t6",
        name: "Legal copy review",
        blurb: "Waiting on counsel for data-processing clause.",
        priority: "High",
        progress: 45,
        dueDate: "10 Aug",
        members: ["https://api.dicebear.com/9.x/thumbs/svg?seed=k10"],
      },
    ],
  },
];

function priorityColor(p: BoardTask["priority"]): "red" | "yellow" | "green" {
  if (p === "High") return "red";
  if (p === "Medium") return "yellow";
  return "green";
}

function progressColor(task: BoardTask): "green" | "red" | "yellow" {
  if (task.progress === 100) return "green";
  if (task.priority === "High") return "red";
  return "yellow";
}

function TaskCard({ task, tone }: { task: BoardTask; tone: "grey" | "yellow" | "green" | "red" }) {
  return (
    <article className="rounded-[24px] border border-fg-grey-200 bg-white p-5">
      <div className="flex items-start justify-between gap-2">
        <StatusBadge label={task.priority} color={priorityColor(task.priority)} />
        <Link
          href="/ref/task/"
          className="text-xs font-medium text-fg-blue hover:underline"
        >
          详情
        </Link>
      </div>
      <Link href="/ref/task/" className="mt-4 block text-left">
        <h4 className="text-base font-semibold text-fg-black">{task.name}</h4>
        <p className="mt-2 text-sm leading-6 text-fg-grey-500">{task.blurb}</p>
      </Link>
      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-fg-grey-500">Progress</span>
          <span
            className={`font-semibold ${
              tone === "red"
                ? "text-fg-red"
                : tone === "green"
                  ? "text-emerald-600"
                  : tone === "yellow"
                    ? "text-amber-600"
                    : "text-fg-grey-600"
            }`}
          >
            {tone === "red" && task.progress < 100 ? "Blocked" : `${task.progress}%`}
          </span>
        </div>
        <ProgressBar value={task.progress || 8} color={progressColor(task)} />
      </div>
      <div className="mt-5 flex items-center justify-between">
        <AvatarGroup>
          {task.members.map((src) => (
            <Avatar key={src} src={src} size="sm" />
          ))}
        </AvatarGroup>
        <span className="text-sm text-fg-grey-500">{task.dueDate}</span>
      </div>
    </article>
  );
}

export default function RefKanbanPage() {
  return (
    <RefChrome meta={meta}>
      <p className="text-sm text-fg-grey-600">
        官方位置：项目详情{" "}
        <Link href="/ref/project/" className="font-medium text-fg-blue hover:underline">
          /ref/project
        </Link>{" "}
        的 <strong>Task</strong> tab 内嵌泳道。本页抽出独立范式，方便 Agent 直接抄 Kanban。
      </p>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {columns.map((group) => (
          <section key={group.title} className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-fg-black">
                {group.title}{" "}
                <span className="text-fg-grey-500">({group.tasks.length})</span>
              </h3>
              <Button color="grey" variant="tertiary" size="sm">
                <AddCircleLinear size={18} />
              </Button>
            </div>
            {group.tasks.map((task) => (
              <TaskCard key={task.id} task={task} tone={group.tone} />
            ))}
          </section>
        ))}
      </div>
    </RefChrome>
  );
}
