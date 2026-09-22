import { listPermissions } from "@/lib/permissions/service";
import { AGENT_LIST_LIMIT, AGENT_TABLE_LIMIT, type AgentTool } from "@/lib/agent/types";
import { z } from "zod";

const schema = z.object({}).strict();

export const permissionAgentTools: AgentTool[] = [
  {
    id: "permissions.list",
    mode: "read",
    permission: { resource: "permissions", action: "read" },
    description: "列出权限编码、资源和操作，以及已经分配到的角色名。用来回答某个角色能看什么。",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    schema,
    async run() {
      const rows = await listPermissions();
      const shown = rows.slice(0, AGENT_LIST_LIMIT);
      return {
        summary: `共 ${rows.length} 条权限。${JSON.stringify(
          shown.map((item) => ({
            code: item.code,
            name: item.name,
            resource: item.resource,
            action: item.action,
            roles: item.roleNames,
          })),
        )}`,
        blocks: [
          {
            type: "table",
            title: rows.length > AGENT_TABLE_LIMIT
              ? `权限（显示 ${AGENT_TABLE_LIMIT} / ${rows.length}）`
              : `权限（${rows.length}）`,
            columns: [
              { key: "code", label: "编码" },
              { key: "resource", label: "资源" },
              { key: "action", label: "操作" },
              { key: "roles", label: "角色" },
            ],
            rows: shown.slice(0, AGENT_TABLE_LIMIT).map((item) => ({
              id: item.id,
              code: item.code,
              resource: item.resource,
              action: item.action,
              roles: item.roleNames.join("、") || "—",
            })),
          },
        ],
      };
    },
  },
];
