import { z } from "zod";
import { APP_MODULE_IDS } from "@/config/apps";
export const appDraftSchema = z.object({
  name: z.string().max(120).optional(), subtitle: z.string().max(300).optional(),
  kind: z.enum(["link", "external", "internal"]).optional(),
  href: z.string().max(2000).optional(), openMode: z.enum(["same_tab", "new_tab"]).optional(),
  authMode: z.enum(["none", "passthrough", "oidc", "platform"]).optional(),
  modules: z.array(z.enum(APP_MODULE_IDS)).max(7).optional(),
}).strict();
export const localAppSchema = appDraftSchema.extend({ id: z.string().min(1).max(120), name: z.string().max(120), isCurrentProduct: z.boolean().optional() }).strict();
export function decodeAppDraft(fields: Record<string, string>) { return appDraftSchema.parse(Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, JSON.parse(value)]))); }

export function publicLocalApp(row: Record<string, unknown>) { return localAppSchema.parse(Object.fromEntries(Object.entries(row).filter(([key]) => key in localAppSchema.shape).map(([key, value]) => [key, key === "href" && value === null ? "" : value]))); }
export function localAppSnapshot(row: Record<string, unknown>) { return JSON.stringify(publicLocalApp(row)); }
