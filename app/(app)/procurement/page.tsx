"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  BarChartStatCard,
  Button,
  DataTable,
  StatCard,
  StatusBadge,
  type ColumnDef,
} from "@forge-ui-official/core";
import { siteConfig } from "@/config/site";
import { useSuppliersStore } from "@/components/suppliers-store";
import { usePurchaseOrdersStore } from "@/components/purchase-orders-store";
import {
  PO_STATUS_META,
  type PurchaseOrder,
} from "@/lib/purchase-orders/types";
import { SUPPLIER_STATUS_META } from "@/lib/suppliers/types";

export default function ProcurementDashboardPage() {
  const { suppliers, countsByStatus: supplierCounts } = useSuppliersStore();
  const { items: orders, counts: orderCounts } = usePurchaseOrdersStore();

  const pendingAmount = useMemo(
    () =>
      orders
        .filter((o) => o.status === "pending")
        .reduce((sum, o) => sum + o.amountCents, 0),
    [orders],
  );

  const approvedMonth = useMemo(
    () =>
      orders
        .filter((o) => o.status === "approved" || o.status === "ordered")
        .reduce((sum, o) => sum + o.amountCents, 0),
    [orders],
  );

  const recent = orders.slice(0, 6);

  const columns: ColumnDef<PurchaseOrder>[] = useMemo(
    () => [
      {
        key: "title",
        header: "最近采购单",
        flex: true,
        render: (row) => (
          <div className="flex h-10 flex-col justify-center">
            <span className="text-sm font-semibold text-fg-black">{row.title}</span>
            <span className="text-xs text-fg-grey-500">
              {row.orderNo} · {row.supplierName}
            </span>
          </div>
        ),
      },
      {
        key: "amount",
        header: "金额",
        width: "w-28",
        render: (row) => (
          <span className="text-sm text-fg-grey-700">{row.amountLabel}</span>
        ),
      },
      {
        key: "status",
        header: "状态",
        width: "w-28",
        render: (row) => (
          <StatusBadge
            label={PO_STATUS_META[row.status].label}
            color={PO_STATUS_META[row.status].color}
          />
        ),
      },
    ],
    [],
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-display-l font-semibold leading-9 tracking-fg text-fg-black">
            采购工作台
          </h1>
          <p className="mt-1 text-sm text-fg-grey-500">
            供应商档案（重详情）+ 采购单审批（轻详情弹窗）完整业务切片，用于验证 agent-native 脚手架。
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/suppliers/?create=1">
            <Button color="grey" variant="tertiary">
              新建供应商
            </Button>
          </Link>
          <Link href="/purchase-orders/?create=1">
            <Button color={siteConfig.accent}>发起采购</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 [&>*]:!w-full">
        <StatCard
          density="compact"
          size="wide"
          width="full"
          theme="white"
          title="供应商"
          value={String(supplierCounts.all ?? suppliers.length)}
          subtitle={`合作中 ${supplierCounts.active ?? 0}`}
          trend="—"
          trendDirection="up"
        />
        <StatCard
          density="compact"
          size="wide"
          width="full"
          theme="white"
          title="待审批"
          value={String(orderCounts.pending ?? 0)}
          subtitle={`¥ ${(pendingAmount / 100).toLocaleString()}`}
          trend="需处理"
          trendDirection="down"
        />
        <StatCard
          density="compact"
          size="wide"
          width="full"
          theme="white"
          title="已通过/下单金额"
          value={`¥ ${(approvedMonth / 100).toLocaleString()}`}
          subtitle="approved + ordered"
          trend="—"
          trendDirection="up"
        />
        <BarChartStatCard
          density="compact"
          size="wide"
          width="full"
          title="采购单总量"
          value={String(orderCounts.all ?? orders.length)}
          trend="—"
          trendDirection="up"
          subtitle="全状态"
          barColor="blue"
          bars={[
            orderCounts.pending ?? 0,
            orderCounts.approved ?? 0,
            orderCounts.ordered ?? 0,
            orderCounts.rejected ?? 0,
            orderCounts.cancelled ?? 0,
            orderCounts.all ?? 1,
          ].map((n) => Math.max(n * 8, 4))}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-[28px] border border-fg-grey-200 bg-white p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-fg-black">最近采购单</h2>
            <Link
              href="/purchase-orders/"
              className="text-sm font-medium text-fg-blue hover:underline"
            >
              全部 →
            </Link>
          </div>
          <DataTable<PurchaseOrder>
            color={siteConfig.accent}
            columns={columns}
            rows={recent}
            getRowKey={(row) => row.id}
          />
        </div>

        <div className="rounded-[28px] border border-fg-grey-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-fg-black">供应商快览</h2>
            <Link
              href="/suppliers/"
              className="text-sm font-medium text-fg-blue hover:underline"
            >
              全部 →
            </Link>
          </div>
          <ul className="flex flex-col gap-2">
            {suppliers.slice(0, 6).map((s) => (
              <li key={s.id}>
                <Link
                  href={`/suppliers/${s.id}/`}
                  className="flex items-center justify-between rounded-xl border border-fg-grey-100 px-3 py-2.5 hover:border-fg-blue-200"
                >
                  <div>
                    <p className="text-sm font-semibold text-fg-black">{s.name}</p>
                    <p className="text-xs text-fg-grey-500">{s.code}</p>
                  </div>
                  <StatusBadge
                    label={SUPPLIER_STATUS_META[s.status].label}
                    color={SUPPLIER_STATUS_META[s.status].color}
                  />
                </Link>
              </li>
            ))}
            {suppliers.length === 0 ? (
              <li className="text-sm text-fg-grey-500">暂无供应商，先创建种子或手动添加</li>
            ) : null}
          </ul>
        </div>
      </div>
    </div>
  );
}
