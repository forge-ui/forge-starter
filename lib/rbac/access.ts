import { eq } from "drizzle-orm";
import { APP_MODULE_IDS, type AppModuleId } from "@/config/apps";
import { getAuthMode } from "@/lib/auth/config";
import { jsonError } from "@/lib/auth/http";
import { requireSession, type SessionUser } from "@/lib/auth/session";
import type { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { rbacPermissions, rbacRolePermissions, rbacRoles } from "@/lib/db/schema";
import type { RbacAction, RbacResource } from "./constants";
import {
  isSuperAdminRole,
  resolveLoginRoleCode,
  seedPermissionCodesForRole,
  seedRoleName,
} from "./defaults";
import { ensureRbacDefaults } from "./seed";

export type AccessContext = {
  roleCode: string;
  roleName: string;
  permissionCodes: string[];
  allowedModules: AppModuleId[];
  isSuperAdmin: boolean;
};

export type RequireAccessResult =
  | { ok: true; session: SessionUser; access: AccessContext }
  | { ok: false; response: NextResponse };

function modulesFromPermissions(codes: string[], isSuperAdmin: boolean): AppModuleId[] {
  if (isSuperAdmin) return [...APP_MODULE_IDS];
  const readable = new Set(
    codes
      .filter((code) => code.endsWith(":read"))
      .map((code) => code.slice(0, -":read".length)),
  );
  return APP_MODULE_IDS.filter((id) => readable.has(id));
}

function accessFromCodes(roleCode: string, roleName: string, permissionCodes: string[]): AccessContext {
  const isSuperAdmin = isSuperAdminRole(roleCode);
  return {
    roleCode,
    roleName,
    permissionCodes: isSuperAdmin ? seedPermissionCodesForRole("super_admin") : permissionCodes,
    allowedModules: modulesFromPermissions(permissionCodes, isSuperAdmin),
    isSuperAdmin,
  };
}

export function roleCodeForSession(session: SessionUser): string {
  if (getAuthMode() === "demo") {
    return resolveLoginRoleCode(session.username);
  }
  const stored = session.roleCode?.trim();
  if (stored) return stored;
  return resolveLoginRoleCode(session.username);
}

function fallbackAccess(roleCode: string): AccessContext {
  const codes = seedPermissionCodesForRole(roleCode);
  return accessFromCodes(roleCode, seedRoleName(roleCode), codes);
}

async function loadAccessFromDb(roleCode: string): Promise<AccessContext | null> {
  try {
    await ensureRbacDefaults();
    const db = getDb();
    const [role] = await db.select().from(rbacRoles).where(eq(rbacRoles.code, roleCode)).limit(1);
    if (!role) return null;
    if (role.status !== "active") {
      return {
        roleCode: role.code,
        roleName: role.name,
        permissionCodes: [],
        allowedModules: [],
        isSuperAdmin: false,
      };
    }
    if (isSuperAdminRole(role.code)) {
      return accessFromCodes(role.code, role.name, seedPermissionCodesForRole("super_admin"));
    }
    const grants = await db
      .select({ code: rbacPermissions.code })
      .from(rbacRolePermissions)
      .innerJoin(rbacPermissions, eq(rbacRolePermissions.permissionId, rbacPermissions.id))
      .where(eq(rbacRolePermissions.roleId, role.id));
    return accessFromCodes(
      role.code,
      role.name,
      grants.map((row) => row.code),
    );
  } catch {
    return null;
  }
}

export async function resolveAccess(session: SessionUser): Promise<AccessContext> {
  const roleCode = roleCodeForSession(session);
  const fromDb = await loadAccessFromDb(roleCode);
  return fromDb ?? fallbackAccess(roleCode);
}

export function hasPermission(access: AccessContext, resource: RbacResource, action: RbacAction) {
  if (access.isSuperAdmin) return true;
  return access.permissionCodes.includes(`${resource}:${action}`);
}

export async function requirePermission(
  resource: RbacResource,
  action: RbacAction,
): Promise<RequireAccessResult> {
  const auth = await requireSession();
  if (!auth.ok) return auth;
  const access = await resolveAccess(auth.session);
  if (!hasPermission(access, resource, action)) {
    return { ok: false, response: jsonError("没有权限执行此操作", 403) };
  }
  return { ok: true, session: auth.session, access };
}

export async function requireRole(...codes: string[]): Promise<RequireAccessResult> {
  const auth = await requireSession();
  if (!auth.ok) return auth;
  const access = await resolveAccess(auth.session);
  if (access.isSuperAdmin || codes.includes(access.roleCode)) {
    return { ok: true, session: auth.session, access };
  }
  return { ok: false, response: jsonError("当前角色无权访问", 403) };
}
