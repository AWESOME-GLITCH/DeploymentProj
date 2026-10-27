import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./lp.css";
import { LearningPathApp } from "@/components/learning-path/App";

export const metadata: Metadata = {
  title: "Learning Path · prototype",
  description: "Interactive, mobile-first prototype of the Learning Path English app: placement, ten-minute sessions, the atom player, the memory engine, road, progress and settings.",
};

// Plus Jakarta Sans (docs/design/brief.md, 26 Oct): the brief's typeface.
// Open letterforms that stay readable at small sizes for a learner with little
// English, and an 800 that carries the display headlines.
const display = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--lp-font", display: "swap" });

export default function LearningPathPage() {
  return (
    <div className={`lp-page fixed inset-0 z-[60] ${display.variable}`} style={{ height: "100dvh" }}>
      <LearningPathApp />
    </div>
  );
}
