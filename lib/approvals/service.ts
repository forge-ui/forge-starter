import { and, desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { approvalRequests, type ApprovalRequestRow } from "@/lib/db/schema";
import {
  defaultTitle,
  formatApprovalDate,
  formatApprovalDateTime,
  isApprovalStatus,
  isApprovalType,
  type ApprovalCreateInput,
  type ApprovalDecideInput,
  type ApprovalFormPayload,
  type ApprovalRequest,
  type ApprovalStatus,
  type ApprovalType,
} from "./types";

function parseForm(raw: string, type: ApprovalType): ApprovalFormPayload {
  try {
    const data = JSON.parse(raw) as Record<string, string>;
    return { type, data: data as never } as ApprovalFormPayload;
  } catch {
    return { type: "general", data: { summary: "", detail: raw, urgency: "普通" } };
  }
}

function toApproval(row: ApprovalRequestRow): ApprovalRequest {
  const type = isApprovalType(row.type) ? row.type : "general";
  const status = isApprovalStatus(row.status) ? row.status : "pending";
  return {
    id: row.id,
    type,
    title: row.title,
    status,
    applicantName: row.applicantName,
    applicantUsername: row.applicantUsername,
    applicantEmail: row.applicantEmail ?? "",
    form: parseForm(row.formData, type),
    approverName: row.approverName ?? "",
    approverUsername: row.approverUsername ?? "",
    approverComment: row.approverComment ?? "",
    decidedAt: row.decidedAt ? formatApprovalDateTime(row.decidedAt) : "—",
    created: formatApprovalDateTime(row.createdAt),
    updated: formatApprovalDate(row.updatedAt),
  };
}

function validateForm(type: ApprovalType, form: ApprovalFormPayload) {
  if (form.type !== type) throw new Error("表单类型与申请类型不一致");
  const d = form.data as Record<string, string>;
  if (type === "leave") {
    if (!d.leaveType?.trim()) throw new Error("请选择请假类型");
    if (!d.startDate?.trim() || !d.endDate?.trim()) throw new Error("请填写起止日期");
    if (!d.reason?.trim()) throw new Error("请填写请假事由");
  } else if (type === "expense") {
    if (!d.amount?.trim()) throw new Error("请填写报销金额");
    if (!d.category?.trim()) throw new Error("请选择费用类别");
    if (!d.description?.trim()) throw new Error("请填写费用说明");
  } else if (type === "purchase") {
    if (!d.itemName?.trim()) throw new Error("请填写采购物品");
    if (!d.quantity?.trim()) throw new Error("请填写数量");
    if (!d.budget?.trim()) throw new Error("请填写预算金额");
  } else if (type === "overtime") {
    if (!d.workDate?.trim()) throw new Error("请填写加班日期");
    if (!d.hours?.trim()) throw new Error("请填写加班时长");
    if (!d.reason?.trim()) throw new Error("请填写加班原因");
  } else {
    if (!d.summary?.trim()) throw new Error("请填写申请摘要");
    if (!d.detail?.trim()) throw new Error("请填写详细说明");
  }
}

export async function listApprovals(filter?: {
  status?: ApprovalStatus;
  applicantUsername?: string;
  type?: ApprovalType;
}): Promise<ApprovalRequest[]> {
  const db = getDb();
  const rows = await db
    .select()
    .from(approvalRequests)
    .orderBy(desc(approvalRequests.createdAt));

  return rows
    .map(toApproval)
    .filter((item) => {
      if (filter?.status && item.status !== filter.status) return false;
      if (filter?.type && item.type !== filter.type) return false;
      if (filter?.applicantUsername && item.applicantUsername !== filter.applicantUsername) {
        return false;
      }
      return true;
    });
}

export async function getApprovalById(id: string): Promise<ApprovalRequest | null> {
  const db = getDb();
  const [row] = await db
    .select()
    .from(approvalRequests)
    .where(eq(approvalRequests.id, id))
    .limit(1);
  return row ? toApproval(row) : null;
}

export async function createApproval(
  input: ApprovalCreateInput,
  applicant: { name: string; username: string; email: string },
): Promise<ApprovalRequest> {
  if (!isApprovalType(input.type)) throw new Error("申请类型无效");
  validateForm(input.type, input.form);

  const title =
    input.title.trim() || defaultTitle(input.type, applicant.name || applicant.username);
  const formData = JSON.stringify(input.form.data);

  const db = getDb();
  const [row] = await db
    .insert(approvalRequests)
    .values({
      type: input.type,
      title,
      status: "pending",
      applicantName: applicant.name || applicant.username,
      applicantUsername: applicant.username,
      applicantEmail: applicant.email,
      formData,
    })
    .returning();
  return toApproval(row);
}

export async function decideApproval(
  id: string,
  input: ApprovalDecideInput,
  approver: { name: string; username: string },
): Promise<ApprovalRequest> {
  const existing = await getApprovalById(id);
  if (!existing) throw new Error("审批单不存在");
  if (existing.status !== "pending") throw new Error("该审批单已处理，无法再次操作");
  if (existing.applicantUsername === approver.username) {
    throw new Error("不能审批自己发起的申请（演示规则）");
  }

  const status: ApprovalStatus = input.action === "approve" ? "approved" : "rejected";
  const comment = input.comment.trim();
  if (input.action === "reject" && !comment) {
    throw new Error("驳回时请填写意见");
  }

  const db = getDb();
  const [row] = await db
    .update(approvalRequests)
    .set({
      status,
      approverName: approver.name || approver.username,
      approverUsername: approver.username,
      approverComment: comment,
      decidedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(and(eq(approvalRequests.id, id), eq(approvalRequests.status, "pending")))
    .returning();

  if (!row) throw new Error("审批失败，请刷新后重试");
  return toApproval(row);
}

export async function cancelApproval(
  id: string,
  username: string,
): Promise<ApprovalRequest> {
  const existing = await getApprovalById(id);
  if (!existing) throw new Error("审批单不存在");
  if (existing.applicantUsername !== username) throw new Error("只能撤销自己发起的申请");
  if (existing.status !== "pending") throw new Error("仅待审批单据可撤销");

  const db = getDb();
  const [row] = await db
    .update(approvalRequests)
    .set({
      status: "cancelled",
      updatedAt: new Date(),
    })
    .where(eq(approvalRequests.id, id))
    .returning();
  if (!row) throw new Error("撤销失败");
  return toApproval(row);
}
