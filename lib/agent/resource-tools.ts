import { z } from "zod";
import { listRoles } from "@/lib/roles/service";
import { listMenus } from "@/lib/menus/service";
import { listPermissions } from "@/lib/permissions/service";
import { listAiModels } from "@/lib/models/service";
import { APP_MODULE_META } from "@/config/apps";
import { toolParameters } from "@/lib/semantic/schema";
import { resourceDraftSchemas, encodeResourceFields, resourceFormDraft, type DraftResource } from "./resource-fields";
import type { AgentTool, AgentFormFill } from "./types";
const readers = { roles: listRoles, menus: listMenus, permissions: listPermissions, models: listAiModels };
export const resourceAgentTools: AgentTool[] = Object.keys(readers).flatMap(key => {
  const resource = key as DraftResource;
  return (["create", "update", "delete"] as const).map((action): AgentTool => {
    const fields = resourceDraftSchemas[resource];
    const schema = action === "create" ? z.object({ fields }).strict() : action === "update" ? z.object({ id: z.string().uuid(), fields }).strict() : z.object({ id: z.string().uuid() }).strict();
    const label = APP_MODULE_META[resource].label;
    async function prepare(raw: unknown): Promise<AgentFormFill> {
      const args = schema.parse(raw);
      if ("fields" in args) resourceFormDraft(resource, encodeResourceFields(args.fields), {});
      const row = "id" in args ? (await readers[resource]()).find(row => row.id === args.id) : undefined;
      if ("id" in args && !row) throw new Error("目标不存在，请重新查询");
      if (action === "update" && row && "fields" in args) {
        const fields = args.fields as Record<string, unknown>;
        if ("code" in fields && "code" in row && fields.code !== row.code) throw new Error("编码创建后不能修改");
        if (resource === "menus" && "builtin" in row && row.builtin && (("path" in fields && fields.path !== row.path) || fields.parentId)) throw new Error("内置菜单的路径与一级结构不能修改");
      }
      if (resource === "roles" && "fields" in args && "permissionIds" in args.fields && args.fields.permissionIds) {
        const permissions = await listPermissions();
        if (args.fields.permissionIds.some(id => !permissions.some(p => p.id === id))) throw new Error("权限已变化，请重新查询真实权限编号");
      }
      if (resource === "menus" && action === "delete" && row && "builtin" in row && row.builtin) throw new Error("内置菜单不能删除");
      return { formId: resource, mode: action === "update" ? "edit" : action, href: APP_MODULE_META[resource].href, recordId: row?.id, expectedUpdatedAt: row?.updatedAt, fields: encodeResourceFields("fields" in args ? args.fields : {}) };
    }
    return { id: `${resource}.${action}`, mode: "write", permission: { resource, action }, schema, parameters: toolParameters(schema),
      description: `${action === "create" ? "准备新建" : action === "update" ? "准备修改" : "准备删除"}${label}，经用户确认后把草稿带入真实页面，由页面保存或确认删除。已有目标先查询真实id，多候选须选择。fields只填用户明确提供的值，缺字段留空，不猜权限或联系方式；未指定权限留空。API Key只能在页面填写。模型启停或设默认用update的status/isDefault。不会直接写库。`,
      async fill(raw) { return prepare(raw); },
      async describe(raw) {
        const fill = await prepare(raw);
        const row = fill.recordId ? (await readers[resource]()).find(row => row.id === fill.recordId) : undefined;
        const fields = "fields" in schema.parse(raw) ? (raw as { fields: Record<string, unknown> }).fields : {};
        const fieldLabels: Record<string, string> = { name: "名称", code: "编码", description: "说明", status: "状态", permissionIds: "授权权限", path: "路径", parentId: "上级菜单", sort: "排序", resource: "资源", action: "操作", provider: "供应商", modelName: "模型 ID", apiBase: "调用地址", isDefault: "默认模型", notes: "备注" };
        const permissions = resource === "roles" && Array.isArray(fields.permissionIds) && fields.permissionIds.length ? await listPermissions() : [];
        const detail = Object.entries(fields).map(([key, value]) => {
          const shown = key === "permissionIds" && Array.isArray(value) ? value.map(id => permissions.find(p => p.id === id)?.name ?? id).join("、") || "不分配权限" : value === "active" ? "启用" : value === "disabled" ? "停用" : typeof value === "boolean" ? value ? "是" : "否" : value === null ? "无" : String(value);
          return `${fieldLabels[key] ?? key}：${shown}`;
        }).join("；");
        return { title: `${action === "create" ? "新建" : action === "update" ? "修改" : "删除"}${label}`, body: `${row ? `目标：${row.name}（${row.id}）。` : ""}${action === "delete" ? "删除后不可恢复，仍需在页面确认。" : `预填内容：${detail || "未指定，待页面填写"}。缺少的信息请在页面补齐，核对后保存。`}`, actionLabel: "确认并带入页面" };
      },
    };
  });
});

const probeSchema = z.object({ id: z.string().uuid() }).strict();
resourceAgentTools.push({
  id: "models.probe", mode: "write", permission: { resource: "models", action: "update" }, schema: probeSchema, parameters: toolParameters(probeSchema),
  description: "用户明确要求测试模型连接时，查询真实id后准备测连确认；确认后由模型页面执行真实网络请求，可能消耗一次调用，不把启用状态当测连成功。",
  async describe(raw) { const {id} = probeSchema.parse(raw); const row = (await listAiModels()).find(row => row.id === id); if (!row) throw new Error("模型不存在"); return { title: "测试模型连接", body: `对「${row.name}」发送一次真实连接测试，可能消耗一次模型调用。`, actionLabel: "确认测试" }; },
  async fill(raw) { const {id} = probeSchema.parse(raw); const row = (await listAiModels()).find(row => row.id === id); if (!row) throw new Error("模型不存在"); return { formId: "models", mode: "probe", href: "/models/", recordId: id, expectedUpdatedAt: row.updatedAt, fields: {} }; },
});
