import { runAgentTurn } from "@/lib/agent/loop";
import type { AgentBlock } from "@/lib/agent/types";
import type { AccessContext } from "@/lib/rbac/access";
import { listAdminAccounts } from "@/lib/accounts/service";
import { ACCOUNT_STATUS_META } from "@/lib/accounts/types";
import {
  ASK_AI_ENV_MODEL_ID,
  type AskAiModelOption,
  type AskAiRuntimePublic,
  type AskAiRuntimeSource,
} from "@/lib/ask-ai-types";
import { modelProviderById } from "@/lib/models/providers";
import { listAiModels, resolveAiModel } from "@/lib/models/service";
import type { ResolvedAiModel } from "@/lib/models/types";
import {
  ASK_AI_DEMOS,
  matchAskAiDemo,
  type AskAiAccountSnapshot,
  type AskAiDemoId,
} from "@/lib/ask-ai-demos";

export type { AskAiAccountSnapshot, AskAiRuntimePublic, AskAiRuntimeSource };

export type AskAiLlmConfig = {
  provider: string;
  model: string;
  baseUrl: string;
  apiKey: string;
};

type AskAiRuntime = AskAiLlmConfig & {
  source: AskAiRuntimeSource;
  id?: string;
  name?: string;
};

export type AskAiChatResult = {
  text: string;
  live: boolean;
  model?: string;
  demoId?: AskAiDemoId;
  snapshot?: AskAiAccountSnapshot;
  links: Array<{ label: string; href: string }>;
  blocks: AgentBlock[];
};

const PROVIDER_BASE: Record<string, string> = {
  dashscope: "https://dashscope.aliyuncs.com/compatible-mode/v1",
  openai: "https://api.openai.com/v1",
  deepseek: "https://api.deepseek.com/v1",
};

function readEnv(name: string) {
  return process.env[name]?.trim() || "";
}

function isUsableKey(apiKey: string) {
  return Boolean(apiKey) && !apiKey.startsWith("请替换") && !apiKey.startsWith("replace-with-");
}

export function resolveAskAiLlmConfig(): AskAiLlmConfig {
  const provider = readEnv("ASK_AI_LLM_PROVIDER") || "dashscope";
  const model = readEnv("ASK_AI_LLM_MODEL") || "qwen-plus";
  return {
    provider,
    model,
    baseUrl: readEnv("ASK_AI_LLM_BASE_URL") || PROVIDER_BASE[provider] || PROVIDER_BASE.dashscope,
    apiKey: readEnv("ASK_AI_LLM_API_KEY"),
  };
}

function providerLabel(provider: string) {
  return modelProviderById(provider)?.name ?? provider;
}

function runtimeFromResolved(row: ResolvedAiModel): AskAiRuntime {
  return {
    id: row.id,
    name: row.name,
    provider: row.provider,
    model: row.modelName,
    baseUrl: row.apiBase,
    apiKey: row.apiKey,
    source: "model",
  };
}

function runtimeFromEnv(): AskAiRuntime | null {
  const env = resolveAskAiLlmConfig();
  if (!isUsableKey(env.apiKey)) return null;
  return { ...env, id: ASK_AI_ENV_MODEL_ID, source: "env", name: env.model };
}

function optionFromRuntime(runtime: AskAiRuntime, isDefault = true): AskAiModelOption {
  return {
    id: runtime.id || ASK_AI_ENV_MODEL_ID,
    label: runtime.name || runtime.model,
    modelName: runtime.model,
    provider: providerLabel(runtime.provider),
    isDefault,
  };
}

export async function listAskAiModelOptions(): Promise<AskAiModelOption[]> {
  try {
    const rows = await listAiModels();
    const usable = rows.filter((row) => row.status === "active" && row.hasKey);
    if (usable.length) {
      return usable.map((row) => ({
        id: row.id,
        label: row.name,
        modelName: row.modelName,
        provider: row.providerLabel,
        isDefault: row.isDefault,
      }));
    }
  } catch {
    /* 无库或表未推时退回环境变量 */
  }
  const env = runtimeFromEnv();
  return env ? [optionFromRuntime(env)] : [];
}

async function resolveAskAiRuntime(modelId?: string | null): Promise<AskAiRuntime> {
  if (modelId === ASK_AI_ENV_MODEL_ID) {
    const env = runtimeFromEnv();
    if (env) return env;
    throw new Error("环境变量模型不可用");
  }
  if (modelId) {
    try {
      const row = await resolveAiModel(modelId);
      if (row && isUsableKey(row.apiKey)) return runtimeFromResolved(row);
    } catch {
      /* 无库时下面会给出明确错误 */
    }
    throw new Error("所选模型不可用，请换一个或到模型管理检查");
  }
  try {
    const row = await resolveAiModel();
    if (row && isUsableKey(row.apiKey)) return runtimeFromResolved(row);
  } catch {
    /* 无库或表未推时退回环境变量 */
  }
  return runtimeFromEnv() ?? { ...resolveAskAiLlmConfig(), source: "none" };
}

export async function peekAskAiRuntime(): Promise<AskAiRuntimePublic> {
  const models = await listAskAiModelOptions();
  const selected = models.find((item) => item.isDefault) ?? models[0];
  if (!selected) {
    return { configured: false, source: "none", models: [] };
  }
  return {
    configured: true,
    source: selected.id === ASK_AI_ENV_MODEL_ID ? "env" : "model",
    selectedId: selected.id,
    model: selected.modelName,
    name: selected.label,
    provider: selected.provider,
    models,
  };
}

/** @deprecated 用 peekAskAiRuntime；同步版只看环境变量，会漏掉库里的模型。 */
export function askAiLlmConfigured() {
  return isUsableKey(resolveAskAiLlmConfig().apiKey);
}

function toResolvedModel(runtime: AskAiRuntime, modelName: string): ResolvedAiModel {
  return {
    id: runtime.id || "ask-ai-env",
    name: runtime.name || modelName,
    provider: runtime.provider,
    modelName,
    apiBase: runtime.baseUrl,
    apiKey: runtime.apiKey,
  };
}

export async function loadAskAiSnapshot(): Promise<AskAiAccountSnapshot> {
  const empty: AskAiAccountSnapshot = {
    ready: false,
    total: 0,
    byStatus: { active: 0, disabled: 0, pending: 0, locked: 0 },
    byRole: {},
    recent: [],
  };
  try {
    const accounts = await listAdminAccounts();
    const byStatus = { ...empty.byStatus };
    const byRole: Record<string, number> = {};
    for (const account of accounts) {
      byStatus[account.status] += 1;
      byRole[account.role] = (byRole[account.role] ?? 0) + 1;
    }
    return {
      ready: true,
      total: accounts.length,
      byStatus,
      byRole,
      recent: accounts.slice(0, 5).map((account) => ({
        name: account.name,
        role: account.role,
        status: ACCOUNT_STATUS_META[account.status].label,
      })),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "账号表不可用";
    return {
      ...empty,
      note: message.includes("DATABASE_URL") ? "未配置 DATABASE_URL，账号表读不到" : message,
    };
  }
}

export function askAiDemoLinks(demoId?: AskAiDemoId): Array<{ label: string; href: string }> {
  if (demoId === "rbac") {
    return [
      { label: "打开角色", href: "/roles/" },
      { label: "打开账号管理", href: "/accounts/" },
    ];
  }
  if (demoId === "page") {
    return [
      { label: "打开工作台", href: "/dashboard/" },
      { label: "打开账号管理", href: "/accounts/" },
    ];
  }
  return [{ label: "打开账号管理", href: "/accounts/" }];
}

function snapshotText(snapshot: AskAiAccountSnapshot) {
  if (!snapshot.ready) return snapshot.note || "账号表未就绪。";
  const status = Object.entries(snapshot.byStatus)
    .map(([key, count]) => `${ACCOUNT_STATUS_META[key as keyof typeof ACCOUNT_STATUS_META].label} ${count}`)
    .join("，");
  const roles = Object.entries(snapshot.byRole)
    .map(([role, count]) => `${role} ${count}`)
    .join("，");
  const recent = snapshot.recent
    .map((row) => `${row.name}（${row.role} / ${row.status}）`)
    .join("；");
  return `共 ${snapshot.total} 条业务账号。状态：${status}。角色：${roles || "无"}。最近：${recent || "无"}。`;
}

function localAnswer(question: string, pageLabel: string, snapshot: AskAiAccountSnapshot) {
  const demo = matchAskAiDemo(question);
  if (demo?.id === "page") {
    return `当前在「${pageLabel || "后台"}」。工作台看账号概况，账号管理做 CRUD，角色 / 菜单 / 权限决定侧栏和直链。未接模型时先按这套产品事实答。`;
  }
  if (demo?.id === "next") {
    return snapshot.ready && snapshot.total === 0
      ? "账号表是空的。下一步：打开账号管理新建一条运营号，再去角色勾 accounts:read。demo 登录过了也不等于表里有人。"
      : "下一步通常是确认库已推、在账号管理建运营号、给角色勾 accounts:read。没有 :read 的人直链进不了列表。";
  }
  if (demo?.id === "status") {
    return snapshot.ready
      ? `刚读了账号表：${snapshotText(snapshot)} 点名称进详情，改状态走编辑弹窗。`
      : `账号表还读不到：${snapshot.note || "先配 DATABASE_URL 并 pnpm db:push"}。`;
  }
  if (demo?.id === "rbac") {
    return "新账号不带侧栏。要同时改菜单三处、当前应用勾选、角色的 {module}:read。只改 rbac_menus 目录不会出现入口。";
  }
  return `未接模型，不能查库、填数或导出。可以先问：${ASK_AI_DEMOS.map((item) => item.title).join("；")}。`;
}

export async function answerAskAi(input: {
  question: string;
  context?: string;
  modelId?: string;
  history?: Array<{ role: "user" | "assistant"; content: string }>;
  signal: AbortSignal;
  userId: string;
  access: AccessContext;
}): Promise<AskAiChatResult> {
  const question = input.question.trim();
  const pageLabel = input.context?.trim() || "";
  const demo = matchAskAiDemo(question);
  const runtime = await resolveAskAiRuntime(input.modelId);
  const model = runtime.model;

  if (runtime.source === "none" || !isUsableKey(runtime.apiKey)) {
    const snapshot = await loadAskAiSnapshot();
    return {
      text: localAnswer(question, pageLabel, snapshot),
      live: false,
      demoId: demo?.id,
      snapshot,
      links: askAiDemoLinks(demo?.id),
      blocks: [],
    };
  }

  const loop = await runAgentTurn({
    question,
    pageLabel,
    history: input.history ?? [],
    signal: input.signal,
    userId: input.userId,
    access: input.access,
    model: toResolvedModel(runtime, model),
  });
  return {
    text: loop.text,
    live: true,
    model,
    blocks: loop.blocks,
    links: loop.links.length ? loop.links : askAiDemoLinks(demo?.id),
  };
}
