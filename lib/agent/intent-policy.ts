/** Shared dialogue policy. Current request wins over history; history is never authorization. */
export type IntentAction = "read" | "navigate" | "create" | "update" | "delete" | "export" | "cancel" | "continue" | "help" | "unknown";
const RESOURCE_LABELS: Record<string,string> = { accounts:"账号", models:"模型", roles:"角色", menus:"菜单", permissions:"权限", annotation:"标注任务", datasets:"数据集" };
export type DialogueMessage = { role: "user" | "assistant"; content: string };
const verbs = { create: /新建|创建|新增|添加|建一个|建一条|准备(?:一个|一条|个).*(?:账号|账户|任务|表单)|加(?:一个|一条|个)|开(?:一个|一条|个)?标注任务|\bcreate\b/i, update: /修改|更新|编辑|启用|停用|禁用|改成|改为|设置为|\bupdate\b|\bedit\b/i, delete: /删除|移除|清空|\bdelete\b/i, export: /导出|下载|\bexport\b/i };
export function classifyIntent(question: string): IntentAction {
  const q = question.trim();
  // Negated clauses cannot authorize an action. Keep the request after a correction.
  const positive = q.replace(/[「“"][^」”"]+[」”"]/g, "目标").replace(/(?:不要|不用|别|不想|不需要|取消|不是(?:要)?|并非)(?:再)?[^，,。；;！!]*[，,。；;！!]?/g, "").trim();
  if (/^(?:取消|算了|不用了|停止|结束|放弃|cancel)[。！!\s]*$/i.test(q) || (!positive && /不要|不用|别|取消/.test(q))) return "cancel";
  if (/怎么|如何|为什么|是什么意思|能否|能不能|可以.{0,8}吗|\bhow\b/i.test(positive)) return "help";
  if (/(?:查|看|打开).*(?:新建的|创建的|删除的|修改的|历史)/.test(positive)) return "read";
  if (Object.values(verbs).filter(r => r.test(positive)).length > 1 && /还是|或者|然后|接着|并|同时|再/.test(positive)) return "unknown";
  if (/^(?:请|帮我|我想|去|先|想)*(?:查看|看看|查询|查一下|看一下|列出|显示|统计)/.test(positive) && !/然后|接着|并且|同时/.test(positive)) return "read";
  for (const action of ["export", "delete", "update", "create"] as const) if (verbs[action].test(positive)) return action;
  if (/^(?:继续|确认|好的|可以|就这个|continue)[。！!\s]*$/i.test(positive)) return "continue";
  if (/多少|统计|分布|通过率|占比|查|看|历史|已有|最近|列表|详情|\blist\b|\bshow\b/i.test(positive)) return "read";
  if (/打开|跳转|前往|进入|^去|\bopen\b/i.test(positive)) return "navigate";
  return "unknown";
}
export function toolIntentAction(id: string): IntentAction {
  if (/export|download/.test(id)) return "export";
  if (/create|add/.test(id)) return "create";
  if (/delete|remove/.test(id)) return "delete";
  if (/update|edit/.test(id)) return "update";
  if (/navigate|\.open$|\.filter$|open_freeze/.test(id)) return "navigate";
  return "read";
}
export function allowsToolIntent(question: string, toolId: string) {
  const intent = classifyIntent(question);
  const action = toolIntentAction(toolId);
  if (intent === "cancel" || intent === "help" || intent === "continue") return action === "read";
  if (["create", "update", "delete", "export"].includes(action)) return intent === action;
  return true;
}
export type ChoiceBlock = { type: "choice"; title: string; options: Array<{ label: string; question: string }> };
export type Candidate = { id: string; name: string; description?: string; aliases?: string[]; href: string };
export type SelectionReply = { text: string; blocks: ChoiceBlock[]; links: Array<{ label: string; href: string }> };
export function clarifyAction(label: string, actions: Array<{label: string; question: string}>): SelectionReply {
  return { text: `你想对${label}做什么？请选择操作，或直接说明目标名称、ID 和要做的事。`, blocks: [{type:"choice",title:"确认操作",options:actions}], links:[] };
}
const numberValues: Record<string,number> = {一:1,二:2,两:2,三:3,四:4,五:5};
export function ordinalSelection(q: string): number | undefined {
  const hit = q.trim().match(/^(?:请|帮我|就|选|选择|打开|查看|看看|用|要|确认|第|\s)*(\d+|[一二两三四五])(?:个|条|项|号)?[。！!\s]*$/);
  return hit ? (numberValues[hit[1]] ?? Number(hit[1])) : undefined;
}
/** Only the latest assistant turn can carry a pending choice. IDs are reloaded by the adapter. */
export function previousSelection(history: DialogueMessage[] = []) {
  const last = [...history].reverse().find(m=>m.role === "assistant")?.content ?? "";
  const header = last.match(/^请选择目标【([^】]+)】\n原请求：([^\n]+)\n/);
  if (!header) return undefined;
  const ids = [...last.matchAll(/^([1-5])\. .*?\[ID:([^\]\n]+)\]/gm)].map(m=>m[2]);
  return { resource:Object.keys(RESOURCE_LABELS).find(k=>RESOURCE_LABELS[k]===header[1]) ?? header[1], request:header[2], ids };
}
export function selectionReply(resource: string, request: string, rows: Candidate[], total = rows.length): SelectionReply {
  const shown = rows.slice(0,5);
  return {
    text: `请选择目标【${RESOURCE_LABELS[resource] ?? resource}】\n原请求：${request.replace(/\s+/g," ").slice(0,180)}\n` + shown.map((r,i)=>`${i+1}. ${r.name.replace(/[\r\n\[\]]/g," ").slice(0,55)} [ID:${r.id}]${r.description ? ` · ${r.description.replace(/[\r\n\[\]]/g," ").slice(0,50)}` : ""}`).join("\n") + `\n${total>5?`共 ${total} 条，先显示 5 条。`:""}选择第几个，或提供指定名称、ID；也可以说“取消”。`,
    blocks: [{type:"choice",title:"选择目标",options:shown.map((r,i)=>({label:`${i+1}. ${r.name}（${r.id}）`,question:`选择第${i+1}个`}))}], links:[]
  };
}
export function selectedId(question: string) { return question.match(/(?:ID|编号)\s*[:：=]?\s*([a-zA-Z0-9_-]+)/i)?.[1]; }
export function selectCandidate(question: string, rows: Candidate[], previous?: ReturnType<typeof previousSelection>) {
  const n = ordinalSelection(question);
  if (n !== undefined) {
    if (!previous || n<1 || n>previous.ids.length) return {error:"该序号没有对应的候选。请重新选择，或提供名称、ID。"};
    const row = rows.find(r=>r.id===previous.ids[n-1]);
    return row ? {row} : {error:"这条候选已不存在或不可访问，请重新查询。"};
  }
  const id = selectedId(question);
  if (id) {const row = rows.find(r=>r.id===id);return row ? {row} : {error:"找不到这个 ID 对应的可访问记录，请核对后重试。"};}
  const named = question.match(/[「“"]([^」”"]+)[」”"]/)?.[1] ?? question.match(/(?:名为|叫做|名称为)\s*([^，。！？]+)/)?.[1];
  const matches = rows.filter(r=>[r.name,r.id,...(r.aliases??[])].some(v=>v && (named ? v.toLowerCase().includes(named.toLowerCase()) : question.toLowerCase().includes(v.toLowerCase()))));
  if (named && !matches.length) return {error:`没有匹配「${named}」的可访问记录，请提供准确名称或 ID。`};
  if (matches.length===1) return {row:matches[0]};
  return {matches:matches.length?matches:rows};
}

export function isChoiceBlock(value: unknown): value is ChoiceBlock {
  if (!value || typeof value !== "object") return false;
  const b = value as ChoiceBlock;
  return b.type === "choice" && typeof b.title === "string" && Array.isArray(b.options) && b.options.length <= 6 && b.options.every(o=>typeof o.label === "string" && typeof o.question === "string" && o.question.length <= 2000);
}
