import { redirect } from "next/navigation";

/**
 * 兼容旧链接 /approvals/:id → 列表 + 详情弹窗 ?id=
 */
export default async function ApprovalDetailRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/approvals/?id=${encodeURIComponent(id)}`);
}
