# 语义底座 V1 本地验收与发布（2026-09-28）

用户授权：先在本地完整底座修复测试，通过后发布线上。此次发布包含完整 V1，不再仅发布导航补丁。

## 本地发现及修复

1. 导航工具缺失导致文字虚报跳转：固定模块目录、权限过滤、客户端实际路由确认。
2. 页面收到表单指令后聊天仍显示等待：完成回复移到页面 ACK 之后，超时走失败。
3. 保存续办可能只复述原请求：新增 continuationOperationId；服务端查验操作归属和已保存状态，重新调用 accounts.get 读回最终数据，再交给模型。聊天中的回执文本不再作为可信数据源。

## 验证证据

|项目|结果|证据|
|---|---|---|
|确定性/DB/真实 HTTP/导航/续办|53/53，无 skip|.semantic/release-tests-final.log|
|原续办回归|6/6|.semantic/release-legacy.log|
|Qwen Plus 固定用例|52/52|.semantic/model-evaluation.json|
|新续办回归先失败后通过|通过；覆盖无模型工具调用时仍返回真实最终数据、越权、未保存操作拒绝|.semantic/release-continuation-red.log / release-continuation-green.log|
|真实浏览器本地完整链路|导航→创建→修改草稿→保存；详情当前记录→跨页编辑→保存→自动读回新姓名及停用状态|.semantic/release-local-readback.png|
|Workers 本地真实 HTTP|2/2，包含保存、重放、冲突、续办读回、权限|.semantic/release-workers-http.log|
|类型/规范绊线|通过；15条既有 ref 警告|.semantic/release-check-final.log|
|索引重建|151文件、2423事实、10053关系、8 unresolved|.semantic/release-index-final.log|
|生产包构建|通过|.semantic/release-build-final.log|

规范审计沿用 docs/agent-semantic-audit.md 的逐条页面审计及 docs/ask-ai-navigation-fix.md 的助手审计。本次仅改变确认完成时机，无新增 JSX/style。C6/F4/D3/E2/Q1-Q4 复核通过。本地控制台只有修改共享模块触发的 Fast Refresh full reload 警告；保存续办无运行时异常。

## 发布

- 隔离发布目录：/Users/hesong/.codex/worktrees/ask-ai-navigation/forge-starter。
- 来源：当前主工作区完整底座；基线697eebe，显式文件清单及哈希 .semantic/release-manifest.json；构建后核对无偏移。
- 先备份受影响账号表数据和列定义，再执行 migrations/semantic-v1.sql。只增加 revision 和 semantic_operations。迁移前后账号数量均0；备份位置与哈希见 .semantic/release-migration.log。
- SEMANTIC_ENABLED=true。
- 发布到 starter.forgeui.org；Cloudflare 当前 version 6d62b78e-dce8-48dc-acc0-31a20f4d06f7（首次完整 V1 为 8ffddfad-3453-4ae4-aebc-9a86cde3fe4f）。
- 上一版本261c1e0e-b6ac-4dfa-bee3-7cedca7fad20可用于应用回退，新增数据库表/列可保留。未commit/push。

## 边界

V1重点是账号和模型页面的登记契约、页面状态、确认执行和保存回执。源码索引留在开发侧，生产 Ask AI 不读取源码。固定用例通过不代表任意请求100%成功；尚未完成全仓人工关系 precision/recall 评估。业务保存仍需用户在页面确认。新模块须登记契约、工具和页面适配。生产复核只查询及打开页面，不新建业务账号。userAccepted=false，待用户产品验收。

## 发布复核发现与追加修复

首次完整 V1 发布后的浏览器冒烟发现：模型查询后接着说“打开这个模型的详情”，历史只有文本，没有记录 ID；模型构造了不存在的 UUID，旧工具仅校验格式，导致页面拒绝打开。本地先加入回归并确认失败，然后修复：

- models.open 在生成确认单及确认执行时都查询真实模型，未知 ID 拒绝执行；确认单显示真实模型名称。
- 工具规则要求本轮重新查询真实 ID，供应商使用原始名称；未知供应商返回可选名称供模型纠正，避免伪装成空结果。
- 最新回归 55/55，无跳过；pnpm check 通过（原有15条 ref 警告）。
- 本地真实 Qwen Plus 两轮“查询默认对话模型”→“打开这个模型的详情”→确认后，URL 带真实 ID，关闭助手后模型详情弹窗内容匹配。
- 证据：.semantic/release-tests-model-fix.log、release-check-model-fix.log、release-model-open-red.log、release-local-model-open.png、release-build-model-fix.log。
- 此修复未改变页面结构或样式，沿用上述完整规范审计；无需新增数据库迁移。

追加修复部署日志：.semantic/release-deploy-model-fix.log；最终版本 02078807-80e4-44a1-a413-b92314ac4bf6。

最终线上浏览器复核通过：刷新后查询“当前页面有几个模型？列出名称。”得到1个通义千问 Qwen Plus；继续“打开这个模型的详情”并确认，URL 为 /models/?id=0ded4728-a926-4594-b568-afe677479eb3，实际弹窗显示通义千问 Qwen Plus、阿里云百炼、qwen-plus。浏览器控制台无 error。截图 .semantic/release-online-model-open.png。

## 纯文本工具名回归修复

用户再次反馈“去新增账号”只显示 `(accounts_navigate)`。在 runAgentTurn 接入层注入相同模型响应，复现无导航命令且直接显示工具名（text-tool-red.log）。

修复：仅将完整的已登记工具标识识别为异常回复，不把文本直接当命令执行。最多要求模型纠正一次，tool_choice=required 且工具目录仍按用户权限过滤；实际 tool_calls 仍通过原有参数、权限、确认链路。拒绝纠正、没有权限或供应商拒绝 required 时明确提示未执行。普通文本回复不强制调用工具。

验证：59/59回归通过，无跳过；pnpm check通过（15条既有ref警告）；本地浏览器原句“去新增账号”确实到达/accounts/；额外注入纯文本故障后由真实Qwen Plus纠正为导航命令。证据：.semantic/text-tool-red.log、text-tool-green.log、text-tool-regression.log、text-tool-check.log、text-tool-live.log。仅改服务端运行逻辑和测试，无页面布局样式修改。生产构建text-tool-build.log通过。

纯文本工具修复已发布：e356032c-0bc8-4d6f-963b-bc3d42921b48。线上浏览器在模型页发送“去新增账号”，实际URL到达/accounts/，显示“已打开账号管理页面”；证据.semantic/text-tool-online.png，部署日志text-tool-deploy.log。未提交或推送。

## 对话内信息收集（2026-09-28）

- 新增已登记 form block，当前支持 accounts.create；工具参数允许部分字段，实际提交仍用完整 accountCreateSchema。
- UI 使用 Forge TextField / SelectOption / TextArea / Grid / Button：用户名等已知值预填、中文选项、备注按需展开、字段级错误、取消/继续填写。
- 草稿以 turn key 保留在 AskAi 宿主内存，关闭重开不会丢失；刷新清空。提交中防重复点击；完成后折叠摘要，调用 Kit 既有关闭按钮露出页面保存弹窗。
- /api/ask-ai/forms 重新验证会话、accounts:create/read 权限、表单标识和所有字段，仅签发页面确认凭据，不直接创建业务记录。
- 原始请求传入续办；保存后只返回可信读回结果，避免改过用户名后仍复述原始用户名。
- 明确新增账号请求若模型只返回文本，最多纠正一次；不把“已准备好”当作已生成表单。
- 本地 Chrome 完整完成：新增abc草稿→字段校验→取消恢复→关闭重开保留→补齐并修改用户名chat_form_0928→自动露出页面表单→页面创建成功，生成995867c9-81f2-492e-a901-d13da30cfcce（仅隔离测试库）。
- 63/63测试无跳过；pnpm check通过（既有15条ref警告）；源码hash一致，生产构建成功。
- 完整65条规范审计见docs/ask-ai-interaction-audit.md，响应式375/768/1024/1440无横向溢出，Chrome控制台无error/warn。
- 证据：.semantic/interaction-tests.log、interaction-check.log、interaction-build.log、interaction-manifest.json、interaction-form-local.png、interaction-*.png。
- 范围：本次完成新建账号的信息收集表单；其他工具仍使用现有查询表、确认卡和下载块，不宣称所有操作都已转成表单。

对话内表单发布版本：6d62b78e-dce8-48dc-acc0-31a20f4d06f7，部署日志.semantic/interaction-deploy.log；本次无数据库迁移。

线上交互复核通过：在账号页输入“新增一个abc账号”，真实QwenPlus返回表单并预填abc；空字段确认显示就地校验；取消/继续填写可用；关闭重开保留草稿；账号数量仍为0，未写入生产测试数据。控制台error/warn为空。截图.semantic/interaction-online.png及interaction-online-validation.png。线上页已保留给用户测试。
