import { z } from "zod";
import { RBAC_ACTIONS, RBAC_RESOURCES } from "@/lib/rbac/constants";

export const createSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(2),
  resource: z.enum(RBAC_RESOURCES),
  action: z.enum(RBAC_ACTIONS),
  description: z.string().optional().default(""),
});
export const updateSchema = createSchema.extend({ code: createSchema.shape.code.optional() });
