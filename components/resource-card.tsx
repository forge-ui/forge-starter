"use client";

import type { ReactNode } from "react";

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
  /** 类目短标签，纯文本。不要给 tag 配彩虹胶囊 */
  tag?: string;
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
  const iconSize = compact ? "h-8 w-8" : "h-9 w-9";
  const chipClass =
    iconVariant === "plain"
      ? `flex ${iconSize} shrink-0 items-center justify-center overflow-hidden`
      : `flex ${iconSize} shrink-0 items-center justify-center overflow-hidden rounded-lg ${
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
              <span className="shrink-0 whitespace-nowrap text-xs font-medium text-fg-grey-500">
                {tag}
              </span>
            ) : null}
          </div>
          {subtitle ? (
            <div
              className={`truncate text-xs text-fg-grey-700 ${compact ? "mt-0.5" : "mt-1"}`}
            >
              {subtitle}
            </div>
          ) : null}
        </div>
        {actions ? (
          <div
            className="relative z-10 -mr-1 -mt-1 shrink-0"
            onClick={(event) => event.stopPropagation()}
          >
            {actions}
          </div>
        ) : null}
      </div>

      {description ? (
        <p
          className={`line-clamp-2 text-fg-grey-700 ${
            compact ? "mt-2 text-xs leading-5" : "mt-3 text-sm leading-6"
          }`}
        >
          {description}
        </p>
      ) : null}
    </>
  );

  return (
    <article
      className={`flex h-full flex-col border border-fg-grey-200 bg-white ${
        compact ? "rounded-xl p-3" : "rounded-2xl p-4"
      } ${
        interactive
          ? "cursor-pointer transition-colors hover:border-fg-grey-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg-blue-500"
          : ""
      }`}
      role={onClick && !href ? "button" : undefined}
      tabIndex={onClick && !href ? 0 : undefined}
      onClick={href ? undefined : onClick}
      onKeyDown={
        onClick && !href
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {href ? (
        <a href={href} className="min-w-0 text-inherit no-underline">
          {body}
        </a>
      ) : (
        <div className="min-w-0">{body}</div>
      )}

      {footer ? (
        <div
          className={`mt-auto flex flex-wrap items-center gap-2 border-t border-fg-grey-100 ${
            compact ? "mt-2.5 pt-2" : "mt-3 pt-3"
          }`}
        >
          {footer}
        </div>
      ) : null}
    </article>
  );
}
