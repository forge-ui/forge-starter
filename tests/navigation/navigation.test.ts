import {test} from 'node:test';
import assert from 'node:assert/strict';
import {runAgentTurn} from '../../lib/agent/loop';
import {toolsForAccess} from '../../lib/agent/registry';
import type {AccessContext} from '../../lib/rbac/access';
const access:AccessContext={roleCode:'test',roleName:'Test',isSuperAdmin:false,allowedModules:['accounts','models'],permissionCodes:['accounts:read','models:read']};
const input={question:'请帮我打开账号管理页面',pageLabel:'模型服务 /models/',history:[],signal:new AbortController().signal,userId:'test',access,model:{id:'test',name:'Test',provider:'model_openai_provider',modelName:'test',apiBase:'http://model.invalid/v1',apiKey:'synthetic'}};
test('registered navigation respects read permission',()=>{assert.ok(toolsForAccess(access).some(t=>t.id==='accounts.navigate'));assert.ok(!toolsForAccess({...access,permissionCodes:['models:read']}).some(t=>t.id==='accounts.navigate'));});
test('model navigation yields executable command, never a fabricated completion',async()=>{const saved=globalThis.fetch;globalThis.fetch=async()=>new Response(JSON.stringify({choices:[{message:{content:'已跳转至账号管理页面',tool_calls:[{id:'nav',type:'function',function:{name:'accounts_navigate',arguments:'{}'}}]}}]}));try{const r=await runAgentTurn(input);assert.deepEqual((r as any).navigation,{href:'/accounts/',label:'账号管理'});assert.doesNotMatch(r.text,/已跳转/);}finally{globalThis.fetch=saved;}});
test('text-only false completion cannot be shown as success',async()=>{const saved=globalThis.fetch;globalThis.fetch=async()=>new Response(JSON.stringify({choices:[{message:{content:'已跳转至账号管理页面。'}}]}));try{const r=await runAgentTurn(input);assert.doesNotMatch(r.text,/已跳转/);assert.equal((r as any).navigation,undefined);}finally{globalThis.fetch=saved;}});

test('navigation rejects external URLs and arbitrary internal paths',async()=>{const {parseAgentNavigation}=await import('../../lib/agent/navigation');for(const href of ['https://evil.test','//evil.test','/api/accounts/','/accounts/?delete=1','javascript:alert(1)'])assert.equal(parseAgentNavigation({href}),undefined);});
test('API JSON round trip preserves executable navigation',async()=>{const {sendAskAi}=await import('../../lib/ask-ai');const saved=globalThis.fetch;globalThis.fetch=async()=>new Response(JSON.stringify({ok:true,text:'正在打开账号管理',live:true,navigation:{href:'/accounts/',label:'伪造标签'}}));try{const r=await sendAskAi('去账号管理',{messages:[],signal:new AbortController().signal});assert.deepEqual(r.navigation,{href:'/accounts/',label:'账号管理'});}finally{globalThis.fetch=saved;}});
test('registered account detail navigation survives HTTP client parsing with a canonical label', async () => {
 const {sendAskAi}=await import('../../lib/ask-ai');
 const {parseAgentNavigation}=await import('../../lib/agent/navigation');
 const href='/accounts/10000000-0000-4000-8000-000000000001/';
 const saved=globalThis.fetch;
 globalThis.fetch=async()=>Response.json({ok:true,text:'等待客户端确认',live:true,navigation:{href,label:'模型生成标签'}});
 try {
  assert.deepEqual((await sendAskAi('打开详情',{messages:[],signal:new AbortController().signal})).navigation,{href,label:'账号详情'});
  for(const invalid of ['/accounts/not-a-uuid/','/accounts/../models/','/accounts/10000000-0000-4000-8000-000000000001/?delete=1']) assert.equal(parseAgentNavigation({href:invalid}),undefined);
 } finally {globalThis.fetch=saved;}
});
test('client waits for actual committed route before reporting success',async()=>{const {executeAgentNavigation}=await import('../../lib/agent/navigation');let path='/models/';let completed=false;const pending=executeAgentNavigation({href:'/accounts/',label:'账号管理'},{push:()=>{},getPath:()=>path,signal:new AbortController().signal,timeoutMs:1500}).then(t=>{completed=true;return t});await new Promise(r=>setTimeout(r,80));assert.equal(completed,false);path='/accounts/';assert.equal(await pending,'已打开账号管理页面。');});
test('client reports blocked or failed navigation instead of success',async()=>{const {executeAgentNavigation}=await import('../../lib/agent/navigation');await assert.rejects(executeAgentNavigation({href:'/accounts/',label:'账号管理'},{push:()=>{},getPath:()=>'/models/',signal:new AbortController().signal,timeoutMs:80}),/未能打开/);});
test('client cancellation does not initiate navigation',async()=>{const {executeAgentNavigation}=await import('../../lib/agent/navigation');let pushed=false;await assert.rejects(executeAgentNavigation({href:'/accounts/',label:'账号管理'},{push:()=>{pushed=true},getPath:()=>'/models/',signal:AbortSignal.abort()}),/取消/);assert.equal(pushed,false);});

test('textual tool name is repaired into a real permitted tool call', async () => {
 const saved = globalThis.fetch; let calls = 0;
 globalThis.fetch = async (_url, init) => {
  calls++;
  const body = JSON.parse(String(init?.body));
  if(calls === 2) assert.equal(body.tool_choice, 'required');
  return new Response(JSON.stringify({choices:[{message: calls === 1 ? {content:'(accounts_navigate)'} : {content:'',tool_calls:[{id:'nav',type:'function',function:{name:'accounts_navigate',arguments:'{}'}}]}}]}));
 };
 try { const result = await runAgentTurn({...input, question:'去新增账号'}); assert.equal(result.navigation?.href, '/accounts/'); assert.equal(calls,2); assert.doesNotMatch(result.text,/accounts_navigate/); } finally {globalThis.fetch=saved;}
});
test('repeated textual tools stop safely without exposing internal names', async () => {
 const saved=globalThis.fetch;let calls=0;
 globalThis.fetch=async()=>{calls++;return new Response(JSON.stringify({choices:[{message:{content:'(accounts_navigate)'}}]}));};
 try{const result=await runAgentTurn({...input,question:'去新增账号'});assert.equal(calls,2);assert.equal(result.navigation,undefined);assert.doesNotMatch(result.text,/accounts_navigate/);assert.match(result.text,/未执行/);}finally{globalThis.fetch=saved;}
});
test('textual forbidden tool cannot trigger repair or navigation', async () => {
 const saved=globalThis.fetch;let calls=0;
 globalThis.fetch=async()=>{calls++;return new Response(JSON.stringify({choices:[{message:{content:'(accounts_navigate)'}}]}));};
 try{const result=await runAgentTurn({...input,access:{...access,permissionCodes:['models:read']}});assert.equal(calls,1);assert.equal(result.navigation,undefined);assert.match(result.text,/未执行/);}finally{globalThis.fetch=saved;}
});
test('provider rejection during repair returns an explicit non-execution result', async () => {
 const saved=globalThis.fetch;let calls=0;
 globalThis.fetch=async()=>{calls++;return calls===1?new Response(JSON.stringify({choices:[{message:{content:'(accounts_navigate)'}}]})):new Response('unsupported tool choice',{status:400});};
 try{const result=await runAgentTurn(input);assert.equal(calls,2);assert.equal(result.navigation,undefined);assert.match(result.text,/未执行/);}finally{globalThis.fetch=saved;}
});
