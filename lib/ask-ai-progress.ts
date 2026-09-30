import type { AgentTask } from "@forge-ui-official/core";
import type { RunStatus, RunTask } from "@/lib/harness/types";

export type AskAiTask = Omit<RunTask, "interactionId">;
const statuses = new Set<RunStatus>(["running", "waiting-user", "waiting-external", "completed", "cancelled", "failed"]);

/** Both live responses and restored checkpoints use the same bounded public shape. */
export function parseAskAiTasks(value: unknown): AskAiTask[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  return value.slice(-30).flatMap((item: unknown): AskAiTask[] => {
    if (!item || typeof item !== "object") return [];
    const task = item as Record<string, unknown>;
    if (typeof task.id !== "string" || !task.id || task.id.length > 300 || seen.has(task.id)
      || typeof task.title !== "string" || !task.title.trim() || task.title.length > 1200
      || !statuses.has(task.status as RunStatus)) return [];
    seen.add(task.id);
    return [{ id: task.id, title: task.title, status: task.status as RunStatus,
      ...(typeof task.meta === "string" ? { meta: task.meta.slice(0, 1200) } : {}) }];
  });
}

export function askAiTaskStatus(status: RunStatus) {
  switch (status) {
    case "running": return { label: "进行中", color: "blue" as const };
    case "waiting-user": return { label: "等待补充", color: "yellow" as const };
    case "waiting-external": return { label: "等待页面确认", color: "yellow" as const };
    case "completed": return { label: "已完成", color: "green" as const };
    case "cancelled": return { label: "已取消", color: "grey" as const };
    case "failed": return { label: "未完成", color: "red" as const };
  }
}

/** Core has three execution states. Waiting/cancelled retain their own labeled status. */
export function isAgentTaskRow(task: AskAiTask): task is AskAiTask & AgentTask {
  return task.status === "running" || task.status === "completed" || task.status === "failed";
}
