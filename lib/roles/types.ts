import type { RbacStatus } from "@/lib/rbac/constants";

export type RoleInput = {
  name: string;
  code: string;
  description: string;
  status: RbacStatus;
  permissionIds: string[];
};

export type RoleRecord = {
  id: string;
  name: string;
  code: string;
  description: string;
  status: RbacStatus;
  permissionIds: string[];
  permissionCount: number;
  created: string;
  createdAt: string;
  updatedAt: string;
};
