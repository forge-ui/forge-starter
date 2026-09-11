import type { RbacAction, RbacResource } from "@/lib/rbac/constants";

export type PermissionInput = {
  name: string;
  code: string;
  resource: RbacResource;
  action: RbacAction;
  description: string;
};

export type PermissionRecord = {
  id: string;
  name: string;
  code: string;
  resource: RbacResource;
  action: RbacAction;
  description: string;
  roleIds: string[];
  roleNames: string[];
  roleCount: number;
  created: string;
  createdAt: string;
  updatedAt: string;
};
