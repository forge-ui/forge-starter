export type AuthMode = "demo" | "local";

/** 会话签名最短长度。开发示例、README 与 `.env.example` 使用同一标准。 */
export const MIN_AUTH_SECRET_LENGTH = 32;

/** 仅开发环境 demo 使用。生产环境不会落到这把密钥，除非显式放行。 */
export const DEMO_AUTH_SECRET = "forge-starter-demo-secret-change-me";

export function getAuthMode(): AuthMode {
  const mode = (process.env.AUTH_MODE ?? "demo").trim().toLowerCase();
  return mode === "local" ? "local" : "demo";
}

export function isAuthGuardEnabled() {
  const explicit = process.env.AUTH_GUARD?.trim().toLowerCase();
  if (explicit === "false") return false;
  return true;
}

export function insecureAuthAllowed() {
  return process.env.ALLOW_INSECURE_AUTH?.trim().toLowerCase() === "true";
}

/**
 * 正在对外提供服务的生产进程。
 * `next build` 会把 NODE_ENV 设为 production，但 Next 自己不会在构建阶段调用 instrumentation，
 * 这里再挡一次，避免构建时因为开发用的 demo 配置中断。
 */
export function isProductionRuntime() {
  if (process.env.NODE_ENV !== "production") return false;
  if (process.env.NEXT_PHASE === "phase-production-build") return false;
  return true;
}

export function authConfigError(): string | null {
  const secret = process.env.AUTH_SECRET?.trim() ?? "";
  const mode = getAuthMode();
  const problems: string[] = [];

  if (secret && secret.length < MIN_AUTH_SECRET_LENGTH) {
    problems.push(`AUTH_SECRET 至少需要 ${MIN_AUTH_SECRET_LENGTH} 位，当前是 ${secret.length} 位。`);
  }

  if (mode === "local" && secret.length < MIN_AUTH_SECRET_LENGTH) {
    problems.push(`AUTH_MODE=local 时必须设置至少 ${MIN_AUTH_SECRET_LENGTH} 位的 AUTH_SECRET。`);
  }

  if (isProductionRuntime() && !insecureAuthAllowed()) {
    if (!isAuthGuardEnabled()) {
      problems.push("生产环境拒绝 AUTH_GUARD=false。只有明确要做公开演示时才设置 ALLOW_INSECURE_AUTH=true。");
    }
    if (secret === DEMO_AUTH_SECRET) {
      problems.push("生产环境不能使用公开的演示 AUTH_SECRET，请生成独立密钥。");
    }
    if (mode !== "local") {
      problems.push(
        "生产环境拒绝 AUTH_MODE=demo（没写 AUTH_MODE 时也会当成 demo）。请改为 local。只有明确要做公开演示时才设置 ALLOW_INSECURE_AUTH=true。",
      );
    }
    if (secret.length < MIN_AUTH_SECRET_LENGTH) {
      problems.push(`生产环境必须设置至少 ${MIN_AUTH_SECRET_LENGTH} 位的 AUTH_SECRET。`);
    }
  }

  return problems.length ? problems.join("\n") : null;
}

export function assertAuthConfig() {
  const error = authConfigError();
  if (error) throw new Error(error);
}

export function getAuthSecret() {
  assertAuthConfig();
  const secret = process.env.AUTH_SECRET?.trim();
  if (secret && secret.length >= MIN_AUTH_SECRET_LENGTH) return secret;
  return DEMO_AUTH_SECRET;
}

export function getAppUrl() {
  return (process.env.APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

export const SESSION_COOKIE = "forge_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 14;
