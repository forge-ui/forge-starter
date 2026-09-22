import { listAiModels } from "@/lib/models/service";
import { MODEL_STATUS_META } from "@/lib/models/types";
import { AGENT_TABLE_LIMIT, type AgentTool } from "@/lib/agent/types";
import { z } from "zod";

const schema = z.object({}).strict();

export const modelAgentTools: AgentTool[] = [
  {
    id: "models.list",
    mode: "read",
    permission: { resource: "models", action: "read" },
    description: "列出模型的名称、供应商、模型名、是否启用、是否默认。没有密钥，也不能改配置。",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    schema,
    async run() {
      const rows = await listAiModels();
      const safe = rows.map((row) => ({
        name: row.name,
        provider: row.providerLabel,
        modelName: row.modelName,
        status: MODEL_STATUS_META[row.status].label,
        isDefault: row.isDefault ? "是" : "否",
      }));
      return {
        summary: `共 ${safe.length} 个模型配置。没有 API Key。${JSON.stringify(safe)}`,
        blocks: [
          {
            type: "table",
            title: `模型（${safe.length}）`,
            columns: [
              { key: "name", label: "名称" },
              { key: "provider", label: "供应商" },
              { key: "modelName", label: "模型" },
              { key: "status", label: "状态" },
              { key: "isDefault", label: "默认" },
            ],
            rows: safe.slice(0, AGENT_TABLE_LIMIT).map((row, index) => ({
              id: String(index),
              ...row,
            })),
          },
        ],
      };
    },
  },
];
