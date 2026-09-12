import { redirect } from "next/navigation";

export default async function PermissionDetailRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/permissions/?id=${encodeURIComponent(id)}`);
}
