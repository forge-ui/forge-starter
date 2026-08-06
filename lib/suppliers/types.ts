export type SupplierStatus = "active" | "inactive" | "pending";

export type SupplierCategory =
  | "hardware"
  | "software"
  | "office"
  | "services"
  | "general";

export type Supplier = {
  id: string;
  name: string;
  code: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  category: SupplierCategory;
  status: SupplierStatus;
  rating: number;
  address: string;
  notes: string;
  created: string;
  updated: string;
};

export type SupplierInput = {
  name: string;
  code: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  category: SupplierCategory;
  status: SupplierStatus;
  rating: number;
  address: string;
  notes: string;
};

export const SUPPLIER_STATUS_META: Record<
  SupplierStatus,
  { label: string; color: "green" | "grey" | "yellow" }
> = {
  active: { label: "合作中", color: "green" },
  inactive: { label: "停用", color: "grey" },
  pending: { label: "待审核", color: "yellow" },
};

export const SUPPLIER_CATEGORY_META: Record<
  SupplierCategory,
  { label: string }
> = {
  hardware: { label: "硬件设备" },
  software: { label: "软件许可" },
  office: { label: "办公耗材" },
  services: { label: "专业服务" },
  general: { label: "综合" },
};

export const SUPPLIER_CATEGORIES = Object.keys(
  SUPPLIER_CATEGORY_META,
) as SupplierCategory[];

const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function formatSupplierDate(date: Date) {
  return `${String(date.getDate()).padStart(2, "0")} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

export function isSupplierStatus(v: string): v is SupplierStatus {
  return v === "active" || v === "inactive" || v === "pending";
}

export function isSupplierCategory(v: string): v is SupplierCategory {
  return (SUPPLIER_CATEGORIES as string[]).includes(v);
}
