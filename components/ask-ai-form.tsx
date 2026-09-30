"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Button, Grid, GridItem, SelectOption, TextArea, TextField } from "@forge-ui-official/core";
import { siteConfig } from "@/config/site";
import { accountCreateSchema } from "@/lib/accounts/input";
import { accountFormFields, type AgentFormBlock } from "@/lib/agent/forms";
import { currentPageContext } from "@/components/semantic-page";
import { toast } from "@/lib/toast";

export type ConfirmFormIntent = (intent: string, question?: string) => Promise<boolean>;

type DraftState = "editing" | "submitting" | "done" | "cancelled";
type SavedDraft = { values: Record<string, string>; state: DraftState; notesOpen: boolean };
const DraftContext = createContext<Map<string, SavedDraft> | null>(null);
export function AskAiFormStateProvider({ children }: { children: ReactNode }) {
  const drafts = useRef(new Map<string, SavedDraft>());
  return <DraftContext.Provider value={drafts.current}>{children}</DraftContext.Provider>;
}
export function AskAiForm({ block, question, draftKey, disabled = false, onConfirm, onCancel }: {
  block: AgentFormBlock; question: string; draftKey: string; disabled?: boolean; onConfirm: ConfirmFormIntent; onCancel?: () => void;
}) {
  const drafts = useContext(DraftContext);
  const saved = drafts?.get(draftKey);
  const [values, setValues] = useState<Record<string, string>>(() => saved?.values ?? ({
    username: "", name: "", email: "", phone: "", role: "", department: "", status: "pending", notes: "", ...block.values,
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<DraftState>(saved?.state === "submitting" ? "editing" : saved?.state ?? "editing");
  const [notesOpen, setNotesOpen] = useState(saved?.notesOpen ?? Boolean(block.values.notes));
  const locked = useRef(false);
  useEffect(() => { drafts?.set(draftKey, { values, state, notesOpen }); }, [drafts, draftKey, values, state, notesOpen]);
  const root = useRef<HTMLFormElement>(null);
  const mounted = useRef(true);
  const request = useRef<AbortController | null>(null);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; request.current?.abort(); }; }, []);
  function change(key: string, value: string) {
    if (disabled) return;
    setValues(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: "" }));
  }
  async function submit() {
    if (disabled || locked.current || state !== "editing") return;
    const parsed = accountCreateSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(Object.fromEntries(parsed.error.issues.map(issue => {
        const key = String(issue.path[0]);
        const field = accountFormFields.find(item => item.key === key);
        return [key, field && "options" in field ? `请选择${field.label}` : issue.message];
      })));
      requestAnimationFrame(() => root.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    locked.current = true;
    setState("submitting");
    request.current = new AbortController();
    try {
      const response = await fetch("/api/ask-ai/forms/", { signal: request.current.signal, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ formId: block.formId, values: parsed.data, page: currentPageContext(), harness: block.harness }) });
      const payload = await response.json();
      if (!response.ok || !payload.ok || !payload.intent) throw new Error(payload.error || "表单提交失败");
      if (!mounted.current) return;
      const accepted = await onConfirm(payload.intent, question);
      setState(accepted ? "done" : "editing");
      drafts?.set(draftKey, { values, state: accepted ? "done" : "editing", notesOpen });
      if (accepted) document.querySelector<HTMLButtonElement>('button[aria-label="关闭 Ask AI"]')?.click();
    } catch (error) {
      if (!mounted.current) return;
      setState("editing");
      toast.error(error instanceof Error ? error.message : "表单提交失败，请重试");
    } finally { locked.current = false; }
  }

  if (state === "done" || state === "cancelled") return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-semibold text-fg-black">新建账号 · {values.username || "未填写用户名"}</p>
      <p role="status" className="text-sm text-fg-grey-700">{state === "done" ? "这份草稿已带入页面，后续结果见下方消息。" : "已取消这份草稿。"}</p>
      {state === "cancelled" && !block.harness ? <div><Button color={siteConfig.accent} variant="tertiary" disabled={disabled} onClick={() => { if (!disabled) setState("editing"); }}>继续填写</Button></div> : null}
    </div>
  );

  return (
    <form ref={root} aria-label="对话内新建账号" noValidate onSubmit={event => { event.preventDefault(); void submit(); }} className="flex min-w-0 flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-fg-black">新建账号</h3>
        <p className="text-sm text-fg-grey-700">补齐以下信息；备注选填。账号将在页面确认保存后创建。</p>
      </div>
      <Grid columns={2} gap={12}>
      {accountFormFields.map(field => <GridItem key={field.key} span={field.key === "status" ? "full" : 1}>{"options" in field ? (
        <SelectOption className="w-full" key={field.key} color={siteConfig.accent} label={field.label} width="100%" options={[...field.options]} placeholder={`请选择${field.label}`} value={values[field.key]} state={disabled || state === "submitting" ? "disabled" : errors[field.key] ? "error" : undefined} errorMessage={errors[field.key]} onChange={value => change(field.key, value)} />
      ) : (
        <TextField key={field.key} color={siteConfig.accent} label={field.label} type={"type" in field ? field.type : "text"} placeholder={field.placeholder} value={values[field.key]} disabled={disabled || state === "submitting"} state={errors[field.key] ? "error" : undefined} errorMessage={errors[field.key]} onChange={value => change(field.key, value)} />
      )}</GridItem>)}
      </Grid>
      {notesOpen ? <TextArea color={siteConfig.accent} label="备注（选填）" rows={2} value={values.notes} onChange={value => change("notes", value)} disabled={disabled || state === "submitting"} /> : <div><Button color={siteConfig.accent} variant="tertiary" disabled={disabled || state === "submitting"} onClick={() => setNotesOpen(true)}>添加备注</Button></div>}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button color={siteConfig.accent} variant="tertiary" disabled={disabled || state === "submitting"} onClick={() => { if (onCancel) onCancel(); else setState("cancelled"); }}>取消</Button>
        <Button color={siteConfig.accent} disabled={disabled || state === "submitting"} onClick={() => void submit()}>{state === "submitting" ? "正在带入…" : "确认并带入页面"}</Button>
      </div>
    </form>
  );
}
