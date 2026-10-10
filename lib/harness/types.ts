/** Framework-free, JSON-only protocol. Business data and UI are adapter payloads. */
export const HARNESS_VERSION = "forge.harness/v1" as const;
export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };
export type JsonObject = { [key: string]: Json };
export type ToolCall = { id: string; name: string; arguments: string };
export type Message =
  | { role: "system" | "user"; content: string }
  | { role: "assistant"; content: string; toolCalls?: ToolCall[] }
  | { role: "tool"; toolCallId: string; content: string };
export type Capability = { name: string; title?: string; description: string; parameters: Record<string, unknown>; effect: "read" | "page" | "proposal" };
export type Interaction = {
  id: string;
  kind: "question" | "external";
  title: string;
  options: Array<{ id: string; label: string; description?: string }>;
  allowText: boolean;
  multiple?: boolean;
  toolCallId: string;
  capability: string;
  payload?: JsonObject;
};
export type Output = { text: string; data: JsonObject };
export type RunStatus = "running" | "waiting-user" | "waiting-external" | "completed" | "cancelled" | "failed";
/** Observed execution steps only. Waiting is not a successful business commit. */
export type RunTask = {
  id: string;
  title: string;
  status: RunStatus;
  meta?: string;
  /** Internal binding used when a choice or verified page receipt resumes a step. */
  interactionId?: string;
};
export type Run = {
  version: typeof HARNESS_VERSION;
  id: string;
  ownerId: string;
  applicationId: string;
  buildId: string;
  revision: number;
  status: RunStatus;
  goal: string;
  capabilityNames: string[];
  messages: Message[];
  /** Authorized read observations; reset for each request, never model-authored. */
  observations?: Array<{ toolCallId: string; data: JsonObject; summary: string }>;
  pending?: Interaction;
  output: Output;
  exchanges: Array<{ id: string; question: string; output: Output }>;
  events: Array<{ kind: string; label: string; at: string }>;
  /** Optional for tasks persisted before progress tracking was introduced. */
  tasks?: RunTask[];
  lastRequestId: string;
  leaseUntil?: string;
  updatedAt: string;
};
export type RunScope = { ownerId: string; applicationId: string; buildId: string };
export interface TaskStore {
  create(run: Run): Promise<void>;
  load(id: string, ownerId: string, applicationId: string): Promise<Run | null>;
  /** Atomic compare-and-swap. Must never overwrite a newer revision. */
  save(run: Run, expectedRevision: number): Promise<boolean>;
  list(ownerId: string, applicationId: string, limit: number): Promise<Run[]>;
}
export type Input = RunScope & {
  requestId: string;
  runId?: string;
  expectedRevision?: number;
  question: string;
  reply?: { interactionId: string; optionId?: string; optionIds?: string[]; text?: string; cancel?: boolean };
  /** Adapter verifies a durable external receipt before passing this value. */
  receipt?: { interactionId: string; summary: string; data: JsonObject };
  signal?: AbortSignal;
};
export type ToolResult = {
  summary: string;
  data?: JsonObject;
  wait?: Omit<Interaction, "id" | "toolCallId" | "capability">;
  stop?: boolean;
};
export interface HarnessPorts {
  store: TaskStore;
  model: { next(messages: Message[], capabilities: Capability[], signal?: AbortSignal): Promise<{ content: string; toolCalls: ToolCall[] }> };
  capabilities: {
    list(): Promise<Capability[]>;
    invoke(name: string, args: JsonObject, run: Run, signal?: AbortSignal): Promise<ToolResult>;
  };
  context: { resolve(question: string, capabilities: Capability[]): Promise<string> };
  /** Retire outstanding page proposals before cancellation or a new goal. */
  operations: { retire(run: Run): Promise<void> };
  presentation?: { finalize(run: Run): Output };
  id(): string;
  now(): Date;
  limits?: { maxSteps?: number; maxMessages?: number; timeoutMs?: number };
}
export class HarnessError extends Error {
  constructor(message: string, public status = 409) { super(message); }
}
/** Explicitly safe, user-facing adapter failure (not a raw SDK/SQL exception). */
export class ToolInputError extends Error {}
/** Match the HTTP/JSONB representation before storing or comparing state. */
export function jsonValue<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
