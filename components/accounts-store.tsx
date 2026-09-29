"use client";

import type { Receipt } from "@/lib/semantic/operations";
export type SaveOptions = { operationId?: string; key?: string; revision?: number };
type SavedAccount = AdminAccount & { receipt?: Receipt };
function writeHeaders(options?: SaveOptions): Record<string, string> {
  return { "Content-Type": "application/json", "idempotency-key": options?.key ?? crypto.randomUUID(), ...(options?.operationId ? { "x-operation-id": options.operationId } : {}), ...(options?.revision ? { "if-match": String(options.revision) } : {}) };
}

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AccountInput, AdminAccount } from "@/lib/accounts/types";
import { useAccess } from "@/components/access-store";

type AccountsStoreValue = {
  accounts: AdminAccount[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  getById: (id: string) => AdminAccount | undefined;
  createAccount: (input: AccountInput, options?: SaveOptions) => Promise<SavedAccount>;
  updateAccount: (id: string, input: AccountInput, options?: SaveOptions) => Promise<SavedAccount>;
  deleteAccount: (id: string, options?: SaveOptions) => Promise<Receipt | undefined>;
  countsByStatus: Record<string, number>;
};

const AccountsStoreContext = createContext<AccountsStoreValue | null>(null);

async function parseJson(res: Response) {
  return (await res.json()) as {
    ok: boolean;
    error?: string;
    accounts?: AdminAccount[];
    account?: AdminAccount;
    receipt?: Receipt;
  };
}

export function AccountsStoreProvider({ children }: { children: ReactNode }) {
  const { ready, canRead } = useAccess();
  const [accounts, setAccounts] = useState<AdminAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/accounts/");
      const data = await parseJson(res);
      if (!res.ok || !data.ok) {
        setError(data.error ?? "加载账号失败");
        setAccounts([]);
        return;
      }
      setAccounts(data.accounts ?? []);
      setError(null);
    } catch {
      setError("网络错误，无法加载账号");
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!canRead("accounts")) {
      setAccounts([]);
      setError(null);
      setLoading(false);
      return;
    }
    void refresh();
  }, [ready, canRead, refresh]);

  const getById = useCallback(
    (id: string) => accounts.find((item) => item.id === id),
    [accounts],
  );

  const createAccount = useCallback(async (input: AccountInput, options?: SaveOptions) => {
    const res = await fetch("/api/accounts/", {
      method: "POST",
      headers: writeHeaders(options),
      body: JSON.stringify(input),
    });
    const data = await parseJson(res);
    if (!res.ok || !data.ok || !data.account) {
      throw new Error(data.error ?? "创建失败");
    }
    setAccounts((prev) => [data.account!, ...prev.filter((a) => a.id !== data.account!.id)]);
    return { ...data.account, receipt: data.receipt };
  }, []);

  const updateAccount = useCallback(async (id: string, input: AccountInput, options?: SaveOptions) => {
    const res = await fetch(`/api/accounts/${id}/`, {
      method: "PATCH",
      headers: writeHeaders(options),
      body: JSON.stringify(input),
    });
    const data = await parseJson(res);
    if (!res.ok || !data.ok || !data.account) {
      throw new Error(data.error ?? "更新失败");
    }
    setAccounts((prev) => prev.map((item) => (item.id === id ? data.account! : item)));
    return { ...data.account, receipt: data.receipt };
  }, []);

  const deleteAccount = useCallback(async (id: string, options?: SaveOptions) => {
    const res = await fetch(`/api/accounts/${id}/`, { method: "DELETE", headers: writeHeaders(options) });
    const data = await parseJson(res);
    if (!res.ok || !data.ok) {
      throw new Error(data.error ?? "删除失败");
    }
    setAccounts((prev) => prev.filter((item) => item.id !== id));
    return data.receipt;
  }, []);

  const countsByStatus = useMemo(() => {
    const counts: Record<string, number> = {
      all: accounts.length,
      active: 0,
      disabled: 0,
      pending: 0,
      locked: 0,
    };
    for (const item of accounts) counts[item.status] = (counts[item.status] ?? 0) + 1;
    return counts;
  }, [accounts]);

  const value = useMemo(
    () => ({
      accounts,
      loading,
      error,
      refresh,
      getById,
      createAccount,
      updateAccount,
      deleteAccount,
      countsByStatus,
    }),
    [
      accounts,
      loading,
      error,
      refresh,
      getById,
      createAccount,
      updateAccount,
      deleteAccount,
      countsByStatus,
    ],
  );

  return (
    <AccountsStoreContext.Provider value={value}>{children}</AccountsStoreContext.Provider>
  );
}

export function useAccountsStore() {
  const ctx = useContext(AccountsStoreContext);
  if (!ctx) throw new Error("useAccountsStore must be used within AccountsStoreProvider");
  return ctx;
}

/** @deprecated use useAccountsStore */
export const useDemoStore = useAccountsStore;
