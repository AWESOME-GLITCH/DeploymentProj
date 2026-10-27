"use client";

// How I'm doing. The board's order, 26 Oct: the journey the learner can see
// leads ("last week I could not order a coffee, now I can"), the level line
// comes second, and nothing else is on the screen.
//
// Gone from the earlier version, under the element budget: the seven strand
// bars in seven colours (colour carried no meaning and they were a second
// progress signal competing with the level line), the weeks row, the AZE pill
// and the glass panels. The strand table still goes out in the one-page report.

import { Check, Download } from "lucide-react";
import { OUTCOMES } from "@/lib/learning-path/content";
import { dayIndex, levelEstimate, outcomeAchieved, strandStrength } from "@/lib/learning-path/engine";
import { CEFR_LABEL, loc, strandName } from "@/lib/learning-path/i18n";
import { useNow, useStore } from "@/lib/learning-path/store";
import { STRANDS, SUBLEVELS } from "@/lib/learning-path/types";
import { GlowButton, LocText, useLp } from "./ui";

export function Progress() {
  const { state, dispatch } = useStore();
  const { t, lang, l1 } = useLp();
  const now = useNow();
  const day = dayIndex(state, now);
  const firstWeek = day < 7;
  const level = levelEstimate(state, now);
  const minutes = state.sessions.reduce((a, s) => a + s.minutes, 0);
  const hours = minutes / 60;
  const achieved = OUTCOMES.filter((o) => outcomeAchieved(state, o.outcome_id));
  const canDo = achieved[achieved.length - 1]?.can_do ?? (state.week_can_do ? OUTCOMES.find((o) => o.outcome_id === state.week_can_do)?.can_do : undefined);
  // Classmates folded in as one line (board, 26 Oct). Steady through the day,
  // so the number never flickers while the learner is looking at it.
  const learnersToday = 9 + ((day * 7) % 11);

  const download = () => {
    // The report wears the brief too: cream page, ink outlines, mint bars.
    const rows = STRANDS.map((s) => `<tr><td>${strandName(s, "en")}</td><td><div style="background:#fff;border:2px solid #121212;border-radius:99px;height:14px;width:200px;overflow:hidden"><div style="width:${Math.round(strandStrength(state, s, now) * 100)}%;height:100%;border-radius:99px;background:#a8f0c6"></div></div></td><td>${Math.round(strandStrength(state, s, now) * 100)}</td></tr>`).join("");
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Learning Path report</title><style>body{font-family:"Plus Jakarta Sans",system-ui,sans-serif;font-weight:600;color:#121212;background:#fff7e8;max-width:720px;margin:40px auto;padding:0 20px}h1{font-weight:800;letter-spacing:-0.03em;font-size:40px;line-height:1.05;background:#ffd93d;border:2px solid #121212;border-radius:28px;box-shadow:4px 4px 0 #121212;padding:20px 24px}h2{font-size:13px;color:#65655a;margin-top:28px;font-weight:600}td{padding:6px 10px}.muted{color:#65655a}strong{color:#b5330b}</style></head><body><h1>Learning Path report</h1><p class="muted">Generated ${new Date(now).toLocaleDateString("en-GB")} · AZE-verified where a checkpoint exists</p><h2>Level</h2><p><strong>${level ? CEFR_LABEL[level] : "Pending"}</strong> ${state.checkpoints.length ? "(confirmed by AZE checkpoint)" : "(estimate, not yet confirmed by AZE)"}</p><h2>What I can do now</h2><p>${canDo ? loc(canDo, "en") : ""}</p>${canDo && l1 !== "en" ? `<p class="muted">${loc(canDo, l1)}</p>` : ""}<h2>Strands</h2><table>${rows}</table><h2>Time</h2><p>${minutes < 120 ? `${Math.round(minutes)} minutes` : `${hours.toFixed(1)} hours`} across ${state.sessions.length} sessions</p><p class="muted">Indicative progress from in-app learning checks. Only an AZE test certifies a level.</p></body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    dispatch({ type: "event", name: "report_downloaded" });
  };

  const levelPos = level
    ? (["PreA1", "A1", "A2", "B1", "B2", "C1"].indexOf(level.replace(/\.\d/, "")) + (level.endsWith(".2") ? 0.5 : 0.2)) / 5
    : 0.4;

  // The band the learner is walking towards, in the same plain words.
  const nextLevel = level ? SUBLEVELS.slice(SUBLEVELS.indexOf(level) + 1).find((s) => CEFR_LABEL[s] !== CEFR_LABEL[level]) : undefined;

  // The three before the headline one, newest first. Three keeps it a trail
  // rather than a list the learner has to read.
  const earlier = achieved.slice(0, -1).slice(-3).reverse();

  return (
    // One column from the top with the action pinned to the bottom. An earlier
    // justify-between spread the three blocks over the whole phone, which on
    // day one (no can-do, no history yet) opened two holes in the middle; the
    // board's rule is that dead space is never acceptable at 375x812.
    <div className="flex h-full flex-col px-5 pb-4 pt-6">
      {/* What the learner can do now, with the trail behind it. This is the
          journey in words, and it leads. */}
      <div>
        <div className="lp-small" style={{ color: "var(--lp-paper-faint)" }}>{t("can_do_line")}</div>
        <div className="mt-2">
          {canDo
            ? <LocText text={canDo} size="head" />
            // Day one: the big type is kept for a real can-do, so the waiting
            // line is set at body size and does not shout a sentence.
            : <div className="lp-body" style={{ color: "var(--lp-paper-soft)" }}>{t("first_week")}</div>}
        </div>
        {earlier.length ? (
          <div className="mt-6">
            <div className="lp-small mb-2" style={{ color: "var(--lp-paper-faint)" }}>{t("earlier_can_do")}</div>
            <div className="flex flex-col gap-2">
              {earlier.map((o) => (
                <div key={o.outcome_id} className="flex items-start gap-2">
                  <Check size={16} style={{ color: "var(--lp-sea)", marginTop: 4, flexShrink: 0 }} aria-hidden />
                  <span className="lp-body" style={{ color: "var(--lp-paper-soft)" }}>{loc(o.can_do, lang)}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {/* The one chart on this screen: where the learner sits on the way to the
          next level, with the level itself in plain words. */}
      {/* One sun block that earns the space. A hairline rule high on the page
          left two thirds of the phone empty on day one; the brief's progress
          visual is a single thick rounded bar in ink on the card colour, and
          the card takes the height the screen has going spare. No row of six
          CEFR codes under it: that read as a settings widget. Where the
          learner is sits above the bar, where they are heading at its end. */}
      <div className="lp-glass mt-8 flex min-h-[196px] flex-1 flex-col justify-center p-5"
        style={{ background: "var(--lp-sun)", borderColor: "var(--lp-on-sun)", color: "var(--lp-on-sun)" }}>
        <div className="lp-small" style={{ opacity: 0.75 }}>{t("level_estimate")}</div>
        <div className="lp-head mt-1">{level ? CEFR_LABEL[level] : ""}</div>
        <div className="mt-6 h-[18px] w-full overflow-hidden rounded-full" role="img"
          style={{ background: "rgba(18, 18, 18, 0.18)" }}
          aria-label={level ? `${t("level_estimate")}: ${CEFR_LABEL[level]}` : t("level_estimate")}>
          <div className="h-full rounded-full" style={{ width: `${Math.max(6, levelPos * 100)}%`, background: "var(--lp-on-sun)" }} />
        </div>
        {nextLevel ? <div className="lp-small mt-3 text-right" style={{ opacity: 0.75 }}>{CEFR_LABEL[nextLevel]}</div> : null}
        {firstWeek && !state.checkpoints.length && canDo ? <div className="lp-small mt-3" style={{ opacity: 0.75 }}>{t("first_week")}</div> : null}
      </div>

      {/* Two quiet facts and the one action, held at the bottom. "0 minutes"
          reads as though nothing was recorded, so the time line only appears
          once there is time to report. */}
      <div className="mt-6">
        {minutes >= 1 ? (
          <div className="lp-small" style={{ color: "var(--lp-paper-faint)" }}>
            {minutes < 120 ? `${Math.round(minutes)} ${t("minutes_so_far")}` : `${hours.toFixed(1)} ${t("hours_so_far")}`}
          </div>
        ) : null}
        <div className="lp-small mt-1" style={{ color: "var(--lp-paper-faint)" }}>{learnersToday} {t("learners_today")}</div>
        <div className="mt-4"><GlowButton secondary size="normal" onClick={download}><Download size={18} /> {t("download_report")}</GlowButton></div>
      </div>
    </div>
  );
}
