import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Forge Starter",
  description: "Next.js 16 + Tailwind v4 + @forge-ui/react starter",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
