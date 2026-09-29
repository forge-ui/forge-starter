import { test } from "node:test";
import assert from "node:assert/strict";
import { runAgentTurn } from "../../lib/agent/loop";
import { accountCreateSchema } from "../../lib/accounts/input";
import { agentFormBlockSchema } from "../../lib/agent/forms";
const access: import("../../lib/rbac/access").AccessContext = {roleCode:"test",roleName:"测试",isSuperAdmin:false,allowedModules:["accounts"],permissionCodes:["accounts:read","accounts:create"]};
test("partial create request produces a structured draft without fabricated required values", async () => {
 const saved=globalThis.fetch;
 globalThis.fetch=async()=>new Response(JSON.stringify({choices:[{message:{content:"",tool_calls:[{id:"form",function:{name:"accounts_create",arguments:'{"username":"abc"}'}}]}}]}));
 try{
  const result=await runAgentTurn({question:"新增一个abc账号",history:[],pageLabel:"账号",signal:AbortSignal.timeout(3000),userId:"test",access,model:{id:"test",name:"test",provider:"openai",modelName:"test",apiBase:"http://model.invalid/v1",apiKey:"fake"}});
  const block=result.blocks.find(b=>b.type==="form");assert.ok(block?.type==="form");
  assert.equal(block.values.username,"abc");assert.equal(block.values.email,undefined);
  assert.ok(agentFormBlockSchema.safeParse(JSON.parse(JSON.stringify(block))).success);
  assert.ok(!accountCreateSchema.safeParse(block.values).success);
  assert.equal(result.blocks.some(b=>b.type==="confirm"),false);
 }finally{globalThis.fetch=saved;}
});
test("unregistered forms and extra fields fail schema validation",()=> {
 assert.equal(agentFormBlockSchema.safeParse({type:"form",formId:"arbitrary.write",values:{}}).success,false);
 assert.equal(agentFormBlockSchema.safeParse({type:"form",formId:"accounts.create",values:{apiKey:"bad"}}).success,false);
});
test("a textual form claim gets one repair instead of an empty success message", async()=>{
 const saved=globalThis.fetch;let calls=0;
 globalThis.fetch=async()=>new Response(JSON.stringify({choices:[{message:++calls===1?{content:"已准备好新建账号表单"}:{content:"",tool_calls:[{id:"form",function:{name:"accounts_create",arguments:'{"username":"xyz"}'}}]}}]}));
 try{const result=await runAgentTurn({question:"再准备一个xyz账号的表单",history:[],pageLabel:"账号",signal:AbortSignal.timeout(3000),userId:"test",access,model:{id:"test",name:"test",provider:"openai",modelName:"test",apiBase:"http://model.invalid/v1",apiKey:"fake"}});assert.equal(calls,2);assert.ok(result.blocks.some(b=>b.type==="form"&&b.values.username==="xyz"));}finally{globalThis.fetch=saved;}
});
