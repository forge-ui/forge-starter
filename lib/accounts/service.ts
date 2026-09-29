import { accountCreateSchema, toAccountInput } from "./input";
import { OperationError, type Transaction } from "@/lib/semantic/operations";
import { and, desc, eq, sql } from "drizzle-orm";
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
    revision: row.revision,
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
  const data = accountCreateSchema.parse({ ...input, department: input.department.trim() || "平台", notes: input.notes.trim() });
  return toAccountInput(data, data.username);
}

export async function listAdminAccounts(): Promise<AdminAccount[]> {
  const db = getDb();
  const rows = await db
    .select()
    .from(adminAccounts)
    .orderBy(desc(adminAccounts.createdAt));
  return rows.map(toAdminAccount);
}

export async function getAdminAccountById(id: string, transaction?: Transaction): Promise<AdminAccount | null> {
  const db = transaction ?? getDb();
  const [row] = await db
    .select()
    .from(adminAccounts)
    .where(eq(adminAccounts.id, id))
    .limit(1);
  return row ? toAdminAccount(row) : null;
}

export async function createAdminAccount(input: AccountInput, transaction?: Transaction): Promise<AdminAccount> {
  const db = transaction ?? getDb();
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
  expectedRevision?: number,
  transaction?: Transaction,
): Promise<AdminAccount> {
  const db = transaction ?? getDb();
  const existing = await getAdminAccountById(id, transaction);
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
        revision: sql`${adminAccounts.revision} + 1`,
      })
      .where(and(eq(adminAccounts.id, id), expectedRevision === undefined ? undefined : eq(adminAccounts.revision, expectedRevision)))
      .returning();
    if (!row) throw new OperationError("账号已被修改或删除，请刷新后重试");
    return toAdminAccount(row);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("admin_accounts_email") || message.includes("email")) {
      throw new Error("邮箱已被占用");
    }
    throw error;
  }
}

export async function deleteAdminAccount(id: string, expectedRevision?: number, transaction?: Transaction): Promise<void> {
  const db = transaction ?? getDb();
  const result = await db
    .delete(adminAccounts)
    .where(and(eq(adminAccounts.id, id), expectedRevision === undefined ? undefined : eq(adminAccounts.revision, expectedRevision)))
    .returning({ id: adminAccounts.id });
  if (result.length === 0) throw new OperationError("账号已被修改或删除，请刷新后重试");
}
