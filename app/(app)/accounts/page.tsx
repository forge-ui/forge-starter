"use client";

import { Modal } from "@/components/ui/modal";

import { useSemanticPage } from "@/components/semantic-page";
import { matchesAccount } from "@/lib/accounts/filter";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
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
import { toast } from "@/lib/toast";
import { siteConfig } from "@/config/site";
import { useAccountsStore } from "@/components/accounts-store";
import { PageTitleActions } from "@/components/ask-ai-entry";
import { AccountFormDialog } from "@/components/account-form-dialog";
import {
  abandonAgentContinuation,
  AGENT_PAGE_CANCEL_EVENT,
  notifyAgentPageDone,
  readContinuation,
  requestAgentOperationCancellation,
  type AgentPageCancellation,
} from "@/lib/agent/fill";
import type { AgentFormFill } from "@/lib/agent/types";
import {
  ACCOUNT_STATUS_META,
  type AccountStatus,
  type AdminAccount,
} from "@/lib/accounts/types";

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
  const { accounts, loading, error, deleteAccount, countsByStatus, refresh } = useAccountsStore();
  const activeFilterIndex = Math.max(0, filterValues.findIndex((value) => value === searchParams.get("status")));
  const search = searchParams.get("q") ?? "";
  const requestedPage = Number(searchParams.get("page") ?? "1");
  const currentPage = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const updateFilters = useCallback((changes: Record<string, string>) => {
    const next = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    router.replace(`/accounts/${next.size ? `?${next}` : ""}`, { scroll: false });
  }, [router, searchParams]);
  const setSearch = (value: string) => updateFilters({ q: value, page: "" });
  const setActiveFilterIndex = (index: number) => updateFilters({ status: index ? filterValues[index] : "", page: "" });
  const listHref = `/accounts/${searchParams.size ? `?${searchParams}` : ""}`;
  const pageSize = 8;
  const [deleteTarget, setDeleteTarget] = useState<AdminAccount | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formDraft, setFormDraft] = useState<Record<string, string> | null>(null);
  const [agentFill, setAgentFill] = useState<AgentFormFill | null>(null);
  const [agentMode, setAgentMode] = useState<AgentFormFill["mode"] | null>(null);

  const dropAgentChain = useCallback(() => {
    if (agentFill?.operationId) {
      if (readContinuation()?.operationId === agentFill.operationId) abandonAgentContinuation(agentFill.operationId);
      else void requestAgentOperationCancellation(agentFill.operationId);
    }
    setAgentFill(null);
    setAgentMode(null);
  }, [agentFill]);

  useEffect(() => {
    function onAgentCancelled(event: Event) {
      const target = (event as CustomEvent<AgentPageCancellation>).detail;
      if (!target?.sessionId || !target.operationId || target.operationId !== agentFill?.operationId) return;
      setAgentFill(null);
      setAgentMode(null);
      setFormOpen(false);
      setEditId(null);
      setFormDraft(null);
      setDeleteTarget(null);
    }
    window.addEventListener(AGENT_PAGE_CANCEL_EVENT, onAgentCancelled);
    return () => window.removeEventListener(AGENT_PAGE_CANCEL_EVENT, onAgentCancelled);
  }, [agentFill?.operationId]);

  function openCreate() {
    dropAgentChain();
    setFormDraft(null);
    setEditId(null);
    setFormOpen(true);
  }

  const openEdit = useCallback((id: string) => {
    dropAgentChain();
    setFormDraft(null);
    setEditId(id);
    setFormOpen(true);
  }, [dropAgentChain]);

  function closeForm() {
    if ((agentMode === "create" || agentMode === "edit") && agentFill?.operationId) abandonAgentContinuation(agentFill.operationId);
    setAgentMode(null);
    setAgentFill(null);
    setFormOpen(false);
    setEditId(null);
    setFormDraft(null);
  }

  useSemanticPage({ pageId: "accounts.list", query: { query: search || undefined, status: filterValues[activeFilterIndex] === "all" ? undefined : filterValues[activeFilterIndex] as AccountStatus, role: (searchParams.get("role") || undefined) as "运营" | undefined },
    ...(formOpen || deleteTarget ? { form: { mode: deleteTarget ? "delete" as const : editId ? "edit" as const : "create" as const, entityId: deleteTarget?.id ?? editId ?? undefined, dirty: true } } : {}),
  }, "accounts", (fill) => {
    if (loading) return false;
    if (error) throw new Error(error);
    if (fill.mode === "filter") { updateFilters({ q: fill.fields.query ?? "", status: fill.fields.status ?? "", role: fill.fields.role ?? "", page: "" }); return true; }
    if (formOpen || deleteTarget) throw new Error("请先保存或关闭当前表单");
    if (!["create", "edit", "delete"].includes(fill.mode)) throw new Error("不支持的账号页面操作");
    const row = accounts.find((item) => item.id === fill.recordId);
    if (fill.mode !== "create" && !row) throw new Error("账号不存在或已删除");
    if (row && fill.expectedRevision !== undefined && row.revision !== fill.expectedRevision) throw new Error("账号已变化，请刷新后重新操作");
    setAgentFill(fill);
    setAgentMode(fill.mode);
    if (fill.mode === "delete") { setDeleteTarget(row!); setFormOpen(false); }
    else { setEditId(fill.mode === "edit" ? fill.recordId! : null); setFormDraft(fill.fields); setFormOpen(true); }
    return true;
  });

  useEffect(() => {
    const create = searchParams.get("create") === "1";
    const edit = searchParams.get("edit");
    if (create) {
      dropAgentChain();
      setEditId(null);
      setFormOpen(true);
      router.replace("/accounts/", { scroll: false });
      return;
    }
    if (edit) {
      dropAgentChain();
      setEditId(edit);
      setFormOpen(true);
      router.replace("/accounts/", { scroll: false });
    }
  }, [searchParams, router, dropAgentChain]);

  const filtered = useMemo(() => {
    const statusKey = filterValues[activeFilterIndex];
    return accounts.filter((a) => matchesAccount(a, { query: search, status: statusKey === "all" ? undefined : statusKey, role: (searchParams.get("role") || undefined) as "运营" | undefined }));
  }, [accounts, activeFilterIndex, search, searchParams]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  useEffect(() => {
    if (!loading && !error && currentPage > totalPages) updateFilters({ page: String(totalPages) });
  }, [currentPage, totalPages, loading, error, updateFilters]);

  const pageRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage]);

  const columns: ColumnDef<AdminAccount>[] = useMemo(
    () => [
      {
        key: "name",
        header: "账号",
        width: "w-60",
        render: (row) => (
          <button
            type="button"
            className="text-left"
            onClick={() => router.push(`/accounts/${row.id}/?returnTo=${encodeURIComponent(listHref)}`)}
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
        width: "w-28",
        render: (row) => <CellText>{row.loginCount.toLocaleString()}</CellText>,
      },
      {
        key: "status",
        header: "状态",
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
              onClick={() => openEdit(row.id)}
            >
              <PenLinear size={16} />
            </IconButton>
            <IconButton
              variant="ghost"
              shape="square"
              size="sm"
              aria-label="删除"
              onClick={() => {
                dropAgentChain();
                setDeleteTarget(row);
              }}
            >
              <TrashBinMinimalisticLinear size={16} />
            </IconButton>
          </div>
        ),
      },
    ],
    [router, openEdit, dropAgentChain, listHref],
  );

  return (
    <div className="flex flex-col gap-6">
      <AccountFormDialog
        open={formOpen}
        onClose={closeForm}
        accountId={editId}
        draft={formDraft}
        operationId={agentFill?.operationId}
        expectedRevision={agentFill?.expectedRevision}
        onSaved={(receipt) => {
          if (agentMode === "create" || agentMode === "edit") notifyAgentPageDone(agentMode, receipt);
        }}
      />

      <Modal open={deleteTarget != null} onClose={() => {
              if (deleting) return;
              if (agentMode === "delete" && agentFill?.operationId) abandonAgentContinuation(agentFill.operationId);
              setAgentMode(null);
              setAgentFill(null);
              setDeleteTarget(null);
            }}>
        {deleteTarget ? (
          <ConfirmationDialog
            title="删除账号？"
            description={`确定删除「${deleteTarget.name}」？此操作将从数据库移除，不可撤销。`}
            color="red"
            icon={<TrashBinMinimalisticLinear size={32} color="#EA580C" />}
            confirmLabel={deleting ? "删除中…" : "删除"}
            cancelLabel="取消"
            onCancel={() => {
              if (deleting) return;
              if (agentMode === "delete" && agentFill?.operationId) abandonAgentContinuation(agentFill.operationId);
              setAgentMode(null);
              setAgentFill(null);
              setDeleteTarget(null);
            }}
            onConfirm={() => {
              if (deleting) return;
              setDeleting(true);
              const fromAgent = agentMode === "delete";
              void deleteAccount(deleteTarget.id, { revision: deleteTarget.revision, operationId: agentFill?.operationId, key: agentFill?.operationId ?? deleteTarget.id })
                .then((receipt) => {
                  toast.success("账号已删除");
                  if (fromAgent) notifyAgentPageDone("delete", receipt);
                  setAgentMode(null);
                  setAgentFill(null);
                  setDeleteTarget(null);
                })
                .catch((err: unknown) => {
                  toast.error(err instanceof Error ? err.message : "删除失败");
                })
                .finally(() => setDeleting(false));
            }}
          />
        ) : null}
      </Modal>

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
        </div>
        <PageTitleActions>
          <Button
            color={siteConfig.accent}
            iconLeft={<PlusIcon size={16} />}
            onClick={openCreate}
          >
            新建账号
          </Button>
        </PageTitleActions>
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

      {error ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-[28px] border border-dashed border-fg-grey-200 bg-white py-16">
          <p className="text-lg font-semibold text-fg-black">无法加载账号</p>
          <p className="max-w-md text-center text-sm text-fg-grey-700">{error}</p>
          <Button color={siteConfig.accent} onClick={() => void refresh()}>
            重试
          </Button>
        </div>
      ) : loading ? (
        <div className="rounded-[28px] border border-fg-grey-200 bg-white py-16 text-center text-sm text-fg-grey-500">
          加载中…
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-[28px] border border-dashed border-fg-grey-200 bg-white py-16">
          <p className="text-lg font-semibold text-fg-black">
            {accounts.length === 0 ? "暂无账号" : "无匹配结果"}
          </p>
          <p className="text-sm text-fg-grey-500">
            {accounts.length === 0
              ? "数据库中还没有账号，点击下方创建第一条。"
              : "试试清空搜索或切换状态筛选。"}
          </p>
          {accounts.length === 0 ? (
            <Button color={siteConfig.accent} onClick={openCreate}>
              新建账号
            </Button>
          ) : (
            <Button
              color={siteConfig.accent}
              variant="tertiary"
              onClick={() => {
                updateFilters({ q: "", status: "", page: "" });
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
          onPageChange={(page) => updateFilters({ page: page > 1 ? String(page) : "" })}
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
