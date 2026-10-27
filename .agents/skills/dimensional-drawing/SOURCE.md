# 来源与本地适配

- 来源：https://github.com/enesozturk/dimensional-drawing
- 上游提交：`5c457437c8c83524308aad3b7443e81adcc13153`（2026-10-23，Dimensional drawing + motion skills）
- 作者：Enes Ozturk；许可：MIT，见本目录 `LICENSE`。`dimensional-drawing-motion/` 里有同一份许可证。
- 纳入日期：2026-10-26。
- 纳入范围：
  - `skills/dimensional-drawing/` → `.agents/skills/dimensional-drawing/`
  - `skills/dimensional-drawing-motion/` → `.agents/skills/dimensional-drawing-motion/`（可选成片，不是页面交付的一部分）
- 未纳入：上游 `assets/` 里的 png、gif、mp4 示例成片。
- 风险：低。尺寸图是静态 HTML。motion 的 headless 适配器只在该目录显式 `npm install` 之后才会安装 Playwright Chromium，并用本机 ffmpeg 编码；导入 skill 时不会执行。示例页向 Google Fonts 请求 Arimo，离线时回退 Helvetica/Arial。
- 审查：阅读两份 SKILL、示例 HTML 的外链、motion 模板与 `render.mjs`。没有发现读取凭据、外传业务数据或混淆执行。`render.mjs` 只读本地 scene/css。
- 本仓库用法：`forge-starter-audit` 必须出图（缺图 = FAIL，写原因也不通过）；`forge-starter-new-page` 无图不得把设计标完成。交付 HTML 放 `artifacts/dimensional-drawing/`。变量来自源码、Forge token 或已量到的值，没有的写 `[TBD]`，不编造数字。画架构槽位，不画文案。
- 分工：Kit 的 Dialog / DataTable 解剖示例与文档门禁在 forge 仓。starter 用同一套 skill 画本页整页、Dialog 和表。
- 依赖：不进 `package.json`，不进 runtime，不打进 `@forge-ui-official/core`。
- 修改：上游画法和示例保持原样。只在两份 `SKILL.md` 文首加上 Forge Starter 约定，并改了 description，使默认主题是页面和布局。headless README 补了一句本仓库路径，并写明不默认安装、不用系统 Chrome。
