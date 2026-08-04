import { redirect } from "next/navigation";

/** Create is a list-page modal (ShipAny / customers pattern). Keep route for bookmarks. */
export default function NewAccountPage() {
  redirect("/accounts/?create=1");
}
