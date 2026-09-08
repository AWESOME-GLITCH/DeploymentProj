"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getModule } from "@/lib/modules";
import { PageHeader } from "@/components/PageHeader";
import { Card, Button, SectionLabel, ConfidenceBadge } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { ExportMenu } from "@/components/ExportMenu";
import { SaveToProgramme } from "@/components/SaveToProgramme";
import { H } from "@/lib/export";
import {
  PARTS,
  checkGuardrails,
  type GuardrailEvent,
  type Report,
  type Signals,
  type Turn,
} from "@/lib/speaking";

const M = getModule("speaking")!;

/* ------------------------------------------------------------------ *
 * Web Speech API (not in the TS DOM lib, so a minimal shape is enough)
 * ------------------------------------------------------------------ */

type Recognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: any) => void) | null;
  onerror: ((e: any) => void) | null;
  onend: (() => void) | null;
};

const MIC_ERRORS: Record<string, string> = {
  "not-allowed": "Microphone access was blocked. Allow the mic in your browser, then start again.",
  "service-not-allowed": "Microphone access was blocked by your device settings.",
  "audio-capture": "No microphone was found. Plug one in, or type your answer instead.",
  network: "The speech service could not be reached. Check your connection, or type your answer.",
  "no-speech": "I did not hear anything. Try again, a little closer to the mic.",
};

type Phase = "idle" | "asking" | "ready" | "recording" | "scoring" | "done" | "halted";

type Line = { who: "examiner" | "you"; text: string; flagged?: boolean };

/* ------------------------------------------------------------------ *
 * Export
 * ------------------------------------------------------------------ */

function reportHtml(r: Report, s: Signals, events: GuardrailEvent[]) {
  return (
    H.brandTitle(`Speaking assessment, ${r.overallBand}`, "ES World, Speaking Assessment Portal") +
    H.kv("Overall", `${r.overallScore}/10, CEFR ${r.overallBand}`) +
    H.kv("Indicative IELTS", r.ieltsEstimate) +
    H.kv("Confidence", r.confidence) +
    H.h2("Summary") + H.p(r.summary) +
    H.h2("Criteria") +
    H.ul(r.criteria.map((c) => `<b>${c.name}, ${c.score}/10</b> (${c.confidence} confidence)<br>${c.evidence}<br><i>Next: ${c.nextStep}</i>`)) +
    H.h2("Strengths") + H.ul(r.strengths) +
    H.h2("What to work on") + H.ul(r.improvements) +
    H.h2("Vocabulary upgrades") + H.ul(r.vocabularyUpgrades.map((v) => `${v.said} → ${v.better}`)) +
    H.h2("Recommended next course") + H.p(`<b>${r.recommendedCourse.name}</b>, ${r.recommendedCourse.why}`) +
    H.h2("Measured signals") +
    H.ul([
      `Parts answered: ${s.answers} of ${PARTS.length}`,
      `Total words: ${s.totalWords}, average ${s.avgWordsPerAnswer} per answer`,
      `Speaking rate: ${s.wordsPerMinute ? `${s.wordsPerMinute} words per minute` : "not measured, answers were typed"}`,
      `Lexical variety: ${Math.round(s.lexicalVariety * 100)}%`,
      `Linking phrases: ${s.linkerCount}, filler rate ${(s.fillerRate * 100).toFixed(1)}%`,
    ]) +
    H.h2("What this score cannot tell you") + H.ul(r.caveats) +
    (events.length
      ? H.h2("Guardrail log") + H.ul(events.map((e) => `${e.at}, ${e.category}, ${e.reason}`))
      : "")
  );
}

/* ------------------------------------------------------------------ *
 * Page
 * ------------------------------------------------------------------ */

export default function SpeakingPage() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [partIndex, setPartIndex] = useState(0);
  const [lines, setLines] = useState<Line[]>([]);
  const [interim, setInterim] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [alert, setAlert] = useState<{ reason: string; category: string } | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [micSupported, setMicSupported] = useState(true);
  const [typing, setTyping] = useState(false);
  const [typed, setTyped] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [events, setEvents] = useState<GuardrailEvent[]>([]);
  const [report, setReport] = useState<Report | null>(null);
  const [signals, setSignals] = useState<Signals | null>(null);
  const [demo, setDemo] = useState(false);
  /** Answers waiting to be marked after a failed marking call, so a network
   *  blip never costs the candidate the exam they just sat. */
  const [unmarked, setUnmarked] = useState<Turn[] | null>(null);

  const recRef = useRef<Recognition | null>(null);
  const finalRef = useRef("");
  const stoppingRef = useRef(false);
  const restartsRef = useRef(0);
  const startedAtRef = useRef(0);
  const phaseRef = useRef<Phase>("idle");
  const submitRef = useRef<(text: string, typedAnswer: boolean) => void>(() => {});
  const scrollRef = useRef<HTMLDivElement>(null);

  phaseRef.current = phase;

  const part = PARTS[Math.min(partIndex, PARTS.length - 1)];

  /* ---------------- speech synthesis ---------------- */

  const speak = useCallback((text: string, done?: () => void) => {
    const synth = typeof window !== "undefined" ? window.speechSynthesis : undefined;
    if (!synth) {
      // No voice output (some browsers, or a muted device). The exam still runs,
      // the question is on screen, so just move straight on.
      done?.();
      return;
    }
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-GB";
    u.rate = 0.95;
    const voices = synth.getVoices();
    const preferred =
      voices.find((v) => /en-GB/i.test(v.lang) && /google|natural|premium/i.test(v.name)) ||
      voices.find((v) => /en-GB/i.test(v.lang)) ||
      voices.find((v) => /^en/i.test(v.lang));
    if (preferred) u.voice = preferred;

    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      done?.();
    };
    u.onend = finish;
    u.onerror = finish;
    // Chrome drops `onend` if the utterance is cancelled or the tab is
    // backgrounded, so a length-based fallback guarantees the exam moves on.
    const fallbackMs = Math.min(30000, 1800 + (text.split(/\s+/).length / 2.6) * 1000);
    setTimeout(finish, fallbackMs);
    synth.speak(u);
  }, []);

  /* ---------------- speech recognition ---------------- */

  useEffect(() => {
    const Ctor =
      typeof window !== "undefined"
        ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        : undefined;
    if (!Ctor) {
      setMicSupported(false);
      setTyping(true);
      return;
    }
    const rec: Recognition = new Ctor();
    rec.lang = "en-GB";
    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    rec.onresult = (e: any) => {
      let live = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        if (res.isFinal) finalRef.current += res[0].transcript + " ";
        else live += res[0].transcript;
      }
      setInterim(live);
    };

    rec.onerror = (e: any) => {
      const code = String(e?.error || "");
      if (code === "aborted") return;
      // "no-speech" is routine mid-answer; Chrome recovers on the auto-restart.
      if (code === "no-speech" && phaseRef.current === "recording") return;
      setNotice(MIC_ERRORS[code] || "The microphone stopped unexpectedly. Try again, or type your answer.");
      if (code === "not-allowed" || code === "audio-capture" || code === "service-not-allowed") {
        setTyping(true);
      }
    };

    rec.onend = () => {
      if (stoppingRef.current) {
        stoppingRef.current = false;
        submitRef.current(finalRef.current.trim(), false);
        return;
      }
      // Chrome ends the stream after a pause. The candidate is still thinking,
      // so restart until they press Done (capped, so a broken mic can't loop).
      if (phaseRef.current === "recording" && restartsRef.current < 20) {
        restartsRef.current += 1;
        try {
          rec.start();
        } catch {
          /* already starting */
        }
      }
    };

    recRef.current = rec;
    return () => {
      rec.onresult = null;
      rec.onerror = null;
      rec.onend = null;
      try {
        rec.abort();
      } catch {
        /* nothing to abort */
      }
      if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    };
  }, []);

  // Recording timer, the elapsed seconds also become the pace measurement.
  useEffect(() => {
    if (phase !== "recording") return;
    const t = setInterval(() => setElapsed(Math.round((Date.now() - startedAtRef.current) / 1000)), 500);
    return () => clearInterval(t);
  }, [phase]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [lines]);

  /* ---------------- exam flow ---------------- */

  const say = useCallback(
    (text: string, then?: () => void) => {
      setLines((l) => [...l, { who: "examiner", text }]);
      setPhase("asking");
      speak(text, () => then?.());
    },
    [speak]
  );

  const askPart = useCallback(
    (index: number) => {
      setPartIndex(index);
      say(PARTS[index].prompt, () => setPhase("ready"));
    },
    [say]
  );

  const score = useCallback(async (finalTurns: Turn[]) => {
    setPhase("scoring");
    setNotice(null);
    try {
      const res = await fetch("/api/speaking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ turns: finalTurns }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Marking failed");
      setReport(data.report);
      setSignals(data.signals);
      setDemo(Boolean(data.demo));
      setUnmarked(null);
      setPhase("done");
    } catch (e: any) {
      setNotice(e.message || "Marking failed. Your answers are safe, try marking again.");
      setUnmarked(finalTurns);
      setPhase("ready");
    }
  }, []);

  const submit = useCallback(
    (text: string, typedAnswer: boolean) => {
      const seconds = typedAnswer ? 0 : Math.max(0, (Date.now() - startedAtRef.current) / 1000);
      setInterim("");
      setElapsed(0);

      if (!text.trim()) {
        setNotice("I did not catch an answer. Press the button and try again.");
        setPhase("ready");
        return;
      }

      // Guardrails run here, before the turn is stored, shown or spoken back.
      const verdict = checkGuardrails(text);
      setLines((l) => [...l, { who: "you", text: verdict.redacted || text, flagged: !verdict.safe }]);

      if (!verdict.safe) {
        setAlert({ reason: verdict.reason!, category: verdict.category! });
        setEvents((e) => [
          ...e,
          {
            partId: part.id,
            category: verdict.category!,
            reason: verdict.reason!,
            at: new Date().toLocaleTimeString(),
          },
        ]);
        if (verdict.halt) {
          say(verdict.reply!, () => setPhase("halted"));
          return;
        }
        // Not scored, not counted against the candidate. The question is re-asked.
        say(verdict.reply!, () => say(part.prompt, () => setPhase("ready")));
        return;
      }

      setAlert(null);
      const turn: Turn = { partId: part.id, text: verdict.redacted || text, seconds, typed: typedAnswer };
      const next = [...turns, turn];
      setTurns(next);

      if (partIndex + 1 < PARTS.length) {
        askPart(partIndex + 1);
      } else {
        say("Thank you, that is the end of the assessment. Give me a moment while I mark it.", () => score(next));
      }
    },
    [askPart, part, partIndex, say, score, turns]
  );

  submitRef.current = submit;

  function startExam() {
    setLines([]);
    setTurns([]);
    setEvents([]);
    setReport(null);
    setSignals(null);
    setAlert(null);
    setNotice(null);
    setUnmarked(null);
    askPart(0);
  }

  function startRecording() {
    const rec = recRef.current;
    if (!rec) {
      setTyping(true);
      return;
    }
    setNotice(null);
    setAlert(null);
    finalRef.current = "";
    restartsRef.current = 0;
    stoppingRef.current = false;
    setInterim("");
    setElapsed(0);
    startedAtRef.current = Date.now();
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    try {
      rec.start();
      setPhase("recording");
    } catch {
      // Already running after a fast double click, just keep recording.
      setPhase("recording");
    }
  }

  function stopRecording() {
    const rec = recRef.current;
    stoppingRef.current = true;
    setPhase("asking");
    try {
      rec?.stop();
    } catch {
      submit(finalRef.current.trim(), false);
    }
  }

  function submitTyped() {
    const text = typed.trim();
    if (!text) return;
    setTyped("");
    setPhase("asking");
    submit(text, true);
  }

  function restart() {
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    try {
      recRef.current?.abort();
    } catch {
      /* nothing to abort */
    }
    stoppingRef.current = false;
    setPhase("idle");
    setPartIndex(0);
    setLines([]);
    setTurns([]);
    setEvents([]);
    setReport(null);
    setSignals(null);
    setAlert(null);
    setNotice(null);
    setUnmarked(null);
    setInterim("");
  }

  const answering = phase === "ready" || phase === "recording";
  const inExam = phase !== "idle" && phase !== "done" && phase !== "halted";

  return (
    <div className="mx-auto max-w-5xl px-8 py-10">
      <PageHeader
        icon={M.icon}
        accent={M.accent}
        glow={M.glow}
        title={M.name}
        tagline="A ten minute spoken level check, in the browser. The examiner asks, you answer out loud, and you get a CEFR band with the evidence behind it."
        status={M.status}
        agent={M.agent}
        right={
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-teal/30 bg-accent-teal/10 px-3 py-1.5 text-xs font-medium text-accent-teal">
            <Icon name="ShieldCheck" className="h-3.5 w-3.5" />
            Guardrails on
          </span>
        }
      />

      {/* Progress across the four parts */}
      <div className="mb-6 grid gap-2 sm:grid-cols-4">
        {PARTS.map((p, i) => {
          const done = turns.some((t) => t.partId === p.id);
          const active = inExam && i === partIndex;
          return (
            <div
              key={p.id}
              className={`rounded-xl border px-3 py-2.5 transition-colors ${
                active
                  ? "border-brand/40 bg-brand/10"
                  : done
                  ? "border-accent-teal/30 bg-accent-teal/[0.06]"
                  : "border-line bg-bg-soft/50"
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon
                  name={done ? "Check" : active ? "Mic" : "Circle"}
                  className={`h-3.5 w-3.5 ${active ? "text-brand-soft" : done ? "text-accent-teal" : "text-ink-faint"}`}
                />
                <span className={`text-xs font-semibold ${active || done ? "text-ink" : "text-ink-faint"}`}>{p.label}</span>
              </div>
              <div className="mt-1 text-[11px] leading-snug text-ink-faint">{p.focus}</div>
            </div>
          );
        })}
      </div>

      {/* Stage */}
      {phase !== "done" && (
        <Card glow={M.glow} className="p-6">
          {phase === "idle" && (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/15">
                <Icon name="Mic" className="h-7 w-7 text-brand-soft" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-ink">Ready when you are</h2>
                <p className="font-sans-force mx-auto mt-2 max-w-md text-sm text-ink-soft">
                  Four questions, spoken out loud. Answer in full sentences and take your time. Your browser needs
                  microphone permission, and you can type instead if you prefer.
                </p>
              </div>
              <Button onClick={startExam}>
                <Icon name="Play" className="h-4 w-4" />
                Start assessment
              </Button>
              {!micSupported && (
                <p className="text-xs text-accent-amber">
                  This browser has no speech recognition. Chrome or Edge give you the voice exam, everywhere else you can
                  type your answers and still get a band.
                </p>
              )}
            </div>
          )}

          {inExam && (
            <div>
              <div className="mb-4 flex items-center justify-between gap-3">
                <SectionLabel>
                  {part.label}, {part.focus}
                </SectionLabel>
                <span className="text-[11px] text-ink-faint">{part.hint}</span>
              </div>

              <p className="text-lg leading-relaxed text-ink">{part.prompt}</p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                {phase === "asking" && (
                  <span className="inline-flex items-center gap-2 text-sm text-ink-soft">
                    <Icon name="Volume2" className="h-4 w-4 animate-pulse text-brand-soft" />
                    Examiner speaking…
                  </span>
                )}

                {phase === "ready" && unmarked && (
                  <Button onClick={() => score(unmarked)}>
                    <Icon name="RotateCcw" className="h-4 w-4" />
                    Try marking again
                  </Button>
                )}

                {phase === "ready" && !unmarked && micSupported && (
                  <Button onClick={startRecording}>
                    <Icon name="Mic" className="h-4 w-4" />
                    Start speaking
                  </Button>
                )}

                {phase === "recording" && (
                  <Button onClick={stopRecording} className="!bg-accent-rose hover:!bg-accent-rose/80">
                    <Icon name="Square" className="h-3.5 w-3.5" />
                    Done speaking, {elapsed}s
                  </Button>
                )}

                {phase === "scoring" && (
                  <span className="inline-flex items-center gap-2 text-sm text-ink-soft">
                    <Icon name="Loader2" className="h-4 w-4 animate-spin text-brand-soft" />
                    The examiner is marking your answers…
                  </span>
                )}

                {answering && !unmarked && micSupported && (
                  <button onClick={() => setTyping((t) => !t)} className="text-xs text-ink-faint hover:text-ink-soft">
                    <Icon name="Keyboard" className="mr-1 inline h-3.5 w-3.5" />
                    {typing ? "Hide typing" : "Type instead"}
                  </button>
                )}

                <button onClick={restart} className="ml-auto text-xs text-ink-faint hover:text-ink-soft">
                  <Icon name="RotateCcw" className="mr-1 inline h-3.5 w-3.5" />
                  Start over
                </button>
              </div>

              {phase === "recording" && (
                <div className="mt-4 rounded-xl border border-brand/25 bg-brand/[0.06] p-4">
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-brand-soft">
                    <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-accent-rose" />
                    Listening
                  </div>
                  <p className="mt-2 min-h-[3rem] text-sm italic text-ink-soft">
                    {(finalRef.current + interim).trim() || "Start talking, your words appear here as you speak."}
                  </p>
                </div>
              )}

              {typing && answering && !unmarked && (
                <div className="mt-4">
                  <SectionLabel>Type your answer</SectionLabel>
                  <Card className="p-1">
                    <textarea
                      value={typed}
                      onChange={(e) => setTyped(e.target.value)}
                      placeholder="Write your answer in full sentences, as if you were speaking it."
                      className="h-28 w-full resize-none rounded-xl bg-transparent p-3 text-sm text-ink placeholder:text-ink-faint focus:outline-none"
                    />
                  </Card>
                  <div className="mt-2 flex items-center gap-3">
                    <Button variant="subtle" onClick={submitTyped} disabled={!typed.trim()}>
                      Submit answer
                    </Button>
                    <span className="text-[11px] text-ink-faint">
                      Typed answers are marked for language only, with no speaking pace.
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {phase === "halted" && (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-rose/15">
                <Icon name="LifeBuoy" className="h-6 w-6 text-accent-rose" />
              </div>
              <h2 className="text-lg font-semibold text-ink">The assessment was stopped</h2>
              <p className="font-sans-force mx-auto max-w-md text-sm text-ink-soft">
                Something you said should be heard by a person, not marked by software. Please talk to someone you trust,
                or contact ES World student support, who can help you find local support today. Nothing was scored.
              </p>
              <Button variant="subtle" onClick={restart}>
                <Icon name="RotateCcw" className="h-4 w-4" />
                Close and reset
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Guardrail alert */}
      {alert && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-accent-rose/30 bg-accent-rose/10 px-4 py-3 text-sm text-accent-rose animate-rise">
          <Icon name="ShieldAlert" className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <div className="font-semibold">Guardrail triggered, {alert.category.replace("_", " ")}</div>
            <div className="mt-0.5 text-[13px] opacity-90">{alert.reason}</div>
            <div className="mt-1 text-[11px] opacity-75">
              That turn was not marked and does not count against your band. The question was asked again.
            </div>
          </div>
        </div>
      )}

      {notice && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-accent-amber/30 bg-accent-amber/10 px-4 py-3 text-sm text-accent-amber">
          <Icon name="AlertTriangle" className="mt-0.5 h-4 w-4 shrink-0" />
          {notice}
        </div>
      )}

      {/* Transcript */}
      {lines.length > 0 && phase !== "done" && (
        <div className="mt-6">
          <SectionLabel>Transcript</SectionLabel>
          <Card className="p-4">
            <div ref={scrollRef} className="max-h-64 space-y-3 overflow-y-auto pr-1">
              {lines.map((l, i) => (
                <div key={i} className="text-sm">
                  <span className={`font-semibold ${l.who === "examiner" ? "text-brand-soft" : "text-ink"}`}>
                    {l.who === "examiner" ? "Examiner" : "You"}
                  </span>
                  <span className={`ml-2 ${l.flagged ? "text-accent-rose line-through opacity-70" : "text-ink-soft"}`}>
                    {l.text}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Report */}
      {phase === "done" && report && signals && (
        <div className="animate-rise space-y-5">
          {demo && (
            <div className="flex items-start gap-2 rounded-lg border border-accent-amber/30 bg-accent-amber/10 px-3 py-2 text-xs text-accent-amber">
              <Icon name="AlertTriangle" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Demo mode, scored offline from measured transcript signals. Add an ANTHROPIC_API_KEY for the live examiner.
            </div>
          )}

          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="subtle" onClick={restart}>
              <Icon name="RotateCcw" className="h-4 w-4" />
              Take it again
            </Button>
            <SaveToProgramme
              kind="Speaking assessment"
              title={`Speaking assessment, ${report.overallBand}`}
              getHtml={() => reportHtml(report, signals, events)}
            />
            <ExportMenu
              title={`Speaking assessment ${report.overallBand}`}
              html={() => reportHtml(report, signals, events)}
              rows={() => [
                ["Criterion", "Score", "Confidence", "Evidence", "Next step"],
                ...report.criteria.map((c) => [c.name, c.score, c.confidence, c.evidence, c.nextStep]),
              ]}
            />
          </div>

          <Card glow={M.glow} className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <SectionLabel>Result</SectionLabel>
                <div className="flex items-end gap-3">
                  <span className="text-5xl font-semibold leading-none text-ink">{report.overallBand}</span>
                  <span className="pb-1 text-lg text-ink-soft">{report.overallScore}/10</span>
                </div>
                <div className="mt-2 text-sm text-ink-soft">{report.ieltsEstimate}</div>
              </div>
              <ConfidenceBadge level={report.confidence} />
            </div>
            <p className="font-sans-force mt-4 text-[15px] leading-relaxed text-ink">{report.summary}</p>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2">
            {report.criteria.map((c, i) => (
              <Card key={i} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-semibold text-ink">{c.name}</h3>
                  <span className="shrink-0 rounded-md border border-line bg-bg-hover px-2 py-0.5 text-xs font-semibold text-ink">
                    {c.score}/10
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-bg-hover">
                  <div className="h-full rounded-full bg-brand" style={{ width: `${Math.max(0, Math.min(100, c.score * 10))}%` }} />
                </div>
                <p className="mt-3 text-sm text-ink-soft">{c.evidence}</p>
                <div className="mt-3 flex items-start gap-2 rounded-lg border border-line bg-bg-soft/50 p-2.5">
                  <Icon name="ArrowRight" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-soft" />
                  <span className="text-[13px] text-ink-soft">{c.nextStep}</span>
                </div>
                <div className="mt-2">
                  <ConfidenceBadge level={c.confidence} />
                </div>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="p-5">
              <SectionLabel>What went well</SectionLabel>
              <ul className="space-y-1.5">
                {report.strengths.map((s, i) => (
                  <li key={i} className="flex gap-2 text-sm text-ink-soft">
                    <Icon name="Check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-teal" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="p-5">
              <SectionLabel>What to work on</SectionLabel>
              <ul className="space-y-1.5">
                {report.improvements.map((s, i) => (
                  <li key={i} className="flex gap-2 text-sm text-ink-soft">
                    <Icon name="ArrowUpRight" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-amber" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="p-5">
              <SectionLabel>Vocabulary upgrades</SectionLabel>
              <div className="space-y-2">
                {report.vocabularyUpgrades.map((v, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-lg border border-line bg-bg-soft/50 px-3 py-2 text-sm">
                    <span className="text-ink-faint line-through">{v.said}</span>
                    <Icon name="ArrowRight" className="h-3.5 w-3.5 shrink-0 text-brand-soft" />
                    <span className="text-ink">{v.better}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card glow={M.glow} className="p-5">
              <SectionLabel>Recommended next course</SectionLabel>
              <div className="flex items-start gap-3">
                <Icon name="GraduationCap" className="mt-0.5 h-5 w-5 shrink-0 text-brand-soft" />
                <div>
                  <div className="font-semibold text-ink">{report.recommendedCourse.name}</div>
                  <p className="mt-1 text-sm text-ink-soft">{report.recommendedCourse.why}</p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-5">
            <SectionLabel>Measured signals</SectionLabel>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {[
                { k: "Words", v: String(signals.totalWords) },
                { k: "Per answer", v: String(signals.avgWordsPerAnswer) },
                { k: "Words / min", v: signals.wordsPerMinute ? String(signals.wordsPerMinute) : "n/a" },
                { k: "Variety", v: `${Math.round(signals.lexicalVariety * 100)}%` },
                { k: "Linkers", v: String(signals.linkerCount) },
              ].map((s) => (
                <div key={s.k} className="rounded-xl border border-line bg-bg-soft/50 p-3">
                  <div className="text-lg font-semibold text-ink">{s.v}</div>
                  <div className="text-[11px] uppercase tracking-wider text-ink-faint">{s.k}</div>
                </div>
              ))}
            </div>
            <ul className="mt-4 space-y-1.5">
              {report.caveats.map((c, i) => (
                <li key={i} className="flex gap-2 text-[13px] text-ink-faint">
                  <Icon name="AlertTriangle" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </Card>

          {events.length > 0 && (
            <Card className="p-5">
              <SectionLabel>Guardrail log</SectionLabel>
              <div className="space-y-2">
                {events.map((e, i) => (
                  <div key={i} className="flex items-start gap-2 rounded-lg border border-line bg-bg-soft/50 px-3 py-2 text-[13px]">
                    <Icon name="ShieldCheck" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-teal" />
                    <span className="text-ink-soft">
                      <span className="font-medium text-ink">{e.category.replace("_", " ")}</span>, {e.reason}
                    </span>
                    <span className="ml-auto shrink-0 text-ink-faint">{e.at}</span>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-[11px] text-ink-faint">
                Blocked turns were never marked. The log is here so a teacher can see what happened.
              </p>
            </Card>
          )}

          <Card className="p-5">
            <SectionLabel>Full transcript</SectionLabel>
            <div className="max-h-64 space-y-3 overflow-y-auto pr-1">
              {lines.map((l, i) => (
                <div key={i} className="text-sm">
                  <span className={`font-semibold ${l.who === "examiner" ? "text-brand-soft" : "text-ink"}`}>
                    {l.who === "examiner" ? "Examiner" : "You"}
                  </span>
                  <span className={`ml-2 ${l.flagged ? "text-accent-rose line-through opacity-70" : "text-ink-soft"}`}>
                    {l.text}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
