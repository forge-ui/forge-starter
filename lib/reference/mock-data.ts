/** Mock-only data for /ref/* pages — not persisted. */

export type RefRecord = {
  id: string;
  title: string;
  subtitle: string;
  owner: string;
  status: "active" | "pending" | "closed" | "draft";
  amount: string;
  updated: string;
  tags: string[];
  description: string;
};

export const REF_STATUS_META: Record<
  RefRecord["status"],
  { label: string; color: "green" | "yellow" | "grey" | "blue" }
> = {
  active: { label: "进行中", color: "green" },
  pending: { label: "待处理", color: "yellow" },
  closed: { label: "已关闭", color: "grey" },
  draft: { label: "草稿", color: "blue" },
};

export const REF_RECORDS: RefRecord[] = [
  {
    id: "r1",
    title: "华东大区门店巡检",
    subtitle: "PRJ-2041",
    owner: "王敏",
    status: "active",
    amount: "¥ 128,000",
    updated: "今天 09:12",
    tags: ["巡检", "华东"],
    description: "覆盖 12 家门店的季度巡检与整改跟踪，含照片与签字回传。",
  },
  {
    id: "r2",
    title: "供应链对账差异处理",
    subtitle: "PRJ-2038",
    owner: "李哲",
    status: "pending",
    amount: "¥ 46,200",
    updated: "昨天 18:40",
    tags: ["财务", "对账"],
    description: "三月批次与供应商系统数量不一致，需双方核对后关闭差异单。",
  },
  {
    id: "r3",
    title: "新员工入职设备申请",
    subtitle: "PRJ-2033",
    owner: "陈思",
    status: "draft",
    amount: "¥ 18,600",
    updated: "03 Aug 2026",
    tags: ["IT", "采购"],
    description: "笔记本 ×4、显示器 ×4，预算待审批。",
  },
  {
    id: "r4",
    title: "客户续约谈判纪要",
    subtitle: "PRJ-2029",
    owner: "赵倩",
    status: "closed",
    amount: "¥ 520,000",
    updated: "28 Jul 2026",
    tags: ["销售"],
    description: "续约一年，折扣 8%，已归档合同。",
  },
  {
    id: "r5",
    title: "数据看板埋点改造",
    subtitle: "PRJ-2025",
    owner: "周凯",
    status: "active",
    amount: "—",
    updated: "今天 11:05",
    tags: ["研发"],
    description: "统一事件命名与漏斗报表，对接工作台指标卡。",
  },
  {
    id: "r6",
    title: "办公耗材月度补货",
    subtitle: "PRJ-2020",
    owner: "孙悦",
    status: "pending",
    amount: "¥ 3,280",
    updated: "今天 08:20",
    tags: ["行政"],
    description: "打印纸、硒鼓、茶水间补给，待仓管确认库存。",
  },
];

export type RefActivity = {
  id: string;
  actor: string;
  action: string;
  target: string;
  time: string;
  group: string;
};

export const REF_ACTIVITIES: RefActivity[] = [
  { id: "a1", actor: "王敏", action: "更新了状态为进行中", target: "华东大区门店巡检", time: "09:12", group: "今天" },
  { id: "a2", actor: "李哲", action: "提交了对账附件", target: "供应链对账差异处理", time: "08:55", group: "今天" },
  { id: "a3", actor: "系统", action: "自动创建待办", target: "办公耗材月度补货", time: "08:20", group: "今天" },
  { id: "a4", actor: "赵倩", action: "关闭记录", target: "客户续约谈判纪要", time: "17:40", group: "昨天" },
  { id: "a5", actor: "周凯", action: "评论了实现方案", target: "数据看板埋点改造", time: "15:02", group: "昨天" },
];
