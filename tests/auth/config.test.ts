import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import {
  assertAuthConfig,
  authConfigError,
  DEMO_AUTH_SECRET,
  getAuthSecret,
  MIN_AUTH_SECRET_LENGTH,
} from "../../lib/auth/config";

const keys = ["NODE_ENV", "NEXT_PHASE", "AUTH_MODE", "AUTH_SECRET", "ALLOW_INSECURE_AUTH", "AUTH_GUARD"] as const;
const previous = new Map<string, string | undefined>(keys.map((key) => [key, process.env[key]]));

function writeEnv(name: string, value: string | undefined) {
  const env = process.env as Record<string, string | undefined>;
  if (value === undefined) delete env[name];
  else env[name] = value;
}

afterEach(() => {
  for (const key of keys) writeEnv(key, previous.get(key));
});

function use(env: Record<string, string | undefined>) {
  for (const key of keys) writeEnv(key, undefined);
  for (const [key, value] of Object.entries(env)) writeEnv(key, value);
}

const longSecret = "x".repeat(MIN_AUTH_SECRET_LENGTH);

test("开发环境的 demo 可以不写密钥，并使用内置演示密钥", () => {
  use({ NODE_ENV: "development", AUTH_MODE: "demo" });
  assert.equal(authConfigError(), null);
  assert.equal(getAuthSecret(), DEMO_AUTH_SECRET);
  assert.ok(DEMO_AUTH_SECRET.length >= MIN_AUTH_SECRET_LENGTH);
});

test("写了密钥就必须至少 32 位，短密钥不会悄悄退回演示密钥", () => {
  use({ NODE_ENV: "development", AUTH_MODE: "demo", AUTH_SECRET: "short-secret" });
  assert.match(authConfigError() ?? "", /32/);
  assert.throws(() => getAuthSecret(), /32/);
});

test("local 模式无论是否生产都要求 32 位密钥", () => {
  use({ NODE_ENV: "development", AUTH_MODE: "local" });
  assert.match(authConfigError() ?? "", /AUTH_SECRET/);
  use({ NODE_ENV: "development", AUTH_MODE: "local", AUTH_SECRET: longSecret });
  assert.equal(getAuthSecret(), longSecret);
});

test("生产环境拒绝 demo 和缺失的密钥", () => {
  use({ NODE_ENV: "production", AUTH_MODE: "demo", AUTH_SECRET: longSecret });
  assert.match(authConfigError() ?? "", /demo/);
  use({ NODE_ENV: "production", AUTH_SECRET: longSecret });
  assert.match(authConfigError() ?? "", /demo/);
  use({ NODE_ENV: "production", AUTH_MODE: "local" });
  assert.match(authConfigError() ?? "", /AUTH_SECRET/);
  assert.throws(() => assertAuthConfig(), /AUTH_SECRET/);
});

test("生产构建阶段不把 demo 当成已经启动的服务", () => {
  use({
    NODE_ENV: "production",
    NEXT_PHASE: "phase-production-build",
    AUTH_MODE: "demo",
  });
  assert.equal(authConfigError(), null);
  assert.equal(getAuthSecret(), DEMO_AUTH_SECRET);
});

test("只有 ALLOW_INSECURE_AUTH=true 才放行生产 demo；local 仍然要密钥", () => {
  use({ NODE_ENV: "production", AUTH_MODE: "demo", ALLOW_INSECURE_AUTH: "true" });
  assert.equal(authConfigError(), null);
  assert.equal(getAuthSecret(), DEMO_AUTH_SECRET);
  use({ NODE_ENV: "production", AUTH_MODE: "demo", ALLOW_INSECURE_AUTH: "yes", AUTH_SECRET: longSecret });
  assert.match(authConfigError() ?? "", /demo/);
  use({ NODE_ENV: "production", AUTH_MODE: "local", ALLOW_INSECURE_AUTH: "true" });
  assert.match(authConfigError() ?? "", /local/);
});


test("生产环境拒绝关闭路由鉴权或使用公开演示密钥", () => {
  use({ NODE_ENV: "production", AUTH_MODE: "local", AUTH_SECRET: longSecret, AUTH_GUARD: "false" });
  assert.match(authConfigError() ?? "", /AUTH_GUARD/);
  use({ NODE_ENV: "production", AUTH_MODE: "local", AUTH_SECRET: DEMO_AUTH_SECRET });
  assert.match(authConfigError() ?? "", /演示 AUTH_SECRET/);
  use({ NODE_ENV: "production", AUTH_MODE: "local", AUTH_SECRET: longSecret });
  assert.equal(authConfigError(), null);
});
