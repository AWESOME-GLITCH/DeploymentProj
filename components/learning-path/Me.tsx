"use client";

// Me: settings and language. Scrolls, low frequency.

import { useState } from "react";
import { LANGUAGES } from "@/lib/learning-path/i18n";
import { useStore } from "@/lib/learning-path/store";
import { voiceName } from "@/lib/learning-path/speech";
import type { L1 } from "@/lib/learning-path/types";
import { GlowButton, useLp } from "./ui";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b py-3" style={{ borderColor: "var(--lp-line)" }}>
      <div className="lp-body">{label}</div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}

function Seg<T extends string | number>({ value, options, onChange }: { value: T; options: { v: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <div className="flex gap-1">
      {options.map((o) => (
        <button key={String(o.v)} type="button" onClick={() => onChange(o.v)} className="lp-pill" style={{ minHeight: 40, padding: "0 12px", fontSize: 13, ...(o.v === value ? { color: "var(--lp-glow-2)", borderColor: "var(--lp-glow-line)", background: "var(--lp-glow-tint)" } : {}) }}>{o.label}</button>
      ))}
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" role="switch" aria-checked={on} onClick={() => onChange(!on)} className="relative h-8 w-14 rounded-full" style={{ background: on ? "var(--lp-sea-deep)" : "var(--lp-track)", border: "1px solid var(--lp-line)" }}>
      <span className="absolute top-1 h-6 w-6 rounded-full transition-all" style={{ left: on ? 30 : 4, background: "#fff", boxShadow: "0 1px 3px rgba(30,36,41,0.35)" }} />
    </button>
  );
}

export function Me() {
  const { state, dispatch } = useStore();
  const { t } = useLp();
  const [confirm, setConfirm] = useState(false);
  const l = state.learner;
  const patch = (p: Partial<typeof l>) => dispatch({ type: "learner", patch: p });
  return (
    <div className="h-full overflow-y-auto px-5 pb-6 pt-4">
      <div className="lp-eyebrow">{t("me")}</div>
      <div className="lp-head mb-2">{t("settings")}</div>
      <Row label={t("language")}>
        <select className="lp-input" style={{ minHeight: 40, padding: "4px 10px", fontSize: 15, width: 150 }} value={l.l1} onChange={(e) => patch({ l1: e.target.value as L1 })}>
          {LANGUAGES.map((x) => <option key={x.code} value={x.code}>{x.flag} {x.native}</option>)}
        </select>
      </Row>
      <Row label={t("interface_language")}><Seg value={l.l1_override} options={[{ v: "auto", label: t("auto") }, { v: "full", label: t("full_l1") }, { v: "english", label: t("english_ui") }]} onChange={(v) => patch({ l1_override: v })} /></Row>
      <Row label={t("text_size")}><Seg value={l.text_scale} options={[{ v: 1, label: "A" }, { v: 1.15, label: "A+" }, { v: 1.3, label: "A++" }]} onChange={(v) => patch({ text_scale: v })} /></Row>
      <Row label="Voice"><span className="lp-small" style={{ color: "var(--lp-paper-faint)" }}>{voiceName() === "elevenlabs" ? "ElevenLabs" : voiceName() === "browser" ? "Browser voice" : "…"}</span></Row>
      <Row label={t("audio_speed")}><Seg value={l.audio_speed} options={[{ v: 0.75, label: "0.75×" }, { v: 1, label: "1.0×" }]} onChange={(v) => patch({ audio_speed: v })} /></Row>
      <Row label={t("daily_goal")}><Seg value={l.daily_minutes} options={[{ v: 5, label: "5" }, { v: 10, label: "10" }, { v: 15, label: "15" }]} onChange={(v) => patch({ daily_minutes: v })} /></Row>
      <Row label={`${t("notifications")}${l.plan ? ` · ${l.plan.time}` : ""}`}><Toggle on={l.notifications} onChange={(v) => patch({ notifications: v })} /></Row>
      <Row label={t("report_sharing")}><Toggle on={l.report_sharing} onChange={(v) => patch({ report_sharing: v })} /></Row>
      <Row label={t("appearance")}><Seg value={l.theme} options={[{ v: "auto", label: t("auto") }, { v: "light", label: t("light") }, { v: "dark", label: t("dark") }]} onChange={(v) => patch({ theme: v })} /></Row>
      <Row label={t("reduce_motion")}><Toggle on={l.reduce_motion} onChange={(v) => patch({ reduce_motion: v })} /></Row>
      <Row label={t("teen")}><Toggle on={l.teen_mode} onChange={(v) => { patch({ teen_mode: v }); if (v) dispatch({ type: "event", name: "consent_recorded", data: { type: "teen_mode" } }); }} /></Row>
      {l.teen_mode ? <div className="lp-small py-2" style={{ color: "var(--lp-paper-faint)" }}>Teen mode: no profiling nudges, report sharing to a parent, UAE PDPL and UK AADC consent recorded.</div> : null}
      <div className="mt-6">
        {!confirm ? (
          <GlowButton secondary size="normal" onClick={() => setConfirm(true)}>{t("reset")}</GlowButton>
        ) : (
          <div className="flex gap-2"><GlowButton size="normal" onClick={() => { dispatch({ type: "reset" }); setConfirm(false); }}>{t("reset")}</GlowButton><GlowButton size="normal" secondary onClick={() => setConfirm(false)}>{t("later")}</GlowButton></div>
        )}
      </div>
      <div className="lp-small mt-6" style={{ color: "var(--lp-paper-faint)" }}>Learning Path prototype · {t("install_hint")}</div>
    </div>
  );
}
