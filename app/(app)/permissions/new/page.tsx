import { redirect } from "next/navigation";

export default function NewPermissionPage() {
  redirect("/permissions/?create=1");
}
