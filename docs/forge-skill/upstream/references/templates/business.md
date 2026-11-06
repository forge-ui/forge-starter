# 业务模板 — templates/ecommerce

电商后台参考骨架，以下5个模块；具体列表/详情/新建路径必须用脚本枚举，不能假设每个模块完全相同：

| 模块 | 路径 |
|---|---|
| categories | `src/app/templates/(dashboard)/ecommerce/categories/` |
| customers | `src/app/templates/(dashboard)/ecommerce/customers/` |
| orders | `src/app/templates/(dashboard)/ecommerce/orders/` |
| products | `src/app/templates/(dashboard)/ecommerce/products/` |
| sellers | `src/app/templates/(dashboard)/ecommerce/sellers/` |

每模块结构：

```
<module>/
├── page.tsx          # 列表
├── [id]/
│   └── page.tsx      # 详情
└── new/
    └── page.tsx      # 新建
```

## 新业务接入

1. 选最接近的模块 copy（如 orders 适合"订单类业务"）
2. 改路由目录名 + page 里的字段和接口
3. 复用模板页头、工具带与表格/表单骨架；宿主已有 AppLayout 时不再嵌套
4. 优先替换业务数据；结构有必要变化时说明业务依据并对照统一清单
