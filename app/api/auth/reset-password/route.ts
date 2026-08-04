import { z } from "zod";
import { getAuthMode } from "@/lib/auth/config";
import { jsonError, jsonOk } from "@/lib/auth/http";
import { validatePasswordStrength } from "@/lib/auth/password";
import { consumePasswordResetToken } from "@/lib/auth/users";

const bodySchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  try {
    if (getAuthMode() === "demo") {
      return jsonError("演示模式不支持重置密码", 400);
    }

    const json = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "参数无效");
    }
    const strength = validatePasswordStrength(parsed.data.password);
    if (strength) return jsonError(strength);

    await consumePasswordResetToken(parsed.data.token, parsed.data.password);
    return jsonOk({ redirectTo: "/login/", message: "密码已更新，请登录" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "重置失败";
    return jsonError(message, 400);
  }
}
