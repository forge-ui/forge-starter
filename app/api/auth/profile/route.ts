import { z } from "zod";
import { getAuthMode } from "@/lib/auth/config";
import { jsonError, jsonOk } from "@/lib/auth/http";
import { getSessionUser, setSessionCookie } from "@/lib/auth/session";
import { toSessionUser, updateUserProfile } from "@/lib/auth/users";

const bodySchema = z.object({
  displayName: z.string().trim().min(1, "显示名不能为空").max(64),
  email: z.string().trim().email("邮箱格式不正确").optional(),
});

export async function PATCH(request: Request) {
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

    const mode = getAuthMode();

    if (mode === "demo") {
      const next = {
        ...session,
        displayName: parsed.data.displayName,
        email: parsed.data.email?.toLowerCase() ?? session.email,
      };
      await setSessionCookie(next);
      return jsonOk({ mode, user: next, message: "资料已更新" });
    }

    const row = await updateUserProfile(session.id, {
      displayName: parsed.data.displayName,
      email: parsed.data.email,
    });
    const user = toSessionUser(row);
    await setSessionCookie(user);
    return jsonOk({ mode, user, message: "资料已保存" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "保存失败";
    return jsonError(message, 400);
  }
}
