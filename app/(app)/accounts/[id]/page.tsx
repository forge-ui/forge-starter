"use client";

import { useSemanticPage } from "@/components/semantic-page";

import { use, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CopyLinear, PenLinear, TrashBinMinimalisticLinear } from "solar-icon-set";
import {
  Avatar,
  Breadcrumbs,
  PageTitleToolbar,
  ToolbarActions,
  Button,
  CellImageText,
  CellText,
  ConfirmationDialog,
  DataTable,
  DescriptionItem,
  Grid,
  GridItem,
  IconButton,
  StatCard,
  StatusBadge,
  TabBar,
  TabsContent,
  type ColumnDef,
} from "@forge-ui-official/core";
import { siteConfig } from "@/config/site";
import { useAccountsStore } from "@/components/accounts-store";
import { AskAiEntry } from "@/components/ask-ai-entry";
import { AccountFormDialog } from "@/components/account-form-dialog";
import { useAccess } from "@/components/access-store";
import { Modal } from "@/components/ui/modal";
import {
  ACCOUNT_STATUS_META,
  type AccountStatus,
  type AdminAccount,
} from "@/lib/accounts/types";
import { toast } from "@/lib/toast";

function copyValue(label: string, value: string) {
  void navigator.clipboard?.writeText(value).then(
    () => toast.success(`已复制${label}`),
    () => toast.error("复制失败"),
  );
}

export default function AccountDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const { id } = use(params);
  const { returnTo } = use(searchParams);
  const listHref = returnTo === "/accounts/" || returnTo?.startsWith("/accounts/?") ? returnTo : "/accounts/";
  const router = useRouter();
  const { getById, deleteAccount, accounts, loading, error, refresh } = useAccountsStore();
  const { can } = useAccess();
  const account = getById(id);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [tab, setTab] = useState(0);

  const related = useMemo(() => {
    if (!account) return [];
    return accounts.filter((item) => item.department === account.department && item.id !== account.id);
  }, [account, accounts]);

  useSemanticPage({ pageId: "accounts.detail", entityId: account?.id, query: {}, ...(editOpen ? { form: { mode: "edit", entityId: account?.id, dirty: true } } : {}) });

  if (loading && !account) {
    return <div className="py-20 text-center text-sm text-fg-grey-500">加载中…</div>;
  }

  if (error && !account) {
    return <div className="flex flex-col items-center gap-4 py-20"><p className="text-sm text-fg-grey-700">{error}</p><Button color={siteConfig.accent} onClick={() => void refresh()}>重试</Button></div>;
  }

  if (!account) {
    return (
      <div className="flex flex-col items-center gap-4 py-20">
        <p className="text-lg font-semibold text-fg-black">账号不存在</p>
        <Button color={siteConfig.accent} onClick={() => router.push(listHref)}>
          返回列表
        </Button>
      </div>
    );
  }

  const meta = ACCOUNT_STATUS_META[account.status as AccountStatus];
  const canEdit = can("accounts", "update");
  const canDelete = can("accounts", "delete");
  const activeDepartmentCount = accounts.filter(item => item.department === account.department && item.status === "active").length;
  const sameRoleCount = accounts.filter(item => item.role === account.role).length;
  const columns: ColumnDef<AdminAccount>[] = [
    { key: "name", header: "账号", width: "w-[45%]", render: row => <button type="button" className="rounded-lg text-left focus-visible:outline-2 focus-visible:outline-fg-blue" onClick={() => { setTab(0); router.push(`/accounts/${row.id}/?returnTo=${encodeURIComponent(listHref)}`); }}><CellImageText src={row.avatarUrl} title={row.name} subtitle={`@${row.username}`} rounded="full" /></button> },
    { key: "role", header: "角色", width: "w-[20%]", render: row => <CellText>{row.role}</CellText> },
    { key: "status", header: "状态", width: "w-[15%]", render: row => <StatusBadge {...ACCOUNT_STATUS_META[row.status]} /> },
    { key: "created", header: "创建时间", width: "w-[20%]", render: row => <CellText>{row.created}</CellText> },
  ];

  return (
    <>
      <AccountFormDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        accountId={account.id}
        goToDetailOnCreate={false}
      />

      <Modal open={confirmDelete} onClose={() => { if (!deleting) setConfirmDelete(false); }}>
          <ConfirmationDialog
            title="删除账号？"
            description={`确定删除「${account.name}」？此操作将从数据库移除，不可撤销。`}
            color="red"
            icon={<TrashBinMinimalisticLinear size={32} color="#EA580C" />}
            confirmLabel={deleting ? "删除中…" : "删除"}
            cancelLabel="取消"
            onCancel={() => {
              if (!deleting) setConfirmDelete(false);
            }}
            onConfirm={() => {
              if (deleting) return;
              setDeleting(true);
              void deleteAccount(account.id, { revision: account.revision })
                .then(() => {
                  toast.success("账号已删除");
                  router.push(listHref);
                })
                .catch((error: unknown) => {
                  toast.error(error instanceof Error ? error.message : "删除失败");
                  setDeleting(false);
                });
            }}
          />
      </Modal>

      <div className="flex flex-col gap-6">
        <PageTitleToolbar
          title={account.name}
          breadcrumbs={
            <Breadcrumbs
              color={siteConfig.accent}
              items={[
                { label: "工作台", href: "/dashboard/" },
                { label: "账号管理", href: listHref },
                { label: account.name },
              ]}
            />
          }
          actions={
            <ToolbarActions className="flex-wrap">
              <AskAiEntry />
              {canEdit ? <Button
                color={siteConfig.accent}
                variant="tertiary"
                iconLeft={<PenLinear size={16} />}
                onClick={() => setEditOpen(true)}
              >
                编辑
              </Button> : null}
              {canDelete ? <Button color="red" variant="tertiary" onClick={() => setConfirmDelete(true)}>
                删除
              </Button> : null}
            </ToolbarActions>
          }
          className="shrink-0 flex-col items-stretch gap-3 sm:flex-row sm:items-end [&>div:first-child]:min-w-0"
        />

        {/* Profile structure from Forge project-template/members/[id]. */}
        <Grid gap={24} alignItems="start">
          <GridItem span={{ base: "full", xl: 4, "2xl": 3 }} className="flex min-w-0 flex-col gap-5">
            <aside aria-label="账号档案" className="overflow-hidden rounded-card border border-fg-grey-200 bg-white">
              <div aria-hidden="true" className="h-24 bg-gradient-to-br from-fg-blue-100 via-fg-grey-50 to-fg-violet-100" />
              <div className="relative -mt-10 flex flex-col items-center px-5 pb-5 text-center">
                <div className="rounded-full border-4 border-white bg-white"><Avatar src={account.avatarUrl} alt={account.name} size="xl" /></div>
                <h2 className="mt-3 max-w-full break-words text-xl font-semibold text-fg-black">{account.name}</h2>
                <p className="mt-1 max-w-full break-all text-sm text-fg-grey-700">@{account.username}</p>
                <p className="mt-2 text-sm text-fg-grey-700">{account.department} · {account.role}</p>
              </div>
              <div className="flex flex-col gap-5 border-t border-fg-grey-200 p-5">
                <DescriptionItem label="账号状态" content={<StatusBadge label={meta.label} color={meta.color} />} />
                <h3 className="text-sm font-semibold text-fg-black">联系方式</h3>
                <DescriptionItem label="邮箱" content={<span className="break-all">{account.email || "未填写"}</span>} actions={<IconButton variant="ghost" shape="square" size="sm" aria-label="复制邮箱" disabled={!account.email} onClick={() => copyValue("邮箱", account.email)}><CopyLinear size={14} /></IconButton>} />
                <DescriptionItem label="手机" content={account.phone || "未填写"} actions={<IconButton variant="ghost" shape="square" size="sm" aria-label="复制手机" disabled={!account.phone} onClick={() => copyValue("手机", account.phone)}><CopyLinear size={14} /></IconButton>} />
              </div>
              <div className="border-t border-fg-grey-200 p-5">
                <DescriptionItem label="账号 ID" content={<span className="break-all text-sm">{account.id}</span>} actions={<IconButton variant="ghost" shape="square" size="sm" aria-label="复制账号 ID" onClick={() => copyValue("账号 ID", account.id)}><CopyLinear size={14} /></IconButton>} />
              </div>
            </aside>
          </GridItem>

          <GridItem span={{ base: "full", xl: 8, "2xl": 9 }} className="min-w-0">
            <div className="flex min-w-0 flex-col gap-5">
              <Grid columns={{ base: 1, lg: 3 }} gap={16}>
                {[
                  { title: "累计登录", value: account.loginCount, subtitle: "当前业务账号的记录" },
                  { title: "同部门启用账号", value: activeDepartmentCount, subtitle: "当前部门启用数（含本账号）" },
                  { title: "同角色账号", value: sameRoleCount, subtitle: "当前角色账号数（含本账号）" },
                ].map(stat => (
                  <StatCard key={stat.title} title={stat.title} value={String(stat.value)} subtitle={stat.subtitle} theme="white" density="compact" width="full" className="h-full border border-fg-grey-200" />
                ))}
              </Grid>

              <TabBar color={siteConfig.accent} ariaLabel="账号详情分区" tabs={[{ label: "账号概览", active: tab === 0 }, { label: "同部门账号", active: tab === 1, badge: related.length }]} onChange={setTab} />

              <TabsContent activeKey={tab} ariaLabel={tab === 0 ? "账号概览" : "同部门账号"}>
              {tab === 0 ? (
                <div className="flex flex-col gap-5" role="region" aria-label="账号概览">
                  <section className="rounded-card border border-fg-grey-200 bg-white p-6">
                    <h2 className="mb-5 text-base font-semibold text-fg-black">基本资料</h2>
                    <Grid gap={24}>
                      <GridItem span={{ base: "full", sm: 6 }}><DescriptionItem label="姓名" content={account.name} /></GridItem>
                      <GridItem span={{ base: "full", sm: 6 }}><DescriptionItem label="用户名" content={account.username} /></GridItem>
                      <GridItem span={{ base: "full", sm: 6 }}><DescriptionItem label="所属部门" content={account.department} /></GridItem>
                      <GridItem span={{ base: "full", sm: 6 }}><DescriptionItem label="业务角色" content={account.role} /></GridItem>
                    </Grid>
                    <div className="mt-6 border-t border-fg-grey-200 pt-5">
                      <Grid gap={24}>
                        <GridItem span={{ base: "full", sm: 6 }}><DescriptionItem label="创建时间" content={account.created} /></GridItem>
                        <GridItem span={{ base: "full", sm: 6 }}><DescriptionItem label="最近登录" content={account.lastLogin === "—" ? "暂无登录记录" : account.lastLogin} /></GridItem>
                      </Grid>
                    </div>
                  </section>

                </div>
              ) : (
                <section className="flex min-w-0 flex-col gap-4" aria-label="同部门账号">
                  <div><h2 className="text-base font-semibold text-fg-black">{account.department}的其他账号</h2><p className="mt-1 text-sm text-fg-grey-700">点击姓名查看账号档案。</p></div>
                  {related.length ? <DataTable<AdminAccount> color={siteConfig.accent} columns={columns} rows={related} tableMinWidth={640} /> : <div className="rounded-card border border-fg-grey-200 bg-white px-6 py-12 text-center text-sm text-fg-grey-500">同部门暂无其他账号</div>}
                </section>
              )}
              </TabsContent>
            </div>
          </GridItem>
        </Grid>
      </div>
    </>
  );
}
