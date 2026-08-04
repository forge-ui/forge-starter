import { z } from "zod";
import { getAuthMode } from "@/lib/auth/config";
import { jsonError, jsonOk } from "@/lib/auth/http";
import { setSessionCookie } from "@/lib/auth/session";
import { authenticateUser, toSessionUser } from "@/lib/auth/users";

const bodySchema = z.object({
  login: z.string().trim().min(1, "请输入用户名或邮箱"),
  password: z.string().min(1, "请输入密码"),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "参数无效");
    }

    const mode = getAuthMode();
    if (mode === "demo") {
      const login = parsed.data.login;
      const isEmail = login.includes("@");
      await setSessionCookie({
        id: "demo-user",
        username: isEmail ? login.split("@")[0] || "demo" : login.toLowerCase(),
        email: isEmail ? login.toLowerCase() : `${login.toLowerCase()}@demo.local`,
        displayName: isEmail ? login.split("@")[0] || "演示用户" : login,
      });
      return jsonOk({ mode: "demo", redirectTo: "/dashboard/" });
    }

    const user = await authenticateUser(parsed.data.login, parsed.data.password);
    if (!user) {
      return jsonError("用户名/邮箱或密码错误", 401);
    }
    await setSessionCookie(toSessionUser(user));
    return jsonOk({ mode: "local", redirectTo: "/dashboard/" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "登录失败";
    return jsonError(message, 500);
  }
}
