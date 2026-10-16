import { eq } from "drizzle-orm";
import { aiModels, rbacRoles, rbacMenus, rbacPermissions } from "@/lib/db/schema";
import { OperationError, semanticEnabled } from "./operations";
import { writeWithReceipt } from "./write-api";
import { inResourceTransaction } from "./resource-db";

export const RECEIPT_RESOURCES = ["roles", "menus", "permissions", "models"] as const;
export type ReceiptResource = typeof RECEIPT_RESOURCES[number];
const tables = { roles: rbacRoles, menus: rbacMenus, permissions: rbacPermissions, models: aiModels };

/** Same transaction for entity/grants/defaults and receipt, with stale-form guard. */
export async function resourceWrite(request: Request, userId: string, resource: ReceiptResource, action: "create" | "update" | "delete" | "probe", id: string | undefined, payload: unknown, run: () => Promise<Record<string, unknown>>) {
  return writeWithReceipt(request, userId, `${resource}.${action}`, id, payload, async tx => {
    const execute = async () => {
      if (tx && id) {
        const table = tables[resource];
        const [row] = await tx.select({ id: table.id, updatedAt: table.updatedAt }).from(table).where(eq(table.id, id)).for("update");
        if (!row) throw new OperationError("记录不存在或已删除", 404);
        const expected = request.headers.get("x-expected-updated-at");
        if (!expected || row.updatedAt.toISOString() !== expected) throw new OperationError("记录已变化，请刷新页面后重新核对");
      }
      const result = await run();
      const entity = Object.values(result).find(value => value && typeof value === "object" && "id" in value) as { id: string } | undefined;
      return { entityId: id ?? entity?.id ?? "", result };
    };
    // Manual writes also use this transaction when the feature is enabled.
    return tx && semanticEnabled() ? inResourceTransaction(tx, execute) : execute();
  });
}
