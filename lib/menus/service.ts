import { asc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { rbacMenus, type RbacMenuRow } from "@/lib/db/schema";
import { ensureRbacDefaults } from "@/lib/rbac/seed";
import {
  assertRbacCode,
  formatRbacDate,
  isRbacStatus,
  uniqueConstraintMessage,
} from "@/lib/rbac/constants";
import type { MenuInput, MenuRecord } from "./types";

function normalizePath(value: string) {
  const path = value.trim();
  if (!path) throw new Error("请填写路径");
  if (!path.startsWith("/")) throw new Error("路径需以 / 开头");
  return path.endsWith("/") ? path : `${path}/`;
}

function normalizeInput(input: MenuInput, locked?: { code: string; path?: string }) {
  const name = input.name.trim();
  if (!name) throw new Error("请填写菜单名称");
  const code = assertRbacCode(locked?.code ?? input.code, "菜单编码");
  const path = locked?.path ?? normalizePath(input.path);
  if (!isRbacStatus(input.status)) throw new Error("状态无效");
  const sort = Number.isFinite(input.sort) ? Math.trunc(input.sort) : NaN;
  if (!Number.isFinite(sort) || sort < 0 || sort > 9999) {
    throw new Error("排序需为 0–9999 的整数");
  }
  const parentId = input.parentId?.trim() || null;
  return {
    name,
    code,
    path,
    parentId,
    sort,
    status: input.status,
    description: input.description.trim(),
  };
}

function toRecord(row: RbacMenuRow, parentName: string | null): MenuRecord {
  return {
    id: row.id,
    name: row.name,
    code: row.code,
    path: row.path,
    parentId: row.parentId,
    parentName,
    sort: row.sort,
    status: isRbacStatus(row.status) ? row.status : "disabled",
    moduleId: row.moduleId,
    builtin: Boolean(row.moduleId),
    description: row.description,
    created: formatRbacDate(row.createdAt),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function withParents(rows: RbacMenuRow[]): MenuRecord[] {
  const names = new Map(rows.map((row) => [row.id, row.name]));
  return rows
    .slice()
    .sort((a, b) => a.sort - b.sort || a.name.localeCompare(b.name, "zh-CN"))
    .map((row) => toRecord(row, row.parentId ? names.get(row.parentId) ?? null : null));
}

export async function listMenus(): Promise<MenuRecord[]> {
  await ensureRbacDefaults();
  const db = getDb();
  const rows = await db.select().from(rbacMenus).orderBy(asc(rbacMenus.sort), asc(rbacMenus.name));
  return withParents(rows);
}

export async function getMenuById(id: string): Promise<MenuRecord | null> {
  const db = getDb();
  const rows = await db.select().from(rbacMenus);
  const row = rows.find((item) => item.id === id);
  if (!row) return null;
  return withParents(rows).find((item) => item.id === id) ?? null;
}

async function assertParent(parentId: string | null, selfId?: string) {
  if (!parentId) return;
  if (selfId && parentId === selfId) throw new Error("不能将菜单挂到自身");
  const parent = await getMenuById(parentId);
  if (!parent) throw new Error("上级菜单不存在");
  if (parent.parentId) throw new Error("只支持两级菜单，请选择一级菜单作为上级");
}

export async function createMenu(input: MenuInput): Promise<MenuRecord> {
  const data = normalizeInput(input);
  await assertParent(data.parentId);
  const db = getDb();
  try {
    const [row] = await db
      .insert(rbacMenus)
      .values({
        name: data.name,
        code: data.code,
        path: data.path,
        parentId: data.parentId,
        sort: data.sort,
        status: data.status,
        moduleId: null,
        description: data.description,
      })
      .returning();
    return (await getMenuById(row.id))!;
  } catch (error) {
    throw new Error(uniqueConstraintMessage(error, error instanceof Error ? error.message : "创建失败"));
  }
}

export async function updateMenu(id: string, input: MenuInput): Promise<MenuRecord> {
  const existing = await getMenuById(id);
  if (!existing) throw new Error("菜单不存在");
  const data = normalizeInput(input, {
    code: existing.code,
    path: existing.builtin ? existing.path : undefined,
  });
  await assertParent(data.parentId, id);
  if (existing.builtin && data.parentId) {
    throw new Error("内置菜单必须是一级菜单");
  }
  try {
    const db = getDb();
    const [row] = await db
      .update(rbacMenus)
      .set({
        name: data.name,
        path: existing.builtin ? existing.path : data.path,
        parentId: existing.builtin ? null : data.parentId,
        sort: data.sort,
        status: data.status,
        description: data.description,
        updatedAt: new Date(),
      })
      .where(eq(rbacMenus.id, id))
      .returning();
    if (!row) throw new Error("菜单不存在");
    return (await getMenuById(id))!;
  } catch (error) {
    throw new Error(uniqueConstraintMessage(error, error instanceof Error ? error.message : "更新失败"));
  }
}

export async function deleteMenu(id: string): Promise<void> {
  const existing = await getMenuById(id);
  if (!existing) throw new Error("菜单不存在");
  if (existing.builtin) throw new Error("内置菜单不能删除");
  const db = getDb();
  const children = await db
    .select({ id: rbacMenus.id })
    .from(rbacMenus)
    .where(eq(rbacMenus.parentId, id))
    .limit(1);
  if (children.length > 0) throw new Error("请先删除或改挂子菜单");
  const result = await db.delete(rbacMenus).where(eq(rbacMenus.id, id)).returning({ id: rbacMenus.id });
  if (result.length === 0) throw new Error("菜单不存在");
}
