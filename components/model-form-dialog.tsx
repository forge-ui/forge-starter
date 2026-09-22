"use client";

import { useEffect, useMemo, useState } from "react";
import { SelectOption, TextArea, TextField, Button } from "@forge-ui-official/core";
import { Modal } from "@/components/ui/modal";
import { siteConfig } from "@/config/site";
import { useModelsStore } from "@/components/models-store";
import { toast } from "@/lib/toast";
import { defaultApiBaseForProvider, modelProviderById } from "@/lib/models/providers";
import { MODEL_STATUS_META, type ModelStatus } from "@/lib/models/types";

type FormState = {
  name: string;
  provider: string;
  modelName: string;
  apiBase: string;
  apiKey: string;
  status: ModelStatus;
  isDefault: "yes" | "no";
  notes: string;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

function emptyForm(providerId: string): FormState {
  const provider = modelProviderById(providerId);
  return {
    name: "",
    provider: providerId,
    modelName: provider?.defaultModel ?? "",
    apiBase: provider?.defaultApiBase ?? "",
    apiKey: "",
    status: "active",
    isDefault: "no",
    notes: "",
  };
}

type Props = {
  open: boolean;
  onClose: () => void;
  modelId?: string | null;
  initialProvider?: string | null;
  onCreated?: (id: string) => void;
};

const statusOptions = (Object.keys(MODEL_STATUS_META) as ModelStatus[]).map((value) => ({
  value,
  label: MODEL_STATUS_META[value].label,
}));

export function ModelFormDialog({
  open,
  onClose,
  modelId = null,
  initialProvider = null,
  onCreated,
}: Props) {
  const { getById, createModel, updateModel, providers } = useModelsStore();
  const mode = modelId ? "edit" : "create";
  const existing = modelId ? getById(modelId) : undefined;
  const firstProvider = initialProvider || providers[0]?.id || "model_openai_provider";

  const [form, setForm] = useState<FormState>(() => emptyForm(firstProvider));
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);

  const providerOptions = useMemo(
    () => providers.map((item) => ({ value: item.id, label: item.name })),
    [providers],
  );
  const currentProvider = modelProviderById(form.provider);

  useEffect(() => {
    if (!open) return;
    setFieldErrors({});
    setSaving(false);
    if (mode === "edit" && existing) {
      setForm({
        name: existing.name,
        provider: existing.provider,
        modelName: existing.modelName,
        apiBase: existing.apiBase,
        apiKey: "",
        status: existing.status,
        isDefault: existing.isDefault ? "yes" : "no",
        notes: existing.notes,
      });
    } else if (mode === "create") {
      setForm(emptyForm(firstProvider));
    }
  }, [open, mode, existing, firstProvider]);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function changeProvider(id: string) {
    const next = modelProviderById(id);
    setForm((prev) => ({
      ...prev,
      provider: id,
      modelName: next?.defaultModel ?? prev.modelName,
      apiBase: next?.defaultApiBase ?? prev.apiBase,
    }));
    setFieldErrors((prev) => ({ ...prev, provider: undefined, modelName: undefined }));
  }

  function validate(): FieldErrors {
    const errors: FieldErrors = {};
    if (!form.name.trim()) errors.name = "请填写显示名称";
    if (!form.provider) errors.provider = "请选择供应商";
    if (!form.modelName.trim()) errors.modelName = "请填写模型 ID";
    const local = currentProvider?.local;
    if (mode === "create" && !local && !form.apiKey.trim()) errors.apiKey = "请填写 API Key";
    return errors;
  }

  function handleClose() {
    if (saving) return;
    setFieldErrors({});
    onClose();
  }

  async function submit() {
    if (mode === "edit" && modelId && !existing) {
      toast.error("模型不存在或已删除");
      return;
    }
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name,
      provider: form.provider,
      modelName: form.modelName,
      apiBase: form.apiBase,
      apiKey: form.apiKey,
      status: form.status,
      isDefault: form.isDefault === "yes",
      notes: form.notes,
    };
    try {
      if (mode === "edit" && existing) {
        await updateModel(existing.id, payload);
        toast.success("模型已保存");
        setSaving(false);
        onClose();
        return;
      }
      const created = await createModel(payload);
      toast.success("模型已创建");
      setSaving(false);
      onClose();
      onCreated?.(created.id);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "保存失败");
      setSaving(false);
    }
  }

  if (open && mode === "edit" && modelId && !existing) {
    return (
      <Modal open onClose={handleClose} title="编辑模型" width="w-[560px]">
        <div className="px-6 py-8 text-center">
          <p className="text-sm text-fg-grey-700">模型不存在或已删除</p>
          <div className="mt-4">
            <Button color={siteConfig.accent} onClick={handleClose}>
              关闭
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={mode === "edit" ? "编辑模型" : "添加模型"}
      width="w-[560px]"
    >
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
        <div className="flex flex-col gap-4">
          <TextField
            color={siteConfig.accent}
            label="显示名称"
            value={form.name}
            onChange={(v) => setField("name", v)}
            placeholder="如：默认对话模型"
            state={fieldErrors.name ? "error" : undefined}
            errorMessage={fieldErrors.name}
          />
          <SelectOption
            color={siteConfig.accent}
            label="供应商"
            width="100%"
            options={providerOptions}
            value={form.provider}
            onChange={changeProvider}
          />
          <TextField
            color={siteConfig.accent}
            label="模型 ID"
            value={form.modelName}
            onChange={(v) => setField("modelName", v)}
            placeholder={currentProvider?.defaultModel ?? "qwen-plus"}
            state={fieldErrors.modelName ? "error" : undefined}
            errorMessage={fieldErrors.modelName}
          />
          <TextField
            color={siteConfig.accent}
            label="调用地址"
            value={form.apiBase}
            onChange={(v) => setField("apiBase", v)}
            placeholder={defaultApiBaseForProvider(form.provider)}
          />
          <TextField
            color={siteConfig.accent}
            label="API Key"
            value={form.apiKey}
            onChange={(v) => setField("apiKey", v)}
            placeholder={
              mode === "edit" && existing?.hasKey
                ? `已保存 ${existing.apiKeyMasked}，留空不改`
                : currentProvider?.local
                  ? "本地服务可留空"
                  : "只保存在服务端，列表只显示掩码"
            }
            state={fieldErrors.apiKey ? "error" : undefined}
            errorMessage={fieldErrors.apiKey}
          />
          <SelectOption
            color={siteConfig.accent}
            label="状态"
            width="100%"
            options={statusOptions}
            value={form.status}
            onChange={(v) => setField("status", v as ModelStatus)}
          />
          <SelectOption
            color={siteConfig.accent}
            label="设为默认"
            width="100%"
            options={[
              { value: "no", label: "否" },
              { value: "yes", label: "是（Ask AI 优先用这条）" },
            ]}
            value={form.isDefault}
            onChange={(v) => setField("isDefault", v === "yes" ? "yes" : "no")}
          />
          <TextArea
            color={siteConfig.accent}
            label="备注"
            rows={3}
            value={form.notes}
            onChange={(v) => setField("notes", v)}
            placeholder="可选"
          />
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-fg-grey-100 px-6 py-4">
        <Button color={siteConfig.accent} variant="tertiary" onClick={handleClose} disabled={saving}>
          取消
        </Button>
        <Button color={siteConfig.accent} onClick={() => void submit()} disabled={saving}>
          {saving ? "保存中…" : mode === "edit" ? "保存" : "创建"}
        </Button>
      </div>
    </Modal>
  );
}
