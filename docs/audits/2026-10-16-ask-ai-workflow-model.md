# 审计报告：Ask AI 模型办理接入（2026-10-16）
本审计只覆盖规范符合性，不替代功能验证或用户体验验收。

## 对照物
角色：资源工作台 + form-modal + detail-modal；chrome B；主对照 /ref/resource-workspace，弹窗对照 /ref/form-modal、/ref/detail-modal；case toolbar/table/grid/modal/input-field。
范围：app/(app)/models/page.tsx、components/model-form-dialog.tsx、对应store/API/service；共享resource-agent、semantic-page、resource-write、AskAiEntry/Transcript按本模块调用检查。

## 分层记录
| 层 | 本层结构 / 与主对照的差异 | 判定 |
|---|---|---|
| S | 页头→筛选→列表/卡片→分页/空态→原弹窗；助手只触发原表单 | 合理业务差异 |
| O | 原AppLayout唯一内容面、stack、首屏gutter；无第二套壳 | 通过 |
| N | DataTable无装饰外卡；模型用WorkspaceSplit与Grid；Modal留在Grid外 | 通过 |
| C | core控件、fg token、中文字段和原字段级错误；草稿只覆盖公共值 | 通过 |

## 清单逐条核查
| ID | 判定 | 证据（文件:行）与理由 | 修复 |
|---|---|---|---|
| M1 | 不适用 | config/menu.tsx:1；不新增菜单入口 | 无新增违规 |
| M2 | 不适用 | config/menu.tsx:1；侧栏图标未改 | 无新增违规 |
| M3 | 不适用 | config/apps.ts:1；不新增模块/路由 | 无新增违规 |
| M4 | 通过 | lib/agent/navigation.ts:1；仅现有白名单路径 | 无新增违规 |
| M5 | 通过 | lib/agent/personal-tools.ts:1；个人设置保留头像原弹窗 | 无新增违规 |
| M6 | 通过 | lib/agent/resource-tools.ts:1；复用模块尾斜杠路径 | 无新增违规 |
| R1 | 通过 | app/(app)/models/page.tsx:19；原列表/资源工作台→表单弹窗 | 无新增违规 |
| R2 | 通过 | app/(app)/models/page.tsx:35；保留轻详情，不添加第二种详情 | 无新增违规 |
| R3 | 通过 | components/model-form-dialog.tsx:178；表单仍在本仓Modal | 无新增违规 |
| R4 | 通过 | app/(app)/models/page.tsx:11；保留create/edit/id query消费，并增加已确认语义指令 | 无新增违规 |
| R5 | 不适用 | app/(app)/models/page.tsx:70；未新增兼容路由 | 无新增违规 |
| H1 | 通过 | app/(app)/models/page.tsx:336；B正文页头；按docs/forge-components.md:118现有组合接口保留唯一AskAi入口；与清单预设API要求的差异见建议复核 | 无新增违规 |
| H2 | 通过 | app/(app)/models/page.tsx:339；组件内面包屑及accent | 无新增违规 |
| H3 | 不适用 | app/(app)/models/page.tsx:35；无动态全页详情 | 无新增违规 |
| H4 | 通过 | app/(app)/models/page.tsx:340；祖先工作台/末项无href | 无新增违规 |
| H5 | 不适用 | app/(app)/models/page.tsx:35；轻详情关闭，不新增侧栏返回 | 无新增违规 |
| H6 | 通过 | app/(app)/models/page.tsx:19；无页内PageHeader | 无新增违规 |
| H7 | 通过 | app/(app)/models/page.tsx:423；状态在状态列/模型卡身份中；权限/应用分类不着色 | 无新增违规 |
| L1 | 通过 | app/(app)/layout.tsx:1；原AppShell唯一宿主 | 无新增违规 |
| L2 | 通过 | app/(app)/models/page.tsx:70；不加根padding | 无新增违规 |
| L3 | 通过 | app/(app)/models/page.tsx:1；单条筛选搜索；模型为供应商工作台筛选 | 无新增违规 |
| L4 | 不适用 | app/(app)/models/page.tsx:35；无全页详情 | 无新增违规 |
| L5 | 不适用 | app/(app)/models/page.tsx:70；不是看板 | 无新增违规 |
| L6 | 通过 | components/model-form-dialog.tsx:178；原Kit字段、间距、弹窗；截图无新增密度偏差 | 无新增违规 |
| L7 | 通过 | app/(app)/models/page.tsx:1；截图首尾列及日期完整；名称列保留truncate；模型非表格不适用 | 无新增违规 |
| L8 | 通过 | app/(app)/models/page.tsx:1；表直接落stack，无额外装饰白卡；模型无DataTable | 无新增违规 |
| L9 | 通过 | app/(app)/models/page.tsx:423；模型卡使用Grid；其他列表无页面分栏；Modal字段两列属于清单微排版例外 | 无新增违规 |
| L10 | 通过 | components/app-shell.tsx:252；侧栏展开首屏截图可见四周gutter，内部滚动 | 无新增违规 |
| C1 | 通过 | app/(app)/models/page.tsx:28；Kit组件+既有Modal/toast | 无新增违规 |
| C2 | 通过 | app/(app)/models/page.tsx:1；列表DataTable；模型WorkspaceSplit/FolderNav/ResourceCard | 无新增违规 |
| C3 | 通过 | app/(app)/models/page.tsx:1；无sortable假排序 | 无新增违规 |
| C4 | 通过 | app/(app)/models/page.tsx:296；ConfirmationDialog有Modal宿主 | 无新增违规 |
| C5 | 通过 | app/(app)/models/page.tsx:423；状态/检测结果有中文文字 | 无新增违规 |
| C6 | 通过 | components/model-form-dialog.tsx:134；原保存动作真实落地；HTTP回执测试覆盖 | 无新增违规 |
| C7 | 通过 | components/model-form-dialog.tsx:200；原字段props未变；资源草稿只改变值 | 无新增违规 |
| C8 | 通过 | app/(app)/models/page.tsx:28；typecheck验证实际导出 | 无新增违规 |
| C9 | 通过 | app/(app)/models/page.tsx:1；名称按钮详情、操作列仅编辑删除；模型标题打开详情 | 无新增违规 |
| C10 | 不适用 | app/(app)/models/page.tsx:70；未使用详情指标卡 | 无新增违规 |
| V1 | 通过 | app/(app)/models/page.tsx:78；业务token；删除图标改fg-red | 无新增违规 |
| V2 | 通过 | components/model-form-dialog.tsx:182；保持统一accent | 无新增违规 |
| V3 | 通过 | app/(app)/models/page.tsx:16；原Solar图标 | 无新增违规 |
| V4 | 不适用 | app/(app)/models/page.tsx:70；无图表 | 无新增违规 |
| V5 | 通过 | app/(app)/models/page.tsx:336；Kit字号 | 无新增违规 |
| V6 | 通过 | app/(app)/models/page.tsx:1；角色/菜单状态soft；模型状态由ResourceCard；其他分类纯文本 | 无新增违规 |
| V7 | 通过 | app/(app)/models/page.tsx:430；名称及正文深色；说明grey700；截图核对 | 无新增违规 |
| F1 | 通过 | components/model-form-dialog.tsx:178；原表单受列表状态控制 | 无新增违规 |
| F2 | 通过 | app/(app)/models/page.tsx:22；助手确认后仍由页面确认删除 | 无新增违规 |
| F3 | 通过 | components/model-form-dialog.tsx:206；字段级错误保持 | 无新增违规 |
| F4 | 通过 | components/model-form-dialog.tsx:159；全站toast，无成功绿条 | 无新增违规 |
| F5 | 通过 | components/model-form-dialog.tsx:169；创建后原轻详情动线 | 无新增违规 |
| F6 | 通过 | app/(app)/models/page.tsx:5；未新增Drawer/Sheet；AskAi用core | 无新增违规 |
| D1 | 通过 | app/(app)/models/page.tsx:407；真实资源保留失败重试/加载/两类空态；应用同步本地存储无异步两态 | 无新增违规 |
| D2 | 不适用 | app/(app)/models/page.tsx:35；无全页详情 | 无新增违规 |
| D3 | 通过 | lib/models/service.ts:1；既有API/store/service+resource-db事务 | 无新增违规 |
| D4 | 通过 | lib/db/schema.ts:1；业务表与users分离；未改schema | 无新增违规 |
| D5 | 通过 | app/(app)/models/page.tsx:11；保留原筛选状态策略；新增指令不重置列表上下文 | 无新增违规 |
| D6 | 通过 | lib/agent/resource-fields.ts:1；严格公共字段拒绝apiKey；个人密码不进入聊天 | 无新增违规 |
| E1 | 通过 | components/model-form-dialog.tsx:2；page/form/store/service分工，公共接收逻辑在resource-agent | 无新增违规 |
| E2 | 通过 | app/api/models/route.ts:1；原鉴权、Zod、json响应与中文错误 | 无新增违规 |
| E3 | 通过 | components/resource-agent.tsx:1；共享5页接收与取消；resource-write统一4资源事务 | 无新增违规 |
| E4 | 通过 | app/(app)/models/page.tsx:1；use client且实际交互 | 无新增违规 |
| Q1 | 通过 | package.json:1；pnpm check通过，15条/ref历史警告 | 无新增违规 |
| Q2 | 通过 | tmp/ask-ai-panel/models-audit.png；Chrome侧栏点开主路径及原弹窗；角色真实模型保存闭环，应用预填后取消 | 无新增违规 |
| Q3 | 通过 | 本报告对照物及S/O/N/C；未套accounts全页详情 | 无新增违规 |
| Q4 | 通过 | Chrome控制台未见React错误或Next错误覆盖层；开发期间Fast Refresh全量reload警告保留说明 | 无新增违规 |

## 对照偏差与建议复核
- B页头保留受支持的组合API，理由为docs/forge-components.md:118明确要求唯一AskAi入口；core预设没有自定义入口插槽。未为满足variant而丢失真实业务按钮。建议后续统一清单与组件选型文档口径。
- 应用为现有浏览器设置，非服务器CRUD；回执仅是browserReported。未擅自添加应用服务端业务表。
- 不改原列表列宽/筛选持久化和模型视口断点策略；本次未做375/768等全尺寸重验，不宣称响应式验收。

## 修复与重验
- 删除图标统一fg token；历史确认单文案不再误称当前任务结束。
- 修复模型检测更新配置时间引起的过期误判，刷新模型页两条真实模型均显示正常。
- pnpm check通过；semantic/harness/navigation178项通过，0失败、0跳过。
- 截图以实际Chrome页面为依据；菜单/权限/模型弹窗未提交业务测试数据。角色测试数据按精确ID清理；应用草稿取消；个人设置取消。
- 控制台开发编辑导致Fast Refresh full reload警告，未见新增React错误。/ref15条历史颜色警告不属于本次模块。

## 清单反哺建议
统一H1预设API与全局AskAi组合入口的文档口径；未直接修改审计清单。
