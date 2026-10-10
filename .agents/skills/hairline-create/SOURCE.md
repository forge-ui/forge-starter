# 来源与本地适配

- 来源：https://github.com/lucasmarkes/hairline/tree/a2217852fed6d1a4f20bc7d43d4fad1a3de117b8/skills/hairline-create
- 上游提交：`a2217852fed6d1a4f20bc7d43d4fad1a3de117b8`
- 作者：Lucas Marques；许可：MIT，见 LICENSE。
- 纳入日期：2026-10-10。
- 审查范围：上游 11 个 Skill 文件全部阅读，包括 kernel、bench、两个示例、生成/校验/截图脚本及说明。
- 风险：中（本地文件生成、可选浏览器与 npm 依赖）。没有发现外传数据、读取凭据或系统配置的代码。截图中的 base64 用于本地 PNG 合成，非混淆执行载荷。
- 上游问题：look.mjs 自动安装已声明的 playwright-core 并启动系统 Chrome。本地适配后默认不会安装或启动；必须显式指定独立 Chromium / Chrome for Testing。禁止系统 Chrome。
- 来源下载量、星标和外部用户评价未作为信任依据；未核验。
- 修改：SKILL.md 增加 Forge 约定；look.md 更新浏览器流程；look.mjs 增加显式隔离浏览器 gate，移除系统 Chrome launch；保留 kernel.js、bench.html 和静态校验器原样。
- 验证：两个示例均 build + validate 通过；look.mjs 语法检查通过；无浏览器配置时退出 2，未安装依赖或启动浏览器。
- 结论：经本地适配可纳入项目，默认先独立图形视觉确认，不自动修改 Ask AI 或业务页。
