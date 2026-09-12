import { redirect } from "next/navigation";

export default function NewMenuPage() {
  redirect("/menus/?create=1");
}
