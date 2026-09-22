import { listMenus } from "@/lib/menus/service";
import { RBAC_STATUS_META } from "@/lib/rbac/constants";
import { AGENT_LIST_LIMIT, AGENT_TABLE_LIMIT, type AgentTool } from "@/lib/agent/types";
import { z } from "zod";

const schema = z.object({}).strict();

export const menuAgentTools: AgentTool[] = [
  {
    id: "menus.list",
    mode: "read",
    permission: { resource: "menus", action: "read" },
    description:
      "列出菜单目录的名称、编码、路径和模块 id。只能解释目录。菜单三处（APP_MODULE_IDS、APP_MODULE_META、MODULE_MENU）和应用勾选是代码，这个工具改不了侧栏。",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    schema,
    async run() {
      const rows = await listMenus();
      const shown = rows.slice(0, AGENT_LIST_LIMIT);
      return {
        summary: `共 ${rows.length} 条菜单目录。改 rbac_menus 不会单独让侧栏出现入口。${JSON.stringify(
          shown.map((menu) => ({
            id: menu.id,
            name: menu.name,
            code: menu.code,
            path: menu.path,
            status: RBAC_STATUS_META[menu.status].label,
            moduleId: menu.moduleId,
            sort: menu.sort,
          })),
        )}`,
        blocks: [
          {
            type: "table",
            title: rows.length > AGENT_TABLE_LIMIT ? `菜单（显示 ${AGENT_TABLE_LIMIT} / ${rows.length}）` : `菜单（${rows.length}）`,
            columns: [
              { key: "name", label: "菜单" },
              { key: "path", label: "路径" },
              { key: "moduleId", label: "模块" },
              { key: "status", label: "状态" },
            ],
            rows: shown.slice(0, AGENT_TABLE_LIMIT).map((menu) => ({
              id: menu.id,
              name: menu.name,
              path: menu.path,
              moduleId: menu.moduleId || "—",
              status: RBAC_STATUS_META[menu.status].label,
            })),
          },
        ],
      };
    },
  },
];
