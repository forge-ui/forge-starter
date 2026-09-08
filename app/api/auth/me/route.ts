import { getAuthMode } from "@/lib/auth/config";
import { jsonOk } from "@/lib/auth/http";
import { requireSession } from "@/lib/auth/session";

export async function GET() {
  const auth = await requireSession();
  if (!auth.ok) return auth.response;
  return jsonOk({
    mode: getAuthMode(),
    user: auth.session,
  });
}
