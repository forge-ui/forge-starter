"use client";

/**
 * Agent kit gallery — https://www.forgeui.org/cases/agent
 */

import { useState } from "react";
import {
  AgentCodeBlock,
  AgentDiffTable,
  AgentFlowchart,
  AgentTaskRows,
  ApprovalCard,
  CommandSearch,
  ContextCards,
  Grid,
  GridItem,
  InsightCards,
  PromptBar,
  RecommendationCard,
  StreamingAnswer,
  ThinkingTrace,
  ToolChips,
} from "@forge-ui-official/core";
import { RefChrome } from "@/components/reference/ref-chrome";
import { REF_PAGES } from "@/lib/reference/catalog";
import {
  AGENT_APPROVAL_QUESTIONS,
  AGENT_CHUNKS,
  AGENT_CODE_DIFF,
  AGENT_CODE_LINES,
  AGENT_COMMANDS,
  AGENT_DIFF_COLUMNS,
  AGENT_DIFF_ROWS,
  AGENT_FLOW_EDGES,
  AGENT_FLOW_NODES,
  AGENT_FOLLOW_UPS,
  AGENT_INSIGHTS,
  AGENT_PROMPT_COMMANDS,
  AGENT_PROMPT_MODELS,
  AGENT_PROMPT_SOURCES,
  AGENT_RECOMMENDATION_ALTS,
  AGENT_STREAM_SOURCES,
  AGENT_STREAM_TEXT,
  AGENT_TASKS,
  AGENT_TOOL_DIFFS,
  AGENT_TOOL_ITEMS,
} from "@/lib/reference/agent-demo";

const meta = REF_PAGES.find((page) => page.slug === "agent")!;

function AgentSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-fg-black">{title}</h2>
        <p className="text-sm text-fg-grey-700">{description}</p>
      </div>
      {children}
    </section>
  );
}

export default function RefAgentPage() {
  const [followUp, setFollowUp] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [sent, setSent] = useState<string[]>([]);

  return (
    <RefChrome meta={meta}>
      <div className="flex flex-col gap-10">
        <AgentSection title="ThinkingTrace" description="四种痕迹。点标题可折叠。">
          <Grid columns={{ base: 1, md: 2 }} gap={24}>
            <GridItem>
              <ThinkingTrace variant="steps" settled />
            </GridItem>
            <GridItem>
              <ThinkingTrace variant="reasoning" settled />
            </GridItem>
            <GridItem>
              <ThinkingTrace variant="search" query="best waffle cone supplier" settled />
            </GridItem>
            <GridItem>
              <ThinkingTrace variant="coding" settled />
            </GridItem>
          </Grid>
        </AgentSection>

        <AgentSection title="StreamingAnswer" description="来源可展开，follow-up 可点。">
          <StreamingAnswer
            text={AGENT_STREAM_TEXT}
            sources={AGENT_STREAM_SOURCES}
            followUps={AGENT_FOLLOW_UPS}
            onFollowUp={(text) => setFollowUp(text)}
          />
          {followUp ? <p className="text-sm text-fg-grey-700">Selected: {followUp}</p> : null}
        </AgentSection>

        <AgentSection title="ApprovalCard" description="单选自动前进，多选等 Continue。">
          <div className="max-w-lg">
            <ApprovalCard questions={AGENT_APPROVAL_QUESTIONS} />
          </div>
        </AgentSection>

        <AgentSection title="ToolChips" description="点行展开工具细节。">
          <ToolChips summary="4 tool calls, 2 messages" items={AGENT_TOOL_ITEMS} diffs={AGENT_TOOL_DIFFS} />
        </AgentSection>

        <AgentSection title="AgentTaskRows" description="List 与 capsules。">
          <div className="flex flex-col gap-6">
            <AgentTaskRows tasks={AGENT_TASKS} />
            <AgentTaskRows tasks={AGENT_TASKS} variant="capsules" />
          </div>
        </AgentSection>

        <AgentSection title="PromptBar" description="点 Sources / Commands，或输入 @ /。">
          <PromptBar
            value={prompt}
            onChange={setPrompt}
            onSend={(message) => setSent((current) => [...current, message])}
            sources={AGENT_PROMPT_SOURCES}
            commands={AGENT_PROMPT_COMMANDS}
            models={AGENT_PROMPT_MODELS}
            model="fast"
          />
          {sent.length > 0 ? (
            <ul className="text-sm text-fg-grey-700">
              {sent.map((item) => (
                <li key={item}>Sent: {item}</li>
              ))}
            </ul>
          ) : null}
        </AgentSection>

        <AgentSection title="ContextCards" description="检索块。">
          <ContextCards total={32} chunks={AGENT_CHUNKS} />
        </AgentSection>

        <AgentSection title="RecommendationCard" description="主建议 + 备选。">
          <div className="max-w-lg">
            <RecommendationCard
              title="Want me to place this restock order?"
              body="Reorder waffle cones from Cone King with lead time 7 days."
              alternatives={AGENT_RECOMMENDATION_ALTS}
            />
          </div>
        </AgentSection>

        <AgentSection title="AgentDiffTable" description="点变更行可取消，再 Apply。">
          <div className="max-w-2xl">
            <AgentDiffTable title="Flavor schedule" columns={AGENT_DIFF_COLUMNS} rows={AGENT_DIFF_ROWS} />
          </div>
        </AgentSection>

        <AgentSection title="AgentCodeBlock" description="Code / Diff 切换，Copy 复制 listing。">
          <div className="max-w-2xl">
            <AgentCodeBlock filename="lib/reorder.ts" lines={AGENT_CODE_LINES} diff={AGENT_CODE_DIFF} />
          </div>
        </AgentSection>

        <AgentSection title="InsightCards" description="左右翻页，点建议问句。">
          <div className="max-w-lg">
            <InsightCards cards={AGENT_INSIGHTS} />
          </div>
        </AgentSection>

        <AgentSection title="CommandSearch" description="输入过滤命令。">
          <div className="max-w-lg">
            <CommandSearch items={AGENT_COMMANDS} />
          </div>
        </AgentSection>

        <AgentSection title="AgentFlowchart" description="点节点看选中态。">
          <div className="max-w-lg">
            <AgentFlowchart title="Restock workflow" nodes={AGENT_FLOW_NODES} edges={AGENT_FLOW_EDGES} />
          </div>
        </AgentSection>
      </div>
    </RefChrome>
  );
}
