/* eslint-disable @next/next/no-img-element */

import { asset } from "@/lib/asset";

type Provider = "google" | "facebook";

const LABELS: Record<Provider, string> = {
  google: "Google",
  facebook: "Facebook",
};

export function SocialButton({
  provider,
  action,
  onClick,
}: {
  provider: Provider;
  action: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 rounded-full border border-fg-grey-200 bg-white py-3.5 pl-3.5 pr-4 text-sm font-bold text-fg-grey-700 tracking-fg transition-colors hover:bg-fg-grey-50"
    >
      <img
        src={asset(`/images/brands/${provider}.svg`)}
        alt=""
        className="size-5 shrink-0"
      />
      <span className="whitespace-nowrap">
        使用 {LABELS[provider]} {action}
      </span>
    </button>
  );
}

export function OrDivider() {
  return (
    <div className="flex w-full items-center gap-2">
      <div className="h-px flex-1 bg-fg-grey-200" />
      <span className="text-sm text-fg-grey-700">或</span>
      <div className="h-px flex-1 bg-fg-grey-200" />
    </div>
  );
}
