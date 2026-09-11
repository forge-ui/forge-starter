"use client";

import { Button, DescriptionItem } from "@forge-ui-official/core";
import { Modal } from "@/components/ui/modal";
import { siteConfig } from "@/config/site";
import { usePermissionsStore } from "@/components/permissions-store";
import { RBAC_ACTION_META, RBAC_RESOURCE_META } from "@/lib/rbac/constants";

type Props = {
  permissionId: string | null;
  onClose: () => void;
  onEdit?: (id: string) => void;
};

export function PermissionDetailDialog({ permissionId, onClose, onEdit }: Props) {
  const { getById } = usePermissionsStore();
  const permission = permissionId ? getById(permissionId) : undefined;

  return (
    <Modal open={permissionId != null} onClose={onClose} title="权限详情" width="w-[520px]">
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
        {permission ? (
          <div className="flex flex-col gap-4">
            <h4 className="text-base font-semibold text-fg-black">{permission.name}</h4>
            <DescriptionItem label="编码" content={permission.code} />
            <DescriptionItem
              label="资源"
              content={RBAC_RESOURCE_META[permission.resource].label}
            />
            <DescriptionItem
              label="操作"
              content={RBAC_ACTION_META[permission.action].label}
            />
            <DescriptionItem label="说明" content={permission.description || "—"} />
            <DescriptionItem
              label="已授权角色"
              content={permission.roleNames.length > 0 ? permission.roleNames.join("、") : "尚未授权"}
            />
            <DescriptionItem label="创建" content={permission.created} />
          </div>
        ) : (
          <p className="text-sm text-fg-grey-500">权限不存在或已删除</p>
        )}
      </div>
      <div className="flex justify-end gap-2 border-t border-fg-grey-100 px-6 py-4">
        <Button color={siteConfig.accent} variant="tertiary" onClick={onClose}>
          关闭
        </Button>
        {permission && onEdit ? (
          <Button
            color={siteConfig.accent}
            onClick={() => {
              onClose();
              onEdit(permission.id);
            }}
          >
            编辑
          </Button>
        ) : null}
      </div>
    </Modal>
  );
}
