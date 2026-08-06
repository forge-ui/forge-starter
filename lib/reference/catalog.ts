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
    components: ["DataTable", "ButtonGroup", "TextField", "StatusBadge", "IconButton", "Breadcrumbs"],
  },
  {
    slug: "list-cards",
    title: "列表 · 卡片网格",
    role: "collection-cards",
    summary: "筛选 + 卡片网格（SurfaceCard / ProjectCard 风格），适合项目/资产。",
    forgeTemplate: "templates/project-template/projects",
    components: ["SurfaceCard", "StatusBadge", "ButtonGroup", "TextField", "Button"],
  },
  {
    slug: "detail",
    title: "详情 · 全页档案",
    role: "detail",
    summary: "面包屑 + 主栏字段 + 侧栏摘要 + 顶栏操作（对齐 accounts/[id]）。",
    forgeTemplate: "templates/(dashboard)/ecommerce/customers/[id]",
    components: ["Breadcrumbs", "StatusBadge", "Button", "DescriptionItem", "StatCard"],
  },
  {
    slug: "profile",
    title: "详情 · 个人/成员",
    role: "profile",
    summary: "左：头像资料卡；右：KPI + Tab（项目/任务/动态）。成员档案专用，不是普通业务 detail。",
    forgeTemplate: "templates/project-template/members/[id]",
    components: ["Avatar", "LineChartStatCard", "TabBar", "DataTable", "HistoryGrouped", "StatusBadge", "Button"],
  },
  {
    slug: "detail-modal",
    title: "详情 · 弹窗",
    role: "detail-modal",
    summary: "列表点行打开 Modal 详情（对齐 approvals）。",
    forgeTemplate: "starter approvals pattern",
    components: ["DataTable", "Modal", "StatusBadge", "Button"],
  },
  {
    slug: "form-page",
    title: "表单 · 整页分区",
    role: "form-page",
    summary: "字段多时用页内分区表单，少用（默认仍优先 form-modal）。",
    forgeTemplate: "templates/(dashboard)/ecommerce/products/new",
    components: ["TextField", "TextArea", "SelectOption", "Button", "SurfaceCard"],
  },
  {
    slug: "form-modal",
    title: "表单 · 弹窗",
    role: "form-modal",
    summary: "列表页上叠新建/编辑 Modal（accounts / approvals 默认）。",
    forgeTemplate: "ecommerce customers Add Modal",
    components: ["Modal", "TextField", "SelectOption", "Button"],
  },
  {
    slug: "split",
    title: "主从分屏",
    role: "split",
    summary: "左列表右预览，边浏览边处理（客户/工单类）。",
    forgeTemplate: "templates/project-template/clients",
    components: ["ListGroup", "DescriptionItem", "StatusBadge", "Button", "TextField"],
  },
  {
    slug: "settings",
    title: "设置 · 分组表单",
    role: "settings",
    summary: "分区卡片 + 开关/输入 + 危险区。",
    forgeTemplate: "starter settings/profile",
    components: ["SurfaceCard", "TextField", "Toggle", "Button"],
  },
  {
    slug: "activity",
    title: "活动 / 时间线",
    role: "activity",
    summary: "操作记录、审批历程（History 家族）。",
    forgeTemplate: "templates/crm-template/activity",
    components: ["HistoryGrouped", "HistoryItem", "ButtonGroup", "Breadcrumbs"],
  },
  {
    slug: "queue",
    title: "待办队列",
    role: "queue",
    summary: "列表 + 行内主操作（通过/驳回类），非进详情才处理。",
    forgeTemplate: "starter approvals todo scope",
    components: ["DataTable", "Button", "StatusBadge", "ButtonGroup"],
  },
  {
    slug: "empty",
    title: "空态 / 错误态",
    role: "empty",
    summary: "无数据与无匹配两种空态写法。",
    forgeTemplate: "accounts empty states",
    components: ["Button", "Breadcrumbs"],
  },
  {
    slug: "dashboard-kpi",
    title: "看板 · KPI 条",
    role: "dashboard",
    summary: "指标卡 + 简表（完整看板见 /dashboard 产品页）。",
    forgeTemplate: "templates/(dashboards)/dashboards/ecommerce-2",
    components: ["StatCard", "ProgressStatCard", "DataTable", "StatusBadge"],
  },
];

export function refPath(slug: string) {
  return `/ref/${slug}/`;
}
