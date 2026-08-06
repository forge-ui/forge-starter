"use client";

/**
 * File manager — micellaneous-template/files
 * https://www.forgeui.org/templates/micellaneous-template/files
 */

import { useState } from "react";
import { MagniferLinear } from "solar-icon-set";
import {
  Button,
  FileCard,
  FileTypeIcon,
  PlusIcon,
  TextField,
} from "@forge-ui-official/core";
import { RefChrome } from "@/components/reference/ref-chrome";
import { siteConfig } from "@/config/site";
import { REF_PAGES } from "@/lib/reference/catalog";

const meta = REF_PAGES.find((p) => p.slug === "files")!;

const folders = [
  { id: "f1", name: "UI 参考", meta: "8 个文件" },
  { id: "f2", name: "内部项目", meta: "12 个文件" },
  { id: "f3", name: "品牌物料", meta: "5 个文件" },
  { id: "f4", name: "设计系统", meta: "20 个文件" },
];

const files = [
  { id: "1", name: "3rd Meeting MOM.docx", size: "100 KB", state: "success" as const },
  { id: "2", name: "Requirement.fig", size: "2.4 MB", state: "uploaded" as const },
  { id: "3", name: "Banner.ai", size: "4.1 MB", state: "uploaded" as const },
  { id: "4", name: "CTA Promo.gif", size: "800 KB", state: "success" as const },
  { id: "5", name: "Pitch Deck.pptx", size: "6.2 MB", state: "uploading" as const },
  { id: "6", name: "Photo Material.zip", size: "18 MB", state: "error" as const },
  { id: "7", name: "Logo.png", size: "240 KB", state: "success" as const },
  { id: "8", name: "Brief.pdf", size: "1.1 MB", state: "uploaded" as const },
];

export default function RefFilesPage() {
  const [search, setSearch] = useState("");
  const q = search.trim().toLowerCase();
  const visibleFiles = files.filter((f) => !q || f.name.toLowerCase().includes(q));
  const visibleFolders = folders.filter((f) => !q || f.name.toLowerCase().includes(q));

  return (
    <RefChrome meta={meta}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="w-full max-w-sm">
          <TextField
            color={siteConfig.accent}
            value={search}
            onChange={setSearch}
            placeholder="搜索文件或文件夹…"
            iconLeft={<MagniferLinear size={16} />}
          />
        </div>
        <Button color={siteConfig.accent} iconLeft={<PlusIcon size={16} />}>
          上传文件
        </Button>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-fg-black">文件夹</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {visibleFolders.map((folder) => (
            <button
              key={folder.id}
              type="button"
              className="flex items-center gap-3 rounded-2xl bg-white p-4 text-left outline outline-1 outline-offset-[-1px] outline-fg-grey-200 hover:outline-fg-blue-200"
            >
              <FileTypeIcon fileName={`${folder.name}/`} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-fg-black">{folder.name}</p>
                <p className="text-xs text-fg-grey-500">{folder.meta}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-fg-black">文件</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {visibleFiles.map((file) => (
            <FileCard
              key={file.id}
              file={{
                id: file.id,
                name: file.name,
                size: file.size,
                state: file.state,
              }}
            />
          ))}
        </div>
        {visibleFiles.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-fg-grey-200 bg-white py-12 text-center text-sm text-fg-grey-500">
            无匹配文件
          </p>
        ) : null}
      </section>
    </RefChrome>
  );
}
