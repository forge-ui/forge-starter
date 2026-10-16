# 审计报告：Ask AI 个人设置入口与共享面板（2026-10-16）
本审计仅覆盖规范，不代表用户验收。

## 对照物
角色settings/form-modal、壳辅助面板；chrome保持宿主页头B；对照既有头像设置弹窗与/ref/settings、/ref/agent；case modal/input-field/ask-ai。

## 分层记录
| 层 | 实际结构与对照 | 判定 |
|---|---|---|
| S | 原业务页保持；AskAi请求打开原设置Modal | 无新增页面骨架 |
| O | 唯一AppLayout、Kit AskAi、原Modal | 无重复壳 |
| N | 原设置字段和底部按钮；对话仍用Agent组件 | 无新增装饰卡 |
| C | Kit控件/fg token；仅打开，密码留给用户页面填写 | 通过 |

## 清单逐项
| ID | 判定 | 证据 | 修复 |
|---|---|---|---|
| M1 | 不适用 | components/app-shell.tsx:83；本模块仅增加本人既有弹窗接收与AskAi反馈文案，无此类列表/菜单/详情/提交改动 | 无 |
| M2 | 不适用 | components/app-shell.tsx:83；本模块仅增加本人既有弹窗接收与AskAi反馈文案，无此类列表/菜单/详情/提交改动 | 无 |
| M3 | 不适用 | components/app-shell.tsx:83；本模块仅增加本人既有弹窗接收与AskAi反馈文案，无此类列表/菜单/详情/提交改动 | 无 |
| M4 | 不适用 | components/app-shell.tsx:83；本模块仅增加本人既有弹窗接收与AskAi反馈文案，无此类列表/菜单/详情/提交改动 | 无 |
| M5 | 通过 | lib/agent/personal-tools.ts:1；本人设置仍走原头像弹窗，不新增主菜单 | 无 |
| M6 | 不适用 | components/app-shell.tsx:83；本模块仅增加本人既有弹窗接收与AskAi反馈文案，无此类列表/菜单/详情/提交改动 | 无 |
| R1 | 通过 | components/app-shell.tsx:83；settings原弹窗/AskAi壳辅助面板 | 无 |
| R2 | 不适用 | components/app-shell.tsx:83；本模块仅增加本人既有弹窗接收与AskAi反馈文案，无此类列表/菜单/详情/提交改动 | 无 |
| R3 | 通过 | components/settings-account-dialog.tsx:1；沿用原Modal | 无 |
| R4 | 不适用 | components/app-shell.tsx:83；本模块仅增加本人既有弹窗接收与AskAi反馈文案，无此类列表/菜单/详情/提交改动 | 无 |
| R5 | 不适用 | components/app-shell.tsx:83；本模块仅增加本人既有弹窗接收与AskAi反馈文案，无此类列表/菜单/详情/提交改动 | 无 |
| H1 | 不适用 | components/app-shell.tsx:83；本模块仅增加本人既有弹窗接收与AskAi反馈文案，无此类列表/菜单/详情/提交改动 | 无 |
| H2 | 不适用 | components/app-shell.tsx:83；本模块仅增加本人既有弹窗接收与AskAi反馈文案，无此类列表/菜单/详情/提交改动 | 无 |
| H3 | 不适用 | components/app-shell.tsx:83；本模块仅增加本人既有弹窗接收与AskAi反馈文案，无此类列表/菜单/详情/提交改动 | 无 |
| H4 | 不适用 | components/app-shell.tsx:83；本模块仅增加本人既有弹窗接收与AskAi反馈文案，无此类列表/菜单/详情/提交改动 | 无 |
| H5 | 不适用 | components/app-shell.tsx:83；本模块仅增加本人既有弹窗接收与AskAi反馈文案，无此类列表/菜单/详情/提交改动 | 无 |
| H6 | 通过 | components/ask-ai-entry.tsx:1；Kit AskAi挂原页头，不建第二套壳 | 无 |
| H7 | 不适用 | components/app-shell.tsx:83；本模块仅增加本人既有弹窗接收与AskAi反馈文案，无此类列表/菜单/详情/提交改动 | 无 |
| L1 | 通过 | components/app-shell.tsx:252；原AppLayout | 无 |
| L2 | 通过 | components/ask-ai-entry.tsx:1；原content/composer槽 | 无 |
| L3 | 不适用 | components/app-shell.tsx:83；本模块仅增加本人既有弹窗接收与AskAi反馈文案，无此类列表/菜单/详情/提交改动 | 无 |
| L4 | 不适用 | components/app-shell.tsx:83；本模块仅增加本人既有弹窗接收与AskAi反馈文案，无此类列表/菜单/详情/提交改动 | 无 |
| L5 | 不适用 | components/app-shell.tsx:83；本模块仅增加本人既有弹窗接收与AskAi反馈文案，无此类列表/菜单/详情/提交改动 | 无 |
| L6 | 通过 | tmp/ask-ai-panel/personal-settings-audit.png；原Kit弹窗和输入宽度 | 无 |
| L7 | 不适用 | components/app-shell.tsx:83；本模块仅增加本人既有弹窗接收与AskAi反馈文案，无此类列表/菜单/详情/提交改动 | 无 |
| L8 | 不适用 | components/app-shell.tsx:83；本模块仅增加本人既有弹窗接收与AskAi反馈文案，无此类列表/菜单/详情/提交改动 | 无 |
| L9 | 不适用 | components/app-shell.tsx:83；本模块仅增加本人既有弹窗接收与AskAi反馈文案，无此类列表/菜单/详情/提交改动 | 无 |
| L10 | 通过 | tmp/ask-ai-panel/personal-settings-audit.png；首屏四周gutter | 无 |
| C1 | 通过 | components/ask-ai-entry.tsx:1；core AskAi/ChatInputBar/Agent组件 | 无 |
| C2 | 不适用 | components/app-shell.tsx:83；本模块仅增加本人既有弹窗接收与AskAi反馈文案，无此类列表/菜单/详情/提交改动 | 无 |
| C3 | 不适用 | components/app-shell.tsx:83；本模块仅增加本人既有弹窗接收与AskAi反馈文案，无此类列表/菜单/详情/提交改动 | 无 |
| C4 | 不适用 | components/app-shell.tsx:83；本模块仅增加本人既有弹窗接收与AskAi反馈文案，无此类列表/菜单/详情/提交改动 | 无 |
| C5 | 不适用 | components/app-shell.tsx:83；本模块仅增加本人既有弹窗接收与AskAi反馈文案，无此类列表/菜单/详情/提交改动 | 无 |
| C6 | 通过 | components/app-shell.tsx:86；真实接收personal.open并发页面确认 | 无 |
| C7 | 通过 | components/ask-ai-entry.tsx:1；仍用已发布core props | 无 |
| C8 | 通过 | components/ask-ai-transcript.tsx:1；pnpm typecheck核实导出 | 无 |
| C9 | 不适用 | components/app-shell.tsx:83；本模块仅增加本人既有弹窗接收与AskAi反馈文案，无此类列表/菜单/详情/提交改动 | 无 |
| C10 | 不适用 | components/app-shell.tsx:83；本模块仅增加本人既有弹窗接收与AskAi反馈文案，无此类列表/菜单/详情/提交改动 | 无 |
| V1 | 通过 | components/ask-ai-transcript.tsx:1；fg token，历史确认提示只改文案 | 无 |
| V2 | 通过 | components/ask-ai-entry.tsx:1；沿用accent | 无 |
| V3 | 不适用 | components/app-shell.tsx:83；本模块仅增加本人既有弹窗接收与AskAi反馈文案，无此类列表/菜单/详情/提交改动 | 无 |
| V4 | 不适用 | components/app-shell.tsx:83；本模块仅增加本人既有弹窗接收与AskAi反馈文案，无此类列表/菜单/详情/提交改动 | 无 |
| V5 | 通过 | tmp/ask-ai-panel/personal-settings-audit.png；原标题字号 | 无 |
| V6 | 不适用 | components/app-shell.tsx:83；本模块仅增加本人既有弹窗接收与AskAi反馈文案，无此类列表/菜单/详情/提交改动 | 无 |
| V7 | 通过 | components/ask-ai-transcript.tsx:1；正文/状态提示保持原语义层级 | 无 |
| F1 | 通过 | components/settings-account-dialog.tsx:1；复用原Modal/表单 | 无 |
| F2 | 不适用 | components/app-shell.tsx:83；本模块仅增加本人既有弹窗接收与AskAi反馈文案，无此类列表/菜单/详情/提交改动 | 无 |
| F3 | 通过 | components/settings-account-dialog.tsx:1；保留原字段级校验 | 无 |
| F4 | 通过 | components/app-shell.tsx:1；原全局toast宿主 | 无 |
| F5 | 不适用 | components/app-shell.tsx:83；本模块仅增加本人既有弹窗接收与AskAi反馈文案，无此类列表/菜单/详情/提交改动 | 无 |
| F6 | 通过 | components/ask-ai-entry.tsx:1；core面板/全屏，无自研Drawer | 无 |
| D1 | 不适用 | components/app-shell.tsx:83；本模块仅增加本人既有弹窗接收与AskAi反馈文案，无此类列表/菜单/详情/提交改动 | 无 |
| D2 | 不适用 | components/app-shell.tsx:83；本模块仅增加本人既有弹窗接收与AskAi反馈文案，无此类列表/菜单/详情/提交改动 | 无 |
| D3 | 通过 | lib/agent/personal-tools.ts:1；仅打开本人弹窗，未在聊天代存资料 | 无 |
| D4 | 不适用 | components/app-shell.tsx:83；本模块仅增加本人既有弹窗接收与AskAi反馈文案，无此类列表/菜单/详情/提交改动 | 无 |
| D5 | 不适用 | components/app-shell.tsx:83；本模块仅增加本人既有弹窗接收与AskAi反馈文案，无此类列表/菜单/详情/提交改动 | 无 |
| D6 | 通过 | lib/agent/personal-tools.ts:1；只kind枚举，不传密码/邮箱/密钥 | 无 |
| E1 | 通过 | components/resource-agent.tsx:1；页面接收复用，个人壳入口单独处理 | 无 |
| E2 | 不适用 | components/app-shell.tsx:83；本模块仅增加本人既有弹窗接收与AskAi反馈文案，无此类列表/菜单/详情/提交改动 | 无 |
| E3 | 通过 | components/resource-agent.tsx:1；5页共享的接收取消逻辑 | 无 |
| E4 | 通过 | components/app-shell.tsx:1；use client与事件effect | 无 |
| Q1 | 通过 | package.json:1；pnpm check通过 | 无 |
| Q2 | 通过 | tmp/ask-ai-panel/personal-settings-audit.png；真实模型通知请求打开原设置弹窗，取消未保存 | 无 |
| Q3 | 通过 | docs/forge-components.md:118；全局保活AskAi与原头像Modal | 无 |
| Q4 | 通过 | Chrome控制台无React error/Next overlay，仅开发full reload警告 | 无 |

## 对照偏差 / 建议复核
无结构偏差；资料与通知仍由用户在原页面保存，本次未代改。密码表单仅支持打开，未输入密码。个人工具标题已改为中文“个人设置”。

## 修复与重验
真实模型“打开我的通知偏好设置”已打开系统设置原Modal；截图personal-settings-audit.png；取消未修改。历史确认提示不再把任务误称结束。pnpm check及178项semantic/harness/navigation通过；开发Full Refresh警告记录保留，无新增React错误。新对话快捷建议仍可见，见实际AX观察。

## 清单反哺建议
与各业务模块报告相同，统一全局AskAi入口和H1组合接口口径。
