import { z } from "zod";
import { MODULES } from "@/config/modules.generated";
import { moduleReaders } from "@/lib/modules/server.generated";
import { toolParameters } from "@/lib/semantic/schema";
import type { AgentTool } from "./types";

export const FORM_ENTRY_MODULES = MODULES.filter(module => module.entries.create).map(module => module.id);
const empty = z.object({}).strict();
const target = z.object({ id: z.string().uuid() }).strict();
const readers: Record<string, () => Promise<object[]>> = moduleReaders;

export const pageEntryTools: AgentTool[] = MODULES.flatMap((module): AgentTool[] => {
  const tools: AgentTool[] = [];
  if (module.entries.create) tools.push({
    id: `${module.id}.create_form`, mode: "read",
    permission: { resource: module.id, action: "create" },
    description: `打开${module.label}的新建表单；仅打开，不预填、不保存。`,
    schema: empty, parameters: toolParameters(empty),
    async run(args) {
      empty.parse(args);
      return { summary: "正在打开新建表单，仍需用户填写并保存。", navigation: { href: `${module.menu.href}?create=1`, label: module.label } };
    },
  });
  for (const action of ["open", "edit_form"] as const) {
    if (!(action === "open" ? module.entries.detail : module.entries.edit) || !readers[module.id]) continue;
    tools.push({
      id: `${module.id}.${action}`, mode: "read",
      permission: { resource: module.id, action: action === "open" ? "read" : "update" },
      description: `使用${module.id}.list的真实id打开${module.label}${action === "open" ? "详情" : "编辑表单"}；多个匹配先选择，不猜编号、不保存。`,
      schema: target, parameters: toolParameters(target),
      async run(args) {
        const { id } = target.parse(args);
        const row = (await readers[module.id]()).find(row => (row as Record<string, unknown>).id === id);
        if (!row) throw new Error("目标不存在，请重新查询并选择");
        return { summary: "正在打开目标所在页面，尚未修改数据。", navigation: { href: `${module.menu.href}?${action === "open" ? "id" : "edit"}=${id}`, label: module.label } };
      },
    });
  }
  return tools;
});
