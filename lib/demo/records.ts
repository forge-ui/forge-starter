export type RecordStatus = "active" | "draft" | "done" | "blocked";

export type BusinessRecord = {
  id: string;
  code: string;
  name: string;
  subtitle: string;
  category: string;
  owner: string;
  description: string;
  status: RecordStatus;
  updatedDate: string;
  updatedTime: string;
  imageUrl: string;
  createdAt: string;
};

export type RecordInput = {
  name: string;
  subtitle?: string;
  category: string;
  owner: string;
  description: string;
  status: RecordStatus;
};

export const RECORD_STATUS_META: Record<
  RecordStatus,
  { label: string; color: "blue" | "grey" | "green" | "red" | "yellow" }
> = {
  active: { label: "进行中", color: "blue" },
  draft: { label: "草稿", color: "grey" },
  done: { label: "已完成", color: "green" },
  blocked: { label: "已阻断", color: "red" },
};

export const RECORD_CATEGORIES = ["策略", "流程", "审计", "检查"] as const;

export const RECORD_OWNERS = ["张敏", "李强", "王芳", "赵磊"] as const;

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function formatNowParts(date = new Date()) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const updatedDate = `${pad(date.getDate())} ${months[date.getMonth()]} ${date.getFullYear()}`;
  const updatedTime = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  return { updatedDate, updatedTime, createdAt: date.toISOString() };
}

function avatarFor(name: string) {
  const letter = encodeURIComponent((name.trim()[0] || "R").toUpperCase());
  return `https://placehold.co/36x36/dbeafe/1d4ed8?text=${letter}`;
}

export function createRecordId() {
  return `rec-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export function createRecordCode(category: string) {
  const prefix =
    category === "策略" ? "POL"
      : category === "流程" ? "ALT"
        : category === "审计" ? "AUD"
          : "CHK";
  return `${prefix}-${String(Math.floor(1000 + Math.random() * 9000))}`;
}

export function buildRecord(input: RecordInput, existing?: BusinessRecord): BusinessRecord {
  const now = formatNowParts();
  return {
    id: existing?.id ?? createRecordId(),
    code: existing?.code ?? createRecordCode(input.category),
    name: input.name.trim(),
    subtitle: (input.subtitle ?? "").trim() || "未填写摘要",
    category: input.category,
    owner: input.owner,
    description: input.description.trim(),
    status: input.status,
    updatedDate: now.updatedDate,
    updatedTime: now.updatedTime,
    imageUrl: existing?.imageUrl ?? avatarFor(input.name),
    createdAt: existing?.createdAt ?? now.createdAt,
  };
}

export const INITIAL_RECORDS: BusinessRecord[] = [
  {
    id: "1",
    code: "POL-2012",
    name: "设备准入策略",
    subtitle: "3 条规则",
    category: "策略",
    owner: "张敏",
    description: "覆盖新终端入网审批、证书校验与例外申请。",
    status: "active",
    updatedDate: "29 Dec 2025",
    updatedTime: "10:00",
    imageUrl: avatarFor("设备"),
    createdAt: "2025-12-20T02:00:00.000Z",
  },
  {
    id: "2",
    code: "ALT-2011",
    name: "告警处置流程",
    subtitle: "2 个阶段",
    category: "流程",
    owner: "李强",
    description: "高危告警的认领、升级与关闭路径。",
    status: "draft",
    updatedDate: "24 Dec 2025",
    updatedTime: "10:00",
    imageUrl: avatarFor("告警"),
    createdAt: "2025-12-18T02:00:00.000Z",
  },
  {
    id: "3",
    code: "AUD-2002",
    name: "审计导出任务",
    subtitle: "周报",
    category: "审计",
    owner: "王芳",
    description: "每周导出操作日志并归档至合规桶。",
    status: "done",
    updatedDate: "12 Dec 2025",
    updatedTime: "10:00",
    imageUrl: avatarFor("审计"),
    createdAt: "2025-12-10T02:00:00.000Z",
  },
  {
    id: "4",
    code: "CHK-1901",
    name: "终端基线检查",
    subtitle: "1 个批次",
    category: "检查",
    owner: "赵磊",
    description: "对关键网段终端执行补丁与配置基线扫描。",
    status: "active",
    updatedDate: "21 Oct 2025",
    updatedTime: "10:00",
    imageUrl: avatarFor("检查"),
    createdAt: "2025-10-21T02:00:00.000Z",
  },
  {
    id: "5",
    code: "POL-1900",
    name: "零信任网络分段",
    subtitle: "5 条规则",
    category: "策略",
    owner: "张敏",
    description: "生产区与办公区微隔离策略草案。",
    status: "blocked",
    updatedDate: "21 Oct 2025",
    updatedTime: "10:00",
    imageUrl: avatarFor("零"),
    createdAt: "2025-10-15T02:00:00.000Z",
  },
  {
    id: "6",
    code: "ALT-1881",
    name: "高危登录复核",
    subtitle: "人工复核",
    category: "流程",
    owner: "李强",
    description: "异常登录需安全值班二次确认。",
    status: "done",
    updatedDate: "19 Sep 2025",
    updatedTime: "10:00",
    imageUrl: avatarFor("高"),
    createdAt: "2025-09-19T02:00:00.000Z",
  },
  {
    id: "7",
    code: "AUD-1643",
    name: "权限变更台账",
    subtitle: "月报",
    category: "审计",
    owner: "王芳",
    description: "汇总本月角色与权限变更记录。",
    status: "draft",
    updatedDate: "19 Sep 2025",
    updatedTime: "10:00",
    imageUrl: avatarFor("权"),
    createdAt: "2025-09-12T02:00:00.000Z",
  },
  {
    id: "8",
    code: "CHK-1600",
    name: "补丁合规扫描",
    subtitle: "全量",
    category: "检查",
    owner: "赵磊",
    description: "关键 CVE 补丁覆盖率巡检。",
    status: "active",
    updatedDate: "19 Sep 2025",
    updatedTime: "10:00",
    imageUrl: avatarFor("补"),
    createdAt: "2025-09-01T02:00:00.000Z",
  },
];
