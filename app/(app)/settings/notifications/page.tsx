import { redirect } from "next/navigation";

export default function SettingsNotificationsPage() {
  redirect("/settings/apps/?dialog=notifications");
}
