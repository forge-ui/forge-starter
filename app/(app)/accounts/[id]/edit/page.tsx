import { redirect } from "next/navigation";

/** Edit is a modal on list/detail; keep route for bookmarks. */
export default async function EditAccountPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/accounts/?edit=${encodeURIComponent(id)}`);
}
