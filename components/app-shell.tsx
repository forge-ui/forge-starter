"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AppLayout, type AppLayoutProfile } from "@forge-ui-official/core";
import { menuItems, defaultProfile } from "@/config/menu";
import { shellForPath, siteConfig } from "@/config/site";

type MeResponse = {
  ok: boolean;
  user: null | {
    id: string;
    username: string;
    email: string;
    displayName: string;
  };
};

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const shell = useMemo(() => shellForPath(pathname), [pathname]);
  const [profile, setProfile] = useState<AppLayoutProfile>(defaultProfile);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me/")
      .then((res) => res.json())
      .then((data: MeResponse) => {
        if (cancelled || !data?.user) return;
        setProfile({
          avatar: `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(data.user.username)}`,
          name: data.user.displayName,
          role: data.user.email,
        });
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout/", { method: "POST" });
    router.replace("/login/");
    router.refresh();
  }, [router]);

  // Core ProfileDropdown is presentational; wire starter actions from the sidebar profile menu.
  useEffect(() => {
    function onDocumentClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      const item = target?.closest?.('[data-popover="profile"] [role="menuitem"]') as HTMLElement | null;
      if (!item) return;
      const label = (item.textContent ?? "").replace(/\s+/g, "");
      if (label.includes("退出登录")) {
        event.preventDefault();
        void logout();
        return;
      }
      if (label.includes("系统设置")) {
        event.preventDefault();
        router.push("/settings/");
      }
    }
    document.addEventListener("click", onDocumentClick);
    return () => document.removeEventListener("click", onDocumentClick);
  }, [logout, router]);

  return (
    <AppLayout
      mode="light"
      profilePosition="sidebar"
      accent={siteConfig.accent}
      teamName={siteConfig.teamName}
      teamMemberCount={1}
      menuItems={menuItems}
      profile={profile}
      notifications={0}
      messages={0}
      pageTitle={shell.title}
      pageHeaderVariant={
        pathname.includes("/accounts/new")
        || /\/accounts\/[^/]+\/edit/.test(pathname)
        || /\/accounts\/[^/]+\/?$/.test(pathname) && !pathname.endsWith("/accounts/")
          ? "detail"
          : "home"
      }
      onBack={
        pathname.includes("/accounts/new")
        || /\/accounts\/[^/]+/.test(pathname)
          ? () => router.push("/accounts/")
          : undefined
      }
      primaryAction={
        shell.primaryAction
          ? {
              label: shell.primaryAction.label,
              onClick: () => router.push(shell.primaryAction!.href),
            }
          : undefined
      }
      hideHeader={shell.hideHeader === true}
      showDatePicker={false}
      showKebab={false}
    >
      {children}
    </AppLayout>
  );
}
