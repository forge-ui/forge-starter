import {
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    username: text("username").notNull(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    displayName: text("display_name").notNull(),
    /** Login-side RBAC role code (`rbac_roles.code`). Not the business `admin_accounts.role`. */
    roleCode: text("role_code").notNull().default("super_admin"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    emailVerifiedAt: timestamp("email_verified_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("users_username_uidx").on(table.username),
    uniqueIndex("users_email_uidx").on(table.email),
  ],
);

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/** Business domain: managed admin accounts (not login users table). */
export const adminAccounts = pgTable(
  "admin_accounts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    username: text("username").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull().default(""),
    role: text("role").notNull(),
    department: text("department").notNull(),
    status: text("status").notNull().default("pending"),
    loginCount: integer("login_count").notNull().default(0),
    lastLogin: text("last_login"),
    notes: text("notes").notNull().default(""),
    avatarUrl: text("avatar_url").notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("admin_accounts_username_uidx").on(table.username),
    uniqueIndex("admin_accounts_email_uidx").on(table.email),
  ],
);

/**
 * RBAC catalog — not login users.
 * Sidebar = `config/menu.tsx` ∩ 当前应用 `modules` ∩ 登录用户角色的 `:read` 权限。
 * `rbac_menus` 只是目录：自定义行不会进侧栏，除非同时写入 APP_MODULE_IDS + MODULE_MENU。
 */
export const rbacRoles = pgTable(
  "rbac_roles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    code: text("code").notNull(),
    description: text("description").notNull().default(""),
    status: text("status").notNull().default("active"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex("rbac_roles_code_uidx").on(table.code)],
);

export const rbacPermissions = pgTable(
  "rbac_permissions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    code: text("code").notNull(),
    resource: text("resource").notNull(),
    action: text("action").notNull(),
    description: text("description").notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex("rbac_permissions_code_uidx").on(table.code)],
);

export const rbacRolePermissions = pgTable(
  "rbac_role_permissions",
  {
    roleId: uuid("role_id")
      .notNull()
      .references(() => rbacRoles.id, { onDelete: "cascade" }),
    permissionId: uuid("permission_id")
      .notNull()
      .references(() => rbacPermissions.id, { onDelete: "cascade" }),
  },
  (table) => [uniqueIndex("rbac_role_permissions_uidx").on(table.roleId, table.permissionId)],
);

export const rbacMenus = pgTable(
  "rbac_menus",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    code: text("code").notNull(),
    path: text("path").notNull(),
    parentId: uuid("parent_id"),
    sort: integer("sort").notNull().default(0),
    status: text("status").notNull().default("active"),
    moduleId: text("module_id"),
    description: text("description").notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex("rbac_menus_code_uidx").on(table.code)],
);

/** OA approval requests (single-step light-template workflow). */
export const approvalRequests = pgTable("approval_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  type: text("type").notNull(),
  title: text("title").notNull(),
  status: text("status").notNull().default("pending"),
  applicantName: text("applicant_name").notNull(),
  applicantUsername: text("applicant_username").notNull(),
  applicantEmail: text("applicant_email").notNull().default(""),
  formData: text("form_data").notNull().default("{}"),
  approverName: text("approver_name"),
  approverUsername: text("approver_username"),
  approverComment: text("approver_comment").notNull().default(""),
  decidedAt: timestamp("decided_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type AdminAccountRow = typeof adminAccounts.$inferSelect;
export type NewAdminAccountRow = typeof adminAccounts.$inferInsert;
export type RbacRoleRow = typeof rbacRoles.$inferSelect;
export type RbacPermissionRow = typeof rbacPermissions.$inferSelect;
export type RbacMenuRow = typeof rbacMenus.$inferSelect;
export type ApprovalRequestRow = typeof approvalRequests.$inferSelect;
export type NewApprovalRequestRow = typeof approvalRequests.$inferInsert;
