import { NextResponse } from "next/server";

export function jsonOk<T extends Record<string, unknown>>(body: T, init?: ResponseInit) {
  return NextResponse.json({ ok: true, ...body }, init);
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}
