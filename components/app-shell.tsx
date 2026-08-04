"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  AppLayout,
  type AppLayoutProfile,
  type Team,
} from "@forge-ui-official/core";
import { defaultProfile, menuItemsForApp } from "@/config/menu";
import {
  APPS_UPDATED_EVENT,
  DEFAULT_APP_ID,
  homePathForApp,
  type AppEntry,
} from "@/config/apps";
import {
  loadActiveAppId,
  loadAppRegistry,
  saveActiveAppId,
} from "@/lib/apps/registry";
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

function teamsFromApps(apps: AppEntry[], activeId: string): Team[] {
  return apps.map((app) => ({
    id: app.id,
    name: app.name,
    avatar: app.avatar,
    active: app.id === activeId,
  }));
}

function openAppTarget(app: AppEntry, router: ReturnType<typeof useRouter>) {
  const href = app.href?.trim();
  if (!href) return;

  const isExternal = href.startsWith("http://") || href.startsWith("https://");
  if (app.openMode === "new_tab" || isExternal) {
    if (typeof window !== "undefined") {
      window.open(href, app.openMode === "same_tab" && !isExternal ? "_self" : "_blank", "noopener,noreferrer");
    }
    return;
  }
  router.push(href);
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const shell = useMemo(() => shellForPath(pathname), [pathname]);
  const [profile, setProfile] = useState<AppLayoutProfile>(defaultProfile);
  const [apps, setApps] = useState<AppEntry[]>([]);
  const [activeAppId, setActiveAppId] = useState(DEFAULT_APP_ID);

  const syncRegistry = useCallback(() => {
    const list = loadAppRegistry();
    setApps(list);
    setActiveAppId(loadActiveAppId(list));
  }, []);

  useEffect(() => {
    syncRegistry();
    function onAppsUpdated() {
      syncRegistry();
    }
    window.addEventListener(APPS_UPDATED_EVENT, onAppsUpdated);
    return () => window.removeEventListener(APPS_UPDATED_EVENT, onAppsUpdated);
  }, [syncRegistry]);

  const activeApp: AppEntry = useMemo(() => {
    return (
      apps.find((a) => a.id === activeAppId)
      ?? apps.find((a) => a.isCurrentProduct)
      ?? apps[0]
      ?? {
        id: DEFAULT_APP_ID,
        name: siteConfig.teamName,
        subtitle: "当前产品",
        kind: "internal" as const,
        href: "/dashboard/",
        openMode: "same_tab" as const,
        authMode: "platform" as const,
        menuPreset: "accounts-admin" as const,
        modules: ["dashboard", "accounts", "settings"] as const,
        isCurrentProduct: true,
      }
    );
  }, [apps, activeAppId]);

  const teams = useMemo(
    () => teamsFromApps(apps.length ? apps : [activeApp], activeAppId),
    [apps, activeApp, activeAppId],
  );

  const shellMenuItems = useMemo(
    () => menuItemsForApp(activeApp),
    [activeApp],
  );

  const selectApp = useCallback(
    (app: AppEntry) => {
      setActiveAppId(app.id);
      saveActiveAppId(app.id);

      if (app.kind === "internal") {
        router.push(homePathForApp(app));
        return;
      }

      // link / external
      if (app.authMode === "platform" || app.authMode === "passthrough" || app.authMode === "oidc") {
        // Placeholder: real SSO later; still navigate for demo
      }
      openAppTarget(app, router);
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
          router.push("/settings/?tab=apps");
        }
        return;
      }

      const teamTarget = target?.closest?.(
        '[data-popover="team"] [role="menuitemradio"]',
      ) as HTMLElement | null;
      if (!teamTarget) return;

      event.preventDefault();
      event.stopPropagation();

      const name = (teamTarget.textContent ?? "").replace(/\s+/g, " ").trim();
      const app = apps.find(
        (entry) =>
          entry.name.replace(/\s+/g, " ").trim() === name
          || name.includes(entry.name),
      );
      if (app) selectApp(app);
    }

    document.addEventListener("click", onDocumentClick, true);
    return () => document.removeEventListener("click", onDocumentClick, true);
  }, [logout, router, selectApp, apps]);

  return (
    <AppLayout
      mode="light"
      logo={<img src={asset("/images/forge-logo.svg")} alt="Forge" className="size-8" />}
      profilePosition="sidebar"
      accent={siteConfig.accent}
      teamName={activeApp.name}
      teamSubtitle={activeApp.subtitle || "当前应用"}
      teams={teams}
      showTeamActions={false}
      menuItems={shellMenuItems}
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
