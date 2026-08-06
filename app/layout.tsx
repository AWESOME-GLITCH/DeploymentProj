import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { CommandBar } from "@/components/CommandBar";
import { SynthesisBar } from "@/components/SynthesisBar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ES World · Product Operating System",
  description:
    "ES World's AI-native product operating system, briefs, knowledge, marketing, analytics, pricing, feedback, and a Think Lab, all around one source of truth.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${display.variable}`}>
      <body className="min-h-screen bg-bg font-sans text-ink antialiased">
        <div className="pointer-events-none fixed left-1/2 top-[-20%] -z-10 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-brand/[0.07] blur-[160px] print:hidden" />
        <Sidebar />
        <CommandBar />
        <main className="ml-64 min-h-screen">
          <SynthesisBar />
          {children}
        </main>
      </body>
    </html>
  );
}
