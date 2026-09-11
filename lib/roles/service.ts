import { desc, eq, inArray } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { rbacRolePermissions, rbacRoles, type RbacRoleRow } from "@/lib/db/schema";
import { ensureRbacDefaults } from "@/lib/rbac/seed";
import {
  assertRbacCode,
  formatRbacDate,
  isRbacStatus,
  uniqueConstraintMessage,
} from "@/lib/rbac/constants";
import type { RoleInput, RoleRecord } from "./types";

function normalizeInput(input: RoleInput, codeLocked?: string) {
  const name = input.name.trim();
  if (!name) throw new Error("请填写角色名称");
  const code = assertRbacCode(codeLocked ?? input.code, "角色编码");
  if (!isRbacStatus(input.status)) throw new Error("状态无效");
  const permissionIds = Array.from(new Set(input.permissionIds.filter(Boolean)));
  return {
    name,
    code,
    description: input.description.trim(),
    status: input.status,
    permissionIds,
  };
}

async function replaceGrants(roleId: string, permissionIds: string[]) {
  const db = getDb();
  await db.delete(rbacRolePermissions).where(eq(rbacRolePermissions.roleId, roleId));
  if (permissionIds.length === 0) return;
  await db.insert(rbacRolePermissions).values(
    permissionIds.map((permissionId) => ({ roleId, permissionId })),
  );
}

async function grantsByRoleIds(roleIds: string[]) {
  const map = new Map<string, string[]>();
  if (roleIds.length === 0) return map;
  const db = getDb();
  const rows = await db
    .select()
    .from(rbacRolePermissions)
    .where(inArray(rbacRolePermissions.roleId, roleIds));
  for (const row of rows) {
    const list = map.get(row.roleId) ?? [];
    list.push(row.permissionId);
    map.set(row.roleId, list);
  }
  return map;
}

function toRecord(row: RbacRoleRow, permissionIds: string[]): RoleRecord {
  return {
    id: row.id,
    name: row.name,
    code: row.code,
    description: row.description,
    status: isRbacStatus(row.status) ? row.status : "disabled",
    permissionIds,
    permissionCount: permissionIds.length,
    created: formatRbacDate(row.createdAt),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function listRoles(): Promise<RoleRecord[]> {
  await ensureRbacDefaults();
  const db = getDb();
  const rows = await db.select().from(rbacRoles).orderBy(desc(rbacRoles.createdAt));
  const grants = await grantsByRoleIds(rows.map((row) => row.id));
  return rows.map((row) => toRecord(row, grants.get(row.id) ?? []));
}

export async function getRoleById(id: string): Promise<RoleRecord | null> {
  const db = getDb();
  const [row] = await db.select().from(rbacRoles).where(eq(rbacRoles.id, id)).limit(1);
  if (!row) return null;
  const grants = await grantsByRoleIds([id]);
  return toRecord(row, grants.get(id) ?? []);
}

export async function createRole(input: RoleInput): Promise<RoleRecord> {
  const db = getDb();
  const data = normalizeInput(input);
  try {
    const [row] = await db
      .insert(rbacRoles)
      .values({
        name: data.name,
        code: data.code,
        description: data.description,
        status: data.status,
      })
      .returning();
    await replaceGrants(row.id, data.permissionIds);
    return (await getRoleById(row.id))!;
  } catch (error) {
    throw new Error(uniqueConstraintMessage(error, error instanceof Error ? error.message : "创建失败"));
  }
}

export async function updateRole(id: string, input: RoleInput): Promise<RoleRecord> {
  const existing = await getRoleById(id);
  if (!existing) throw new Error("角色不存在");
  const data = normalizeInput(input, existing.code);
  try {
    const db = getDb();
    const [row] = await db
      .update(rbacRoles)
      .set({
        name: data.name,
        description: data.description,
        status: data.status,
        updatedAt: new Date(),
      })
      .where(eq(rbacRoles.id, id))
      .returning();
    if (!row) throw new Error("角色不存在");
    await replaceGrants(id, data.permissionIds);
    return (await getRoleById(id))!;
  } catch (error) {
    throw new Error(uniqueConstraintMessage(error, error instanceof Error ? error.message : "更新失败"));
  }
}

export async function deleteRole(id: string): Promise<void> {
  const db = getDb();
  const result = await db.delete(rbacRoles).where(eq(rbacRoles.id, id)).returning({ id: rbacRoles.id });
  if (result.length === 0) throw new Error("角色不存在");
}
