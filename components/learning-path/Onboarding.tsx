"use client";

// First run, install to first atom in under four minutes: language, why,
// daily time, when-and-where plan, "let us find your start" (never called a
// test), then the first atom and the reward.

import { useEffect, useState } from "react";
import { PLACEMENT, placementLevel } from "@/lib/learning-path/content";
import { LANGUAGES } from "@/lib/learning-path/i18n";
import { useStore } from "@/lib/learning-path/store";
import type { L1, SubLevel } from "@/lib/learning-path/types";
import { Doodle } from "./art/cast";
import { Home } from "./Home";
import { ItemRenderer, type ItemResult } from "./items";
import { GlowButton, Ring, Say, useLp } from "./ui";

type Step = "language" | "why" | "time" | "plan" | "placement" | "landing";

export function Onboarding({ onPlaced }: { onPlaced: () => void }) {
  const { state, dispatch } = useStore();
  const { t } = useLp();
  const [step, setStep] = useState<Step>("language");
  const [plan, setPlan] = useState<{ cue: string; time: string }>({ cue: "breakfast", time: "08:00" });
  const order: Step[] = ["language", "why", "time", "plan", "placement", "landing"];
  const idx = order.indexOf(step);

  // After placement the learner lands on their own journey, not on an
  // interstitial: the same Home screen, with Start as the one action.
  if (step === "landing") return <Home onStart={onPlaced} onSecond={onPlaced} />;

  return (
    // The step bar is this screen's progress signal. The decorative hero icon
    // that used to sit above each headline was neither the thing to understand
    // nor a signal of progress, so it has gone and the headline leads.
    <div className="relative flex h-full flex-col overflow-hidden px-5 pb-5 pt-4">
      <div className="relative mb-6 flex gap-1.5">{order.slice(0, 5).map((s, i) => <span key={s} className="h-1.5 flex-1 rounded-full" style={{ background: i <= Math.min(idx, 4) ? "var(--lp-glow)" : "var(--lp-track)" }} />)}</div>
      {step === "language" ? (
        <>
          <div className="flex-1" />
          <div className="lp-head mb-1">{t("choose_language")}</div>
          <div className="lp-body mb-6" style={{ color: "var(--lp-paper-soft)" }}>Learning Path · English</div>
          <div className="grid grid-cols-2 gap-3">
            {LANGUAGES.map((l) => (
              <button key={l.code} type="button" onClick={() => dispatch({ type: "learner", patch: { l1: l.code as L1 } })} className={`lp-choice ${state.learner.l1 === l.code ? "lp-choice-selected" : ""}`} style={{ minHeight: 64 }}>
                <span style={{ fontSize: 26 }}>{l.flag}</span><span className="lp-body">{l.native}</span>
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <div><GlowButton onClick={() => setStep("why")}>{t("continue")}</GlowButton></div>
        </>
      ) : null}
      {step === "why" ? (
        <>
          <div className="flex-1" />
          <div className="lp-head mb-5">{t("why_title")}</div>
          <div className="grid grid-cols-2 gap-3">
            {([["work", "💼"], ["study", "🎓"], ["travel", "✈️"], ["family", "👨‍👩‍👧"]] as const).map(([w, e]) => (
              <button key={w} type="button" onClick={() => dispatch({ type: "learner", patch: { why: w } })} className={`lp-choice flex-col justify-center text-center ${state.learner.why === w ? "lp-choice-selected" : ""}`} style={{ minHeight: 120 }}>
                <span style={{ fontSize: 40 }}>{e}</span><span className="lp-body">{t(`why_${w}`)}</span>
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <div><GlowButton disabled={!state.learner.why} onClick={() => setStep("time")}>{t("continue")}</GlowButton></div>
        </>
      ) : null}
      {step === "time" ? (
        <>
          <div className="flex-1" />
          <div className="lp-head mb-2">{t("time_title")}</div>
          <div className="lp-body mb-6" style={{ color: "var(--lp-paper-soft)" }}>{t("time_hint")}</div>
          {/* The ring that used to sit here only repeated the number on the
              button below it, so it has gone: the choice is the visual, and
              the step bar at the top is this screen's progress signal. */}
          <div className="flex gap-3">
            {([5, 10, 15] as const).map((m) => (
              <button key={m} type="button" onClick={() => dispatch({ type: "learner", patch: { daily_minutes: m } })} className={`lp-choice flex-col justify-center gap-0 text-center ${state.learner.daily_minutes === m ? "lp-choice-selected" : ""}`} style={{ minHeight: 104 }}>
                <span className="lp-head">{m}</span><span className="lp-small" style={{ color: "var(--lp-paper-faint)" }}>{t("minutes")}</span>
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <div><GlowButton onClick={() => setStep("plan")}>{t("continue")}</GlowButton></div>
        </>
      ) : null}
      {step === "plan" ? (
        <>
          <div className="flex-1" />
          <div className="lp-head mb-2">{t("plan_title")}</div>
          <div className="lp-body mb-6" style={{ color: "var(--lp-paper-soft)" }}>{t("plan_hint")}</div>
          <div className="lp-small mb-2" style={{ color: "var(--lp-paper-faint)" }}>{t("plan_after")}</div>
          <div className="mb-5 grid grid-cols-2 gap-2">
            {(["breakfast", "commute", "lunch", "dinner"] as const).map((c) => (
              <button key={c} type="button" onClick={() => setPlan((p) => ({ ...p, cue: c }))} className={`lp-choice justify-center ${plan.cue === c ? "lp-choice-selected" : ""}`} style={{ fontSize: "calc(17px * var(--lp-scale))" }}>{t(`plan_cue_${c}`)}</button>
            ))}
          </div>
          <div className="lp-small mb-2" style={{ color: "var(--lp-paper-faint)" }}>{t("plan_at")}</div>
          <input type="time" className="lp-input" value={plan.time} onChange={(e) => setPlan((p) => ({ ...p, time: e.target.value }))} />
          <div className="flex-1" />
          <div><GlowButton onClick={() => { dispatch({ type: "learner", patch: { plan } }); dispatch({ type: "event", name: "plan_set", data: plan }); setStep("placement"); }}>{t("continue")}</GlowButton></div>
        </>
      ) : null}
      {step === "placement" ? <Placement onDone={(lvl) => { dispatch({ type: "placement_done", sublevel: lvl }); setStep("landing"); }} /> : null}
    </div>
  );
}

/** Adaptive placement: 6 to 8 items with audio, stops after two consecutive misses, no timer, no score shown. */
function Placement({ onDone }: { onDone: (level: SubLevel) => void }) {
  const { t } = useLp();
  const { dispatch } = useStore();
  const [pos, setPos] = useState(2); // start at A1.2
  const [answered, setAnswered] = useState<{ level: SubLevel; correct: boolean }[]>([]);
  const [misses, setMisses] = useState(0);
  const [seen, setSeen] = useState<string[]>([]);
  const [last, setLast] = useState<boolean | null>(null);
  const item = PLACEMENT[pos];

  useEffect(() => { dispatch({ type: "event", name: "placement_started" }); }, [dispatch]);

  const finish = (list: { level: SubLevel; correct: boolean }[]) => {
    // The staircase cut score, not the highest correct answer: with three
    // options a single lucky tap must not set the whole path. See content.ts.
    onDone(placementLevel(list));
  };

  const onAnswer = (r: ItemResult) => {
    setLast(r.correct);
    const list = [...answered, { level: item.level, correct: r.correct }];
    setAnswered(list);
    setMisses(r.correct ? 0 : misses + 1);
    setSeen((s) => [...s, item.id]);
  };
  const onNext = () => {
    if (last === null) return;
    const m = last ? 0 : misses;
    if (m >= 2 || answered.length >= 8) { finish(answered); return; }
    let next = last ? pos + 1 : pos - 1;
    while (next >= 0 && next < PLACEMENT.length && seen.includes(PLACEMENT[next].id)) next += last ? 1 : -1;
    if (next < 0 || next >= PLACEMENT.length) { finish(answered); return; }
    setPos(next); setLast(null);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="lp-head mb-2">{t("find_start_title")}</div>
      <div className="lp-body mb-5" style={{ color: "var(--lp-paper-soft)" }}>{t("find_start_sub")}</div>
      <div className="min-h-0 flex-1">
        <ItemRenderer key={item.id} item={item.item} onAnswer={onAnswer} onNext={onNext} mode="placement" />
      </div>
    </div>
  );
}

export function Reward({ onDone }: { onDone: () => void }) {
  const { t } = useLp();
  const { dispatch } = useStore();
  const [asked, setAsked] = useState(false);
  return (
    <div className="flex h-full flex-col items-center px-5 pb-5 pt-6 text-center">
      {/* The one hero moment of the first run: a sun block with the figure
          cropped into it at size, and the day's ring as the sticker on it. */}
      <div className="relative w-full overflow-hidden" style={{ height: 232, background: "var(--lp-marker)", border: "var(--lp-border-w) solid #121212", borderRadius: "var(--lp-r-xl)", boxShadow: "var(--lp-card-shadow)" }}>
        <Doodle doodle="jumping" fit="xMidYMax slice" style={{ position: "absolute", insetInlineEnd: "-8%", bottom: 0, width: "78%", height: "116%" }} />
        {/* Sun is sun in both modes, so the ring takes the literal ink here. */}
        <div className="absolute" style={{ insetInlineStart: 16, bottom: 16, "--lp-glow": "#121212", "--lp-track": "rgba(18, 18, 18, 0.18)" } as React.CSSProperties}>
          <Ring fills={[1, 0, 0]} size={104} label={<div className="lp-head" style={{ color: "#121212" }}>1</div>} />
        </div>
      </div>
      <div className="lp-lesson mt-5"><Say text={t("reward_coach")} size="lesson" auto /></div>
      {!asked ? (
        <div className="lp-glass mt-8 w-full p-4">
          <div className="lp-body">{t("notif_title")}</div>
          <div className="lp-small mt-1" style={{ color: "var(--lp-paper-faint)" }}>{t("notif_sub")}</div>
          <div className="mt-3 flex gap-2">
            <GlowButton size="normal" onClick={() => { dispatch({ type: "learner", patch: { notifications: true } }); dispatch({ type: "event", name: "consent_recorded", data: { type: "notifications" } }); setAsked(true); }}>{t("allow")}</GlowButton>
            <GlowButton size="normal" secondary onClick={() => setAsked(true)}>{t("later")}</GlowButton>
          </div>
        </div>
      ) : (
        <div className="lp-glass mt-8 w-full p-4">
          <div className="lp-body">{t("account_title")}</div>
          <div className="lp-small mt-1" style={{ color: "var(--lp-paper-faint)" }}>{t("account_sub")}</div>
        </div>
      )}
      <div className="mt-auto w-full"><GlowButton onClick={() => { dispatch({ type: "learner", patch: { onboarded: true } }); onDone(); }}>{t("done")}</GlowButton></div>
    </div>
  );
}
