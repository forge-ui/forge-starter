## 选型

- 账户 / 钱包主卡 → `BalanceCard`
- 支付卡展示（借记 / 信用） → `DebitCard` / `CreditCard`
- 纯金额指标 → `StatCard`（`labelVariant="value"`）

## 看板密度

看板使用 `density="compact"`，不要复制私有 `!important` 覆盖。省略 density 保持默认外观；完整九类卡片对照见 `/cases/dashboard-kit`。公开类型 `CardDensity` 与对应 `*Props` 可从 core 导入。
