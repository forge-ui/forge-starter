import { z } from "zod";
import type { AgentFormFill, AgentTool } from "@/lib/agent/types";
import type { RbacResource } from "@/lib/rbac/constants";
import { encodeResourceFields } from "@/lib/agent/resource-fields";
import { toolParameters } from "@/lib/semantic/schema";
import type { ModuleDefinition } from "./definition";

export function moduleDraftTools(
  definitions: readonly ModuleDefinition[],
  schemas: Record<string, z.ZodObject>,
  readers: Record<string, () => Promise<object[]>>,
): AgentTool[] {
  return definitions.flatMap((module): AgentTool[] => {
    const draft = module.draft;
    if (!draft || draft.adapter !== "generic") return [];
    const shape = schemas[module.id].shape as Record<string, z.ZodType>;
    const fields = z.object(Object.fromEntries(draft.fields.map(field => {
      if (!shape[field]) throw new Error(`未登记的草稿字段：${module.id}.${field}`);
      return [field, shape[field]];
    }))).partial().strict();
    return draft.actions.map((action): AgentTool => {
      const label = { create: "新建", update: "编辑", delete: "删除" }[action];
      const schema = action === "create" ? z.object({ fields }).strict()
        : action === "update" ? z.object({ id: z.string().uuid(), fields }).strict()
        : z.object({ id: z.string().uuid() }).strict();
      async function prepare(raw: unknown): Promise<AgentFormFill> {
        const args = schema.parse(raw);
        const record = "id" in args ? (await readers[module.id]()).find(row => (row as Record<string, unknown>).id === args.id) as Record<string, unknown> | undefined : undefined;
        if ("id" in args && !record) throw new Error("目标不存在，请重新查询");
        const updatedAt = record?.updatedAt instanceof Date ? record.updatedAt.toISOString() : record?.updatedAt;
        if (record && typeof record.revision !== "number" && typeof updatedAt !== "string") throw new Error("缺少记录版本，不能准备修改草稿");
        return { formId: module.id, mode: action === "update" ? "edit" : action, href: module.menu.href,
          recordId: record ? String(record.id) : undefined,
          expectedRevision: typeof record?.revision === "number" ? record.revision : undefined,
          expectedUpdatedAt: typeof updatedAt === "string" ? updatedAt : undefined,
          fields: encodeResourceFields("fields" in args ? args.fields : {}),
        };
      }
      return {
        id: `${module.id}.${action}`, mode: "write", permission: { resource: module.permissionResource as RbacResource, action },
        description: `准备${module.label}${label}草稿；仅填写用户明确给出的字段，经确认带入页面，由页面保存或确认删除。不直接写库，未保存不能声称完成。`,
        schema, parameters: toolParameters(schema), fill: prepare,
        async describe(raw) {
          const fill = await prepare(raw);
          return { title: `${module.label}：${label}`, body: `目标：${fill.recordId ?? "新记录"}。预填字段：${JSON.stringify(fill.fields)}。请在页面核对并${action === "delete" ? "确认删除" : "保存"}，尚未修改数据。`, actionLabel: "确认并带入页面" };
        },
      };
    });
  });
}
