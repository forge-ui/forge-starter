import { APPLICATION_BUILD_ID, moduleContracts } from "../semantic/contracts";
import { retrieveKnowledge, type KnowledgeEntry, type KnowledgeQuery, type KnowledgeSource } from "./knowledge";

export const STARTER_KNOWLEDGE_VERSION = "forge.starter-knowledge/v1";
export const STARTER_PLATFORM_ID = "forge-starter";

type Definition = Omit<KnowledgeEntry, "platformId" | "buildId" | "source" | "relatedSources"> & {
  source: Omit<KnowledgeSource, "version">;
  relatedSources?: readonly Omit<KnowledgeSource, "version">[];
};

/**
 * Reviewed business explanations. IDs and source anchors follow the registered
 * tools; this catalog imports neither the server registry nor business records.
 * Dynamic counts, actual grants, model availability, and success require tools.
 */
const definitions: readonly Definition[] = [
  {
    id: "accounts.overview", title: "查询业务账号", capabilityIds: ["accounts.list"],
    summary: "业务账号保存在 admin_accounts，与用于登录的 users 分开。可按姓名、用户名、邮箱、手机、状态和角色查询。人数和名单应读取实际数据；返回的部分列表不能当作全部数据。对话读取详情用 accounts.get，打开详情页面用 accounts.open；多个匹配先让用户选择或指定唯一名称。",
    keywords: ["账号", "账户", "名单", "人数", "状态", "查询", "accounts"],
    source: { path: moduleContracts.accounts.sources.tools, symbol: "accountAgentTools" },
    relatedSources: [{ path: "docs/product.md" }, { path: moduleContracts.accounts.sources.input, symbol: "accountFilterSchema" }],
    prerequisites: ["当前用户具有账号读取权限。业务查询需要可用的 PostgreSQL；演示登录不会提供业务持久化。"],
    nextSteps: [
      { label: "查看账号", question: "查看账号列表", capabilityIds: ["accounts.list"] },
      { label: "按状态查看", question: "查看停用账号", capabilityIds: ["accounts.list"] },
      { label: "新建账号", question: "新建一个账号", capabilityIds: ["accounts.create"] },
    ],
  },
  {
    id: "accounts.create", title: "新建业务账号", capabilityIds: ["accounts.create"],
    summary: "已登记新建账号工具。用户只给部分信息时即可展示预填表单，由用户补齐必填项。确认后填入账号页面，只有页面保存成功才算创建完成；这不会创建登录用户。",
    keywords: ["账号", "新建", "创建", "新增", "添加", "必填", "用户名", "accounts.create"],
    source: { path: moduleContracts.accounts.sources.tools, symbol: "accountAgentTools" },
    relatedSources: [{ path: moduleContracts.accounts.sources.input, symbol: "accountCreateSchema" }, { path: moduleContracts.accounts.sources.form }],
    prerequisites: [
      "用户名为 3–32 位小写字母、数字或下划线；必填姓名、邮箱、手机、角色、部门、状态，备注可选。",
      "角色可选超级管理员、运营、审计、只读；状态可选 active、disabled、pending、locked。",
      "只预填用户已提供或确认的信息。缺字段交给表单，不编造姓名、邮箱和手机号。",
      "需账号创建权限；用户确认填表后仍须在页面保存。",
    ],
    nextSteps: [{ label: "查看账号列表", question: "查看账号列表", capabilityIds: ["accounts.list"] }],
  },
  {
    id: "accounts.update", title: "修改业务账号", capabilityIds: ["accounts.update"],
    summary: "已登记账号修改工具。用已确认的记录 ID 选择目标，只填写用户要求修改的字段，其他字段保留原值；用户名不可修改。确认后填入编辑表单，在页面保存。",
    keywords: ["账号", "修改", "编辑", "启用", "停用", "禁用", "部门", "备注", "accounts.update"],
    source: { path: moduleContracts.accounts.sources.tools, symbol: "accountAgentTools" },
    relatedSources: [{ path: moduleContracts.accounts.sources.input, symbol: "accountUpdateToolSchema" }],
    prerequisites: ["需账号修改权限以及真实目标 ID。重名或指代不明确时先选择目标。", "填表会携带记录 revision；保存前记录已变更时需要重新读取、核对。"],
    nextSteps: [{ label: "查看修改后的账号", question: "查看刚才修改的账号", capabilityIds: ["accounts.get"] }],
  },
  {
    id: "accounts.delete", title: "删除业务账号", capabilityIds: ["accounts.delete"],
    summary: "删除工具在账号页面打开指定记录的删除确认，由用户在页面执行删除。打开确认框不等于删除成功，需等待页面的成功回执。",
    keywords: ["账号", "删除", "移除", "删掉", "accounts.delete"],
    source: { path: moduleContracts.accounts.sources.tools, symbol: "accountAgentTools" },
    prerequisites: ["需账号删除权限和唯一的真实目标 ID。", "核对账号姓名、用户名及记录版本，明确选择后才准备删除确认。"],
    nextSteps: [{ label: "查看剩余账号", question: "查看账号列表", capabilityIds: ["accounts.list"] }],
  },
  {
    id: "accounts.export", title: "导出账号与筛选范围", capabilityIds: ["accounts.export"],
    summary: "按账号列表相同的筛选生成 CSV 下载。当前页面范围需保留页面筛选条件；明确全量查询时使用 all 范围。结果超过导出上限时说明匹配总数与实际导出条数，提供下载入口。",
    keywords: ["账号", "导出", "csv", "下载", "当前筛选", "accounts.export"],
    source: { path: moduleContracts.accounts.sources.tools, symbol: "buildAccountsCsv" },
    relatedSources: [{ path: "lib/semantic/bind.ts", symbol: "bindPageArguments" }],
    prerequisites: ["需账号读取权限。用户要求当前页面范围时必须有对应的有效页面上下文。"],
    nextSteps: [{ label: "核对账号范围", question: "查询当前筛选下的账号", capabilityIds: ["accounts.list"] }],
  },
  {
    id: "roles.overview", title: "角色与权限分析", capabilityIds: ["roles.list"],
    summary: "角色工具提供名称、编码、启用状态、已分配权限条数和说明。权限条数只能说明数量，不能据此判断可访问哪些模块；具体授权需结合权限目录的真实关联分析。",
    keywords: ["角色", "权限", "能做什么", "能看什么", "管理员", "roles"],
    source: { path: "lib/roles/agent.ts", symbol: "roleAgentTools" },
    prerequisites: ["需角色读取权限。角色修改未登记助手写工具；需要配置时在角色页面操作。"],
    nextSteps: [
      { label: "查看角色", question: "查看角色列表", capabilityIds: ["roles.list"] },
      { label: "分析角色权限", question: "结合角色和权限目录，分析各角色可以访问哪些模块", capabilityIds: ["roles.list", "permissions.list"] },
    ],
  },
  {
    id: "permissions.overview", title: "查看权限与角色关联", capabilityIds: ["permissions.list"],
    summary: "权限工具返回权限编码、资源、操作及获授角色名称。分析某个角色时应对照实际关联，区分 read、create、update、delete 等操作。当前工具只读，不会调整授权。",
    keywords: ["权限", "授权", "访问", "能看", "能操作", "permissions"],
    source: { path: "lib/permissions/agent.ts", symbol: "permissionAgentTools" },
    prerequisites: ["需权限目录读取权限。没有查到授权数据时明确证据不足，不能仅按角色名称推断权限。"],
    nextSteps: [
      { label: "查看权限关联", question: "查看权限及已分配角色", capabilityIds: ["permissions.list"] },
      { label: "打开权限管理", question: "打开权限管理页面", capabilityIds: ["permissions.navigate"] },
    ],
  },
  {
    id: "menus.overview", title: "菜单目录与侧栏可见条件", capabilityIds: ["menus.list"],
    summary: "菜单工具读取目录名称、编码、路径、模块和状态。实际侧栏由代码中的模块登记、当前应用勾选、当前用户模块读取权限共同决定。仅修改菜单数据库目录不会自动新增侧栏入口。",
    keywords: ["菜单", "侧栏", "入口", "看不到", "不显示", "模块", "menus"],
    source: { path: "lib/menus/agent.ts", symbol: "menuAgentTools" },
    relatedSources: [{ path: "config/apps.ts" }, { path: "config/menu.tsx" }, { path: "lib/rbac/access.ts", symbol: "modulesFromPermissions" }],
    prerequisites: ["需菜单读取权限。菜单工具只解释目录；代码登记及应用勾选需在对应位置核查，不宣称已替用户修复侧栏。"],
    nextSteps: [
      { label: "查看菜单目录", question: "查看菜单目录", capabilityIds: ["menus.list"] },
      { label: "核查权限", question: "查看各模块的读取权限及角色关联", capabilityIds: ["permissions.list"] },
    ],
  },
  {
    id: "models.overview", title: "模型服务查询与选择", capabilityIds: ["models.list"],
    summary: "模型工具读取已接入模型名称、供应商、模型名、启用状态、默认标记，可按供应商或名称筛选。配置存在、已启用与实际可调用是不同事实；仅有列表数据不能断言连通成功。工具不返回 API Key，也不修改模型配置。",
    keywords: ["模型", "服务", "供应商", "默认", "启用", "deepseek", "qwen", "通义", "models"],
    source: { path: moduleContracts.models.sources.tools, symbol: "modelAgentTools" },
    relatedSources: [{ path: moduleContracts.models.sources.service, symbol: "resolveAiModel" }],
    prerequisites: ["需模型读取权限。模型配置和密钥在服务端管理，不要求用户在对话里提交密钥。"],
    nextSteps: [
      { label: "查看已接入模型", question: "查看已接入模型及默认配置", capabilityIds: ["models.list"] },
      { label: "打开模型服务", question: "打开模型服务页面", capabilityIds: ["models.navigate"] },
    ],
  },
  {
    id: "models.open", title: "查看模型详情", capabilityIds: ["models.open"],
    summary: "用已查询到的真实模型 ID 打开模型详情。需要调整模型、测试连接或配置默认模型时引导到模型服务页面；当前助手登记的模型工具只支持查询、筛选和打开。",
    keywords: ["模型", "详情", "配置", "连接", "测连", "不通", "换模型", "models.open"],
    source: { path: "lib/semantic/page-tools.ts", symbol: "pageTools" },
    relatedSources: [{ path: moduleContracts.models.sources.page }, { path: moduleContracts.models.sources.service, symbol: "probeAiModel" }],
    prerequisites: ["先查询模型，明确名称与真实 ID；模型不存在时重新选择。打开页面成功后再报告已打开。"],
    nextSteps: [{ label: "查询模型配置", question: "查看已接入模型及默认配置", capabilityIds: ["models.list"] }],
  },
];

/** Bind the checked-in explanations to the deployment that ships them. */
export function getStarterKnowledge(buildId: string = APPLICATION_BUILD_ID): KnowledgeEntry[] {
  return definitions.map((definition) => ({
    ...definition,
    platformId: STARTER_PLATFORM_ID,
    buildId,
    source: { ...definition.source, version: buildId },
    relatedSources: definition.relatedSources?.map((source) => ({ ...source, version: buildId })),
  }));
}

export function retrieveStarterKnowledge(
  request: Omit<KnowledgeQuery, "platformId" | "buildId"> & { buildId?: string },
) {
  // Catalog identity is the executing deployment, not a caller-supplied build.
  return retrieveKnowledge(getStarterKnowledge(), {
    ...request, platformId: STARTER_PLATFORM_ID, buildId: request.buildId ?? APPLICATION_BUILD_ID,
  });
}
