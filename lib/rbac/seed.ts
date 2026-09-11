import { getDb } from "@/lib/db";
import { rbacMenus, rbacPermissions, rbacRolePermissions, rbacRoles } from "@/lib/db/schema";
import { APP_MODULE_IDS, APP_MODULE_META } from "@/config/apps";
import {
  RBAC_ACTION_META,
  RBAC_RESOURCE_META,
  type RbacAction,
  type RbacResource,
} from "./constants";

type SeedPermission = {
  name: string;
  code: string;
  resource: RbacResource;
  action: RbacAction;
  description: string;
};

const SEED_PERMISSION_SPECS: Omit<SeedPermission, "code">[] = [
  { resource: "dashboard", action: "read", name: "查看工作台", description: "打开工作台与指标" },
  { resource: "accounts", action: "read", name: "查看账号", description: "浏览账号列表与详情" },
  { resource: "accounts", action: "create", name: "新建账号", description: "创建业务账号" },
  { resource: "accounts", action: "update", name: "编辑账号", description: "修改业务账号" },
  { resource: "accounts", action: "delete", name: "删除账号", description: "删除业务账号" },
  { resource: "settings", action: "read", name: "查看应用", description: "打开应用管理" },
  { resource: "settings", action: "update", name: "配置应用", description: "新建或编辑内部/外部应用" },
  { resource: "roles", action: "read", name: "查看角色", description: "浏览角色与授权" },
  { resource: "roles", action: "create", name: "新建角色", description: "创建角色" },
  { resource: "roles", action: "update", name: "编辑角色", description: "修改角色与权限绑定" },
  { resource: "roles", action: "delete", name: "删除角色", description: "删除角色" },
  { resource: "menus", action: "read", name: "查看菜单", description: "浏览菜单目录" },
  { resource: "menus", action: "create", name: "新建菜单", description: "登记自定义菜单" },
  { resource: "menus", action: "update", name: "编辑菜单", description: "修改菜单目录项" },
  { resource: "menus", action: "delete", name: "删除菜单", description: "删除自定义菜单" },
  { resource: "permissions", action: "read", name: "查看权限", description: "浏览权限点" },
  { resource: "permissions", action: "create", name: "新建权限", description: "登记权限点" },
  { resource: "permissions", action: "update", name: "编辑权限", description: "修改权限点" },
  { resource: "permissions", action: "delete", name: "删除权限", description: "删除权限点" },
];

const SEED_PERMISSIONS: SeedPermission[] = SEED_PERMISSION_SPECS.map((item) => ({
  ...item,
  code: `${item.resource}:${item.action}`,
  description:
    item.description
    || `${RBAC_RESOURCE_META[item.resource].label} · ${RBAC_ACTION_META[item.action].label}`,
}));

const SEED_ROLES: { name: string; code: string; description: string; grant: (code: string) => boolean }[] = [
  {
    name: "超级管理员",
    code: "super_admin",
    description: "全部权限，用于基础后台运维",
    grant: () => true,
  },
  {
    name: "运营",
    code: "operator",
    description: "账号与应用日常操作，不含 RBAC 写权限",
    grant: (code) =>
      code === "dashboard:read"
      || code.startsWith("accounts:")
      || code === "settings:read"
      || code === "settings:update",
  },
  {
    name: "审计",
    code: "auditor",
    description: "只读查看全部模块，用于合规核对",
    grant: (code) => code.endsWith(":read"),
  },
  {
    name: "只读",
    code: "readonly",
    description: "工作台与账号只读",
    grant: (code) => code === "dashboard:read" || code === "accounts:read",
  },
];

let seeding: Promise<void> | null = null;

async function seedIfEmpty() {
  const db = getDb();

  const [permRow] = await db.select({ id: rbacPermissions.id }).from(rbacPermissions).limit(1);
  if (!permRow) {
    await db.insert(rbacPermissions).values(SEED_PERMISSIONS);
  }

  const [roleRow] = await db.select({ id: rbacRoles.id }).from(rbacRoles).limit(1);
  if (!roleRow) {
    const perms = await db.select().from(rbacPermissions);
    const byCode = new Map(perms.map((p) => [p.code, p.id]));
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
  }

  const [menuRow] = await db.select({ id: rbacMenus.id }).from(rbacMenus).limit(1);
  if (!menuRow) {
    await db.insert(rbacMenus).values(
      APP_MODULE_IDS.map((id, index) => ({
        name: APP_MODULE_META[id].label,
        code: id,
        path: APP_MODULE_META[id].href,
        parentId: null,
        sort: (index + 1) * 10,
        status: "active",
        moduleId: id,
        description: "内置侧栏菜单，与应用模块 ID 对齐",
      })),
    );
  }
}

/** Idempotent demo seed. Safe to call from every list endpoint. */
export async function ensureRbacDefaults() {
  if (!seeding) {
    seeding = seedIfEmpty().finally(() => {
      seeding = null;
    });
  }
  await seeding;
}
