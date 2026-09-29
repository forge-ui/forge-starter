import { verifyOperation } from "./verify";
import { z } from "zod";
import { commitOperation, OperationError, semanticEnabled, type Transaction } from "./operations";
const idSchema = z.string().uuid();
export function expectedRevision(request: Request) {
  const raw = request.headers.get("if-match");
  if (!raw && !semanticEnabled()) return undefined;
  if (!raw || !/^\d+$/.test(raw) || Number(raw) < 1 || !Number.isSafeInteger(Number(raw))) throw new OperationError("缺少有效的记录版本，请刷新页面", 428);
  return Number(raw);
}
export async function writeWithReceipt(request: Request, userId: string, actionId: string, entityId: string | undefined, payload: unknown, run: (tx?: Transaction) => Promise<{ entityId: string; revision?: number; result: Record<string, unknown> }>) {
  if (!semanticEnabled()) return (await run()).result;
  const operationId = request.headers.get("x-operation-id");
  const key = operationId ?? request.headers.get("idempotency-key");
  if (!key || !idSchema.safeParse(key).success) throw new OperationError("缺少有效的操作标识", 428);
  const receipt = await commitOperation({ id: key, userId, actionId, entityId, payload: { body: payload, revision: request.headers.get("if-match") }, confirmed: Boolean(operationId) }, run);
  const verified = await verifyOperation(receipt.operationId, userId).catch(() => undefined);
  return { ...receipt.result, receipt: verified ?? receipt };
}
