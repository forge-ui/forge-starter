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
import { notifyAskAiRuntimeChanged } from "@/lib/ask-ai";
import type { ModelProvider } from "@/lib/models/providers";
import type { AiModel, AiModelInput } from "@/lib/models/types";
import { useAccess } from "@/components/access-store";

type ModelsStoreValue = {
  models: AiModel[];
  providers: ModelProvider[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  getById: (id: string) => AiModel | undefined;
  createModel: (input: AiModelInput) => Promise<AiModel>;
  updateModel: (id: string, input: AiModelInput) => Promise<AiModel>;
  deleteModel: (id: string) => Promise<void>;
  probeModel: (id: string) => Promise<AiModel>;
  countsByStatus: Record<string, number>;
};

const ModelsStoreContext = createContext<ModelsStoreValue | null>(null);

type ModelsResponse = {
  models?: AiModel[];
  model?: AiModel;
  providers?: ModelProvider[];
};

export function ModelsStoreProvider({ children }: { children: ReactNode }) {
  const { ready, canRead } = useAccess();
  const [models, setModels] = useState<AiModel[]>([]);
  const [providers, setProviders] = useState<ModelProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/models/");
      const data = await parseApiJson<ModelsResponse>(res);
      if (!res.ok || !data.ok) {
        setError(data.error ?? "加载模型失败");
        setModels([]);
        return;
      }
      setModels(data.models ?? []);
      setProviders(data.providers ?? []);
      setError(null);
    } catch {
      setError("网络错误，无法加载模型");
      setModels([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!canRead("models")) {
      setModels([]);
      setProviders([]);
      setError(null);
      setLoading(false);
      return;
    }
    void refresh();
  }, [ready, canRead, refresh]);

  const getById = useCallback(
    (id: string) => models.find((item) => item.id === id),
    [models],
  );

  const createModel = useCallback(async (input: AiModelInput) => {
    const res = await apiFetch("/api/models/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = await parseApiJson<ModelsResponse>(res);
    if (!res.ok || !data.ok || !data.model) {
      throw new Error(data.error ?? "创建失败");
    }
    setModels((prev) => [data.model!, ...prev.filter((item) => item.id !== data.model!.id)]);
    notifyAskAiRuntimeChanged();
    return data.model;
  }, []);

  const updateModel = useCallback(async (id: string, input: AiModelInput) => {
    const res = await apiFetch(`/api/models/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = await parseApiJson<ModelsResponse>(res);
    if (!res.ok || !data.ok || !data.model) {
      throw new Error(data.error ?? "更新失败");
    }
    setModels((prev) => prev.map((item) => (item.id === id ? data.model! : item)));
    notifyAskAiRuntimeChanged();
    return data.model;
  }, []);

  const deleteModel = useCallback(async (id: string) => {
    const res = await apiFetch(`/api/models/${id}/`, { method: "DELETE" });
    const data = await parseApiJson<ModelsResponse>(res);
    if (!res.ok || !data.ok) {
      throw new Error(data.error ?? "删除失败");
    }
    setModels((prev) => prev.filter((item) => item.id !== id));
    notifyAskAiRuntimeChanged();
  }, []);

  const probeModel = useCallback(async (id: string) => {
    const res = await apiFetch(`/api/models/${id}/probe/`, { method: "POST" });
    const data = await parseApiJson<ModelsResponse>(res);
    if (data.model) {
      setModels((prev) => prev.map((item) => (item.id === id ? data.model! : item)));
    }
    if (!res.ok || !data.ok || !data.model) {
      throw new Error(data.error ?? "测连失败");
    }
    return data.model;
  }, []);

  const countsByStatus = useMemo(() => {
    const counts: Record<string, number> = { all: models.length, active: 0, disabled: 0 };
    for (const item of models) counts[item.status] = (counts[item.status] ?? 0) + 1;
    return counts;
  }, [models]);

  const value = useMemo(
    () => ({
      models,
      providers,
      loading,
      error,
      refresh,
      getById,
      createModel,
      updateModel,
      deleteModel,
      probeModel,
      countsByStatus,
    }),
    [
      models,
      providers,
      loading,
      error,
      refresh,
      getById,
      createModel,
      updateModel,
      deleteModel,
      probeModel,
      countsByStatus,
    ],
  );

  return <ModelsStoreContext.Provider value={value}>{children}</ModelsStoreContext.Provider>;
}

export function useModelsStore() {
  const ctx = useContext(ModelsStoreContext);
  if (!ctx) throw new Error("useModelsStore must be used within ModelsStoreProvider");
  return ctx;
}
