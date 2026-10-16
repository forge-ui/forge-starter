import type { ChatInputBarQuickAction, ChatInputBarSendContext, ComposerSource } from "@forge-ui-official/core";

type ComposerAction = ChatInputBarQuickAction & { instruction: string };

/** Resolve only caller-owned action IDs; card selection never mutates the draft or grants access. */
export function composeActionMessage(message: string, action: ChatInputBarQuickAction | undefined, actions: readonly ComposerAction[]) {
  const text = message.trim();
  if (!text) return "";
  const selected = actions.find(item => item.id === action?.id);
  if (!selected) return text;
  // A failed send can restore the submitted text. Retrying must not stack the same instruction.
  return text.startsWith(`${selected.instruction}\n`) ? text : `${selected.instruction}\n${text}`;
}

export const ASK_AI_QUICK_ACTIONS: ComposerAction[] = [
  {
    "id": "query",
    "label": "查询信息",
    "kind": "docs",
    "placeholder": "输入资源名称、状态或查询条件",
    "instruction": "请查询以下信息，只使用当前有权访问的资源："
  },
  {
    "id": "guide",
    "label": "使用指导",
    "kind": "note",
    "placeholder": "描述你想了解的功能或流程",
    "instruction": "请说明以下功能或流程的使用方法："
  },
  {
    "id": "plan",
    "label": "整理步骤",
    "kind": "event",
    "placeholder": "描述目标和限制条件",
    "instruction": "请整理以下目标的处理步骤，涉及写入或删除时先提出确认，不直接执行："
  }
];

/** A context preference never expands the server's available tools or bypasses confirmation. */
export function composeToolContext(message: string, context: ChatInputBarSendContext | undefined, available: readonly ComposerSource[]) {
  if (!message.trim()) return "";
  const ids = new Set(context?.sources.map(source => source.id) ?? []);
  const labels = available.filter(source => ids.has(source.id)).map(source => source.label);
  if (!labels.length) return message.trim();
  const prefix = `请优先考虑已授权工具：${[...new Set(labels)].join("；")}。\n`;
  return message.trim().startsWith(prefix) ? message.trim() : prefix + message.trim();
}
