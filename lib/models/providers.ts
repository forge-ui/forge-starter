export type ProviderKind = "commercial" | "open_source";

export type ModelProvider = {
  id: string;
  name: string;
  kind: ProviderKind;
  icon: string;
  defaultApiBase: string;
  defaultModel: string;
  models: string[];
  local?: boolean;
};

/** Featured catalog copied from 智能体工场 `provider-catalog`. */
export const MODEL_PROVIDERS: readonly ModelProvider[] = [
  {
    id: "model_openai_provider",
    name: "OpenAI",
    kind: "commercial",
    icon: "/provider-icons/model_openai_provider.svg",
    defaultApiBase: "https://api.openai.com/v1",
    defaultModel: "gpt-4o-mini",
    models: ["gpt-4o-mini", "gpt-4o", "o4-mini"],
  },
  {
    id: "model_anthropic_provider",
    name: "Anthropic",
    kind: "commercial",
    icon: "/provider-icons/model_anthropic_provider.svg",
    defaultApiBase: "https://api.anthropic.com/v1",
    defaultModel: "claude-sonnet-4-5",
    models: ["claude-sonnet-4-5", "claude-haiku-4-5"],
  },
  {
    id: "model_gemini_provider",
    name: "Google Gemini",
    kind: "commercial",
    icon: "/provider-icons/model_gemini_provider.svg",
    defaultApiBase: "https://generativelanguage.googleapis.com/v1beta/openai",
    defaultModel: "gemini-2.5-flash",
    models: ["gemini-2.5-flash", "gemini-2.5-pro"],
  },
  {
    id: "model_deepseek_provider",
    name: "DeepSeek",
    kind: "commercial",
    icon: "/provider-icons/model_deepseek_provider.svg",
    defaultApiBase: "https://api.deepseek.com/v1",
    defaultModel: "deepseek-chat",
    models: ["deepseek-chat", "deepseek-reasoner"],
  },
  {
    id: "aliyun_bai_lian_model_provider",
    name: "阿里云百炼",
    kind: "commercial",
    icon: "/provider-icons/aliyun_bai_lian_model_provider.svg",
    defaultApiBase: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    defaultModel: "qwen-plus",
    models: ["qwen-plus", "qwen-turbo", "qwen-max"],
  },
  {
    id: "model_volcanic_engine_provider",
    name: "火山引擎",
    kind: "commercial",
    icon: "/provider-icons/model_volcanic_engine_provider.svg",
    defaultApiBase: "https://ark.cn-beijing.volces.com/api/v3",
    defaultModel: "doubao-pro-32k",
    models: ["doubao-pro-32k", "doubao-lite-32k"],
  },
  {
    id: "model_zhipu_provider",
    name: "智谱 AI",
    kind: "commercial",
    icon: "/provider-icons/model_zhipu_provider.svg",
    defaultApiBase: "https://open.bigmodel.cn/api/paas/v4",
    defaultModel: "glm-4-flash",
    models: ["glm-4-flash", "glm-4"],
  },
  {
    id: "model_kimi_provider",
    name: "Kimi",
    kind: "commercial",
    icon: "/provider-icons/model_kimi_provider.svg",
    defaultApiBase: "https://api.moonshot.cn/v1",
    defaultModel: "moonshot-v1-8k",
    models: ["moonshot-v1-8k", "moonshot-v1-32k", "kimi-k2-turbo-preview"],
  },
  {
    id: "model_minimax_provider",
    name: "MiniMax",
    kind: "commercial",
    icon: "/provider-icons/model_minimax_provider.svg",
    defaultApiBase: "https://api.minimax.chat/v1",
    defaultModel: "MiniMax-Text-01",
    models: ["MiniMax-Text-01"],
  },
  {
    id: "model_siliconCloud_provider",
    name: "SiliconFlow",
    kind: "commercial",
    icon: "/provider-icons/model_siliconCloud_provider.svg",
    defaultApiBase: "https://api.siliconflow.cn/v1",
    defaultModel: "Qwen/Qwen2.5-7B-Instruct",
    models: ["Qwen/Qwen2.5-7B-Instruct", "deepseek-ai/DeepSeek-V3"],
  },
  {
    id: "model_ollama_provider",
    name: "Ollama",
    kind: "open_source",
    icon: "/provider-icons/model_ollama_provider.svg",
    defaultApiBase: "http://127.0.0.1:11434/v1",
    defaultModel: "llama3.1",
    models: ["llama3.1", "qwen2.5", "deepseek-r1"],
    local: true,
  },
  {
    id: "model_vllm_provider",
    name: "vLLM",
    kind: "open_source",
    icon: "/provider-icons/model_vllm_provider.svg",
    defaultApiBase: "http://127.0.0.1:8000/v1",
    defaultModel: "qwen2.5",
    models: ["qwen2.5"],
    local: true,
  },
  {
    id: "model_xinference_provider",
    name: "Xinference",
    kind: "open_source",
    icon: "/provider-icons/model_xinference_provider.svg",
    defaultApiBase: "http://127.0.0.1:9997/v1",
    defaultModel: "qwen2.5-instruct",
    models: ["qwen2.5-instruct"],
    local: true,
  },
  {
    id: "model_local_provider",
    name: "本地模型",
    kind: "open_source",
    icon: "/provider-icons/model_local_provider.svg",
    defaultApiBase: "http://127.0.0.1:8080/v1",
    defaultModel: "local-model",
    models: ["local-model"],
    local: true,
  },
];

const ENV_PROVIDER_ALIAS: Record<string, string> = {
  dashscope: "aliyun_bai_lian_model_provider",
  aliyun: "aliyun_bai_lian_model_provider",
  openai: "model_openai_provider",
  deepseek: "model_deepseek_provider",
  moonshot: "model_kimi_provider",
  siliconflow: "model_siliconCloud_provider",
  ollama: "model_ollama_provider",
};

export function isModelProviderId(value: string) {
  return MODEL_PROVIDERS.some((item) => item.id === value);
}

export function resolveProviderId(value: string) {
  const trimmed = value.trim();
  if (isModelProviderId(trimmed)) return trimmed;
  return ENV_PROVIDER_ALIAS[trimmed] || trimmed;
}

export function modelProviderById(id: string) {
  return MODEL_PROVIDERS.find((item) => item.id === id);
}

export function defaultApiBaseForProvider(id: string) {
  return modelProviderById(id)?.defaultApiBase ?? "";
}

export const MODEL_TYPE_OPTIONS = [
  { value: "LLM", label: "大语言模型" },
  { value: "EMBEDDING", label: "向量模型" },
  { value: "RERANKER", label: "重排模型" },
  { value: "IMAGE", label: "图像理解" },
] as const;

export function modelTypeLabel(value?: string) {
  return MODEL_TYPE_OPTIONS.find((item) => item.value === value)?.label || value || "大语言模型";
}
