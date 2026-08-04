"use client";

import { useEffect, useState } from "react";
import { Button, SelectOption, StatusBadge, TextField } from "@forge-ui-official/core";
import { siteConfig } from "@/config/site";
import {
  APP_AUTH_META,
  APP_KIND_META,
  APP_MODULE_META,
  APP_OPEN_META,
  MENU_PRESET_META,
  type AppAuthMode,
  type AppEntry,
  type AppKind,
  type AppModuleId,
  type AppOpenMode,
  type MenuPresetId,
} from "@/config/apps";
import {
  createAppId,
  loadAppRegistry,
  normalizeAppEntry,
  saveAppRegistry,
} from "@/lib/apps/registry";

const kindOptions = (Object.keys(APP_KIND_META) as AppKind[]).map((value) => ({
  value,
  label: APP_KIND_META[value].label,
}));

const openOptions = (Object.keys(APP_OPEN_META) as AppOpenMode[]).map((value) => ({
  value,
  label: APP_OPEN_META[value].label,
}));

const authOptions = (Object.keys(APP_AUTH_META) as AppAuthMode[]).map((value) => ({
  value,
  label: APP_AUTH_META[value].label,
}));

const presetOptions = (Object.keys(MENU_PRESET_META) as MenuPresetId[]).map((value) => ({
  value,
  label: MENU_PRESET_META[value].label,
}));

type Draft = {
  name: string;
  subtitle: string;
  kind: AppKind;
  href: string;
  openMode: AppOpenMode;
  authMode: AppAuthMode;
  menuPreset: MenuPresetId;
  modules: AppModuleId[];
};

const emptyDraft = (): Draft => ({
  name: "",
  subtitle: "",
  kind: "link",
  href: "",
  openMode: "new_tab",
  authMode: "none",
  menuPreset: "dashboard-only",
  modules: ["dashboard"],
});

function kindLabel(kind: AppKind) {
  return APP_KIND_META[kind]?.label ?? kind;
}

function toggleModule(list: AppModuleId[], id: AppModuleId): AppModuleId[] {
  if (list.includes(id)) {
    const next = list.filter((m) => m !== id);
    return next.length > 0 ? next : list;
  }
  return [...list, id];
}

export function SettingsAppsPanel() {
  const [apps, setApps] = useState<AppEntry[]>([]);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setApps(loadAppRegistry());
  }, []);

  function persist(next: AppEntry[], okMsg: string) {
    const normalized = next.map((a) => normalizeAppEntry(a));
    setApps(normalized);
    saveAppRegistry(normalized);
    setMessage(okMsg);
    setError(null);
  }

  function startEdit(app: AppEntry) {
    setEditingId(app.id);
    setDraft({
      name: app.name,
      subtitle: app.subtitle,
      kind: app.kind,
      href: app.href ?? "",
      openMode: app.openMode,
      authMode: app.authMode,
      menuPreset: app.menuPreset,
      modules: app.modules.length ? app.modules : ["dashboard"],
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

    if (draft.kind === "link" || draft.kind === "external") {
      if (!draft.href.trim()) {
        setError("请填写入口地址");
        return;
      }
    }

    if (draft.kind === "internal" && draft.menuPreset === "custom" && draft.modules.length === 0) {
      setError("请至少选择一个菜单模块");
      return;
    }

    const subtitle =
      draft.subtitle.trim()
      || (draft.kind === "internal"
        ? "内部应用"
        : draft.kind === "external"
          ? "外部系统"
          : "外部链接");

    const base: Omit<AppEntry, "id" | "isCurrentProduct"> = {
      name,
      subtitle,
      kind: draft.kind,
      href:
        draft.kind === "internal"
          ? draft.href.trim() || "/dashboard/"
          : draft.href.trim(),
      openMode: draft.openMode,
      authMode: draft.kind === "link" ? "none" : draft.authMode,
      menuPreset: draft.kind === "internal" ? draft.menuPreset : "accounts-admin",
      modules:
        draft.kind === "internal"
          ? draft.menuPreset === "custom"
            ? draft.modules
            : MENU_PRESET_META[draft.menuPreset].modules
          : [],
    };

    if (editingId) {
      const existing = apps.find((a) => a.id === editingId);
      if (existing?.isCurrentProduct) {
        // Only allow rename / subtitle for builtin
        const next = apps.map((app) =>
          app.id === editingId
            ? normalizeAppEntry({
                ...app,
                name,
                subtitle,
              })
            : app,
        );
        persist(next, "内置应用信息已更新");
        cancelEdit();
        return;
      }
      const next = apps.map((app) =>
        app.id === editingId
          ? normalizeAppEntry({ ...app, ...base, id: editingId })
          : app,
      );
      persist(next, "应用已更新，侧栏将同步菜单与入口");
      cancelEdit();
      return;
    }

    const next: AppEntry[] = [
      ...apps,
      normalizeAppEntry({
        id: createAppId(),
        ...base,
      }),
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

  const editingBuiltin = Boolean(
    editingId && apps.find((a) => a.id === editingId)?.isCurrentProduct,
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl bg-white p-6 outline outline-1 outline-offset-[-1px] outline-fg-grey-200">
        <h2 className="text-lg font-semibold text-fg-black">应用管理</h2>
        <p className="mt-1 text-sm text-fg-grey-700">
          配置侧栏可切换的应用：外部链接、外部系统（认证占位）、内部模块菜单。
          数据保存在本机浏览器。
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
                  <StatusBadge label={kindLabel(app.kind)} color="blue" />
                  {app.isCurrentProduct ? (
                    <StatusBadge label="内置" color="green" />
                  ) : null}
                </div>
                <p className="mt-0.5 text-xs text-fg-grey-500">
                  {app.subtitle || "—"}
                  {app.kind !== "internal"
                    ? ` · ${app.href ?? "无 URL"} · ${APP_AUTH_META[app.authMode].label}`
                    : ` · 菜单 ${MENU_PRESET_META[app.menuPreset]?.label ?? app.menuPreset}`}
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
        {editingBuiltin ? (
          <p className="mt-1 text-sm text-fg-grey-500">
            内置产品仅可改名称与副标题；类型与菜单固定。
          </p>
        ) : null}

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
            placeholder="显示在侧栏当前应用下"
          />

          {!editingBuiltin ? (
            <>
              <SelectOption
                color={siteConfig.accent}
                label="应用类型"
                width="100%"
                options={kindOptions}
                value={draft.kind}
                onChange={(v) =>
                  setDraft((d) => ({
                    ...d,
                    kind: v as AppKind,
                    authMode: v === "link" ? "none" : d.authMode,
                    openMode: v === "internal" ? "same_tab" : d.openMode || "new_tab",
                  }))
                }
              />
              <p className="text-xs text-fg-grey-500">
                {APP_KIND_META[draft.kind].description}
              </p>

              {(draft.kind === "link" || draft.kind === "external") ? (
                <>
                  <TextField
                    color={siteConfig.accent}
                    label="入口地址"
                    value={draft.href}
                    onChange={(v) => setDraft((d) => ({ ...d, href: v }))}
                    placeholder="https://example.com 或 /path/"
                  />
                  <SelectOption
                    color={siteConfig.accent}
                    label="打开方式"
                    width="100%"
                    options={openOptions}
                    value={draft.openMode}
                    onChange={(v) => setDraft((d) => ({ ...d, openMode: v as AppOpenMode }))}
                  />
                </>
              ) : null}

              {draft.kind === "external" ? (
                <SelectOption
                  color={siteConfig.accent}
                  label="认证方式"
                  width="100%"
                  options={authOptions}
                  value={draft.authMode}
                  onChange={(v) => setDraft((d) => ({ ...d, authMode: v as AppAuthMode }))}
                />
              ) : null}

              {draft.kind === "external" && draft.authMode === "oidc" ? (
                <p className="rounded-xl border border-dashed border-fg-grey-200 px-3 py-2 text-xs text-fg-grey-500">
                  OIDC Client ID / Issuer 等配置将在后续版本接入，当前仅保存认证类型。
                </p>
              ) : null}

              {draft.kind === "internal" ? (
                <>
                  <SelectOption
                    color={siteConfig.accent}
                    label="菜单预设"
                    width="100%"
                    options={presetOptions}
                    value={draft.menuPreset}
                    onChange={(v) =>
                      setDraft((d) => ({
                        ...d,
                        menuPreset: v as MenuPresetId,
                        modules:
                          v === "custom"
                            ? d.modules
                            : MENU_PRESET_META[v as MenuPresetId].modules,
                      }))
                    }
                  />
                  {draft.menuPreset === "custom" ? (
                    <div>
                      <p className="mb-2 text-sm font-medium text-fg-grey-700">选择模块</p>
                      <div className="flex flex-col gap-2">
                        {(Object.keys(APP_MODULE_META) as AppModuleId[]).map((id) => {
                          const checked = draft.modules.includes(id);
                          return (
                            <label
                              key={id}
                              className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-fg-grey-200 px-4 py-3"
                            >
                              <span className="text-sm font-medium text-fg-black">
                                {APP_MODULE_META[id].label}
                              </span>
                              <input
                                type="checkbox"
                                className="h-4 w-4"
                                checked={checked}
                                onChange={() =>
                                  setDraft((d) => ({
                                    ...d,
                                    modules: toggleModule(d.modules, id),
                                  }))
                                }
                              />
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-fg-grey-500">
                      将包含：
                      {MENU_PRESET_META[draft.menuPreset].modules
                        .map((m) => APP_MODULE_META[m].label)
                        .join("、")}
                    </p>
                  )}
                  <TextField
                    color={siteConfig.accent}
                    label="默认首页路径（可选）"
                    value={draft.href}
                    onChange={(v) => setDraft((d) => ({ ...d, href: v }))}
                    placeholder="/dashboard/"
                  />
                </>
              ) : null}
            </>
          ) : null}

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
