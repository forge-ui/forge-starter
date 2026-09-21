import type {
  AgentCodeDiffRow,
  AgentDiffColumn,
  AgentDiffRow,
  AgentFlowEdge,
  AgentFlowNode,
  AgentTask,
  ApprovalQuestion,
  CommandSearchItem,
  ContextChunk,
  InsightCard,
  PromptCommand,
  PromptModel,
  PromptSource,
  RecommendationOption,
  StreamingSource,
  ToolChipItem,
  ToolDiffChip,
} from "@forge-ui-official/core";

/** 对照 https://www.forgeui.org/cases/agent */

export const AGENT_TASKS: AgentTask[] = [
  {
    id: "1",
    title: "Verified vendor records",
    status: "completed",
    meta: "12 suppliers",
    children: [
      { label: "Matched tax and contact IDs", value: "12/12", status: "completed" },
      { label: "Flagged stale records", value: "2", status: "failed" },
    ],
  },
  {
    id: "2",
    title: "Build reorder task list",
    status: "running",
    meta: "7 SKUs",
    children: [
      { label: "Reading POS export", value: "3 files", status: "running" },
      { label: "Scoring stockout risk", value: "68%" },
    ],
  },
  {
    id: "3",
    title: "Draft supplier emails",
    status: "failed",
    meta: "2 messages",
  },
];

export const AGENT_STREAM_TEXT =
  "Pistachio is your fastest-growing flavor — sales are up 23% this month and margins beat vanilla by 8 points.";

export const AGENT_STREAM_SOURCES: StreamingSource[] = [
  { name: "Scoop Data", domain: "scoopdata.io" },
  { name: "Trends Index", domain: "trends.google.com" },
  { name: "Market Basket", domain: "marketbasket.io" },
];

export const AGENT_FOLLOW_UPS = [
  "Which flavors sell best in winter",
  "Compare gelato and soft serve margins",
];

export const AGENT_APPROVAL_QUESTIONS: ApprovalQuestion[] = [
  {
    id: "count",
    prompt: "How many flavors should we launch?",
    options: [
      { id: "three", label: "Three (core line)" },
      { id: "five", label: "Five (full case)" },
      { id: "one", label: "Just one hero" },
    ],
  },
  {
    id: "mixins",
    prompt: "Which mix-ins should we stock?",
    type: "check",
    options: [
      { id: "chips", label: "Chocolate chips" },
      { id: "waffle", label: "Waffle bits" },
      { id: "sprinkles", label: "Sprinkles" },
    ],
  },
  {
    id: "market",
    prompt: "Which market do we enter first?",
    options: [
      { id: "trucks", label: "Food trucks" },
      { id: "grocery", label: "Grocery freezers" },
      { id: "shops", label: "Scoop shops" },
    ],
  },
];

export const AGENT_TOOL_ITEMS: ToolChipItem[] = [
  {
    id: "think",
    kind: "think",
    label: "Thinking",
    chip: "Planning the churn schedule…",
    detail: [
      { text: "Weekend demand carries pistachio, so it churns first." },
      { text: "Batch capacity leaves two evening freezer windows." },
    ],
  },
  {
    id: "write",
    kind: "write",
    label: "Write 204 lines",
    chip: "ChurnSchedule.tsx",
    mono: true,
    detail: [
      { text: "+ const windows = slots.filter((s) => s.temp <= -12)", tone: "add" },
      { text: "+ return schedule(windows, { hero: \"pistachio\" })", tone: "add" },
    ],
  },
  {
    id: "run",
    kind: "run",
    label: "Rebuild and verify",
    chip: "npm run freeze",
    mono: true,
    detail: [{ text: "✓ built in 1.2s" }, { text: "✓ 34 checks passed" }],
  },
];

export const AGENT_TOOL_DIFFS: ToolDiffChip[] = [
  { file: "flavors.css", add: 13 },
  { file: "ChurnSchedule.tsx", add: 74, del: 41 },
  { file: "menu.ts", add: 8, del: 2 },
];

export const AGENT_PROMPT_SOURCES: PromptSource[] = [
  { id: "sales", label: "Scoop Data", description: "Sales & churn metrics", connected: true },
  { id: "flavors", label: "Flavor records", description: "26 makers, tags, links" },
];

export const AGENT_PROMPT_COMMANDS: PromptCommand[] = [
  { id: "plan", label: "plan", description: "Draft a flavor launch plan" },
  { id: "forecast", label: "forecast", description: "Forecast summer demand" },
];

export const AGENT_PROMPT_MODELS: PromptModel[] = [
  { id: "fast", label: "Forge Fast" },
  { id: "think", label: "Forge Think" },
];

export const AGENT_CHUNKS: ContextChunk[] = [
  {
    id: "1",
    title: "Vendor onboarding rule",
    body: "Cold-chain certification must be verified before a new dairy can be added to the reorder workflow.",
    sourceKind: "PDF",
    sourceLabel: "Dairy Onboarding SOP.pdf",
    charCount: 290,
  },
  {
    id: "2",
    title: "Seasonal demand row",
    body: "Q4 velocity table: pistachio +18%, vanilla +6%, rocky road -11%; retire flavors below 40 scoops weekly.",
    sourceKind: "CSV",
    sourceLabel: "Sales Velocity Export.csv",
    charCount: 1250,
  },
];

export const AGENT_RECOMMENDATION_ALTS: RecommendationOption[] = [
  { id: "vanilla", label: "Switch to Vanilla Madagascar", confidence: "review" },
  { id: "full", label: "Full restock across every SKU", confidence: "none" },
];

export const AGENT_DIFF_COLUMNS: AgentDiffColumn[] = [
  { key: "flavor", label: "Flavor" },
  { key: "scoops", label: "Weekly scoops" },
  { key: "action", label: "Action" },
];

export const AGENT_DIFF_ROWS: AgentDiffRow[] = [
  { id: "pistachio", change: "keep", cells: { flavor: "Pistachio", scoops: "186", action: "Keep weekend window" } },
  { id: "rocky", change: "remove", cells: { flavor: "Rocky Road", scoops: "28", action: "Retire from freezer" } },
  { id: "mint", change: "add", cells: { flavor: "Mint Chip", scoops: "94", action: "Add Saturday slot" } },
];

export const AGENT_CODE_LINES = [
  "export async function scoreStockout(sku: string) {",
  "  const velocity = await readVelocity(sku);",
  "  return velocity.weekend > 80 ? 'reorder' : 'hold';",
  "}",
];

export const AGENT_CODE_DIFF: AgentCodeDiffRow[] = [
  { old: 1, cur: 1, type: "ctx", pieces: [{ text: "export async function scoreStockout(sku: string) {" }] },
  { old: 2, cur: null, type: "del", pieces: [{ text: "  const velocity = await readVelocity(sku);", change: "del" }] },
  { old: null, cur: 2, type: "add", pieces: [{ text: "  const velocity = await readVelocity(sku, { window: 'weekend' });", change: "add" }] },
  { old: 3, cur: 3, type: "ctx", pieces: [{ text: "  return velocity.weekend > 80 ? 'reorder' : 'hold';" }] },
  { old: 4, cur: 4, type: "ctx", pieces: [{ text: "}" }] },
];

export const AGENT_INSIGHTS: InsightCard[] = [
  {
    id: "weekend",
    title: "Weekend velocity",
    body: "Mint chip now tracks pistachio on Saturdays.",
    prompt: "Rebalance weekend freezers",
    chart: { kind: "spark", series: [{ name: "Mint", values: [42, 48, 61, 74, 88, 94] }] },
  },
  {
    id: "mix",
    title: "Flavor mix",
    body: "Rocky road dropped below the 40-scoop floor.",
    prompt: "Retire rocky road",
    chart: { kind: "bars", values: [86, 72, 54, 28, 41] },
  },
];

export const AGENT_COMMANDS: CommandSearchItem[] = [
  { id: "plan", label: "Draft a flavor launch plan", hint: "/plan", group: "Planning" },
  { id: "compare", label: "Compare mint chip to last summer", hint: "/compare", group: "Planning" },
  { id: "pos", label: "Open POS export", hint: "CSV", group: "Data" },
  { id: "reorder", label: "Queue pistachio reorder", hint: "workflow", group: "Workflow" },
];

export const AGENT_FLOW_NODES: AgentFlowNode[] = [
  { id: "spike", kind: "trigger", title: "POS weekend spike", body: "Mint chip crosses 80 scoops." },
  { id: "check", kind: "condition", title: "Stockout risk?", body: "Lead time longer than 5 days." },
  { id: "draft", kind: "action", title: "Draft reorder", body: "Cone King, 7-day lead time." },
];

export const AGENT_FLOW_EDGES: AgentFlowEdge[] = [
  { from: "spike", to: "check", label: "always" },
  { from: "check", to: "draft", label: "if at risk" },
];
