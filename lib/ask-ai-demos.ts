import type { AskAiSessionItem } from "@forge-ui-official/core";

export type AskAiDemoId = "page" | "next" | "status" | "rbac";

export type AskAiAccountSnapshot = {
  ready: boolean;
  note?: string;
  total: number;
  byStatus: Record<"active" | "disabled" | "pending" | "locked", number>;
  byRole: Record<string, number>;
  recent: Array<{ name: string; role: string; status: string }>;
};

export type AskAiDemo = {
  id: AskAiDemoId;
  title: string;
  summary: string;
  keywords: string[];
};

export const ASK_AI_DEMOS: AskAiDemo[] = [
  {
    id: "page",
    title: "这个页面可以做什么？",
    summary: "对照当前页角色，说明能看什么、能点去哪。",
    keywords: ["页面", "做什么", "能干", "介绍", "这是哪", "当前页"],
  },
  {
    id: "next",
    title: "账号管理下一步做什么？",
    summary: "按种子数据给出可执行的下一步，而不是空清单。",
    keywords: ["下一步", "接下来", "怎么开始", "新手", "先做"],
  },
  {
    id: "status",
    title: "现在账号状态怎么样？",
    summary: "用启用/停用分布回答，不编造库存或销量。",
    keywords: ["状态", "启用", "停用", "多少账号", "统计", "健康"],
  },
  {
    id: "rbac",
    title: "新增账号怎么配权限？",
    summary: "账号、角色、菜单怎么串起来，以及直链没权限会怎样。",
    keywords: ["权限", "角色", "菜单", "rbac", "配权", "勾选"],
  },
];

export const ASK_AI_SUGGESTIONS = ASK_AI_DEMOS.map((demo) => demo.title);

export const ASK_AI_DEMO_SESSIONS: AskAiSessionItem[] = ASK_AI_DEMOS.map((demo) => ({
  id: `demo-${demo.id}`,
  title: demo.title,
}));

export const ASK_AI_FALLBACK_SUMMARY =
  "先点下面四条。模型管理里启用的默认模型会用来问答；没有可用模型时再看 ASK_AI_LLM_API_KEY，都没有就走本地规则。";

export function matchAskAiDemo(question: string): AskAiDemo | null {
  const text = question.trim().replace(/\s+/g, " ");
  if (!text) return null;
  const exact = ASK_AI_DEMOS.find((demo) => demo.title === text);
  if (exact) return exact;
  const contained = ASK_AI_DEMOS.find((demo) => text.includes(demo.title) || demo.title.includes(text));
  if (contained) return contained;

  let best: AskAiDemo | null = null;
  let score = 0;
  for (const demo of ASK_AI_DEMOS) {
    const hits = demo.keywords.filter((word) => text.includes(word)).length;
    if (hits > score) {
      best = demo;
      score = hits;
    }
  }
  return score >= 2 ? best : null;
}
