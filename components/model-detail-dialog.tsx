"use client";

import { useState } from "react";
import { Button, DescriptionItem, StatusBadge } from "@forge-ui-official/core";
import { Modal } from "@/components/ui/modal";
import { siteConfig } from "@/config/site";
import { useModelsStore } from "@/components/models-store";
import { toast } from "@/lib/toast";
import { formatTime } from "@/lib/format/datetime";
import { MODEL_STATUS_META } from "@/lib/models/types";

type Props = {
  modelId: string | null;
  onClose: () => void;
  onEdit?: (id: string) => void;
};

export function ModelDetailDialog({ modelId, onClose, onEdit }: Props) {
  const { getById, probeModel } = useModelsStore();
  const model = modelId ? getById(modelId) : undefined;
  const [probing, setProbing] = useState(false);

  async function probe() {
    if (!model) return;
    setProbing(true);
    try {
      await probeModel(model.id);
      toast.success("测连成功");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "测连失败");
    } finally {
      setProbing(false);
    }
  }

  return (
    <Modal open={modelId != null} onClose={onClose} title="模型详情" width="w-[560px]">
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
        {model ? (
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-base font-semibold text-fg-black">{model.name}</h4>
              <StatusBadge
                label={MODEL_STATUS_META[model.status].label}
                color={MODEL_STATUS_META[model.status].color}
              />
              {model.isDefault ? <span className="text-sm text-fg-grey-700">默认</span> : null}
            </div>
            <DescriptionItem label="供应商" content={model.providerLabel} />
            <DescriptionItem label="模型 ID" content={model.modelName} />
            <DescriptionItem label="调用地址" content={model.apiBase || "—"} />
            <DescriptionItem label="API Key" content={model.hasKey ? model.apiKeyMasked : "未填写"} />
            <DescriptionItem label="备注" content={model.notes || "—"} />
            <DescriptionItem label="创建" content={model.created} />
            <DescriptionItem
              label="最近测连"
              content={
                model.lastProbeAt
                  ? `${formatTime(model.lastProbeAt)} · ${model.lastProbeOk ? "成功" : "失败"} · ${model.lastProbeMessage || "—"}`
                  : "尚未测连"
              }
            />
          </div>
        ) : (
          <p className="text-sm text-fg-grey-500">模型不存在或已删除</p>
        )}
      </div>
      <div className="flex justify-end gap-2 border-t border-fg-grey-100 px-6 py-4">
        <Button color={siteConfig.accent} variant="tertiary" onClick={onClose}>
          关闭
        </Button>
        {model ? (
          <Button color={siteConfig.accent} variant="secondary" onClick={() => void probe()} disabled={probing}>
            {probing ? "测连中…" : "测连"}
          </Button>
        ) : null}
        {model && onEdit ? (
          <Button
            color={siteConfig.accent}
            onClick={() => {
              onClose();
              onEdit(model.id);
            }}
          >
            编辑
          </Button>
        ) : null}
      </div>
    </Modal>
  );
}
