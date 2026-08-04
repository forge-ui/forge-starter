"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AppLayout, type AppLayoutProfile } from "@forge-ui-official/core";
import { menuItems, defaultProfile } from "@/config/menu";
import { shellForPath, siteConfig } from "@/config/site";
import {
  PROFILE_UPDATED_EVENT,
  type ProfileUpdatedDetail,
} from "@/lib/auth/profile-events";

type MeResponse = {
  ok: boolean;
  user: null | {
    id: string;
    username: string;
    email: string;
    displayName: string;
  };
};

function profileFromUser(user: {
  username: string;
  email: string;
  displayName: string;
}): AppLayoutProfile {
  return {
    avatar: `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(user.username)}`,
    name: user.displayName,
    role: user.email,
  };
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const shell = useMemo(() => shellForPath(pathname), [pathname]);
  const [profile, setProfile] = useState<AppLayoutProfile>(defaultProfile);

  const refreshProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me/");
      const data = (await res.json()) as MeResponse;
      if (data?.user) {
        setProfile(profileFromUser(data.user));
      }
    } catch {
      // keep previous profile
    }
  }, []);

  useEffect(() => {
    void refreshProfile();
  }, [refreshProfile, pathname]);

  useEffect(() => {
    function onProfileUpdated(event: Event) {
      const detail = (event as CustomEvent<ProfileUpdatedDetail>).detail;
      if (detail?.displayName || detail?.email || detail?.username) {
        setProfile((prev) => ({
          avatar:
            detail.username
              ? `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(detail.username)}`
              : prev.avatar,
          name: detail.displayName ?? prev.name,
          role: detail.email ?? prev.role,
        }));
      }
      void refreshProfile();
    }
    window.addEventListener(PROFILE_UPDATED_EVENT, onProfileUpdated);
    return () => window.removeEventListener(PROFILE_UPDATED_EVENT, onProfileUpdated);
  }, [refreshProfile]);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout/", { method: "POST" });
    router.replace("/login/");
    router.refresh();
  }, [router]);

  // Profile + team popovers are presentational in core — wire actions here.
  useEffect(() => {
    function onDocumentClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;

      const profileItem = target?.closest?.(
        '[data-popover="profile"] [role="menuitem"]',
      ) as HTMLElement | null;
      if (profileItem) {
        const label = (profileItem.textContent ?? "").replace(/\s+/g, "");
        event.preventDefault();
        event.stopPropagation();
        if (label.includes("退出登录")) {
          void logout();
          return;
        }
        if (label.includes("编辑资料")) {
          router.push("/settings/?tab=profile");
          return;
        }
        if (label.includes("修改密码")) {
          router.push("/settings/?tab=security");
          return;
        }
        if (label.includes("系统设置")) {
          router.push("/settings/?tab=notifications");
        }
        return;
      }

      const teamItem = target?.closest?.(
        '[data-popover="team"] [role="menuitem"]',
      ) as HTMLElement | null;
      if (!teamItem) return;

      const label = (teamItem.textContent ?? "").replace(/\s+/g, "");
      event.preventDefault();
      event.stopPropagation();

      // Single-app starter: team switcher is branding, not multi-tenant.
      // Map meaningful items; ignore multi-team create.
      if (label.includes("设置")) {
        router.push("/settings/?tab=notifications");
        return;
      }
      if (label.includes("邀请") || label.includes("新建账号")) {
        router.push("/accounts/?create=1");
      }
      // 「新建团队」intentionally no-op — not multi-workspace product
    }

    document.addEventListener("click", onDocumentClick, true);
    return () => document.removeEventListener("click", onDocumentClick, true);
  }, [logout, router]);

  return (
    <AppLayout
      mode="light"
      profilePosition="sidebar"
      accent={siteConfig.accent}
      teamName={siteConfig.teamName}
      teamSubtitle="单应用 · 账号管理"
      teamLabels={{
        invite: "新建账号",
        settings: "系统设置",
        createNew: "新建团队（未启用）",
      }}
      menuItems={menuItems}
      profile={profile}
      notifications={0}
      messages={0}
      pageTitle={shell.title}
      pageHeaderVariant={
        /\/accounts\/[^/]+\/?$/.test(pathname) && !pathname.endsWith("/accounts/")
          ? "detail"
          : "home"
      }
      onBack={
        /\/accounts\/[^/]+/.test(pathname)
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
