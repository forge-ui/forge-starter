export type AuthMode = "demo" | "local";

export function getAuthMode(): AuthMode {
  const mode = (process.env.AUTH_MODE ?? "demo").trim().toLowerCase();
  return mode === "local" ? "local" : "demo";
}

export function isAuthGuardEnabled() {
  const explicit = process.env.AUTH_GUARD?.trim().toLowerCase();
  if (explicit === "true") return true;
  if (explicit === "false") return false;
  return getAuthMode() === "local";
}

export function getAuthSecret() {
  const secret = process.env.AUTH_SECRET?.trim();
  if (secret && secret.length >= 16) return secret;
  if (getAuthMode() === "demo") {
    return "forge-starter-demo-secret-change-me";
  }
  throw new Error("AUTH_SECRET must be set (min 16 characters) when AUTH_MODE=local");
}

export function getAppUrl() {
  return (process.env.APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

export const SESSION_COOKIE = "forge_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 14;
