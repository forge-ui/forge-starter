import { z } from "zod";

export const createSchema = z.object({
  name: z.string().min(1),
  provider: z.string().min(1),
  modelName: z.string().min(1),
  apiBase: z.string().optional().default(""),
  apiKey: z.string().optional().default(""),
  status: z.enum(["active", "disabled"]),
  isDefault: z.boolean().optional().default(false),
  notes: z.string().optional().default(""),
});
export const updateSchema = createSchema;
