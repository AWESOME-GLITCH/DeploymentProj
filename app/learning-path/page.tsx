import type { Metadata } from "next";
import "./lp.css";
import { LearningPathApp } from "@/components/learning-path/App";

export const metadata: Metadata = {
  title: "Learning Path · prototype",
  description: "Interactive, mobile-first prototype of the Learning Path English app: placement, ten-minute sessions, the atom player, the memory engine, road, progress and settings.",
};

export default function LearningPathPage() {
  return (
    <div className="lp-page fixed inset-0 z-[60]" style={{ height: "100dvh" }}>
      <LearningPathApp />
    </div>
  );
}
