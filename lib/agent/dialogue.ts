import { classifyIntent, clarifyAction, ordinalSelection, previousSelection, selectCandidate, selectionReply, type Candidate, type DialogueMessage, type SelectionReply } from "./intent-policy";
import { toolsForAccess } from "./registry";
import type { AccessContext } from "@/lib/rbac/access";
import type { PageContext } from "@/lib/semantic/context";
const reply=(text:string,links:SelectionReply["links"]=[]):SelectionReply=>({text,blocks:[],links});
const resources=[{id:"accounts",label:"账号",pattern:/账号|账户|用户/},{id:"models",label:"模型",pattern:/模型/},{id:"roles",label:"角色",pattern:/角色/},{id:"menus",label:"菜单",pattern:/菜单/},{id:"permissions",label:"权限",pattern:/权限/}];
export async function routeDialogue(input:{question:string;history?:DialogueMessage[];access:AccessContext;userId:string;page?:PageContext}):Promise<{reply?:SelectionReply;question?:string}> {
  const q=input.question.trim(),action=classifyIntent(q),previous=previousSelection(input.history),n=ordinalSelection(q);
  if(action==="cancel")return {reply:reply("已取消当前操作。请告诉我接下来要查询、打开或处理什么。")};
  if(action==="continue")return {reply:reply("请明确要继续的操作和目标；待确认表单请使用对应确认按钮。")};
  if(action==="help")return {};
  let resource=resources.find(r=>r.pattern.test(q));
  if(n!==undefined||(!resource&&previous&&["unknown","read","navigate"].includes(action)))resource=resources.find(r=>r.id===previous?.resource);
  if(n!==undefined&&!previous)return {reply:reply("当前没有待选择的候选，请先说明操作和目标。")};
  const tools=toolsForAccess(input.access);
  if(!resource) {
    if(action!=="navigate")return {reply:clarifyAction("这个请求",resources.filter(r=>tools.some(t=>t.id===`${r.id}.list`)).map(r=>({label:`查看${r.label}`,question:`查看已有${r.label}`})))};
    return {};
  }
  const list=tools.find(t=>t.id===`${resource.id}.list`&&t.mode==="read");
  if(!list||list.mode!=="read")return {reply:reply(`没有${resource.label}的读取权限。`)};
  const effective=previous&&resource.id===previous.resource&&(n!==undefined||action==="unknown")?previous.request:q;
  const requested=classifyIntent(effective);
  if(["create","update","delete","export"].includes(requested)&&!tools.some(t=>t.id===`${resource.id}.${requested}`))return {reply:reply(`当前没有可用的${resource.label}${({create:"新建",update:"修改",delete:"删除",export:"导出"} as Record<string,string>)[requested]}工具。`,[{label:`打开${resource.label}页面`,href:`/${resource.id}/`}])};
  if(requested==="create"||requested==="export")return {};
  if(action==="unknown"&&!previous)return {reply:clarifyAction(resource.label,[{label:"查看已有记录",question:`查看已有${resource.label}`},...(tools.some(t=>t.id===`${resource!.id}.create`)?[{label:"新建记录",question:`新建${resource.label}`}]:[])])};
  if(/多少|统计|分布|占比/.test(q)&&action==="read")return {};
  if(/筛选|过滤/.test(q))return {};
  if(input.page?.entityId&&/这条|这个|当前/.test(q))return {};
  if(/页面|管理|工作台|中心|列表页/.test(q)&&action==="navigate")return {};
  let rows:Candidate[]=[];
  if(resource.id === "accounts") rows=(await (await import("@/lib/accounts/service")).listAdminAccounts()).map(r=>({id:r.id,name:r.name,aliases:[r.username],description:`${r.username} · ${r.status}`,href:`/accounts/${encodeURIComponent(r.id)}/`}));
  if(resource.id === "models") rows=(await (await import("@/lib/models/service")).listAiModels()).map(r=>({id:r.id,name:r.name,aliases:[r.modelName],description:`${r.providerLabel} · ${r.status}`,href:`/models/?id=${encodeURIComponent(r.id)}`}));
  if(resource.id === "roles") rows=(await (await import("@/lib/roles/service")).listRoles()).map(r=>({id:r.id,name:r.name,aliases:[r.code],description:r.status,href:`/roles/?id=${encodeURIComponent(r.id)}`}));
  if(resource.id === "menus") rows=(await (await import("@/lib/menus/service")).listMenus()).map(r=>({id:r.id,name:r.name,aliases:[r.code],description:r.path,href:`/menus/?id=${encodeURIComponent(r.id)}`}));
  if(resource.id === "permissions") rows=(await (await import("@/lib/permissions/service")).listPermissions()).map(r=>({id:r.id,name:r.name||r.code,aliases:[r.code],description:r.resource,href:`/permissions/?id=${encodeURIComponent(r.id)}`}));
  if(!rows.length)return {reply:reply(`当前没有匹配的${resource.label}。`)};
  const selected=selectCandidate(q,rows,previous);
  if(selected.error)return {reply:reply(selected.error)};
  if(selected.row){
    if(["update","delete"].includes(requested))return {question:`${effective}。明确目标 ID：${selected.row.id}，名称：${selected.row.name}`};
    return {reply:reply(`已选中「${selected.row.name}」（${selected.row.id}）。点击下方打开详情。`,[{label:`查看 ${selected.row.name}`,href:selected.row.href}])};
  }
  return {reply:selectionReply(resource.id,effective,selected.matches??rows)};
}
