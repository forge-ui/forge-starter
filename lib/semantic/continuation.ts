import { resourceReaders, type ReadbackResource } from "./resource-readback";
import { accountAgentTools } from '@/lib/accounts/agent';
import { getAdminAccountById } from '@/lib/accounts/service';
import { hasPermission, type AccessContext } from '@/lib/rbac/access';
import type { AgentToolOutput } from '@/lib/agent/types';
import { OperationError, readOperation } from './operations';

/** Trust a durable, owned operation; never a receipt pasted into chat. */
export async function prepareContinuationReadback(operationId: string, userId: string, access: AccessContext): Promise<AgentToolOutput> {
  const op = await readOperation(operationId, userId);
  if (!['committed', 'verified'].includes(op.state) || !op.receipt || !op.entityId) throw new OperationError('操作尚未保存，不能继续核对');
  if (op.actionId.startsWith("settings.")) {
    if (!hasPermission(access, "settings", "read")) throw new OperationError("没有应用读取权限", 403);
    const receipt = op.receipt as { result?: Record<string, unknown> };
    if (receipt.result?.storage !== "browser-local") throw new OperationError("缺少本地应用结果");
    return { summary: `当前浏览器页面报告已保存应用配置（浏览器本地存储，服务器无法独立核实）：${JSON.stringify(receipt.result)}。不要称为服务端创建、跨浏览器同步或SSO接入。` };
  }
  const resource = op.actionId.split(".")[0] as ReadbackResource;
  if (Object.hasOwn(resourceReaders, resource)) {
    if (!hasPermission(access, resource, "read")) throw new OperationError("没有读取权限", 403);
    const row = await resourceReaders[resource](op.entityId);
    if (op.actionId.endsWith(".delete")) {
      if (row) throw new OperationError("记录仍存在，请重新核对");
      return { summary: "服务端已重新查询：目标已删除。" };
    }
    if (!row) throw new OperationError("保存后的记录已不存在");
    return { summary: JSON.stringify({ resource, record: row }) };
  }
  if (!hasPermission(access, 'accounts', 'read')) throw new OperationError('没有账号读取权限', 403);
  if (!['accounts.create', 'accounts.update', 'accounts.delete'].includes(op.actionId)) throw new OperationError('该操作尚未登记续办能力');
  if (op.actionId === 'accounts.delete') {
    if (await getAdminAccountById(op.entityId)) throw new OperationError('删除后的记录仍存在，请重新核对');
    return { summary: `服务端已重新查询：账号 ${op.entityId} 不存在，删除已核实。` };
  }
  const tool = accountAgentTools.find(t => t.id === 'accounts.get');
  if (!tool || tool.mode !== 'read') throw new OperationError('未登记账号读回工具');
  return tool.run({id: op.entityId}, {userId});
}
