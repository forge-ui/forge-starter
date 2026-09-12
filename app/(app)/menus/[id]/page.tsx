import { redirect } from "next/navigation";

export default async function MenuDetailRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/menus/?id=${encodeURIComponent(id)}`);
}
