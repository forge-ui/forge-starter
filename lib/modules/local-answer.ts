import { classifyIntent } from "@/lib/agent/intent-policy";
import { signAgentIntent } from "@/lib/agent/intent";
import type { AgentBlock, AgentTool, AgentToolContext } from "@/lib/agent/types";
import type { ModuleDefinition } from "./definition";

export async function localModuleAnswer(
  question: string,
  context: AgentToolContext,
  definitions: readonly ModuleDefinition[],
  tools: readonly AgentTool[],
) {
  const matched = definitions.filter(module => question.includes(module.label) || question.includes(module.id));
  const visible = definitions.filter(module => tools.some(tool => tool.id === `${module.id}.navigate`));
  const knowledge = /功能|如何|怎么|能做什么|能干什么|支持什么|系统介绍|哪些模块|什么模块|做什么/.test(question);
  if (knowledge && (matched.length || /哪些模块|什么模块/.test(question))) {
    const modules = matched.length ? visible.filter(module => matched.includes(module)) : visible;
    return {
      text: modules.length ? modules.map(module => `${module.label}：${module.knowledge.summary}${matched.length ? module.knowledge.fields + module.knowledge.rules : ""}`).join("\n") + "\n当前使用本地规则，以上为已授权模块说明。" : "没有可查看的模块权限。",
      live: false,
      blocks: [] as AgentBlock[],
      links: modules.map(module => ({ label: module.label, href: module.menu.href })),
    };
  }
  if (matched.length !== 1 || matched[0].tools?.length) return;
  const module = matched[0];
  const links = visible.includes(module) ? [{ label: `打开${module.label}`, href: module.menu.href }] : [];
  if (!visible.includes(module)) return { text: "没有该模块的读取权限。", live: false, blocks: [] as AgentBlock[], links };
  const action = classifyIntent(question);
  if (action === "read") {
    const tool = tools.find(tool => tool.id === `${module.id}.list`);
    if (tool?.mode !== "read") return { text: "该模块尚未开放助手查询。", live: false, blocks: [] as AgentBlock[], links };
    if (!/^(?:请)?(?:列出|查询|查看|显示)(?:全部|所有)?(?:的)?$/.test(question.replace(module.label, "").replace(module.id, "").trim())) {
      return { text: `本地规则仅支持列出${module.label}全部记录；筛选条件请在页面办理。`, live: false, blocks: [] as AgentBlock[], links };
    }
    const output = await tool.run({}, context);
    return { text: "已读取真实记录，请查看查询结果。", live: false, blocks: output.blocks ?? [], links };
  }
  if (action === "create") {
    const tool = tools.find(tool => tool.id === `${module.id}.create`);
    if (tool?.mode !== "write" || module.draft?.adapter !== "generic") return { text: "尚未接通页面写入适配，请在页面办理；未修改数据。", live: false, blocks: [] as AgentBlock[], links };
    const args = tool.schema.parse({ fields: {} });
    const description = await tool.describe(args);
    const intent = await signAgentIntent(context.userId, tool.id, args, { page: context.page });
    return { text: "已准备空白草稿，尚未写入；确认后在页面补充字段并保存。", live: false, blocks: [{ type: "confirm", intent, ...description }] as AgentBlock[], links };
  }
  return { text: `当前本地规则支持模块说明、列出${module.label}和准备新建草稿；其他操作请在页面办理。`, live: false, blocks: [] as AgentBlock[], links };
}
