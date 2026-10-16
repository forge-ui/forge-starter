import { resolveProviderId, modelProviderById } from "@/lib/models/providers";
import { z } from "zod";
import { RBAC_ACTIONS, RBAC_RESOURCES } from "@/lib/rbac/constants";
const text = z.string().max(500);
const common = { name: text.optional(), description: text.optional() };
const code = z.string().regex(/^[a-z][a-z0-9_:-]{1,47}$/, "编码需2–48位小写字母、数字或_:-").optional();
const status = z.enum(["active", "disabled"]).optional();
export const resourceDraftSchemas = {
  roles: z.object({ ...common, code, status, permissionIds: z.array(z.string().uuid()).max(200).optional() }).strict(),
  menus: z.object({ ...common, code, status, path: z.string().startsWith("/").max(500).optional(), parentId: z.string().uuid().nullable().optional(), sort: z.number().int().min(0).max(9999).optional() }).strict(),
  permissions: z.object({ ...common, code, resource: z.enum(RBAC_RESOURCES).optional(), action: z.enum(RBAC_ACTIONS).optional() }).strict(),
  models: z.object({ name: text.optional(), provider: text.optional(), modelName: text.optional(), apiBase: text.optional(), status, isDefault: z.boolean().optional(), notes: text.optional() }).strict(),
};
export type DraftResource = keyof typeof resourceDraftSchemas;
export function encodeResourceFields(values: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(values).map(([key, value]) => [key, JSON.stringify(value)]));
}
/** Only fields in the public schema can reach a form. API keys never enter chat. */
export function decodeResourceFields(resource: DraftResource, fields: Record<string, string>): Record<string, unknown> {
  return resourceDraftSchemas[resource].parse(Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, JSON.parse(value)])));
}
export function resourceFormDraft<T extends object>(resource: DraftResource, fields: Record<string, string> | undefined, base: T): T {
  if (!fields) return base;
  const draft = decodeResourceFields(resource, fields);
  if (resource === "menus") {
    if ("sort" in draft) draft.sort = String(draft.sort);
    if ("parentId" in draft) draft.parentId = draft.parentId ?? "__root__";
  }
  if (resource === "models" && typeof draft.provider === "string") {
    const provider = modelProviderById(resolveProviderId(draft.provider));
    if (!provider) throw new Error("供应商不存在，请在页面重新选择");
    draft.provider = provider.id;
    if (!("modelName" in draft)) draft.modelName = provider.defaultModel;
    if (!("apiBase" in draft)) draft.apiBase = provider.defaultApiBase;
  }
  if (resource === "models" && "isDefault" in draft) draft.isDefault = draft.isDefault ? "yes" : "no";
  return { ...base, ...draft };
}
