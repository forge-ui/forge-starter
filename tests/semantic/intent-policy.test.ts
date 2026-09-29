import assert from "node:assert/strict";
import test from "node:test";
import { classifyIntent, allowsToolIntent, previousSelection, selectionReply, selectCandidate } from "@/lib/agent/intent-policy";
for (const [q, expected] of [
 ["去看看历史标注任务","read"],["查看刚创建的账号","read"],["打开账号管理页面","navigate"],
 ["新建标注任务","create"],["新增账号 abc","create"],["修改账号电话","update"],["停用账号","update"],
 ["删除账号","delete"],["导出账号","export"],["取消","cancel"],["继续","continue"],
 ["不要创建了，查看历史任务","read"],["怎么删除账号","help"],["模型","unknown"],["不是新建，我是查看历史任务","read"],["修改账号“导出测试”","update"],["创建还是删除账号","unknown"]
] as const) test(`intent: ${q}`,()=>assert.equal(classifyIntent(q),expected));
test("read/help/cancel/continue cannot execute write tools despite model output",()=>{
 for(const q of ["去看看历史标注任务","看看账号","怎么创建账号","取消","继续"])
 for(const tool of ["annotation.create_label_task","accounts.create","accounts.update","accounts.delete","accounts.export","create.navigate"])
 assert.equal(allowsToolIntent(q,tool),false,`${q} -> ${tool}`);
 assert.equal(allowsToolIntent("修改账号","accounts.create"),false);
 assert.equal(allowsToolIntent("新增账号","accounts.create"),true);
});
const rows=[{id:"a",name:"同名",href:"/a/"},{id:"b",name:"同名",href:"/b/"}];
test("duplicates need selection, ordinal follows shown order despite source reorder",()=>{
 const prompt=selectionReply("accounts","查看已有账号",rows);
 const prev=previousSelection([{role:"assistant",content:prompt.text}]);
 assert.equal(selectCandidate("第二个",[...rows].reverse(),prev).row?.id,"b");
 assert.equal(selectCandidate("同名",rows).matches?.length,2);
 assert.ok(selectCandidate("第9个",rows,prev).error);
 assert.ok(selectCandidate("第一个",[],prev).error);
 assert.ok(selectCandidate("ID:missing",rows).error);
});
test("new response and cancellation invalidate old ordinal selection",()=>{
 const old=selectionReply("accounts","查看账号",rows);
 assert.equal(previousSelection([{role:"assistant",content:old.text},{role:"user",content:"取消"},{role:"assistant",content:"已取消当前操作。"}]),undefined);
});
