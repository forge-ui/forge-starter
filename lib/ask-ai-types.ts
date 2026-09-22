export const ASK_AI_ENV_MODEL_ID = "env";

export type AskAiRuntimeSource = "model" | "env" | "none";

export type AskAiModelOption = {
  id: string;
  label: string;
  modelName: string;
  provider: string;
  isDefault: boolean;
};

export type AskAiRuntimePublic = {
  configured: boolean;
  source: AskAiRuntimeSource;
  selectedId?: string;
  model?: string;
  name?: string;
  provider?: string;
  models: AskAiModelOption[];
};
