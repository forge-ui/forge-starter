"use client";

import { useMemo, useState } from "react";
import {
  BoxLinear,
  FolderLinear,
  MagniferLinear,
  WidgetLinear,
} from "solar-icon-set";
import {
  Breadcrumbs,
  Button,
  ButtonGroup,
  KebabMenu,
  PlusIcon,
  TextField,
} from "@forge-ui-official/core";
import { RefChrome } from "@/components/reference/ref-chrome";
import { ResourceCard } from "@/components/resource-card";
import {
  FolderNav,
  WorkspaceSplit,
  type WorkspaceFolder,
} from "@/components/workspace-split";
import { siteConfig } from "@/config/site";
import { formatDateOnly } from "@/lib/format/datetime";
import { REF_PAGES } from "@/lib/reference/catalog";
import { toast } from "@/lib/toast";

const meta = REF_PAGES.find((p) => p.slug === "resource-workspace")!;

const FOLDERS: WorkspaceFolder[] = [
  { id: "default", name: "默认", locked: true },
  { id: "prod", name: "生产资源" },
  { id: "sandbox", name: "沙箱" },
  { id: "archive", name: "归档" },
];

type DemoResource = {
  id: string;
  folderId: string;
  title: string;
  description: string;
  tag: string;
  tagColor: "blue" | "green" | "yellow" | "red" | "grey";
  owner: string;
  updated: string;
  kind: "box" | "widget" | "folder";
};

const RESOURCES: DemoResource[] = [
  {
    id: "r1",
    folderId: "default",
    title: "客服问答 Agent",
    description: "对接知识库的简单问答，适合一线支持场景。",
    tag: "已发布",
    tagColor: "green",
    owner: "Alice",
    updated: "2026-08-01T10:00:00Z",
    kind: "widget",
  },
  {
    id: "r2",
    folderId: "default",
    title: "产品手册库",
    description: "上传 PDF / 网页抓取，供检索与引用。",
    tag: "知识库",
    tagColor: "blue",
    owner: "Bob",
    updated: "2026-08-03T14:20:00Z",
    kind: "folder",
  },
  {
    id: "r3",
    folderId: "prod",
    title: "订单查询工具",
    description: "脚本工具：按订单号拉状态，可挂到工作流。",
    tag: "工具",
    tagColor: "yellow",
    owner: "Carol",
    updated: "2026-08-04T09:10:00Z",
    kind: "box",
  },
  {
    id: "r4",
    folderId: "prod",
    title: "发票解析 Agent",
    description: "多节点工作流：OCR → 校验 → 写入台账。",
    tag: "未发布",
    tagColor: "grey",
    owner: "Alice",
    updated: "2026-08-05T16:40:00Z",
    kind: "widget",
  },
  {
    id: "r5",
    folderId: "sandbox",
    title: "实验用向量模型",
    description: "沙箱接入，仅供 embedding 调试。",
    tag: "模型",
    tagColor: "blue",
    owner: "Dev",
    updated: "2026-08-06T08:00:00Z",
    kind: "box",
  },
  {
    id: "r6",
    folderId: "sandbox",
    title: "草稿工作流",
    description: "未发布草稿，可随时删除。",
    tag: "草稿",
    tagColor: "grey",
    owner: "Dev",
    updated: "2026-07-28T11:00:00Z",
    kind: "widget",
  },
];

const filters = [
  { label: "全部", value: "all" },
  { label: "已发布", value: "已发布" },
  { label: "工具", value: "工具" },
  { label: "草稿", value: "草稿" },
];

function ResourceIcon({ kind }: { kind: DemoResource["kind"] }) {
  if (kind === "folder") return <FolderLinear size={20} />;
  if (kind === "box") return <BoxLinear size={20} />;
  return <WidgetLinear size={20} />;
}

export default function RefResourceWorkspacePage() {
  const [folderId, setFolderId] = useState("default");
  const [filterIndex, setFilterIndex] = useState(0);
  const [search, setSearch] = useState("");

  const folderName =
    FOLDERS.find((f) => f.id === folderId)?.name ?? "资源";

  const filtered = useMemo(() => {
    const tag = filters[filterIndex]?.value ?? "all";
    const q = search.trim().toLowerCase();
    return RESOURCES.filter((row) => {
      if (row.folderId !== folderId) return false;
      if (tag !== "all" && row.tag !== tag) return false;
      if (!q) return true;
      return (
        row.title.toLowerCase().includes(q) ||
        row.description.toLowerCase().includes(q) ||
        row.owner.toLowerCase().includes(q)
      );
    });
  }, [folderId, filterIndex, search]);

  return (
    <RefChrome meta={meta}>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-fg-black">资源工作台</h2>
          <Breadcrumbs
            color={siteConfig.accent}
            items={[
              { label: "参考索引", href: "/ref/" },
              { label: "资源工作台" },
              { label: folderName },
            ]}
          />
        </div>
        <div className="flex items-center gap-2">
          <KebabMenu
            accent={siteConfig.accent}
            items={[
              {
                label: "新建 Agent",
                onSelect: () => toast.info("示意：新建 Agent"),
              },
              {
                label: "新建知识库",
                onSelect: () => toast.info("示意：新建知识库"),
              },
              {
                label: "新建工具",
                onSelect: () => toast.info("示意：新建工具"),
              },
            ]}
          />
          <Button
            color={siteConfig.accent}
            iconLeft={<PlusIcon size={16} />}
            onClick={() => toast.success("示意：创建成功（全局 toast）")}
          >
            新建资源
          </Button>
        </div>
      </div>

      <WorkspaceSplit
        leftTitle="文件夹"
        left={
          <FolderNav
            folders={FOLDERS}
            activeId={folderId}
            onSelect={setFolderId}
            onEdit={(f) => toast.info(`示意：重命名「${f.name}」`)}
            onDelete={(f) => toast.info(`示意：删除「${f.name}」`)}
          />
        }
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <ButtonGroup
              color={siteConfig.accent}
              shape="pill"
              items={filters.map((f) => ({ label: f.label }))}
              activeIndex={filterIndex}
              onChange={setFilterIndex}
            />
            <div className="flex flex-wrap items-center gap-3">
              <div className="w-56">
                <TextField
                  color={siteConfig.accent}
                  value={search}
                  onChange={setSearch}
                  placeholder="搜索名称 / 描述 / 负责人"
                  iconLeft={<MagniferLinear size={16} />}
                />
              </div>
              <span className="text-sm text-fg-grey-600">
                共 {filtered.length} 个
              </span>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="grid place-items-center rounded-2xl border border-dashed border-fg-grey-200 py-20 text-sm text-fg-grey-600">
              此文件夹暂无资源
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((row) => (
                <ResourceCard
                  key={row.id}
                  title={row.title}
                  description={row.description}
                  tag={row.tag}
                  tagColor={row.tagColor}
                  icon={<ResourceIcon kind={row.kind} />}
                  subtitle={`${row.owner} · 更新于 ${formatDateOnly(row.updated)}`}
                  footer={<span>ID {row.id}</span>}
                  onClick={() => toast.info(`示意：打开「${row.title}」`)}
                  actions={
                    <KebabMenu
                      accent={siteConfig.accent}
                      align="right"
                      items={[
                        {
                          label: "打开",
                          onSelect: () =>
                            toast.info(`示意：打开「${row.title}」`),
                        },
                        {
                          label: "删除",
                          danger: true,
                          onSelect: () =>
                            toast.error(`示意：删除「${row.title}」`),
                        },
                      ]}
                    />
                  }
                />
              ))}
            </div>
          )}
        </div>
      </WorkspaceSplit>
    </RefChrome>
  );
}
