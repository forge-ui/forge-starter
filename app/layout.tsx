import type { Metadata } from "next";
import type { CSSProperties } from "react";
import "@fontsource-variable/manrope";
import "@fontsource-variable/plus-jakarta-sans";
import "./globals.css";

export const metadata: Metadata = {
  title: "Forge Starter",
  description: "Forge 后台脚手架 — Next.js 16 + Tailwind v4 + @forge-ui-official/core",
};

const fontVariables = {
  "--font-manrope": "'Manrope Variable', system-ui, sans-serif",
  "--font-plus-jakarta-sans": "'Plus Jakarta Sans Variable', system-ui, sans-serif",
} as CSSProperties;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="h-full antialiased" style={fontVariables}>
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
