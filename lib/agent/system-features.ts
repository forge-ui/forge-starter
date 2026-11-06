import { MODULES } from "@/config/modules.generated";
import { APP_MODULE_IDS, APP_MODULE_META, type AppModuleId } from "@/config/apps";

/** Product facts, not execution authority. Keep alongside the pages they describe. */
export const SYSTEM_FEATURES = Object.fromEntries(MODULES.map(module => [module.id, module.knowledge])) as Record<AppModuleId, { summary: string; fields: string; rules: string; source: string }>;

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
