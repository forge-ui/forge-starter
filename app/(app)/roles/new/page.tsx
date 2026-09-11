import { redirect } from "next/navigation";

export default function NewRolePage() {
  redirect("/roles/?create=1");
}
