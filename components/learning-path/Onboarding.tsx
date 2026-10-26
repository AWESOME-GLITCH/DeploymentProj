"use client";

// First run, install to first atom in under four minutes: language, why,
// daily time, when-and-where plan, "let us find your start" (never called a
// test), then the first atom and the reward.

import { useEffect, useState } from "react";
import { CalendarClock, Compass, Languages, Timer } from "lucide-react";
import { PLACEMENT } from "@/lib/learning-path/content";
import { LANGUAGES } from "@/lib/learning-path/i18n";
import { useStore } from "@/lib/learning-path/store";
import type { L1, SubLevel } from "@/lib/learning-path/types";
import { SUBLEVELS } from "@/lib/learning-path/types";
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
    <div className="relative flex h-full flex-col overflow-hidden px-5 pb-5 pt-4">
      <div className="lp-blob" style={{ width: 300, height: 300, right: -120, top: -120, background: "var(--lp-glow-tint)" }} />
      <div className="lp-blob" style={{ width: 220, height: 220, left: -100, bottom: 80, background: "var(--lp-accent-tint)" }} />
      <div className="relative mb-4 flex gap-1.5">{order.slice(0, 5).map((s, i) => <span key={s} className="h-1.5 flex-1 rounded-full" style={{ background: i <= Math.min(idx, 4) ? "var(--lp-accent)" : "var(--lp-track)" }} />)}</div>
      {step === "language" ? (
        <>
          <Hero icon={<Languages size={34} />} />
          <div className="lp-head mb-1">{t("choose_language")}</div>
          <div className="lp-small mb-5" style={{ color: "var(--lp-paper-faint)" }}>Learning Path · English</div>
          <div className="grid grid-cols-2 gap-3">
            {LANGUAGES.map((l) => (
              <button key={l.code} type="button" onClick={() => dispatch({ type: "learner", patch: { l1: l.code as L1 } })} className={`lp-choice ${state.learner.l1 === l.code ? "lp-choice-selected" : ""}`} style={{ minHeight: 64 }}>
                <span style={{ fontSize: 26 }}>{l.flag}</span><span className="lp-body">{l.native}</span>
              </button>
            ))}
          </div>
          <div className="mt-auto"><GlowButton onClick={() => setStep("why")}>{t("continue")}</GlowButton></div>
        </>
      ) : null}
      {step === "why" ? (
        <>
          <Hero icon={<Compass size={34} />} />
          <div className="lp-head mb-5">{t("why_title")}</div>
          <div className="grid grid-cols-2 gap-3">
            {([["work", "💼"], ["study", "🎓"], ["travel", "✈️"], ["family", "👨‍👩‍👧"]] as const).map(([w, e]) => (
              <button key={w} type="button" onClick={() => dispatch({ type: "learner", patch: { why: w } })} className={`lp-choice flex-col justify-center text-center ${state.learner.why === w ? "lp-choice-selected" : ""}`} style={{ minHeight: 120 }}>
                <span style={{ fontSize: 40 }}>{e}</span><span className="lp-body">{t(`why_${w}`)}</span>
              </button>
            ))}
          </div>
          <div className="mt-auto"><GlowButton disabled={!state.learner.why} onClick={() => setStep("time")}>{t("continue")}</GlowButton></div>
        </>
      ) : null}
      {step === "time" ? (
        <>
          <Hero icon={<Timer size={34} />} />
          <div className="lp-head mb-2">{t("time_title")}</div>
          <div className="lp-small mb-4" style={{ color: "var(--lp-paper-faint)" }}>{t("time_hint")}</div>
          <div className="mb-5 flex justify-center"><Ring fills={[state.learner.daily_minutes / 15, state.learner.daily_minutes / 15, state.learner.daily_minutes / 15]} size={160} label={<><div className="lp-head">{state.learner.daily_minutes}</div><div className="lp-small" style={{ color: "var(--lp-paper-faint)" }}>{t("minutes")}</div></>} /></div>
          <div className="flex gap-2">
            {([5, 10, 15] as const).map((m) => (
              <button key={m} type="button" onClick={() => dispatch({ type: "learner", patch: { daily_minutes: m } })} className={`lp-choice justify-center ${state.learner.daily_minutes === m ? "lp-choice-selected" : ""}`}>{m}</button>
            ))}
          </div>
          <div className="mt-auto"><GlowButton onClick={() => setStep("plan")}>{t("continue")}</GlowButton></div>
        </>
      ) : null}
      {step === "plan" ? (
        <>
          <Hero icon={<CalendarClock size={34} />} />
          <div className="lp-head mb-2">{t("plan_title")}</div>
          <div className="lp-small mb-4" style={{ color: "var(--lp-paper-faint)" }}>{t("plan_hint")}</div>
          <div className="lp-eyebrow mb-2">{t("plan_after")}</div>
          <div className="mb-4 grid grid-cols-2 gap-2">
            {(["breakfast", "commute", "lunch", "dinner"] as const).map((c) => (
              <button key={c} type="button" onClick={() => setPlan((p) => ({ ...p, cue: c }))} className={`lp-choice justify-center ${plan.cue === c ? "lp-choice-selected" : ""}`} style={{ fontSize: "calc(17px * var(--lp-scale))" }}>{t(`plan_cue_${c}`)}</button>
            ))}
          </div>
          <div className="lp-eyebrow mb-2">{t("plan_at")}</div>
          <input type="time" className="lp-input" value={plan.time} onChange={(e) => setPlan((p) => ({ ...p, time: e.target.value }))} />
          <div className="mt-auto"><GlowButton onClick={() => { dispatch({ type: "learner", patch: { plan } }); dispatch({ type: "event", name: "plan_set", data: plan }); setStep("placement"); }}>{t("continue")}</GlowButton></div>
        </>
      ) : null}
      {step === "placement" ? <Placement onDone={(lvl) => { dispatch({ type: "placement_done", sublevel: lvl }); setStep("landing"); }} /> : null}
      {step === "landing" ? <Landing level={state.learner.provisional_sublevel ?? "A2.1"} onDone={onPlaced} /> : null}
    </div>
  );
}

function Hero({ icon }: { icon: React.ReactNode }) {
  return (
    <div className="relative mb-4 flex h-24 items-center justify-center">
      <div className="absolute h-24 w-24 rounded-full" style={{ background: "var(--lp-glow-tint)" }} />
      <div className="absolute h-16 w-16 rounded-full" style={{ background: "var(--lp-glow)", boxShadow: "var(--lp-btn-shadow)" }} />
      <div className="relative" style={{ color: "var(--lp-on-glow)" }}>{icon}</div>
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
    const correct = list.filter((x) => x.correct).map((x) => SUBLEVELS.indexOf(x.level));
    const level = correct.length ? SUBLEVELS[Math.max(...correct)] : "PreA1.1";
    onDone(level);
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
      <div className="lp-head mb-1">{t("find_start_title")}</div>
      <div className="lp-small mb-4" style={{ color: "var(--lp-paper-faint)" }}>{t("find_start_sub")} · {answered.length + 1}</div>
      <div className="min-h-0 flex-1">
        <ItemRenderer key={item.id} item={item.item} onAnswer={onAnswer} onNext={onNext} mode="placement" />
      </div>
    </div>
  );
}

/** The marker lands on the road. No numeric result on day one. */
function Landing({ level, onDone }: { level: SubLevel; onDone: () => void }) {
  const { t, rtl } = useLp();
  const [x, setX] = useState(rtl ? 320 : 20);
  const flags = ["Pre-A1", "A1", "A2", "B1", "B2"];
  const band = Math.max(0, Math.min(4, Math.floor(SUBLEVELS.indexOf(level) / 2) - (level.startsWith("Pre") ? 0 : 0)));
  const target = 30 + (band + 0.5) * 60;
  useEffect(() => { const id = window.setTimeout(() => setX(rtl ? 340 - target : target), 300); return () => window.clearTimeout(id); }, [target, rtl]);
  return (
    <div className="flex h-full flex-col">
      <div className="lp-head mb-2">{t("placement_landing")}</div>
      <div className="lp-glass my-6 p-4">
        <svg viewBox="0 0 340 120" width="100%" height="140">
          <path d="M10 90 C 80 20, 140 140, 200 60 S 300 20, 330 70" fill="none" stroke="var(--lp-track)" strokeWidth="14" strokeLinecap="round" />
          <path d="M10 90 C 80 20, 140 140, 200 60 S 300 20, 330 70" fill="none" stroke="var(--lp-line-strong)" strokeWidth="2" strokeDasharray="6 8" />
          {flags.map((f, i) => <text key={f} x={30 + i * 60 + 30} y={112} fill="var(--lp-paper-faint)" fontSize="11" textAnchor="middle">{f}</text>)}
          <g style={{ transition: "transform 1.6s cubic-bezier(0.22,1,0.36,1)", transform: `translateX(${x}px)` }}>
            <circle cx={0} cy={58} r={12} fill="var(--lp-glow-2)" style={{ filter: "drop-shadow(0 0 10px rgba(21,154,139,0.7))" }} />
            <circle cx={0} cy={58} r={5} fill="var(--lp-on-glow)" />
          </g>
        </svg>
      </div>
      <div className="lp-body text-center" style={{ color: "var(--lp-paper-soft)" }}><Say text={t("first_atom_title")} /></div>
      <div className="mt-auto"><GlowButton onClick={onDone}>{t("start")}</GlowButton></div>
    </div>
  );
}

export function Reward({ onDone }: { onDone: () => void }) {
  const { t } = useLp();
  const { dispatch } = useStore();
  const [asked, setAsked] = useState(false);
  return (
    <div className="flex h-full flex-col items-center px-5 pb-5 pt-10 text-center">
      <Ring fills={[1, 0, 0]} size={180} label={<div className="lp-head">1</div>} />
      <div className="lp-lesson mt-6"><Say text={t("reward_coach")} size="lesson" auto /></div>
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
