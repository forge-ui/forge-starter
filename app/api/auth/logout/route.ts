import { jsonOk } from "@/lib/auth/http";
import { clearSessionCookie } from "@/lib/auth/session";

export async function POST() {
  await clearSessionCookie();
  return jsonOk({ redirectTo: "/login/" });
}
