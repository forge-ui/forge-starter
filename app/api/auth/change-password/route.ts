import { z } from "zod";
import { getAuthMode } from "@/lib/auth/config";
import { jsonError, jsonOk } from "@/lib/auth/http";
import { validatePasswordStrength } from "@/lib/auth/password";
import { getSessionUser } from "@/lib/auth/session";
import { changeUserPassword } from "@/lib/auth/users";

const bodySchema = z.object({
  currentPassword: z.string().min(1, "请输入当前密码"),
  newPassword: z.string().min(8, "新密码至少 8 位"),
});

export async function POST(request: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return jsonError("未登录", 401);
    }

    const json = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "参数无效");
    }

    const strength = validatePasswordStrength(parsed.data.newPassword);
    if (strength) return jsonError(strength);

    if (parsed.data.currentPassword === parsed.data.newPassword) {
      return jsonError("新密码不能与当前密码相同");
    }

    const mode = getAuthMode();
    if (mode === "demo") {
      // Demo sessions have no password hash; accept after basic validation.
      return jsonOk({
        mode,
        message: "演示模式已确认密码修改流程（未写入数据库）",
      });
    }

    await changeUserPassword(
      session.id,
      parsed.data.currentPassword,
      parsed.data.newPassword,
    );
    return jsonOk({ mode, message: "密码已更新" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "修改密码失败";
    return jsonError(message, 400);
  }
}
