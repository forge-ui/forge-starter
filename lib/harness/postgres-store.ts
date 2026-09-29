import { and, desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { harnessRuns } from "@/lib/db/schema";
import { HarnessError, jsonValue, type Run, type TaskStore } from "./types";

type StoredRun = typeof harnessRuns.$inferSelect;

function snapshot(run: Run) {
  if (!run.id || !run.ownerId || !run.applicationId || !run.buildId) throw new HarnessError("任务归属信息不完整", 400);
  if (!Number.isSafeInteger(run.revision) || run.revision < 0) throw new HarnessError("任务版本无效", 400);
  const state = jsonValue(run);
  const updatedAt = new Date(state.updatedAt);
  if (!Number.isFinite(updatedAt.getTime())) throw new HarnessError("任务更新时间无效", 400);
  return { state, updatedAt };
}

function restore(row: StoredRun): Run {
  // Never let JSON state override the indexed ownership/version columns.
  return jsonValue({
    ...(row.state as Run),
    id: row.id,
    ownerId: row.ownerId,
    applicationId: row.applicationId,
    buildId: row.buildId,
    revision: row.revision,
    updatedAt: row.updatedAt.toISOString(),
  });
}

/** Server adapter: no database connection is opened until an operation is called. */
export function createPostgresTaskStore(): TaskStore {
  return {
    async create(run) {
      const { state, updatedAt } = snapshot(run);
      const inserted = await getDb().insert(harnessRuns).values({
        id: state.id,
        ownerId: state.ownerId,
        applicationId: state.applicationId,
        buildId: state.buildId,
        revision: state.revision,
        state,
        updatedAt,
      }).onConflictDoNothing().returning({ id: harnessRuns.id });
      if (!inserted.length) throw new HarnessError("任务标识已存在，请重新创建");
    },

    async load(id, ownerId, applicationId) {
      const [row] = await getDb().select().from(harnessRuns).where(and(
        eq(harnessRuns.id, id),
        eq(harnessRuns.ownerId, ownerId),
        eq(harnessRuns.applicationId, applicationId),
      ));
      return row ? restore(row) : null;
    },

    async save(run, expectedRevision) {
      if (!Number.isSafeInteger(expectedRevision) || expectedRevision < 0 || run.revision !== expectedRevision + 1) {
        throw new HarnessError("任务版本必须递增一次", 400);
      }
      const { state, updatedAt } = snapshot(run);
      const saved = await getDb().update(harnessRuns).set({
        revision: state.revision,
        state,
        updatedAt,
      }).where(and(
        eq(harnessRuns.id, state.id),
        eq(harnessRuns.ownerId, state.ownerId),
        eq(harnessRuns.applicationId, state.applicationId),
        eq(harnessRuns.buildId, state.buildId),
        eq(harnessRuns.revision, expectedRevision),
      )).returning({ id: harnessRuns.id });
      return saved.length === 1;
    },

    async list(ownerId, applicationId, limit) {
      const count = Number.isFinite(limit) ? Math.max(0, Math.min(20, Math.trunc(limit))) : 20;
      if (!count) return [];
      const rows = await getDb().select().from(harnessRuns).where(and(
        eq(harnessRuns.ownerId, ownerId),
        eq(harnessRuns.applicationId, applicationId),
      )).orderBy(desc(harnessRuns.updatedAt), desc(harnessRuns.id)).limit(count);
      return rows.map(restore);
    },
  };
}

export const postgresTaskStore = createPostgresTaskStore();
