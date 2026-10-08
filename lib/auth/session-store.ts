import { createHmac, randomUUID } from "node:crypto";
import { and, eq, gt, lt } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { authSessions, users } from "@/lib/db/schema";
import { getAuthSecret, SESSION_MAX_AGE_SECONDS } from "./config";
import { toSessionUser } from "./users";

function version(passwordHash: string) {
  return createHmac("sha256", getAuthSecret()).update(passwordHash).digest("hex");
}

export async function issueLocalSession(userId: string, expectedPasswordHash: string) {
  return getDb().transaction(async (tx) => {
    const [user] = await tx.select().from(users).where(eq(users.id, userId)).limit(1).for("update");
    if (!user || user.passwordHash !== expectedPasswordHash) throw new Error("密码已变更，请重新登录");
    const id = randomUUID();
    await tx.delete(authSessions).where(lt(authSessions.expiresAt, new Date()));
    await tx.insert(authSessions).values({ id, userId, credentialVersion: version(user.passwordHash),
      expiresAt: new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000) });
    return id;
  });
}

export async function readLocalSession(id: string, userId: string) {
  // Invalid IDs are rejected before PostgreSQL's UUID parser.
  if (!/^[0-9a-f-]{36}$/i.test(id) || !/^[0-9a-f-]{36}$/i.test(userId)) return null;
  const [row] = await getDb().select({ session: authSessions, user: users }).from(authSessions)
    .innerJoin(users, eq(authSessions.userId, users.id))
    .where(and(eq(authSessions.id, id), eq(authSessions.userId, userId), gt(authSessions.expiresAt, new Date()))).limit(1);
  if (!row || row.session.credentialVersion !== version(row.user.passwordHash)) return null;
  return toSessionUser(row.user);
}

export async function revokeLocalSession(id: string, userId: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id) || !/^[0-9a-f-]{36}$/i.test(userId)) return;
  await getDb().delete(authSessions).where(and(eq(authSessions.id, id), eq(authSessions.userId, userId)));
}
