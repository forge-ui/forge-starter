import { and, eq, gt, isNull } from "drizzle-orm";
import { createHash, randomBytes } from "node:crypto";
import { getDb } from "@/lib/db";
import { passwordResetTokens, users, type User } from "@/lib/db/schema";
import { hashPassword, verifyPassword } from "./password";
import type { SessionUser } from "./session";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function normalizeUsername(username: string) {
  return username.trim().toLowerCase();
}

export function toSessionUser(user: User): SessionUser {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    displayName: user.displayName,
  };
}

export async function findUserByLogin(login: string) {
  const db = getDb();
  const value = login.trim();
  if (!value) return null;
  if (value.includes("@")) {
    const [row] = await db.select().from(users).where(eq(users.email, normalizeEmail(value))).limit(1);
    return row ?? null;
  }
  const [row] = await db.select().from(users).where(eq(users.username, normalizeUsername(value))).limit(1);
  return row ?? null;
}

export async function createUser(input: {
  username: string;
  email: string;
  password: string;
  displayName?: string;
}) {
  const db = getDb();
  const username = normalizeUsername(input.username);
  const email = normalizeEmail(input.email);
  if (!/^[a-z0-9_]{3,32}$/.test(username)) {
    throw new Error("用户名需 3–32 位，仅小写字母、数字、下划线");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("邮箱格式不正确");
  }
  const passwordHash = await hashPassword(input.password);
  try {
    const [row] = await db
      .insert(users)
      .values({
        username,
        email,
        passwordHash,
        displayName: input.displayName?.trim() || username,
      })
      .returning();
    return row;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("users_username_uidx") || message.includes("username")) {
      throw new Error("用户名已被占用");
    }
    if (message.includes("users_email_uidx") || message.includes("email")) {
      throw new Error("邮箱已被注册");
    }
    throw error;
  }
}

export async function authenticateUser(login: string, password: string) {
  const user = await findUserByLogin(login);
  if (!user) return null;
  const ok = await verifyPassword(password, user.passwordHash);
  return ok ? user : null;
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createPasswordResetToken(userId: string) {
  const db = getDb();
  const token = randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60);
  await db.insert(passwordResetTokens).values({
    userId,
    tokenHash,
    expiresAt,
  });
  return { token, expiresAt };
}

export async function consumePasswordResetToken(token: string, newPassword: string) {
  const db = getDb();
  const tokenHash = hashToken(token);
  const [row] = await db
    .select()
    .from(passwordResetTokens)
    .where(
      and(
        eq(passwordResetTokens.tokenHash, tokenHash),
        isNull(passwordResetTokens.usedAt),
        gt(passwordResetTokens.expiresAt, new Date()),
      ),
    )
    .limit(1);
  if (!row) {
    throw new Error("重置链接无效或已过期");
  }
  const passwordHash = await hashPassword(newPassword);
  await db.update(users).set({ passwordHash }).where(eq(users.id, row.userId));
  await db
    .update(passwordResetTokens)
    .set({ usedAt: new Date() })
    .where(eq(passwordResetTokens.id, row.id));
}
