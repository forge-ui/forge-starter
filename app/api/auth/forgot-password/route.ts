import { z } from "zod";
import { getAuthMode } from "@/lib/auth/config";
import { jsonError, jsonOk } from "@/lib/auth/http";
import { createPasswordResetToken, findUserByLogin } from "@/lib/auth/users";
import { isSmtpConfigured, sendPasswordResetEmail } from "@/lib/mail/smtp";

const bodySchema = z.object({
  login: z.string().trim().min(1, "请输入用户名或邮箱"),
});

export async function POST(request: Request) {
  const generic = "如果账号存在且邮件服务可用，重置说明将发送到注册邮箱。";
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
    if (!isSmtpConfigured()) return jsonOk({ message: generic });
    const user = await findUserByLogin(parsed.data.login);
    if (!user) {
      return jsonOk({ message: generic });
    }

    const { token } = await createPasswordResetToken(user.id);
    await sendPasswordResetEmail({
      to: user.email,
      displayName: user.displayName,
      token,
    });

    return jsonOk({ message: generic });
  } catch {
    return jsonOk({ message: generic });
  }
}
