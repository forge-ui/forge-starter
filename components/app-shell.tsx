"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  AppLayout,
  type AppLayoutProfile,
  type Team,
} from "@forge-ui-official/core";
import { menuItems, defaultProfile } from "@/config/menu";
import {
  ACTIVE_APP_STORAGE_KEY,
  APP_ENTRIES,
  DEFAULT_APP_ID,
  type AppEntry,
} from "@/config/apps";
import { shellForPath, siteConfig } from "@/config/site";
import { asset } from "@/lib/asset";
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

function readStoredAppId(): string {
  if (typeof window === "undefined") return DEFAULT_APP_ID;
  try {
    const raw = window.localStorage.getItem(ACTIVE_APP_STORAGE_KEY);
    if (raw && APP_ENTRIES.some((a) => a.id === raw)) return raw;
  } catch {
    // ignore
  }
  return DEFAULT_APP_ID;
}

function teamsFromApps(activeId: string): Team[] {
  return APP_ENTRIES.map((app) => ({
    id: app.id,
    name: app.name,
    avatar: app.avatar,
    active: app.id === activeId,
  }));
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const shell = useMemo(() => shellForPath(pathname), [pathname]);
  const [profile, setProfile] = useState<AppLayoutProfile>(defaultProfile);
  const [activeAppId, setActiveAppId] = useState(DEFAULT_APP_ID);

  useEffect(() => {
    setActiveAppId(readStoredAppId());
  }, []);

  const activeApp: AppEntry = useMemo(
    () => APP_ENTRIES.find((a) => a.id === activeAppId) ?? APP_ENTRIES[0]!,
    [activeAppId],
  );

  const teams = useMemo(() => teamsFromApps(activeAppId), [activeAppId]);

  const selectApp = useCallback(
    (app: AppEntry) => {
      setActiveAppId(app.id);
      try {
        window.localStorage.setItem(ACTIVE_APP_STORAGE_KEY, app.id);
      } catch {
        // ignore
      }

      if (app.isCurrentProduct) {
        // Already in this product; keep route unless user was on settings-only deep links
        return;
      }

      if (app.href) {
        if (app.href.startsWith("http://") || app.href.startsWith("https://")) {
          window.location.assign(app.href);
          return;
        }
        router.push(app.href);
        return;
      }

      // Placeholder app: stay in shell, user sees name change in switcher
      // Real multi-app deploy would navigate to another origin/product.
    },
    [router],
  );

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

  // Profile + app switcher popovers are presentational in core — wire here.
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

      // App list only (showTeamActions=false) — rows are menuitemradio
      const teamTarget = target?.closest?.(
        '[data-popover="team"] [role="menuitemradio"]',
      ) as HTMLElement | null;
      if (!teamTarget) return;

      event.preventDefault();
      event.stopPropagation();

      const name = (teamTarget.textContent ?? "").replace(/\s+/g, " ").trim();
      const app = APP_ENTRIES.find(
        (entry) =>
          entry.name.replace(/\s+/g, " ").trim() === name
          || name.includes(entry.name),
      );
      if (app) selectApp(app);
    }

    document.addEventListener("click", onDocumentClick, true);
    return () => document.removeEventListener("click", onDocumentClick, true);
  }, [logout, router, selectApp]);

  return (
    <AppLayout
      mode="light"
      logo={<img src={asset("/images/forge-logo.svg")} alt="Forge" className="size-8" />}
      profilePosition="sidebar"
      accent={siteConfig.accent}
      teamName={activeApp.name}
      teamSubtitle={activeApp.subtitle}
      teams={teams}
      showTeamActions={false}
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
