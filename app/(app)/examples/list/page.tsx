"use client";

import { useCallback, useMemo, useState, type Key } from "react";
import { useRouter } from "next/navigation";
import {
  DownloadMinimalisticLinear,
  PenLinear,
  TrashBinMinimalisticLinear,
} from "solar-icon-set";
import {
  Breadcrumbs,
  Button,
  ButtonGroup,
  CellImageText,
  CellMuted,
  CellText,
  CellTextSubtitle,
  ConfirmationDialog,
  DataTable,
  IconButton,
  PlusIcon,
  StatusBadge,
  ToolbarDatepicker,
  ToolbarFilterButton,
  type ColumnDef,
  type StatusBadgeColor,
} from "@forge-ui-official/core";
import { siteConfig } from "@/config/site";

type RecordItem = {
  id: string;
  code: string;
  name: string;
  subtitle: string;
  category: string;
  owner: string;
  status: "active" | "draft" | "done" | "blocked";
  updatedDate: string;
  updatedTime: string;
  imageUrl: string;
};

const filterTabs = [
  { label: "全部" },
  { label: "进行中" },
  { label: "草稿" },
  { label: "已完成" },
  { label: "已阻断" },
];

const filterValues = ["all", "active", "draft", "done", "blocked"] as const;

const seed: RecordItem[] = [
  {
    id: "1",
    code: "POL-2012",
    name: "设备准入策略",
    subtitle: "3 条规则",
    category: "策略",
    owner: "张敏",
    status: "active",
    updatedDate: "29 Dec 2025",
    updatedTime: "10:00",
    imageUrl: "https://placehold.co/36x36/dbeafe/1d4ed8?text=P",
  },
  {
    id: "2",
    code: "ALT-2011",
    name: "告警处置流程",
    subtitle: "2 个阶段",
    category: "流程",
    owner: "李强",
    status: "draft",
    updatedDate: "24 Dec 2025",
    updatedTime: "10:00",
    imageUrl: "https://placehold.co/36x36/dbeafe/1d4ed8?text=A",
  },
  {
    id: "3",
    code: "AUD-2002",
    name: "审计导出任务",
    subtitle: "周报",
    category: "审计",
    owner: "王芳",
    status: "done",
    updatedDate: "12 Dec 2025",
    updatedTime: "10:00",
    imageUrl: "https://placehold.co/36x36/dbeafe/1d4ed8?text=R",
  },
  {
    id: "4",
    code: "CHK-1901",
    name: "终端基线检查",
    subtitle: "1 个批次",
    category: "检查",
    owner: "赵磊",
    status: "active",
    updatedDate: "21 Oct 2025",
    updatedTime: "10:00",
    imageUrl: "https://placehold.co/36x36/dbeafe/1d4ed8?text=C",
  },
  {
    id: "5",
    code: "POL-1900",
    name: "零信任网络分段",
    subtitle: "5 条规则",
    category: "策略",
    owner: "张敏",
    status: "blocked",
    updatedDate: "21 Oct 2025",
    updatedTime: "10:00",
    imageUrl: "https://placehold.co/36x36/dbeafe/1d4ed8?text=Z",
  },
  {
    id: "6",
    code: "ALT-1881",
    name: "高危登录复核",
    subtitle: "人工复核",
    category: "流程",
    owner: "李强",
    status: "done",
    updatedDate: "19 Sep 2025",
    updatedTime: "10:00",
    imageUrl: "https://placehold.co/36x36/dbeafe/1d4ed8?text=H",
  },
  {
    id: "7",
    code: "AUD-1643",
    name: "权限变更台账",
    subtitle: "月报",
    category: "审计",
    owner: "王芳",
    status: "draft",
    updatedDate: "19 Sep 2025",
    updatedTime: "10:00",
    imageUrl: "https://placehold.co/36x36/dbeafe/1d4ed8?text=P",
  },
  {
    id: "8",
    code: "CHK-1600",
    name: "补丁合规扫描",
    subtitle: "全量",
    category: "检查",
    owner: "赵磊",
    status: "active",
    updatedDate: "19 Sep 2025",
    updatedTime: "10:00",
    imageUrl: "https://placehold.co/36x36/dbeafe/1d4ed8?text=S",
  },
];

const statusMap: Record<RecordItem["status"], { label: string; color: StatusBadgeColor }> = {
  active: { label: "进行中", color: "blue" },
  draft: { label: "草稿", color: "grey" },
  done: { label: "已完成", color: "green" },
  blocked: { label: "已阻断", color: "red" },
};

function FilterPanel({ close }: { close: () => void }) {
  return (
    <div className="flex w-72 flex-col gap-4 p-4">
      <p className="text-sm font-semibold text-fg-black">筛选条件</p>
      <p className="text-sm text-fg-grey-700">示例面板：可按负责人、分类等扩展真实筛选。</p>
      <div className="flex justify-end gap-2">
        <Button color={siteConfig.accent} variant="tertiary" size="sm" onClick={close}>
          取消
        </Button>
        <Button color={siteConfig.accent} size="sm" onClick={close}>
          应用
        </Button>
      </div>
    </div>
  );
}

export default function ExampleListPage() {
  const router = useRouter();
  const [records, setRecords] = useState(seed);
  const [activeFilterIndex, setActiveFilterIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Set<Key>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<RecordItem | null>(null);

  const filteredList = useMemo(() => {
    const filterValue = filterValues[activeFilterIndex];
    if (filterValue === "all") return records;
    return records.filter((item) => item.status === filterValue);
  }, [records, activeFilterIndex]);

  const totalPages = Math.max(1, Math.ceil(filteredList.length / pageSize));
  const pageRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredList.slice(start, start + pageSize);
  }, [filteredList, currentPage, pageSize]);

  const handleDelete = useCallback((id: string) => {
    setRecords((prev) => prev.filter((item) => item.id !== id));
    setSelectedRowKeys((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const columns: ColumnDef<RecordItem>[] = useMemo(
    () => [
      {
        key: "code",
        header: "编号",
        sortable: true,
        width: "w-28",
        render: (row) => <CellText>{row.code}</CellText>,
      },
      {
        key: "name",
        header: "名称",
        sortable: true,
        width: "w-60",
        render: (row) => (
          <CellImageText src={row.imageUrl} title={row.name} subtitle={row.subtitle} />
        ),
      },
      {
        key: "category",
        header: "分类",
        sortable: true,
        width: "w-28",
        render: (row) => <CellMuted>{row.category}</CellMuted>,
      },
      {
        key: "owner",
        header: "负责人",
        sortable: true,
        width: "w-24",
        render: (row) => <CellText>{row.owner}</CellText>,
      },
      {
        key: "status",
        header: "状态",
        sortable: true,
        width: "w-28",
        render: (row) => {
          const meta = statusMap[row.status];
          return <StatusBadge label={meta.label} color={meta.color} />;
        },
      },
      {
        key: "updated",
        header: "更新时间",
        sortable: true,
        width: "w-32",
        render: (row) => (
          <CellTextSubtitle title={row.updatedDate} subtitle={row.updatedTime} />
        ),
      },
      {
        key: "actions",
        header: "",
        width: "w-16",
        render: (row) => (
          <div className="flex items-center gap-2">
            <IconButton
              variant="ghost"
              shape="square"
              size="sm"
              aria-label="编辑"
              onClick={() => router.push("/examples/form/")}
            >
              <PenLinear size={16} />
            </IconButton>
            <IconButton
              variant="ghost"
              shape="square"
              size="sm"
              aria-label="删除"
              onClick={() => setDeleteTarget(row)}
            >
              <TrashBinMinimalisticLinear size={16} />
            </IconButton>
          </div>
        ),
      },
    ],
    [router],
  );

  return (
    <div className="flex flex-col gap-6">
      {deleteTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <ConfirmationDialog
            title={`删除「${deleteTarget.name}」？`}
            description="删除后无法恢复，仅影响本页示例数据。"
            confirmLabel="删除"
            cancelLabel="取消"
            color="red"
            onConfirm={() => {
              handleDelete(deleteTarget.id);
              setDeleteTarget(null);
            }}
            onCancel={() => setDeleteTarget(null)}
          />
        </div>
      ) : null}

      {/* Page header — mirrors ecommerce products template */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-display-l font-semibold leading-9 tracking-fg text-fg-black">
            业务记录
          </h1>
          <Breadcrumbs
            color={siteConfig.accent}
            items={[
              { label: "工作台", href: "/dashboard/" },
              { label: "业务记录" },
            ]}
          />
        </div>
        <div className="flex items-center gap-3">
          <Button
            color={siteConfig.accent}
            variant="tertiary"
            iconLeft={<DownloadMinimalisticLinear size={16} />}
            onClick={() => undefined}
          >
            导出
          </Button>
          <Button
            color={siteConfig.accent}
            iconLeft={<PlusIcon size={16} />}
            onClick={() => router.push("/examples/form/")}
          >
            新建
          </Button>
        </div>
      </div>

      {/* Filter tabs + toolbar controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <ButtonGroup
          color={siteConfig.accent}
          items={filterTabs}
          activeIndex={activeFilterIndex}
          shape="pill"
          onChange={(index) => {
            setActiveFilterIndex(index);
            setCurrentPage(1);
          }}
        />
        <div className="flex items-center gap-3">
          <ToolbarDatepicker enablePopover accentBg="bg-fg-blue-500" />
          <ToolbarFilterButton panel={(close) => <FilterPanel close={close} />} />
        </div>
      </div>

      <DataTable<RecordItem>
        color={siteConfig.accent}
        columns={columns}
        rows={pageRows}
        showCheckbox
        checkboxColor={siteConfig.accent}
        getRowKey={(row) => row.id}
        selectedRowKeys={selectedRowKeys}
        onSelectedRowKeysChange={setSelectedRowKeys}
        showPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        paginationLabel={`显示 ${pageRows.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, filteredList.length)} / 共 ${filteredList.length} 条`}
      />
    </div>
  );
}
