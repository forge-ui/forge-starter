## 选型

- 聚合卡片展示列表数据 → `ListGroup`
- 纯列表无卡外框 → 直接用一串 `ListItem`
- 带 tab 切换数据源 → `tabs` + `activeTab`

## 看板密度

看板使用 `density="compact"`，不要复制私有 `!important` 覆盖。省略 density 保持默认外观；完整九类卡片对照见 `/cases/dashboard-kit`。公开类型 `CardDensity` 与对应 `*Props` 可从 core 导入。
