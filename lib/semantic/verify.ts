import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { semanticOperations } from "@/lib/db/schema";
import { getAdminAccountById } from "@/lib/accounts/service";
import { readOperation, type Receipt } from "./operations";
/** Read back committed effects. A later edit is reported, never replayed. */
export async function verifyOperation(id: string, userId: string): Promise<Receipt | undefined> {
  const operation = await readOperation(id, userId);
  if (!["committed", "verified"].includes(operation.state) || !operation.receipt) return undefined;
  const receipt = operation.receipt as Receipt;
  if (receipt.status === "verified") return receipt;
  if (!receipt.actionId.startsWith("accounts.")) return receipt;
  const current = await getAdminAccountById(receipt.entityId);
  const matches = receipt.actionId === "accounts.delete" ? !current : current && current.revision === receipt.revision;
  if (!matches) return receipt;
  const verified: Receipt = { ...receipt, status: "verified", verifiedAt: new Date().toISOString() };
  await getDb().update(semanticOperations).set({ state: "verified", receipt: verified, updatedAt: new Date() }).where(eq(semanticOperations.id, id));
  return verified;
}
