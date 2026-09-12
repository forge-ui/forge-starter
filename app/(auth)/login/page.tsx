import { getAuthMode } from "@/lib/auth/config";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return <LoginForm mode={getAuthMode()} />;
}
