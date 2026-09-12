"use client";

import { Button, DescriptionItem, StatusBadge } from "@forge-ui-official/core";
import { Modal } from "@/components/ui/modal";
import { siteConfig } from "@/config/site";
import { useRolesStore } from "@/components/roles-store";
import { usePermissionsStore } from "@/components/permissions-store";
import { RBAC_STATUS_META } from "@/lib/rbac/constants";

type Props = {
  roleId: string | null;
  onClose: () => void;
  onEdit?: (id: string) => void;
};

export function RoleDetailDialog({ roleId, onClose, onEdit }: Props) {
  const { getById } = useRolesStore();
  const { permissions } = usePermissionsStore();
  const role = roleId ? getById(roleId) : undefined;
  const granted = permissions.filter((item) => role?.permissionIds.includes(item.id));

  return (
    <Modal open={roleId != null} onClose={onClose} title="角色详情" width="w-[520px]">
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
        {role ? (
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-base font-semibold text-fg-black">{role.name}</h4>
              <StatusBadge
                label={RBAC_STATUS_META[role.status].label}
                color={RBAC_STATUS_META[role.status].color}
              />
            </div>
            <DescriptionItem label="编码" content={role.code} />
            <DescriptionItem label="说明" content={role.description || "—"} />
            <DescriptionItem
              label="权限"
              content={
                granted.length > 0
                  ? granted.map((item) => item.name).join("、")
                  : "尚未授权"
              }
            />
            <DescriptionItem label="创建" content={role.created} />
          </div>
        ) : (
          <p className="text-sm text-fg-grey-500">角色不存在或已删除</p>
        )}
      </div>
      <div className="flex justify-end gap-2 border-t border-fg-grey-100 px-6 py-4">
        <Button color={siteConfig.accent} variant="tertiary" onClick={onClose}>
          关闭
        </Button>
        {role && onEdit ? (
          <Button
            color={siteConfig.accent}
            onClick={() => {
              onClose();
              onEdit(role.id);
            }}
          >
            编辑
          </Button>
        ) : null}
      </div>
    </Modal>
  );
}
