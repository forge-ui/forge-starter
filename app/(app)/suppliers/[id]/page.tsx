"use client";

import { use, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PenLinear, TrashBinMinimalisticLinear } from "solar-icon-set";
import {
  Breadcrumbs,
  Button,
  ConfirmationDialog,
  StatCard,
  StatusBadge,
  TabBar,
} from "@forge-ui-official/core";
import { Modal } from "@/components/ui/modal";
import { siteConfig } from "@/config/site";
import { useSuppliersStore } from "@/components/suppliers-store";
import { usePurchaseOrdersStore } from "@/components/purchase-orders-store";
import { SupplierFormDialog } from "@/components/supplier-form-dialog";
import {
  SUPPLIER_CATEGORY_META,
  SUPPLIER_STATUS_META,
} from "@/lib/suppliers/types";
import { PO_STATUS_META } from "@/lib/purchase-orders/types";

const tabs = ["概览", "采购单", "备注"] as const;

export default function SupplierDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { getById, deleteSupplier, loading } = useSuppliersStore();
  const { items: orders } = usePurchaseOrdersStore();
  const supplier = getById(id);
  const [tab, setTab] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const relatedOrders = useMemo(
    () => orders.filter((o) => o.supplierId === id || o.supplierName === supplier?.name),
    [orders, id, supplier?.name],
  );

  if (loading && !supplier) {
    return <p className="text-sm text-fg-grey-500">加载中…</p>;
  }
  if (!supplier) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-fg-grey-600">供应商不存在或已删除。</p>
        <Button color={siteConfig.accent} variant="tertiary" onClick={() => router.push("/suppliers/")}>
          返回列表
        </Button>
      </div>
    );
  }

  async function onDelete() {
    setBusy(true);
    setError(null);
    try {
      await deleteSupplier(id);
      router.push("/suppliers/");
    } catch (e) {
      setError(e instanceof Error ? e.message : "删除失败");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-display-l font-semibold leading-9 tracking-fg text-fg-black">
            {supplier.name}
          </h1>
          <Breadcrumbs
            color={siteConfig.accent}
            items={[
              { label: "采购", href: "/procurement/" },
              { label: "供应商", href: "/suppliers/" },
              { label: supplier.name },
            ]}
          />
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <StatusBadge
              label={SUPPLIER_STATUS_META[supplier.status].label}
              color={SUPPLIER_STATUS_META[supplier.status].color}
            />
            <span className="font-mono text-sm text-fg-grey-500">{supplier.code}</span>
            <span className="text-sm text-fg-grey-500">
              {SUPPLIER_CATEGORY_META[supplier.category].label}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            color="grey"
            variant="tertiary"
            iconLeft={<PenLinear size={16} />}
            onClick={() => setEditOpen(true)}
          >
            编辑
          </Button>
          <Button
            color="grey"
            variant="tertiary"
            iconLeft={<TrashBinMinimalisticLinear size={16} />}
            onClick={() => setDeleteOpen(true)}
          >
            删除
          </Button>
          <Button color={siteConfig.accent} onClick={() => router.push("/purchase-orders/?create=1")}>
            发起采购
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="评级"
          value={`${supplier.rating} / 5`}
          subtitle="综合评分"
          theme="white"
          trend="—"
          trendDirection="up"
        />
        <StatCard
          title="关联采购单"
          value={String(relatedOrders.length)}
          subtitle="本系统内"
          theme="white"
          trend="—"
          trendDirection="up"
        />
        <StatCard
          title="状态"
          value={SUPPLIER_STATUS_META[supplier.status].label}
          subtitle={supplier.updated}
          theme="white"
          trend="—"
          trendDirection="up"
        />
      </div>

      <TabBar
        color={siteConfig.accent}
        surface="page"
        tabs={tabs.map((label, i) => ({ label, active: tab === i }))}
        onChange={setTab}
      />

      {tab === 0 && (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <section className="rounded-[28px] border border-fg-grey-200 bg-white p-6">
            <h3 className="text-base font-semibold text-fg-black">联系信息</h3>
            <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                ["联系人", supplier.contactName],
                ["电话", supplier.contactPhone],
                ["邮箱", supplier.contactEmail],
                ["地址", supplier.address],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs text-fg-grey-500">{k}</dt>
                  <dd className="mt-1 text-sm font-medium text-fg-black">{v || "—"}</dd>
                </div>
              ))}
            </dl>
          </section>
          <aside className="rounded-[28px] border border-fg-grey-200 bg-white p-6">
            <h3 className="text-base font-semibold text-fg-black">摘要</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-2">
                <span className="text-fg-grey-500">创建</span>
                <span className="font-medium text-fg-black">{supplier.created}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-fg-grey-500">更新</span>
                <span className="font-medium text-fg-black">{supplier.updated}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-fg-grey-500">品类</span>
                <span className="font-medium text-fg-black">
                  {SUPPLIER_CATEGORY_META[supplier.category].label}
                </span>
              </div>
            </dl>
          </aside>
        </div>
      )}

      {tab === 1 && (
        <div className="flex flex-col gap-3">
          {relatedOrders.length === 0 ? (
            <p className="text-sm text-fg-grey-500">暂无关联采购单</p>
          ) : (
            relatedOrders.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => router.push(`/purchase-orders/?id=${o.id}`)}
                className="flex items-center justify-between rounded-2xl border border-fg-grey-200 bg-white px-4 py-3 text-left hover:border-fg-blue-200"
              >
                <div>
                  <p className="text-sm font-semibold text-fg-black">{o.title}</p>
                  <p className="text-xs text-fg-grey-500">
                    {o.orderNo} · {o.amountLabel}
                  </p>
                </div>
                <StatusBadge
                  label={PO_STATUS_META[o.status].label}
                  color={PO_STATUS_META[o.status].color}
                />
              </button>
            ))
          )}
        </div>
      )}

      {tab === 2 && (
        <section className="rounded-[28px] border border-fg-grey-200 bg-white p-6">
          <p className="text-sm leading-7 text-fg-grey-700 whitespace-pre-wrap">
            {supplier.notes || "暂无备注"}
          </p>
        </section>
      )}

      <SupplierFormDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        supplierId={supplier.id}
        goToDetailOnCreate={false}
      />

      {deleteOpen ? (
        <Modal open onClose={() => setDeleteOpen(false)} title="删除供应商">
          <div className="px-6 py-4">
            <ConfirmationDialog
              title="确认删除？"
              description={`删除「${supplier.name}」后不可恢复。`}
              color="red"
              confirmLabel={busy ? "删除中…" : "删除"}
              cancelLabel="取消"
              onConfirm={onDelete}
              onCancel={() => setDeleteOpen(false)}
            />
            {error ? <p className="mt-2 text-sm text-fg-red">{error}</p> : null}
          </div>
        </Modal>
      ) : null}
    </div>
  );
}
