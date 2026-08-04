"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AddCircleLinear,
  Pen2Linear,
} from "solar-icon-set";
import {
  Avatar,
  Breadcrumbs,
  Button,
  ConfirmationDialog,
  HistoryItem,
  StatusBadge,
  SurfaceCard,
  TabBar,
} from "@forge-ui-official/core";
import { siteConfig } from "@/config/site";
import { useDemoStore } from "@/components/demo-store";
import { RECORD_STATUS_META } from "@/lib/demo/records";

const tabs = ["动态", "说明", "属性"] as const;
type TabLabel = (typeof tabs)[number];

function DetailLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-fg-grey-100 py-3 last:border-b-0">
      <span className="text-sm text-fg-grey-500">{label}</span>
      <span className="text-right text-sm font-medium text-fg-black">{value}</span>
    </div>
  );
}

function DetailBody() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { getById, deleteRecord } = useDemoStore();
  const record = id ? getById(id) : undefined;
  const [tab, setTab] = useState<TabLabel>("动态");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const history = useMemo(() => {
    if (!record) return [];
    return [
      {
        title: "记录已创建",
        description: `${record.owner} 创建了「${record.name}」`,
        datetime: record.createdAt.slice(0, 10),
        color: "blue" as const,
      },
      {
        title: "状态更新",
        description: `当前状态：${RECORD_STATUS_META[record.status].label}`,
        datetime: `${record.updatedDate}`,
        color:
          record.status === "done" ? ("green" as const)
            : record.status === "blocked" ? ("red" as const)
              : ("blue" as const),
      },
      {
        title: "最近编辑",
        description: record.subtitle,
        datetime: record.updatedTime,
        color: "gray" as const,
      },
    ];
  }, [record]);

  if (!record) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-[28px] border border-dashed border-fg-grey-200 bg-white px-6 py-20 text-center">
        <p className="text-lg font-semibold text-fg-black">未找到记录</p>
        <p className="text-sm text-fg-grey-700">可能已被删除，或链接无效。</p>
        <Button color={siteConfig.accent} onClick={() => router.push("/examples/list/")}>
          返回列表
        </Button>
      </div>
    );
  }

  const meta = RECORD_STATUS_META[record.status];

  return (
    <div className="flex flex-col gap-6">
      {confirmDelete ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <ConfirmationDialog
            title={`删除「${record.name}」？`}
            description="删除后无法恢复，工作台统计会同步更新。"
            confirmLabel="删除"
            cancelLabel="取消"
            color="red"
            onConfirm={() => {
              deleteRecord(record.id);
              setConfirmDelete(false);
              router.push("/examples/list/");
            }}
            onCancel={() => setConfirmDelete(false)}
          />
        </div>
      ) : null}

      {/* CRM detail header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-fg text-fg-black">记录详情</h1>
          <Breadcrumbs
            color={siteConfig.accent}
            items={[
              { label: "工作台", href: "/dashboard/" },
              { label: "业务记录", href: "/examples/list/" },
              { label: record.code },
            ]}
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            color={siteConfig.accent}
            variant="tertiary"
            iconLeft={<Pen2Linear size={18} />}
            onClick={() => router.push(`/examples/form/?id=${record.id}`)}
          >
            编辑
          </Button>
          <Button
            color={siteConfig.accent}
            iconLeft={<AddCircleLinear size={18} />}
            onClick={() => router.push("/examples/form/")}
          >
            新建
          </Button>
        </div>
      </div>

      {/* CRM: left profile + right tabs */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="flex flex-col gap-5">
          <SurfaceCard className="p-6">
            <div className="flex flex-col items-center text-center">
              <Avatar src={record.imageUrl} size="lg" />
              <h2 className="mt-4 text-xl font-semibold text-fg-black">{record.name}</h2>
              <p className="mt-1 text-sm font-medium text-fg-grey-500">{record.subtitle}</p>
              <div className="mt-4">
                <StatusBadge label={meta.label} color={meta.color} />
              </div>
            </div>
          </SurfaceCard>
          <SurfaceCard className="p-5" title="基本信息">
            <DetailLine label="编号" value={record.code} />
            <DetailLine label="分类" value={record.category} />
            <DetailLine label="负责人" value={record.owner} />
            <DetailLine label="更新" value={`${record.updatedDate} ${record.updatedTime}`} />
          </SurfaceCard>
          <Button
            color="red"
            variant="tertiary"
            className="w-full"
            onClick={() => setConfirmDelete(true)}
          >
            删除记录
          </Button>
        </aside>

        <main className="min-w-0">
          <SurfaceCard className="overflow-hidden p-0">
            <TabBar
              color={siteConfig.accent}
              surface="page"
              tabs={tabs.map((label) => ({ label, active: label === tab }))}
              onChange={(index) => setTab(tabs[index])}
            />
            <div className="p-5">
              {tab === "动态" ? (
                <div className="flex flex-col gap-0">
                  {history.map((item, index) => (
                    <HistoryItem
                      key={item.title}
                      variant="badge"
                      color={item.color}
                      title={item.title}
                      description={item.description}
                      datetime={item.datetime}
                      showDatetime="inline"
                      showConnector={index < history.length - 1}
                    />
                  ))}
                </div>
              ) : null}
              {tab === "说明" ? (
                <div className="flex flex-col gap-3">
                  <p className="text-sm leading-6 whitespace-pre-wrap text-fg-grey-700">
                    {record.description || "暂无说明"}
                  </p>
                </div>
              ) : null}
              {tab === "属性" ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <DetailLine label="编号" value={record.code} />
                  <DetailLine label="分类" value={record.category} />
                  <DetailLine label="负责人" value={record.owner} />
                  <DetailLine label="状态" value={meta.label} />
                  <DetailLine label="摘要" value={record.subtitle} />
                  <DetailLine label="更新时间" value={`${record.updatedDate} ${record.updatedTime}`} />
                </div>
              ) : null}
            </div>
          </SurfaceCard>
        </main>
      </div>
    </div>
  );
}

export default function ExampleDetailPage() {
  return (
    <Suspense fallback={<p className="text-sm text-fg-grey-700">加载详情…</p>}>
      <DetailBody />
    </Suspense>
  );
}
