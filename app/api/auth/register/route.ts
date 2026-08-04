import { z } from "zod";
import { getAuthMode } from "@/lib/auth/config";
import { jsonError, jsonOk } from "@/lib/auth/http";
import { validatePasswordStrength } from "@/lib/auth/password";
import { setSessionCookie } from "@/lib/auth/session";
import { createUser, toSessionUser } from "@/lib/auth/users";

const bodySchema = z.object({
  username: z.string().trim().min(3).max(32),
  email: z.string().trim().email("邮箱格式不正确"),
  password: z.string().min(8),
  displayName: z.string().trim().optional(),
});

export async function POST(request: Request) {
  try {
    if (getAuthMode() === "demo") {
      return jsonError("演示模式无需注册，请直接登录", 400);
    }

    const json = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "参数无效");
    }
    const strength = validatePasswordStrength(parsed.data.password);
    if (strength) return jsonError(strength);

    const user = await createUser(parsed.data);
    await setSessionCookie(toSessionUser(user));
    return jsonOk({ redirectTo: "/dashboard/" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "注册失败";
    return jsonError(message, 400);
  }
}
