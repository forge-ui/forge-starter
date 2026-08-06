"use client";

import { useMemo, useState } from "react";
import { MagniferLinear, PenLinear, TrashBinMinimalisticLinear } from "solar-icon-set";
import {
  Button,
  ButtonGroup,
  DataTable,
  IconButton,
  PlusIcon,
  StatusBadge,
  TextField,
  type ColumnDef,
} from "@forge-ui-official/core";
import { RefChrome } from "@/components/reference/ref-chrome";
import { siteConfig } from "@/config/site";
import { REF_PAGES } from "@/lib/reference/catalog";
import {
  REF_RECORDS,
  REF_STATUS_META,
  type RefRecord,
} from "@/lib/reference/mock-data";

const meta = REF_PAGES.find((p) => p.slug === "list-table")!;
const filters = [
  { label: "全部", value: "all" },
  { label: "进行中", value: "active" },
  { label: "待处理", value: "pending" },
  { label: "已关闭", value: "closed" },
];

export default function RefListTablePage() {
  const [filterIndex, setFilterIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filtered = useMemo(() => {
    const key = filters[filterIndex]?.value ?? "all";
    const q = search.trim().toLowerCase();
    return REF_RECORDS.filter((row) => {
      if (key !== "all" && row.status !== key) return false;
      if (!q) return true;
      return (
        row.title.toLowerCase().includes(q)
        || row.owner.toLowerCase().includes(q)
        || row.subtitle.toLowerCase().includes(q)
      );
    });
  }, [filterIndex, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const columns: ColumnDef<RefRecord>[] = useMemo(
    () => [
      {
        key: "title",
        header: "标题",
        flex: true,
        render: (row) => (
          <div className="flex h-10 min-w-0 flex-col justify-center">
            <span className="truncate text-sm font-semibold text-fg-black">{row.title}</span>
            <span className="truncate text-xs text-fg-grey-500">
              {row.subtitle} · {row.owner}
            </span>
          </div>
        ),
      },
      {
        key: "status",
        header: "状态",
        width: "w-28",
        render: (row) => (
          <div className="flex h-10 items-center">
            <StatusBadge
              label={REF_STATUS_META[row.status].label}
              color={REF_STATUS_META[row.status].color}
            />
          </div>
        ),
      },
      {
        key: "amount",
        header: "金额",
        width: "w-32",
        render: (row) => (
          <div className="flex h-10 items-center text-sm text-fg-grey-700">{row.amount}</div>
        ),
      },
      {
        key: "updated",
        header: "更新",
        width: "w-32",
        render: (row) => (
          <div className="flex h-10 items-center text-sm text-fg-grey-500">{row.updated}</div>
        ),
      },
      {
        key: "actions",
        header: "",
        width: "w-24",
        render: () => (
          <div className="flex h-10 items-center justify-end gap-1">
            <IconButton variant="ghost" shape="square" size="sm" aria-label="编辑">
              <PenLinear size={16} />
            </IconButton>
            <IconButton variant="ghost" shape="square" size="sm" aria-label="删除">
              <TrashBinMinimalisticLinear size={16} />
            </IconButton>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <RefChrome meta={meta}>
      <div className="flex justify-end">
        <Button color={siteConfig.accent} iconLeft={<PlusIcon size={16} />}>
          新建（示意）
        </Button>
      </div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <ButtonGroup
          color={siteConfig.accent}
          shape="pill"
          items={filters.map((f) => ({ label: f.label }))}
          activeIndex={filterIndex}
          onChange={(i) => {
            setFilterIndex(i);
            setPage(1);
          }}
        />
        <div className="w-full max-w-sm">
          <TextField
            color={siteConfig.accent}
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="搜索标题、负责人…"
            iconLeft={<MagniferLinear size={16} />}
          />
        </div>
      </div>
      <DataTable<RefRecord>
        color={siteConfig.accent}
        columns={columns}
        rows={rows}
        getRowKey={(row) => row.id}
        showPagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        paginationLabel={`共 ${filtered.length} 条（mock）`}
      />
    </RefChrome>
  );
}
