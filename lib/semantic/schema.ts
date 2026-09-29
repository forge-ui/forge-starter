import { z } from "zod";
/** Do not silently erase custom/refinement constraints. Server schemas remain authoritative. */
export function toolParameters(schema: z.ZodType): Record<string, unknown> {
  return z.toJSONSchema(schema, { io: "input", unrepresentable: "throw" });
}
