import type { ReactNode } from "react";
import { AppShell } from "@/components/app-shell";
import { AccountsStoreProvider } from "@/components/accounts-store";
import { RolesStoreProvider } from "@/components/roles-store";
import { PermissionsStoreProvider } from "@/components/permissions-store";
import { MenusStoreProvider } from "@/components/menus-store";
import { ApprovalsStoreProvider } from "@/components/approvals-store";

export default function AppSectionLayout({ children }: { children: ReactNode }) {
  return (
    <AccountsStoreProvider>
      <ApprovalsStoreProvider>
        <RolesStoreProvider>
          <PermissionsStoreProvider>
            <MenusStoreProvider>
              <AppShell>{children}</AppShell>
            </MenusStoreProvider>
          </PermissionsStoreProvider>
        </RolesStoreProvider>
      </ApprovalsStoreProvider>
    </AccountsStoreProvider>
  );
}
