import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { isAuthGuardEnabled } from "@/lib/auth/config";
import type { ReactNode } from "react";
import { AppShell } from "@/components/app-shell";
import { AccessStoreProvider } from "@/components/access-store";
import { AccountsStoreProvider } from "@/components/accounts-store";
import { RolesStoreProvider } from "@/components/roles-store";
import { PermissionsStoreProvider } from "@/components/permissions-store";
import { MenusStoreProvider } from "@/components/menus-store";
import { ModelsStoreProvider } from "@/components/models-store";

export default async function AppSectionLayout({ children }: { children: ReactNode }) {
  if (isAuthGuardEnabled() && !await getSessionUser()) redirect("/login/");
  return (
    <AccessStoreProvider>
      <AccountsStoreProvider>
        <RolesStoreProvider>
          <PermissionsStoreProvider>
            <MenusStoreProvider>
              <ModelsStoreProvider>
                <AppShell>{children}</AppShell>
              </ModelsStoreProvider>
            </MenusStoreProvider>
          </PermissionsStoreProvider>
        </RolesStoreProvider>
      </AccountsStoreProvider>
    </AccessStoreProvider>
  );
}
