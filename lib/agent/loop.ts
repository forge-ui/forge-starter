import type { AccessContext } from "@/lib/rbac/access";
import { hasPermission } from "@/lib/rbac/access";
import type { ResolvedAiModel } from "@/lib/models/types";
import { runModelChat, runModelChatTurn, type ModelMessage, type ModelToolDef } from "@/lib/models/runtime";
import { signAgentIntent } from "./intent";
import { agentToolByFunctionName, toolsForAccess } from "./registry";
import { AGENT_LOOP_LIMIT, agentFunctionName, type AgentBlock, type AgentTool } from "./types";

const TOOL_LINKS: Record<string, { label: string; href: string }> = {
  accounts: { label: "打开账号管理", href: "/accounts/" },
  roles: { label: "打开角色", href: "/roles/" },
  menus: { label: "打开菜单", href: "/menus/" },
  permissions: { label: "打开权限", href: "/permissions/" },
  models: { label: "打开模型", href: "/models/" },
};

function systemPrompt(pageLabel: string, tools: AgentTool[]) {
  const catalog = tools
    .map((tool) => {
      const kind = tool.mode === "write" ? "写入，需用户确认" : "读取";
      return `- ${agentFunctionName(tool.id)}（${kind}）：${tool.description}`;
    })
    .join("\n");
  return [
    "你是 Forge Starter 管理后台的业务助手。只用下面已登记的工具查询或提出写入。短句中文，不要编造人数、名单或密钥。",
    `当前页：${pageLabel || "未知"}。`,
    tools.length ? `可用工具：\n${catalog}` : "当前用户没有任何可用工具。不要编造数据，直接说明没有权限。",
    "规则：",
    "- 问具体数据时先调用读取工具。",
    "- 新建、修改、删除一次只提出一个写入工具，然后停下来。确认后只把字段填进页面表单或打开页面上的删除确认，不会直接改数据库。不要声称已经保存。",
    "- 登录 users 表不等于业务 admin_accounts。新建业务账号不会让侧栏出现模块。侧栏要菜单三处、当前应用勾选、角色的 {module}:read。",
    "- 不要索要或复述 API Key、密码。导出用导出工具，不要把整表贴进回复。",
    "- 配好新账号之后，如果用户还问侧栏，解释要去角色勾 read，并给出站内路径，不要假装已经改了代码。",
  ].join("\n");
}

function toolDefs(tools: AgentTool[]): ModelToolDef[] {
  return tools.map((tool) => ({
    name: agentFunctionName(tool.id),
    description: tool.description,
    parameters: tool.parameters,
  }));
}

function linksFor(ids: string[]) {
  const links: Array<{ label: string; href: string }> = [];
  const seen = new Set<string>();
  for (const id of ids) {
    const prefix = id.split(".")[0] ?? "";
    const link = TOOL_LINKS[prefix];
    if (!link || seen.has(link.href)) continue;
    seen.add(link.href);
    links.push(link);
  }
  return links.slice(0, 2);
}

function clipError(error: unknown) {
  const message = error instanceof Error ? error.message : "工具失败";
  return message.replaceAll(/sk-[a-z0-9_-]+/gi, "***").slice(0, 300);
}

function parseToolInput(raw: string) {
  if (!raw.trim()) return {};
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    throw new Error("工具参数不是 JSON");
  }
}

export async function runAgentTurn(input: {
  question: string;
  pageLabel: string;
  history: Array<{ role: "user" | "assistant"; content: string }>;
  signal: AbortSignal;
  userId: string;
  access: AccessContext;
  model: ResolvedAiModel;
}): Promise<{ text: string; blocks: AgentBlock[]; links: Array<{ label: string; href: string }> }> {
  const tools = toolsForAccess(input.access);
  const defs = toolDefs(tools);
  const allowed = new Set(tools.map((tool) => tool.id));
  const messages: ModelMessage[] = [
    { role: "system", content: systemPrompt(input.pageLabel, tools) },
    ...input.history.map((item) => ({ role: item.role, content: item.content })),
    { role: "user", content: input.question },
  ];
  const blocksByTool = new Map<string, AgentBlock[]>();
  const touched: string[] = [];

  const rememberBlocks = (toolId: string, next: AgentBlock[]) => {
    blocksByTool.delete(toolId);
    blocksByTool.set(toolId, next);
  };
  const collectedBlocks = () => [...blocksByTool.values()].flat();

  for (let step = 0; step < AGENT_LOOP_LIMIT; step += 1) {
    if (input.signal.aborted) throw new Error("已取消");
    let turn: Awaited<ReturnType<typeof runModelChatTurn>>;
    try {
      turn = await runModelChatTurn(input.model, messages, {
        tools: defs,
        signal: input.signal,
        timeoutMs: 50_000,
      });
    } catch (error) {
      if (step === 0 && defs.length > 0) {
        const text = await runModelChat(
          input.model,
          [
            {
              role: "system",
              content: `${systemPrompt(input.pageLabel, tools)}\n当前模型接口不能调用工具。不要编造表里的数字，说明需要换一个支持工具调用的模型才能查库、填数或导出。`,
            },
            { role: "user", content: input.question },
          ],
          { signal: input.signal, timeoutMs: 50_000 },
        );
        return { text, blocks: collectedBlocks(), links: linksFor(touched) };
      }
      throw error;
    }

    if (turn.toolCalls.length === 0) {
      return { text: turn.content, blocks: collectedBlocks(), links: linksFor(touched) };
    }

    const followUps: ModelMessage[] = [];
    let stoppedForConfirm = false;
    for (const call of turn.toolCalls) {
      const tool = agentToolByFunctionName(call.name);
      if (!tool || !allowed.has(tool.id)) {
        followUps.push({
          role: "tool",
          toolCallId: call.id,
          content: "没有权限使用该工具，或工具未登记。",
        });
        continue;
      }
      touched.push(tool.id);
      if (!hasPermission(input.access, tool.permission.resource, tool.permission.action)) {
        followUps.push({ role: "tool", toolCallId: call.id, content: "没有权限执行此操作" });
        continue;
      }
      let args: unknown;
      try {
        args = parseToolInput(call.arguments);
      } catch (error) {
        followUps.push({ role: "tool", toolCallId: call.id, content: clipError(error) });
        continue;
      }

      if (tool.mode === "write") {
        if (stoppedForConfirm) {
          followUps.push({ role: "tool", toolCallId: call.id, content: "一次只能确认一张写入，这一张已忽略。" });
          continue;
        }
        try {
          const card = await tool.describe(args);
          const intent = await signAgentIntent(input.userId, tool.id, args);
          rememberBlocks(tool.id, [{
            type: "confirm",
            intent,
            title: card.title,
            body: card.body,
            actionLabel: card.actionLabel,
          }]);
          stoppedForConfirm = true;
          followUps.push({
            role: "tool",
            toolCallId: call.id,
            content: "已生成确认单，尚未写入。请等用户确认。",
          });
        } catch (error) {
          followUps.push({ role: "tool", toolCallId: call.id, content: `工具失败：${clipError(error)}` });
        }
        continue;
      }

      try {
        const output = await tool.run(args, { userId: input.userId });
        if (output.blocks?.length) rememberBlocks(tool.id, output.blocks);
        followUps.push({ role: "tool", toolCallId: call.id, content: output.summary });
      } catch (error) {
        followUps.push({ role: "tool", toolCallId: call.id, content: `工具失败：${clipError(error)}` });
      }
    }

    if (stoppedForConfirm) {
      const confirm = collectedBlocks().find((block) => block.type === "confirm");
      const text = confirm
        ? `${confirm.title}\n${confirm.body}\n点「${confirm.actionLabel}」后才会出现在页面上，保存仍走页面自己的按钮。`
        : turn.content || "请确认后再写入。";
      return { text, blocks: collectedBlocks(), links: linksFor(touched) };
    }

    messages.push({ role: "assistant", content: turn.content, toolCalls: turn.toolCalls });
    messages.push(...followUps);
  }

  return {
    text: "步骤太多了。请把问题缩到一次查询，或一次写入。",
    blocks: collectedBlocks(),
    links: linksFor(touched),
  };
}
