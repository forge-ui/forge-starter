/**
 * AI-only reference page catalog.
 * Real routes under /ref/* — NOT registered in config/menu.tsx.
 * Production: hidden unless SHOW_REF_PAGES=true (see middleware).
 */

export type RefPageMeta = {
  slug: string;
  title: string;
  role: string;
  summary: string;
  forgeTemplate: string;
  components: string[];
};

export const REF_PAGES: RefPageMeta[] = [
  {
    slug: "list-table",
    title: "列表 · 表格",
    role: "collection-table",
    summary: "单行筛选 + 搜索 + DataTable + 行操作，标准 CRUD 列表。",
    forgeTemplate: "templates/(dashboard)/ecommerce/customers",
    components: ["DataTable", "ButtonGroup", "TextField", "StatusBadge", "IconButton"],
  },
  {
    slug: "list-cards",
    title: "列表 · 卡片网格",
    role: "collection-cards",
    summary: "筛选 + 卡片网格，适合项目/资产。",
    forgeTemplate: "templates/project-template/projects",
    components: ["StatusBadge", "ButtonGroup", "TextField", "Button"],
  },
  {
    slug: "detail",
    title: "详情 · 业务档案",
    role: "detail",
    summary: "主栏字段 + 侧栏摘要 + 顶栏操作（业务对象）。",
    forgeTemplate: "templates/(dashboard)/ecommerce/customers/[id]",
    components: ["Breadcrumbs", "StatusBadge", "Button", "StatCard"],
  },
  {
    slug: "person",
    title: "详情 · CRM 人物（多 Tab）",
    role: "person",
    summary: "头图资料条 + 左资料/地址 + 右多 Tab（动态/交易/通话/会议/附件/备注）。John Bushmill 范式。",
    forgeTemplate: "templates/crm-template/customers/[id] · forgeui.org/.../john-bushmill",
    components: ["Avatar", "TabBar", "DataTable", "HistoryGrouped", "StatusBadge", "Button"],
  },
  {
    slug: "profile",
    title: "详情 · 项目成员",
    role: "profile",
    summary: "左头像资料卡 + 右 KPI 波形 + Tab（项目/任务/动态）。members/[id]。",
    forgeTemplate: "templates/project-template/members/[id]",
    components: ["Avatar", "LineChartStatCard", "TabBar", "DataTable", "HistoryGrouped"],
  },
  {
    slug: "product",
    title: "详情 · 产品（多 Tab）",
    role: "product-detail",
    summary: "左图集 + 右指标 + Tab（详情/订单/评价/留言）。",
    forgeTemplate: "templates/(dashboard)/ecommerce/products/[id]",
    components: ["TabBar", "DataTable", "StatusBadge", "Button"],
  },
  {
    slug: "detail-modal",
    title: "详情 · 弹窗",
    role: "detail-modal",
    summary: "列表点行打开 Modal 详情。",
    forgeTemplate: "starter approvals",
    components: ["DataTable", "Modal", "StatusBadge", "Button"],
  },
  {
    slug: "form-page",
    title: "表单 · 整页（CRM 线索）",
    role: "form-page",
    summary: "双列表单 + 备注 + 顶/底主操作。对齐 leads/new。",
    forgeTemplate: "templates/crm-template/leads/new · forgeui.org/.../leads/new",
    components: ["TextField", "TextArea", "SelectOption", "Button"],
  },
  {
    slug: "form-modal",
    title: "表单 · 弹窗",
    role: "form-modal",
    summary: "列表页上叠新建/编辑 Modal。",
    forgeTemplate: "ecommerce customers Add Modal",
    components: ["Modal", "TextField", "SelectOption", "Button"],
  },
  {
    slug: "split",
    title: "主从分屏",
    role: "split",
    summary: "左列表右预览。",
    forgeTemplate: "templates/project-template/clients",
    components: ["StatusBadge", "Button", "TextField"],
  },
  {
    slug: "calendar",
    title: "日历",
    role: "calendar",
    summary: "FullCalendar 月/周/日 + 可选详情面板。",
    forgeTemplate: "templates/micellaneous-template/calendar",
    components: ["FullCalendar", "SurfaceCard", "ButtonGroup", "Avatar", "Button"],
  },
  {
    slug: "chat",
    title: "对话",
    role: "chat",
    summary: "联系人列表 + 消息流 + ChatInputBar。",
    forgeTemplate: "templates/micellaneous-template/chat",
    components: ["ContactItem", "ChatBubble", "ChatInputBar", "Avatar", "Button"],
  },
  {
    slug: "files",
    title: "文件清单",
    role: "files",
    summary: "文件夹条 + FileCard 网格 + 搜索/上传。",
    forgeTemplate: "templates/micellaneous-template/files",
    components: ["FileCard", "FileTypeIcon", "TextField", "Button"],
  },
  {
    slug: "dashboard-board",
    title: "看板 · CRM 条",
    role: "dashboard",
    summary: "KPI 行 + 趋势卡 + 活动 + 明细表。",
    forgeTemplate: "templates/(dashboards)/dashboards/crm · ecommerce-2",
    components: ["StatCard", "LineChartStatCard", "ActivityCard", "DataTable", "ListGroup"],
  },
  {
    slug: "dashboard-kpi",
    title: "看板 · 精简 KPI",
    role: "dashboard-lite",
    summary: "四指标 + 简表（完整产品看板见 /dashboard）。",
    forgeTemplate: "templates/(dashboards)/dashboards/ecommerce-2",
    components: ["StatCard", "ProgressStatCard", "DataTable"],
  },
  {
    slug: "settings",
    title: "设置 · 分组表单",
    role: "settings",
    summary: "分区卡片 + Toggle + 危险区。",
    forgeTemplate: "starter settings",
    components: ["TextField", "Toggle", "Button"],
  },
  {
    slug: "activity",
    title: "活动 / 时间线",
    role: "activity",
    summary: "HistoryGrouped 操作流。",
    forgeTemplate: "templates/crm-template/activity",
    components: ["HistoryGrouped", "ButtonGroup"],
  },
  {
    slug: "queue",
    title: "待办队列",
    role: "queue",
    summary: "列表 + 行内通过/驳回。",
    forgeTemplate: "starter approvals todo",
    components: ["DataTable", "Button", "StatusBadge", "ButtonGroup"],
  },
  {
    slug: "empty",
    title: "空态 / 错误态",
    role: "empty",
    summary: "无数据 vs 无匹配。",
    forgeTemplate: "accounts empty",
    components: ["Button"],
  },
];

export function refPath(slug: string) {
  return `/ref/${slug}/`;
}
