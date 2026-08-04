"use client";

import { useEffect, useState } from "react";
import { Button, SelectOption, TextField } from "@forge-ui-official/core";
import { Modal } from "@/components/ui/modal";
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

function toggleModule(list: AppModuleId[], id: AppModuleId): AppModuleId[] {
  if (list.includes(id)) {
    const next = list.filter((m) => m !== id);
    return next.length > 0 ? next : list;
  }
  return [...list, id];
}

type Props = {
  open: boolean;
  onClose: () => void;
  /** null = create */
  appId: string | null;
  onSaved?: () => void;
};

export function AppFormDialog({ open, onClose, appId, onSaved }: Props) {
  const mode = appId ? "edit" : "create";
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    if (mode === "edit" && appId) {
      const app = loadAppRegistry().find((a) => a.id === appId);
      if (!app || app.isCurrentProduct) {
        setError("应用不存在或不可编辑");
        setDraft(emptyDraft());
        return;
      }
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
    } else {
      setDraft(emptyDraft());
    }
  }, [open, mode, appId]);

  function handleClose() {
    setError(null);
    onClose();
  }

  function submit() {
    setError(null);
    const name = draft.name.trim();
    if (!name) {
      setError("请填写应用名称");
      return;
    }
    if ((draft.kind === "link" || draft.kind === "external") && !draft.href.trim()) {
      setError("请填写入口地址");
      return;
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

    const payload: Omit<AppEntry, "id" | "isCurrentProduct"> = {
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

    const list = loadAppRegistry();
    if (mode === "edit" && appId) {
      const existing = list.find((a) => a.id === appId);
      if (!existing || existing.isCurrentProduct) {
        setError("无法编辑该应用");
        return;
      }
      saveAppRegistry(
        list.map((a) =>
          a.id === appId ? normalizeAppEntry({ ...a, ...payload, id: appId }) : a,
        ),
      );
    } else {
      saveAppRegistry([
        ...list,
        normalizeAppEntry({ id: createAppId(), ...payload }),
      ]);
    }
    onSaved?.();
    handleClose();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={mode === "edit" ? "编辑应用" : "新建应用"}
      width="w-[560px]"
    >
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
        <div className="flex flex-col gap-4">
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
            placeholder="显示在侧栏应用名称下"
          />
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
          <p className="text-xs text-fg-grey-500">{APP_KIND_META[draft.kind].description}</p>

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
              OIDC 明细配置后续接入，当前仅保存认证类型。
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

          {error ? <p className="text-sm text-fg-red">{error}</p> : null}
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-fg-grey-100 px-6 py-4">
        <Button color={siteConfig.accent} variant="tertiary" onClick={handleClose}>
          取消
        </Button>
        <Button color={siteConfig.accent} onClick={submit}>
          {mode === "edit" ? "保存" : "创建"}
        </Button>
      </div>
    </Modal>
  );
}
