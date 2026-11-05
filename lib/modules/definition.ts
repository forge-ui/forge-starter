export type ModuleDefinition = {
  id: string;
  label: string;
  order: number;
  permissionResource: string;
  menu: { href: string; icon: string; group: string };
  knowledge: { summary: string; fields: string; rules: string; source: string };
  read: { service: string; export: string; fields: string[]; fieldLabels?: Record<string, string>; sensitiveFields?: string[] } | { unavailable: string };
  tools?: { source: string; export: string }[];
  draft?: { adapter: "resource" | "specialized"; fields?: string[] } | {
    adapter: "generic";
    schema: { source: string; export: string };
    fields: string[];
    actions: ("create" | "update" | "delete")[];
    pageAdapter: string;
  };
  entries?: { create?: boolean; detail?: boolean; edit?: boolean };
};

export function defineModule<const Definition extends ModuleDefinition>(definition: Definition): Definition & ModuleDefinition {
  if (!definition.id || !definition.knowledge.summary.trim() || !definition.knowledge.rules.trim()) {
    throw new Error("模块声明缺少标识或知识说明");
  }
  if ("unavailable" in definition.read && !definition.read.unavailable.trim()) {
    throw new Error("不可读取的模块必须说明原因");
  }
  return definition;
}
