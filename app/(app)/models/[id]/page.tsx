import { redirect } from "next/navigation";

export default async function ModelDetailRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/models/?id=${encodeURIComponent(id)}`);
}
