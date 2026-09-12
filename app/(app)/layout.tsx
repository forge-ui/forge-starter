import type { ReactNode } from "react";
import { AppShell } from "@/components/app-shell";
import { AccountsStoreProvider } from "@/components/accounts-store";
import { RolesStoreProvider } from "@/components/roles-store";
import { PermissionsStoreProvider } from "@/components/permissions-store";
import { MenusStoreProvider } from "@/components/menus-store";

export default function AppSectionLayout({ children }: { children: ReactNode }) {
  return (
    <AccountsStoreProvider>
      <RolesStoreProvider>
        <PermissionsStoreProvider>
          <MenusStoreProvider>
            <AppShell>{children}</AppShell>
          </MenusStoreProvider>
        </PermissionsStoreProvider>
      </RolesStoreProvider>
    </AccountsStoreProvider>
  );
}
