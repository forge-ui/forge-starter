"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
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

  async function logout() {
    await fetch("/api/auth/logout/", { method: "POST" });
    router.replace("/login/");
    router.refresh();
  }

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
      pageHeaderVariant={pathname.includes("/examples/form") ? "detail" : "home"}
      onBack={pathname.includes("/examples/form") ? () => router.push("/examples/list/") : undefined}
      primaryAction={
        shell.primaryAction
          ? {
              label: shell.primaryAction.label,
              onClick: () => router.push(shell.primaryAction!.href),
            }
          : undefined
      }
      secondaryAction={{ label: "退出登录", onClick: () => void logout() }}
    >
      {children}
    </AppLayout>
  );
}
