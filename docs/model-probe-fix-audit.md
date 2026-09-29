# 模型服务检测修复审计（2026-09-29）

范围：模型页与 store 的检测状态修复，关联卡片、表单和详情只读核查。本审计覆盖规范符合性，功能验证另列。

角色：resource-workspace / chrome A / 对照 /ref/resource-workspace / case grid；关联 detail-modal 对照 /ref/detail-modal、form-modal 对照现有表单样板。

## 分层记录

| 层 | 结构与对照 | 判定 |
|---|---|---|
| S | 页头 → 供应商/单条搜索工具带 → 卡片 → 弹窗，与资源工作台相同 | 通过 |
| O | flex min-h-0 + overflow-hidden，壳无重复 padding，首屏四周 gutter | 通过 |
| N | WorkspaceSplit + Grid，卡片各自承载模型，无表外装饰卡 | 通过 |
| C | Forge SurfaceCard、StatusBadge、Button、字段及宿主 Modal | 通过 |

## 清单逐条核查

| 条目 | 结论 | 证据 | 修复方案 |
|---|---|---|---|
| M1 | 通过 | config/menu.tsx:47 模型服务模块入口、Solar 图标、尾斜杠 | — |
| M2 | 通过 | config/menu.tsx:47 模型服务模块入口、Solar 图标、尾斜杠 | — |
| M3 | 不适用 | 本次未新增模块；config/apps.ts:116 / config/site.ts:22 已登记 | — |
| M4 | 通过 | config/menu.tsx:47 模型服务模块入口、Solar 图标、尾斜杠 | — |
| M5 | 通过 | config/menu.tsx:47 模型服务模块入口、Solar 图标、尾斜杠 | — |
| M6 | 通过 | config/menu.tsx:47 模型服务模块入口、Solar 图标、尾斜杠 | — |
| R1 | 通过 | app/(app)/models/page.tsx:302 页头 A、WorkspaceSplit、单条搜索带、Grid；首屏底 gutter 可见；品牌图标为资源标识 | — |
| R2 | 通过 | app/(app)/models/page.tsx:123 详情 ?id=；create/edit query 已支持 | — |
| R3 | 通过 | components/model-form-dialog.tsx:181 Modal + Forge 字段；页面管理弹窗状态 | — |
| R4 | 通过 | app/(app)/models/page.tsx:123 详情 ?id=；create/edit query 已支持 | — |
| R5 | 不适用 | app/(app)/models/page.tsx:325 资源卡工作台，无全页详情、DataTable、图表或重定向页改动 | — |
| H1 | 通过 | app/(app)/models/page.tsx:302 页头 A、WorkspaceSplit、单条搜索带、Grid；首屏底 gutter 可见；品牌图标为资源标识 | — |
| H2 | 通过 | app/(app)/models/page.tsx:302 页头 A、WorkspaceSplit、单条搜索带、Grid；首屏底 gutter 可见；品牌图标为资源标识 | — |
| H3 | 不适用 | app/(app)/models/page.tsx:325 资源卡工作台，无全页详情、DataTable、图表或重定向页改动 | — |
| H4 | 通过 | app/(app)/models/page.tsx:302 页头 A、WorkspaceSplit、单条搜索带、Grid；首屏底 gutter 可见；品牌图标为资源标识 | — |
| H5 | 不适用 | app/(app)/models/page.tsx:325 资源卡工作台，无全页详情、DataTable、图表或重定向页改动 | — |
| H6 | 通过 | app/(app)/models/page.tsx:302 页头 A、WorkspaceSplit、单条搜索带、Grid；首屏底 gutter 可见；品牌图标为资源标识 | — |
| H7 | 通过 | components/model-card.tsx:66 卡内连接状态绑定对应模型；StatusBadge soft + 文案 | — |
| L1 | 通过 | app/(app)/models/page.tsx:302 页头 A、WorkspaceSplit、单条搜索带、Grid；首屏底 gutter 可见；品牌图标为资源标识 | — |
| L2 | 通过 | app/(app)/models/page.tsx:302 页头 A、WorkspaceSplit、单条搜索带、Grid；首屏底 gutter 可见；品牌图标为资源标识 | — |
| L3 | 通过 | app/(app)/models/page.tsx:302 页头 A、WorkspaceSplit、单条搜索带、Grid；首屏底 gutter 可见；品牌图标为资源标识 | — |
| L4 | 不适用 | app/(app)/models/page.tsx:325 资源卡工作台，无全页详情、DataTable、图表或重定向页改动 | — |
| L5 | 不适用 | app/(app)/models/page.tsx:325 资源卡工作台，无全页详情、DataTable、图表或重定向页改动 | — |
| L6 | 通过 | app/(app)/models/page.tsx:302 页头 A、WorkspaceSplit、单条搜索带、Grid；首屏底 gutter 可见；品牌图标为资源标识 | — |
| L7 | 不适用 | app/(app)/models/page.tsx:325 资源卡工作台，无全页详情、DataTable、图表或重定向页改动 | — |
| L8 | 不适用 | app/(app)/models/page.tsx:325 资源卡工作台，无全页详情、DataTable、图表或重定向页改动 | — |
| L9 | 通过 | app/(app)/models/page.tsx:302 页头 A、WorkspaceSplit、单条搜索带、Grid；首屏底 gutter 可见；品牌图标为资源标识 | — |
| L10 | 通过 | app/(app)/models/page.tsx:302 页头 A、WorkspaceSplit、单条搜索带、Grid；首屏底 gutter 可见；品牌图标为资源标识 | — |
| C1 | 通过 | app/(app)/models/page.tsx:302 页头 A、WorkspaceSplit、单条搜索带、Grid；首屏底 gutter 可见；品牌图标为资源标识 | — |
| C2 | 不适用 | app/(app)/models/page.tsx:325 资源卡工作台，无全页详情、DataTable、图表或重定向页改动 | — |
| C3 | 不适用 | app/(app)/models/page.tsx:325 资源卡工作台，无全页详情、DataTable、图表或重定向页改动 | — |
| C4 | 通过 | app/(app)/models/page.tsx:268 删除确认使用遮罩宿主，与清单列举的样板方式一致 | — |
| C5 | 通过 | components/model-card.tsx:66 卡内连接状态绑定对应模型；StatusBadge soft + 文案 | — |
| C6 | 通过 | app/(app)/models/page.tsx:240 测连有实际 API、最终状态及 toast；删除有服务调用 | — |
| C7 | 通过 | app/(app)/models/page.tsx:302 页头 A、WorkspaceSplit、单条搜索带、Grid；首屏底 gutter 可见；品牌图标为资源标识 | — |
| C8 | 通过 | app/(app)/models/page.tsx:302 页头 A、WorkspaceSplit、单条搜索带、Grid；首屏底 gutter 可见；品牌图标为资源标识 | — |
| C9 | 不适用 | app/(app)/models/page.tsx:325 资源卡工作台，无全页详情、DataTable、图表或重定向页改动 | — |
| C10 | 不适用 | app/(app)/models/page.tsx:325 资源卡工作台，无全页详情、DataTable、图表或重定向页改动 | — |
| V1 | 通过 | app/(app)/models/page.tsx:302 页头 A、WorkspaceSplit、单条搜索带、Grid；首屏底 gutter 可见；品牌图标为资源标识 | — |
| V2 | 通过 | app/(app)/models/page.tsx:302 页头 A、WorkspaceSplit、单条搜索带、Grid；首屏底 gutter 可见；品牌图标为资源标识 | — |
| V3 | 通过 | app/(app)/models/page.tsx:302 页头 A、WorkspaceSplit、单条搜索带、Grid；首屏底 gutter 可见；品牌图标为资源标识 | — |
| V4 | 不适用 | app/(app)/models/page.tsx:325 资源卡工作台，无全页详情、DataTable、图表或重定向页改动 | — |
| V5 | 通过 | app/(app)/models/page.tsx:302 页头 A、WorkspaceSplit、单条搜索带、Grid；首屏底 gutter 可见；品牌图标为资源标识 | — |
| V6 | 通过 | components/model-card.tsx:66 卡内连接状态绑定对应模型；StatusBadge soft + 文案 | — |
| V7 | 通过 | app/(app)/models/page.tsx:302 页头 A、WorkspaceSplit、单条搜索带、Grid；首屏底 gutter 可见；品牌图标为资源标识 | — |
| F1 | 通过 | components/model-form-dialog.tsx:181 Modal + Forge 字段；页面管理弹窗状态 | — |
| F2 | 通过 | app/(app)/models/page.tsx:268 删除确认使用遮罩宿主，与清单列举的样板方式一致 | — |
| F3 | 通过 | components/model-form-dialog.tsx:110 validate + TextField errorMessage | — |
| F4 | 通过 | app/(app)/models/page.tsx:240 测连有实际 API、最终状态及 toast；删除有服务调用 | — |
| F5 | 通过 | components/model-form-dialog.tsx:159 创建后 onCreated 打开详情 | — |
| F6 | 通过 | app/(app)/models/page.tsx:254 既有 Modal，无 Drawer/Sheet | — |
| D1 | 通过 | app/(app)/models/page.tsx:372 error+重试、loading、空态双分支、数据 | — |
| D2 | 不适用 | app/(app)/models/page.tsx:325 资源卡工作台，无全页详情、DataTable、图表或重定向页改动 | — |
| D3 | 通过 | components/models-store.tsx:122 → app/api/models/[id]/probe/route.ts:7 → lib/models/service.ts:187，独立 ai_models | — |
| D4 | 通过 | components/models-store.tsx:122 → app/api/models/[id]/probe/route.ts:7 → lib/models/service.ts:187，独立 ai_models | — |
| D5 | 建议复核 | app/(app)/models/page.tsx:83 筛选仍为临时 state，未新增 URL 持久化 | 本次保留临时筛选，后续按分享需求确定 |
| D6 | 通过 | lib/models/service.ts:19 maskKey；详情使用 apiKeyMasked | — |
| E1 | 通过 | app/(app)/models/page.tsx:25 页面、卡、弹窗、store、service 分离 | — |
| E2 | 通过 | app/api/models/[id]/probe/route.ts:7 requirePermission + jsonOk/jsonError；本次无新请求字段 | — |
| E3 | 通过 | app/(app)/models/page.tsx:25 页面、卡、弹窗、store、service 分离 | — |
| E4 | 通过 | app/(app)/models/page.tsx:1 use client + React 交互 | — |
| Q1 | 通过 | pnpm check 退出 0，15 条既有 ref 画廊警告 | — |
| Q2 | 通过 | tmp/grok-probe/verified.png；Chrome 两模型自动检测结束，详情返回成功 ok | — |
| Q3 | 通过 | app/(app)/ref/resource-workspace/page.tsx:163；供应商替代文件夹，连接状态替代资源发布状态，合理业务差异 | — |
| Q4 | 通过 | Chrome dev.logs error/warn 返回空列表，未见 Next 错误 overlay | — |

## 功能修复与重验

- 根因：probeModel 写回 models 引用 → effect cleanup 将 cancelled 置为 true；相同 ID 的 probedKey 又阻止重跑。未完成 worker 的终态被丢弃。
- 修复：effect 依赖启用模型 ID 集合，不依赖测连结果对象；取消 probedKey 短路，保留卸载与目标集合变化时的取消机制。
- 单独将测连接口客户端超时调整为 30 秒，高于服务端 20 秒；普通请求继续 15 秒；客户端超时给中文说明。
- Chrome 实际两模型并行测连，两个卡片均结束为“正常”。sub2api / grok-4.7 详情最近测连记录为成功、返回 ok；关闭详情仍为正常。
- pnpm check 通过；15 条历史 /ref 警告。浏览器 error/warn 日志为空。
- 截图：tmp/grok-probe/verified.png。

结论：本次未发现新增视觉红线；D5 筛选 URL 持久化为建议复核。未修改对照页和清单。无需清单反哺。
