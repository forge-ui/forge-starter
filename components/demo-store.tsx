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
  INITIAL_RECORDS,
  buildRecord,
  type BusinessRecord,
  type RecordInput,
} from "@/lib/demo/records";

type DemoStoreValue = {
  records: BusinessRecord[];
  getById: (id: string) => BusinessRecord | undefined;
  createRecord: (input: RecordInput) => BusinessRecord;
  updateRecord: (id: string, input: RecordInput) => BusinessRecord | null;
  deleteRecord: (id: string) => void;
  countsByStatus: Record<string, number>;
};

const DemoStoreContext = createContext<DemoStoreValue | null>(null);

export function DemoStoreProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<BusinessRecord[]>(INITIAL_RECORDS);

  const getById = useCallback(
    (id: string) => records.find((item) => item.id === id),
    [records],
  );

  const createRecord = useCallback((input: RecordInput) => {
    const next = buildRecord(input);
    setRecords((prev) => [next, ...prev]);
    return next;
  }, []);

  const updateRecord = useCallback((id: string, input: RecordInput) => {
    let updated: BusinessRecord | null = null;
    setRecords((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        updated = buildRecord(input, item);
        return updated;
      }),
    );
    return updated;
  }, []);

  const deleteRecord = useCallback((id: string) => {
    setRecords((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const countsByStatus = useMemo(() => {
    const counts: Record<string, number> = {
      all: records.length,
      active: 0,
      draft: 0,
      done: 0,
      blocked: 0,
    };
    for (const item of records) counts[item.status] = (counts[item.status] ?? 0) + 1;
    return counts;
  }, [records]);

  const value = useMemo(
    () => ({
      records,
      getById,
      createRecord,
      updateRecord,
      deleteRecord,
      countsByStatus,
    }),
    [records, getById, createRecord, updateRecord, deleteRecord, countsByStatus],
  );

  return <DemoStoreContext.Provider value={value}>{children}</DemoStoreContext.Provider>;
}

export function useDemoStore() {
  const ctx = useContext(DemoStoreContext);
  if (!ctx) throw new Error("useDemoStore must be used within DemoStoreProvider");
  return ctx;
}
