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

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type AdminAccountRow = typeof adminAccounts.$inferSelect;
export type NewAdminAccountRow = typeof adminAccounts.$inferInsert;
