import { redirect } from "next/navigation";

export default async function EditMenuPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/menus/?edit=${encodeURIComponent(id)}`);
}
