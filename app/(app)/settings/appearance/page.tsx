"use client";

import { useSyncExternalStore } from "react";
import { Breadcrumbs, PageTitleToolbar, RadioWithLabel } from "@forge-ui-official/core";
import { siteConfig } from "@/config/site";
import { THEME_CHANGE_EVENT, THEME_STORAGE_KEY, readThemePreference, saveThemePreference, type ThemePreference } from "@/lib/theme";

const OPTIONS: { value: ThemePreference; label: string; hint: string }[] = [
  { value: "light", label: "浅色", hint: "默认外观" },
  { value: "dark", label: "深色", hint: "暗光环境下更柔和" },
  { value: "system", label: "跟随系统", hint: "随操作系统的深浅色切换" },
];

function subscribe(onChange: () => void) {
  const onStorage = (event: StorageEvent) => { if (event.key === THEME_STORAGE_KEY) onChange(); };
  window.addEventListener(THEME_CHANGE_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

/** A miniature admin screen; data-theme pins it to one palette regardless of the page. */
function MiniScreen({ theme }: { theme: "light" | "dark" }) {
  return (
    <div data-theme={theme} className="flex h-full w-full gap-2 bg-fg-grey-50 p-2">
      <div className="flex w-1/4 flex-col gap-1.5 rounded-md bg-background p-1.5">
        <div className="h-1.5 w-3/4 rounded-full bg-fg-blue" />
        <div className="h-1.5 w-full rounded-full bg-fg-grey-200" />
        <div className="h-1.5 w-2/3 rounded-full bg-fg-grey-200" />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 rounded-md bg-background p-2">
        <div className="h-2 w-1/2 rounded-full bg-fg-black" />
        <div className="h-1.5 w-full rounded-full bg-fg-grey-200" />
        <div className="h-1.5 w-5/6 rounded-full bg-fg-grey-200" />
        <div className="mt-auto h-3 w-1/3 rounded-full bg-fg-blue" />
      </div>
    </div>
  );
}

function Preview({ value }: { value: ThemePreference }) {
  if (value !== "system") return <MiniScreen theme={value} />;
  return (
    <div className="relative h-full w-full">
      <MiniScreen theme="light" />
      <div className="absolute inset-0 [clip-path:polygon(100%_0,100%_100%,0_100%)]">
        <MiniScreen theme="dark" />
      </div>
    </div>
  );
}

export default function AppearanceSettingsPage() {
  const preference = useSyncExternalStore(subscribe, readThemePreference, () => "light" as const);

  return (
    <div className="flex flex-col gap-6">
      <PageTitleToolbar
        title="外观"
        breadcrumbs={<Breadcrumbs color={siteConfig.accent} items={[{ label: "工作台", href: "/dashboard/" }, { label: "外观" }]} />}
        className="shrink-0"
      />

      <section className="flex flex-col gap-5 rounded-xl bg-background p-6 outline outline-1 outline-offset-[-1px] outline-fg-grey-200">
        <div className="flex flex-col gap-1">
          <h2 className="text-base font-semibold text-fg-black">主题</h2>
          <p className="text-sm text-fg-grey-700">只影响当前浏览器，换设备或清理浏览器数据后恢复浅色。</p>
        </div>
        <div role="radiogroup" aria-label="主题" className="grid gap-4 sm:grid-cols-3">
          {OPTIONS.map(option => (
            <div
              key={option.value}
              className={`flex flex-col overflow-hidden rounded-xl outline outline-1 outline-offset-[-1px] transition-colors ${preference === option.value ? "outline-2 outline-fg-blue" : "outline-fg-grey-200"}`}
            >
              <div aria-hidden className="aspect-[16/9] border-b border-fg-grey-200">
                <Preview value={option.value} />
              </div>
              <div className="flex flex-col gap-1 p-4">
                <RadioWithLabel color={siteConfig.accent} label={option.label} checked={preference === option.value} onChange={() => saveThemePreference(option.value)} />
                <p className="pl-7 text-xs text-fg-grey-700">{option.hint}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
