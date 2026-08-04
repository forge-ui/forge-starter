"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Breadcrumbs,
  Button,
  StatusBadge,
  SurfaceCard,
} from "@forge-ui-official/core";
import { siteConfig } from "@/config/site";
import { useDemoStore } from "@/components/demo-store";
import { RECORD_STATUS_META } from "@/lib/demo/records";

function DetailBody() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { getById, deleteRecord } = useDemoStore();
  const record = id ? getById(id) : undefined;

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
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-display-l font-semibold leading-9 tracking-fg text-fg-black">
            {record.name}
          </h1>
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
          <StatusBadge label={meta.label} color={meta.color} />
          <Button
            color={siteConfig.accent}
            variant="tertiary"
            onClick={() => router.push(`/examples/form/?id=${record.id}`)}
          >
            编辑
          </Button>
          <Button
            color={siteConfig.accent}
            variant="tertiary"
            onClick={() => {
              deleteRecord(record.id);
              router.push("/examples/list/");
            }}
          >
            删除
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <SurfaceCard className="p-6 lg:col-span-2">
          <p className="text-xs font-semibold text-fg-blue-500">SUMMARY</p>
          <h2 className="mt-1 text-lg font-semibold text-fg-black">业务说明</h2>
          <p className="mt-4 text-sm leading-6 text-fg-grey-700 whitespace-pre-wrap">
            {record.description || "暂无说明"}
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-fg-grey-500">摘要</p>
              <p className="mt-1 font-medium text-fg-black">{record.subtitle}</p>
            </div>
            <div>
              <p className="text-xs text-fg-grey-500">分类</p>
              <p className="mt-1 font-medium text-fg-black">{record.category}</p>
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard className="p-6">
          <p className="text-xs font-semibold text-fg-blue-500">META</p>
          <h2 className="mt-1 text-lg font-semibold text-fg-black">属性</h2>
          <dl className="mt-4 space-y-4 text-sm">
            <div>
              <dt className="text-fg-grey-500">编号</dt>
              <dd className="mt-1 font-medium text-fg-black">{record.code}</dd>
            </div>
            <div>
              <dt className="text-fg-grey-500">负责人</dt>
              <dd className="mt-1 font-medium text-fg-black">{record.owner}</dd>
            </div>
            <div>
              <dt className="text-fg-grey-500">状态</dt>
              <dd className="mt-1">
                <StatusBadge label={meta.label} color={meta.color} />
              </dd>
            </div>
            <div>
              <dt className="text-fg-grey-500">更新时间</dt>
              <dd className="mt-1 font-medium text-fg-black">
                {record.updatedDate} {record.updatedTime}
              </dd>
            </div>
          </dl>
          <Button
            className="mt-6 w-full"
            color={siteConfig.accent}
            variant="tertiary"
            onClick={() => router.push("/examples/list/")}
          >
            返回列表
          </Button>
        </SurfaceCard>
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
