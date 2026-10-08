import { after, test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { SignJWT } from "jose";
import { eq, and } from "drizzle-orm";
import { getDb, closeDb } from "../../lib/db";
import { users, rbacRoles, rbacRolePermissions, rbacPermissions, aiModels } from "../../lib/db/schema";
import { createUser, toSessionUser, changeUserPassword, createPasswordResetToken, consumePasswordResetToken } from "../../lib/auth/users";
import { createSessionToken, readSessionToken } from "../../lib/auth/session";
import { revokeLocalSession } from "../../lib/auth/session-store";
import { resolveAccess, hasPermission } from "../../lib/rbac/access";
import { ensureRbacDefaults, initializeRbacDefaults } from "../../lib/rbac/seed";
import { createAiModel, updateAiModel, probeAiModel } from "../../lib/models/service";
import { chatCompletionsUrl } from "../../lib/models/runtime";
import { POST as forgotPassword } from "../../app/api/auth/forgot-password/route";
import { sendPasswordResetEmail } from "../../lib/mail/smtp";

const enabled = process.env.AUTH_MODE === "local" && process.env.DATABASE_URL?.includes("/forge_semantic_test_");
const password = "SecurityControl123!";
const ids: string[] = [], modelIds: string[] = [];
after(async () => {
  if (!enabled) return;
  for (const id of modelIds) await getDb().delete(aiModels).where(eq(aiModels.id, id));
  for (const id of ids) await getDb().delete(users).where(eq(users.id, id));
  await closeDb();
});
async function user(username = `security_${crypto.randomUUID().slice(0,8)}`) {
  const row = await createUser({ username, email: `${crypto.randomUUID()}@example.test`, password });
  ids.push(row.id); return row;
}

test("signup cannot derive authority from ordinary or administrator usernames", { skip: !enabled }, async () => {
  await initializeRbacDefaults();
  for (const name of ["admin", "super_admin", "operator", `ordinary_${crypto.randomUUID().slice(0,8)}`]) {
    const row = await user(name);
    assert.equal(row.roleCode, "readonly");
    const access = await resolveAccess(toSessionUser(row));
    assert.equal(hasPermission(access, "roles", "update"), false);
    assert.equal(hasPermission(access, "accounts", "read"), true);
  }
});

test("revoked seed grants stay revoked across authorization, lists and explicit bootstrap", { skip: !enabled }, async () => {
  const db = getDb();
  const [role] = await db.select().from(rbacRoles).where(eq(rbacRoles.code, "operator"));
  const [permission] = await db.select().from(rbacPermissions).where(eq(rbacPermissions.code, "accounts:update"));
  const condition = and(eq(rbacRolePermissions.roleId, role.id), eq(rbacRolePermissions.permissionId, permission.id));
  await db.delete(rbacRolePermissions).where(condition);
  try {
    const row = await user();
    await db.update(users).set({ roleCode: "operator" }).where(eq(users.id, row.id));
    await ensureRbacDefaults(); await initializeRbacDefaults();
    const access = await resolveAccess({ ...toSessionUser(row), roleCode: "operator" });
    assert.equal(hasPermission(access, "accounts", "update"), false);
    assert.equal(hasPermission(access, "accounts", "read"), true);
    assert.equal((await db.select().from(rbacRolePermissions).where(condition)).length, 0);
  } finally { await db.insert(rbacRolePermissions).values({ roleId: role.id, permissionId: permission.id }); }
});

test("missing and disabled roles fail closed; session role follows database", { skip: !enabled }, async () => {
  const row = await user();
  const token = await createSessionToken(toSessionUser(row), row.passwordHash);
  const [role] = await getDb().insert(rbacRoles).values({ code: `security_${crypto.randomUUID()}`, name: "test", status: "disabled" }).returning();
  try {
    await getDb().update(users).set({ roleCode: role.code }).where(eq(users.id, row.id));
    const current = await readSessionToken(token); assert.equal(current?.roleCode, role.code);
    assert.equal((await resolveAccess(current!)).roleCode, "");
    await getDb().delete(rbacRoles).where(eq(rbacRoles.id, role.id));
    const denied = await resolveAccess(current!);
    assert.equal(denied.isSuperAdmin, false); assert.deepEqual(denied.permissionCodes, []);
  } finally { await getDb().delete(rbacRoles).where(eq(rbacRoles.id, role.id)); }
});

test("logout revokes only its session; password change and reset revoke every prior session", { skip: !enabled }, async () => {
  const row = await user();
  const a = await createSessionToken(toSessionUser(row), row.passwordHash);
  const b = await createSessionToken(toSessionUser(row), row.passwordHash);
  const payload = JSON.parse(Buffer.from(a.split('.')[1], 'base64url').toString());
  await revokeLocalSession(payload.jti, row.id); await closeDb();
  assert.equal(await readSessionToken(a), null); assert.ok(await readSessionToken(b));
  await changeUserPassword(row.id, password, "ChangedControl123!");
  assert.equal(await readSessionToken(b), null);
  await assert.rejects(createSessionToken(toSessionUser(row), row.passwordHash), /密码已变更/);
  const [changed] = await getDb().select().from(users).where(eq(users.id, row.id));
  const fresh = await createSessionToken(toSessionUser(changed), changed.passwordHash);
  assert.ok(await readSessionToken(fresh));
  const { token } = await createPasswordResetToken(row.id);
  const results = await Promise.allSettled([consumePasswordResetToken(token, "ResetControl123!"), consumePasswordResetToken(token, "ResetOther123!")]);
  assert.equal(results.filter(x => x.status === "fulfilled").length, 1);
  assert.equal(await readSessionToken(fresh), null);
  const legacy = await new SignJWT({ username: row.username, email: row.email, roleCode: "super_admin" }).setProtectedHeader({ alg: "HS256" }).setSubject(row.id).setExpirationTime("1h").sign(new TextEncoder().encode(process.env.AUTH_SECRET));
  assert.equal(await readSessionToken(legacy), null);
});

test("missing SMTP returns identical public recovery response without links or logs", { skip: !enabled }, async () => {
  const row = await user(); const old = process.env.SMTP_HOST; delete process.env.SMTP_HOST;
  const logs: unknown[][] = []; const original = console.info; console.info = (...args) => logs.push(args);
  try {
    const request = (login: string) => new Request("http://localhost/api/auth/forgot-password", { method: "POST", headers: {"content-type":"application/json"}, body: JSON.stringify({ login }) });
    const existing = await (await forgotPassword(request(row.username))).json();
    const missing = await (await forgotPassword(request("missing_user_987654"))).json();
    assert.deepEqual(existing, missing); assert.deepEqual(Object.keys(existing).sort(), ["message", "ok"]);
    await assert.rejects(sendPasswordResetEmail({ to: row.email, displayName: row.displayName, token: "synthetic-bearer" }), /SMTP/);
    assert.equal(JSON.stringify(logs).includes("synthetic-bearer"), false);
  } finally { console.info = original; if (old === undefined) delete process.env.SMTP_HOST; else process.env.SMTP_HOST = old; }
});

test("model credentials cannot move to another origin, path, query, provider or local endpoint", { skip: !enabled }, async () => {
  let observed = "";
  const server = createServer((req, res) => { observed = req.headers.authorization ?? ""; res.setHeader("content-type", "application/json"); res.end(JSON.stringify({ choices: [{ message: { content: "ok" } }] })); });
  await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve));
  const address = server.address(); assert.ok(address && typeof address === "object");
  const base = `http://127.0.0.1:${address.port}`;
  const input = { name: `security_${crypto.randomUUID()}`, provider: "openai" as const, modelName: "test", apiBase: base, apiKey: "synthetic-owner-key", status: "active" as const, isDefault: false, notes: "" };
  try {
    const model = await createAiModel(input); modelIds.push(model.id);
    for (const attack of [{ apiBase: "http://127.0.0.1:9" }, { apiBase: `${base}/different` }, { apiBase: `${base}?destination=other` }, { provider: "ollama" as const }, { apiBase: `${base}/#fragment` }, { apiBase: "file:///tmp/secret" }, { apiBase: `http://user:pass@127.0.0.1:${address.port}` }]) {
      await assert.rejects(updateAiModel(model.id, { ...input, apiKey: "", ...attack }));
    }
    await updateAiModel(model.id, { ...input, apiKey: "", apiBase: `${base}/v1/`, name: `${input.name}_renamed` });
    await probeAiModel(model.id); assert.equal(observed, "Bearer synthetic-owner-key");
    await updateAiModel(model.id, { ...input, apiKey: "synthetic-new-key", apiBase: `${base}/different` });
    await probeAiModel(model.id); assert.equal(observed, "Bearer synthetic-new-key");
    assert.equal(chatCompletionsUrl("https://EXAMPLE.test:443/v1/"), "https://example.test/v1/chat/completions");
  } finally { server.closeAllConnections(); await new Promise<void>(resolve => server.close(() => resolve())); }
});

test("SMTP delivery stays private and recovery works; delivery errors remain generic", { skip: !enabled }, async () => {
  const { createServer: tcpServer } = await import("node:net");
  let message = "";
  const server = tcpServer(socket => {
    socket.write("220 local-test ESMTP\r\n");
    let pending = "", data = false;
    socket.on("data", chunk => {
      pending += chunk.toString();
      while (pending.includes("\r\n")) {
        const at = pending.indexOf("\r\n"), line = pending.slice(0, at); pending = pending.slice(at + 2);
        if (data) {
          if (line === ".") { data = false; socket.write("250 accepted\r\n"); } else message += line + "\r\n";
        } else if (/^EHLO|^HELO/i.test(line)) socket.write("250 local-test\r\n");
        else if (/^DATA/i.test(line)) { data = true; socket.write("354 send message\r\n"); }
        else if (/^QUIT/i.test(line)) { socket.end("221 bye\r\n"); }
        else socket.write("250 ok\r\n");
      }
    });
  });
  await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve));
  const address = server.address(); assert.ok(address && typeof address === "object");
  const old = Object.fromEntries(["SMTP_HOST", "SMTP_PORT", "SMTP_SECURE", "SMTP_USER"].map(k => [k, process.env[k]]));
  Object.assign(process.env, { SMTP_HOST: "127.0.0.1", SMTP_PORT: String(address.port), SMTP_SECURE: "false", SMTP_USER: "" });
  try {
    const row = await user();
    const request = () => new Request("http://localhost/api/auth/forgot-password", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ login: row.username }) });
    const response = await (await forgotPassword(request())).json();
    assert.deepEqual(Object.keys(response).sort(), ["message", "ok"]);
    const match = message.replace(/=\r\n/g, "").replace(/=3D/g, "=").match(/token=([a-f0-9]{64})/);
    assert.ok(match, "SMTP receives reset bearer");
    assert.ok(message.includes(row.email)); assert.equal(JSON.stringify(response).includes(match[1]), false);
    await consumePasswordResetToken(match[1], "EmailResetControl123!");
    await assert.rejects(consumePasswordResetToken(match[1], "EmailResetOther123!"));
    process.env.SMTP_PORT = "9";
    assert.deepEqual(await (await forgotPassword(request())).json(), response);
  } finally {
    for (const [k,v] of Object.entries(old)) { if (v === undefined) delete process.env[k]; else process.env[k] = v; }
    await new Promise<void>(resolve => server.close(() => resolve()));
  }
});

test("database outage denies local roles while demo retains explicit seed behavior", { skip: !enabled }, async () => {
  const { databaseRequestScope, closeDatabaseScope } = await import("../../lib/db/request-scope");
  const scope = { connectionString: "postgres://synthetic:synthetic@127.0.0.1:9/forge_semantic_test_unreachable" };
  const session = { id: crypto.randomUUID(), username: "admin", email: "synthetic@example.test", displayName: "test", roleCode: "super_admin" };
  try {
    const denied = await databaseRequestScope.run(scope, () => resolveAccess(session));
    assert.deepEqual(denied.permissionCodes, []); assert.equal(denied.isSuperAdmin, false);
    process.env.AUTH_MODE = "demo";
    const demo = await databaseRequestScope.run(scope, () => resolveAccess(session));
    assert.equal(demo.isSuperAdmin, true); assert.ok(hasPermission(demo, "roles", "update"));
  } finally { process.env.AUTH_MODE = "local"; await closeDatabaseScope(scope); }
});

test("real HTTP login, permissions, profile, logout and revoked page navigation", { skip: !enabled || !process.env.SECURITY_TEST_ORIGIN }, async () => {
  const origin = process.env.SECURITY_TEST_ORIGIN!;
  assert.ok(/^http:\/\/127\.0\.0\.1:316[78]$/.test(origin));
  const username = `http_${crypto.randomUUID().slice(0,8)}`, email = `${crypto.randomUUID()}@example.test`;
  const post = (path: string, body: unknown, cookie?: string, method = "POST") => fetch(`${origin}${path}/`, { method, headers: { "content-type": "application/json", ...(cookie ? { cookie } : {}) }, body: JSON.stringify(body), redirect: "manual" });
  const registered = await post("/api/auth/register", { username, email, password });
  assert.equal(registered.status, 200);
  const [row] = await getDb().select().from(users).where(eq(users.username, username)); ids.push(row.id);
  const cookie = registered.headers.get("set-cookie")!.split(";")[0]; assert.ok(cookie);
  assert.equal((await fetch(`${origin}/api/auth/me/`, { headers: { cookie } })).status, 200);
  assert.equal((await fetch(`${origin}/api/accounts/`, { headers: { cookie } })).status, 200);
  assert.equal((await post("/api/accounts", {}, cookie)).status, 403);
  assert.equal((await post("/api/auth/profile", { displayName: "Updated control" }, cookie, "PATCH")).status, 200);
  const me = await (await fetch(`${origin}/api/auth/me/`, { headers: { cookie } })).json();
  assert.equal(me.user.displayName, "Updated control");
  const login = await post("/api/auth/login", { login: username, password }); assert.equal(login.status, 200);
  const other = login.headers.get("set-cookie")!.split(";")[0];
  assert.equal((await post("/api/auth/logout", {}, cookie)).status, 200);
  assert.equal((await fetch(`${origin}/api/auth/me/`, { headers: { cookie } })).status, 401);
  assert.equal((await fetch(`${origin}/api/auth/me/`, { headers: { cookie: other } })).status, 200);
  const page = await fetch(`${origin}/dashboard/`, { headers: { cookie }, redirect: "manual" });
  assert.ok([303,307].includes(page.status)); assert.ok(page.headers.get("location")?.endsWith("/login/"));
  const loginPage = await fetch(`${origin}/login/`, { headers: { cookie }, redirect: "manual" }); assert.equal(loginPage.status, 200);
  const { token } = await createPasswordResetToken(row.id);
  assert.equal((await post("/api/auth/reset-password", { token, password: "HttpResetControl123!" })).status, 200);
  assert.equal((await fetch(`${origin}/api/auth/me/`, { headers: { cookie: other } })).status, 401);
  const renewed = await post("/api/auth/login", { login: username, password: "HttpResetControl123!" }); assert.equal(renewed.status, 200);
});

test("compose binds loopback and requires a configured database credential", async () => {
  const { execFileSync } = await import("node:child_process");
  const raw = execFileSync("docker", ["compose", "config", "--format", "json"], { env: { ...process.env, POSTGRES_PASSWORD: "synthetic-compose-control" }, encoding: "utf8" });
  const config = JSON.parse(raw);
  assert.equal(config.services.postgres.ports[0].host_ip, "127.0.0.1");
  assert.equal(config.services.postgres.environment.POSTGRES_PASSWORD, "synthetic-compose-control");
  assert.throws(() => execFileSync("docker", ["compose", "config", "--format", "json"], { env: { ...process.env, POSTGRES_PASSWORD: "" }, stdio: "pipe" }));
});
