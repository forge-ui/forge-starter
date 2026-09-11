import type { RbacStatus } from "@/lib/rbac/constants";

export type MenuInput = {
  name: string;
  code: string;
  path: string;
  parentId: string | null;
  sort: number;
  status: RbacStatus;
  description: string;
};

export type MenuRecord = {
  id: string;
  name: string;
  code: string;
  path: string;
  parentId: string | null;
  parentName: string | null;
  sort: number;
  status: RbacStatus;
  moduleId: string | null;
  builtin: boolean;
  description: string;
  created: string;
  createdAt: string;
  updatedAt: string;
};
