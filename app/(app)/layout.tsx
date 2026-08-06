import type { ReactNode } from "react";
import { AppShell } from "@/components/app-shell";
import { AccountsStoreProvider } from "@/components/accounts-store";
import { ApprovalsStoreProvider } from "@/components/approvals-store";
import { SuppliersStoreProvider } from "@/components/suppliers-store";
import { PurchaseOrdersStoreProvider } from "@/components/purchase-orders-store";

export default function AppSectionLayout({ children }: { children: ReactNode }) {
  return (
    <AccountsStoreProvider>
      <ApprovalsStoreProvider>
        <SuppliersStoreProvider>
          <PurchaseOrdersStoreProvider>
            <AppShell>{children}</AppShell>
          </PurchaseOrdersStoreProvider>
        </SuppliersStoreProvider>
      </ApprovalsStoreProvider>
    </AccountsStoreProvider>
  );
}
