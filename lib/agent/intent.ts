import { SignJWT, jwtVerify } from "jose";
import { getAuthSecret } from "@/lib/auth/config";

const INTENT_AUDIENCE = "agent-intent";
const EXPORT_AUDIENCE = "agent-export";
const INTENT_TTL = "10m";
const USED_LIMIT = 500;

const usedJti = new Set<string>();
const usedOrder: string[] = [];

function secretKey() {
  return new TextEncoder().encode(getAuthSecret());
}

function claimJti(jti: string) {
  if (usedJti.has(jti)) return false;
  usedJti.add(jti);
  usedOrder.push(jti);
  if (usedOrder.length > USED_LIMIT) {
    const oldest = usedOrder.shift();
    if (oldest) usedJti.delete(oldest);
  }
  return true;
}

async function signToken(audience: string, userId: string, toolId: string, args: unknown) {
  return new SignJWT({ toolId, args })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setJti(crypto.randomUUID())
    .setAudience(audience)
    .setIssuedAt()
    .setExpirationTime(INTENT_TTL)
    .sign(secretKey());
}

async function readToken(token: string, audience: string) {
  const { payload } = await jwtVerify(token, secretKey(), { audience });
  const userId = typeof payload.sub === "string" ? payload.sub : "";
  const jti = typeof payload.jti === "string" ? payload.jti : "";
  const toolId = typeof payload.toolId === "string" ? payload.toolId : "";
  if (!userId || !jti || !toolId || payload.args === undefined) {
    throw new Error("确认单无效");
  }
  return { userId, jti, toolId, args: payload.args };
}

export function signAgentIntent(userId: string, toolId: string, args: unknown) {
  return signToken(INTENT_AUDIENCE, userId, toolId, args);
}

export function signExportToken(userId: string, toolId: string, args: unknown) {
  return signToken(EXPORT_AUDIENCE, userId, toolId, args);
}

/** 只校验签名、用户和是否已用过，不作废。 */
export async function readAgentIntent(token: string, userId: string) {
  let payload: Awaited<ReturnType<typeof readToken>>;
  try {
    payload = await readToken(token, INTENT_AUDIENCE);
  } catch {
    throw new Error("确认单已过期或无效，请重新让助手提出写入");
  }
  if (payload.userId !== userId) throw new Error("确认单不属于当前登录用户");
  if (usedJti.has(payload.jti)) throw new Error("确认单已使用，请重新让助手提出写入");
  return payload;
}

export function spendAgentIntent(jti: string) {
  if (!claimJti(jti)) throw new Error("确认单已使用，请重新让助手提出写入");
}

export async function readExportToken(token: string, userId: string) {
  let payload: Awaited<ReturnType<typeof readToken>>;
  try {
    payload = await readToken(token, EXPORT_AUDIENCE);
  } catch {
    throw new Error("下载链接已过期或无效，请重新导出");
  }
  if (payload.userId !== userId) throw new Error("下载链接不属于当前登录用户");
  return { toolId: payload.toolId, args: payload.args };
}
