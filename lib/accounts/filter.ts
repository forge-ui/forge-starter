import type { AdminAccount } from "./types";
import type { AccountFilter } from "./input";
/** Shared by the page, agent queries and CSV export. Pagination is deliberately absent. */
export function matchesAccount(a: AdminAccount, filter: AccountFilter) {
  if (filter.status && a.status !== filter.status) return false;
  if (filter.role && a.role !== filter.role) return false;
  const q = filter.query?.trim().toLowerCase();
  if (!q) return true;
  return [a.name, a.username, a.email, a.department, a.role].some((v) => v.toLowerCase().includes(q))
    || a.phone.replace(/\s/g, "").includes(q.replace(/\s/g, ""));
}
