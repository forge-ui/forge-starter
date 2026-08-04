import { getAuthMode } from "@/lib/auth/config";
import { jsonOk } from "@/lib/auth/http";
import { getSessionUser } from "@/lib/auth/session";

export async function GET() {
  const user = await getSessionUser();
  return jsonOk({
    mode: getAuthMode(),
    user,
  });
}
