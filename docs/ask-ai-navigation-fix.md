# Ask AI 导航修复规范审计（2026-09-28）

范围：components/ask-ai-entry.tsx 本次导航交互改动；业务 page.tsx 未修改。该报告只评估规范，功能证据另列。

角色 / chrome / 对照：壳级 Ask AI；A 页头右侧入口；/ref/agent + 原 AskAiProvider；Kit agent/page-header。

## 四层取证

|层|实际结构|对照结论|
|---|---|---|
|S|原页面页头/工具带/主体 + Ask AI portal|未更改页面骨架|
|O|唯一 AppShell/AskAiProvider，稳定 mount|路由变化只移动 trigger，会话保留|
|N|Kit AskAi transcript/composer；导航状态复用回复与 toast|无新卡片或 surface|
|C|Kit AskAi/PromptBar/StreamingAnswer|无新样式、图标或组件|

## 逐条核查

|条目|结论|证据 / 适用性|修复|
|---|---|---|---|
|M1|不适用|本次未修改该条所约束的菜单、业务页面、表格、表单或数据形态；provider 导航 diff 不涉及此项|无需规范修复|
|M2|不适用|本次未修改该条所约束的菜单、业务页面、表格、表单或数据形态；provider 导航 diff 不涉及此项|无需规范修复|
|M3|不适用|本次未修改该条所约束的菜单、业务页面、表格、表单或数据形态；provider 导航 diff 不涉及此项|无需规范修复|
|M4|通过|导航仅来自 config/apps.ts:107 已登记入口；无占位路径|无需规范修复|
|M5|不适用|本次未修改该条所约束的菜单、业务页面、表格、表单或数据形态；provider 导航 diff 不涉及此项|无需规范修复|
|M6|通过|导航保留 APP_MODULE_META 尾斜杠|无需规范修复|
|R1|通过|Ask AI 属于壳级助手，来源/目标页面分别为资源工作台/collection|无需规范修复|
|R2|不适用|本次未修改该条所约束的菜单、业务页面、表格、表单或数据形态；provider 导航 diff 不涉及此项|无需规范修复|
|R3|不适用|本次未修改该条所约束的菜单、业务页面、表格、表单或数据形态；provider 导航 diff 不涉及此项|无需规范修复|
|R4|不适用|本次未修改该条所约束的菜单、业务页面、表格、表单或数据形态；provider 导航 diff 不涉及此项|无需规范修复|
|R5|不适用|本次未修改该条所约束的菜单、业务页面、表格、表单或数据形态；provider 导航 diff 不涉及此项|无需规范修复|
|H1|通过|页头 AskAiProvider 入口/Kit AskAi 保留，无新页头|无需规范修复|
|H2|不适用|本次未修改该条所约束的菜单、业务页面、表格、表单或数据形态；provider 导航 diff 不涉及此项|无需规范修复|
|H3|不适用|本次未修改该条所约束的菜单、业务页面、表格、表单或数据形态；provider 导航 diff 不涉及此项|无需规范修复|
|H4|不适用|本次未修改该条所约束的菜单、业务页面、表格、表单或数据形态；provider 导航 diff 不涉及此项|无需规范修复|
|H5|不适用|本次未修改该条所约束的菜单、业务页面、表格、表单或数据形态；provider 导航 diff 不涉及此项|无需规范修复|
|H6|不适用|本次未修改该条所约束的菜单、业务页面、表格、表单或数据形态；provider 导航 diff 不涉及此项|无需规范修复|
|H7|不适用|本次未修改该条所约束的菜单、业务页面、表格、表单或数据形态；provider 导航 diff 不涉及此项|无需规范修复|
|L1|通过|components/ask-ai-entry.tsx:97 保留 AppShell 内唯一 provider|无需规范修复|
|L2|通过|未改页面根 stack 或 padding|无需规范修复|
|L3|不适用|本次未修改该条所约束的菜单、业务页面、表格、表单或数据形态；provider 导航 diff 不涉及此项|无需规范修复|
|L4|不适用|本次未修改该条所约束的菜单、业务页面、表格、表单或数据形态；provider 导航 diff 不涉及此项|无需规范修复|
|L5|不适用|本次未修改该条所约束的菜单、业务页面、表格、表单或数据形态；provider 导航 diff 不涉及此项|无需规范修复|
|L6|通过|截图核验 Kit 抽屉、PromptBar 与会话排版未变|无需规范修复|
|L7|不适用|本次未修改该条所约束的菜单、业务页面、表格、表单或数据形态；provider 导航 diff 不涉及此项|无需规范修复|
|L8|不适用|本次未修改该条所约束的菜单、业务页面、表格、表单或数据形态；provider 导航 diff 不涉及此项|无需规范修复|
|L9|不适用|本次未修改该条所约束的菜单、业务页面、表格、表单或数据形态；provider 导航 diff 不涉及此项|无需规范修复|
|L10|通过|截图正文底边 gutter 仍可见；未改内容壳|无需规范修复|
|C1|通过|components/ask-ai-entry.tsx:21 仍只使用 Kit AskAi/PromptBar|无需规范修复|
|C2|不适用|本次未修改该条所约束的菜单、业务页面、表格、表单或数据形态；provider 导航 diff 不涉及此项|无需规范修复|
|C3|不适用|本次未修改该条所约束的菜单、业务页面、表格、表单或数据形态；provider 导航 diff 不涉及此项|无需规范修复|
|C4|不适用|本次未修改该条所约束的菜单、业务页面、表格、表单或数据形态；provider 导航 diff 不涉及此项|无需规范修复|
|C5|不适用|本次未修改该条所约束的菜单、业务页面、表格、表单或数据形态；provider 导航 diff 不涉及此项|无需规范修复|
|C6|通过|components/ask-ai-entry.tsx:194 等路由回执后完成；失败显示失败|无需规范修复|
|C7|通过|AskAi/PromptBar props 未变，新增代码只处理导航结果|无需规范修复|
|C8|通过|无新组件 import|无需规范修复|
|C9|不适用|本次未修改该条所约束的菜单、业务页面、表格、表单或数据形态；provider 导航 diff 不涉及此项|无需规范修复|
|C10|不适用|本次未修改该条所约束的菜单、业务页面、表格、表单或数据形态；provider 导航 diff 不涉及此项|无需规范修复|
|V1|通过|未新增颜色或样式|无需规范修复|
|V2|通过|沿用 siteConfig.accent|无需规范修复|
|V3|通过|无新增图标|无需规范修复|
|V4|不适用|本次未修改该条所约束的菜单、业务页面、表格、表单或数据形态；provider 导航 diff 不涉及此项|无需规范修复|
|V5|通过|截图中原页头、助手字号保持|无需规范修复|
|V6|不适用|本次未修改该条所约束的菜单、业务页面、表格、表单或数据形态；provider 导航 diff 不涉及此项|无需规范修复|
|V7|通过|回复正文黑色，次级模型状态为 caption；未改排版 token|无需规范修复|
|F1|不适用|本次未修改该条所约束的菜单、业务页面、表格、表单或数据形态；provider 导航 diff 不涉及此项|无需规范修复|
|F2|不适用|本次未修改该条所约束的菜单、业务页面、表格、表单或数据形态；provider 导航 diff 不涉及此项|无需规范修复|
|F3|不适用|本次未修改该条所约束的菜单、业务页面、表格、表单或数据形态；provider 导航 diff 不涉及此项|无需规范修复|
|F4|通过|components/ask-ai-entry.tsx:201 使用全站 toast.success|无需规范修复|
|F5|不适用|本次未修改该条所约束的菜单、业务页面、表格、表单或数据形态；provider 导航 diff 不涉及此项|无需规范修复|
|F6|通过|沿用 Kit AskAi 抽屉/全屏，无自研宿主|无需规范修复|
|D1|不适用|本次未修改该条所约束的菜单、业务页面、表格、表单或数据形态；provider 导航 diff 不涉及此项|无需规范修复|
|D2|不适用|本次未修改该条所约束的菜单、业务页面、表格、表单或数据形态；provider 导航 diff 不涉及此项|无需规范修复|
|D3|通过|导航无业务写库；原 CRUD service 不变|无需规范修复|
|D4|不适用|本次未修改该条所约束的菜单、业务页面、表格、表单或数据形态；provider 导航 diff 不涉及此项|无需规范修复|
|D5|不适用|本次未修改该条所约束的菜单、业务页面、表格、表单或数据形态；provider 导航 diff 不涉及此项|无需规范修复|
|D6|通过|导航只携带 href/label，无密钥；日志仅测试结果|无需规范修复|
|E1|通过|工具登记、传输、客户端执行分层在 lib/agent 与 provider|无需规范修复|
|E2|通过|沿用 API session/permission 过滤，入参空对象严格 Zod 校验|无需规范修复|
|E3|通过|共享 executeAgentNavigation，导航目录复用 APP_MODULE_META|无需规范修复|
|E4|通过|provider 保留 use client，真实交互|无需规范修复|
|Q1|通过|worktree 与主工作区 pnpm check 均通过；15条既有 ref 警告|无需规范修复|
|Q2|通过|真实 Qwen Plus 浏览器双向跳转成功，截图 navigation-local.png|无需规范修复|
|Q3|通过|对照 /ref/agent、现有 AskAiProvider；无 JSX 结构差异|无需规范修复|
|Q4|通过|浏览器 error/warn 日志为空|无需规范修复|

## 视觉与重验

Screenshot: 主工作区 .semantic/navigation-local.png。已按 S/O/N/C 检查，布局与原 Kit 助手一致。浏览器真实完成 models → accounts → models，历史保留；控制台无 error/warn。check 在隔离发布目录与主工作区均通过。

本次规范新增违规 0。既有 ref 画廊 15 条色彩警告不属于此次变更。功能根因：无导航工具/无客户端命令；模型文字被误当作成功。现补充固定目录、权限过滤、JSON传递、路由稳定回执和超时/取消失败。回归测试 8/8；页面导航不代表新建账号或数据保存已完成。

## 线上验证

2026-09-28 已发布到 starter.forgeui.org，Cloudflare version `261c1e0e-b6ac-4dfa-bee3-7cedca7fad20`。发布基线 `697eebe`，仅包含本文导航修复；结构化分析底座未随此补丁部署，无数据库迁移。前一线上版本 `00e9180b-1127-4af5-9a24-932dfb52e28a` 保留在平台版本记录中。

真实 Qwen Plus 请求“去新增账号，先帮我跳转到账户管理页面”，浏览器从 /models/ 到 /accounts/，同一会话显示“已打开账号管理页面”。线上控制台 error/warn 为空。证据：主工作区 `.semantic/navigation-online-fixed.png`；自定义域 models/accounts 及 workers.dev models HTTP 均为200。未创建业务账号。
