import { localAppSchema } from "@/lib/agent/app-fields";
import { z } from "zod";
import { CONTRACT_VERSION, APPLICATION_BUILD_ID, moduleForPage } from "./contracts";

export const pageContextSchema = z.object({
  version: z.literal(CONTRACT_VERSION),
  buildId: z.literal(APPLICATION_BUILD_ID),
  pageId: z.enum(["accounts.list", "accounts.detail", "models.workspace", "roles.list", "menus.list", "permissions.list", "settings.apps", "dashboard.home"]),
  instanceId: z.string().uuid(),
  revision: z.number().int().nonnegative(),
  entityId: z.string().min(1).max(120).optional(),
  query: z.object({
    query: z.string().max(80).optional(),
    status: z.enum(["active", "disabled", "pending", "locked"]).optional(),
    role: z.enum(["超级管理员", "运营", "审计", "只读"]).optional(),
    provider: z.string().max(80).optional(),
    modelType: z.string().max(40).optional(),
  }).strict(),
  localApps: z.array(localAppSchema).max(50).optional(),
  form: z.object({ mode: z.enum(["create", "edit", "delete"]), entityId: z.string().min(1).max(120).optional(), dirty: z.boolean() }).strict().optional(),
}).strict().superRefine((c, ctx) => {
  if (c.pageId.startsWith("accounts") && (c.query.provider || c.query.modelType)) ctx.addIssue({ code: "custom", message: "账号页面不支持模型筛选" });
  if (c.pageId === "models.workspace" && (c.query.role || c.query.status)) ctx.addIssue({ code: "custom", message: "模型页面不支持账号筛选" });
  if (c.pageId !== "settings.apps") {
    for (const id of [c.entityId, c.form?.entityId]) if (id && !z.string().uuid().safeParse(id).success) ctx.addIssue({ code: "custom", message: "记录编号无效" });
  }
  if (JSON.stringify(c).length > 16384) ctx.addIssue({ code: "custom", message: "页面上下文过大" });
});
export type PageContext = z.infer<typeof pageContextSchema>;
export type PageState = Omit<PageContext, "version" | "buildId" | "instanceId" | "revision">;
export function contextForPermissions(context: PageContext | undefined, allowed: string[]) {
  if (!context) return undefined;
  const moduleId = moduleForPage(context.pageId);
  return moduleId && allowed.includes(moduleId) ? context : undefined;
}
export function sameContext(a?: PageContext, b?: PageContext) {
  return Boolean(a && b && a.version === b.version && a.buildId === b.buildId && a.instanceId === b.instanceId && a.revision === b.revision);
}
