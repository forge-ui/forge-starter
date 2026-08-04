"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  INITIAL_ACCOUNTS,
  buildAccount,
  type AccountInput,
  type AdminAccount,
} from "@/lib/demo/accounts";

type DemoStoreValue = {
  accounts: AdminAccount[];
  getById: (id: string) => AdminAccount | undefined;
  createAccount: (input: AccountInput) => AdminAccount;
  updateAccount: (id: string, input: AccountInput) => AdminAccount | null;
  deleteAccount: (id: string) => void;
  countsByStatus: Record<string, number>;
};

const DemoStoreContext = createContext<DemoStoreValue | null>(null);

export function DemoStoreProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<AdminAccount[]>(INITIAL_ACCOUNTS);

  const getById = useCallback(
    (id: string) => accounts.find((item) => item.id === id),
    [accounts],
  );

  const createAccount = useCallback((input: AccountInput) => {
    const next = buildAccount(input);
    setAccounts((prev) => [next, ...prev]);
    return next;
  }, []);

  const updateAccount = useCallback((id: string, input: AccountInput) => {
    let updated: AdminAccount | null = null;
    setAccounts((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        updated = buildAccount(input, item);
        return updated;
      }),
    );
    return updated;
  }, []);

  const deleteAccount = useCallback((id: string) => {
    setAccounts((prev) => prev.filter((item) => item.id !== id));
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
      getById,
      createAccount,
      updateAccount,
      deleteAccount,
      countsByStatus,
    }),
    [accounts, getById, createAccount, updateAccount, deleteAccount, countsByStatus],
  );

  return <DemoStoreContext.Provider value={value}>{children}</DemoStoreContext.Provider>;
}

export function useDemoStore() {
  const ctx = useContext(DemoStoreContext);
  if (!ctx) throw new Error("useDemoStore must be used within DemoStoreProvider");
  return ctx;
}
