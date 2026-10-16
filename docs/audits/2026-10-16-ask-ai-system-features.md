# Ask AI 全系统功能认知与页面入口审计（2026-10-16）

范围：Ask AI 系统知识清单、模型提示、权限工具目录、导航解析和既有表单入口。业务页面、表单、数据写入接口和core均未修改。本报告只审规范符合性，不替代用户验收。

## 对照物

| 页面 | 角色 | chrome | 主对照 / case |
|---|---|---|---|
| Ask AI | 壳辅助面板 | 保持宿主页头 | Kit AskAi / chat-input-bar |
| 角色入口 | collection + form-modal | B | 既有roles/page.tsx + role-form-dialog.tsx；toolbar/modal/input-field |
| 应用入口 | collection + form-modal | B | 既有settings/apps/page.tsx + app-form-dialog.tsx；toolbar/modal/input-field |

## 分层记录

| 层 | 本层结构与对照 | 判定 |
|---|---|---|
| S | 列表页头→工具带→DataTable→分页保持；助手调用已存在的query入口 | 无结构变化 |
| O | AppShell / AppLayout / AskAi仍为原唯一宿主 | 无第二套壳或padding |
| N | 原列表与原Modal，没有新装饰白卡、栅格或业务控件 | 无新增规范偏差 |
| C | 原Form使用Kit字段和本仓Modal；本次仅改变何时打开 | 未手搓组件或图标；字段、状态颜色未改 |

## 结论

范围内未发现规范违规。新的页面入口不写数据库，只证明导航到达，不宣称创建已保存。没有为审计扩改既有业务页面或已知样板债。

## 清单逐条核查

| ID | 判定 | 证据（文件:行）及理由 | 修复 |
|---|---|---|---|
| M1 | 不适用 | lib/agent/page-entry-tools.ts:16；本次仅接入知识和既有页面入口，未创建或修改业务页面结构、组件、菜单或样式 | 无 |
| M2 | 不适用 | lib/agent/page-entry-tools.ts:16；本次仅接入知识和既有页面入口，未创建或修改业务页面结构、组件、菜单或样式 | 无 |
| M3 | 不适用 | lib/agent/page-entry-tools.ts:16；本次仅接入知识和既有页面入口，未创建或修改业务页面结构、组件、菜单或样式 | 无 |
| M4 | 不适用 | lib/agent/page-entry-tools.ts:16；本次仅接入知识和既有页面入口，未创建或修改业务页面结构、组件、菜单或样式 | 无 |
| M5 | 不适用 | lib/agent/page-entry-tools.ts:16；本次仅接入知识和既有页面入口，未创建或修改业务页面结构、组件、菜单或样式 | 无 |
| M6 | 不适用 | lib/agent/page-entry-tools.ts:16；本次仅接入知识和既有页面入口，未创建或修改业务页面结构、组件、菜单或样式 | 无 |
| R1 | 不适用 | lib/agent/page-entry-tools.ts:16；本次仅接入知识和既有页面入口，未创建或修改业务页面结构、组件、菜单或样式 | 无 |
| R2 | 不适用 | lib/agent/page-entry-tools.ts:16；本次仅接入知识和既有页面入口，未创建或修改业务页面结构、组件、菜单或样式 | 无 |
| R3 | 不适用 | lib/agent/page-entry-tools.ts:16；本次仅接入知识和既有页面入口，未创建或修改业务页面结构、组件、菜单或样式 | 无 |
| R4 | 不适用 | lib/agent/page-entry-tools.ts:16；本次仅接入知识和既有页面入口，未创建或修改业务页面结构、组件、菜单或样式 | 无 |
| R5 | 不适用 | lib/agent/page-entry-tools.ts:16；本次仅接入知识和既有页面入口，未创建或修改业务页面结构、组件、菜单或样式 | 无 |
| H1 | 不适用 | lib/agent/page-entry-tools.ts:16；本次仅接入知识和既有页面入口，未创建或修改业务页面结构、组件、菜单或样式 | 无 |
| H2 | 不适用 | lib/agent/page-entry-tools.ts:16；本次仅接入知识和既有页面入口，未创建或修改业务页面结构、组件、菜单或样式 | 无 |
| H3 | 不适用 | lib/agent/page-entry-tools.ts:16；本次仅接入知识和既有页面入口，未创建或修改业务页面结构、组件、菜单或样式 | 无 |
| H4 | 不适用 | lib/agent/page-entry-tools.ts:16；本次仅接入知识和既有页面入口，未创建或修改业务页面结构、组件、菜单或样式 | 无 |
| H5 | 不适用 | lib/agent/page-entry-tools.ts:16；本次仅接入知识和既有页面入口，未创建或修改业务页面结构、组件、菜单或样式 | 无 |
| H6 | 不适用 | lib/agent/page-entry-tools.ts:16；本次仅接入知识和既有页面入口，未创建或修改业务页面结构、组件、菜单或样式 | 无 |
| H7 | 不适用 | lib/agent/page-entry-tools.ts:16；本次仅接入知识和既有页面入口，未创建或修改业务页面结构、组件、菜单或样式 | 无 |
| L1 | 不适用 | lib/agent/page-entry-tools.ts:16；本次仅接入知识和既有页面入口，未创建或修改业务页面结构、组件、菜单或样式 | 无 |
| L2 | 不适用 | lib/agent/page-entry-tools.ts:16；本次仅接入知识和既有页面入口，未创建或修改业务页面结构、组件、菜单或样式 | 无 |
| L3 | 不适用 | lib/agent/page-entry-tools.ts:16；本次仅接入知识和既有页面入口，未创建或修改业务页面结构、组件、菜单或样式 | 无 |
| L4 | 不适用 | lib/agent/page-entry-tools.ts:16；本次仅接入知识和既有页面入口，未创建或修改业务页面结构、组件、菜单或样式 | 无 |
| L5 | 不适用 | lib/agent/page-entry-tools.ts:16；本次仅接入知识和既有页面入口，未创建或修改业务页面结构、组件、菜单或样式 | 无 |
| L6 | 不适用 | lib/agent/page-entry-tools.ts:16；本次仅接入知识和既有页面入口，未创建或修改业务页面结构、组件、菜单或样式 | 无 |
| L7 | 不适用 | lib/agent/page-entry-tools.ts:16；本次仅接入知识和既有页面入口，未创建或修改业务页面结构、组件、菜单或样式 | 无 |
| L8 | 不适用 | lib/agent/page-entry-tools.ts:16；本次仅接入知识和既有页面入口，未创建或修改业务页面结构、组件、菜单或样式 | 无 |
| L9 | 不适用 | lib/agent/page-entry-tools.ts:16；本次仅接入知识和既有页面入口，未创建或修改业务页面结构、组件、菜单或样式 | 无 |
| L10 | 不适用 | lib/agent/page-entry-tools.ts:16；本次仅接入知识和既有页面入口，未创建或修改业务页面结构、组件、菜单或样式 | 无 |
| C1 | 不适用 | lib/agent/page-entry-tools.ts:16；本次仅接入知识和既有页面入口，未创建或修改业务页面结构、组件、菜单或样式 | 无 |
| C2 | 不适用 | lib/agent/page-entry-tools.ts:16；本次仅接入知识和既有页面入口，未创建或修改业务页面结构、组件、菜单或样式 | 无 |
| C3 | 不适用 | lib/agent/page-entry-tools.ts:16；本次仅接入知识和既有页面入口，未创建或修改业务页面结构、组件、菜单或样式 | 无 |
| C4 | 不适用 | lib/agent/page-entry-tools.ts:16；本次仅接入知识和既有页面入口，未创建或修改业务页面结构、组件、菜单或样式 | 无 |
| C5 | 不适用 | lib/agent/page-entry-tools.ts:16；本次仅接入知识和既有页面入口，未创建或修改业务页面结构、组件、菜单或样式 | 无 |
| C6 | 通过 | lib/agent/page-entry-tools.ts:22；入口实际返回白名单导航；真实模型已打开角色及应用新建表单 | 无 |
| C7 | 通过 | lib/agent/navigation.ts:10；仅已实现的create/id/edit query，原页面消费后打开既有Modal | 无 |
| C8 | 不适用 | lib/agent/page-entry-tools.ts:16；本次仅接入知识和既有页面入口，未创建或修改业务页面结构、组件、菜单或样式 | 无 |
| C9 | 不适用 | lib/agent/page-entry-tools.ts:16；本次仅接入知识和既有页面入口，未创建或修改业务页面结构、组件、菜单或样式 | 无 |
| C10 | 不适用 | lib/agent/page-entry-tools.ts:16；本次仅接入知识和既有页面入口，未创建或修改业务页面结构、组件、菜单或样式 | 无 |
| V1 | 不适用 | lib/agent/page-entry-tools.ts:16；本次仅接入知识和既有页面入口，未创建或修改业务页面结构、组件、菜单或样式 | 无 |
| V2 | 不适用 | lib/agent/page-entry-tools.ts:16；本次仅接入知识和既有页面入口，未创建或修改业务页面结构、组件、菜单或样式 | 无 |
| V3 | 不适用 | lib/agent/page-entry-tools.ts:16；本次仅接入知识和既有页面入口，未创建或修改业务页面结构、组件、菜单或样式 | 无 |
| V4 | 不适用 | lib/agent/page-entry-tools.ts:16；本次仅接入知识和既有页面入口，未创建或修改业务页面结构、组件、菜单或样式 | 无 |
| V5 | 不适用 | lib/agent/page-entry-tools.ts:16；本次仅接入知识和既有页面入口，未创建或修改业务页面结构、组件、菜单或样式 | 无 |
| V6 | 不适用 | lib/agent/page-entry-tools.ts:16；本次仅接入知识和既有页面入口，未创建或修改业务页面结构、组件、菜单或样式 | 无 |
| V7 | 不适用 | lib/agent/page-entry-tools.ts:16；本次仅接入知识和既有页面入口，未创建或修改业务页面结构、组件、菜单或样式 | 无 |
| F1 | 不适用 | lib/agent/page-entry-tools.ts:16；本次仅接入知识和既有页面入口，未创建或修改业务页面结构、组件、菜单或样式 | 无 |
| F2 | 通过 | lib/agent/page-entry-tools.ts:16；不新增删除执行；角色/应用测试取消，未保存或删除 | 无 |
| F3 | 不适用 | lib/agent/page-entry-tools.ts:16；本次仅接入知识和既有页面入口，未创建或修改业务页面结构、组件、菜单或样式 | 无 |
| F4 | 不适用 | lib/agent/page-entry-tools.ts:16；本次仅接入知识和既有页面入口，未创建或修改业务页面结构、组件、菜单或样式 | 无 |
| F5 | 不适用 | lib/agent/page-entry-tools.ts:16；本次仅接入知识和既有页面入口，未创建或修改业务页面结构、组件、菜单或样式 | 无 |
| F6 | 通过 | lib/agent/page-entry-tools.ts:24；复用既有Modal入口，不引入Drawer/Sheet | 无 |
| D1 | 不适用 | lib/agent/page-entry-tools.ts:16；本次仅接入知识和既有页面入口，未创建或修改业务页面结构、组件、菜单或样式 | 无 |
| D2 | 不适用 | lib/agent/page-entry-tools.ts:16；本次仅接入知识和既有页面入口，未创建或修改业务页面结构、组件、菜单或样式 | 无 |
| D3 | 通过 | lib/agent/page-entry-tools.ts:36；详情/编辑查真实service目标，不伪造记录或内存CRUD | 无 |
| D4 | 不适用 | lib/agent/page-entry-tools.ts:16；本次仅接入知识和既有页面入口，未创建或修改业务页面结构、组件、菜单或样式 | 无 |
| D5 | 不适用 | lib/agent/page-entry-tools.ts:16；本次仅接入知识和既有页面入口，未创建或修改业务页面结构、组件、菜单或样式 | 无 |
| D6 | 通过 | lib/agent/system-features.ts:39；模型Key及密码只指引页面输入，不进入助手工具参数 | 无 |
| E1 | 通过 | lib/agent/system-features.ts:4；功能声明、page-entry-tools和已有registry分工；未堆进业务page | 无 |
| E2 | 不适用 | lib/agent/page-entry-tools.ts:16；本次仅接入知识和既有页面入口，未创建或修改业务页面结构、组件、菜单或样式 | 无 |
| E3 | 通过 | lib/agent/page-entry-tools.ts:17；共享入口生成逻辑和统一权限过滤 | 无 |
| E4 | 不适用 | lib/agent/page-entry-tools.ts:16；本次仅接入知识和既有页面入口，未创建或修改业务页面结构、组件、菜单或样式 | 无 |
| Q1 | 通过 | package.json:15；pnpm check通过（既有/ref警告15条） | 无 |
| Q2 | 通过 | Chrome /roles/与/settings/apps/；实际模型发送创建请求并打开Modal，截图留档 | 无 |
| Q3 | 通过 | 本报告对照物及S/O/N/C记录；复用原页面，不更换chrome | 无 |
| Q4 | 通过 | Chrome控制台warn/error为空，无Next错误覆盖层 | 无 |

## 对照偏差

无视觉结构差异；新增的是助手到既有页面的入口。没有修改对照页及规范清单。

## 建议复核

新工具只打开表单，不自动预填或保存。用户最终体验验收待执行。现有/ref颜色警告15条为范围外债务。

## 清单反哺建议

无。

## 重验记录

- 真实模型：用户原句“帮我创建一个角色”打开新建角色Modal；名称、编码、状态、权限、说明均可见；取消未保存。
- 真实模型：“帮我新建一个应用”从角色页导航到应用管理并打开新建应用Modal；取消未保存。
- 真实模型：系统功能问答覆盖7个菜单模块，以及个人资料、密码、通知偏好和模型服务；不再以未登记为由否认页面能力。
- 导航/知识/意图专项测试53项通过；扩展harness/navigation测试77通过，15项数据库集成用例因环境门槛跳过；没有把跳过计为通过。
- pnpm check通过；git diff --check通过；Chrome warn/error为空。
- 截图：tmp/ask-ai-panel/role-create-entry.png、app-create-entry.png、system-features.png。

## 账号办理链路补验

- 用户反馈原句“帮我随便添加一个账号”调用准备工具后仍退回页面指引。定位为本地 `.env` 未启用 `SEMANTIC_ENABLED`，触发既有写入链路关闭保护；此前角色与应用的入口验证未覆盖这条链路。
- 启用前只读检查确认 `semantic_operations`、`harness_runs` 及账号 revision、操作的 harness 关联列已存在；无需迁移。仅在本地忽略的 `.env` 添加 `SEMANTIC_ENABLED=true`，保留关闭状态的保护逻辑。
- 复用 Chrome，以同一句请求重新发送，实际显示对话内“新建账号”表单及“确认并带入页面”按钮，包含用户名、姓名、邮箱、手机、角色、部门、状态；不再返回无法办理。
- 验证止于可填写的确认表单，未创建账号，未验证保存后的回执与续办，不据此宣称完整创建闭环已验收。
- 截图：tmp/ask-ai-panel/account-create-form-enabled.png。
