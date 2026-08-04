import { z } from "zod";
import { getAuthMode } from "@/lib/auth/config";
import { jsonError, jsonOk } from "@/lib/auth/http";
import { createPasswordResetToken, findUserByLogin } from "@/lib/auth/users";
import { sendPasswordResetEmail } from "@/lib/mail/smtp";

const bodySchema = z.object({
  login: z.string().trim().min(1, "请输入用户名或邮箱"),
});

export async function POST(request: Request) {
  try {
    if (getAuthMode() === "demo") {
      return jsonError("演示模式不支持找回密码，请直接登录", 400);
    }

    const json = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "参数无效");
    }

    // Always return the same message to avoid account enumeration.
    const generic = "如果账号存在，重置说明已发送（或已写入服务端日志）。";
    const user = await findUserByLogin(parsed.data.login);
    if (!user) {
      return jsonOk({ message: generic });
    }

    const { token } = await createPasswordResetToken(user.id);
    const result = await sendPasswordResetEmail({
      to: user.email,
      displayName: user.displayName,
      token,
    });

    return jsonOk({
      message: generic,
      delivered: result.delivered,
      // Only expose reset URL when SMTP is not configured (local dev).
      devResetUrl: result.delivered ? undefined : result.resetUrl,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "请求失败";
    return jsonError(message, 500);
  }
}
