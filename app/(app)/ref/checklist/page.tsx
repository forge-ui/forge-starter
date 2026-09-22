"use client";

/**
 * Checklist gallery — https://www.forgeui.org/cases/checklist
 */

import { Checklist, ChecklistItem } from "@forge-ui-official/core";
import { RefChrome } from "@/components/reference/ref-chrome";
import { siteConfig } from "@/config/site";
import { REF_PAGES } from "@/lib/reference/catalog";

const meta = REF_PAGES.find((page) => page.slug === "checklist")!;

const ONBOARDING = [
  { id: "vendor", label: "Review vendor contacts", done: true },
  { id: "certs", label: "Confirm cold-chain certificates" },
  { id: "windows", label: "Publish weekend freezer windows" },
  { id: "reorder", label: "Send Cone King reorder" },
];

const SETUP = [
  { id: "profile", label: "Add a shop display name" },
  { id: "hours", label: "Set weekend opening hours" },
  { id: "pos", label: "Connect the POS export" },
];

function ChecklistSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-fg-black">{title}</h2>
        <p className="text-sm text-fg-grey-700">{description}</p>
      </div>
      {children}
    </section>
  );
}

export default function RefChecklistPage() {
  return (
    <RefChrome meta={meta}>
      <div className="flex flex-col gap-10">
        <ChecklistSection title="Complete to bottom" description="点未完成行，等划线结束后沉底。">
          <Checklist color={siteConfig.accent} defaultTasks={ONBOARDING} />
        </ChecklistSection>

        <ChecklistSection title="Sizes" description="sm 更紧，适合设置页侧栏。">
          <Checklist color={siteConfig.accent} size="sm" defaultTasks={SETUP} />
        </ChecklistSection>

        <ChecklistSection title="Color" description="勾选色与 Checkbox 对齐，业务页用 siteConfig.accent。">
          <Checklist color={siteConfig.accent} defaultTasks={SETUP} />
        </ChecklistSection>

        <ChecklistSection title="ChecklistItem" description="单独一行，不重排。">
          <div className="flex flex-col gap-2">
            <ChecklistItem color={siteConfig.accent} label="Draft the pistachio weekend note" />
            <ChecklistItem color={siteConfig.accent} label="Already sent" defaultChecked />
          </div>
        </ChecklistSection>
      </div>
    </RefChrome>
  );
}
