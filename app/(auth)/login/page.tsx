import { getAuthMode } from "@/lib/auth/config";
import { LoginForm } from "./login-form";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  return <LoginForm mode={getAuthMode()} initialError={params.error ?? null} />;
}
