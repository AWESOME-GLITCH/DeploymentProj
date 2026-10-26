import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./lp.css";
import { LearningPathApp } from "@/components/learning-path/App";

export const metadata: Metadata = {
  title: "Learning Path · prototype",
  description: "Interactive, mobile-first prototype of the Learning Path English app: placement, ten-minute sessions, the atom player, the memory engine, road, progress and settings.",
};

// Figtree (board decision, 26 Oct): friendly, open letterforms that stay
// readable at small sizes for a learner with little English. Four weights cover
// the whole scale: body, label, heading, display.
const figtree = Figtree({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--lp-font", display: "swap" });

export default function LearningPathPage() {
  return (
    <div className={`lp-page fixed inset-0 z-[60] ${figtree.variable}`} style={{ height: "100dvh" }}>
      <LearningPathApp />
    </div>
  );
}
