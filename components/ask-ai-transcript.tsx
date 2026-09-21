"use client";

import {
  AgentCodeBlock,
  AgentDiffTable,
  AgentFlowchart,
  AgentTaskRows,
  ApprovalCard,
  CommandSearch,
  ContextCards,
  InsightCards,
  RecommendationCard,
  StreamingAnswer,
  ThinkingTrace,
  ToolChips,
} from "@forge-ui-official/core";
import {
  ASK_AI_DEMOS,
  ASK_AI_FALLBACK_SUMMARY,
  ASK_AI_SUGGESTIONS,
  matchAskAiDemo,
  type AskAiDemoId,
} from "@/lib/ask-ai-demos";

function otherQuestions(id?: AskAiDemoId) {
  return ASK_AI_DEMOS.filter((demo) => demo.id !== id).map((demo) => demo.title);
}

function pageAnswer(pageLabel: string) {
  return `当前在「${pageLabel}」。这是 Forge Starter 的管理后台：工作台看账号概况，账号管理做 CRUD，角色 / 菜单 / 权限决定侧栏和直链能不能进。演示回复不接真模型，点下面继续问。`;
}

export function AskAiTranscript({
  question,
  pageLabel,
  onAsk,
}: {
  question: string;
  pageLabel: string;
  onAsk: (text: string) => void;
}) {
  const demo = matchAskAiDemo(question);

  return (
    <div className="flex flex-col gap-5 p-5">
      <div className="flex flex-col items-end gap-1.5">
        <span className="text-xs text-fg-grey-500">你</span>
        <p className="max-w-full rounded-2xl bg-fg-grey-100 px-4 py-3 text-sm leading-6 text-fg-black">
          {question}
        </p>
      </div>
      <div className="flex flex-col gap-5">
        <span className="text-xs text-fg-grey-500">Ask AI</span>
        {demo?.id === "page" ? (
          <PageDemo pageLabel={pageLabel} onAsk={onAsk} />
        ) : demo?.id === "next" ? (
          <NextDemo onAsk={onAsk} />
        ) : demo?.id === "status" ? (
          <StatusDemo onAsk={onAsk} />
        ) : demo?.id === "rbac" ? (
          <RbacDemo onAsk={onAsk} />
        ) : (
          <FallbackDemo onAsk={onAsk} />
        )}
      </div>
    </div>
  );
}

function PageDemo({ pageLabel, onAsk }: { pageLabel: string; onAsk: (text: string) => void }) {
  return (
    <>
      <ThinkingTrace
        variant="steps"
        settled
        doneLabel="已对照当前页"
        rows={[
          { primary: "看页面角色", secondary: pageLabel },
          { primary: "对侧栏模块", secondary: "工作台 · 账号 · 角色 · 菜单" },
        ]}
      />
      <StreamingAnswer
        text={pageAnswer(pageLabel)}
        sources={[
          { name: "工作台", domain: "/dashboard/" },
          { name: "账号管理", domain: "/accounts/" },
        ]}
        followUps={otherQuestions("page")}
        followUpsLabel="示范问题"
        onFollowUp={(text) => onAsk(text)}
      />
      <CommandSearch
        placeholder="跳到模块或示范问题"
        emptyLabel="没有匹配的入口"
        items={[
          { id: "accounts", label: "打开账号管理", hint: "列表", group: "页面" },
          { id: "roles", label: "打开角色", hint: "权限", group: "页面" },
          { id: "next", label: ASK_AI_DEMOS[1]!.title, hint: "示范", group: "继续问" },
          { id: "status", label: ASK_AI_DEMOS[2]!.title, hint: "示范", group: "继续问" },
        ]}
        onSelect={(item) =>
          onAsk(item.id === "accounts" || item.id === "roles" ? ASK_AI_DEMOS[1]!.title : item.label)
        }
      />
    </>
  );
}

function NextDemo({ onAsk }: { onAsk: (text: string) => void }) {
  return (
    <>
      <StreamingAnswer
        text="种子里通常已有超级管理员。下一步不是再抄一遍英文 onboarding，而是：确认库已推、建一个运营账号、给角色勾上 accounts:read。没有 :read 的人直链会被壳送回工作台。"
        followUps={otherQuestions("next")}
        followUpsLabel="示范问题"
        onFollowUp={(text) => onAsk(text)}
      />
      <AgentTaskRows
        tasks={[
          {
            id: "db",
            title: "确认账号表已推到 Postgres",
            status: "completed",
            meta: "pnpm db:push",
            children: [{ label: "demo 登录过了", value: "还要 DATABASE_URL", status: "completed" }],
          },
          {
            id: "create",
            title: "新建一条运营账号",
            status: "running",
            meta: "账号管理",
            children: [
              { label: "打开新建弹窗", value: "必填姓名/邮箱", status: "running" },
              { label: "先不要停用", value: "默认启用" },
            ],
          },
          {
            id: "role",
            title: "给角色勾 accounts:read",
            status: "failed",
            meta: "还没配",
          },
        ]}
      />
      <RecommendationCard
        title="先建一个运营账号？"
        body="列表里多半是种子管理员。先建运营号，再去角色里勾模块，比空点侧栏有用。"
        confidence="high"
        acceptLabel="去看怎么配权限"
        alternatives={[
          { id: "status", label: "先看现在账号状态", confidence: "review" },
          { id: "page", label: "先解释当前页", confidence: "none" },
        ]}
        onAccept={() => onAsk(ASK_AI_DEMOS[3]!.title)}
        onSelectAlternative={(id) =>
          onAsk(ASK_AI_DEMOS.find((demo) => demo.id === id)?.title ?? ASK_AI_SUGGESTIONS[0]!)
        }
      />
      <ApprovalCard
        questions={[
          {
            id: "role",
            prompt: "这个账号先用哪个角色？",
            options: [
              { id: "admin", label: "超级管理员（全开）" },
              { id: "ops", label: "运营（账号读写）" },
              { id: "read", label: "只读" },
            ],
          },
          {
            id: "modules",
            prompt: "侧栏先开哪些模块？",
            type: "check",
            options: [
              { id: "accounts", label: "账号管理" },
              { id: "roles", label: "角色" },
              { id: "menus", label: "菜单" },
            ],
          },
        ]}
        onSubmitted={() => onAsk(ASK_AI_DEMOS[3]!.title)}
      />
    </>
  );
}

function StatusDemo({ onAsk }: { onAsk: (text: string) => void }) {
  return (
    <>
      <ToolChips
        summary="读了账号列表，没有查冰淇淋销量"
        items={[
          {
            id: "think",
            kind: "think",
            label: "对照列表字段",
            chip: "启用 / 停用",
            detail: [{ text: "StatusBadge 只表示账号状态，不当角色胶囊。" }],
          },
          {
            id: "read",
            kind: "read",
            label: "读取账号",
            chip: "GET /api/accounts",
            mono: true,
            detail: [{ text: "工作台和列表共用 accounts store。" }],
          },
        ]}
      />
      <StreamingAnswer
        text="演示数据里启用账号仍是多数，停用的是个别种子。点名称进全页详情，不要另做眼睛图标。要改状态走编辑弹窗，操作结果用全站 toast。"
        followUps={otherQuestions("status")}
        followUpsLabel="示范问题"
        onFollowUp={(text) => onAsk(text)}
      />
      <InsightCards
        cards={[
          {
            id: "active",
            title: "启用账号",
            body: "近几周新建都保持启用，工作台折线跟列表一致。",
            prompt: ASK_AI_DEMOS[1]!.title,
            chart: { kind: "spark", series: [{ name: "启用", values: [6, 7, 7, 8, 9, 9] }] },
          },
          {
            id: "disabled",
            title: "停用占比",
            body: "停用仍是少数。没有 :read 的角色直链进不了列表。",
            prompt: ASK_AI_DEMOS[3]!.title,
            chart: { kind: "bars", values: [9, 2] },
          },
        ]}
        onAsk={(prompt) => onAsk(prompt)}
      />
      <AgentDiffTable
        title="最近状态"
        columns={[
          { key: "name", label: "账号" },
          { key: "status", label: "状态" },
          { key: "note", label: "说明" },
        ]}
        rows={[
          { id: "admin", change: "keep", cells: { name: "超级管理员", status: "启用", note: "种子，别停" } },
          { id: "guest", change: "remove", cells: { name: "访客演示", status: "停用", note: "无模块权限" } },
          { id: "ops", change: "add", cells: { name: "运营", status: "启用", note: "待配角色" } },
        ]}
      />
    </>
  );
}

function RbacDemo({ onAsk }: { onAsk: (text: string) => void }) {
  return (
    <>
      <StreamingAnswer
        text="新账号本身不带侧栏。侧栏可见 = 菜单三处 ∩ 当前应用勾选 ∩ 角色的 {module}:read。只改 rbac_menus 目录、不写 APP_MODULE_IDS，侧栏还是空的。"
        followUps={otherQuestions("rbac")}
        followUpsLabel="示范问题"
        onFollowUp={(text) => onAsk(text)}
      />
      <AgentFlowchart
        title="账号怎么看见模块"
        nodes={[
          { id: "account", kind: "trigger", title: "新建账号", body: "登录用户 ≠ 业务账号" },
          { id: "role", kind: "condition", title: "角色有 :read？", body: "没有就直链回工作台" },
          { id: "menu", kind: "action", title: "侧栏出现模块", body: "还要应用勾选该 id" },
        ]}
        edges={[
          { from: "account", to: "role", label: "绑角色" },
          { from: "role", to: "menu", label: "有权限" },
        ]}
      />
      <ContextCards
        total={3}
        chunks={[
          {
            id: "ids",
            title: "菜单三处",
            body: "APP_MODULE_IDS、APP_MODULE_META、MODULE_MENU 要一起改，缺一处侧栏没有入口。",
            sourceKind: "配置",
            sourceLabel: "config/apps.ts · menu.tsx",
          },
          {
            id: "read",
            title: "直链守卫",
            body: "没有 accounts:read 时，/accounts 由壳 replace 回工作台，不要停在空列表。",
            sourceKind: "壳",
            sourceLabel: "components/app-shell.tsx",
          },
        ]}
      />
      <AgentCodeBlock
        filename="lib/rbac/can.ts"
        lines={[
          "export function canRead(perms: string[], module: string) {",
          "  return perms.includes(`${module}:read`);",
          "}",
        ]}
        diff={[
          {
            old: 1,
            cur: 1,
            type: "ctx",
            pieces: [{ text: "export function canRead(perms: string[], module: string) {" }],
          },
          {
            old: 2,
            cur: null,
            type: "del",
            pieces: [{ text: "  return perms.length > 0;", change: "del" }],
          },
          {
            old: null,
            cur: 2,
            type: "add",
            pieces: [{ text: "  return perms.includes(`${module}:read`);", change: "add" }],
          },
          { old: 3, cur: 3, type: "ctx", pieces: [{ text: "}" }] },
        ]}
      />
    </>
  );
}

function FallbackDemo({ onAsk }: { onAsk: (text: string) => void }) {
  return (
    <StreamingAnswer
      text={ASK_AI_FALLBACK_SUMMARY}
      followUps={ASK_AI_SUGGESTIONS}
      followUpsLabel="示范问题"
      onFollowUp={(text) => onAsk(text)}
    />
  );
}
