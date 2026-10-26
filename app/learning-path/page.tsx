import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./lp.css";
import { LearningPathApp } from "@/components/learning-path/App";

export const metadata: Metadata = {
  title: "Learning Path · prototype",
  description: "Interactive, mobile-first prototype of the Learning Path English app: placement, ten-minute sessions, the atom player, the memory engine, road, progress and settings.",
};

// Outfit is the AZE typeface. Four weights cover the whole scale: body, label,
// heading, display.
const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--lp-font", display: "swap" });

export default function LearningPathPage() {
  return (
    <div className={`lp-page fixed inset-0 z-[60] ${outfit.variable}`} style={{ height: "100dvh" }}>
      <LearningPathApp />
    </div>
  );
}
