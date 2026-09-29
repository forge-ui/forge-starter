# Ask AI 意图交互审计（2026-09-29）

范围仅本次 Ask AI 候选、过期操作与详情入口增量，不审仓库其它并行改动。规范审计与功能测试分别记录。

角色：宿主页的对话附属操作面；chrome A（宿主保持原样）；主对照 /ref/agent；case：AskAi、agent、button。

|层|实际结构与对照|结论|
|---|---|---|
|S|原问答顺序中加入候选操作，当前轮可操作|合理业务差异|
|O|原Kit AskAi滚动区及composer，未新增壳|保持|
|N|单层按钮组，无卡片套卡片|通过|
|C|Kit Button + StreamingAnswer，fg样式|通过|

发现并修复：候选映射长文挤占对话→显示简短提示；按钮长名称不换行→自然换行；旧表单/候选可重复点击→仅当前轮启用。Starter原回复链接未呈现→增加可点击详情入口。没有改动任何业务表格布局。

|条目|结果|证据|处置|
|---|---|---|---|
|M1|不适用|components/ask-ai-transcript.tsx:132；本次增量未新增或修改此条涉及的页面、菜单、表格、表单字段、图标或持久化结构。|无需额外修复|
|M2|不适用|components/ask-ai-transcript.tsx:132；本次增量未新增或修改此条涉及的页面、菜单、表格、表单字段、图标或持久化结构。|无需额外修复|
|M3|不适用|components/ask-ai-transcript.tsx:132；本次增量未新增或修改此条涉及的页面、菜单、表格、表单字段、图标或持久化结构。|无需额外修复|
|M4|不适用|components/ask-ai-transcript.tsx:132；本次增量未新增或修改此条涉及的页面、菜单、表格、表单字段、图标或持久化结构。|无需额外修复|
|M5|不适用|components/ask-ai-transcript.tsx:132；本次增量未新增或修改此条涉及的页面、菜单、表格、表单字段、图标或持久化结构。|无需额外修复|
|M6|不适用|components/ask-ai-transcript.tsx:132；本次增量未新增或修改此条涉及的页面、菜单、表格、表单字段、图标或持久化结构。|无需额外修复|
|R1|通过|components/ask-ai-transcript.tsx:132；对话附属操作面，保留宿主页角色。|无需额外修复|
|R2|不适用|components/ask-ai-transcript.tsx:132；本次增量未新增或修改此条涉及的页面、菜单、表格、表单字段、图标或持久化结构。|无需额外修复|
|R3|不适用|components/ask-ai-transcript.tsx:132；本次增量未新增或修改此条涉及的页面、菜单、表格、表单字段、图标或持久化结构。|无需额外修复|
|R4|不适用|components/ask-ai-transcript.tsx:132；本次增量未新增或修改此条涉及的页面、菜单、表格、表单字段、图标或持久化结构。|无需额外修复|
|R5|不适用|components/ask-ai-transcript.tsx:132；本次增量未新增或修改此条涉及的页面、菜单、表格、表单字段、图标或持久化结构。|无需额外修复|
|H1|不适用|components/ask-ai-transcript.tsx:132；本次增量未新增或修改此条涉及的页面、菜单、表格、表单字段、图标或持久化结构。|无需额外修复|
|H2|不适用|components/ask-ai-transcript.tsx:132；本次增量未新增或修改此条涉及的页面、菜单、表格、表单字段、图标或持久化结构。|无需额外修复|
|H3|不适用|components/ask-ai-transcript.tsx:132；本次增量未新增或修改此条涉及的页面、菜单、表格、表单字段、图标或持久化结构。|无需额外修复|
|H4|不适用|components/ask-ai-transcript.tsx:132；本次增量未新增或修改此条涉及的页面、菜单、表格、表单字段、图标或持久化结构。|无需额外修复|
|H5|不适用|components/ask-ai-transcript.tsx:132；本次增量未新增或修改此条涉及的页面、菜单、表格、表单字段、图标或持久化结构。|无需额外修复|
|H6|不适用|components/ask-ai-transcript.tsx:132；本次增量未新增或修改此条涉及的页面、菜单、表格、表单字段、图标或持久化结构。|无需额外修复|
|H7|不适用|components/ask-ai-transcript.tsx:132；本次增量未新增或修改此条涉及的页面、菜单、表格、表单字段、图标或持久化结构。|无需额外修复|
|L1|通过|components/ask-ai-transcript.tsx:132；保留唯一 Kit AskAi 宿主。|无需额外修复|
|L2|通过|components/ask-ai-transcript.tsx:132；候选在对话纵向 stack，无新增页面 padding。|无需额外修复|
|L3|不适用|components/ask-ai-transcript.tsx:132；本次增量未新增或修改此条涉及的页面、菜单、表格、表单字段、图标或持久化结构。|无需额外修复|
|L4|不适用|components/ask-ai-transcript.tsx:132；本次增量未新增或修改此条涉及的页面、菜单、表格、表单字段、图标或持久化结构。|无需额外修复|
|L5|不适用|components/ask-ai-transcript.tsx:132；本次增量未新增或修改此条涉及的页面、菜单、表格、表单字段、图标或持久化结构。|无需额外修复|
|L6|通过|components/ask-ai-transcript.tsx:132；候选使用 secondary Button，gap-2，文本自然换行。|无需额外修复|
|L7|不适用|components/ask-ai-transcript.tsx:132；本次增量未新增或修改此条涉及的页面、菜单、表格、表单字段、图标或持久化结构。|无需额外修复|
|L8|不适用|components/ask-ai-transcript.tsx:132；本次增量未新增或修改此条涉及的页面、菜单、表格、表单字段、图标或持久化结构。|无需额外修复|
|L9|通过|components/ask-ai-transcript.tsx:132；一维候选按钮排列，无新增页面分栏。|无需额外修复|
|L10|不适用|components/ask-ai-transcript.tsx:132；本次增量未新增或修改此条涉及的页面、菜单、表格、表单字段、图标或持久化结构。|无需额外修复|
|C1|通过|components/ask-ai-transcript.tsx:132；新增控件只使用 core Button。|无需额外修复|
|C2|不适用|components/ask-ai-transcript.tsx:132；本次增量未新增或修改此条涉及的页面、菜单、表格、表单字段、图标或持久化结构。|无需额外修复|
|C3|不适用|components/ask-ai-transcript.tsx:132；本次增量未新增或修改此条涉及的页面、菜单、表格、表单字段、图标或持久化结构。|无需额外修复|
|C4|不适用|components/ask-ai-transcript.tsx:132；本次增量未新增或修改此条涉及的页面、菜单、表格、表单字段、图标或持久化结构。|无需额外修复|
|C5|通过|components/ask-ai-transcript.tsx:132；候选名称及ID有文字，历史候选 disabled。|无需额外修复|
|C6|通过|components/ask-ai-transcript.tsx:132；候选按钮真实发起下一问；详情入口实际点击后URL正确。|无需额外修复|
|C7|通过|components/ask-ai-transcript.tsx:132；Button secondary 与现有 Kit 类型匹配，已构建。|无需额外修复|
|C8|通过|components/ask-ai-transcript.tsx:132；无新增未导出控件。|无需额外修复|
|C9|不适用|components/ask-ai-transcript.tsx:132；本次增量未新增或修改此条涉及的页面、菜单、表格、表单字段、图标或持久化结构。|无需额外修复|
|C10|不适用|components/ask-ai-transcript.tsx:132；本次增量未新增或修改此条涉及的页面、菜单、表格、表单字段、图标或持久化结构。|无需额外修复|
|V1|通过|components/ask-ai-transcript.tsx:132；仅用 fg token 与 Kit 配色。|无需额外修复|
|V2|通过|components/ask-ai-transcript.tsx:132；按钮 color=siteConfig.accent。|无需额外修复|
|V3|不适用|components/ask-ai-transcript.tsx:132；本次增量未新增或修改此条涉及的页面、菜单、表格、表单字段、图标或持久化结构。|无需额外修复|
|V4|不适用|components/ask-ai-transcript.tsx:132；本次增量未新增或修改此条涉及的页面、菜单、表格、表单字段、图标或持久化结构。|无需额外修复|
|V5|通过|components/ask-ai-transcript.tsx:132；对话沿用 StreamingAnswer 字号。|无需额外修复|
|V6|不适用|components/ask-ai-transcript.tsx:132；本次增量未新增或修改此条涉及的页面、菜单、表格、表单字段、图标或持久化结构。|无需额外修复|
|V7|通过|components/ask-ai-transcript.tsx:132；正文由 StreamingAnswer，旧操作说明 grey-700，禁用项沿用Kit。|无需额外修复|
|F1|不适用|components/ask-ai-transcript.tsx:132；本次增量未新增或修改此条涉及的页面、菜单、表格、表单字段、图标或持久化结构。|无需额外修复|
|F2|不适用|components/ask-ai-transcript.tsx:132；本次增量未新增或修改此条涉及的页面、菜单、表格、表单字段、图标或持久化结构。|无需额外修复|
|F3|不适用|components/ask-ai-transcript.tsx:132；本次增量未新增或修改此条涉及的页面、菜单、表格、表单字段、图标或持久化结构。|无需额外修复|
|F4|不适用|components/ask-ai-transcript.tsx:132；本次增量未新增或修改此条涉及的页面、菜单、表格、表单字段、图标或持久化结构。|无需额外修复|
|F5|不适用|components/ask-ai-transcript.tsx:132；本次增量未新增或修改此条涉及的页面、菜单、表格、表单字段、图标或持久化结构。|无需额外修复|
|F6|通过|components/ask-ai-transcript.tsx:132；保留Kit抽屉，未新增Drawer。|无需额外修复|
|D1|不适用|components/ask-ai-transcript.tsx:132；本次增量未新增或修改此条涉及的页面、菜单、表格、表单字段、图标或持久化结构。|无需额外修复|
|D2|不适用|components/ask-ai-transcript.tsx:132；本次增量未新增或修改此条涉及的页面、菜单、表格、表单字段、图标或持久化结构。|无需额外修复|
|D3|通过|components/ask-ai-transcript.tsx:132；候选来自现有业务service/数据存储，无直接写库。|无需额外修复|
|D4|不适用|components/ask-ai-transcript.tsx:132；本次增量未新增或修改此条涉及的页面、菜单、表格、表单字段、图标或持久化结构。|无需额外修复|
|D5|不适用|components/ask-ai-transcript.tsx:132；本次增量未新增或修改此条涉及的页面、菜单、表格、表单字段、图标或持久化结构。|无需额外修复|
|D6|通过|components/ask-ai-transcript.tsx:132；候选仅实体名称、ID和非敏感描述，无密钥。|无需额外修复|
|E1|通过|components/ask-ai-transcript.tsx:132；策略、适配器、对话UI分文件。|无需额外修复|
|E2|不适用|components/ask-ai-transcript.tsx:132；本次增量未新增或修改此条涉及的页面、菜单、表格、表单字段、图标或持久化结构。|无需额外修复|
|E3|通过|components/ask-ai-transcript.tsx:132；共用意图策略与候选协议。|无需额外修复|
|E4|通过|components/ask-ai-transcript.tsx:132；对话组件保留use client及实际事件。|无需额外修复|
|Q1|通过|components/ask-ai-transcript.tsx:132；pnpm check通过；现有参考页规范警告另记。|无需额外修复|
|Q2|通过|components/ask-ai-transcript.tsx:132；Chrome点通候选、序号、详情和取消，截图在/tmp/ask-intent-evidence。|无需额外修复|
|Q3|通过|components/ask-ai-transcript.tsx:132；主对照/ref/agent与Kit AskAi/Button；候选交互属合理业务差异。|无需额外修复|
|Q4|通过|components/ask-ai-transcript.tsx:132；主站/医疗无error或warn；Starter仅开发热更新full reload警告。|无需额外修复|

重验：三端本地通过类型及绊线检查。主站119项、医疗123项、Starter71项测试通过，零失败/零跳过；Starter含数据库与真实HTTP回归。医疗375像素候选宽319、scrollWidth319，文档宽375；桌面1920截图候选可读。其它两端使用相同候选布局，浏览器已点通，未另作375截图。

边界：意图覆盖当前已登记工具，未登记写操作提供页面入口；不声称新接入全部业务CRUD。浏览器演示模式的服务端查询沿用原数据源，浏览器私有修改的同步不在此次变更范围。

清单反哺建议：后续可加入历史操作失效和候选稳定ID验证；本次未修改审计清单。
