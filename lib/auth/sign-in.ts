import { getAuthMode } from "@/lib/auth/config";
import { setSessionCookie } from "@/lib/auth/session";
import { authenticateUser, toSessionUser } from "@/lib/auth/users";
import { resolveLoginRoleCode } from "@/lib/rbac/defaults";

export type SignInResult =
  | { ok: true; redirectTo: string; mode: "demo" | "local" }
  | { ok: false; error: string };

export async function signInWithPassword(login: string, password: string): Promise<SignInResult> {
  const identifier = login.trim();
  if (!identifier) return { ok: false, error: "请输入用户名或邮箱" };
  if (!password) return { ok: false, error: "请输入密码" };

  const mode = getAuthMode();
  if (mode === "demo") {
    const isEmail = identifier.includes("@");
    const username = isEmail ? identifier.split("@")[0] || "demo" : identifier.toLowerCase();
    await setSessionCookie({
      id: "demo-user",
      username,
      email: isEmail ? identifier.toLowerCase() : `${identifier.toLowerCase()}@demo.local`,
      displayName: isEmail ? identifier.split("@")[0] || "演示用户" : identifier,
      roleCode: resolveLoginRoleCode(username),
    });
    return { ok: true, mode: "demo", redirectTo: "/dashboard/" };
  }

  const user = await authenticateUser(identifier, password);
  if (!user) return { ok: false, error: "用户名/邮箱或密码错误" };
  await setSessionCookie(toSessionUser(user));
  return { ok: true, mode: "local", redirectTo: "/dashboard/" };
}
