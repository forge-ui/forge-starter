"use client";

import { useMemo, useState } from "react";
import {
  CellActions,
  CellText,
  DataTable,
  StatusBadge,
  SurfaceCard,
  TextField,
  type ColumnDef,
  type StatusBadgeColor,
} from "@forge-ui-official/core";

type ExampleRow = {
  id: string;
  name: string;
  owner: string;
  status: "draft" | "active" | "done";
  updatedAt: string;
};

const seed: ExampleRow[] = [
  { id: "rec-001", name: "设备准入策略", owner: "张敏", status: "active", updatedAt: "今天" },
  { id: "rec-002", name: "告警处置流程", owner: "李强", status: "draft", updatedAt: "昨天" },
  { id: "rec-003", name: "审计导出任务", owner: "王芳", status: "done", updatedAt: "本周" },
  { id: "rec-004", name: "终端基线检查", owner: "赵磊", status: "active", updatedAt: "刚刚" },
];

function statusColor(status: ExampleRow["status"]): StatusBadgeColor {
  if (status === "done") return "green";
  if (status === "draft") return "yellow";
  return "purple";
}

function statusLabel(status: ExampleRow["status"]) {
  if (status === "done") return "已完成";
  if (status === "draft") return "草稿";
  return "进行中";
}

export default function ExampleListPage() {
  const [query, setQuery] = useState("");
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return seed;
    return seed.filter(
      (row) =>
        row.name.toLowerCase().includes(q)
        || row.owner.toLowerCase().includes(q)
        || row.id.toLowerCase().includes(q),
    );
  }, [query]);

  const columns: ColumnDef<ExampleRow>[] = [
    {
      key: "name",
      header: "名称",
      flex: true,
      render: (row) => <CellText>{row.name}</CellText>,
    },
    {
      key: "id",
      header: "编号",
      width: "w-[120px]",
      render: (row) => <CellText>{row.id}</CellText>,
    },
    {
      key: "owner",
      header: "负责人",
      width: "w-[120px]",
      render: (row) => <CellText>{row.owner}</CellText>,
    },
    {
      key: "status",
      header: "状态",
      width: "w-[120px]",
      render: (row) => <StatusBadge label={statusLabel(row.status)} color={statusColor(row.status)} />,
    },
    {
      key: "updatedAt",
      header: "更新",
      width: "w-[100px]",
      render: (row) => <CellText>{row.updatedAt}</CellText>,
    },
    {
      key: "actions",
      header: "",
      width: "w-[72px]",
      render: () => <CellActions actions={["eye", "pen"]} />,
    },
  ];

  return (
    <SurfaceCard className="p-5">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-fg-black">业务记录</h2>
        <p className="mt-1 text-sm text-fg-grey-700">
          列表范式：Toolbar 搜索 + DataTable。点 Header「新建记录」进入表单范例。
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <div className="max-w-sm">
          <TextField
            label="搜索"
            placeholder="名称、负责人、编号…"
            value={query}
            onChange={setQuery}
          />
        </div>
        <DataTable
          columns={columns}
          rows={rows}
          showCheckbox
          showPagination
          currentPage={1}
          totalPages={1}
          paginationLabel={`共 ${rows.length} 条示例数据`}
        />
      </div>
    </SurfaceCard>
  );
}
