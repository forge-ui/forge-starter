import { redirect } from "next/navigation";

export default async function ApprovalDetailRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/approvals/?id=${encodeURIComponent(id)}`);
}
