import { redirect } from "next/navigation";

export default function NewApprovalPage() {
  redirect("/approvals/?create=1");
}
