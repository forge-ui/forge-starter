> 最新状态：完整 V1 已在本地复验后于2026-09-28发布；见 [本地验收与发布记录](agent-semantic-release.md)。以下保留首次验收时的历史记录。

# 语义底座 V1 验证记录

日期：2026-09-28。起点 HEAD：72b24763ac493569a526998d3f4f03566109924e。未 commit/push、未部署、未迁移生产。

| 验证 | 结果 | 可复核证据 |
|---|---|---|
| 类型与规范绊线 | 通过，15 条既有 ref 默认色警告 | `.semantic/check.log` |
| 新增确定性测试 | 44/44，通过，无 skip | `.semantic/tests.log`；tests/semantic |
| 原有续办回归 | 6/6 | `.semantic/legacy-tests.log` |
| Qwen-plus 固定集 | 26 个问题 × 2 轮 = 52/52 | `.semantic/model-evaluation.json`，包含问题、参数与工具轨迹 |
| 源码索引 | 148 文件、2401 facts、9892 edges、8 unresolved；约 3.4 秒 | `.semantic/index-build.log`、`.semantic/index.json` |
| Node 真实 HTTP | 确认/上下文变化拒绝/最终草稿/重放/409/428/权限/读回 | tests/semantic/http.test.ts，已计入 44 项 |
| Workers 构建 | Next 73 路由生成与 OpenNext bundle 通过 | `.semantic/build.log` |
| Workers 本地 HTTP | 同一协议测试 2/2 通过 | `.semantic/workers-http.log` |
| 浏览器账号 | 详情当前记录→AI 确认→跨页表单→修改草稿→保存→同会话核对 | `.semantic/browser-account.png`；真实稳定 Chrome 现有会话 |
| 浏览器模型 | AI 查询真实模型 ID→确认打开→详情弹窗与 ?id= URL→关闭 | `.semantic/browser-model.png` |
| Forge 规范审计 | 分账号、模型两批逐条完成 | `docs/agent-semantic-audit.md` |

## 本轮发现并修复

1. 页面筛选误继承旧 scope 条件：页面动作与读范围绑定分离。
2. 模型被要求重填所有修改字段：改为部分更新，服务端补齐未变字段；显式移除 notes 默认值，避免清空旧备注。
3. 无当前记录时模型偶尔猜 ID：服务端对已支持的中文指代保守澄清。
4. 供应商简称 openai 与内部 model_openai_provider 不一致：共用规范化过滤。
5. 跨页保存后续办缺少原实体：使用实际回执的 entityId。
6. 测试副本链接外部 node_modules 导致 Turbopack/standalone 路径失败：改用本机 APFS 克隆依赖，业务构建配置保持原样。

## 结果边界

- 52/52 是当前固定集的工具选择/参数/确认单结果，不是任意自然语言准确率。早期轮次的失败用于修复，最终日志为修复后的两轮。多轮复杂历史仍可能出现仅文字回复而无工具卡，产品只能以真实确认单/回执为准。
- 分析器验证覆盖别名、同名、重导出、内容失效、证据 hash、明确 unresolved，以及人工选定的 6 条账号静态关系和 10 个字段变更必审位置。未完成全仓人工标注的关系 precision/recall 量化，不宣称 100% 关系召回。
- 计划中的逐文件局部增量改为指纹失效后保守全图重建；当前约 4 秒。没有引入后台索引服务或图数据库。
- 页面 dirty 是保守的“表单占用”标志，不暴露字段值；跨设备操作发现、恢复未保存草稿、操作账本自动保留策略不属于本次实现。
- 开关关闭仍需新增 revision 列；启用/回滚步骤见接入说明。
- 数据库 reconnect 与真实 Workers 实例验证了跨进程账本读取；没有通过中断真实生产连接制造丢包。
- 状态：本地 V1 可供代码和产品审阅；尚未完成总体规划的全部量化验收。`userAccepted=false`。

## 清理

本次 3167/3168 验证服务已停止，原有开发服务未停止。专用测试库内账号、模型（含环境自动导入项）与操作记录已清空，计数证据在 `.semantic/cleanup.json`；测试库 schema 和本地测试凭据保留用于复验。再次运行模型/浏览器案例前先执行 seed 脚本。生产数据未改动。

最终索引专项回归：6/6（`.semantic/index-tests.log`）。实际仓库嵌套函数同名节点冲突已修复，2401 个 fact ID 唯一；未改变业务运行时。
