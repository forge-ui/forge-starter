"use client";

import { Button, DescriptionItem, StatusBadge } from "@forge-ui-official/core";
import { Modal } from "@/components/ui/modal";
import { siteConfig } from "@/config/site";
import { useMenusStore } from "@/components/menus-store";
import { RBAC_STATUS_META } from "@/lib/rbac/constants";

type Props = {
  menuId: string | null;
  onClose: () => void;
  onEdit?: (id: string) => void;
};

export function MenuDetailDialog({ menuId, onClose, onEdit }: Props) {
  const { getById } = useMenusStore();
  const menu = menuId ? getById(menuId) : undefined;

  return (
    <Modal open={menuId != null} onClose={onClose} title="菜单详情" width="w-[520px]">
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
        {menu ? (
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-base font-semibold text-fg-black">{menu.name}</h4>
              <StatusBadge
                label={RBAC_STATUS_META[menu.status].label}
                color={RBAC_STATUS_META[menu.status].color}
              />
            </div>
            <DescriptionItem label="编码" content={menu.code} />
            <DescriptionItem label="路径" content={menu.path} />
            <DescriptionItem label="上级" content={menu.parentName || "一级菜单"} />
            <DescriptionItem label="排序" content={String(menu.sort)} />
            <DescriptionItem
              label="类型"
              content={menu.builtin ? "内置（对齐侧栏模块）" : "目录登记（不自动进侧栏）"}
            />
            <DescriptionItem label="说明" content={menu.description || "—"} />
            <DescriptionItem label="创建" content={menu.created} />
          </div>
        ) : (
          <p className="text-sm text-fg-grey-500">菜单不存在或已删除</p>
        )}
      </div>
      <div className="flex justify-end gap-2 border-t border-fg-grey-100 px-6 py-4">
        <Button color={siteConfig.accent} variant="tertiary" onClick={onClose}>
          关闭
        </Button>
        {menu && onEdit ? (
          <Button
            color={siteConfig.accent}
            onClick={() => {
              onClose();
              onEdit(menu.id);
            }}
          >
            编辑
          </Button>
        ) : null}
      </div>
    </Modal>
  );
}
