import { resolveProviderId } from "./providers";
import type { AiModel } from "./types";
export function matchesModel(row: AiModel, filter: { provider?: string; query?: string; modelType?: string }) {
  const query = filter.query?.trim().toLowerCase();
  return (!filter.provider || resolveProviderId(row.provider) === resolveProviderId(filter.provider))
    && (!filter.modelType || filter.modelType === "LLM")
    && (!query || [row.name, row.modelName, row.providerLabel].some((value) => value.toLowerCase().includes(query)));
}
