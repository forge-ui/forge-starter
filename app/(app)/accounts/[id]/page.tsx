"use client";

/* eslint-disable @next/next/no-img-element */

import { use, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarLinear,
  ChatRoundLinear,
  CopyLinear,
  EyeLinear,
  PenLinear,
  PhoneCallingLinear,
  TrashBinMinimalisticLinear,
} from "solar-icon-set";
import {
  Breadcrumbs,
  Button,
  CellMuted,
  CellText,
  ChartCard,
  ConfirmationDialog,
  DataTable,
  IconButton,
  SmoothLineChart,
  StatCard,
  TabBar,
  type ColumnDef,
} from "@forge-ui-official/core";
import { StatusText } from "@/components/ui/status-text";
import { siteConfig } from "@/config/site";
import { useAccountsStore } from "@/components/accounts-store";
import { AccountFormDialog } from "@/components/account-form-dialog";
import {
  ACCOUNT_STATUS_META,
  type AccountStatus,
  type AdminAccount,
} from "@/lib/accounts/types";

const tabs = ["概览", "登录记录", "权限", "备注"] as const;
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

type SessionRow = {
  id: string;
  device: string;
  location: string;
  ip: string;
  result: "success" | "failed" | "locked";
  time: string;
};

const resultMeta: Record<
  SessionRow["result"],
  { label: string; color: "green" | "red" | "yellow" }
> = {
  success: { label: "成功", color: "green" },
  failed: { label: "失败", color: "red" },
  locked: { label: "锁定", color: "yellow" },
};

function buildSessions(account: AdminAccount): SessionRow[] {
  const base = account.loginCount;
  return [
    {
      id: "s1",
      device: "Chrome · macOS",
      location: "上海",
      ip: "10.0.12.18",
      result: account.status === "locked" ? "locked" : "success",
      time: account.lastLogin === "—" ? account.created : account.lastLogin,
    },
    {
      id: "s2",
      device: "Safari · iOS",
      location: "杭州",
      ip: "10.0.12.42",
      result: "success",
      time: "昨天 21:08",
    },
    {
      id: "s3",
      device: "Edge · Windows",
      location: "北京",
      ip: "10.0.8.3",
      result: base > 20 ? "failed" : "success",
      time: "3 天前",
    },
    {
      id: "s4",
      device: "Firefox · Linux",
      location: "深圳",
      ip: "10.0.9.11",
      result: "success",
      time: account.created,
    },
  ];
}

function ActivityPill({
  label,
  color,
}: {
  label: string;
  color: "blue" | "green" | "yellow" | "red";
}) {
  const map: Record<typeof color, string> = {
    blue: "bg-fg-blue-50 text-fg-blue",
    green: "bg-fg-green-50 text-fg-green",
    yellow: "bg-fg-yellow-50 text-fg-yellow-600",
    red: "bg-fg-red-50 text-fg-red",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${map[color]}`}>
      {label}
    </span>
  );
}

export default function AccountDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { getById, deleteAccount, accounts, loading } = useAccountsStore();
  const account = getById(id);
  const [tabIndex, setTabIndex] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [sessionPage, setSessionPage] = useState(1);
  const [editOpen, setEditOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const sessions = useMemo(() => (account ? buildSessions(account) : []), [account]);
  const related = useMemo(() => {
    if (!account) return [];
    return accounts.filter((a) => a.department === account.department && a.id !== account.id).slice(0, 5);
  }, [account, accounts]);

  const sessionColumns: ColumnDef<SessionRow>[] = useMemo(
    () => [
      {
        key: "device",
        header: "设备",
        sortable: true,
        width: "w-52",
        render: (row) => <CellText>{row.device}</CellText>,
      },
      {
        key: "location",
        header: "地点",
        width: "w-28",
        render: (row) => <CellMuted>{row.location}</CellMuted>,
      },
      {
        key: "ip",
        header: "IP",
        width: "w-32",
        render: (row) => <CellMuted>{row.ip}</CellMuted>,
      },
      {
        key: "result",
        header: "结果",
        width: "w-28",
        render: (row) => {
          const meta = resultMeta[row.result];
          return <StatusText label={meta.label} color={meta.color} />;
        },
      },
      {
        key: "time",
        header: "时间",
        width: "w-32",
        render: (row) => <CellMuted>{row.time}</CellMuted>,
      },
      {
        key: "actions",
        header: "",
        width: "w-20",
        render: () => (
          <div className="flex h-10 items-center justify-end gap-2">
            <IconButton variant="ghost" shape="square" size="sm" aria-label="查看">
              <EyeLinear size={16} />
            </IconButton>
          </div>
        ),
      },
    ],
    [],
  );

  if (loading && !account) {
    return (
      <div className="py-20 text-center text-sm text-fg-grey-500">加载中…</div>
    );
  }

  if (!account) {
    return (
      <div className="flex flex-col items-center gap-4 py-20">
        <p className="text-lg font-semibold text-fg-black">账号不存在</p>
        <Button color={siteConfig.accent} onClick={() => router.push("/accounts/")}>
          返回列表
        </Button>
      </div>
    );
  }

  const meta = ACCOUNT_STATUS_META[account.status as AccountStatus];
  const activeTab = tabs[tabIndex];
  const loginSeries = [
    12, 18, 15, 22, 28, 24, 30, 36, 32, 40, 38, Math.max(account.loginCount % 50, 12),
  ];

  return (
    <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
      <AccountFormDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        accountId={account.id}
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
                .then(() => router.push("/accounts/"))
                .catch(() => setDeleting(false));
            }}
          />
        </div>
      ) : null}

      {/* Main column — ecommerce/customers/[id] pattern */}
      <div className="min-w-0 flex-1 space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-display-l font-semibold leading-9 tracking-fg text-fg-black">
              账号详情
            </h1>
            <Breadcrumbs
              color={siteConfig.accent}
              items={[
                { label: "工作台", href: "/dashboard/" },
                { label: "账号管理", href: "/accounts/" },
                { label: account.name },
              ]}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
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
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard
            title="登录次数"
            value={String(account.loginCount)}
            trend="10%"
            trendDirection="up"
            subtitle={`最近 ${account.lastLogin}`}
            theme="white"
          />
          <StatCard
            title="账号状态"
            value={meta.label}
            trend={account.status === "active" ? "稳定" : "需关注"}
            trendDirection={account.status === "active" ? "up" : "down"}
            subtitle={account.role}
            theme="white"
          />
          <StatCard
            title="所属部门"
            value={account.department}
            trend="—"
            trendDirection="up"
            subtitle={`创建于 ${account.created}`}
            theme="white"
          />
        </div>

        <div className="border-b border-fg-grey-200">
          <TabBar
            color={siteConfig.accent}
            tabs={tabs.map((label, i) => ({ label, active: i === tabIndex }))}
            onChange={setTabIndex}
          />
        </div>

        {activeTab === "概览" ? (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
            <div className="rounded-card border border-fg-grey-200 bg-white p-5">
              <div className="mb-4">
                <h3 className="text-base font-semibold text-fg-black">同部门账号</h3>
                <p className="text-xs text-fg-grey-700">{account.department}</p>
              </div>
              <div className="max-h-[460px] space-y-3 overflow-y-auto pr-1">
                {related.length === 0 ? (
                  <p className="text-sm text-fg-grey-500">同部门暂无其他账号</p>
                ) : (
                  related.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className="flex w-full items-center gap-3 text-left"
                      onClick={() => router.push(`/accounts/${item.id}/`)}
                    >
                      <img
                        src={item.avatarUrl}
                        alt=""
                        className="h-12 w-12 shrink-0 rounded-full object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-fg-black">{item.name}</p>
                        <p className="text-xs text-fg-grey-700">{item.role}</p>
                      </div>
                      <StatusText
                        label={ACCOUNT_STATUS_META[item.status].label}
                        color={ACCOUNT_STATUS_META[item.status].color}
                      />
                    </button>
                  ))
                )}
              </div>
            </div>

            <ChartCard
              title="登录趋势"
              subtitle="近 12 个月示意"
              size="full"
              minHeight="min-h-[420px]"
              action={
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full border border-fg-grey-200 bg-white px-3 py-2 text-sm font-medium text-fg-black"
                >
                  <CalendarLinear size={16} />
                  Month
                </button>
              }
            >
              <div className="px-6 pb-6">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-fg-blue-50">
                    <span className="h-3 w-3 rounded-full bg-fg-blue" />
                  </span>
                  <div>
                    <p className="text-xs text-fg-grey-700">累计登录</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-semibold text-fg-black">{account.loginCount}</span>
                      <span className="text-xs font-semibold text-fg-green">10% ▲</span>
                    </div>
                  </div>
                </div>
                <SmoothLineChart
                  series={[{ data: loginSeries, color: "#2563eb" }]}
                  accent="blue"
                  activeIndex={6}
                  showTooltip
                  tooltipItems={[
                    {
                      label: "登录",
                      value: String(loginSeries[6]),
                      color: "bg-fg-blue",
                      trend: "up",
                    },
                  ]}
                  showYAxis
                  yAxisLabels={["50", "40", "30", "20", "10", "0"]}
                  xAxisLabels={months}
                  height="h-72"
                />
              </div>
            </ChartCard>
          </div>
        ) : null}

        {activeTab === "登录记录" ? (
          <div className="rounded-card border border-fg-grey-200 bg-white p-4">
            <DataTable<SessionRow>
              color={siteConfig.accent}
              columns={sessionColumns}
              rows={sessions}
              getRowKey={(row) => row.id}
              showPagination
              currentPage={sessionPage}
              totalPages={1}
              onPageChange={setSessionPage}
              paginationLabel={`共 ${sessions.length} 条登录记录`}
            />
          </div>
        ) : null}

        {activeTab === "权限" ? (
          <div className="rounded-card border border-fg-grey-200 bg-white p-6">
            <h3 className="text-base font-semibold text-fg-black">角色权限（演示）</h3>
            <p className="mt-2 text-sm leading-6 text-fg-grey-700">
              当前角色 <strong className="text-fg-black">{account.role}</strong>
              ，部门 <strong className="text-fg-black">{account.department}</strong>。
              演示环境未接真实 RBAC；正式项目可在此展示菜单权限、数据范围与审计策略。
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                { label: "工作台", value: "可见" },
                { label: "账号管理", value: account.role === "只读" ? "只读" : "读写" },
                { label: "新建账号", value: account.role === "超级管理员" || account.role === "运营" ? "允许" : "禁止" },
                { label: "设置", value: account.role === "只读" ? "只读" : "允许" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-2xl border border-fg-grey-200 px-4 py-3"
                >
                  <span className="text-sm font-medium text-fg-black">{item.label}</span>
                  <StatusText
                    label={item.value}
                    color={item.value === "禁止" ? "red" : item.value === "只读" ? "yellow" : "green"}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {activeTab === "备注" ? (
          <div className="rounded-card border border-fg-grey-200 bg-white p-6">
            <h3 className="mb-3 text-base font-semibold text-fg-black">备注</h3>
            <p className="whitespace-pre-wrap text-sm leading-6 text-fg-grey-700">
              {account.notes || "暂无备注"}
            </p>
          </div>
        ) : null}
      </div>

      {/* Sidebar — customer detail pattern */}
      <aside className="w-full shrink-0 rounded-card border border-fg-grey-200 bg-white p-6 self-start xl:w-[336px]">
        <div className="relative -mx-6 -mt-6 h-[120px] rounded-t-card bg-gradient-to-r from-fg-blue via-fg-blue-300 to-fg-blue-100" />

        <div className="-mt-12 flex flex-col items-center gap-3">
          <img
            src={account.avatarUrl}
            alt={account.name}
            className="h-[100px] w-[100px] rounded-full border-4 border-white object-cover"
          />
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-semibold text-fg-black">{account.name}</h3>
              {account.role === "超级管理员" ? (
                <span className="rounded-md bg-fg-blue px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                  Admin
                </span>
              ) : null}
            </div>
            <p className="text-sm text-fg-grey-700">@{account.username}</p>
            <StatusText label={meta.label} color={meta.color} />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Button color={siteConfig.accent} variant="tertiary" iconLeft={<PhoneCallingLinear size={16} />}>
            电话
          </Button>
          <Button color={siteConfig.accent} iconLeft={<ChatRoundLinear size={16} />}>
            消息
          </Button>
        </div>

        <div className="mt-5 space-y-4 border-t border-fg-grey-200 pt-5">
          {[
            { label: "邮箱", value: account.email, copy: true },
            { label: "手机", value: account.phone, copy: true },
            { label: "角色", value: account.role },
            { label: "部门", value: account.department },
          ].map((field) => (
            <div key={field.label}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-fg-grey-700">{field.label}</p>
                {field.copy ? (
                  <IconButton
                    variant="ghost"
                    shape="square"
                    size="sm"
                    aria-label={`复制${field.label}`}
                    onClick={() => void navigator.clipboard?.writeText(field.value)}
                  >
                    <CopyLinear size={14} />
                  </IconButton>
                ) : null}
              </div>
              <p className="mt-1 text-sm font-medium leading-relaxed text-fg-black">{field.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 space-y-5 border-t border-fg-grey-200 pt-5">
          {[
            {
              title: "账号创建",
              description: `由管理员开通，部门 ${account.department}`,
              pills: [{ label: "开通", color: "blue" as const }],
              datetime: account.created,
            },
            {
              title: "最近登录",
              description: account.lastLogin,
              pills: [{ label: meta.label, color: account.status === "active" ? ("green" as const) : ("yellow" as const) }],
              datetime: account.lastLogin,
            },
            {
              title: "角色分配",
              description: account.role,
              pills: [{ label: account.department, color: "blue" as const }],
              datetime: account.created,
            },
          ].map((item) => (
            <div key={item.title} className="flex gap-3">
              <img
                src={account.avatarUrl}
                alt=""
                className="h-9 w-9 shrink-0 rounded-full object-cover"
              />
              <div className="flex flex-1 flex-col gap-1">
                <p className="text-sm font-semibold text-fg-black">{item.title}</p>
                <p className="text-xs leading-relaxed text-fg-grey-700">{item.description}</p>
                <div className="flex flex-wrap items-center gap-1.5">
                  {item.pills.map((pill) => (
                    <ActivityPill key={pill.label} label={pill.label} color={pill.color} />
                  ))}
                </div>
                <p className="text-xs text-fg-grey-700">{item.datetime}</p>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
