"use client";

import { use, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CopyLinear, PenLinear, TrashBinMinimalisticLinear } from "solar-icon-set";
import {
  Avatar,
  Breadcrumbs,
  Button,
  ConfirmationDialog,
  DescriptionItem,
  Grid,
  GridItem,
  IconButton,
  ListItem,
  StatusBadge,
} from "@forge-ui-official/core";
import { siteConfig } from "@/config/site";
import { useAccountsStore } from "@/components/accounts-store";
import { PageTitleActions } from "@/components/ask-ai-entry";
import { AccountFormDialog } from "@/components/account-form-dialog";
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
  const { getById, deleteAccount, accounts, loading } = useAccountsStore();
  const account = getById(id);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const related = useMemo(() => {
    if (!account) return [];
    return accounts.filter((item) => item.department === account.department && item.id !== account.id);
  }, [account, accounts]);

  if (loading && !account) {
    return <div className="py-20 text-center text-sm text-fg-grey-500">加载中…</div>;
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

  return (
    <>
      <AccountFormDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        accountId={account.id}
        goToDetailOnCreate={false}
      />

      {confirmDelete ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
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
              void deleteAccount(account.id)
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
        </div>
      ) : null}

      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-display-l font-semibold leading-9 tracking-fg text-fg-black">
                {account.name}
              </h1>
              <StatusBadge label={meta.label} color={meta.color} />
            </div>
            <Breadcrumbs
              color={siteConfig.accent}
              items={[
                { label: "工作台", href: "/dashboard/" },
                { label: "账号管理", href: listHref },
                { label: account.name },
              ]}
            />
          </div>
          <PageTitleActions>
            <Button
              color={siteConfig.accent}
              variant="tertiary"
              iconLeft={<PenLinear size={16} />}
              onClick={() => setEditOpen(true)}
            >
              编辑
            </Button>
            <Button color="red" variant="tertiary" onClick={() => setConfirmDelete(true)}>
              删除
            </Button>
          </PageTitleActions>
        </div>

        <Grid gap={20} alignItems="start">
          <GridItem span={{ base: "full", xl: 4 }}>
            <section className="rounded-[28px] bg-white p-5 outline outline-1 outline-offset-[-1px] outline-fg-grey-200">
              <div className="mb-5 flex items-center gap-4">
                <Avatar src={account.avatarUrl} alt={account.name} size="xl" />
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold text-fg-black">@{account.username}</p>
                  <p className="mt-1 text-sm text-fg-grey-700">{account.role}</p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <DescriptionItem
                  label="邮箱"
                  content={account.email}
                  actions={
                    <IconButton
                      variant="ghost"
                      shape="square"
                      size="sm"
                      aria-label="复制邮箱"
                      onClick={() => copyValue("邮箱", account.email)}
                    >
                      <CopyLinear size={14} />
                    </IconButton>
                  }
                />
                <DescriptionItem
                  label="手机"
                  content={account.phone}
                  actions={
                    <IconButton
                      variant="ghost"
                      shape="square"
                      size="sm"
                      aria-label="复制手机"
                      onClick={() => copyValue("手机", account.phone)}
                    >
                      <CopyLinear size={14} />
                    </IconButton>
                  }
                />
                <DescriptionItem label="角色" content={account.role} />
                <DescriptionItem label="部门" content={account.department} />
                <DescriptionItem label="登录次数" content={String(account.loginCount)} />
                <DescriptionItem label="最近登录" content={account.lastLogin} />
                <DescriptionItem label="创建时间" content={account.created} />
              </div>
            </section>
          </GridItem>

          <GridItem span={{ base: "full", xl: 8 }} className="min-w-0">
            <div className="flex flex-col gap-5">
              <section className="rounded-[28px] bg-white p-5 outline outline-1 outline-offset-[-1px] outline-fg-grey-200">
                <h2 className="text-base font-semibold text-fg-black">备注</h2>
                <p className={`mt-3 whitespace-pre-wrap text-sm leading-6 ${account.notes ? "text-fg-grey-700" : "text-fg-grey-500"}`}>
                  {account.notes || "暂无备注"}
                </p>
              </section>

              <section className="rounded-[28px] bg-white p-5 outline outline-1 outline-offset-[-1px] outline-fg-grey-200">
                <h2 className="text-base font-semibold text-fg-black">同部门账号</h2>
                <p className="mt-1 text-sm text-fg-grey-700">{account.department}</p>
                <div className="mt-4 flex flex-col gap-2">
                  {related.length === 0 ? (
                    <p className="py-6 text-center text-sm text-fg-grey-500">同部门暂无其他账号</p>
                  ) : (
                    related.map((item) => (
                      <RelatedAccount
                        key={item.id}
                        account={item}
                        onOpen={() => router.push(`/accounts/${item.id}/?returnTo=${encodeURIComponent(listHref)}`)}
                      />
                    ))
                  )}
                </div>
              </section>
            </div>
          </GridItem>
        </Grid>
      </div>
    </>
  );
}

function RelatedAccount({
  account,
  onOpen,
}: {
  account: AdminAccount;
  onOpen: () => void;
}) {
  const meta = ACCOUNT_STATUS_META[account.status];
  return (
    <button type="button" className="w-full rounded-2xl text-left hover:bg-fg-grey-50" onClick={onOpen}>
      <ListItem
        lead={{ kind: "avatar", src: account.avatarUrl, alt: account.name, size: "md" }}
        title={account.name}
        subtitle={account.role}
        trailing={<StatusBadge label={meta.label} color={meta.color} />}
      />
    </button>
  );
}
