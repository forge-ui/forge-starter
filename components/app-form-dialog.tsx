"use client";

import { useEffect, useState } from "react";
import { Button, SelectOption, TextField } from "@forge-ui-official/core";
import { Modal } from "@/components/ui/modal";
import { toast } from "@/lib/toast";
import { DEFAULT_APP_ID } from "@/config/apps";
import { siteConfig } from "@/config/site";
import {
  APP_AUTH_META,
  APP_KIND_META,
  APP_MODULE_META,
  APP_OPEN_META,
  modulesForApp,
  type AppAuthMode,
  type AppEntry,
  type AppKind,
  type AppModuleId,
  type AppOpenMode,
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

const moduleOptions = (Object.keys(APP_MODULE_META) as AppModuleId[]).map((value) => ({
  value,
  label: APP_MODULE_META[value].label,
}));

type Draft = {
  name: string;
  subtitle: string;
  kind: AppKind;
  href: string;
  openMode: AppOpenMode;
  authMode: AppAuthMode;
  modules: AppModuleId[];
};

const emptyDraft = (): Draft => ({
  name: "",
  subtitle: "",
  kind: "link",
  href: "",
  openMode: "new_tab",
  authMode: "none",
  modules: ["dashboard"],
});

type Props = {
  open: boolean;
  onClose: () => void;
  appId: string | null;
  onSaved?: (id: string) => void;
};

export function AppFormDialog({ open, onClose, appId, onSaved }: Props) {
  const isHost = appId === DEFAULT_APP_ID;
  const mode = appId ? "edit" : "create";
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setFieldErrors({});
    if (mode === "edit" && appId) {
      const app = loadAppRegistry().find((a) => a.id === appId);
      if (!app) {
        setError("应用不存在");
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
        modules: modulesForApp(app),
      });
    } else {
      setDraft(emptyDraft());
    }
  }, [open, mode, appId]);

  function handleClose() {
    setError(null);
    setFieldErrors({});
    onClose();
  }

  function submit() {
    setError(null);
    setFieldErrors({});
    const name = draft.name.trim();
    if (!name) {
      setFieldErrors({ name: "请填写应用名称" });
      return;
    }
    if ((draft.kind === "link" || draft.kind === "external") && !draft.href.trim()) {
      setFieldErrors({ href: "请填写入口地址" });
      return;
    }
    if (draft.kind === "internal" && draft.modules.length === 0) {
      setFieldErrors({ modules: "请至少选择一个菜单" });
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
          ? draft.modules.some((id) => APP_MODULE_META[id].href === draft.href) ? draft.href : APP_MODULE_META[draft.modules[0] ?? "dashboard"].href
          : draft.href.trim(),
      openMode: draft.openMode,
      authMode: draft.kind === "link" ? "none" : draft.authMode,
      modules: draft.kind === "internal" ? draft.modules : [],
    };

    const savedId = appId ?? createAppId();
    try {
      const list = loadAppRegistry();
      if (mode === "edit" && appId) {
        const existing = list.find((a) => a.id === appId);
        if (!existing) {
          setError("无法编辑该应用");
          return;
        }
        saveAppRegistry(
          list.map((a) =>
            a.id === appId ? normalizeAppEntry({ ...a, ...payload, id: appId, hostConfigured: isHost || a.hostConfigured }) : a,
          ),
        );
      } else {
        saveAppRegistry([
          ...list,
          normalizeAppEntry({ id: savedId, ...payload }),
        ]);
      }
    } catch {
      toast.error("保存失败，请检查浏览器存储是否可用");
      return;
    }
    toast.success(mode === "edit" ? "应用配置已保存" : "应用已创建");
    onSaved?.(savedId);
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
            state={fieldErrors.name ? "error" : undefined}
            errorMessage={fieldErrors.name}
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
          {isHost ? <p className="text-sm text-fg-grey-700">应用类型：宿主应用（内部应用）</p> : <SelectOption
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
                modules: v === "internal" && d.modules.length === 0 ? ["dashboard"] : d.modules,
              }))
            }
          />}
          <p className="text-xs text-fg-grey-700">{APP_KIND_META[draft.kind].description}</p>

          {(draft.kind === "link" || draft.kind === "external") ? (
            <>
              <TextField
                color={siteConfig.accent}
                label="入口地址"
                state={fieldErrors.href ? "error" : undefined}
                errorMessage={fieldErrors.href}
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
            <p className="rounded-xl border border-dashed border-fg-grey-200 px-3 py-2 text-xs text-fg-grey-700">
              OIDC 明细配置后续接入，当前仅保存认证类型。
            </p>
          ) : null}

          {draft.kind === "internal" ? (
            <>
              <SelectOption
                type="multiple"
                color={siteConfig.accent}
                label="菜单选择"
                width="100%"
                placeholder="请选择侧栏菜单"
                options={isHost ? moduleOptions.filter((option) => option.value !== "settings") : moduleOptions}
                value={isHost ? draft.modules.filter((id) => id !== "settings") : draft.modules}
                onChange={(values) =>
                  setDraft((d) => ({
                    ...d,
                    modules: isHost ? Array.from(new Set([...(values as AppModuleId[]), "settings" as const])) : values as AppModuleId[],
                  }))
                }
              />
              {fieldErrors.modules ? <p role="alert" className="text-xs text-fg-red">{fieldErrors.modules}</p> : null}
              {isHost ? <p className="text-xs text-fg-grey-700">基础后台保留应用管理菜单，方便继续配置。</p> : null}
              <SelectOption
                color={siteConfig.accent}
                label="默认首页"
                width="100%"
                options={draft.modules.map((id) => ({ value: APP_MODULE_META[id].href, label: APP_MODULE_META[id].label }))}
                value={draft.modules.some((id) => APP_MODULE_META[id].href === draft.href) ? draft.href : APP_MODULE_META[draft.modules[0] ?? "dashboard"].href}
                onChange={(v) => setDraft((d) => ({ ...d, href: v as string }))}
              />
            </>
          ) : null}

          <p className="text-xs text-fg-grey-700">配置保存在当前浏览器。菜单访问权限由登录角色决定。</p>
          {error ? <p className="text-sm text-fg-red">{error}</p> : null}
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-fg-grey-100 px-6 py-4">
        <Button color={siteConfig.accent} variant="tertiary" onClick={handleClose}>
          取消
        </Button>
        <Button color={siteConfig.accent} onClick={submit} disabled={Boolean(error)}>
          {mode === "edit" ? "保存" : "创建"}
        </Button>
      </div>
    </Modal>
  );
}
