"use client";

import { useMemo, useState } from "react";
import {
  Button,
  ButtonGroup,
  DataTable,
  StatusBadge,
  type ColumnDef,
} from "@forge-ui-official/core";
import { RefChrome } from "@/components/reference/ref-chrome";
import { siteConfig } from "@/config/site";
import { REF_PAGES } from "@/lib/reference/catalog";
import {
  REF_RECORDS,
  REF_STATUS_META,
  type RefRecord,
} from "@/lib/reference/mock-data";

const meta = REF_PAGES.find((p) => p.slug === "queue")!;
const scopes = [{ label: "待我处理" }, { label: "全部" }];

export default function RefQueuePage() {
  const [scope, setScope] = useState(0);

  const rows = useMemo(() => {
    if (scope === 0) {
      return REF_RECORDS.filter((r) => r.status === "pending" || r.status === "active");
    }
    return REF_RECORDS;
  }, [scope]);

  const columns: ColumnDef<RefRecord>[] = useMemo(
    () => [
      {
        key: "title",
        header: "待办",
        flex: true,
        render: (row) => (
          <div className="flex h-10 min-w-0 flex-col justify-center">
            <span className="truncate text-sm font-semibold text-fg-black">{row.title}</span>
            <span className="text-xs text-fg-grey-500">{row.owner}</span>
          </div>
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
      {
        key: "actions",
        header: "操作",
        width: "w-44",
        render: () => (
          <div className="flex h-10 items-center gap-2">
            <Button color="green" size="sm">
              通过
            </Button>
            <Button color="red" variant="tertiary" size="sm">
              驳回
            </Button>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <RefChrome meta={meta}>
      <ButtonGroup
        color={siteConfig.accent}
        shape="pill"
        items={scopes}
        activeIndex={scope}
        onChange={setScope}
      />
      <DataTable<RefRecord>
        color={siteConfig.accent}
        columns={columns}
        rows={rows}
        getRowKey={(row) => row.id}
      />
    </RefChrome>
  );
}
