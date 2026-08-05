export type ApprovalType =
  | "leave"
  | "expense"
  | "purchase"
  | "overtime"
  | "general";

export type ApprovalStatus = "pending" | "approved" | "rejected" | "cancelled";

export type LeaveForm = {
  leaveType: string;
  startDate: string;
  endDate: string;
  days: string;
  reason: string;
};

export type ExpenseForm = {
  amount: string;
  category: string;
  occurDate: string;
  description: string;
};

export type PurchaseForm = {
  itemName: string;
  quantity: string;
  budget: string;
  vendor: string;
  reason: string;
};

export type OvertimeForm = {
  workDate: string;
  hours: string;
  reason: string;
};

export type GeneralForm = {
  summary: string;
  detail: string;
  urgency: string;
};

export type ApprovalFormPayload =
  | { type: "leave"; data: LeaveForm }
  | { type: "expense"; data: ExpenseForm }
  | { type: "purchase"; data: PurchaseForm }
  | { type: "overtime"; data: OvertimeForm }
  | { type: "general"; data: GeneralForm };

export type ApprovalRequest = {
  id: string;
  type: ApprovalType;
  title: string;
  status: ApprovalStatus;
  applicantName: string;
  applicantUsername: string;
  applicantEmail: string;
  form: ApprovalFormPayload;
  approverName: string;
  approverUsername: string;
  approverComment: string;
  decidedAt: string;
  created: string;
  updated: string;
};

export type ApprovalCreateInput = {
  type: ApprovalType;
  title: string;
  form: ApprovalFormPayload;
};

export type ApprovalDecideInput = {
  action: "approve" | "reject";
  comment: string;
};

export const APPROVAL_TYPE_META: Record<
  ApprovalType,
  { label: string; color: "blue" | "green" | "yellow" | "grey" | "red" }
> = {
  leave: { label: "请假", color: "blue" },
  expense: { label: "报销", color: "yellow" },
  purchase: { label: "采购", color: "green" },
  overtime: { label: "加班", color: "grey" },
  general: { label: "通用审批", color: "blue" },
};

export const APPROVAL_STATUS_META: Record<
  ApprovalStatus,
  { label: string; color: "blue" | "green" | "yellow" | "grey" | "red" }
> = {
  pending: { label: "待审批", color: "yellow" },
  approved: { label: "已通过", color: "green" },
  rejected: { label: "已驳回", color: "red" },
  cancelled: { label: "已撤销", color: "grey" },
};

export const APPROVAL_TYPES = Object.keys(APPROVAL_TYPE_META) as ApprovalType[];

const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function formatApprovalDate(date: Date) {
  return `${String(date.getDate()).padStart(2, "0")} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatApprovalDateTime(date: Date) {
  return `${formatApprovalDate(date)} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

export function isApprovalType(v: string): v is ApprovalType {
  return (APPROVAL_TYPES as string[]).includes(v);
}

export function isApprovalStatus(v: string): v is ApprovalStatus {
  return v === "pending" || v === "approved" || v === "rejected" || v === "cancelled";
}

export function defaultTitle(type: ApprovalType, applicantName: string) {
  return `${applicantName}的${APPROVAL_TYPE_META[type].label}申请`;
}
