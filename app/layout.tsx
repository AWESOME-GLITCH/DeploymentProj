import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "ES World · Product Operating System",
  description:
    "ES World's AI-native product operating system — briefs, knowledge, marketing, analytics, pricing, feedback, and a Think Lab, all around one source of truth.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg text-ink">
        <div className="pointer-events-none fixed inset-0 -z-10 bg-grid-faint [background-size:44px_44px]" />
        <div className="pointer-events-none fixed left-1/2 top-[-10%] -z-10 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-brand/20 blur-[140px]" />
        <Sidebar />
        <main className="ml-64 min-h-screen">{children}</main>
      </body>
    </html>
  );
}
