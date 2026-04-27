import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Forge 起手式",
  description: "Next.js 16 + Tailwind v4 + @forge-ui/react 项目模板",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
