import { z } from "zod";

export const createSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(2),
  description: z.string().optional().default(""),
  status: z.enum(["active", "disabled"]),
  permissionIds: z.array(z.string().uuid()).optional().default([]),
});
export const updateSchema = createSchema.extend({ code: createSchema.shape.code.optional() });
