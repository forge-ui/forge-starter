/** Portable knowledge retrieval. No framework, model, storage, or business imports. */
export type KnowledgeSource = {
  readonly path: string;
  readonly symbol?: string;
  /** Revision of the source, not a claim that a generated explanation is verified. */
  readonly version: string;
};

export type KnowledgeSuggestion = {
  readonly label: string;
  readonly question: string;
  /** All capabilities must be available before this suggestion can be shown. */
  readonly capabilityIds: readonly string[];
};

export type KnowledgeEntry = {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly keywords: readonly string[];
  /** All referenced capabilities must be allowed. Split mixed-visibility knowledge. */
  readonly capabilityIds: readonly string[];
  readonly platformId: string;
  readonly buildId: string;
  readonly source: KnowledgeSource;
  readonly relatedSources?: readonly KnowledgeSource[];
  readonly prerequisites?: readonly string[];
  readonly nextSteps?: readonly KnowledgeSuggestion[];
};

export type KnowledgeQuery = {
  readonly query: string;
  readonly platformId: string;
  readonly buildId: string;
  /** Obtain from the authenticated tool registry, never directly from user input. */
  readonly allowedCapabilityIds: readonly string[];
  readonly currentCapabilityIds?: readonly string[];
  readonly maxEntries?: number;
  /** Exact UTF-16 character budget for context, including JSON and separators. */
  readonly maxChars?: number;
};

export type KnowledgeResult = {
  entries: KnowledgeEntry[];
  /** Evidence data for a model prompt; it is not an instruction or tool permission. */
  context: string;
  usedChars: number;
  omittedCount: number;
};

function normalize(value: string) {
  return value.normalize("NFKC").toLowerCase().replace(/\s+/g, " ").trim();
}

function limit(value: number | undefined, fallback: number, ceiling: number) {
  if (value === undefined) return fallback;
  return Number.isFinite(value) ? Math.max(0, Math.min(ceiling, Math.floor(value))) : 0;
}

function allowed(ids: readonly string[], capabilities: ReadonlySet<string>) {
  // Unscoped records fail closed. Public knowledge needs an explicit public capability.
  return ids.length > 0 && ids.every((id) => capabilities.has(id));
}

function relevance(entry: KnowledgeEntry, query: string, current: ReadonlySet<string>) {
  let score = entry.capabilityIds.some((id) => current.has(id)) ? 4 : 0;
  if (!query) return score + 1;
  const title = normalize(entry.title);
  const summary = normalize(entry.summary);
  const keywords = [...new Set(entry.keywords.map(normalize).filter(Boolean))];
  for (const keyword of keywords) if (query.includes(keyword)) score += 8 + Math.min(keyword.length, 8);
  if (title.includes(query)) score += 16;
  if (summary.includes(query)) score += 6;
  // English identifiers and separated phrases complement authored Chinese keywords.
  for (const term of new Set(query.split(/[^\p{L}\p{N}_.-]+/u).filter((part) => part.length > 1))) {
    if (entry.capabilityIds.some((id) => normalize(id) === term)) score += 24;
    else if (title.includes(term)) score += 5;
    else if (summary.includes(term)) score += 2;
  }
  return score;
}

/**
 * Exact deployment isolation precedes ranking. Complete entries are selected within
 * budget so prerequisites and source evidence cannot be cut off by text truncation.
 * Filtering informs the model; the execution adapter must still authorize each call.
 */
export function retrieveKnowledge(catalog: readonly KnowledgeEntry[], request: KnowledgeQuery): KnowledgeResult {
  const allowedCapabilities = new Set(request.allowedCapabilityIds);
  const current = new Set(request.currentCapabilityIds ?? []);
  const query = normalize(request.query);
  const maxEntries = limit(request.maxEntries, 6, 50);
  const maxChars = limit(request.maxChars, 6_000, 100_000);
  const candidates = catalog
    .filter((entry) => entry.platformId === request.platformId && entry.buildId === request.buildId)
    .filter((entry) => allowed(entry.capabilityIds, allowedCapabilities))
    .map((entry) => ({ entry, score: relevance(entry, query, current) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || (a.entry.id < b.entry.id ? -1 : a.entry.id > b.entry.id ? 1 : 0));
  const entries: KnowledgeEntry[] = [];
  const sections: string[] = [];
  const seen = new Set<string>();
  let usedChars = 0;
  for (const { entry } of candidates) {
    if (entries.length >= maxEntries) break;
    if (seen.has(entry.id)) continue;
    const visible: KnowledgeEntry = {
      ...entry,
      nextSteps: entry.nextSteps?.filter((step) => allowed(step.capabilityIds, allowedCapabilities)),
    };
    const section = JSON.stringify(visible);
    const cost = section.length + (sections.length ? 1 : 0);
    if (usedChars + cost > maxChars) continue;
    seen.add(entry.id);
    entries.push(visible);
    sections.push(section);
    usedChars += cost;
  }
  return { entries, context: sections.join("\n"), usedChars, omittedCount: candidates.length - entries.length };
}
