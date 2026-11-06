# 认证页面

主仓没有独立的 src/app/templates/auth/ 套件；crm-template 等业务模板内的 register/forgot-password/reset-password 是演示，不能当作真实认证实现。不要引用不存在的 templates/auth/sign-in、sign-up 等路径。

认证接入应只读核对 forge-starter 当前真实路由，再按其 session/权限约定实施。使用 TextField、Checkbox、Button、StyledLink；明确校验、等待、错误与成功跳转。真实会话、权限与安全接入需单独验收，外观不等于后端安全能力。
