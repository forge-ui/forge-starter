"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, StatusBadge, SurfaceCard, TextArea, TextField } from "@forge-ui-official/core";

export default function ExampleFormPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [owner, setOwner] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim() || !owner.trim()) {
      setError("请填写名称与负责人");
      setSubmitted(false);
      return;
    }
    setError(null);
    setSubmitted(true);
  }

  return (
    <SurfaceCard className="p-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-fg-black">新建业务记录</h2>
          <p className="mt-1 text-sm text-fg-grey-700">
            表单范式：Forge TextField / TextArea + 前端校验。接业务时把提交改成 API 即可。
          </p>
        </div>
        {submitted ? <StatusBadge label="已通过校验（示例）" color="green" /> : null}
      </div>

      <form onSubmit={onSubmit} className="flex max-w-2xl flex-col gap-5">
        <TextField
          label="名称"
          placeholder="例如：设备准入策略"
          value={name}
          onChange={setName}
          state={error && !name.trim() ? "error" : "idle"}
        />
        <TextField
          label="负责人"
          placeholder="例如：张敏"
          value={owner}
          onChange={setOwner}
          state={error && !owner.trim() ? "error" : "idle"}
        />
        <TextArea
          label="说明"
          placeholder="补充业务说明…"
          value={description}
          onChange={setDescription}
          rows={5}
        />
        {error ? <p className="text-sm text-fg-red">{error}</p> : null}
        {submitted ? (
          <p className="text-sm text-fg-grey-700">
            示例提交成功：{name.trim()} / {owner.trim()}
            {description.trim() ? ` — ${description.trim()}` : ""}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-3">
          <Button type="submit" color="blue" variant="primary">
            提交
          </Button>
          <Button
            type="button"
            color="grey"
            variant="tertiary"
            onClick={() => router.push("/examples/list/")}
          >
            返回列表
          </Button>
        </div>
      </form>
    </SurfaceCard>
  );
}
