import type { Run, RunStatus, RunTask } from "./types";

export const MAX_RUN_TASKS = 30;

export function beginTask(run: Run, id: string, title: string, meta?: string): RunTask {
  const task: RunTask = { id, title, status: "running", ...(meta ? { meta } : {}) };
  run.tasks = [...(run.tasks ?? []), task].slice(-MAX_RUN_TASKS);
  return task;
}

export function settleInteractionTask(run: Run, interactionId: string, meta: string) {
  for (const task of run.tasks ?? []) {
    if (task.interactionId === interactionId && (task.status === "waiting-user" || task.status === "waiting-external")) {
      task.status = "completed";
      task.meta = meta;
    }
  }
}

export function settleUnfinishedTasks(run: Run, status: RunStatus) {
  if (status !== "cancelled" && status !== "failed") return;
  for (const task of run.tasks ?? []) {
    if (["running", "waiting-user", "waiting-external"].includes(task.status)) {
      task.status = status;
      task.meta = status === "cancelled" ? "本次操作已取消" : "此步骤未完成";
    }
  }
}

/** A page can cancel a run outside the engine; reflect that terminal state on restore. */
export function publicRunTasks(run: Run): Array<Omit<RunTask, "interactionId">> {
  return (run.tasks ?? []).slice(-MAX_RUN_TASKS).map(({ id, title, status, meta }) => {
    if ((run.status === "cancelled" || run.status === "failed") && ["running", "waiting-user", "waiting-external"].includes(status)) {
      return { id, title, status: run.status, meta: run.status === "cancelled" ? "本次操作已取消" : "此步骤未完成" };
    }
    return { id, title, status, ...(meta ? { meta } : {}) };
  });
}
