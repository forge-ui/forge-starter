import { desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { adminAccounts, type AdminAccountRow } from "@/lib/db/schema";
import {
  avatarUrlFor,
  formatAccountDate,
  isAccountRole,
  isAccountStatus,
  type AccountInput,
  type AdminAccount,
} from "./types";

function toAdminAccount(row: AdminAccountRow): AdminAccount {
  const role = isAccountRole(row.role) ? row.role : "只读";
  const status = isAccountStatus(row.status) ? row.status : "pending";
  return {
    id: row.id,
    name: row.name,
    username: row.username,
    email: row.email,
    phone: row.phone,
    role,
    department: row.department,
    status,
    loginCount: row.loginCount,
    lastLogin: row.lastLogin?.trim() || "—",
    created: formatAccountDate(row.createdAt),
    avatarUrl: row.avatarUrl || avatarUrlFor(row.username || row.email),
    notes: row.notes ?? "",
  };
}

function normalizeInput(input: AccountInput) {
  const name = input.name.trim();
  const username = input.username.trim().toLowerCase();
  const email = input.email.trim().toLowerCase();
  const phone = input.phone.trim();
  if (!name) throw new Error("请填写姓名");
  if (!/^[a-z0-9_]{3,32}$/.test(username)) {
    throw new Error("用户名需 3–32 位小写字母、数字或下划线");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("邮箱格式不正确");
  }
  if (!phone) throw new Error("请填写手机号");
  if (!isAccountRole(input.role)) throw new Error("角色无效");
  if (!isAccountStatus(input.status)) throw new Error("状态无效");
  return {
    name,
    username,
    email,
    phone,
    role: input.role,
    department: input.department.trim() || "平台",
    status: input.status,
    notes: input.notes.trim(),
  };
}

export async function listAdminAccounts(): Promise<AdminAccount[]> {
  const db = getDb();
  const rows = await db
    .select()
    .from(adminAccounts)
    .orderBy(desc(adminAccounts.createdAt));
  return rows.map(toAdminAccount);
}

export async function getAdminAccountById(id: string): Promise<AdminAccount | null> {
  const db = getDb();
  const [row] = await db
    .select()
    .from(adminAccounts)
    .where(eq(adminAccounts.id, id))
    .limit(1);
  return row ? toAdminAccount(row) : null;
}

export async function createAdminAccount(input: AccountInput): Promise<AdminAccount> {
  const db = getDb();
  const data = normalizeInput(input);
  try {
    const [row] = await db
      .insert(adminAccounts)
      .values({
        ...data,
        loginCount: 0,
        lastLogin: null,
        avatarUrl: avatarUrlFor(data.username),
      })
      .returning();
    return toAdminAccount(row);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("admin_accounts_username") || message.includes("username")) {
      throw new Error("用户名已被占用");
    }
    if (message.includes("admin_accounts_email") || message.includes("email")) {
      throw new Error("邮箱已被占用");
    }
    throw error;
  }
}

export async function updateAdminAccount(
  id: string,
  input: AccountInput,
): Promise<AdminAccount> {
  const db = getDb();
  const existing = await getAdminAccountById(id);
  if (!existing) throw new Error("账号不存在");

  const data = normalizeInput({
    ...input,
    // Username is immutable after create
    username: existing.username,
  });

  try {
    const [row] = await db
      .update(adminAccounts)
      .set({
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        department: data.department,
        status: data.status,
        notes: data.notes,
        updatedAt: new Date(),
      })
      .where(eq(adminAccounts.id, id))
      .returning();
    if (!row) throw new Error("账号不存在");
    return toAdminAccount(row);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("admin_accounts_email") || message.includes("email")) {
      throw new Error("邮箱已被占用");
    }
    throw error;
  }
}

export async function deleteAdminAccount(id: string): Promise<void> {
  const db = getDb();
  const result = await db
    .delete(adminAccounts)
    .where(eq(adminAccounts.id, id))
    .returning({ id: adminAccounts.id });
  if (result.length === 0) throw new Error("账号不存在");
}
