import { eq, inArray, sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { rbacMenus, rbacPermissions, rbacRolePermissions, rbacRoles } from "@/lib/db/schema";
import { APP_MODULE_IDS, APP_MODULE_META } from "@/config/apps";
import { SEED_PERMISSIONS, SEED_ROLES } from "./defaults";

let seeding: Promise<void> | null = null;

async function ensurePermissions() {
  const db = getDb();
  const existing = await db.select().from(rbacPermissions);
  const byCode = new Set(existing.map((row) => row.code));
  const missing = SEED_PERMISSIONS.filter((item) => !byCode.has(item.code));
  if (missing.length) {
    await db.insert(rbacPermissions).values(missing);
  }
}

async function ensureRoles(db: Parameters<Parameters<ReturnType<typeof getDb>["transaction"]>[0]>[0]) {
  const existing = await db.select().from(rbacRoles);
  if (!existing.length) {
    const perms = await db.select().from(rbacPermissions);
    const byCode = new Map(perms.map((perm) => [perm.code, perm.id]));
    const roles = await db
      .insert(rbacRoles)
      .values(
        SEED_ROLES.map((role) => ({
          name: role.name,
          code: role.code,
          description: role.description,
          status: "active",
        })),
      )
      .returning();

    const grants = roles.flatMap((role) => {
      const spec = SEED_ROLES.find((item) => item.code === role.code);
      if (!spec) return [];
      return perms
        .filter((perm) => spec.grant(perm.code))
        .map((perm) => ({
          roleId: role.id,
          permissionId: byCode.get(perm.code) ?? perm.id,
        }));
    });
    if (grants.length) {
      await db.insert(rbacRolePermissions).values(grants);
    }
    return;
  }
}

async function ensureMenus() {
  const db = getDb();
  const existing = await db.select().from(rbacMenus);
  const byCode = new Set(existing.map((row) => row.code));
  const missing = APP_MODULE_IDS.filter((id) => !byCode.has(id));
  if (!missing.length) return;
  const maxSort = existing.reduce((n, row) => Math.max(n, row.sort), 0);
  await db.insert(rbacMenus).values(
    missing.map((id, index) => ({
      name: APP_MODULE_META[id].label,
      code: id,
      path: APP_MODULE_META[id].href,
      parentId: null,
      sort: maxSort + (index + 1) * 10,
      status: "active",
      moduleId: id,
      description: "内置侧栏菜单，与应用模块 ID 对齐",
    })),
  );
}

async function removeRetiredApprovals() {
  const db = getDb();
  const retired = await db.select().from(rbacPermissions).where(eq(rbacPermissions.resource, "approvals"));
  if (retired.length) {
    const ids = retired.map((row) => row.id);
    await db.delete(rbacRolePermissions).where(inArray(rbacRolePermissions.permissionId, ids));
    await db.delete(rbacPermissions).where(eq(rbacPermissions.resource, "approvals"));
  }
  await db.delete(rbacMenus).where(eq(rbacMenus.code, "approvals"));
}

async function seedIfNeeded() {
  await removeRetiredApprovals();
  await ensurePermissions();
  await ensureMenus();
}

/** Runtime catalog maintenance; never creates roles or grants. */
export async function ensureRbacDefaults() {
  if (!seeding) {
    seeding = seedIfNeeded().finally(() => {
      seeding = null;
    });
  }
  await seeding;
}

/** Explicit operator bootstrap; existing roles and grants are preserved. */
export async function initializeRbacDefaults() {
  await ensureRbacDefaults();
  await getDb().transaction(async (tx) => {
    // Serialize explicit bootstrap across processes.
    await tx.execute(sql`select pg_advisory_xact_lock(79310421)`);
    await ensureRoles(tx);
  });
}
