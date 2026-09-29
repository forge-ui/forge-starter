import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { eq } from 'drizzle-orm';
import { getDb, closeDb } from '../../lib/db';
import { adminAccounts, semanticOperations } from '../../lib/db/schema';
import { createAdminAccount } from '../../lib/accounts/service';
import { registerOperation, commitOperation } from '../../lib/semantic/operations';
import { runAgentTurn } from '../../lib/agent/loop';
const enabled = process.env.DATABASE_URL?.includes('/forge_semantic_test_');
const rows:string[]=[], ops:string[]=[];
const access = {roleCode:'test',roleName:'test',permissionCodes:['accounts:read'],allowedModules:['accounts' as const],isSuperAdmin:false};
after(async()=>{if(!enabled)return;for(const id of rows)await getDb().delete(adminAccounts).where(eq(adminAccounts.id,id));for(const id of ops)await getDb().delete(semanticOperations).where(eq(semanticOperations.id,id));await closeDb()});
test('saved continuation reads final data even when model returns no tool calls',{skip:!enabled},async()=>{
 const id=crypto.randomUUID();ops.push(id);
 await commitOperation({id,userId:'test-owner',actionId:'accounts.create',payload:{name:'最终姓名'}},async tx=>{const a=await createAdminAccount({name:'最终姓名',username:`ct_${id.slice(0,8)}`,email:`${id}@example.test`,phone:'123',role:'运营',department:'客服',status:'pending',notes:''},tx);rows.push(a.id);return {entityId:a.id,revision:a.revision,result:{account:a}}});
 const {prepareContinuationReadback}=await import('../../lib/semantic/continuation');
 const readback=await prepareContinuationReadback(id,'test-owner',access);
 const original=globalThis.fetch;globalThis.fetch=async()=>new Response(JSON.stringify({choices:[{message:{content:'已保存新账号 abc。'}}]}));
 try{const r=await runAgentTurn({question:'已保存，请核对',pageLabel:'账号管理',history:[],signal:new AbortController().signal,userId:'test-owner',access,model:{id:'test',name:'test',provider:'model_openai_provider',modelName:'test',apiBase:'http://model.invalid/v1',apiKey:'synthetic'},readback} as Parameters<typeof runAgentTurn>[0]);assert.equal(r.text,'保存已核实，以下为最新记录。');assert.ok(r.blocks.some(b=>b.type==='table'&&b.rows.some(row=>row.name==='最终姓名')));}finally{globalThis.fetch=original}
 await assert.rejects(prepareContinuationReadback(id,'another-user',access));
 await assert.rejects(prepareContinuationReadback(id,'test-owner',{...access,permissionCodes:[]}),/权限/);
 const pending=crypto.randomUUID();ops.push(pending);await registerOperation(pending,'test-owner','accounts.create');await assert.rejects(prepareContinuationReadback(pending,'test-owner',access),/保存/);
});
