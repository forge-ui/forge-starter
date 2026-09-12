"use server";

import { redirect } from "next/navigation";
import { signInWithPassword } from "@/lib/auth/sign-in";

export async function loginAction(formData: FormData) {
  const login = String(formData.get("login") ?? "");
  const password = String(formData.get("password") ?? "");
  const result = await signInWithPassword(login, password);
  if (!result.ok) {
    redirect(`/login/?error=${encodeURIComponent(result.error)}`);
  }
  redirect(result.redirectTo);
}
