import type { z } from "zod";

export function zodMessage(error: z.ZodError) {
  return error.issues[0]?.message ?? "参数无效";
}

export function parseArgs<T>(schema: z.ZodType<T>, input: unknown): T {
  const parsed = schema.safeParse(input ?? {});
  if (!parsed.success) throw new Error(zodMessage(parsed.error));
  return parsed.data;
}
