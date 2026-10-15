# Ask AI 内嵌表单审计（2026-09-28）

角色：对话内 form surface；chrome：宿主账号页 A；主对照 /ref/agent，字段对照 account-form-dialog / input-field case。用户明确要求对话内表单，此差异不要求额外 Modal。

范围：components/ask-ai-form.tsx、ask-ai-transcript.tsx、ask-ai-entry.tsx；关联 forms 契约及 API。
S：原问答顺序中增加表单块，提交完成折叠摘要。
O：Kit AskAi 原宿主、滚动区、composer不变；新增表单 min-w-0。
N：单层字段与按钮，无卡片套卡片；DataTable未新增外框。
C：TextField/SelectOption/TextArea/Button/Grid全部来自core；字段校验与账号页面共用schema。

发现并修复：单列过长→紧凑双列；选择控件外框未撑满→w-full；关闭抽屉丢草稿→宿主内存状态；完成后仍提示保存→改为历史状态摘要；模型只说已准备表单→受限纠正一次。无新增菜单、页头或页面壳。

|条目|结果|证据|
|---|---|---|
|M1|不适用|本次未修改对应菜单、路由、页头、图标、图表或详情指标；范围内无此新增结构|
|M2|不适用|本次未修改对应菜单、路由、页头、图标、图表或详情指标；范围内无此新增结构|
|M3|不适用|本次未修改对应菜单、路由、页头、图标、图表或详情指标；范围内无此新增结构|
|M4|不适用|本次未修改对应菜单、路由、页头、图标、图表或详情指标；范围内无此新增结构|
|M5|不适用|本次未修改对应菜单、路由、页头、图标、图表或详情指标；范围内无此新增结构|
|M6|不适用|本次未修改对应菜单、路由、页头、图标、图表或详情指标；范围内无此新增结构|
|R1|通过|对话内 form surface；用户明确要求；宿主仍为 Kit AskAi，components/ask-ai-form.tsx:81|
|R2|不适用|本次未修改对应菜单、路由、页头、图标、图表或详情指标；范围内无此新增结构|
|R3|通过|用户授权的内嵌补全表单；最终保存仍为 AccountFormDialog，不新增独立路由|
|R4|不适用|本次未修改对应菜单、路由、页头、图标、图表或详情指标；范围内无此新增结构|
|R5|不适用|本次未修改对应菜单、路由、页头、图标、图表或详情指标；范围内无此新增结构|
|H1|不适用|本次未修改对应菜单、路由、页头、图标、图表或详情指标；范围内无此新增结构|
|H2|不适用|本次未修改对应菜单、路由、页头、图标、图表或详情指标；范围内无此新增结构|
|H3|不适用|本次未修改对应菜单、路由、页头、图标、图表或详情指标；范围内无此新增结构|
|H4|不适用|本次未修改对应菜单、路由、页头、图标、图表或详情指标；范围内无此新增结构|
|H5|不适用|本次未修改对应菜单、路由、页头、图标、图表或详情指标；范围内无此新增结构|
|H6|不适用|本次未修改对应菜单、路由、页头、图标、图表或详情指标；范围内无此新增结构|
|H7|不适用|本次未修改对应菜单、路由、页头、图标、图表或详情指标；范围内无此新增结构|
|L1|通过|components/ask-ai-entry.tsx:497 保留唯一 AskAi 宿主，无新壳|
|L2|通过|components/ask-ai-form.tsx:81 纵向 stack，无额外页面 padding|
|L3|不适用|本次未修改对应菜单、路由、页头、图标、图表或详情指标；范围内无此新增结构|
|L4|不适用|本次未修改对应菜单、路由、页头、图标、图表或详情指标；范围内无此新增结构|
|L5|不适用|本次未修改对应菜单、路由、页头、图标、图表或详情指标；范围内无此新增结构|
|L6|通过|components/ask-ai-form.tsx:86 双列字段 gap12；与 TextField/SelectOption case 对齐|
|L7|通过|components/ask-ai-transcript.tsx:165 原 DataTable 列宽未变；保存后读回表已实测|
|L8|通过|components/ask-ai-transcript.tsx:165 表直接落对话 stack，无套卡|
|L9|通过|components/ask-ai-form.tsx:86 Grid+GridItem；375/768/1024/1440均无横向溢出|
|L10|通过|宿主锁视口，截图interaction-1440.png主内容面底gutter可见|
|C1|通过|components/ask-ai-form.tsx:4 全部控件来自Forge core|
|C2|通过|读回数据继续由DataTable呈现，不创建手写表格|
|C3|通过|没有引入sortable或无行为排序|
|C4|不适用|无新增ConfirmationDialog；既有页面删除确认不改|
|C5|通过|表单状态选项与处理状态均有中文文案|
|C6|通过|确认、取消、继续填写、添加备注均已点通；页面创建已实际持久化|
|C7|通过|SelectOption width=100%且外框w-full；按安装包d.ts与实现复核|
|C8|通过|pnpm check验证组件导出和props，无新增Drawer|
|C9|不适用|当前表单不新增实体表格详情入口；既有查询表不改|
|C10|不适用|本次未修改对应菜单、路由、页头、图标、图表或详情指标；范围内无此新增结构|
|V1|通过|新组件仅fg-*语义token|
|V2|通过|全部业务控件color=siteConfig.accent|
|V3|不适用|本次未修改对应菜单、路由、页头、图标、图表或详情指标；范围内无此新增结构|
|V4|不适用|本次未修改对应菜单、路由、页头、图标、图表或详情指标；范围内无此新增结构|
|V5|通过|表单节标题text-sm font-semibold；既有页面chrome不变|
|V6|不适用|未新增状态胶囊，表单选择与处理提示为文案|
|V7|通过|主文字fg-black、说明fg-grey-700；标签由Kit提供|
|F1|通过|按用户要求内嵌表单；字段复用Kit，保存仍走页面Modal|
|F2|不适用|本次未增加删除动作|
|F3|通过|components/ask-ai-form.tsx:43 字段级校验+首次错误聚焦；中文选择提示|
|F4|通过|请求失败toast.error；页面接受成功用现有toast，无内嵌成功绿条|
|F5|通过|本地创建后进入/accounts/995867c9-81f2-492e-a901-d13da30cfcce/|
|F6|通过|保留Kit AskAi抽屉，无新Drawer/Sheet|
|D1|不适用|未修改列表数据三态；表单有编辑/提交/完成/取消/失败重试|
|D2|不适用|未改详情页|
|D3|通过|新接口仅签发操作凭据；业务持久化复用页面store/API/service|
|D4|通过|只处理admin_accounts，不改users|
|D5|通过|草稿按会话内turn key存内存，关闭抽屉后恢复|
|D6|通过|表单只含业务字段；token不在UI展示，不传模型key|
|E1|通过|forms契约、UI组件、API各自独立|
|E2|通过|app/api/ask-ai/forms/route.ts:10 会话、权限、Zod、jsonOk/jsonError|
|E3|通过|复用账号schema及常量；渲染从登记字段定义读取|
|E4|通过|ask-ai-form与transcript/entry均为真实交互client组件|
|Q1|通过|.semantic/interaction-check.log|
|Q2|通过|真实Chrome已点通生成、校验、取消恢复、关闭保留、带入、最终保存|
|Q3|通过|主对照/ref/agent；字段对照account-form-dialog及input-field case；用户授权内嵌差异|
|Q4|通过|本地Chrome dev.logs error/warn为空；无新增React警告|

## 重验
63项回归通过；本地真实QwenPlus支持部分字段表单与连续新增。截图：.semantic/interaction-form-local.png、interaction-375.png、interaction-768.png、interaction-1024.png、interaction-1440.png。四档documentWidth均等于viewport，表单无横滚。

## 建议
后续在Kit提供受控抽屉关闭API后替换当前触发其既有关闭按钮的适配；当前只调用Kit现有关闭行为，没有自建遮罩。草稿仅在当前打开的应用会话中保留，刷新会清空。
