"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  MagniferLinear,
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
  ConfirmationDialog,
  DataTable,
  IconButton,
  PlusIcon,
  StatusBadge,
  TextField,
  type ColumnDef,
} from "@forge-ui-official/core";
import { siteConfig } from "@/config/site";
import { useDemoStore } from "@/components/demo-store";
import { AccountCreateDialog } from "@/components/account-create-dialog";
import {
  ACCOUNT_STATUS_META,
  type AccountStatus,
  type AdminAccount,
} from "@/lib/demo/accounts";

const filterTabs = [
  { label: "全部" },
  { label: "启用" },
  { label: "停用" },
  { label: "待激活" },
  { label: "锁定" },
];
const filterValues = ["all", "active", "disabled", "pending", "locked"] as const;

function AccountsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { accounts, deleteAccount, countsByStatus } = useDemoStore();
  const [activeFilterIndex, setActiveFilterIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const [deleteTarget, setDeleteTarget] = useState<AdminAccount | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get("create") === "1") {
      setCreateOpen(true);
      router.replace("/accounts/", { scroll: false });
    }
  }, [searchParams, router]);

  const filtered = useMemo(() => {
    const statusKey = filterValues[activeFilterIndex];
    const q = search.trim().toLowerCase();
    return accounts.filter((a) => {
      if (statusKey !== "all" && a.status !== statusKey) return false;
      if (!q) return true;
      return (
        a.name.toLowerCase().includes(q)
        || a.username.toLowerCase().includes(q)
        || a.email.toLowerCase().includes(q)
        || a.phone.replace(/\s/g, "").includes(q.replace(/\s/g, ""))
        || a.department.toLowerCase().includes(q)
        || a.role.toLowerCase().includes(q)
      );
    });
  }, [accounts, activeFilterIndex, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  useEffect(() => {
    setCurrentPage(1);
  }, [search, activeFilterIndex]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const pageRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage]);

  const columns: ColumnDef<AdminAccount>[] = useMemo(
    () => [
      {
        key: "name",
        header: "账号",
        sortable: true,
        width: "w-60",
        render: (row) => (
          <button
            type="button"
            className="text-left"
            onClick={() => router.push(`/accounts/${row.id}/`)}
          >
            <CellImageText
              src={row.avatarUrl}
              title={row.name}
              subtitle={row.email}
              rounded="full"
            />
          </button>
        ),
      },
      {
        key: "phone",
        header: "手机",
        width: "w-40",
        render: (row) => <CellMuted>{row.phone}</CellMuted>,
      },
      {
        key: "role",
        header: "角色",
        sortable: true,
        width: "w-32",
        render: (row) => <CellText>{row.role}</CellText>,
      },
      {
        key: "department",
        header: "部门",
        width: "w-28",
        render: (row) => <CellMuted>{row.department}</CellMuted>,
      },
      {
        key: "loginCount",
        header: "登录次数",
        sortable: true,
        width: "w-28",
        render: (row) => <CellText>{row.loginCount.toLocaleString()}</CellText>,
      },
      {
        key: "status",
        header: "状态",
        sortable: true,
        width: "w-28",
        render: (row) => {
          const meta = ACCOUNT_STATUS_META[row.status as AccountStatus];
          return <StatusBadge label={meta.label} color={meta.color} />;
        },
      },
      {
        key: "created",
        header: "创建",
        width: "w-32",
        render: (row) => <CellMuted>{row.created}</CellMuted>,
      },
      {
        key: "actions",
        header: "操作",
        width: "w-24",
        render: (row) => (
          <div className="flex h-10 items-center justify-end gap-2">
            <IconButton
              variant="ghost"
              shape="square"
              size="sm"
              aria-label="编辑"
              onClick={() => router.push(`/accounts/${row.id}/edit/`)}
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
      <AccountCreateDialog open={createOpen} onClose={() => setCreateOpen(false)} />

      {deleteTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <ConfirmationDialog
            title="删除账号？"
            description={`确定删除「${deleteTarget.name}」？此操作不可撤销（演示数据，刷新页面会恢复种子数据）。`}
            color="red"
            icon={<TrashBinMinimalisticLinear size={32} color="#EA580C" />}
            confirmLabel="删除"
            cancelLabel="取消"
            onCancel={() => setDeleteTarget(null)}
            onConfirm={() => {
              deleteAccount(deleteTarget.id);
              setDeleteTarget(null);
            }}
          />
        </div>
      ) : null}

      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-display-l font-semibold leading-9 tracking-fg text-fg-black">
            账号管理
          </h1>
          <Breadcrumbs
            color={siteConfig.accent}
            items={[
              { label: "工作台", href: "/dashboard/" },
              { label: "账号管理" },
            ]}
          />
          <p className="mt-1 text-xs text-fg-grey-500">
            演示数据：仅保存在当前浏览器内存，刷新页面会恢复初始种子账号。
          </p>
        </div>
        <Button
          color={siteConfig.accent}
          iconLeft={<PlusIcon size={16} />}
          onClick={() => setCreateOpen(true)}
        >
          新建账号
        </Button>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <ButtonGroup
          color={siteConfig.accent}
          shape="pill"
          items={filterTabs.map((tab, index) => ({
            label:
              index === 0
                ? `全部 ${countsByStatus.all}`
                : `${tab.label} ${countsByStatus[filterValues[index]] ?? 0}`,
          }))}
          activeIndex={activeFilterIndex}
          onChange={(index) => {
            setActiveFilterIndex(index);
          }}
        />
        <div className="w-full max-w-sm">
          <TextField
            color={siteConfig.accent}
            value={search}
            onChange={setSearch}
            placeholder="搜索姓名、用户名、邮箱、手机…"
            iconLeft={<MagniferLinear size={16} />}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-[28px] border border-dashed border-fg-grey-200 bg-white py-16">
          <p className="text-lg font-semibold text-fg-black">
            {accounts.length === 0 ? "暂无账号" : "无匹配结果"}
          </p>
          <p className="text-sm text-fg-grey-500">
            {accounts.length === 0
              ? "点击下方按钮创建第一个演示账号。"
              : "试试清空搜索或切换状态筛选。"}
          </p>
          {accounts.length === 0 ? (
            <Button color={siteConfig.accent} onClick={() => setCreateOpen(true)}>
              新建账号
            </Button>
          ) : (
            <Button
              color={siteConfig.accent}
              variant="tertiary"
              onClick={() => {
                setSearch("");
                setActiveFilterIndex(0);
              }}
            >
              清除筛选
            </Button>
          )}
        </div>
      ) : (
        <DataTable<AdminAccount>
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

export default function AccountsPage() {
  return (
    <Suspense fallback={<div className="py-10 text-sm text-fg-grey-500">加载账号列表…</div>}>
      <AccountsPageContent />
    </Suspense>
  );
}
