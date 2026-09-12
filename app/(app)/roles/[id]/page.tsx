import { redirect } from "next/navigation";

export default async function RoleDetailRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/roles/?id=${encodeURIComponent(id)}`);
}
