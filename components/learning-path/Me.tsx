"use client";

// Me: the learner's week at the top, then the settings that change the lesson.
// Nothing explains itself in a paragraph.

import { useState } from "react";
import { CEFR_LABEL, LANGUAGES } from "@/lib/learning-path/i18n";
import { dayIndex, weekDay } from "@/lib/learning-path/engine";
import { useNow, useStore } from "@/lib/learning-path/store";
import type { L1 } from "@/lib/learning-path/types";
import { DotRow, GlowButton, useLp } from "./ui";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-[48px] items-center justify-between gap-3 border-b py-1.5" style={{ borderColor: "var(--lp-line)" }}>
      <div className="lp-body">{label}</div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}

// One segmented control, not a row of tinted pills (board, 26 Oct): a single
// bordered group, the chosen segment filled with the ink.
function Seg<T extends string | number>({ value, options, onChange }: { value: T; options: { v: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <div className="lp-seg">
      {options.map((o) => (
        <button key={String(o.v)} type="button" onClick={() => onChange(o.v)} data-on={o.v === value}>{o.label}</button>
      ))}
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" role="switch" aria-checked={on} onClick={() => onChange(!on)} className="relative h-8 w-14 rounded-full" style={{ background: on ? "var(--lp-sea)" : "var(--lp-track)", border: "1px solid var(--lp-line)", transition: "background var(--lp-t-swap) var(--lp-ease)" }}>
      <span className="absolute top-1 h-6 w-6 rounded-full" style={{ left: on ? 30 : 4, background: "#fff", boxShadow: "0 1px 3px rgba(10,26,24,0.3)", transition: "left var(--lp-t-swap) var(--lp-ease)" }} />
    </button>
  );
}

export function Me() {
  const { state, dispatch } = useStore();
  const { t } = useLp();
  const now = useNow();
  const [confirm, setConfirm] = useState(false);
  const l = state.learner;
  const patch = (p: Partial<typeof l>) => dispatch({ type: "learner", patch: p });
  const week = Array.from({ length: 7 }, (_, i) => state.sessions.some((s) => s.completed && weekDay(state, s.day) === i + 1 && s.day >= state.week_start_day));
  const level = l.confirmed_sublevel ?? l.provisional_sublevel;
  return (
    <div className="h-full overflow-y-auto px-5 pb-5 pt-4">
      {/* The level large, what it is in regular weight under it, and the week
          as the one visual. Nothing else is bold on this screen. */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="lp-head">{level ? CEFR_LABEL[level] : t("settings")}</div>
          <div className="lp-small mt-1" style={{ color: "var(--lp-paper-faint)" }}>{level ? t("level_estimate") : ""}</div>
        </div>
        <div className="pt-2"><DotRow days={week} today={weekDay(state, dayIndex(state, now)) - 1} /></div>
      </div>
      <div className="mt-5" />
      <Row label={t("language")}>
        <select className="lp-input" style={{ minHeight: 44, padding: "4px 10px", fontSize: 15, width: 150 }} value={l.l1} onChange={(e) => patch({ l1: e.target.value as L1 })}>
          {LANGUAGES.map((x) => <option key={x.code} value={x.code}>{x.flag} {x.native}</option>)}
        </select>
      </Row>
      <Row label={t("interface_language")}><Seg value={l.l1_override} options={[{ v: "auto", label: t("auto") }, { v: "full", label: t("full_l1") }, { v: "english", label: t("english_ui") }]} onChange={(v) => patch({ l1_override: v })} /></Row>
      <Row label={t("text_size")}><Seg value={l.text_scale} options={[{ v: 1, label: "A" }, { v: 1.15, label: "A+" }, { v: 1.3, label: "A++" }]} onChange={(v) => patch({ text_scale: v })} /></Row>
      <Row label={t("audio_speed")}><Seg value={l.audio_speed} options={[{ v: 0.75, label: "0.75×" }, { v: 1, label: "1.0×" }]} onChange={(v) => patch({ audio_speed: v })} /></Row>
      <Row label={t("daily_goal")}><Seg value={l.daily_minutes} options={[{ v: 5, label: "5" }, { v: 10, label: "10" }, { v: 15, label: "15" }]} onChange={(v) => patch({ daily_minutes: v })} /></Row>
      <Row label={`${t("notifications")}${l.plan ? ` · ${l.plan.time}` : ""}`}><Toggle on={l.notifications} onChange={(v) => patch({ notifications: v })} /></Row>
      <Row label={t("report_sharing")}><Toggle on={l.report_sharing} onChange={(v) => patch({ report_sharing: v })} /></Row>
      <Row label={t("appearance")}><Seg value={l.theme} options={[{ v: "auto", label: t("auto") }, { v: "light", label: t("light") }, { v: "dark", label: t("dark") }]} onChange={(v) => patch({ theme: v })} /></Row>
      <Row label={t("reduce_motion")}><Toggle on={l.reduce_motion} onChange={(v) => patch({ reduce_motion: v })} /></Row>
      <Row label={t("teen")}><Toggle on={l.teen_mode} onChange={(v) => { patch({ teen_mode: v }); if (v) dispatch({ type: "event", name: "consent_recorded", data: { type: "teen_mode" } }); }} /></Row>
      <div className="mt-5">
        {!confirm ? (
          <GlowButton secondary size="normal" onClick={() => setConfirm(true)}>{t("reset")}</GlowButton>
        ) : (
          <div className="flex gap-2"><GlowButton size="normal" onClick={() => { dispatch({ type: "reset" }); setConfirm(false); }}>{t("reset")}</GlowButton><GlowButton size="normal" secondary onClick={() => setConfirm(false)}>{t("later")}</GlowButton></div>
        )}
      </div>
    </div>
  );
}
