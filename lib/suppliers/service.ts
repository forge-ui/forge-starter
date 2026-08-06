import { desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { suppliers, type SupplierRow } from "@/lib/db/schema";
import {
  formatSupplierDate,
  isSupplierCategory,
  isSupplierStatus,
  type Supplier,
  type SupplierInput,
} from "./types";

function toSupplier(row: SupplierRow): Supplier {
  return {
    id: row.id,
    name: row.name,
    code: row.code,
    contactName: row.contactName,
    contactEmail: row.contactEmail,
    contactPhone: row.contactPhone,
    category: isSupplierCategory(row.category) ? row.category : "general",
    status: isSupplierStatus(row.status) ? row.status : "pending",
    rating: Math.min(5, Math.max(1, row.rating || 3)),
    address: row.address ?? "",
    notes: row.notes ?? "",
    created: formatSupplierDate(row.createdAt),
    updated: formatSupplierDate(row.updatedAt),
  };
}

function normalizeInput(input: SupplierInput) {
  const name = input.name.trim();
  const code = input.code.trim().toUpperCase();
  if (!name) throw new Error("请填写供应商名称");
  if (!/^[A-Z0-9_-]{2,24}$/.test(code)) {
    throw new Error("编码需 2–24 位大写字母、数字、_ 或 -");
  }
  if (!isSupplierCategory(input.category)) throw new Error("品类无效");
  if (!isSupplierStatus(input.status)) throw new Error("状态无效");
  const rating = Number(input.rating);
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    throw new Error("评级需为 1–5");
  }
  return {
    name,
    code,
    contactName: input.contactName.trim(),
    contactEmail: input.contactEmail.trim().toLowerCase(),
    contactPhone: input.contactPhone.trim(),
    category: input.category,
    status: input.status,
    rating: Math.round(rating),
    address: input.address.trim(),
    notes: input.notes.trim(),
  };
}

export async function listSuppliers(): Promise<Supplier[]> {
  const db = getDb();
  const rows = await db.select().from(suppliers).orderBy(desc(suppliers.createdAt));
  return rows.map(toSupplier);
}

export async function getSupplierById(id: string): Promise<Supplier | null> {
  const db = getDb();
  const [row] = await db.select().from(suppliers).where(eq(suppliers.id, id)).limit(1);
  return row ? toSupplier(row) : null;
}

export async function createSupplier(input: SupplierInput): Promise<Supplier> {
  const db = getDb();
  const data = normalizeInput(input);
  try {
    const [row] = await db.insert(suppliers).values(data).returning();
    return toSupplier(row);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("suppliers_code") || message.includes("code")) {
      throw new Error("供应商编码已存在");
    }
    throw error;
  }
}

export async function updateSupplier(id: string, input: SupplierInput): Promise<Supplier> {
  const existing = await getSupplierById(id);
  if (!existing) throw new Error("供应商不存在");
  const data = normalizeInput({ ...input, code: existing.code });
  const db = getDb();
  const [row] = await db
    .update(suppliers)
    .set({
      name: data.name,
      contactName: data.contactName,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      category: data.category,
      status: data.status,
      rating: data.rating,
      address: data.address,
      notes: data.notes,
      updatedAt: new Date(),
    })
    .where(eq(suppliers.id, id))
    .returning();
  if (!row) throw new Error("供应商不存在");
  return toSupplier(row);
}

export async function deleteSupplier(id: string): Promise<void> {
  const db = getDb();
  const result = await db
    .delete(suppliers)
    .where(eq(suppliers.id, id))
    .returning({ id: suppliers.id });
  if (!result.length) throw new Error("供应商不存在");
}

/** Seed demo suppliers when table is empty (dev convenience). */
export async function ensureSupplierSeed(): Promise<void> {
  const existing = await listSuppliers();
  if (existing.length > 0) return;
  const seeds: SupplierInput[] = [
    {
      name: "Shieldfy 硬件",
      code: "SUP-HW-001",
      contactName: "John Bushmill",
      contactEmail: "johnb@shieldfy.example",
      contactPhone: "+1 987 555 909",
      category: "hardware",
      status: "active",
      rating: 5,
      address: "Austin, TX",
      notes: "主供服务器与网络设备",
    },
    {
      name: "Nimbus 软件",
      code: "SUP-SW-002",
      contactName: "Mia Chen",
      contactEmail: "mia@nimbus.example",
      contactPhone: "+86 138 0000 1122",
      category: "software",
      status: "active",
      rating: 4,
      address: "上海",
      notes: "SaaS 与许可年费",
    },
    {
      name: "办公优选",
      code: "SUP-OF-003",
      contactName: "王敏",
      contactEmail: "wm@office.example",
      contactPhone: "021-8888-0001",
      category: "office",
      status: "pending",
      rating: 3,
      address: "杭州",
      notes: "待资质复核",
    },
  ];
  for (const s of seeds) {
    try {
      await createSupplier(s);
    } catch {
      // ignore race
    }
  }
}
