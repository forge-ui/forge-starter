import { asc, eq, inArray } from "drizzle-orm";
import { getDb } from "@/lib/db";
import {
  rbacPermissions,
  rbacRolePermissions,
  rbacRoles,
  type RbacPermissionRow,
} from "@/lib/db/schema";
import { ensureRbacDefaults } from "@/lib/rbac/seed";
import {
  assertRbacCode,
  formatRbacDate,
  isRbacAction,
  isRbacResource,
  uniqueConstraintMessage,
} from "@/lib/rbac/constants";
import type { PermissionInput, PermissionRecord } from "./types";

function normalizeInput(input: PermissionInput, codeLocked?: string) {
  const name = input.name.trim();
  if (!name) throw new Error("请填写权限名称");
  if (!isRbacResource(input.resource)) throw new Error("资源无效");
  if (!isRbacAction(input.action)) throw new Error("操作无效");
  const code = assertRbacCode(codeLocked ?? input.code, "权限编码");
  return {
    name,
    code,
    resource: input.resource,
    action: input.action,
    description: input.description.trim(),
  };
}

async function rolesByPermissionIds(permissionIds: string[]) {
  const map = new Map<string, { id: string; name: string }[]>();
  if (permissionIds.length === 0) return map;
  const db = getDb();
  const rows = await db
    .select({
      permissionId: rbacRolePermissions.permissionId,
      roleId: rbacRoles.id,
      roleName: rbacRoles.name,
    })
    .from(rbacRolePermissions)
    .innerJoin(rbacRoles, eq(rbacRoles.id, rbacRolePermissions.roleId))
    .where(inArray(rbacRolePermissions.permissionId, permissionIds));
  for (const row of rows) {
    const list = map.get(row.permissionId) ?? [];
    list.push({ id: row.roleId, name: row.roleName });
    map.set(row.permissionId, list);
  }
  return map;
}

function toRecord(
  row: RbacPermissionRow,
  roles: { id: string; name: string }[],
): PermissionRecord {
  return {
    id: row.id,
    name: row.name,
    code: row.code,
    resource: isRbacResource(row.resource) ? row.resource : "accounts",
    action: isRbacAction(row.action) ? row.action : "read",
    description: row.description,
    roleIds: roles.map((r) => r.id),
    roleNames: roles.map((r) => r.name),
    roleCount: roles.length,
    created: formatRbacDate(row.createdAt),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function listPermissions(): Promise<PermissionRecord[]> {
  await ensureRbacDefaults();
  const db = getDb();
  const rows = await db
    .select()
    .from(rbacPermissions)
    .orderBy(asc(rbacPermissions.resource), asc(rbacPermissions.action));
  const grants = await rolesByPermissionIds(rows.map((row) => row.id));
  return rows.map((row) => toRecord(row, grants.get(row.id) ?? []));
}

export async function getPermissionById(id: string): Promise<PermissionRecord | null> {
  const db = getDb();
  const [row] = await db.select().from(rbacPermissions).where(eq(rbacPermissions.id, id)).limit(1);
  if (!row) return null;
  const grants = await rolesByPermissionIds([id]);
  return toRecord(row, grants.get(id) ?? []);
}

export async function createPermission(input: PermissionInput): Promise<PermissionRecord> {
  const db = getDb();
  const data = normalizeInput(input);
  try {
    const [row] = await db.insert(rbacPermissions).values(data).returning();
    return toRecord(row, []);
  } catch (error) {
    throw new Error(uniqueConstraintMessage(error, error instanceof Error ? error.message : "创建失败"));
  }
}

export async function updatePermission(id: string, input: PermissionInput): Promise<PermissionRecord> {
  const existing = await getPermissionById(id);
  if (!existing) throw new Error("权限不存在");
  const data = normalizeInput(input, existing.code);
  try {
    const db = getDb();
    const [row] = await db
      .update(rbacPermissions)
      .set({
        name: data.name,
        resource: data.resource,
        action: data.action,
        description: data.description,
        updatedAt: new Date(),
      })
      .where(eq(rbacPermissions.id, id))
      .returning();
    if (!row) throw new Error("权限不存在");
    return (await getPermissionById(id))!;
  } catch (error) {
    throw new Error(uniqueConstraintMessage(error, error instanceof Error ? error.message : "更新失败"));
  }
}

export async function deletePermission(id: string): Promise<void> {
  const db = getDb();
  const result = await db
    .delete(rbacPermissions)
    .where(eq(rbacPermissions.id, id))
    .returning({ id: rbacPermissions.id });
  if (result.length === 0) throw new Error("权限不存在");
}
