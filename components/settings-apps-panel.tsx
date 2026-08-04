"use client";

import { useEffect, useState } from "react";
import { Button, StatusBadge, TextField } from "@forge-ui-official/core";
import { siteConfig } from "@/config/site";
import type { AppEntry } from "@/config/apps";
import {
  createAppId,
  loadAppRegistry,
  saveAppRegistry,
} from "@/lib/apps/registry";

const emptyDraft = () => ({
  name: "",
  subtitle: "",
  href: "",
});

export function SettingsAppsPanel() {
  const [apps, setApps] = useState<AppEntry[]>([]);
  const [draft, setDraft] = useState(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setApps(loadAppRegistry());
  }, []);

  function persist(next: AppEntry[], okMsg: string) {
    setApps(next);
    saveAppRegistry(next);
    setMessage(okMsg);
    setError(null);
  }

  function startEdit(app: AppEntry) {
    setEditingId(app.id);
    setDraft({
      name: app.name,
      subtitle: app.subtitle,
      href: app.href ?? "",
    });
    setMessage(null);
    setError(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft(emptyDraft());
    setError(null);
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    const name = draft.name.trim();
    if (!name) {
      setError("请填写应用名称");
      return;
    }
    const href = draft.href.trim() || null;
    const subtitle = draft.subtitle.trim() || (href ? "外部应用" : "未配置入口");

    if (editingId) {
      const next = apps.map((app) =>
        app.id === editingId
          ? {
              ...app,
              name,
              subtitle,
              href,
            }
          : app,
      );
      persist(next, "应用已更新，侧栏切换器已同步");
      cancelEdit();
      return;
    }

    const next: AppEntry[] = [
      ...apps,
      {
        id: createAppId(),
        name,
        subtitle,
        href,
      },
    ];
    persist(next, "应用已添加");
    setDraft(emptyDraft());
  }

  function removeApp(id: string) {
    const target = apps.find((a) => a.id === id);
    if (!target || target.isCurrentProduct) {
      setError("内置当前应用不可删除");
      return;
    }
    persist(
      apps.filter((a) => a.id !== id),
      "应用已移除",
    );
    if (editingId === id) cancelEdit();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl bg-white p-6 outline outline-1 outline-offset-[-1px] outline-fg-grey-200">
        <h2 className="text-lg font-semibold text-fg-black">应用管理</h2>
        <p className="mt-1 text-sm text-fg-grey-700">
          维护侧栏应用切换列表。外链填完整 URL；内链填路径如{" "}
          <code className="text-xs">/dashboard/</code>
          。列表保存在本机浏览器，刷新后保留。
        </p>

        <ul className="mt-5 flex flex-col gap-3">
          {apps.map((app) => (
            <li
              key={app.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-fg-grey-200 px-4 py-3"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-fg-black">{app.name}</span>
                  {app.isCurrentProduct ? (
                    <StatusBadge label="当前产品" color="blue" />
                  ) : null}
                </div>
                <p className="mt-0.5 text-xs text-fg-grey-500">
                  {app.subtitle || "—"}
                  {" · "}
                  {app.href ?? "无入口"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  color={siteConfig.accent}
                  variant="tertiary"
                  size="sm"
                  onClick={() => startEdit(app)}
                >
                  编辑
                </Button>
                {!app.isCurrentProduct ? (
                  <Button color="red" variant="tertiary" size="sm" onClick={() => removeApp(app.id)}>
                    删除
                  </Button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl bg-white p-6 outline outline-1 outline-offset-[-1px] outline-fg-grey-200">
        <h3 className="text-base font-semibold text-fg-black">
          {editingId ? "编辑应用" : "新建应用"}
        </h3>
        <form onSubmit={submit} className="mt-4 flex max-w-xl flex-col gap-4">
          <TextField
            color={siteConfig.accent}
            label="名称"
            value={draft.name}
            onChange={(v) => setDraft((d) => ({ ...d, name: v }))}
            placeholder="如：运营工作台"
          />
          <TextField
            color={siteConfig.accent}
            label="副标题"
            value={draft.subtitle}
            onChange={(v) => setDraft((d) => ({ ...d, subtitle: v }))}
            placeholder="可选，显示在侧栏当前应用下"
          />
          <TextField
            color={siteConfig.accent}
            label="入口地址"
            value={draft.href}
            onChange={(v) => setDraft((d) => ({ ...d, href: v }))}
            placeholder="https://… 或 /path/"
          />
          {error ? <p className="text-sm text-fg-red">{error}</p> : null}
          {message ? <p className="text-sm text-fg-green-500">{message}</p> : null}
          <div className="flex flex-wrap gap-2">
            <Button type="submit" color={siteConfig.accent}>
              {editingId ? "保存应用" : "添加应用"}
            </Button>
            {editingId ? (
              <Button type="button" color={siteConfig.accent} variant="tertiary" onClick={cancelEdit}>
                取消编辑
              </Button>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
}
