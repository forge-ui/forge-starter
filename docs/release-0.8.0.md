# Forge Starter v0.8.0

Ask AI 接入 Forge Agent 与 Checklist 原生组件，支持多选收集、用户自查清单、推荐与分析卡、来源摘要、可搜索追问、差异核对、代码视图和流程图；交互结果可以继续真实任务。消息末尾统一使用 StreamingAnswer 追问，处理记录默认收起并与任务状态同排。

- 接入持久化任务、对话恢复、页面状态及操作回执；页面确认、保存后继续原任务。
- 支持 Grok 供应商、正确的 xAI 标识，以及中转 API 检测超时和模型选择。
- 升级 Forge core 至 0.3.1，完善弹窗、反馈和内容切换。
- 清单勾选按消息保存在当前浏览器；差异提交只发起核对，业务修改仍由页面确认保存。

## 升级

已有数据库先应用 migrations/semantic-v1.sql（未安装时），再应用 migrations/0003_ask_ai_harness.sql。迁移新增 revision、操作回执及 harness 表/列。配置参见 .env.example。生产源码不包含本地密钥、测试环境或截图。

## 验证

- pnpm check 与 Cloudflare 生产构建通过；保留 15 条既有 /ref 规范警告和 middleware 弃用提示。
- 隔离数据库自动测试 137 项通过；额外真实 HTTP 测试 8 项通过，共 145 项通过，0 失败。
- Chrome 实际验证多选续办、清单提交与刷新恢复、推荐追问、分析切换、搜索、差异选择、代码视图、流程节点及处理记录。
- 原生组件少量英文文案、单选自动提交与差异行键盘限制见 docs/ask-ai-agent-components.md。

线上迁移前备份了受影响操作表，迁移后原有操作数量不变；应用可回退上一 Workers 版本，新增表列保留。
