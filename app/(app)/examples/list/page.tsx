"use client";

import { useMemo, useState, type Key } from "react";
import { useRouter } from "next/navigation";
import {
  DownloadMinimalisticLinear,
  EyeLinear,
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
} from "@forge-ui-official/core";
import { siteConfig } from "@/config/site";
import { useDemoStore } from "@/components/demo-store";
import {
  RECORD_STATUS_META,
  type BusinessRecord,
  type RecordStatus,
} from "@/lib/demo/records";

const filterTabs = [
  { label: "全部" },
  { label: "进行中" },
  { label: "草稿" },
  { label: "已完成" },
  { label: "已阻断" },
];

const filterValues = ["all", "active", "draft", "done", "blocked"] as const;

function FilterPanel({ close }: { close: () => void }) {
  return (
    <div className="flex w-72 flex-col gap-4 p-4">
      <p className="text-sm font-semibold text-fg-black">筛选条件</p>
      <p className="text-sm text-fg-grey-700">示例：可扩展负责人、分类等真实筛选字段。</p>
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
  const { records, deleteRecord, countsByStatus } = useDemoStore();
  const [activeFilterIndex, setActiveFilterIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Set<Key>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<BusinessRecord | null>(null);

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

  const columns: ColumnDef<BusinessRecord>[] = useMemo(
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
          <button
            type="button"
            className="text-left"
            onClick={() => router.push(`/examples/detail/?id=${row.id}`)}
          >
            <CellImageText src={row.imageUrl} title={row.name} subtitle={row.subtitle} />
          </button>
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
          const meta = RECORD_STATUS_META[row.status as RecordStatus];
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
        width: "w-24",
        render: (row) => (
          <div className="flex items-center gap-1">
            <IconButton
              variant="ghost"
              shape="square"
              size="sm"
              aria-label="查看"
              onClick={() => router.push(`/examples/detail/?id=${row.id}`)}
            >
              <EyeLinear size={16} />
            </IconButton>
            <IconButton
              variant="ghost"
              shape="square"
              size="sm"
              aria-label="编辑"
              onClick={() => router.push(`/examples/form/?id=${row.id}`)}
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

  const empty = filteredList.length === 0;

  return (
    <div className="flex flex-col gap-6">
      {deleteTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <ConfirmationDialog
            title={`删除「${deleteTarget.name}」？`}
            description="将从演示数据中移除，可重新新建。此操作会影响工作台统计。"
            confirmLabel="删除"
            cancelLabel="取消"
            color="red"
            onConfirm={() => {
              deleteRecord(deleteTarget.id);
              setDeleteTarget(null);
              setSelectedRowKeys((prev) => {
                const next = new Set(prev);
                next.delete(deleteTarget.id);
                return next;
              });
            }}
            onCancel={() => setDeleteTarget(null)}
          />
        </div>
      ) : null}

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

      <div className="flex flex-wrap items-center justify-between gap-4">
        <ButtonGroup
          color={siteConfig.accent}
          items={filterTabs.map((tab, index) => ({
            label:
              index === 0
                ? `全部 ${countsByStatus.all}`
                : `${tab.label} ${countsByStatus[filterValues[index]] ?? 0}`,
          }))}
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

      {empty ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-[28px] border border-dashed border-fg-grey-200 bg-white px-6 py-16 text-center">
          <p className="text-lg font-semibold text-fg-black">暂无记录</p>
          <p className="max-w-md text-sm text-fg-grey-700">
            当前筛选条件下没有数据。可以切换状态 Tab，或新建一条业务记录。
          </p>
          <Button color={siteConfig.accent} onClick={() => router.push("/examples/form/")}>
            新建记录
          </Button>
        </div>
      ) : (
        <DataTable<BusinessRecord>
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
      )}
    </div>
  );
}
