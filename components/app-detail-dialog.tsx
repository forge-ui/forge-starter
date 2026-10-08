"use client";

import { Button, DescriptionItem } from "@forge-ui-official/core";
import { Modal } from "@/components/ui/modal";
import { siteConfig } from "@/config/site";
import { APP_AUTH_META, APP_KIND_META, APP_OPEN_META, homePathForApp, modulesLabel, type AppEntry } from "@/config/apps";

export function AppDetailDialog({ app, open, onClose, onEdit }: { app?: AppEntry; open: boolean; onClose: () => void; onEdit?: (id: string) => void }) {
  return <Modal open={open} onClose={onClose} title="应用详情" width="w-[560px]">
    <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
      {app ? <div className="flex flex-col gap-4">
        <h4 className="text-base font-semibold text-fg-black">{app.name}</h4>
        <DescriptionItem label="说明" content={app.subtitle || "—"} />
        <DescriptionItem label="类型" content={app.isCurrentProduct ? "宿主应用" : APP_KIND_META[app.kind].label} />
        {app.kind === "internal" ? <>
          <DescriptionItem label="侧栏菜单" content={modulesLabel(app)} />
          <DescriptionItem label="默认首页" content={homePathForApp(app)} />
        </> : <DescriptionItem label="入口地址" content={app.href || "—"} />}
        <DescriptionItem label="认证方式" content={app.kind === "internal" ? "本平台角色权限" : APP_AUTH_META[app.authMode].label} />
        <DescriptionItem label="打开方式" content={APP_OPEN_META[app.openMode].label} />
        <DescriptionItem label="配置存储" content="当前浏览器" />
      </div> : <p className="text-sm text-fg-grey-500">应用不存在或已删除</p>}
    </div>
    <div className="flex justify-end gap-2 border-t border-fg-grey-100 px-6 py-4">
      <Button color={siteConfig.accent} variant="tertiary" onClick={onClose}>关闭</Button>
      {app && onEdit ? <Button color={siteConfig.accent} onClick={() => { onClose(); onEdit(app.id); }}>配置应用</Button> : null}
    </div>
  </Modal>;
}
