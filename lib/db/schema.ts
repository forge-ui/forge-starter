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
 * RBAC demo tables — not login users.
 * Sidebar still reads `config/menu.tsx` + `AppEntry.modules`;
 * these rows are the admin catalog (roles / permissions / menus).
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

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type AdminAccountRow = typeof adminAccounts.$inferSelect;
export type NewAdminAccountRow = typeof adminAccounts.$inferInsert;
export type RbacRoleRow = typeof rbacRoles.$inferSelect;
export type RbacPermissionRow = typeof rbacPermissions.$inferSelect;
export type RbacMenuRow = typeof rbacMenus.$inferSelect;
