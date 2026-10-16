import { APP_MODULE_IDS, APP_MODULE_META, type AppModuleId } from "@/config/apps";

/** Product facts, not execution authority. Keep alongside the pages they describe. */
export const SYSTEM_FEATURES: Record<AppModuleId, { summary: string; fields: string; rules: string; source: string }> = {
  dashboard: {
    summary: "工作台展示账号总数、启用及待处理统计、状态趋势、状态占比、区域和角色分布、最近账号；可切换趋势周期、查看账号和新建账号。",
    fields: "指标、图表、最近账号列表。",
    rules: "账号统计读取业务账号；页面标注的演示曲线、区域示意不能当作真实趋势。实时数值须查账号工具。",
    source: "app/(app)/dashboard/page.tsx",
  },
  accounts: {
    summary: "业务账号支持查询、搜索、状态筛选、全页详情、新建、编辑、删除、CSV 导出；详情含账号信息和会话信息。",
    fields: "姓名、用户名、邮箱、手机、角色、部门、状态、备注。",
    rules: "业务账号不是登录用户；用户名创建后不可改；状态有启用、停用、待激活、锁定。已有助手草稿和页面保存回执流程。",
    source: "app/(app)/accounts/page.tsx",
  },
  roles: {
    summary: "角色管理支持列表搜索、状态筛选、详情弹窗、新建、编辑、删除；在角色表单中选择权限，维护角色与权限的关联。",
    fields: "角色名称、唯一编码、启用/停用、权限多选、说明。",
    rules: "编码2–48位，以小写字母开头，只含小写字母、数字、下划线、冒号、连字符；编辑时编码不可改。权限数不等于授权范围，须查权限关联。权限变更由用户在页面核对并保存。",
    source: "components/role-form-dialog.tsx",
  },
  menus: {
    summary: "菜单目录支持搜索、状态筛选、详情、新建、编辑和删除；可设置父级菜单、路径、排序和状态。",
    fields: "名称、唯一编码、路径、上级菜单、排序、启用/停用、说明。",
    rules: "路径需以/开头；排序为0–9999整数；内置菜单有保护限制；编码编辑时不可改。菜单目录记录不自动生成侧栏。侧栏可见还取决于代码模块登记、当前应用勾选和角色读取权限。",
    source: "components/menu-form-dialog.tsx",
  },
  permissions: {
    summary: "权限管理支持搜索、资源/操作筛选、详情、新建、编辑、删除，并展示已分配角色；角色授权在角色表单维护。",
    fields: "名称、资源、操作、权限编码、说明。",
    rules: "资源为工作台、账号、角色、菜单、权限、模型、应用；操作为read/create/update/delete。权限编码唯一，编辑限制以页面为准；创建权限目录不等于已经授权给角色。",
    source: "components/permission-form-dialog.tsx",
  },
  models: {
    summary: "模型服务按供应商分组，支持搜索、详情、新建接入、编辑、删除、启用/停用、设默认及测试连接。Ask AI 可选择已启用可用模型。",
    fields: "显示名称、供应商、模型ID、调用地址、API Key、状态、是否默认、备注。",
    rules: "Key只在模型页面输入，不进对话；列表不返回明文Key。配置存在、启用与连接成功是不同事实，连接测试须实际执行。助手可准备非密钥字段的创建、修改及删除草稿，经确认后在页面保存；连接测试须明确请求并确认。",
    source: "components/model-form-dialog.tsx",
  },
  settings: {
    summary: "应用管理支持搜索、类型筛选、详情、新建、编辑、删除、应用切换；类型有内部应用、外部链接、外部系统。内部应用可选菜单模块和默认首页。",
    fields: "名称、副标题、应用类型、入口地址、打开方式、认证方式、菜单选择、默认首页。",
    rules: "应用注册表存当前浏览器localStorage，不是服务端业务表；助手只读取随当前页面提供的本地应用摘要；结果注明来自当前浏览器，不冒充服务端查询。外部认证是占位能力，不能声称已完成SSO对接。",
    source: "components/app-form-dialog.tsx",
  },
};

export const PERSONAL_FEATURES = "头像菜单提供编辑资料（显示名、邮箱，用户名只读）、修改密码（当前密码和新密码，仅本人在安全表单输入）、系统设置（通知偏好，保存在当前浏览器）。登录支持用户名或邮箱加密码、注册、SMTP邮件找回/重置密码、退出登录。业务账号管理与登录身份分开，助手不得索要密码、验证码或重置令牌。Ask AI 支持新建/历史对话、全屏、模型选择、业务快捷卡片、文本附件与已授权工具；没有登记的通知中心、支付、完整IM或SSO不属于已实现功能。";

/** Always inject a compact inventory, independently of relevance retrieval. */
export function systemFeatureContext(allowedToolIds: readonly string[]) {
  const ids = new Set(allowedToolIds);
  return JSON.stringify({
    modules: APP_MODULE_IDS.filter(id => ids.has(`${id}.navigate`)).map(id => ({
      id, label: APP_MODULE_META[id].label, route: APP_MODULE_META[id].href,
      ...SYSTEM_FEATURES[id],
      assistantTools: allowedToolIds.filter(tool => tool.startsWith(`${id}.`)),
    })),
    personal: PERSONAL_FEATURES,
  });
}

export const SYSTEM_FEATURE_POLICY = "系统功能清单描述页面真实能力，assistantTools才是本轮可执行工具。不要把缺少自动办理工具说成系统不支持、没收录或不知道该模块。功能咨询说明入口、字段和规则。创建、修改、删除角色/菜单/权限/模型优先调用对应create/update/delete工具，经确认带入页面保存。fields只填用户明确给出的值，缺字段留空，不编造联系人或授权。角色授权先查permissions.list取真实id，只授予用户明确要求的权限，不默认管理员或全选。模型启停、设默认走update，密钥只在页面填。应用工具按本地注册表边界办理。只有用户明确先去页面时只导航。未保存不能声称完成；保存回执和服务端读回是完成依据。权限不足明确说明权限，不能绕过。当前页面label和路径是有效定位线索。";
