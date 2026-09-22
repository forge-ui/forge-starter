import { desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { aiModels, type AiModelRow } from "@/lib/db/schema";
import { formatRbacDate, uniqueConstraintMessage } from "@/lib/rbac/constants";
import {
  defaultApiBaseForProvider,
  isModelProviderId,
  modelProviderById,
  resolveProviderId,
} from "./providers";
import { probeModel } from "./runtime";
import {
  isModelStatus,
  type AiModel,
  type AiModelInput,
  type ResolvedAiModel,
} from "./types";

function maskKey(apiKey: string) {
  const value = apiKey.trim();
  if (!value) return "";
  if (value.length <= 8) return "••••";
  return `${value.slice(0, 3)}••••${value.slice(-4)}`;
}

function toRecord(row: AiModelRow): AiModel {
  const provider = isModelProviderId(row.provider) ? row.provider : resolveProviderId(row.provider);
  return {
    id: row.id,
    name: row.name,
    provider,
    providerLabel: modelProviderById(provider)?.name ?? provider,
    modelName: row.modelName,
    apiBase: row.apiBase,
    apiKeyMasked: maskKey(row.apiKey),
    hasKey: Boolean(row.apiKey.trim()),
    status: isModelStatus(row.status) ? row.status : "disabled",
    isDefault: row.isDefault,
    notes: row.notes,
    lastProbeAt: row.lastProbeAt?.toISOString() ?? null,
    lastProbeOk: row.lastProbeOk,
    lastProbeMessage: row.lastProbeMessage,
    created: formatRbacDate(row.createdAt),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function toResolved(row: AiModelRow): ResolvedAiModel {
  const provider = isModelProviderId(row.provider) ? row.provider : resolveProviderId(row.provider);
  return {
    id: row.id,
    name: row.name,
    provider,
    modelName: row.modelName,
    apiBase: row.apiBase || defaultApiBaseForProvider(provider),
    apiKey: row.apiKey,
  };
}

function normalizeInput(input: AiModelInput, existingKey?: string) {
  const name = input.name.trim();
  if (!name) throw new Error("请填写模型名称");
  const provider = resolveProviderId(input.provider);
  if (!isModelProviderId(provider)) throw new Error("供应商无效");
  const modelName = input.modelName.trim();
  if (!modelName) throw new Error("请填写模型 ID");
  if (!isModelStatus(input.status)) throw new Error("状态无效");
  const apiKey = input.apiKey?.trim() || existingKey || "";
  const local = modelProviderById(provider)?.local;
  if (!apiKey && !local) throw new Error("请填写 API Key");
  return {
    name,
    provider,
    modelName,
    apiBase: input.apiBase?.trim() || defaultApiBaseForProvider(provider),
    apiKey: apiKey || (local ? "ollama" : ""),
    status: input.status,
    isDefault: Boolean(input.isDefault),
    notes: input.notes?.trim() ?? "",
  };
}

async function clearOtherDefaults(exceptId?: string) {
  const db = getDb();
  const rows = await db.select().from(aiModels);
  for (const row of rows) {
    if (!row.isDefault) continue;
    if (exceptId && row.id === exceptId) continue;
    await db
      .update(aiModels)
      .set({ isDefault: false, updatedAt: new Date() })
      .where(eq(aiModels.id, row.id));
  }
}

async function seedFromEnvIfEmpty() {
  const db = getDb();
  const existing = await db.select({ id: aiModels.id }).from(aiModels).limit(1);
  if (existing.length) return;
  const apiKey = process.env.ASK_AI_LLM_API_KEY?.trim() || "";
  if (!apiKey || apiKey.startsWith("replace-with-") || apiKey.startsWith("请替换")) return;
  const provider = resolveProviderId(process.env.ASK_AI_LLM_PROVIDER?.trim() || "dashscope");
  await db.insert(aiModels).values({
    name: "默认对话模型",
    provider,
    modelName: process.env.ASK_AI_LLM_MODEL?.trim() || "qwen-plus",
    apiBase: process.env.ASK_AI_LLM_BASE_URL?.trim() || defaultApiBaseForProvider(provider),
    apiKey,
    status: "active",
    isDefault: true,
    notes: "由 ASK_AI_LLM_* 环境变量导入",
  });
}

export async function listAiModels(): Promise<AiModel[]> {
  await seedFromEnvIfEmpty();
  const db = getDb();
  const rows = await db.select().from(aiModels).orderBy(desc(aiModels.createdAt));
  return rows.map(toRecord);
}

export async function getAiModelById(id: string): Promise<AiModel | null> {
  const db = getDb();
  const [row] = await db.select().from(aiModels).where(eq(aiModels.id, id)).limit(1);
  return row ? toRecord(row) : null;
}

export async function resolveAiModel(id?: string | null): Promise<ResolvedAiModel | null> {
  await seedFromEnvIfEmpty();
  const db = getDb();
  if (id) {
    const [row] = await db.select().from(aiModels).where(eq(aiModels.id, id)).limit(1);
    if (row && row.status === "active") return toResolved(row);
    return null;
  }
  const rows = await db.select().from(aiModels).orderBy(desc(aiModels.createdAt));
  const active = rows.filter((row) => row.status === "active" && row.apiKey.trim());
  const chosen = active.find((row) => row.isDefault) ?? active[0];
  return chosen ? toResolved(chosen) : null;
}

export async function createAiModel(input: AiModelInput): Promise<AiModel> {
  const next = normalizeInput(input);
  const db = getDb();
  try {
    if (!next.isDefault && next.status === "active") {
      const rows = await db
        .select({ isDefault: aiModels.isDefault, status: aiModels.status })
        .from(aiModels);
      const hasDefault = rows.some((row) => row.isDefault && row.status === "active");
      if (!hasDefault) next.isDefault = true;
    }
    if (next.isDefault) await clearOtherDefaults();
    const [row] = await db.insert(aiModels).values(next).returning();
    if (!row) throw new Error("创建失败");
    return toRecord(row);
  } catch (error) {
    throw new Error(uniqueConstraintMessage(error, "模型名称已被占用"));
  }
}

export async function updateAiModel(id: string, input: AiModelInput): Promise<AiModel> {
  const db = getDb();
  const [current] = await db.select().from(aiModels).where(eq(aiModels.id, id)).limit(1);
  if (!current) throw new Error("模型不存在");
  const next = normalizeInput(input, current.apiKey);
  try {
    if (next.isDefault) await clearOtherDefaults(id);
    const [row] = await db
      .update(aiModels)
      .set({ ...next, updatedAt: new Date() })
      .where(eq(aiModels.id, id))
      .returning();
    if (!row) throw new Error("模型不存在");
    return toRecord(row);
  } catch (error) {
    throw new Error(uniqueConstraintMessage(error, "模型名称已被占用"));
  }
}

export async function deleteAiModel(id: string) {
  const db = getDb();
  const [row] = await db.delete(aiModels).where(eq(aiModels.id, id)).returning();
  if (!row) throw new Error("模型不存在");
}

export async function probeAiModel(id: string) {
  const db = getDb();
  const [row] = await db.select().from(aiModels).where(eq(aiModels.id, id)).limit(1);
  if (!row) throw new Error("模型不存在");
  try {
    const preview = await probeModel(toResolved(row));
    const [updated] = await db
      .update(aiModels)
      .set({
        lastProbeAt: new Date(),
        lastProbeOk: true,
        lastProbeMessage: preview,
        updatedAt: new Date(),
      })
      .where(eq(aiModels.id, id))
      .returning();
    return toRecord(updated ?? row);
  } catch (error) {
    const message = error instanceof Error ? error.message : "测连失败";
    const [updated] = await db
      .update(aiModels)
      .set({
        lastProbeAt: new Date(),
        lastProbeOk: false,
        lastProbeMessage: message.slice(0, 200),
        updatedAt: new Date(),
      })
      .where(eq(aiModels.id, id))
      .returning();
    throw Object.assign(new Error(message), { model: updated ? toRecord(updated) : toRecord(row) });
  }
}
