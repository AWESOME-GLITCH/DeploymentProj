"use client";

// Progress: seven strand bars, a level estimate line, a weeks-active strip,
// the "what I can do now" line, and a downloadable one-page report.

import { Download } from "lucide-react";
import { OUTCOMES } from "@/lib/learning-path/content";
import { dayIndex, levelEstimate, outcomeAchieved, recallProbability, strandStrength } from "@/lib/learning-path/engine";
import { CEFR_LABEL, loc, strandName } from "@/lib/learning-path/i18n";
import { useNow, useStore } from "@/lib/learning-path/store";
import { STRANDS } from "@/lib/learning-path/types";
import { Bar, GlowButton, LocText, Pill, useLp } from "./ui";

export function Progress() {
  const { state, dispatch } = useStore();
  const { t, lang, l1 } = useLp();
  const now = useNow();
  const day = dayIndex(state, now);
  const firstWeek = day < 7;
  const level = levelEstimate(state, now);
  const hours = state.sessions.reduce((a, s) => a + s.minutes, 0) / 60;
  const weeks = Array.from({ length: 8 }, (_, i) => state.sessions.filter((s) => s.completed && Math.floor((s.day - state.week_start_day) / 7) + Math.floor(state.week_start_day / 7) === i).length);
  const achieved = OUTCOMES.filter((o) => outcomeAchieved(state, o.outcome_id));
  const canDo = achieved[achieved.length - 1]?.can_do ?? (state.week_can_do ? OUTCOMES.find((o) => o.outcome_id === state.week_can_do)?.can_do : undefined);
  // Mastery that is fading into review shows as a sand tint, never as lost.
  const reviewTint = (s: typeof STRANDS[number]) => {
    const ms = Object.values(state.items).filter((m) => m.state !== "new");
    const strandItems = ms.filter((m) => m.item_id.includes(`-${s}-`));
    if (!strandItems.length) return false;
    const mean = strandItems.reduce((a, m) => a + recallProbability(m, now), 0) / strandItems.length;
    return mean < 0.6;
  };

  const download = () => {
    const rows = STRANDS.map((s) => `<tr><td>${strandName(s, "en")}</td><td><div style="background:#e8e2d4;border-radius:8px;height:10px;width:200px"><div style="width:${Math.round(strandStrength(state, s, now) * 100)}%;height:10px;border-radius:8px;background:#2d6f3f"></div></div></td><td>${Math.round(strandStrength(state, s, now) * 100)}</td></tr>`).join("");
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Learning Path report</title><style>body{font-family:system-ui,sans-serif;color:#1b2228;max-width:720px;margin:40px auto;padding:0 20px}h1{font-weight:600}td{padding:6px 10px}.muted{color:#6b7680}</style></head><body><h1>Learning Path report</h1><p class="muted">Generated ${new Date(now).toLocaleDateString("en-GB")} · AZE-verified where a checkpoint exists</p><h2>Level</h2><p><strong>${level ? CEFR_LABEL[level] : "Pending"}</strong> ${state.checkpoints.length ? "(confirmed by AZE checkpoint)" : "(estimate, not yet confirmed by AZE)"}</p><h2>What I can do now</h2><p>${canDo ? loc(canDo, "en") : ""}</p>${canDo && l1 !== "en" ? `<p class="muted">${loc(canDo, l1)}</p>` : ""}<h2>Strands</h2><table>${rows}</table><h2>Hours</h2><p>${hours.toFixed(1)} hours across ${state.sessions.length} sessions</p><p class="muted">Indicative progress from in-app learning checks. Only an AZE test certifies a level.</p></body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    dispatch({ type: "event", name: "report_downloaded" });
  };

  return (
    <div className="flex h-full flex-col px-5 pb-4 pt-4">
      <div className="flex items-center justify-between">
        <div><div className="lp-eyebrow">{t("progress")}</div><div className="lp-small" style={{ color: "var(--lp-paper-faint)" }}>{hours.toFixed(1)} {t("hours")} · {state.sessions.length} sessions</div></div>
        {state.checkpoints.length ? <Pill tone="good">AZE ✓</Pill> : null}
      </div>
      <div className="lp-glass mt-3 p-4">
        <div className="lp-eyebrow mb-1">{t("level_estimate")}</div>
        {firstWeek && !state.checkpoints.length ? (
          <div className="lp-body" style={{ color: "var(--lp-paper-soft)" }}>{t("first_week")}</div>
        ) : (
          <div className="relative mt-2 h-8">
            <div className="absolute inset-x-0 top-3 h-[3px] rounded-full bg-white/10" />
            {["Pre-A1", "A1", "A2", "B1", "B2", "C1"].map((l, i) => <span key={l} className="lp-small absolute -translate-x-1/2" style={{ left: `${(i / 5) * 100}%`, top: 18, color: "var(--lp-paper-faint)", fontSize: 10 }}>{l}</span>)}
            <div className="absolute top-[7px] h-4 w-4 -translate-x-1/2 rounded-full" style={{ left: `${((level ? ["PreA1", "A1", "A2", "B1", "B2", "C1"].indexOf(level.replace(/\.\d/, "").replace("Pre", "Pre")) + (level.endsWith(".2") ? 0.5 : 0.2) : 2) / 5) * 100}%`, background: "var(--lp-glow-2)", boxShadow: "0 0 12px rgba(21,154,139,0.7)" }} />
            <div className="lp-small absolute end-0 -top-5" style={{ color: "var(--lp-glow-2)" }}>{level ? CEFR_LABEL[level] : ""}</div>
          </div>
        )}
      </div>
      <div className="lp-glass mt-3 flex flex-col gap-2 p-4">
        {STRANDS.map((s) => <Bar key={s} label={strandName(s, lang)} value={strandStrength(state, s, now)} tint={reviewTint(s) ? "review" : undefined} />)}
      </div>
      <div className="lp-glass mt-3 p-4">
        <div className="lp-eyebrow mb-2">{t("weeks_active")}</div>
        <div className="flex gap-1.5">{weeks.map((n, i) => <div key={i} className="h-6 flex-1 rounded-md" style={{ background: n >= 4 ? "var(--lp-sea)" : n > 0 ? "var(--lp-sea-line)" : "var(--lp-track)" }} title={`${n} sessions`} />)}</div>
      </div>
      {canDo ? (
        <div className="lp-glass mt-3 p-4"><div className="lp-eyebrow mb-1">{t("can_do_line")}</div><LocText text={canDo} size="body" /></div>
      ) : null}
      <div className="mt-auto pt-3"><GlowButton secondary size="normal" onClick={download}><Download size={18} /> {t("download_report")}</GlowButton></div>
    </div>
  );
}
