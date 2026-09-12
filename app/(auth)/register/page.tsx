import { getAuthMode } from "@/lib/auth/config";
import { RegisterForm } from "./register-form";

export default function RegisterPage() {
  return <RegisterForm mode={getAuthMode()} />;
}
