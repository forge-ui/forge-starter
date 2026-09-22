"use client";

import type { ReactNode } from "react";
import { DangerCircleLinear } from "solar-icon-set";
import { Button, SurfaceCard, StatusBadge, Tooltip } from "@forge-ui-official/core";
import { siteConfig } from "@/config/site";

export function ModelCard({
  name,
  modelName,
  providerIcon,
  typeLabel,
  statusLabel,
  statusTone = "muted",
  statusError,
  actions,
  onClick,
}: {
  name: string;
  modelName?: string;
  providerIcon: ReactNode;
  typeLabel: string;
  statusLabel: string;
  statusTone?: "ok" | "error" | "warn" | "muted";
  statusError?: string;
  actions?: ReactNode;
  onClick?: () => void;
}) {
  const statusColor =
    statusTone === "ok"
      ? "green"
      : statusTone === "error"
        ? "red"
        : statusTone === "warn"
          ? "blue"
          : "grey";

  return (
    <SurfaceCard padding="sm" className="relative h-full" contentClassName="flex h-full flex-col gap-3">
      <div className="flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-fg-grey-50">
          {providerIcon}
        </div>
        <div className="min-w-0 flex-1">
          {onClick ? (
            <Button
              color={siteConfig.accent}
              variant="tertiary"
              title={name}
              onClick={onClick}
              className="!static max-w-full !justify-start !overflow-visible !rounded-none !outline-none !bg-transparent !p-0 !text-base !font-semibold !text-fg-black text-left after:absolute after:inset-0 after:rounded-xl after:content-[''] hover:after:bg-fg-grey-500/5 focus-visible:after:ring-2 focus-visible:after:ring-fg-grey-500"
            >
              <span className="line-clamp-2 break-words">{name}</span>
            </Button>
          ) : (
            <h3 className="break-words text-base font-semibold text-fg-black">{name}</h3>
          )}
          {modelName ? (
            <p className="mt-1 truncate text-xs text-fg-grey-500" title={`基础模型 ${modelName}`}>
              基础模型 {modelName}
            </p>
          ) : null}
        </div>
        {actions ? <div className="relative z-10 shrink-0">{actions}</div> : null}
      </div>
      <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-fg-grey-100 pt-3">
        <StatusBadge label={statusLabel} color={statusColor} />
        {statusError ? (
          <Tooltip content={statusError} position="top">
            <span tabIndex={0} aria-label={`异常原因：${statusError}`} className="relative z-10 inline-flex">
              <DangerCircleLinear size={16} color="var(--fg-red)" />
            </span>
          </Tooltip>
        ) : null}
        <span className="text-xs text-fg-grey-700">{typeLabel}</span>
      </div>
    </SurfaceCard>
  );
}
