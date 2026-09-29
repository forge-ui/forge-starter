import { accountAgentTools } from '@/lib/accounts/agent';
import { getAdminAccountById } from '@/lib/accounts/service';
import { hasPermission, type AccessContext } from '@/lib/rbac/access';
import type { AgentToolOutput } from '@/lib/agent/types';
import { OperationError, readOperation } from './operations';

/** Trust a durable, owned operation; never a receipt pasted into chat. */
export async function prepareContinuationReadback(operationId: string, userId: string, access: AccessContext): Promise<AgentToolOutput> {
  const op = await readOperation(operationId, userId);
  if (!['committed', 'verified'].includes(op.state) || !op.receipt || !op.entityId) throw new OperationError('操作尚未保存，不能继续核对');
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
