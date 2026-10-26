"use client";

// Progress: the level on one line, seven simple bars, the weeks kept, what the
// learner can do now, and a downloadable one-page report.

import { Download } from "lucide-react";
import { OUTCOMES } from "@/lib/learning-path/content";
import { dayIndex, levelEstimate, outcomeAchieved, recallProbability, strandStrength } from "@/lib/learning-path/engine";
import { CEFR_LABEL, loc, strandName } from "@/lib/learning-path/i18n";
import { useNow, useStore } from "@/lib/learning-path/store";
import { STRANDS } from "@/lib/learning-path/types";
import { Bar, GlowButton, LocText, Pill, STRAND_COLOR, useLp } from "./ui";

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
  // Mastery that is fading into review shows in the cool review tint, never as lost.
  const reviewTint = (s: typeof STRANDS[number]) => {
    const ms = Object.values(state.items).filter((m) => m.state !== "new");
    const strandItems = ms.filter((m) => m.item_id.includes(`-${s}-`));
    if (!strandItems.length) return false;
    const mean = strandItems.reduce((a, m) => a + recallProbability(m, now), 0) / strandItems.length;
    return mean < 0.6;
  };

  const download = () => {
    const rows = STRANDS.map((s) => `<tr><td>${strandName(s, "en")}</td><td><div style="background:#e2eae8;border-radius:99px;height:10px;width:200px"><div style="width:${Math.round(strandStrength(state, s, now) * 100)}%;height:10px;border-radius:99px;background:#157f62"></div></div></td><td>${Math.round(strandStrength(state, s, now) * 100)}</td></tr>`).join("");
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Learning Path report</title><style>body{font-family:Outfit,system-ui,sans-serif;color:#101f1d;background:#f3f6f5;max-width:720px;margin:40px auto;padding:0 20px}h1{font-weight:700;letter-spacing:-0.022em}h2{font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#56736f;margin-top:28px}td{padding:6px 10px}.muted{color:#56736f}strong{color:#0b7a6c}</style></head><body><h1>Learning Path report</h1><p class="muted">Generated ${new Date(now).toLocaleDateString("en-GB")} · AZE-verified where a checkpoint exists</p><h2>Level</h2><p><strong>${level ? CEFR_LABEL[level] : "Pending"}</strong> ${state.checkpoints.length ? "(confirmed by AZE checkpoint)" : "(estimate, not yet confirmed by AZE)"}</p><h2>What I can do now</h2><p>${canDo ? loc(canDo, "en") : ""}</p>${canDo && l1 !== "en" ? `<p class="muted">${loc(canDo, l1)}</p>` : ""}<h2>Strands</h2><table>${rows}</table><h2>Hours</h2><p>${hours.toFixed(1)} hours across ${state.sessions.length} sessions</p><p class="muted">Indicative progress from in-app learning checks. Only an AZE test certifies a level.</p></body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    dispatch({ type: "event", name: "report_downloaded" });
  };

  const levelPos = level
    ? (["PreA1", "A1", "A2", "B1", "B2", "C1"].indexOf(level.replace(/\.\d/, "")) + (level.endsWith(".2") ? 0.5 : 0.2)) / 5
    : 0.4;

  return (
    <div className="flex h-full flex-col px-5 pb-4 pt-4">
      <div className="flex items-center justify-between">
        <div className="lp-eyebrow">{t("progress")} · {hours.toFixed(1)} {t("hours")}</div>
        {state.checkpoints.length ? <Pill tone="good">AZE ✓</Pill> : null}
      </div>

      {/* The level, as one line the learner can read at a glance */}
      <div className="lp-glass mt-3 p-4">
        {firstWeek && !state.checkpoints.length ? (
          <>
            <div className="lp-eyebrow mb-1">{t("level_estimate")}</div>
            <div className="lp-body" style={{ color: "var(--lp-paper-soft)" }}>{t("first_week")}</div>
          </>
        ) : (
          <>
            <div className="flex items-end justify-between">
              <div className="lp-eyebrow">{t("level_estimate")}</div>
              <div className="lp-head" style={{ color: "var(--lp-glow)" }}>{level ? CEFR_LABEL[level] : ""}</div>
            </div>
            <div className="relative mt-3 h-7">
              <div className="absolute inset-x-0 top-1 h-[3px] rounded-full" style={{ background: "var(--lp-track)" }} />
              <div className="absolute top-1 h-[3px] rounded-full" style={{ width: `${levelPos * 100}%`, background: "var(--lp-sea)", transition: "width var(--lp-t-move) var(--lp-ease-emph)" }} />
              {["Pre-A1", "A1", "A2", "B1", "B2", "C1"].map((l, i) => <span key={l} className="absolute -translate-x-1/2" style={{ left: `${(i / 5) * 100}%`, top: 12, color: "var(--lp-paper-faint)", fontSize: 10, fontWeight: 600 }}>{l}</span>)}
              <div className="absolute -top-[3px] h-[14px] w-[14px] -translate-x-1/2 rounded-full" style={{ left: `${levelPos * 100}%`, background: "var(--lp-marker)", boxShadow: "0 0 0 4px var(--lp-marker-tint)", transition: "left var(--lp-t-move) var(--lp-ease-emph)" }} />
            </div>
          </>
        )}
      </div>

      {/* Seven simple bars, then the weeks kept */}
      <div className="lp-glass mt-3 flex flex-col gap-2 p-4">
        {STRANDS.map((s) => <Bar key={s} label={strandName(s, lang)} value={strandStrength(state, s, now)} tint={reviewTint(s) ? "review" : undefined} color={STRAND_COLOR[s]} />)}
        <div className="mt-2 border-t pt-3" style={{ borderColor: "var(--lp-line)" }}>
          <div className="lp-eyebrow mb-2">{t("weeks_active")}</div>
          <div className="flex gap-1.5">{weeks.map((n, i) => <div key={i} className="h-5 flex-1 rounded" style={{ background: n >= 4 ? "var(--lp-sea)" : n > 0 ? "var(--lp-sea-line)" : "var(--lp-track)" }} title={`${n} sessions`} />)}</div>
        </div>
      </div>

      {canDo ? (
        <div className="mt-3">
          <div className="lp-eyebrow mb-1">{t("can_do_line")}</div>
          <LocText text={canDo} size="body" />
        </div>
      ) : null}
      <div className="mt-auto pt-3">
        <GlowButton secondary size="normal" onClick={download}><Download size={18} /> {t("download_report")}</GlowButton>
      </div>
    </div>
  );
}
