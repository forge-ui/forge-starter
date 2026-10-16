import { test, after } from "node:test";
import assert from "node:assert/strict";
import { eq } from "drizzle-orm";
import { getDb, closeDb } from "../../lib/db";
import { semanticOperations, rbacRoles, rbacMenus, rbacPermissions, aiModels } from "../../lib/db/schema";
import { signAgentIntent } from "../../lib/agent/intent";
const base=process.env.SEMANTIC_HTTP_ORIGIN;
const enabled=Boolean(base && /^http:\/\/127\.0\.0\.1:3167$/.test(base) && process.env.DATABASE_URL?.includes("/forge_semantic_test_"));
const cleanup:Array<()=>Promise<unknown>>=[];
after(async()=>{if(!enabled)return;for(const run of cleanup.reverse())await run();await closeDb();});
async function login(){const r=await fetch(`${base}/api/auth/login/`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({login:"semantic_http",password:"test-only"})});assert.equal(r.status,200);return r.headers.get("set-cookie")!.split(";")[0];}
async function req(path:string,cookie:string,method="GET",body?:unknown,headers:Record<string,string>={}){const r=await fetch(`${base}${path}`,{method,headers:{Cookie:cookie,"Content-Type":"application/json",...headers},body:body===undefined?undefined:JSON.stringify(body)});return {status:r.status,data:await r.json()};}
const cases=[
 {resource:"roles",key:"role",table:rbacRoles,fields:{name:"HTTP角色",code:"http_role",permissionIds:[]},data:{name:"HTTP角色",code:"http_role",description:"",status:"disabled",permissionIds:[]}},
 {resource:"menus",key:"menu",table:rbacMenus,fields:{name:"HTTP菜单",code:"http_menu",path:"/http-test/"},data:{name:"HTTP菜单",code:"http_menu",path:"/http-test/",parentId:null,sort:0,status:"disabled",description:""}},
 {resource:"permissions",key:"permission",table:rbacPermissions,fields:{name:"HTTP权限",code:"http_permission",resource:"accounts",action:"read"},data:{name:"HTTP权限",code:"http_permission",resource:"accounts",action:"read",description:""}},
 {resource:"models",key:"model",table:aiModels,fields:{name:"HTTP模型",provider:"ollama",modelName:"test-only"},data:{name:"HTTP模型",provider:"ollama",modelName:"test-only",apiBase:"http://127.0.0.1:9/v1",apiKey:"",status:"disabled",isDefault:false,notes:""}},
];
for(const fixture of cases)test(`HTTP ${fixture.resource}: signed draft, edited page save, retry and durable readback`,{skip:!enabled},async()=>{
 const cookie=await login();const suffix=crypto.randomUUID().slice(0,8);const data={...fixture.data,name:`${fixture.data.name}_${suffix}`,code:`${fixture.resource}_${suffix}`};const fields={...fixture.fields,name:data.name,...(fixture.resource==="models"?{}:{code:data.code})};
 const intent=await signAgentIntent("demo-user",`${fixture.resource}.create`,{fields});
 const confirmed=await req("/api/ask-ai/confirm/",cookie,"POST",{intent});assert.equal(confirmed.status,200,JSON.stringify(confirmed.data));
 const op=confirmed.data.fill.operationId;assert(op);cleanup.push(()=>getDb().delete(semanticOperations).where(eq(semanticOperations.id,op)));
 const final={...data,name:`${data.name}_页面改值`};const saved=await req(`/api/${fixture.resource}/`,cookie,"POST",final,{"x-operation-id":op});assert.equal(saved.status,201,JSON.stringify(saved.data));
 const row=saved.data[fixture.key];assert.equal(row.name,final.name);assert.equal(saved.data.receipt.status,"verified");cleanup.push(()=>getDb().delete(fixture.table).where(eq(fixture.table.id,row.id)));
 const replay=await req(`/api/${fixture.resource}/`,cookie,"POST",final,{"x-operation-id":op});assert.equal(replay.data[fixture.key].id,row.id);
 assert.equal((await req(`/api/${fixture.resource}/`,cookie,"POST",data,{"x-operation-id":op})).status,409);
 const operation=await req(`/api/ask-ai/operations/${op}/`,cookie);assert.equal(operation.data.operation.state,"verified");
 const editIntent=await signAgentIntent("demo-user",`${fixture.resource}.update`,{id:row.id,fields:{name:"编辑预填"}},{updatedAt:row.updatedAt});
 const edit=await req("/api/ask-ai/confirm/",cookie,"POST",{intent:editIntent});assert.equal(edit.status,200,JSON.stringify(edit.data));assert.equal(JSON.parse(edit.data.fill.fields.name),"编辑预填");
 cleanup.push(()=>getDb().delete(semanticOperations).where(eq(semanticOperations.id,edit.data.fill.operationId)));
 const stale=await req(`/api/${fixture.resource}/${row.id}/`,cookie,"PATCH",final,{"idempotency-key":crypto.randomUUID(),"x-expected-updated-at":"2000-01-01T00:00:00.000Z"});assert.equal(stale.status,409);
});
test("HTTP browser app result is scoped, replayable and explicitly unverified locally reported data",{skip:!enabled},async()=>{
 const cookie=await login();const intent=await signAgentIntent("demo-user","settings.create",{fields:{name:"本地测试",kind:"link",href:"https://example.com"}});
 const confirmed=await req("/api/ask-ai/confirm/",cookie,"POST",{intent});assert.equal(confirmed.status,200,JSON.stringify(confirmed.data));const op=confirmed.data.fill.operationId;cleanup.push(()=>getDb().delete(semanticOperations).where(eq(semanticOperations.id,op)));
 const body={operationId:op,entityId:"test-local-app",record:{id:"test-local-app",name:"本地测试",kind:"link",href:"https://example.com"}};
 const saved=await req("/api/ask-ai/local-result/",cookie,"POST",body);assert.equal(saved.status,200,JSON.stringify(saved.data));assert.equal(saved.data.receipt.result.storage,"browser-local");assert.equal(saved.data.receipt.result.browserReported,true);assert.equal(saved.data.receipt.status,"committed");
 const replay=await req("/api/ask-ai/local-result/",cookie,"POST",body);assert.deepEqual(replay.data.receipt,saved.data.receipt);
 const wrong=await req("/api/ask-ai/local-result/",cookie,"POST",{...body,record:{...body.record,apiKey:"must-reject"}});assert.equal(wrong.status,400);
});
