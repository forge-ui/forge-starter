import { test, after } from "node:test";
import assert from "node:assert/strict";
import { eq } from "drizzle-orm";
import { getDb, closeDb } from "../../lib/db";
import { rbacRoles, rbacMenus, rbacPermissions, aiModels, semanticOperations } from "../../lib/db/schema";
import { createRole, getRoleById, updateRole, deleteRole } from "../../lib/roles/service";
import { createMenu, getMenuById, updateMenu, deleteMenu } from "../../lib/menus/service";
import { createPermission, getPermissionById, updatePermission, deletePermission } from "../../lib/permissions/service";
import { createAiModel, getAiModelById, updateAiModel, deleteAiModel, probeAiModel } from "../../lib/models/service";
import { resourceWrite } from "../../lib/semantic/resource-write";
import { prepareContinuationReadback } from "../../lib/semantic/continuation";
import { acknowledgeOperation, registerOperation, readOperation } from "../../lib/semantic/operations";
import { resourceDraftSchemas, decodeResourceFields, encodeResourceFields, resourceFormDraft } from "../../lib/agent/resource-fields";
import { resourceAgentTools } from "../../lib/agent/resource-tools";
import { toolsForAccess } from "../../lib/agent/registry";
import type { AccessContext } from "../../lib/rbac/access";
const enabled = (() => { try { const u = new URL(process.env.DATABASE_URL ?? ""); return u.hostname === "127.0.0.1" && u.pathname.startsWith("/forge_semantic_test_"); } catch { return false; } })();
const access: AccessContext = { isSuperAdmin: true, allowedModules: ["accounts", "roles", "menus", "permissions", "models", "settings", "dashboard"], roleCode: "test", roleName: "测试", permissionCodes: [] };
const cleanup: Array<() => Promise<unknown>> = [];
after(async () => { if (!enabled) return; for (const run of cleanup.reverse()) await run(); await closeDb(); });
const spec = {
 roles: { table: rbacRoles, create: createRole, get: getRoleById, update: updateRole, remove: deleteRole, data: () => ({ name: "助手隔离测试", code: `test_${crypto.randomUUID().slice(0,8)}`, description: "测试", status: "disabled" as const, permissionIds: [] }) },
 menus: { table: rbacMenus, create: createMenu, get: getMenuById, update: updateMenu, remove: deleteMenu, data: () => ({ name: "助手隔离菜单", code: `test_${crypto.randomUUID().slice(0,8)}`, description: "测试", status: "disabled" as const, path: "/test/", parentId: null, sort: 0 }) },
 permissions: { table: rbacPermissions, create: createPermission, get: getPermissionById, update: updatePermission, remove: deletePermission, data: () => ({ name: "助手隔离权限", code: `test_${crypto.randomUUID().slice(0,8)}`, description: "测试", resource: "accounts" as const, action: "read" as const }) },
 models: { table: aiModels, create: createAiModel, get: getAiModelById, update: updateAiModel, remove: deleteAiModel, data: () => ({ name: `助手隔离模型_${crypto.randomUUID().slice(0,8)}`, provider: "ollama", modelName: "test-only", status: "disabled" as const, isDefault: false, apiBase: "http://127.0.0.1:11434/v1", apiKey: "", notes: "不会调用网络" }) },
};
function request(id: string, updatedAt?: string) { return new Request("http://localhost/test", { method: "POST", headers: { "idempotency-key": id, ...(updatedAt ? { "x-expected-updated-at": updatedAt } : {}) } }); }
function operation() { const id = crypto.randomUUID(); cleanup.push(() => getDb().delete(semanticOperations).where(eq(semanticOperations.id, id))); return id; }
for (const [resource, raw] of Object.entries(spec)) test(`${resource}: atomic save receipt, retry, readback, stale edit and delete`, { skip: !enabled }, async () => {
 process.env.SEMANTIC_ENABLED = "true";
 // Adapter erases only the fixture's input union; production tools retain per-resource schemas.
 const fixture = raw as unknown as { table: typeof rbacRoles; create: (v: Record<string, unknown>) => Promise<{id:string;name:string;updatedAt:string}>; get: (id:string)=>Promise<{id:string;name:string;updatedAt:string}|null>; update: (id:string,v:Record<string,unknown>)=>Promise<{id:string;name:string;updatedAt:string}>; remove:(id:string)=>Promise<unknown>; data:()=>Record<string,unknown> };
 const data = fixture.data(), op = operation(); let calls = 0;
 const run = () => resourceWrite(request(op), "resource-test", resource as keyof typeof spec, "create", undefined, data, async () => { calls++; return { record: await fixture.create(data) }; });
 const saved = await run(); const row = saved.record as {id:string;updatedAt:string};
 cleanup.push(() => getDb().delete(fixture.table).where(eq(fixture.table.id,row.id)));
 const duplicate = await run(); assert.deepEqual(duplicate,saved); assert.equal(calls,1);
 assert.match((await prepareContinuationReadback(op,"resource-test",access)).summary,/助手隔离/);
 const changed = await resourceWrite(request(operation(),row.updatedAt),"resource-test",resource as keyof typeof spec,"update",row.id,{...data,name:"已修改"},async()=>({record:await fixture.update(row.id,{...data,name:"已修改"})}));
 await assert.rejects(resourceWrite(request(operation(),row.updatedAt),"resource-test",resource as keyof typeof spec,"update",row.id,data,async()=>({record:await fixture.update(row.id,data)})),/记录已变化/);
 const current = changed.record as {updatedAt:string};
 await resourceWrite(request(operation(),current.updatedAt),"resource-test",resource as keyof typeof spec,"delete",row.id,{},async()=>{await fixture.remove(row.id);return {deleted:true};});
 assert.equal(await fixture.get(row.id),null);
});
test("role and grant insert roll back together with receipt", { skip: !enabled }, async () => {
 process.env.SEMANTIC_ENABLED="true"; const data=spec.roles.data(), id=operation();
 await assert.rejects(resourceWrite(request(id),"resource-test","roles","create",undefined,data,async()=>{await createRole(data);throw new Error("forced rollback");}),/forced rollback/);
 assert.equal((await getDb().select().from(rbacRoles).where(eq(rbacRoles.code,data.code))).length,0);
 await assert.rejects(readOperation(id,"resource-test"));
});
test("cancelled confirmed resource operation cannot save", {skip:!enabled}, async()=>{
 process.env.SEMANTIC_ENABLED="true";const id=operation();await registerOperation(id,"resource-test","roles.create");await acknowledgeOperation(id,"resource-test","cancelled");
 const req=new Request("http://localhost/test",{method:"POST",headers:{"x-operation-id":id}});
 await assert.rejects(resourceWrite(req,"resource-test","roles","create",undefined,{},async()=>{throw new Error("must not execute");}),/取消/);
});
test("public drafts reject secrets and unknown fields and preserve multi-value grants through JSON",()=>{
 assert.equal(resourceDraftSchemas.models.safeParse({apiKey:"secret"}).success,false);
 assert.throws(()=>resourceFormDraft("models",encodeResourceFields({provider:"nonexistent-provider"}),{}),/供应商不存在/);
 assert.equal(resourceDraftSchemas.roles.safeParse({isSuperAdmin:true}).success,false);
 const fields={name:"测试",permissionIds:[crypto.randomUUID()]};assert.deepEqual(decodeResourceFields("roles",JSON.parse(JSON.stringify(encodeResourceFields(fields)))),fields);
 for(const resource of Object.keys(resourceDraftSchemas)) for(const action of ["create","update","delete"]){
  const readOnly:AccessContext={...access,isSuperAdmin:false,permissionCodes:[`${resource}:read`]};assert(!toolsForAccess(readOnly).some(t=>t.id===`${resource}.${action}`));
 }
 assert.equal(new Set(resourceAgentTools.map(t=>t.id)).size,resourceAgentTools.length);
});

test("model probe preserves configuration version and provider drafts use matching defaults", {skip:!enabled}, async()=>{
 const draft=resourceFormDraft("models",encodeResourceFields({provider:"ollama"}),{provider:"",modelName:"",apiBase:""});
 assert.match(draft.apiBase,/11434/);assert(draft.provider);assert(draft.modelName);
 const row=await createAiModel(spec.models.data());cleanup.push(()=>getDb().delete(aiModels).where(eq(aiModels.id,row.id)));
 const originalFetch=globalThis.fetch;
 try {
  globalThis.fetch=async()=>new Response(JSON.stringify({choices:[{message:{content:"OK"}}]}),{headers:{"content-type":"application/json"}});
  const tested=await probeAiModel(row.id);assert.equal(tested.updatedAt,row.updatedAt);assert.equal(tested.lastProbeOk,true);assert(tested.lastProbeAt);
 } finally {globalThis.fetch=originalFetch;}
});
