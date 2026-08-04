"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Breadcrumbs,
  Button,
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
  const [success, setSuccess] = useState<string | null>(null);

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

  const statusOptions = useMemo(
    () => (Object.keys(RECORD_STATUS_META) as RecordStatus[]),
    [],
  );

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSuccess(null);
    if (!name.trim()) {
      setError("请填写名称");
      return;
    }
    if (!description.trim()) {
      setError("请填写说明");
      return;
    }
    setError(null);
    setSaving(true);
    const payload = {
      name,
      subtitle,
      category,
      owner,
      description,
      status,
    };
    try {
      if (isEdit && existing) {
        const updated = updateRecord(existing.id, payload);
        setSuccess("已保存修改");
        if (updated) {
          window.setTimeout(() => router.push(`/examples/detail/?id=${updated.id}`), 400);
        }
      } else {
        const created = createRecord(payload);
        setSuccess("已创建记录");
        window.setTimeout(() => router.push(`/examples/detail/?id=${created.id}`), 400);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-display-l font-semibold leading-9 tracking-fg text-fg-black">
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
        {isEdit && existing ? (
          <StatusBadge
            label={RECORD_STATUS_META[existing.status].label}
            color={RECORD_STATUS_META[existing.status].color}
          />
        ) : null}
      </div>

      <SurfaceCard className="p-6">
        <form onSubmit={onSubmit} className="flex max-w-2xl flex-col gap-5">
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
            placeholder="列表副标题，如：3 条规则"
            value={subtitle}
            onChange={setSubtitle}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-medium text-fg-grey-700">
              分类
              <select
                className="h-12 rounded-full border border-fg-grey-200 bg-white px-4 text-fg-black outline-none focus:border-fg-blue-500"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {RECORD_CATEGORIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-fg-grey-700">
              负责人
              <select
                className="h-12 rounded-full border border-fg-grey-200 bg-white px-4 text-fg-black outline-none focus:border-fg-blue-500"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
              >
                {RECORD_OWNERS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="flex flex-col gap-2 text-sm font-medium text-fg-grey-700">
            状态
            <select
              className="h-12 rounded-full border border-fg-grey-200 bg-white px-4 text-fg-black outline-none focus:border-fg-blue-500"
              value={status}
              onChange={(e) => setStatus(e.target.value as RecordStatus)}
            >
              {statusOptions.map((item) => (
                <option key={item} value={item}>
                  {RECORD_STATUS_META[item].label}
                </option>
              ))}
            </select>
          </label>

          <TextArea
            color={siteConfig.accent}
            label="说明"
            placeholder="补充业务说明、范围与验收标准…"
            value={description}
            onChange={setDescription}
            rows={5}
            state={error && !description.trim() ? "error" : "idle"}
          />

          {error ? <p className="text-sm text-fg-red">{error}</p> : null}
          {success ? <p className="text-sm text-fg-green-500">{success}</p> : null}

          <div className="flex flex-wrap gap-3">
            <Button type="submit" color={siteConfig.accent} variant="primary" disabled={saving}>
              {saving ? "保存中…" : isEdit ? "保存修改" : "创建并查看"}
            </Button>
            <Button
              type="button"
              color={siteConfig.accent}
              variant="tertiary"
              onClick={() => router.push("/examples/list/")}
            >
              返回列表
            </Button>
            {isEdit && existing ? (
              <Button
                type="button"
                color={siteConfig.accent}
                variant="tertiary"
                onClick={() => router.push(`/examples/detail/?id=${existing.id}`)}
              >
                查看详情
              </Button>
            ) : null}
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
