import { z } from "zod";

export const createSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(2),
  path: z.string().min(1),
  parentId: z.string().uuid().nullable().optional(),
  sort: z.number().int().min(0).max(9999),
  status: z.enum(["active", "disabled"]),
  description: z.string().optional().default(""),
});
export const updateSchema = createSchema.extend({ code: createSchema.shape.code.optional() });
