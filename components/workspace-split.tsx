"use client";

import type { ReactNode } from "react";
import { KebabMenu } from "@forge-ui-official/core";
import { PenLinear, TrashBinMinimalisticLinear } from "solar-icon-set";
import { siteConfig } from "@/config/site";

export type WorkspaceFolder = {
  id: string;
  name: string;
  locked?: boolean;
};

/**
 * Left folder rail + main content — resource workspace shell
 * (models / tools / knowledge style), not master-detail row preview.
 */
export function WorkspaceSplit({
  leftTitle,
  left,
  children,
  leftWidthClassName = "w-[240px]",
}: {
  leftTitle: string;
  left: ReactNode;
  children: ReactNode;
  leftWidthClassName?: string;
}) {
  return (
    <div className="flex min-h-[calc(100vh-48px)] gap-0 overflow-hidden rounded-2xl border border-fg-grey-200 bg-white">
      <aside
        className={`flex shrink-0 flex-col border-r border-fg-grey-200 bg-fg-grey-50/60 ${leftWidthClassName}`}
      >
        <div className="px-4 pb-2 pt-4 text-sm font-semibold text-fg-black">
          {leftTitle}
        </div>
        <div className="flex-1 overflow-auto px-2 pb-4">{left}</div>
      </aside>
      <section className="min-w-0 flex-1 overflow-auto p-5">{children}</section>
    </div>
  );
}

/**
 * Folder list for WorkspaceSplit left rail.
 */
export function FolderNav({
  folders,
  activeId,
  onSelect,
  onEdit,
  onDelete,
}: {
  folders: WorkspaceFolder[];
  activeId: string;
  onSelect: (id: string) => void;
  onEdit?: (folder: WorkspaceFolder) => void;
  onDelete?: (folder: WorkspaceFolder) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      {folders.map((folder) => {
        const active = folder.id === activeId;
        return (
          <div
            key={folder.id}
            className={`flex items-center rounded-xl pr-1 transition ${
              active ? "bg-fg-blue-50" : "hover:bg-white"
            }`}
          >
            <button
              type="button"
              onClick={() => onSelect(folder.id)}
              className={`flex min-w-0 flex-1 items-center gap-2 rounded-xl px-3 py-2 text-left text-sm ${
                active
                  ? "font-medium text-fg-blue-700"
                  : "text-fg-grey-800"
              }`}
            >
              <span
                className={`inline-block h-2 w-2 rounded-full ${
                  active ? "bg-fg-blue-600" : "bg-fg-grey-300"
                }`}
              />
              <span className="truncate">{folder.name}</span>
            </button>
            {!folder.locked && (onEdit || onDelete) ? (
              <KebabMenu
                accent={siteConfig.accent}
                align="right"
                items={[
                  ...(onEdit
                    ? [
                        {
                          label: "重命名",
                          icon: <PenLinear size={15} />,
                          onSelect: () => onEdit(folder),
                        },
                      ]
                    : []),
                  ...(onDelete
                    ? [
                        {
                          label: "删除",
                          icon: <TrashBinMinimalisticLinear size={15} />,
                          danger: true,
                          onSelect: () => onDelete(folder),
                        },
                      ]
                    : []),
                ]}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
