export type PurchaseOrderStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "ordered"
  | "cancelled";

export type PurchaseLineItem = {
  name: string;
  quantity: number;
  unitPriceCents: number;
};

export type PurchaseOrder = {
  id: string;
  orderNo: string;
  title: string;
  supplierId: string | null;
  supplierName: string;
  status: PurchaseOrderStatus;
  amountCents: number;
  amountLabel: string;
  currency: string;
  requesterName: string;
  requesterUsername: string;
  items: PurchaseLineItem[];
  reason: string;
  approverName: string;
  approverUsername: string;
  approverComment: string;
  decidedAt: string;
  created: string;
  updated: string;
};

export type PurchaseOrderCreateInput = {
  title: string;
  supplierId?: string | null;
  supplierName?: string;
  currency?: string;
  items: PurchaseLineItem[];
  reason: string;
};

export type PurchaseOrderDecideInput = {
  action: "approve" | "reject";
  comment: string;
};

export const PO_STATUS_META: Record<
  PurchaseOrderStatus,
  { label: string; color: "yellow" | "green" | "red" | "blue" | "grey" }
> = {
  pending: { label: "待审批", color: "yellow" },
  approved: { label: "已通过", color: "green" },
  rejected: { label: "已驳回", color: "red" },
  ordered: { label: "已下单", color: "blue" },
  cancelled: { label: "已撤销", color: "grey" },
};

const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function formatPoDate(date: Date) {
  return `${String(date.getDate()).padStart(2, "0")} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatPoDateTime(date: Date) {
  return `${formatPoDate(date)} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

export function formatMoney(cents: number, currency = "CNY") {
  const amount = cents / 100;
  if (currency === "CNY") return `¥ ${amount.toLocaleString("zh-CN", { minimumFractionDigits: 2 })}`;
  return `${currency} ${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
}

export function isPoStatus(v: string): v is PurchaseOrderStatus {
  return (
    v === "pending"
    || v === "approved"
    || v === "rejected"
    || v === "ordered"
    || v === "cancelled"
  );
}

export function sumItemsCents(items: PurchaseLineItem[]) {
  return items.reduce((sum, i) => sum + Math.max(0, i.quantity) * Math.max(0, i.unitPriceCents), 0);
}
