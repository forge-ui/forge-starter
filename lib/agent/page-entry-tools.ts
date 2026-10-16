import { z } from "zod";
import { APP_MODULE_META } from "@/config/apps";
import { listRoles } from "@/lib/roles/service";
import { listMenus } from "@/lib/menus/service";
import { listPermissions } from "@/lib/permissions/service";
import { listAiModels } from "@/lib/models/service";
import { toolParameters } from "@/lib/semantic/schema";
import type { AgentTool } from "./types";

export const FORM_ENTRY_MODULES = ["roles", "menus", "permissions", "models", "settings"] as const;
const empty = z.object({}).strict();
const target = z.object({ id: z.string().uuid() }).strict();
const readers = { roles: listRoles, menus: listMenus, permissions: listPermissions, models: listAiModels };

/** Open existing UI only. No database write, credentials or inferred permission grants. */
export const pageEntryTools: AgentTool[] = [
  ...FORM_ENTRY_MODULES.map((resource): AgentTool => ({
    id: `${resource}.create_form`, mode: "read",
    permission: { resource, action: "create" },
    description: `打开${APP_MODULE_META[resource].label}的新建表单。用户要求创建时调用，缺字段由用户在页面填写；仅打开空白表单，不预填、不保存、不创建记录。`,
    schema: empty, parameters: toolParameters(empty),
    async run(args) {
      empty.parse(args);
      return { summary: "正在前往新建表单所在页面，仍需用户填写并保存。", navigation: { href: `${APP_MODULE_META[resource].href}?create=1`, label: APP_MODULE_META[resource].label } };
    },
  })),
  ...Object.entries(readers).flatMap(([key, read]) => {
    const resource = key as keyof typeof readers;
    return (["open", "edit_form"] as const).map((action): AgentTool => ({
      id: `${resource}.${action}`, mode: "read",
      permission: { resource, action: action === "open" ? "read" : "update" },
      description: `使用${resource}.list返回的真实id，打开${APP_MODULE_META[resource].label}${action === "open" ? "详情" : "编辑表单，由用户核对并保存"}。多个匹配先选择，不猜编号；不修改或删除数据。`,
      schema: target, parameters: toolParameters(target),
      async run(args) {
        const { id } = target.parse(args);
        const row = (await read()).find(row => row.id === id);
        if (!row) throw new Error("目标不存在，请重新查询并选择");
        return { summary: "正在打开目标所在页面，尚未修改数据。", navigation: { href: `${APP_MODULE_META[resource].href}?${action === "open" ? "id" : "edit"}=${id}`, label: APP_MODULE_META[resource].label } };
      },
    }));
  }),
].filter(tool => tool.id !== "models.open"); // Existing semantic page tool owns model detail.
