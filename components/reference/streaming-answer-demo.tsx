"use client";

import { useEffect, useRef, useState } from "react";
import { Button, ButtonGroup, StreamingAnswer } from "@forge-ui-official/core";
import { siteConfig } from "@/config/site";
import {
  bindAskAiAnswer,
  completeAskAiText,
  createAskAiTextBuffer,
  receiveAskAiText,
  stopAskAiText,
  type AskAiTextBuffer,
} from "@/lib/ask-ai-playback";

const SAMPLES = [
  {
    id: "zh",
    label: "中文",
    text: `一个阅读角可以从一张桌子、一盏灯和几本书开始。☕

### 先让空间舒服起来

**少而有趣** 比堆满更容易开始。每位同事可以推荐一本书，并留下一句感受。

- 放几本适合随手翻的摄影、设计或旅行书 📚
- 准备便签，写下想分享的一句话
- 每周留出十分钟，交流新的发现

\`\`\`txt
每周一 · 10 分钟
\`\`\`

跑过两三周后，再按大家真实的用法调整。阅读角会慢慢长成团队自己的样子。✨`,
  },
  {
    id: "en",
    label: "English",
    text: `A reading corner can start with a table, a lamp, and a few books. ☕

### Make room for a quiet moment

**A small, interesting collection** is easier to begin than a crowded shelf. Invite each teammate to recommend one book and leave a short note.

- Include books about photography, design, or travel 📚
- Leave space for notes and new discoveries
- Set aside ten minutes each week

\`\`\`txt
Monday · 10 minutes
\`\`\`

After a few weeks, adjust the corner around the way people actually use it. Let it grow with the team. ✨`,
  },
] as const;

const HISTORY = `这是一条已经结束的历史消息，用来对照播放中的回答。

- 挂载后直接显示全文
- 不传入 streaming 或 status
- emoji、列表和 **强调** 仍由 Core 渲染 📚`;

type Phase = "idle" | "streaming" | "settling" | "complete" | "stopped";

const PHASE_LABEL: Record<Phase, string> = {
  idle: "准备就绪",
  streaming: "正在接收演示数据",
  settling: "接收完成，等待最后一批淡入",
  complete: "呈现完成",
  stopped: "已停止",
};

function chunkEnds(text: string) {
  const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
  const ends: number[] = [];
  let count = 0;
  let last = 0;
  for (const part of segmenter.segment(text)) {
    count += 1;
    last = part.index + part.segment.length;
    if (count % 8 === 0) ends.push(last);
  }
  if (last > 0 && ends.at(-1) !== text.length) ends.push(text.length);
  return ends;
}

/** Reference-only player. Chunks, the pause, and stop are simulated in the page. */
export function StreamingAnswerDemo() {
  const [sampleIndex, setSampleIndex] = useState(0);
  const [runId, setRunId] = useState(0);
  const [playToken, setPlayToken] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [buffer, setBuffer] = useState<AskAiTextBuffer>(createAskAiTextBuffer);
  const [presentedRuns, setPresentedRuns] = useState<number[]>([]);
  const tokenRef = useRef(0);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const sample = SAMPLES[sampleIndex] ?? SAMPLES[0];

  useEffect(() => () => {
    tokenRef.current += 1;
  }, []);

  function reset(nextSample = sampleIndex) {
    tokenRef.current += 1;
    setSampleIndex(nextSample);
    setPhase("idle");
    setBuffer(createAskAiTextBuffer());
  }

  function play() {
    const token = ++tokenRef.current;
    const nextRun = runId + 1;
    const text = (SAMPLES[sampleIndex] ?? SAMPLES[0]).text;
    const ends = chunkEnds(text);
    setPlayToken(token);
    setRunId(nextRun);
    setPhase("streaming");
    setBuffer(createAskAiTextBuffer());

    const step = (index: number, current: AskAiTextBuffer) => {
      if (tokenRef.current !== token) return;
      const pause = index === 2;
      const delay = pause ? 700 : 90;
      window.setTimeout(() => {
        if (tokenRef.current !== token) return;
        const next = receiveAskAiText(current, text.slice(current.text.length, ends[index] ?? text.length));
        const last = index >= ends.length - 1;
        const settled = last ? completeAskAiText(next) : next;
        setBuffer(settled);
        setPhase(last ? "settling" : "streaming");
        if (!last) step(index + 1, settled);
      }, delay);
    };
    if (ends.length === 0) {
      setBuffer(completeAskAiText(createAskAiTextBuffer()));
      setPhase("settling");
      return;
    }
    step(0, createAskAiTextBuffer());
  }

  function stop() {
    tokenRef.current += 1;
    phaseRef.current = "stopped";
    setBuffer((current) => stopAskAiText(current));
    setPhase("stopped");
  }

  const active = phase === "streaming" || phase === "settling";
  const playback = phase === "stopped"
    ? { mode: "stopped" as const }
    : phase === "settling"
      ? { mode: "incremental" as const, status: "complete" as const }
      : phase === "complete"
        ? { mode: "static" as const }
        : { mode: "incremental" as const, status: "streaming" as const };
  const presentedCount = presentedRuns.filter((id) => id === runId).length;

  return (
    <div className="flex min-w-0 flex-col gap-5" data-streaming-demo data-streaming-demo-phase={phase}>
      <p className="text-sm leading-6 text-fg-grey-700">
        演示数据。分块、中途停顿和停止都由本页模拟，不是模型输出。产品里的 Ask AI 在完整 JSON 返回后渐显；这里用 status 演示累计文本。
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <ButtonGroup
          color={siteConfig.accent}
          ariaLabel="演示语言"
          items={SAMPLES.map((item) => ({ label: item.label }))}
          activeIndex={sampleIndex}
          onChange={(index) => reset(index)}
        />
        <Button color={siteConfig.accent} size="sm" onClick={active ? stop : play}>
          {active ? "停止" : phase === "idle" ? "播放" : "重新播放"}
        </Button>
        <span role="status" className="text-sm text-fg-grey-700">{PHASE_LABEL[phase]}</span>
      </div>
      <div className="min-h-48 border-t border-fg-grey-200 pt-5" aria-label="流式回答演示">
        {phase === "idle" ? (
          <p className="text-sm leading-7 text-fg-grey-700">点击播放，查看中英文 Markdown 随演示分块淡入。收到两段后会停顿约 700ms，接收状态保持 streaming。</p>
        ) : (
          <StreamingAnswer
            key={`${sample.id}-${runId}`}
            {...bindAskAiAnswer(buffer.text, playback)}
            onDone={phase === "settling" ? () => {
              if (tokenRef.current !== playToken || phaseRef.current !== "settling") return;
              setPresentedRuns((current) => current.includes(runId) ? current : [...current, runId]);
              setPhase("complete");
            } : undefined}
          />
        )}
      </div>
      <p className="text-xs text-fg-grey-700">
        完成回调：{presentedCount === 0 ? "未触发" : `已触发 ${presentedCount} 次`}
      </p>
      <div className="flex flex-col gap-2 border-t border-fg-grey-200 pt-5">
        <p className="text-xs text-fg-grey-700">历史消息 · 静态展示，不播放</p>
        <StreamingAnswer {...bindAskAiAnswer(HISTORY)} />
      </div>
    </div>
  );
}
