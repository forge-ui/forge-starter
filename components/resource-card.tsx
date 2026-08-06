"use client";

import type { ReactNode } from "react";
import { StatusBadge, type StatusBadgeColor } from "@forge-ui-official/core";

/**
 * Resource grid card — shared list surface for assets / agents / folders.
 * Prefer this over hand-rolled article cards on collection pages.
 */
export function ResourceCard({
  title,
  description,
  icon,
  iconVariant = "chip",
  iconClassName,
  tag,
  tagColor = "blue",
  subtitle,
  footer,
  actions,
  onClick,
  href,
  density = "default",
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
  /** chip = colored square; plain = raw icon (Forge FileTypeIcon etc.) */
  iconVariant?: "chip" | "plain";
  /** Overrides default blue chip when iconVariant is chip */
  iconClassName?: string;
  tag?: string;
  tagColor?: StatusBadgeColor;
  subtitle?: ReactNode;
  footer?: ReactNode;
  actions?: ReactNode;
  onClick?: () => void;
  /** Prefer href for reliable navigation (Next Link) */
  href?: string;
  /** compact = denser cards for dense grids */
  density?: "default" | "compact";
}) {
  const compact = density === "compact";
  const interactive = Boolean(onClick || href);
  const iconSize = compact ? "h-8 w-8" : "h-10 w-10";
  const chipClass =
    iconVariant === "plain"
      ? `flex ${iconSize} shrink-0 items-center justify-center overflow-hidden`
      : `flex ${iconSize} shrink-0 items-center justify-center overflow-hidden rounded-xl ${
          iconClassName ?? "bg-fg-blue-50 text-fg-blue-700"
        }`;

  const body = (
    <>
      <div className={`flex items-start ${compact ? "gap-2.5" : "gap-3"}`}>
        <div className={chipClass}>
          {icon ?? (
            <span className={`${compact ? "text-xs" : "text-sm"} font-semibold`}>
              {title.slice(0, 1)}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={`truncate font-semibold text-fg-black ${
                compact ? "text-sm" : "text-base"
              }`}
              title={title}
            >
              {title}
            </h3>
            {tag ? (
              <span className="shrink-0 whitespace-nowrap">
                <StatusBadge label={tag} color={tagColor} />
              </span>
            ) : null}
          </div>
          {subtitle ? (
            <div
              className={`text-xs text-fg-grey-600 ${compact ? "mt-0.5" : "mt-1"}`}
            >
              {subtitle}
            </div>
          ) : null}
        </div>
      </div>

      <p
        className={`line-clamp-2 flex-1 text-fg-grey-700 ${
          compact ? "mt-2 text-xs leading-5" : "mt-3 text-sm leading-6"
        }`}
      >
        {description || "暂无描述"}
      </p>
    </>
  );

  return (
    <article
      className={`flex h-full flex-col border border-fg-grey-200 bg-white ${
        compact ? "min-h-0 rounded-xl p-3" : "min-h-[168px] rounded-2xl p-4"
      } ${
        interactive
          ? "cursor-pointer transition-colors hover:border-fg-grey-300"
          : ""
      }`}
      onClick={href ? undefined : onClick}
    >
      {href ? (
        <a
          href={href}
          className="flex min-h-0 flex-1 flex-col text-inherit no-underline"
        >
          {body}
        </a>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col">{body}</div>
      )}

      <div
        className={`flex items-center justify-between gap-2 border-t border-fg-grey-100 ${
          compact ? "mt-2.5 pt-2" : "mt-4 pt-3"
        }`}
      >
        <div className="min-w-0 flex-1 text-xs text-fg-grey-600">{footer}</div>
        {actions ? (
          <div
            className="relative z-10 flex shrink-0 items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            {actions}
          </div>
        ) : null}
      </div>
    </article>
  );
}
