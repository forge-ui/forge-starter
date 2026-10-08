import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  getAuthSecret,
  getAuthMode,
} from "./config";
import { jsonError } from "./http";
import { issueLocalSession, readLocalSession, revokeLocalSession } from "./session-store";

export type SessionUser = {
  id: string;
  username: string;
  email: string;
  displayName: string;
  /** Login-side RBAC role code. Demo resolves from username; local persists on `users.role_code`. */
  roleCode: string;
};

function secretKey() {
  return new TextEncoder().encode(getAuthSecret());
}

export async function createSessionToken(user: SessionUser, expectedPasswordHash?: string) {
  let sessionId: string | undefined;
  if (getAuthMode() === "local") {
    if (!expectedPasswordHash) throw new Error("本地会话需要已验证的密码版本");
    sessionId = await issueLocalSession(user.id, expectedPasswordHash);
  }
  return new SignJWT({
    ...(sessionId ? { jti: sessionId } : {}),
    username: user.username,
    email: user.email,
    displayName: user.displayName,
    roleCode: user.roleCode,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(secretKey());
}

export async function readSessionToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (getAuthMode() === "local") {
      if (typeof payload.jti !== "string" || typeof payload.sub !== "string") return null;
      return await readLocalSession(payload.jti, payload.sub);
    }
    const id = typeof payload.sub === "string" ? payload.sub : null;
    const username = typeof payload.username === "string" ? payload.username : null;
    const email = typeof payload.email === "string" ? payload.email : null;
    const displayName =
      typeof payload.displayName === "string" ? payload.displayName : username;
    const roleCode =
      typeof payload.roleCode === "string" && payload.roleCode.trim()
        ? payload.roleCode.trim()
        : "";
    if (!id || !username || !email || !displayName) return null;
    return { id, username, email, displayName, roleCode };
  } catch {
    return null;
  }
}

export async function setSessionCookie(user: SessionUser, expectedPasswordHash?: string) {
  const token = await createSessionToken(user, expectedPasswordHash);
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token && getAuthMode() === "local") {
    let payload;
    try { ({ payload } = await jwtVerify(token, secretKey())); } catch { /* Invalid tokens have no live session. */ }
    if (typeof payload?.jti === "string" && typeof payload.sub === "string") {
      await revokeLocalSession(payload.jti, payload.sub);
    }
  }
  jar.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return readSessionToken(token);
}

export type RequireSessionResult =
  | { ok: true; session: SessionUser }
  | { ok: false; response: NextResponse };

/** Single gate for protected API routes. Returns 401 JSON when unauthenticated. */
export async function requireSession(): Promise<RequireSessionResult> {
  const session = await getSessionUser();
  if (!session) {
    return { ok: false, response: jsonError("未登录", 401) };
  }
  return { ok: true, session };
}

export async function verifySessionTokenEdge(token: string | undefined) {
  if (!token) return null;
  return readSessionToken(token);
}
