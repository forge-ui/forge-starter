import { redirect } from "next/navigation";

export default async function EditRolePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/roles/?edit=${encodeURIComponent(id)}`);
}
