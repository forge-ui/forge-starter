import type { ReactNode } from "react";
import { AppShell } from "@/components/app-shell";
import { AccountsStoreProvider } from "@/components/accounts-store";

export default function AppSectionLayout({ children }: { children: ReactNode }) {
  return (
    <AccountsStoreProvider>
      <AppShell>{children}</AppShell>
    </AccountsStoreProvider>
  );
}
