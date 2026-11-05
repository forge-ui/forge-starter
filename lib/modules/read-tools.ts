import { z } from "zod";
import type { AgentTool, AgentToolContext } from "@/lib/agent/types";
import { AGENT_LIST_LIMIT, AGENT_TABLE_LIMIT } from "@/lib/agent/types";
import type { RbacResource } from "@/lib/rbac/constants";
import type { ModuleDefinition } from "./definition";
import { publicModuleRow } from "./sanitize";

const fieldLabels: Record<string, string> = { id: "编号", name: "名称", status: "状态", code: "编码", description: "说明", createdAt: "创建时间", updatedAt: "更新时间" };

export function moduleReadTools(
  definitions: readonly ModuleDefinition[],
  readers: Record<string, (context: AgentToolContext) => Promise<object[]>>,
): AgentTool[] {
  return definitions.flatMap((module): AgentTool[] => {
    const read = module.read;
    if (!("service" in read)) return [];
    const schema = z.object({ query: z.string().max(200).optional() }).strict();
    return [{
      id: `${module.id}.list`, mode: "read",
      permission: { resource: module.permissionResource as RbacResource, action: "read" },
      description: `查询${module.label}真实列表，支持关键词；只返回白名单字段，最多显示${AGENT_LIST_LIMIT}条。${module.knowledge.rules}`,
      schema, parameters: z.toJSONSchema(schema),
      async run(raw, context) {
        const { query } = schema.parse(raw);
        const rows = (await readers[module.id](context)).map(row => publicModuleRow(row, read.fields, read.sensitiveFields));
        const matched = query ? rows.filter(row => JSON.stringify(row).toLowerCase().includes(query.toLowerCase())) : rows;
        const shown = matched.slice(0, AGENT_LIST_LIMIT);
        return {
          summary: JSON.stringify({ resource: module.id, total: matched.length, shown: shown.length, records: shown, truncated: matched.length > shown.length }),
          blocks: [{ type: "table", title: `${module.label}（${Math.min(shown.length, AGENT_TABLE_LIMIT)} / ${matched.length}）`,
            columns: read.fields.slice(0, 6).map(key => ({ key, label: read.fieldLabels?.[key] ?? fieldLabels[key] ?? key })),
            rows: shown.slice(0, AGENT_TABLE_LIMIT).map(row => Object.fromEntries(Object.entries(row).map(([key, value]) => [key, typeof value === "object" ? JSON.stringify(value) : String(value ?? "")]))),
          }],
        };
      },
    }];
  });
}
