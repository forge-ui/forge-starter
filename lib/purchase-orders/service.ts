import { and, desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { purchaseOrders, type PurchaseOrderRow } from "@/lib/db/schema";
import { getSupplierById } from "@/lib/suppliers/service";
import {
  formatMoney,
  formatPoDate,
  formatPoDateTime,
  isPoStatus,
  sumItemsCents,
  type PurchaseLineItem,
  type PurchaseOrder,
  type PurchaseOrderCreateInput,
  type PurchaseOrderDecideInput,
  type PurchaseOrderStatus,
} from "./types";

function parseItems(raw: string): PurchaseLineItem[] {
  try {
    const data = JSON.parse(raw) as PurchaseLineItem[];
    if (!Array.isArray(data)) return [];
    return data.map((i) => ({
      name: String(i.name ?? ""),
      quantity: Number(i.quantity) || 0,
      unitPriceCents: Number(i.unitPriceCents) || 0,
    }));
  } catch {
    return [];
  }
}

function toPo(row: PurchaseOrderRow): PurchaseOrder {
  const items = parseItems(row.itemsJson);
  const amountCents = row.amountCents || sumItemsCents(items);
  const status = isPoStatus(row.status) ? row.status : "pending";
  return {
    id: row.id,
    orderNo: row.orderNo,
    title: row.title,
    supplierId: row.supplierId,
    supplierName: row.supplierName ?? "",
    status,
    amountCents,
    amountLabel: formatMoney(amountCents, row.currency || "CNY"),
    currency: row.currency || "CNY",
    requesterName: row.requesterName,
    requesterUsername: row.requesterUsername,
    items,
    reason: row.reason ?? "",
    approverName: row.approverName ?? "",
    approverUsername: row.approverUsername ?? "",
    approverComment: row.approverComment ?? "",
    decidedAt: row.decidedAt ? formatPoDateTime(row.decidedAt) : "—",
    created: formatPoDateTime(row.createdAt),
    updated: formatPoDate(row.updatedAt),
  };
}

function validateItems(items: PurchaseLineItem[]) {
  if (!items.length) throw new Error("请至少添加一行采购明细");
  for (const item of items) {
    if (!item.name.trim()) throw new Error("明细名称不能为空");
    if (item.quantity <= 0) throw new Error("数量须大于 0");
    if (item.unitPriceCents < 0) throw new Error("单价不能为负");
  }
}

function nextOrderNo() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const r = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `PO-${y}${m}${day}-${r}`;
}

export async function listPurchaseOrders(filter?: {
  status?: PurchaseOrderStatus;
  requesterUsername?: string;
}): Promise<PurchaseOrder[]> {
  const db = getDb();
  const rows = await db
    .select()
    .from(purchaseOrders)
    .orderBy(desc(purchaseOrders.createdAt));
  return rows
    .map(toPo)
    .filter((item) => {
      if (filter?.status && item.status !== filter.status) return false;
      if (filter?.requesterUsername && item.requesterUsername !== filter.requesterUsername) {
        return false;
      }
      return true;
    });
}

export async function getPurchaseOrderById(id: string): Promise<PurchaseOrder | null> {
  const db = getDb();
  const [row] = await db
    .select()
    .from(purchaseOrders)
    .where(eq(purchaseOrders.id, id))
    .limit(1);
  return row ? toPo(row) : null;
}

export async function createPurchaseOrder(
  input: PurchaseOrderCreateInput,
  requester: { name: string; username: string },
): Promise<PurchaseOrder> {
  const title = input.title.trim();
  if (!title) throw new Error("请填写采购标题");
  const items = input.items.map((i) => ({
    name: i.name.trim(),
    quantity: Number(i.quantity) || 0,
    unitPriceCents: Math.round(Number(i.unitPriceCents) || 0),
  }));
  validateItems(items);
  const amountCents = sumItemsCents(items);

  let supplierId = input.supplierId ?? null;
  let supplierName = (input.supplierName ?? "").trim();
  if (supplierId) {
    const supplier = await getSupplierById(supplierId);
    if (!supplier) throw new Error("供应商不存在");
    supplierName = supplier.name;
  }
  if (!supplierName) throw new Error("请选择或填写供应商");

  const db = getDb();
  const [row] = await db
    .insert(purchaseOrders)
    .values({
      orderNo: nextOrderNo(),
      title,
      supplierId,
      supplierName,
      status: "pending",
      amountCents,
      currency: input.currency?.trim() || "CNY",
      requesterName: requester.name || requester.username,
      requesterUsername: requester.username,
      itemsJson: JSON.stringify(items),
      reason: input.reason.trim(),
    })
    .returning();
  return toPo(row);
}

export async function decidePurchaseOrder(
  id: string,
  input: PurchaseOrderDecideInput,
  approver: { name: string; username: string },
): Promise<PurchaseOrder> {
  const existing = await getPurchaseOrderById(id);
  if (!existing) throw new Error("采购单不存在");
  if (existing.status !== "pending") throw new Error("该单据已处理");
  if (existing.requesterUsername === approver.username) {
    throw new Error("不能审批自己发起的采购单");
  }
  const comment = input.comment.trim();
  if (input.action === "reject" && !comment) throw new Error("驳回时请填写意见");

  const status: PurchaseOrderStatus = input.action === "approve" ? "approved" : "rejected";
  const db = getDb();
  const [row] = await db
    .update(purchaseOrders)
    .set({
      status,
      approverName: approver.name || approver.username,
      approverUsername: approver.username,
      approverComment: comment,
      decidedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(and(eq(purchaseOrders.id, id), eq(purchaseOrders.status, "pending")))
    .returning();
  if (!row) throw new Error("审批失败，请刷新重试");
  return toPo(row);
}

export async function markPurchaseOrdered(
  id: string,
  username: string,
): Promise<PurchaseOrder> {
  const existing = await getPurchaseOrderById(id);
  if (!existing) throw new Error("采购单不存在");
  if (existing.status !== "approved") throw new Error("仅已通过单据可标记下单");
  if (existing.requesterUsername !== username && existing.approverUsername !== username) {
    throw new Error("无权限标记下单");
  }
  const db = getDb();
  const [row] = await db
    .update(purchaseOrders)
    .set({ status: "ordered", updatedAt: new Date() })
    .where(eq(purchaseOrders.id, id))
    .returning();
  if (!row) throw new Error("更新失败");
  return toPo(row);
}

export async function cancelPurchaseOrder(
  id: string,
  username: string,
): Promise<PurchaseOrder> {
  const existing = await getPurchaseOrderById(id);
  if (!existing) throw new Error("采购单不存在");
  if (existing.requesterUsername !== username) throw new Error("只能撤销自己的单据");
  if (existing.status !== "pending") throw new Error("仅待审批可撤销");
  const db = getDb();
  const [row] = await db
    .update(purchaseOrders)
    .set({ status: "cancelled", updatedAt: new Date() })
    .where(eq(purchaseOrders.id, id))
    .returning();
  if (!row) throw new Error("撤销失败");
  return toPo(row);
}
