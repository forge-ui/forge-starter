import { createSchema as rolesSchema } from "@/lib/roles/input";
import { createSchema as menusSchema } from "@/lib/menus/input";
import { createSchema as permissionsSchema } from "@/lib/permissions/input";
import { createSchema as modelsSchema } from "@/lib/models/input";
import { resolveProviderId, modelProviderById } from "@/lib/models/providers";
import { z } from "zod";
import { MODULES } from "@/config/modules.generated";
import { moduleDraftSchemas } from "@/lib/modules/draft-schemas.generated";
import { RBAC_ACTIONS, RBAC_RESOURCES } from "@/lib/rbac/constants";
const text = z.string().max(500);
const common = { name: text.optional(), description: text.optional() };
const code = z.string().regex(/^[a-z][a-z0-9_:-]{1,47}$/, "编码需2–48位小写字母、数字或_:-").optional();
const status = z.enum(["active", "disabled"]).optional();
export const resourceDraftSchemas = {
  roles: rolesSchema.partial().extend({ ...common, code, status, permissionIds: z.array(z.string().uuid()).max(200).optional() }).strict(),
  menus: menusSchema.partial().extend({ ...common, code, status, path: z.string().startsWith("/").max(500).optional(), parentId: z.string().uuid().nullable().optional(), sort: z.number().int().min(0).max(9999).optional() }).strict(),
  permissions: permissionsSchema.partial().extend({ ...common, code, resource: z.enum(RBAC_RESOURCES).optional(), action: z.enum(RBAC_ACTIONS).optional() }).strict(),
  models: modelsSchema.omit({ apiKey: true }).partial().extend({ name: text.optional(), provider: text.optional(), modelName: text.optional(), apiBase: text.optional(), status, isDefault: z.boolean().optional(), notes: text.optional() }).strict(),
};
export type DraftResource = keyof typeof resourceDraftSchemas;
export function encodeResourceFields(values: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(values).map(([key, value]) => [key, JSON.stringify(value)]));
}
/** Only fields in the public schema can reach a form. API keys never enter chat. */
export function decodeResourceFields(resource: string, fields: Record<string, string>): Record<string, unknown> {
  const module = MODULES.find(module => module.id === resource);
  const schema = resourceDraftSchemas[resource as DraftResource];
  const values = Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, JSON.parse(value)]));
  if (schema) return schema.parse(values);
  if (module?.draft?.adapter !== "generic") throw new Error("未登记的页面草稿");
  const shared = (moduleDraftSchemas as Record<string, z.ZodObject>)[resource];
  const shape = shared.shape as Record<string, z.ZodType>;
  return z.object(Object.fromEntries(module.draft.fields.map(field => [field, shape[field]]))).partial().strict().parse(values);
}
export function resourceFormDraft<T extends object>(resource: string, fields: Record<string, string> | undefined, base: T): T {
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
