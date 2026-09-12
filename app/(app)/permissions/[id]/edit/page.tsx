import { redirect } from "next/navigation";

export default async function EditPermissionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/permissions/?edit=${encodeURIComponent(id)}`);
}
