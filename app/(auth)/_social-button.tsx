/* eslint-disable @next/next/no-img-element */

import { Button } from "@forge-ui-official/core";
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
    <Button
      type="button"
      color="grey"
      variant="tertiary"
      size="lg"
      onClick={onClick}
      className="w-full gap-2 bg-white text-fg-grey-700 outline-fg-grey-200 transition-colors hover:bg-fg-grey-50"
      iconLeft={
        <img
          src={asset(`/images/brands/${provider}.svg`)}
          alt=""
          className="size-5 shrink-0"
        />
      }
    >
      使用 {LABELS[provider]} {action}
    </Button>
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
