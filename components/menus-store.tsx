"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { apiFetch, parseApiJson } from "@/lib/api/browser";
import type { MenuInput, MenuRecord } from "@/lib/menus/types";

type MenusStoreValue = {
  menus: MenuRecord[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  getById: (id: string) => MenuRecord | undefined;
  createMenu: (input: MenuInput) => Promise<MenuRecord>;
  updateMenu: (id: string, input: MenuInput) => Promise<MenuRecord>;
  deleteMenu: (id: string) => Promise<void>;
  countsByStatus: Record<string, number>;
};

const MenusStoreContext = createContext<MenusStoreValue | null>(null);

type MenusResponse = {
  menus?: MenuRecord[];
  menu?: MenuRecord;
};

export function MenusStoreProvider({ children }: { children: ReactNode }) {
  const [menus, setMenus] = useState<MenuRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/menus/");
      const data = await parseApiJson<MenusResponse>(res);
      if (!res.ok || !data.ok) {
        setError(data.error ?? "加载菜单失败");
        setMenus([]);
        return;
      }
      setMenus(data.menus ?? []);
      setError(null);
    } catch {
      setError("网络错误，无法加载菜单");
      setMenus([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const getById = useCallback(
    (id: string) => menus.find((item) => item.id === id),
    [menus],
  );

  const createMenu = useCallback(async (input: MenuInput) => {
    const res = await apiFetch("/api/menus/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = await parseApiJson<MenusResponse>(res);
    if (!res.ok || !data.ok || !data.menu) {
      throw new Error(data.error ?? "创建失败");
    }
    await refresh();
    return data.menu;
  }, [refresh]);

  const updateMenu = useCallback(async (id: string, input: MenuInput) => {
    const res = await apiFetch(`/api/menus/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = await parseApiJson<MenusResponse>(res);
    if (!res.ok || !data.ok || !data.menu) {
      throw new Error(data.error ?? "更新失败");
    }
    await refresh();
    return data.menu;
  }, [refresh]);

  const deleteMenu = useCallback(async (id: string) => {
    const res = await apiFetch(`/api/menus/${id}/`, { method: "DELETE" });
    const data = await parseApiJson<MenusResponse>(res);
    if (!res.ok || !data.ok) {
      throw new Error(data.error ?? "删除失败");
    }
    setMenus((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const countsByStatus = useMemo(() => {
    const counts: Record<string, number> = { all: menus.length, active: 0, disabled: 0 };
    for (const item of menus) counts[item.status] = (counts[item.status] ?? 0) + 1;
    return counts;
  }, [menus]);

  const value = useMemo(
    () => ({
      menus,
      loading,
      error,
      refresh,
      getById,
      createMenu,
      updateMenu,
      deleteMenu,
      countsByStatus,
    }),
    [menus, loading, error, refresh, getById, createMenu, updateMenu, deleteMenu, countsByStatus],
  );

  return <MenusStoreContext.Provider value={value}>{children}</MenusStoreContext.Provider>;
}

export function useMenusStore() {
  const ctx = useContext(MenusStoreContext);
  if (!ctx) throw new Error("useMenusStore must be used within MenusStoreProvider");
  return ctx;
}
