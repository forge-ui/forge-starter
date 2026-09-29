"use client";

import { Modal } from "@/components/ui/modal";

import { matchesModel } from "@/lib/models/filter";
import { useSemanticPage } from "@/components/semantic-page";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  PenLinear,
  RefreshCircleLinear,
  TrashBinMinimalisticLinear,
} from "solar-icon-set";
import {
  Breadcrumbs,
  Button,
  ConfirmationDialog,
  Grid,
  KebabMenu,
  PlusIcon,
  SelectOption,
  TextField,
} from "@forge-ui-official/core";
import { siteConfig } from "@/config/site";
import { PageTitleActions } from "@/components/ask-ai-entry";
import { WorkspaceSplit, FolderNav } from "@/components/workspace-split";
import { ModelCard } from "@/components/model-card";
import { useModelsStore } from "@/components/models-store";
import { ModelFormDialog } from "@/components/model-form-dialog";
import { ModelDetailDialog } from "@/components/model-detail-dialog";
import { toast } from "@/lib/toast";
import { MODEL_TYPE_OPTIONS, modelProviderById, modelTypeLabel } from "@/lib/models/providers";
import type { AiModel } from "@/lib/models/types";

type ProbeUiState = "idle" | "testing" | "ok" | "error";
type ProbeEntry = { state: ProbeUiState; error?: string };

function displayModelStatus(
  model: AiModel,
  probe: ProbeEntry | undefined,
): { label: string; tone: "ok" | "error" | "warn" | "muted"; error?: string } {
  if (model.status === "disabled") return { label: "停用", tone: "muted" };
  if (probe?.state === "testing") return { label: "检测中", tone: "warn" };
  if (probe?.state === "ok") return { label: "正常", tone: "ok" };
  if (probe?.state === "error") {
    return { label: "异常", tone: "error", error: probe.error || "连接测试失败" };
  }
  if (model.lastProbeOk === true) return { label: "正常", tone: "ok" };
  if (model.lastProbeOk === false) {
    return { label: "异常", tone: "error", error: model.lastProbeMessage || "连接测试失败" };
  }
  return { label: "未检测", tone: "muted" };
}

function ProviderIcon({
  providerId,
  size = "md",
}: {
  providerId: string;
  size?: "sm" | "md";
}) {
  const provider = modelProviderById(providerId);
  const className = size === "sm" ? "h-5 w-5" : "h-8 w-8";
  if (provider?.icon) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={provider.icon} alt="" className={`shrink-0 object-contain ${className}`} />
    );
  }
  const name = provider?.name ?? providerId;
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-lg bg-fg-blue-50 text-xs font-semibold text-fg-blue-700 ${className}`}
    >
      {name.slice(0, 1)}
    </span>
  );
}

function ModelsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { models, providers, loading, error, deleteModel, probeModel, refresh } = useModelsStore();
  const [providerFilter, setProviderFilter] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [searchText, setSearchText] = useState("");
  const [modelTypeFilter, setModelTypeFilter] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<AiModel | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [probeMap, setProbeMap] = useState<Record<string, ProbeEntry>>({});


  useSemanticPage({ pageId: "models.workspace", entityId: detailId ?? undefined, query: { provider: providerFilter || undefined, query: searchText || undefined, modelType: modelTypeFilter || undefined } }, "models", (fill) => {
    if (loading) return false;
    if (error) throw new Error(error);
    if (formOpen) throw new Error("请先关闭模型编辑表单");
    if (fill.mode === "filter") {
      setProviderFilter(fill.fields.provider ?? ""); setSearchText(fill.fields.query ?? ""); setModelTypeFilter(fill.fields.modelType ?? ""); setSearchType(fill.fields.modelType ? "model_type" : "name"); return true;
    }
    if (fill.mode === "open") {
      if (!models.some((row) => row.id === fill.recordId)) throw new Error("模型不存在");
      openDetail(fill.recordId!); return true;
    }
    throw new Error("不支持的模型页面操作");
  });

  function openCreate() {
    setEditId(null);
    setFormOpen(true);
  }

  function openEdit(id: string) {
    setEditId(id);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditId(null);
  }

  function openDetail(id: string) {
    setDetailId(id);
    const next = new URLSearchParams(searchParams.toString());
    next.set("id", id);
    next.delete("create");
    next.delete("edit");
    router.replace(`/models/?${next.toString()}`, { scroll: false });
  }

  function closeDetail() {
    setDetailId(null);
    const next = new URLSearchParams(searchParams.toString());
    next.delete("id");
    const qs = next.toString();
    router.replace(qs ? `/models/?${qs}` : "/models/", { scroll: false });
  }

  useEffect(() => {
    const create = searchParams.get("create") === "1";
    const edit = searchParams.get("edit");
    const id = searchParams.get("id");
    if (create) {
      setEditId(null);
      setFormOpen(true);
      router.replace("/models/", { scroll: false });
      return;
    }
    if (edit) {
      setEditId(edit);
      setFormOpen(true);
      router.replace("/models/", { scroll: false });
      return;
    }
    if (id) setDetailId(id);
    else setDetailId(null);
  }, [searchParams, router]);

  const providerCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of models) {
      map.set(item.provider, (map.get(item.provider) || 0) + 1);
    }
    return map;
  }, [models]);

  const sidebarProviders = useMemo(
    () =>
      [...providers].sort((a, b) => {
        const ca = providerCounts.get(a.id) || 0;
        const cb = providerCounts.get(b.id) || 0;
        if (cb !== ca) return cb - ca;
        return a.name.localeCompare(b.name, "zh-CN");
      }),
    [providerCounts, providers],
  );

  const filtered = useMemo(() => {
    return models.filter((item) => matchesModel(item, { provider: providerFilter, query: searchType === "name" ? searchText : undefined, modelType: searchType === "model_type" ? modelTypeFilter : undefined }));
  }, [modelTypeFilter, models, providerFilter, searchText, searchType]);

  const hasSearchFilters = Boolean(
    (searchType === "name" && searchText.trim())
    || (searchType === "model_type" && modelTypeFilter),
  );
  const hasActiveFilters = Boolean(providerFilter || hasSearchFilters);
  const activeProvider = providerFilter
    ? providers.find((item) => item.id === providerFilter)
    : undefined;
  const createProvider = providerFilter || null;

  function clearFilters() {
    setProviderFilter("");
    setSearchType("name");
    setSearchText("");
    setModelTypeFilter("");
  }

  // Probe results replace model records. Depend on membership, not those records,
  // so one completed request cannot cancel the other workers' state updates.
  const probeTargetIds = JSON.stringify(models.filter((item) => item.status !== "disabled").map((item) => item.id).sort());
  useEffect(() => {
    if (loading) return;
    let cancelled = false;
    const targets = JSON.parse(probeTargetIds) as string[];
    const concurrency = 3;
    let index = 0;

    async function worker() {
      while (index < targets.length) {
        if (cancelled) return;
        const current = targets[index++];
        if (!current) return;
        setProbeMap((prev) => ({ ...prev, [current]: { state: "testing" } }));
        try {
          await probeModel(current);
          if (cancelled) return;
          setProbeMap((prev) => ({ ...prev, [current]: { state: "ok" } }));
        } catch (err) {
          if (cancelled) return;
          setProbeMap((prev) => ({
            ...prev,
            [current]: {
              state: "error",
              error: err instanceof Error ? err.message : "连接测试失败",
            },
          }));
        }
      }
    }

    void Promise.all(Array.from({ length: Math.min(concurrency, targets.length) }, () => worker()));
    return () => {
      cancelled = true;
    };
  }, [loading, probeTargetIds, probeModel]);

  async function retestOne(id: string) {
    setProbeMap((prev) => ({ ...prev, [id]: { state: "testing" } }));
    try {
      await probeModel(id);
      setProbeMap((prev) => ({ ...prev, [id]: { state: "ok" } }));
      toast.success("连接正常");
    } catch (err) {
      const message = err instanceof Error ? err.message : "连接失败";
      setProbeMap((prev) => ({ ...prev, [id]: { state: "error", error: message } }));
      toast.error(message);
    }
  }

  return (
    <>
      <ModelFormDialog
        open={formOpen}
        onClose={closeForm}
        modelId={editId}
        initialProvider={createProvider}
        onCreated={openDetail}
      />
      <ModelDetailDialog
        modelId={detailId}
        onClose={closeDetail}
        onEdit={openEdit}
      />

      <Modal open={deleteTarget != null} onClose={() => {
              if (deleting) return;
              setDeleteTarget(null);
            }} overlayClassName="z-[70]">
        {deleteTarget ? (
          <ConfirmationDialog
            title={`删除模型「${deleteTarget.name}」？`}
            description="删除后不可恢复。Ask AI 将不再使用这条配置。"
            color="red"
            icon={<TrashBinMinimalisticLinear size={32} color="#EA580C" />}
            confirmLabel={deleting ? "删除中…" : "确认"}
            cancelLabel="取消"
            onCancel={() => {
              if (deleting) return;
              setDeleteTarget(null);
            }}
            onConfirm={() => {
              if (deleting) return;
              setDeleting(true);
              void deleteModel(deleteTarget.id)
                .then(() => {
                  toast.success("模型已删除");
                  setDeleteTarget(null);
                  if (detailId === deleteTarget.id) closeDetail();
                })
                .catch((err: unknown) => {
                  toast.error(err instanceof Error ? err.message : "删除模型失败");
                })
                .finally(() => setDeleting(false));
            }}
          />
        ) : null}
      </Modal>

      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-hidden">
        <div className="flex shrink-0 flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-display-l font-semibold leading-9 tracking-fg text-fg-black">
              模型服务
            </h1>
            <Breadcrumbs
              color={siteConfig.accent}
              className="mt-1"
              items={[
                { label: "工作台", href: "/dashboard/" },
                { label: "模型服务" },
              ]}
            />
          </div>
          <PageTitleActions>
            <Button
              color={siteConfig.accent}
              iconLeft={<PlusIcon size={16} />}
              onClick={openCreate}
            >
              添加模型
            </Button>
          </PageTitleActions>
        </div>

        <WorkspaceSplit leftTitle="供应商" className="!min-h-0"
          left={<FolderNav activeId={providerFilter} onSelect={setProviderFilter}
            folders={[{ id: "", name: "全部", count: models.length, locked: true }, ...sidebarProviders.map((provider) => ({ id: provider.id, name: provider.name, count: providerCounts.get(provider.id) ?? 0, locked: true, icon: <ProviderIcon providerId={provider.id} size="sm" /> }))]} />}
        >
          <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-4 overflow-hidden">
            <div className="flex shrink-0 flex-wrap items-end gap-3">
              <SelectOption
                color={siteConfig.accent}
                width="144px"
                label="搜索字段"
                value={searchType}
                options={[
                  { value: "name", label: "模型名称" },
                  { value: "model_type", label: "模型类型" },
                ]}
                onChange={(next) => {
                  setSearchType(next);
                  setSearchText("");
                  setModelTypeFilter("");
                }}
              />
              {searchType === "name" ? (
                <div className="w-full sm:w-[280px]">
                  <TextField
                    color={siteConfig.accent}
                    label="关键词"
                    placeholder="按名称搜索"
                    value={searchText}
                    onChange={setSearchText}
                  />
                </div>
              ) : (
                <SelectOption
                  color={siteConfig.accent}
                  width="280px"
                  label="模型类型"
                  value={modelTypeFilter || undefined}
                  placeholder="请选择模型类型"
                  options={MODEL_TYPE_OPTIONS.map((item) => ({ ...item }))}
                  onChange={setModelTypeFilter}
                />
              )}
              <span className="ml-auto pb-2 text-sm text-fg-grey-700">
                共 {filtered.length} 个
                {providerFilter && models.length !== filtered.length ? ` / ${models.length}` : null}
              </span>
            </div>

            {error ? (
              <div className="shrink-0 rounded-xl border border-fg-red-200 bg-fg-red-100 px-4 py-3 text-sm text-fg-red">
                {error}
                <Button
                  color={siteConfig.accent}
                  variant="tertiary"
                  size="sm"
                  onClick={() => void refresh()}
                >
                  重试
                </Button>
              </div>
            ) : null}

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              {loading ? (
                <Grid columns={{ base: 1, md: 2, xl: 3, "2xl": 4 }} gap={16}>
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="h-[104px] animate-pulse rounded-2xl bg-fg-grey-50" />
                  ))}
                </Grid>
              ) : filtered.length === 0 ? (
                <div className="flex h-full min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed border-fg-grey-200 px-6 py-16 text-center">
                  <p className="text-base font-semibold text-fg-black">
                    {hasActiveFilters ? "没有匹配的模型" : "暂无模型"}
                  </p>
                  <p className="mt-2 max-w-md text-sm text-fg-grey-700">
                    {hasActiveFilters
                      ? providerFilter && !hasSearchFilters
                        ? "该供应商下还没有模型，可点击右上角添加。"
                        : "当前筛选条件下没有结果，可以调整条件或清除筛选后重试。"
                      : "还没有接入模型，添加供应商并完成认证配置后即可使用。"}
                  </p>
                  <Button
                    color={siteConfig.accent}
                    variant="tertiary"
                    className="mt-4"
                    onClick={hasSearchFilters ? clearFilters : openCreate}
                  >
                    {hasSearchFilters
                      ? "清除筛选"
                      : providerFilter
                        ? `添加 ${activeProvider?.name || "模型"}`
                        : "添加模型"}
                  </Button>
                </div>
              ) : (
                <Grid columns={{ base: 1, md: 2, xl: 3, "2xl": 4 }} gap={16}>
                  {filtered.map((item) => {
                    const probe = probeMap[item.id];
                    const display = displayModelStatus(item, probe);
                    return (
                      <ModelCard
                        key={item.id}
                        name={item.name}
                        modelName={item.modelName || undefined}
                        providerIcon={<ProviderIcon providerId={item.provider} size="sm" />}
                        typeLabel={modelTypeLabel("LLM")}
                        statusLabel={display.label}
                        statusTone={display.tone}
                        statusError={display.error}
                        onClick={() => openDetail(item.id)}
                        actions={
                          <KebabMenu
                            accent={siteConfig.accent}
                            align="right"
                            items={[
                              {
                                label: probe?.state === "testing" ? "检测中…" : "测试连接",
                                icon: <RefreshCircleLinear size={16} />,
                                onSelect: () => {
                                  if (probe?.state !== "testing") void retestOne(item.id);
                                },
                              },
                              {
                                label: "编辑",
                                icon: <PenLinear size={16} />,
                                onSelect: () => openEdit(item.id),
                              },
                              {
                                label: "删除",
                                icon: <TrashBinMinimalisticLinear size={16} />,
                                danger: true,
                                onSelect: () => setDeleteTarget(item),
                              },
                            ]}
                          />
                        }
                      />
                    );
                  })}
                </Grid>
              )}
            </div>
          </div>
        </WorkspaceSplit>
      </div>
    </>
  );
}

export default function ModelsPage() {
  return (
    <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-fg-grey-50" />}>
      <ModelsPageContent />
    </Suspense>
  );
}
