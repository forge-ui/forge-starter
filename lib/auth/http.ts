import { NextResponse } from "next/server";

export function jsonOk<T extends Record<string, unknown>>(body: T, init?: ResponseInit) {
  return NextResponse.json({ ok: true, ...body }, init);
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

/** Unauthenticated / session expired — client should redirect to login. */
export function jsonUnauthorized(message = "未登录或登录已过期，请重新登录") {
  return jsonError(message, 401);
}

/**
 * Map thrown errors to JSON. Use for route catch blocks:
 * `return apiError(error)` after domain throws with message / status.
 */
export function apiError(error: unknown, fallbackStatus = 500) {
  const message = error instanceof Error ? error.message : "请求失败";
  if (
    message === "UNAUTHENTICATED" ||
    /401|未登录|登录已过期|UNAUTH/i.test(message)
  ) {
    return jsonUnauthorized();
  }
  const status =
    error instanceof Error &&
    "status" in error &&
    typeof (error as { status?: unknown }).status === "number"
      ? ((error as { status: number }).status)
      : fallbackStatus;
  return jsonError(message, status);
}
