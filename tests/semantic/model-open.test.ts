import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { pageTools } from '../../lib/semantic/page-tools';
import {closeDb} from '../../lib/db';
const enabled=process.env.DATABASE_URL?.includes('/forge_semantic_test_');
after(closeDb);
test('model detail command rejects invented identifiers before producing a confirmation',{skip:!enabled},async()=>{const tool=pageTools.find(t=>t.id==='models.open');assert.ok(tool?.mode==='write');await assert.rejects(tool.describe({id:'00000000-0000-4000-8000-000000000000'}),/模型不存在/);await assert.rejects(tool.fill({id:'00000000-0000-4000-8000-000000000000'}),/模型不存在/);});

test('unknown provider is corrected rather than silently returning an empty list', async () => {
  const { modelAgentTools } = await import('../../lib/models/agent');
  const tool = modelAgentTools.find(t => t.id === 'models.list');
  assert.ok(tool?.mode === 'read');
  await assert.rejects(tool.run({ provider: 'invented-provider' }, {userId:'test'}), /未知供应商.*阿里云百炼/);
});
