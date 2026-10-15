# Forge Starter

这是一份用 Forge UI 搭管理后台的起点。它存在，是因为只拿着组件库从头搭后台时，每做一个项目就要重新决定登录、列表、详情和颜色；人和 Coding Agent 还容易各自再发明一套界面。这个仓库把已经定过的选择放在一起，让下一个后台从同一套壳开始。

它不是可以拿去卖的产品，也不是「克隆下来就有一家公司」的模板。

## 它解决谁的什么问题

你要做的是内部系统或运营后台，希望页面看起来像 Forge 自己的产品，并且希望同事或编程助手加一个模块时不要漂成另一套 UI。

组件、颜色和页面骨架有约定。账号管理是可以抄的重样板。Agent 的工作被拆成「先数据与接口，再页面，再对照清单审计」。这些事如果每次都靠临场发挥，后台会慢慢长得不像同一个产品。

## 适合谁

- 要用 `@forge-ui-official/core` 做 B 端或内部后台的人
- 接受 PostgreSQL，也接受「登录用户」和「业务数据」分表
- 希望 Agent 按仓库里的 skill 加模块，而不是一次把整套样板抄死

## 不适合谁

- 想换成 MUI、Ant Design 或一整套 shadcn 的项目。这里缺的能力记成 `FORGE-GAP`，不要悄悄手搓一套
- 还没准备数据库就想做完整的增删改查。`AUTH_MODE=demo` 只是登录不查用户表，业务表照样要 Postgres
- 需要开箱的 OAuth、SSO、审批流、订阅计费或消息中心
- 希望 Ask AI 自己改数据库。它能查、能提议；真正写入要回到页面原来的保存

## 取舍

这些是故意的，不是还没做完。

- **登录只有用户名或邮箱加密码。** 会话是 httpOnly cookie。邮件只走 SMTP，没有云邮件 SDK。重置链接只发到注册邮箱。
- **demo 是给开发和看界面用的。** 任意密码都能进。没写 `AUTH_MODE` 时开发环境就是 demo。生产进程会拒绝 demo，也会拒绝没有 `AUTH_SECRET` 的启动。确要做公开演示，设置 `ALLOW_INSECURE_AUTH=true`，并换一个独立库。
- **密钥至少 32 位。** 开发时 demo 可以不写，用的是仓库里那把内置演示密钥。写了但不够长，不会再悄悄退回去。
- **应用切换存在浏览器本地。** 外部系统的认证方式只是占位，不是真 SSO。
- **RBAC 是目录加一个角色字段，不是完整的身份系统。** 有角色、菜单、权限三个页面。侧栏能不能看见，要同时满足菜单配置、当前应用勾选，以及角色的 `:read`。没有把登录用户拖进角色的界面。`local` 模式下公开注册固定是只读，管理员要改 `users.role_code`。demo 里对得上的用户名走种子角色，其余用户名是超级管理员，方便试用，不要把它当成安全边界。
- **Ask AI 不会自己写库。** 读可以马上做。写入和删除先出确认，再填进页面自己的表单或删除确认。没接模型时，几条示范问题用本地规则回答。它不读仓库源码，也不生成页面。
- **结构变更有两条路。** 新环境、CI 和生产用 `pnpm db:migrate`。开发时对着自己的库改 schema，可以用 `pnpm db:push`，它不写迁移记录，生产默认拒绝执行。
- **没有 ESLint。** 提交前的机器检查是 `pnpm check`：TypeScript，加上一条规范绊线。绊线通过不等于页面审计做完了。

## 现在仓库里实际有什么

上一版 README 写过「没有 RBAC」。角色、菜单、权限和 `lib/rbac` 已经在仓库里，那句话作废。

| 有 | 边界 |
| --- | --- |
| 登录、注册、找回、重置；个人资料和改密 | 无 OAuth、社交登录 |
| 工作台，指标接的是业务账号 | 不是一份可配置的报表产品 |
| 账号管理：列表、表单弹窗、全页详情 | 样板。登录用户在 `users`，业务账号在 `admin_accounts`，不要混 |
| 角色、菜单、权限 | 见上面的取舍。菜单目录本身进不了侧栏 |
| 模型服务：供应商列表加模型卡片 | 密钥只留在服务端。Ask AI 优先用这里启用的模型，没有再用 `ASK_AI_LLM_*` |
| Ask AI harness | 任务可以暂停、恢复；人在页面上确认后才保存。见 [docs/ask-ai-harness.md](docs/ask-ai-harness.md) |
| 应用管理 | 浏览器本地登记。外部认证是占位 |
| Agent skills、`/ref` 参考页 | 参考页默认不进菜单。生产默认关闭 |

没有审批流、支付、订阅、积分、通知中心、IM、多租户。

## 快速开始

需要 Node.js 20.9 或更新、pnpm 10、Docker。也可以不用 Docker，自己准备 Postgres，把 `DATABASE_URL` 指过去。

```bash
cp .env.example .env
# 设一个 POSTGRES_PASSWORD，并把同样的密码写进 DATABASE_URL（特殊字符要做 URL 编码）
# 开发可保持 AUTH_MODE=demo。要真注册登录：AUTH_MODE=local，并换掉 AUTH_SECRET（至少 32 位）
docker compose up -d --wait
pnpm install
pnpm db:migrate
pnpm db:seed
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000)。

`pnpm db:migrate` 要在 `pnpm install` 之后。数据库刚起来就失败的话，等健康检查通过再跑一次；上面的 `--wait` 就是在等这件事。第二次执行会跳过已经应用的迁移。

demo 登录之后，账号管理、角色、模型这些页面仍然要库。没有 `DATABASE_URL`，这些 CRUD 做不了。

环境变量、种子角色和命令说明在 [docs/setup.md](docs/setup.md)。

## 文档

人和 Agent 不要从同一页读起。索引在 [docs/README.md](docs/README.md)。

| 谁 | 先读 |
| --- | --- |
| 人 | 本页，然后 [docs/setup.md](docs/setup.md)、[docs/product.md](docs/product.md) |
| Agent | [AGENTS.md](AGENTS.md)，然后它点名的那几份规范 |

`docs/history/` 是做过的审计和发布记录，不是当前规范。

## 许可证

[MIT](LICENSE)。版权人 forge-ui contributors，2026。

相关：[Forge UI](https://github.com/forge-ui/forge) · [Forge Design](https://github.com/forge-ui/forge-design-extension)
