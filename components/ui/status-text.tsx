/**
 * 状态文本 — 状态字段的标准呈现（audit-checklist V6）。
 * 彩色胶囊（StatusBadge）在业务页已弃用：状态一律用纯文本表达，
 * 颜色只保留最低限度语义——red=危险/禁用/驳回（红字），grey=失效/撤销（灰字），其余黑字。
 * props 与 StatusBadge 同形（label + color），旧代码可直接替换组件名迁移。
 */
export type StatusTextColor =
  | "green"
  | "red"
  | "yellow"
  | "grey"
  | "blue"
  | "cyan";

export function StatusText({
  label,
  color,
}: {
  label: string;
  color?: StatusTextColor;
}) {
  const cls =
    color === "red"
      ? "text-fg-red"
      : color === "grey"
        ? "text-fg-grey-500"
        : "text-fg-black";
  return <span className={`text-sm font-medium ${cls}`}>{label}</span>;
}
