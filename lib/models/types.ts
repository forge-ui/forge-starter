export type ModelStatus = "active" | "disabled";

export type AiModel = {
  id: string;
  name: string;
  provider: string;
  providerLabel: string;
  modelName: string;
  apiBase: string;
  apiKeyMasked: string;
  hasKey: boolean;
  status: ModelStatus;
  isDefault: boolean;
  notes: string;
  lastProbeAt: string | null;
  lastProbeOk: boolean | null;
  lastProbeMessage: string;
  created: string;
  updatedAt: string;
};

export type AiModelInput = {
  name: string;
  provider: string;
  modelName: string;
  apiBase?: string;
  apiKey?: string;
  status: ModelStatus;
  isDefault?: boolean;
  notes?: string;
};

export type ResolvedAiModel = {
  id: string;
  name: string;
  provider: string;
  modelName: string;
  apiBase: string;
  apiKey: string;
};

export const MODEL_STATUS_META: Record<ModelStatus, { label: string; color: "green" | "grey" }> = {
  active: { label: "启用", color: "green" },
  disabled: { label: "停用", color: "grey" },
};

export function isModelStatus(value: string): value is ModelStatus {
  return value === "active" || value === "disabled";
}
