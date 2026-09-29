import { APP_MODULE_IDS, APP_MODULE_META } from "@/config/apps";

/** Only registered entrances and concrete detail routes are navigable. */
export type AgentNavigation = { href: string; label: string };

export function parseAgentNavigation(value: unknown): AgentNavigation | undefined {
  if (!value || typeof value !== "object") return undefined;
  const href = (value as Record<string, unknown>).href;
  const moduleId = APP_MODULE_IDS.find((id) => APP_MODULE_META[id].href === href);
  if (typeof href === "string" && /^\/accounts\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/$/i.test(href)) {
    return { href, label: "账号详情" };
  }
  if (!moduleId) return undefined;
  return { href: APP_MODULE_META[moduleId].href, label: APP_MODULE_META[moduleId].label };
}

export function withoutNavigationClaim(text: string) {
  return /(?:已(?:经)?|成功)[^。！？\n]{0,12}(?:跳转|导航|切换(?:到|至)|打开[^。！？\n]{0,16}页)/.test(text)
    ? "尚未执行页面跳转。请明确要打开的页面，我会调用页面导航工具。"
    : text;
}

/** Confirm a committed route, including a short settling period for access redirects. */
export async function executeAgentNavigation(
  value: AgentNavigation,
  options: { push: (href: string) => void; getPath: () => string; signal: AbortSignal; timeoutMs?: number },
): Promise<string> {
  const navigation = parseAgentNavigation(value);
  if (!navigation) throw new Error("页面未登记，无法跳转");
  const normalize = (path: string) => path.replace(/\/+$/, "");
  const target = normalize(navigation.href);
  if (options.signal.aborted) throw new Error("已取消页面跳转");
  if (normalize(options.getPath()) !== target) options.push(navigation.href);
  const started = Date.now();
  let arrivedAt: number | undefined;
  while (Date.now() - started < (options.timeoutMs ?? 10_000)) {
    if (options.signal.aborted) throw new Error("已取消页面跳转");
    if (normalize(options.getPath()) === target) {
      arrivedAt ??= Date.now();
      if (Date.now() - arrivedAt >= 250) return `已打开${navigation.label}页面。`;
    } else {
      arrivedAt = undefined;
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error(`未能打开${navigation.label}页面，请检查当前应用是否包含该模块及访问权限。`);
}
