import { redirect } from "next/navigation";

export default function SettingsProfilePage() {
  redirect("/settings/apps/?dialog=profile");
}
