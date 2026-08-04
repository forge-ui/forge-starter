import type { ReactNode } from "react";
import { AppShell } from "@/components/app-shell";
import { DemoStoreProvider } from "@/components/demo-store";

export default function AppSectionLayout({ children }: { children: ReactNode }) {
  return (
    <DemoStoreProvider>
      <AppShell>{children}</AppShell>
    </DemoStoreProvider>
  );
}
