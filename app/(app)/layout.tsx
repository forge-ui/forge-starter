import type { ReactNode } from "react";
import { AppShell } from "@/components/app-shell";
import { AccountsStoreProvider } from "@/components/accounts-store";
import { ApprovalsStoreProvider } from "@/components/approvals-store";

export default function AppSectionLayout({ children }: { children: ReactNode }) {
  return (
    <AccountsStoreProvider>
      <ApprovalsStoreProvider>
        <AppShell>{children}</AppShell>
      </ApprovalsStoreProvider>
    </AccountsStoreProvider>
  );
}
