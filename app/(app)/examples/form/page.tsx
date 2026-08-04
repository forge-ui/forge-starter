"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Breadcrumbs,
  Button,
  SelectOption,
  StatusBadge,
  SurfaceCard,
  TextArea,
  TextField,
} from "@forge-ui-official/core";
import { siteConfig } from "@/config/site";
import { useDemoStore } from "@/components/demo-store";
import {
  RECORD_CATEGORIES,
  RECORD_OWNERS,
  RECORD_STATUS_META,
  type RecordStatus,
} from "@/lib/demo/records";

const categoryOptions = RECORD_CATEGORIES.map((value) => ({ value, label: value }));
const ownerOptions = RECORD_OWNERS.map((value) => ({ value, label: value }));
const statusOptions = (Object.keys(RECORD_STATUS_META) as RecordStatus[]).map((value) => ({
  value,
  label: RECORD_STATUS_META[value].label,
}));

function FormBody() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const { getById, createRecord, updateRecord } = useDemoStore();
  const existing = editId ? getById(editId) : undefined;
  const isEdit = Boolean(existing);

  const [name, setName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [category, setCategory] = useState<string>(RECORD_CATEGORIES[0]);
  const [owner, setOwner] = useState<string>(RECORD_OWNERS[0]);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<RecordStatus>("draft");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!existing) {
      setName("");
      setSubtitle("");
      setCategory(RECORD_CATEGORIES[0]);
      setOwner(RECORD_OWNERS[0]);
      setDescription("");
      setStatus("draft");
      return;
    }
    setName(existing.name);
    setSubtitle(existing.subtitle);
    setCategory(existing.category);
    setOwner(existing.owner);
    setDescription(existing.description);
    setStatus(existing.status);
  }, [existing]);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim() || !description.trim()) {
      setError("请填写名称与说明");
      return;
    }
    setError(null);
    setSaving(true);
    const payload = { name, subtitle, category, owner, description, status };
    try {
      if (isEdit && existing) {
        const updated = updateRecord(existing.id, payload);
        if (updated) router.push(`/examples/detail/?id=${updated.id}`);
      } else {
        const created = createRecord(payload);
        router.push(`/examples/detail/?id=${created.id}`);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* CRM Add Leads header pattern */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-fg text-fg-black">
            {isEdit ? "编辑记录" : "新建记录"}
          </h1>
          <Breadcrumbs
            color={siteConfig.accent}
            items={[
              { label: "工作台", href: "/dashboard/" },
              { label: "业务记录", href: "/examples/list/" },
              { label: isEdit ? "编辑" : "新建" },
            ]}
          />
        </div>
        <div className="flex items-center gap-3">
          {isEdit && existing ? (
            <StatusBadge
              label={RECORD_STATUS_META[existing.status].label}
              color={RECORD_STATUS_META[existing.status].color}
            />
          ) : null}
          <Button
            color={siteConfig.accent}
            variant="tertiary"
            onClick={() => router.push("/examples/list/")}
          >
            取消
          </Button>
          <Button
            color={siteConfig.accent}
            disabled={saving}
            onClick={() => {
              const form = document.getElementById("record-form") as HTMLFormElement | null;
              form?.requestSubmit();
            }}
          >
            {saving ? "保存中…" : isEdit ? "保存" : "创建"}
          </Button>
        </div>
      </div>

      <SurfaceCard className="p-6">
        <form id="record-form" onSubmit={onSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <TextField
              color={siteConfig.accent}
              label="名称"
              placeholder="例如：设备准入策略"
              value={name}
              onChange={setName}
              state={error && !name.trim() ? "error" : "idle"}
            />
            <TextField
              color={siteConfig.accent}
              label="摘要"
              placeholder="列表副标题"
              value={subtitle}
              onChange={setSubtitle}
            />
            <SelectOption
              color={siteConfig.accent}
              label="分类"
              width="100%"
              options={categoryOptions}
              value={category}
              onChange={setCategory}
            />
            <SelectOption
              color={siteConfig.accent}
              label="负责人"
              width="100%"
              options={ownerOptions}
              value={owner}
              onChange={setOwner}
            />
            <SelectOption
              color={siteConfig.accent}
              label="状态"
              width="100%"
              options={statusOptions}
              value={status}
              onChange={(value) => setStatus(value as RecordStatus)}
            />
          </div>
          <TextArea
            color={siteConfig.accent}
            label="说明"
            placeholder="业务范围、规则与验收标准…"
            value={description}
            onChange={setDescription}
            rows={5}
            state={error && !description.trim() ? "error" : "idle"}
          />
          {error ? <p className="text-sm text-fg-red">{error}</p> : null}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              color={siteConfig.accent}
              variant="tertiary"
              onClick={() => router.push("/examples/list/")}
            >
              取消
            </Button>
            <Button type="submit" color={siteConfig.accent} disabled={saving}>
              {saving ? "保存中…" : isEdit ? "保存记录" : "创建记录"}
            </Button>
          </div>
        </form>
      </SurfaceCard>
    </div>
  );
}

export default function ExampleFormPage() {
  return (
    <Suspense fallback={<p className="text-sm text-fg-grey-700">加载表单…</p>}>
      <FormBody />
    </Suspense>
  );
}
