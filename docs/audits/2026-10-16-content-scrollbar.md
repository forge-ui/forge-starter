# 内容壳滚动条审计（2026-10-16）
本审计只覆盖本次共享样式修复，不重验业务功能或替代用户验收。

## 对照物
角色：AppLayout内容壳（工作台dashboard作为复现宿主）；chrome沿用现有页头，不改业务骨架。主对照core AppLayout圆角内容面及内部overflow-auto；dashboard结构参照/ref/dashboard，AskAi参照core响应式panel。
范围：app/globals.css新增一条内容面overflow:hidden规则。

## 分层记录
| 层 | 实际结构与对照 | 判定 |
|---|---|---|
| S | 原工作台+并排AskAi，不新增容器 | 保持 |
| O | 原圆角内容面新增overflow:hidden，裁切内层滚动条超出圆角的部分 | 修复 |
| N | 原统计、图表、表格与内层滚动容器保持 | 无新增偏差 |
| C | 不改core组件、滚动条宽度、颜色或控件 | 保持 |

## 清单逐条
| ID | 判定 | 证据及理由 | 修复 |
|---|---|---|---|
| M1 | 不适用 | app/globals.css:68；本次仅修壳层overflow裁切，不涉及该项业务页面/菜单/表单/数据实现 | 无 |
| M2 | 不适用 | app/globals.css:68；本次仅修壳层overflow裁切，不涉及该项业务页面/菜单/表单/数据实现 | 无 |
| M3 | 不适用 | app/globals.css:68；本次仅修壳层overflow裁切，不涉及该项业务页面/菜单/表单/数据实现 | 无 |
| M4 | 不适用 | app/globals.css:68；本次仅修壳层overflow裁切，不涉及该项业务页面/菜单/表单/数据实现 | 无 |
| M5 | 不适用 | app/globals.css:68；本次仅修壳层overflow裁切，不涉及该项业务页面/菜单/表单/数据实现 | 无 |
| M6 | 不适用 | app/globals.css:68；本次仅修壳层overflow裁切，不涉及该项业务页面/菜单/表单/数据实现 | 无 |
| R1 | 不适用 | app/globals.css:68；本次仅修壳层overflow裁切，不涉及该项业务页面/菜单/表单/数据实现 | 无 |
| R2 | 不适用 | app/globals.css:68；本次仅修壳层overflow裁切，不涉及该项业务页面/菜单/表单/数据实现 | 无 |
| R3 | 不适用 | app/globals.css:68；本次仅修壳层overflow裁切，不涉及该项业务页面/菜单/表单/数据实现 | 无 |
| R4 | 不适用 | app/globals.css:68；本次仅修壳层overflow裁切，不涉及该项业务页面/菜单/表单/数据实现 | 无 |
| R5 | 不适用 | app/globals.css:68；本次仅修壳层overflow裁切，不涉及该项业务页面/菜单/表单/数据实现 | 无 |
| H1 | 不适用 | app/globals.css:68；本次仅修壳层overflow裁切，不涉及该项业务页面/菜单/表单/数据实现 | 无 |
| H2 | 不适用 | app/globals.css:68；本次仅修壳层overflow裁切，不涉及该项业务页面/菜单/表单/数据实现 | 无 |
| H3 | 不适用 | app/globals.css:68；本次仅修壳层overflow裁切，不涉及该项业务页面/菜单/表单/数据实现 | 无 |
| H4 | 不适用 | app/globals.css:68；本次仅修壳层overflow裁切，不涉及该项业务页面/菜单/表单/数据实现 | 无 |
| H5 | 不适用 | app/globals.css:68；本次仅修壳层overflow裁切，不涉及该项业务页面/菜单/表单/数据实现 | 无 |
| H6 | 不适用 | app/globals.css:68；本次仅修壳层overflow裁切，不涉及该项业务页面/菜单/表单/数据实现 | 无 |
| H7 | 不适用 | app/globals.css:68；本次仅修壳层overflow裁切，不涉及该项业务页面/菜单/表单/数据实现 | 无 |
| L1 | 通过 | app/globals.css:68；仍为Kit AppLayout唯一壳 | 无 |
| L2 | 通过 | app/globals.css:68；未新增页面padding或根容器 | 无 |
| L3 | 不适用 | app/globals.css:68；本次仅修壳层overflow裁切，不涉及该项业务页面/菜单/表单/数据实现 | 无 |
| L4 | 不适用 | app/globals.css:68；本次仅修壳层overflow裁切，不涉及该项业务页面/菜单/表单/数据实现 | 无 |
| L5 | 不适用 | app/globals.css:68；本次仅修壳层overflow裁切，不涉及该项业务页面/菜单/表单/数据实现 | 无 |
| L6 | 通过 | app/globals.css:68；圆角与边线保留Kit原token | 无 |
| L7 | 通过 | app/globals.css:68；截图覆盖工作台最近账号表，未改列定义；原姓名单元格截断为既有行为 | 无 |
| L8 | 通过 | app/globals.css:68；本次只改外壳裁切，原工作台表格区未变；不把既有结构作为新页范例 | 无 |
| L9 | 不适用 | app/globals.css:68；本次仅修壳层overflow裁切，不涉及该项业务页面/菜单/表单/数据实现 | 无 |
| L10 | 通过 | app/globals.css:68；滚到底时scrollTop=830=max，window.scrollY=0；首屏底gutter持续可见 | 无 |
| C1 | 通过 | app/globals.css:68；使用原Kit内容壳，不新增控件 | 无 |
| C2 | 不适用 | app/globals.css:68；本次仅修壳层overflow裁切，不涉及该项业务页面/菜单/表单/数据实现 | 无 |
| C3 | 不适用 | app/globals.css:68；本次仅修壳层overflow裁切，不涉及该项业务页面/菜单/表单/数据实现 | 无 |
| C4 | 不适用 | app/globals.css:68；本次仅修壳层overflow裁切，不涉及该项业务页面/菜单/表单/数据实现 | 无 |
| C5 | 不适用 | app/globals.css:68；本次仅修壳层overflow裁切，不涉及该项业务页面/菜单/表单/数据实现 | 无 |
| C6 | 通过 | app/globals.css:68；实际滚动验证仍可到达底部 | 无 |
| C7 | 通过 | app/globals.css:68；未更改Kit props | 无 |
| C8 | 通过 | app/globals.css:68；未新增core import | 无 |
| C9 | 不适用 | app/globals.css:68；本次仅修壳层overflow裁切，不涉及该项业务页面/菜单/表单/数据实现 | 无 |
| C10 | 不适用 | app/globals.css:68；本次仅修壳层overflow裁切，不涉及该项业务页面/菜单/表单/数据实现 | 无 |
| V1 | 通过 | app/globals.css:68；不引入颜色值 | 无 |
| V2 | 不适用 | app/globals.css:68；本次仅修壳层overflow裁切，不涉及该项业务页面/菜单/表单/数据实现 | 无 |
| V3 | 不适用 | app/globals.css:68；本次仅修壳层overflow裁切，不涉及该项业务页面/菜单/表单/数据实现 | 无 |
| V4 | 不适用 | app/globals.css:68；本次仅修壳层overflow裁切，不涉及该项业务页面/菜单/表单/数据实现 | 无 |
| V5 | 通过 | app/globals.css:68；字号未改 | 无 |
| V6 | 不适用 | app/globals.css:68；本次仅修壳层overflow裁切，不涉及该项业务页面/菜单/表单/数据实现 | 无 |
| V7 | 通过 | app/globals.css:68；文字样式未改 | 无 |
| F1 | 不适用 | app/globals.css:68；本次仅修壳层overflow裁切，不涉及该项业务页面/菜单/表单/数据实现 | 无 |
| F2 | 不适用 | app/globals.css:68；本次仅修壳层overflow裁切，不涉及该项业务页面/菜单/表单/数据实现 | 无 |
| F3 | 不适用 | app/globals.css:68；本次仅修壳层overflow裁切，不涉及该项业务页面/菜单/表单/数据实现 | 无 |
| F4 | 不适用 | app/globals.css:68；本次仅修壳层overflow裁切，不涉及该项业务页面/菜单/表单/数据实现 | 无 |
| F5 | 不适用 | app/globals.css:68；本次仅修壳层overflow裁切，不涉及该项业务页面/菜单/表单/数据实现 | 无 |
| F6 | 不适用 | app/globals.css:68；本次仅修壳层overflow裁切，不涉及该项业务页面/菜单/表单/数据实现 | 无 |
| D1 | 不适用 | app/globals.css:68；本次仅修壳层overflow裁切，不涉及该项业务页面/菜单/表单/数据实现 | 无 |
| D2 | 不适用 | app/globals.css:68；本次仅修壳层overflow裁切，不涉及该项业务页面/菜单/表单/数据实现 | 无 |
| D3 | 不适用 | app/globals.css:68；本次仅修壳层overflow裁切，不涉及该项业务页面/菜单/表单/数据实现 | 无 |
| D4 | 不适用 | app/globals.css:68；本次仅修壳层overflow裁切，不涉及该项业务页面/菜单/表单/数据实现 | 无 |
| D5 | 不适用 | app/globals.css:68；本次仅修壳层overflow裁切，不涉及该项业务页面/菜单/表单/数据实现 | 无 |
| D6 | 不适用 | app/globals.css:68；本次仅修壳层overflow裁切，不涉及该项业务页面/菜单/表单/数据实现 | 无 |
| E1 | 不适用 | app/globals.css:68；本次仅修壳层overflow裁切，不涉及该项业务页面/菜单/表单/数据实现 | 无 |
| E2 | 不适用 | app/globals.css:68；本次仅修壳层overflow裁切，不涉及该项业务页面/菜单/表单/数据实现 | 无 |
| E3 | 不适用 | app/globals.css:68；本次仅修壳层overflow裁切，不涉及该项业务页面/菜单/表单/数据实现 | 无 |
| E4 | 不适用 | app/globals.css:68；本次仅修壳层overflow裁切，不涉及该项业务页面/菜单/表单/数据实现 | 无 |
| Q1 | 通过 | app/globals.css:68；pnpm check通过（15条历史/ref警告） | 无 |
| Q2 | 通过 | app/globals.css:68；Chrome3168工作台开启AskAi并排，实际滚到底并截图 | 无 |
| Q3 | 通过 | app/globals.css:68；对照Kit AppLayout原内容面，保留外层圆角+内层滚动 | 无 |
| Q4 | 通过 | app/globals.css:68；浏览器控制台检查，无新增React错误 | 无 |

## 结论与重验
圆角外沿被内层原生滚动条覆盖，补内容面裁切；未改旁路core仓库。Chrome独立构建3168（3002使用生产构建后存在旧CSS）已验证computed overflow为hidden、AskAi并排开启、内容滚动到底且window不滚。截图tmp/ask-ai-panel/scrollbar-top-fixed.png及scrollbar-bottom-fixed.png。pnpm check通过。原工作台样板债不在本次变更范围；本次不宣称全业务页视觉验收。

## 对照偏差 / 建议复核 / 清单反哺
无新增结构偏差。内容壳有圆角时应裁切其内层滚动条，清单无需新增条目。
