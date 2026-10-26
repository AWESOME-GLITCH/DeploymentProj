"use client";

// Tester panel (outside the phone): jump between screens, move the clock,
// auto-fill answers, inspect the scheduler, the session composer's reasons,
// criterion mastery and the analytics event stream.

import { useState } from "react";
import { ATOMS, CRITERIA, ITEM_BY_ID } from "@/lib/learning-path/content";
import { composeSession, dayIndex, dueItems, nextReviewAt, recallProbability, weekDay } from "@/lib/learning-path/engine";
import { useNow, useStore } from "@/lib/learning-path/store";
import type { LearnerState, SessionPhase, SubLevel } from "@/lib/learning-path/types";
import { SUBLEVELS } from "@/lib/learning-path/types";
import { fireAuto } from "./items";
import type { Screen } from "./ui";

export function Tester({ screen, go, startSession, onClose }: { screen: Screen; go: (s: Screen) => void; startSession: (second?: boolean) => void; onClose?: () => void }) {
  const { state, dispatch } = useStore();
  const now = useNow();
  const day = dayIndex(state, now);
  const [tab, setTab] = useState<"flow" | "engine" | "mastery" | "composer" | "events">("flow");
  const due = dueItems(state, now);
  const preview = state.learner.placement_done ? composeSession(state, now) : null;
  const items = Object.values(state.items).sort((a, b) => recallProbability(a, now) - recallProbability(b, now));

  return (
    <div className="lp-tester flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
        <div><div className="font-semibold">Tester</div><div style={{ color: "#9aa3a8" }}>Day {day + 1} · week day {weekDay(state, day)} · {screen}</div></div>
        {onClose ? <button type="button" className="lp-tbtn" onClick={onClose}>Close</button> : null}
      </div>
      <div className="flex gap-1 border-b border-white/10 px-2 py-1.5">
        {(["flow", "engine", "mastery", "composer", "events"] as const).map((k) => (
          <button key={k} type="button" onClick={() => setTab(k)} className={`lp-tbtn ${tab === k ? "lp-tbtn-glow" : ""}`} style={{ padding: "4px 8px" }}>{k}</button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        {tab === "flow" ? (
          <div className="flex flex-col gap-3">
            <Section title="Answer the current item">
              <div className="flex gap-2"><button type="button" className="lp-tbtn lp-tbtn-glow" onClick={() => fireAuto(true)}>Fill correct</button><button type="button" className="lp-tbtn" onClick={() => fireAuto(false)}>Fill wrong</button></div>
              <div style={{ color: "#9aa3a8" }}>Works on any item, including speaking (sends a model transcript).</div>
            </Section>
            <Section title="Clock">
              <div className="flex flex-wrap gap-2">
                <button type="button" className="lp-tbtn" onClick={() => dispatch({ type: "advance_days", days: 1 })}>+1 day</button>
                <button type="button" className="lp-tbtn" onClick={() => dispatch({ type: "advance_days", days: 3 })}>+3 days (missed, warm restart)</button>
                <button type="button" className="lp-tbtn" onClick={() => dispatch({ type: "advance_days", days: 7 })}>+7 days</button>
                <button type="button" className="lp-tbtn" onClick={() => dispatch({ type: "advance_days", days: 28 })}>+28 days (checkpoint)</button>
              </div>
              <div style={{ color: "#9aa3a8" }}>Simulated: {new Date(now).toLocaleString("en-GB")} · offset {Math.round(state.clock_offset / 86_400_000)} d</div>
            </Section>
            <Section title="Go to">
              <div className="flex flex-wrap gap-2">
                {(["home", "road", "progress", "classmates", "me"] as Screen[]).map((s) => <button key={s} type="button" className="lp-tbtn" disabled={!state.learner.onboarded} onClick={() => go(s)}>{s}</button>)}
                <button type="button" className="lp-tbtn" disabled={!state.learner.placement_done} onClick={() => startSession(false)}>start session</button>
                <button type="button" className="lp-tbtn" disabled={!state.learner.placement_done} onClick={() => startSession(true)}>second session</button>
                <button type="button" className="lp-tbtn" disabled={!state.learner.placement_done} onClick={() => go("checkpoint")}>checkpoint</button>
              </div>
            </Section>
            <Section title="Learner">
              <div className="flex flex-wrap items-center gap-2">
                <label>L1 <select className="lp-tbtn" value={state.learner.l1} onChange={(e) => dispatch({ type: "learner", patch: { l1: e.target.value as typeof state.learner.l1 } })}>{["en", "ar", "hi", "ru", "es", "tr", "zh"].map((x) => <option key={x}>{x}</option>)}</select></label>
                <label>Level <select className="lp-tbtn" value={state.learner.confirmed_sublevel ?? ""} onChange={(e) => dispatch({ type: "learner", patch: { confirmed_sublevel: e.target.value as SubLevel, provisional_sublevel: e.target.value as SubLevel } })}><option value="">-</option>{SUBLEVELS.map((x) => <option key={x}>{x}</option>)}</select></label>
                <label>UI <select className="lp-tbtn" value={state.learner.l1_override} onChange={(e) => dispatch({ type: "learner", patch: { l1_override: e.target.value as "auto" | "full" | "english" } })}><option>auto</option><option>full</option><option>english</option></select></label>
                <label>Theme <select className="lp-tbtn" value={state.learner.theme} onChange={(e) => dispatch({ type: "learner", patch: { theme: e.target.value as "auto" | "light" | "dark" } })}><option>auto</option><option>light</option><option>dark</option></select></label>
                <label>Text <select className="lp-tbtn" value={state.learner.text_scale} onChange={(e) => dispatch({ type: "learner", patch: { text_scale: Number(e.target.value) as 1 | 1.15 | 1.3 } })}><option value={1}>100%</option><option value={1.15}>115%</option><option value={1.3}>130%</option></select></label>
              </div>
              <div className="mt-2 flex gap-2">
                <button type="button" className="lp-tbtn" onClick={() => { if (window.confirm("Reset the learner and start again?")) { dispatch({ type: "reset" }); go("onboarding"); } }}>Reset learner</button>
                <button type="button" className="lp-tbtn" onClick={() => { const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" }); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `learning-path-state-day${day + 1}.json`; a.click(); }}>Export state</button>
              </div>
            </Section>
            <Section title="Counts">
              <div>Items tracked {items.length} · due {due.length} · attempts {state.attempts.length} · sessions {state.sessions.length} · events {state.events.length}</div>
              <div>Spoken this session: {state.current?.spoken ? "yes" : "no"} · reflections {state.reflections.length} · story unlocks {state.story_unlocks}</div>
            </Section>
            <Section title="Time to the first spoken turn">
              <div>Opens on: {state.current ? phaseLabel(state.current.session.phases[0]) : "no session running"}</div>
              <div style={{ color: timeToSpoken(state) === null ? "#9aa3a8" : (timeToSpoken(state) as number) <= 60 ? "#5fd3b5" : "#ffb547" }}>
                First spoken turn: {state.current ? (timeToSpoken(state) === null ? "not spoken yet" : `+${(timeToSpoken(state) as number).toFixed(1)} s`) : "-"}
              </div>
              <div style={{ color: "#9aa3a8" }}>Measured from session_started to the first spoken answer. Target: inside 60 s (board rule 2).</div>
            </Section>
          </div>
        ) : null}
        {tab === "engine" ? (
          <table>
            <thead><tr><th>Item</th><th>State</th><th>h (d)</th><th>p</th><th>Due</th><th>Next</th><th>Mods</th><th>✓/✗</th></tr></thead>
            <tbody>
              {items.map((m) => {
                const p = recallProbability(m, now);
                return (
                  <tr key={m.item_id} style={{ color: p <= 0.8 ? "#ffb547" : undefined }}>
                    <td title={ITEM_BY_ID[m.item_id]?.stem.en}>{m.item_id.replace("ITM-", "")}</td>
                    <td>{m.state}{m.provisional ? "*" : ""}{m.reteach ? " ↺" : ""}</td>
                    <td>{m.half_life_days.toFixed(2)}</td><td>{p.toFixed(2)}</td><td>{p <= 0.8 ? "yes" : ""}</td>
                    <td>{Math.max(0, (nextReviewAt(m) - now) / 86_400_000).toFixed(1)} d</td>
                    <td>{m.modality_mask.map((x) => x[0]).join("")}</td><td>{m.correct}/{m.incorrect}</td>
                  </tr>
                );
              })}
              {!items.length ? <tr><td colSpan={8} style={{ color: "#9aa3a8" }}>No items yet. Complete placement and the first atom.</td></tr> : null}
            </tbody>
          </table>
        ) : null}
        {tab === "mastery" ? (
          <table>
            <thead><tr><th>Criterion</th><th>Rule</th><th>State</th><th>Sittings</th></tr></thead>
            <tbody>
              {CRITERIA.map((c) => {
                const m = state.criteria[c.criterion_id];
                return (
                  <tr key={c.criterion_id}>
                    <td title={c.descriptor.en}>{c.criterion_id.replace("CRI-", "")}</td><td>{c.mastery_rule}</td>
                    <td style={{ color: m?.state === "mastered" ? "#5fd3b5" : undefined }}>{m?.state ?? "unseen"}</td>
                    <td>{(m?.sittings ?? []).map((s, i) => <span key={i} style={{ marginRight: 6, color: s.pass ? "#5fd3b5" : "#d8c7a1" }}>d{s.day + 1}:{s.correct}/{s.total}</span>)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : null}
        {tab === "composer" ? (
          <div className="flex flex-col gap-2">
            <div style={{ color: "#9aa3a8" }}>What the session composer would serve now. Week can-do: {state.week_can_do ?? "none yet"}.</div>
            {preview ? (
              <>
                <table><thead><tr><th>#</th><th>Phase</th><th>Detail</th></tr></thead><tbody>
                  {preview.phases.map((p, i) => <tr key={i}><td>{i + 1}</td><td>{p.kind}</td><td>{p.kind === "atom" ? `${p.role} · ${p.atom_id}` : p.kind === "recall" ? p.items.join(", ") : p.kind === "close" ? `checks ${p.check_items.join(", ") || "none"}` : p.kind === "story" ? p.atom_id : p.kind === "vote" ? p.item_id : ""}</td></tr>)}
                </tbody></table>
                <div className="font-semibold">Reasons</div>
                <ul>{preview.reasons.map((r, i) => <li key={i}>· {r}</li>)}</ul>
                <div style={{ color: "#9aa3a8" }}>new_allowed {String(preview.new_allowed)} · due {preview.due_count} · warm restart {String(preview.warm_restart)}</div>
              </>
            ) : <div>Complete placement first.</div>}
            <div className="mt-2 font-semibold">Atoms in the seed</div>
            <ul>{ATOMS.map((a) => <li key={a.atom_id}>· {a.atom_id} · {a.type} · {a.strand} {a.sublevel} · {a.title.en}</li>)}</ul>
          </div>
        ) : null}
        {tab === "events" ? (
          <table>
            <thead><tr><th>Day</th><th>Event</th><th>Data</th></tr></thead>
            <tbody>{[...state.events].reverse().slice(0, 80).map((e, i) => <tr key={i}><td>{e.day + 1}</td><td>{e.name}</td><td style={{ whiteSpace: "normal", maxWidth: 260, fontSize: 11, color: "#9aa3a8" }}>{e.data ? JSON.stringify(e.data) : ""}</td></tr>)}</tbody>
          </table>
        ) : null}
      </div>
    </div>
  );
}

/** Seconds from the session starting to the learner's first spoken answer, or
 *  null if nothing has been spoken yet. The board's rule 2 is "inside 60 s". */
function timeToSpoken(state: LearnerState): number | null {
  const cur = state.current;
  if (!cur) return null;
  const spoken = state.events.find((e) => e.at >= cur.started_at
    && (e.name === "explainer_spoken" || (e.name === "item_answered" && e.data?.modality === "spoken")));
  return spoken ? (spoken.at - cur.started_at) / 1000 : null;
}

function phaseLabel(p: SessionPhase): string {
  if (p.kind === "atom") return `${p.atom_id.startsWith("USE:") ? "use task" : "atom"} · ${p.role} · ${p.atom_id}`;
  if (p.kind === "recall") return `recall · ${p.items.length} items`;
  if (p.kind === "story") return `story · ${p.atom_id}`;
  if (p.kind === "vote") return `vote · ${p.item_id}`;
  return p.kind;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="rounded-lg border border-white/10 p-2.5"><div className="mb-1.5 font-semibold">{title}</div><div className="flex flex-col gap-1.5">{children}</div></div>;
}
