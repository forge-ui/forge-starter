import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/auth/http";
import { signInWithPassword } from "@/lib/auth/sign-in";

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

    const result = await signInWithPassword(parsed.data.login, parsed.data.password);
    if (!result.ok) {
      return jsonError(result.error, result.error.includes("密码错误") ? 401 : 400);
    }
    return jsonOk({ mode: result.mode, redirectTo: result.redirectTo });
  } catch (error) {
    const message = error instanceof Error ? error.message : "登录失败";
    return jsonError(message, 500);
  }
}
