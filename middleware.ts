import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "forge_session";

function authMode() {
  return (process.env.AUTH_MODE ?? "demo").trim().toLowerCase() === "local" ? "local" : "demo";
}

function guardEnabled() {
  const explicit = process.env.AUTH_GUARD?.trim().toLowerCase();
  if (explicit === "true") return true;
  if (explicit === "false") return false;
  return authMode() === "local";
}

function authSecret() {
  const secret = process.env.AUTH_SECRET?.trim();
  if (secret && secret.length >= 16) return secret;
  if (authMode() === "demo") return "forge-starter-demo-secret-change-me";
  return null;
}

function normalizePath(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

function isAuthPage(pathname: string) {
  const path = normalizePath(pathname);
  return (
    path === "/login"
    || path === "/register"
    || path === "/forgot-password"
    || path === "/reset-password"
  );
}

function isProtectedAppPath(pathname: string) {
  const path = normalizePath(pathname);
  if (path.startsWith("/api")) return false;
  if (isAuthPage(pathname)) return false;
  if (path === "/") return false;
  return true;
}

async function hasValidSession(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  const secret = authSecret();
  if (!secret) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}

function refPagesEnabled() {
  // AI/dev reference gallery under /ref — off in production unless explicitly enabled
  if (process.env.SHOW_REF_PAGES?.trim().toLowerCase() === "true") return true;
  if (process.env.SHOW_REF_PAGES?.trim().toLowerCase() === "false") return false;
  return process.env.NODE_ENV !== "production";
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const path = normalizePath(pathname);

  if (path === "/ref" || path.startsWith("/ref/")) {
    if (!refPagesEnabled()) {
      return new NextResponse("Not Found", { status: 404 });
    }
  }

  if (!guardEnabled()) {
    return NextResponse.next();
  }

  const loggedIn = await hasValidSession(request);

  if (isProtectedAppPath(pathname) && !loggedIn) {
    const url = request.nextUrl.clone();
    url.pathname = "/login/";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthPage(pathname) && loggedIn && normalizePath(pathname) !== "/reset-password") {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard/";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images/|.*\\..*).*)"],
};
