import { z } from "zod";
import { AGENT_LIST_LIMIT, AGENT_TABLE_LIMIT, type AgentTool } from "@/lib/agent/types";
import { RBAC_STATUS_META } from "@/lib/rbac/constants";
import { listRoles } from "@/lib/roles/service";

const schema = z.object({}).strict();

export const roleAgentTools: AgentTool[] = [
  {
    id: "roles.list",
    mode: "read",
    permission: { resource: "roles", action: "read" },
    description: "列出角色名称、编码、状态和已分配的权限条数。回答「能看哪些模块」时再配合 permissions.list。",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    schema,
    async run() {
      const rows = await listRoles();
      const shown = rows.slice(0, AGENT_LIST_LIMIT);
      return {
        summary: `共 ${rows.length} 个角色。${JSON.stringify(
          shown.map((role) => ({
            id: role.id,
            name: role.name,
            code: role.code,
            status: RBAC_STATUS_META[role.status].label,
            permissionCount: role.permissionCount,
            description: role.description,
          })),
        )}`,
        blocks: [
          {
            type: "table",
            title: rows.length > AGENT_TABLE_LIMIT ? `角色（显示 ${AGENT_TABLE_LIMIT} / ${rows.length}）` : `角色（${rows.length}）`,
            columns: [
              { key: "name", label: "角色" },
              { key: "code", label: "编码" },
              { key: "status", label: "状态" },
              { key: "permissionCount", label: "权限数" },
            ],
            rows: shown.slice(0, AGENT_TABLE_LIMIT).map((role) => ({
              id: role.id,
              name: role.name,
              code: role.code,
              status: RBAC_STATUS_META[role.status].label,
              permissionCount: String(role.permissionCount),
            })),
          },
        ],
      };
    },
  },
];
