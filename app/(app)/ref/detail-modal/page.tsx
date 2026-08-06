"use client";

import { useMemo, useState } from "react";
import {
  Button,
  DataTable,
  StatusBadge,
  type ColumnDef,
} from "@forge-ui-official/core";
import { Modal } from "@/components/ui/modal";
import { RefChrome } from "@/components/reference/ref-chrome";
import { siteConfig } from "@/config/site";
import { REF_PAGES } from "@/lib/reference/catalog";
import {
  REF_RECORDS,
  REF_STATUS_META,
  type RefRecord,
} from "@/lib/reference/mock-data";

const meta = REF_PAGES.find((p) => p.slug === "detail-modal")!;

export default function RefDetailModalPage() {
  const [openId, setOpenId] = useState<string | null>(null);
  const active = REF_RECORDS.find((r) => r.id === openId) ?? null;

  const columns: ColumnDef<RefRecord>[] = useMemo(
    () => [
      {
        key: "title",
        header: "标题",
        flex: true,
        render: (row) => (
          <button
            type="button"
            className="flex h-10 min-w-0 flex-col justify-center text-left"
            onClick={() => setOpenId(row.id)}
          >
            <span className="truncate text-sm font-semibold text-fg-black">{row.title}</span>
            <span className="text-xs text-fg-grey-500">{row.owner}</span>
          </button>
        ),
      },
      {
        key: "status",
        header: "状态",
        width: "w-28",
        render: (row) => (
          <div className="flex h-10 items-center">
            <StatusBadge
              label={REF_STATUS_META[row.status].label}
              color={REF_STATUS_META[row.status].color}
            />
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <RefChrome meta={meta}>
      <p className="text-sm text-fg-grey-600">点击标题打开详情弹窗（关窗即回列表）。</p>
      <DataTable<RefRecord>
        color={siteConfig.accent}
        columns={columns}
        rows={REF_RECORDS}
        getRowKey={(row) => row.id}
      />

      <Modal
        open={openId != null}
        onClose={() => setOpenId(null)}
        title="记录详情"
        width="w-[520px]"
      >
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          {active ? (
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-base font-semibold text-fg-black">{active.title}</h4>
                <StatusBadge
                  label={REF_STATUS_META[active.status].label}
                  color={REF_STATUS_META[active.status].color}
                />
              </div>
              <p className="text-sm text-fg-grey-600">{active.description}</p>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-fg-grey-500">负责人</dt>
                  <dd className="font-medium text-fg-black">{active.owner}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-fg-grey-500">金额</dt>
                  <dd className="font-medium text-fg-black">{active.amount}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-fg-grey-500">更新</dt>
                  <dd className="font-medium text-fg-black">{active.updated}</dd>
                </div>
              </dl>
            </div>
          ) : null}
        </div>
        <div className="flex justify-end gap-2 border-t border-fg-grey-100 px-6 py-4">
          <Button color={siteConfig.accent} variant="tertiary" onClick={() => setOpenId(null)}>
            关闭
          </Button>
          <Button color={siteConfig.accent}>处理（示意）</Button>
        </div>
      </Modal>
    </RefChrome>
  );
}
