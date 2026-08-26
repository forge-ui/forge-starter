"use client";

/**
 * OA 审批列表 — collection + 发起/详情弹窗
 * 字段少：详情不进全页，弹窗查看与审批
 */

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DocumentAddBoldDuotone, MagniferLinear } from "solar-icon-set";
import {
  Breadcrumbs,
  Button,
  ButtonGroup,
  CellText,
  DataTable,
  PlusIcon,
  TextField,
  type ColumnDef,
} from "@forge-ui-official/core";
import { StatusText } from "@/components/ui/status-text";
import { siteConfig } from "@/config/site";
import { ApprovalDetailDialog } from "@/components/approval-detail-dialog";
import { ApprovalFormDialog } from "@/components/approval-form-dialog";
import { useApprovalsStore } from "@/components/approvals-store";
import {
  APPROVAL_STATUS_META,
  APPROVAL_TYPE_META,
  type ApprovalRequest,
  type ApprovalStatus,
  type ApprovalType,
} from "@/lib/approvals/types";

const filterTabs = [
  { label: "全部", value: "all" as const },
  { label: "待我审批", value: "todo" as const },
  { label: "我发起的", value: "mine" as const },
  { label: "已通过", value: "approved" as const },
  { label: "已驳回", value: "rejected" as const },
];

function ApprovalsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, me, loading, error, refresh, counts } = useApprovalsStore();
  const [filterIndex, setFilterIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const pageSize = 8;

  useEffect(() => {
    const create = searchParams.get("create") === "1";
    const id = searchParams.get("id");
    if (create) {
      setCreateOpen(true);
      router.replace("/approvals/", { scroll: false });
      return;
    }
    if (id) {
      setDetailId(id);
      router.replace("/approvals/", { scroll: false });
    }
  }, [searchParams, router]);

  useEffect(() => {
    void refresh("all");
  }, [refresh]);

  const filtered = useMemo(() => {
    const key = filterTabs[filterIndex]?.value ?? "all";
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      if (key === "todo") {
        if (item.status !== "pending" || !me || item.applicantUsername === me) return false;
      } else if (key === "mine") {
        if (!me || item.applicantUsername !== me) return false;
      } else if (key === "approved" || key === "rejected") {
        if (item.status !== key) return false;
      }
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q)
        || item.applicantName.toLowerCase().includes(q)
        || APPROVAL_TYPE_META[item.type].label.includes(q)
      );
    });
  }, [items, filterIndex, search, me]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterIndex]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const pageRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage]);

  const filterLabels = useMemo(
    () =>
      filterTabs.map((tab) => {
        if (tab.value === "all") return `全部 ${counts.all ?? 0}`;
        if (tab.value === "todo") return `待我审批 ${counts.todo ?? 0}`;
        if (tab.value === "mine") return `我发起的 ${counts.mine ?? 0}`;
        if (tab.value === "approved") return `已通过 ${counts.approved ?? 0}`;
        return `已驳回 ${counts.rejected ?? 0}`;
      }),
    [counts],
  );

  const columns: ColumnDef<ApprovalRequest>[] = useMemo(
    () => [
      {
        key: "title",
        header: "标题",
        flex: true,
        sortable: true,
        render: (row) => (
          <button
            type="button"
            className="flex h-10 min-w-0 flex-col justify-center text-left"
            onClick={() => setDetailId(row.id)}
          >
            <span className="truncate text-sm font-semibold text-fg-black">{row.title}</span>
            <span className="truncate text-xs text-fg-grey-500">
              {row.applicantName} · {row.created}
            </span>
          </button>
        ),
      },
      {
        key: "type",
        header: "类型",
        width: "w-28",
        render: (row) => (
          <CellText>{APPROVAL_TYPE_META[row.type as ApprovalType].label}</CellText>
        ),
      },
      {
        key: "status",
        header: "状态",
        width: "w-28",
        render: (row) => (
          <div className="flex h-10 items-center">
            <StatusText
              label={APPROVAL_STATUS_META[row.status as ApprovalStatus].label}
              color={APPROVAL_STATUS_META[row.status as ApprovalStatus].color}
            />
          </div>
        ),
      },
      {
        key: "decided",
        header: "处理时间",
        width: "w-40",
        render: (row) => (
          <div className="flex h-10 items-center text-sm text-fg-grey-700">
            {row.decidedAt}
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <div className="flex flex-col gap-6">
      <ApprovalFormDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={(item) => {
          setCreateOpen(false);
          setDetailId(item.id);
        }}
      />
      <ApprovalDetailDialog
        open={detailId != null}
        approvalId={detailId}
        onClose={() => setDetailId(null)}
      />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-display-l font-semibold leading-9 tracking-fg text-fg-black">
            审批中心
          </h1>
          <Breadcrumbs
            color={siteConfig.accent}
            items={[
              { label: "工作台", href: "/dashboard/" },
              { label: "审批中心" },
            ]}
          />
        </div>
        <Button
          color={siteConfig.accent}
          iconLeft={<PlusIcon size={16} />}
          onClick={() => setCreateOpen(true)}
        >
          发起审批
        </Button>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <ButtonGroup
          color={siteConfig.accent}
          shape="pill"
          items={filterLabels.map((label) => ({ label }))}
          activeIndex={filterIndex}
          onChange={setFilterIndex}
        />
        <div className="w-full max-w-sm">
          <TextField
            color={siteConfig.accent}
            value={search}
            onChange={setSearch}
            placeholder="搜索标题、申请人、类型…"
            iconLeft={<MagniferLinear size={16} />}
          />
        </div>
      </div>

      {error ? (
        <div className="rounded-[28px] border border-dashed border-fg-grey-200 bg-white py-16 text-center">
          <p className="text-lg font-semibold text-fg-black">无法加载审批</p>
          <p className="mt-2 text-sm text-fg-grey-500">{error}</p>
          <Button className="mt-4" color={siteConfig.accent} onClick={() => void refresh()}>
            重试
          </Button>
        </div>
      ) : loading ? (
        <div className="rounded-[28px] border border-fg-grey-200 bg-white py-16 text-center text-sm text-fg-grey-500">
          加载中…
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-[28px] border border-dashed border-fg-grey-200 bg-white py-16">
          <DocumentAddBoldDuotone size={40} color="#A1A1AA" />
          <p className="text-lg font-semibold text-fg-black">暂无审批单</p>
          <p className="text-sm text-fg-grey-500">
            {me
              ? "可发起请假、报销、采购、加班或通用审批；审批需由其他账号处理。"
              : "登录后发起审批。"}
          </p>
          <Button color={siteConfig.accent} onClick={() => setCreateOpen(true)}>
            发起审批
          </Button>
        </div>
      ) : (
        <DataTable<ApprovalRequest>
          color={siteConfig.accent}
          columns={columns}
          rows={pageRows}
          getRowKey={(row) => row.id}
          showPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          paginationLabel={`显示 ${pageRows.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, filtered.length)} / 共 ${filtered.length} 条`}
        />
      )}
    </div>
  );
}

export default function ApprovalsPage() {
  return (
    <Suspense fallback={<div className="py-10 text-sm text-fg-grey-500">加载审批中心…</div>}>
      <ApprovalsPageContent />
    </Suspense>
  );
}
