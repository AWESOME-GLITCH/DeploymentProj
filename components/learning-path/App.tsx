"use client";

// Learning Path prototype shell: a phone-sized frame (375 x 812 reference)
// that fills the screen on a real phone, plus a tester panel beside it on
// wide screens. Provides language, audio and navigation to every screen.

import { useCallback, useEffect, useMemo, useState } from "react";
import { FlaskConical, Home as HomeIcon, Route, TrendingUp, User, Users } from "lucide-react";
import { composeSession, dayIndex, now as engineNow } from "@/lib/learning-path/engine";
import { isRtl, makeT, tapToTranslate, uiLanguage } from "@/lib/learning-path/i18n";
import { say as tts } from "@/lib/learning-path/speech";
import { StoreProvider, useStore } from "@/lib/learning-path/store";
import { Capsule } from "./Capsule";
import { Classmates } from "./Classmates";
import { Home } from "./Home";
import { Me } from "./Me";
import { Onboarding, Reward } from "./Onboarding";
import { Progress } from "./Progress";
import { Checkpoint, Road } from "./Road";
import { Tester } from "./Tester";
import { LpContext, type LpCtx, type Screen } from "./ui";

export function LearningPathApp() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  );
}

function Shell() {
  const { state, dispatch, hydrated } = useStore();
  const [screen, setScreen] = useState<Screen>("home");
  const [firstRun, setFirstRun] = useState(false);
  const [testerOpen, setTesterOpen] = useState(false);
  const [wide, setWide] = useState(false);
  const [systemDark, setSystemDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("lp-active");
    document.body.classList.add("lp-active");
    window.scrollTo(0, 0);
    return () => { document.documentElement.classList.remove("lp-active"); document.body.classList.remove("lp-active"); };
  }, []);

  useEffect(() => {
    // System theme: an explicit data-theme on the document root (a host's toggle) wins, else the OS setting.
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const host = document.documentElement.getAttribute("data-theme");
      setSystemDark(host === "dark" ? true : host === "light" ? false : mq.matches);
    };
    apply();
    mq.addEventListener("change", apply);
    const mo = new MutationObserver(apply);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => { mq.removeEventListener("change", apply); mo.disconnect(); };
  }, []);

  useEffect(() => {
    const check = () => setWide(window.innerWidth >= 900);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!state.learner.onboarded) setScreen(state.learner.placement_done ? "home" : "onboarding");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  const level = state.learner.confirmed_sublevel ?? state.learner.provisional_sublevel;
  const lang = uiLanguage(state.learner.l1, level, state.learner.l1_override);
  const t = useMemo(() => makeT(lang), [lang]);
  const speed = state.learner.audio_speed;
  const say = useCallback((text: string, onEnd?: () => void) => tts(text, speed, onEnd), [speed]);
  const go = useCallback((s: Screen) => setScreen(s), []);

  const ctx: LpCtx = useMemo(() => ({
    t, lang, l1: state.learner.l1, rtl: isRtl(lang), translate: tapToTranslate(state.learner.l1, level, state.learner.l1_override),
    say, speed, reduceMotion: state.learner.reduce_motion, go, tester: true,
  }), [t, lang, state.learner.l1, level, state.learner.l1_override, say, speed, state.learner.reduce_motion, go]);

  const startSession = useCallback((second = false) => {
    const at = engineNow(state);
    if (state.current && !state.current.completed && state.current.session.day === dayIndex(state, at) && !second) { setScreen("session"); return; }
    dispatch({ type: "ensure_week" });
    const session = composeSession(state, at, { second });
    dispatch({ type: "start_session", session });
    setFirstRun(false);
    setScreen("session");
  }, [state, dispatch]);

  const onPlaced = () => {
    const at = engineNow(state);
    const session = composeSession(state, at, { first_run: true });
    dispatch({ type: "start_session", session });
    setFirstRun(true);
    setScreen("session");
  };

  const onSessionComplete = () => { if (firstRun) { setScreen("reward"); } else setScreen("home"); setFirstRun(false); };

  const nav = (["home", "road", "progress", "classmates", "me"] as Screen[]);
  const showNav = nav.includes(screen);
  const scale = state.learner.text_scale;
  const theme = state.learner.theme === "auto" ? (systemDark ? "dark" : "light") : state.learner.theme;

  const phone = (
    <div className="lp-root relative flex h-full w-full flex-col overflow-hidden" dir={ctx.rtl ? "rtl" : "ltr"} data-theme={theme} data-reduce-motion={state.learner.reduce_motion ? "true" : "false"} style={{ ["--lp-scale" as string]: String(scale) }}>
      {!hydrated ? null : (
        <>
          <div className="min-h-0 flex-1">
            {screen === "onboarding" ? <Onboarding onPlaced={onPlaced} /> : null}
            {screen === "reward" ? <Reward onDone={() => setScreen("home")} /> : null}
            {screen === "home" ? <Home onStart={() => startSession(false)} onSecond={() => startSession(true)} /> : null}
            {screen === "road" ? <Road onCheckpoint={() => setScreen("checkpoint")} /> : null}
            {screen === "progress" ? <Progress /> : null}
            {screen === "classmates" ? <Classmates /> : null}
            {screen === "me" ? <Me /> : null}
            {screen === "checkpoint" ? <Checkpoint onDone={() => setScreen("road")} /> : null}
            {screen === "session" ? (state.current ? <Capsule onExit={() => setScreen("home")} onComplete={onSessionComplete} /> : <Home onStart={() => startSession(false)} onSecond={() => startSession(true)} />) : null}
          </div>
          {showNav ? (
            <nav className="lp-nav">
              {nav.map((s) => {
                const Icon = s === "home" ? HomeIcon : s === "road" ? Route : s === "progress" ? TrendingUp : s === "classmates" ? Users : User;
                return (
                  <button key={s} type="button" data-active={screen === s} onClick={() => setScreen(s)} aria-label={t(s === "home" ? "today" : s)}>
                    <Icon size={20} /><span>{t(s === "home" ? "today" : s)}</span>
                  </button>
                );
              })}
            </nav>
          ) : null}
        </>
      )}
      {!wide ? (
        <button type="button" onClick={() => setTesterOpen(true)} className="absolute z-20 flex items-center justify-center" style={{ right: 0, top: "46%", width: 34, height: 44, borderRadius: "12px 0 0 12px", background: "var(--lp-glass-strong)", border: "1px solid var(--lp-line-strong)", borderRight: "none", color: "var(--lp-glow)", backdropFilter: "blur(10px)" }} aria-label="Tester">
          <FlaskConical size={16} />
        </button>
      ) : null}
      {!wide && testerOpen ? (
        <div className="absolute inset-0 z-30 flex flex-col justify-end" style={{ background: "rgba(0,0,0,0.5)" }} onClick={() => setTesterOpen(false)}>
          <div className="h-[78%] rounded-t-3xl" style={{ background: "#0e161d", border: "1px solid var(--lp-track)" }} onClick={(e) => e.stopPropagation()}>
            <Tester screen={screen} go={(s) => { setScreen(s); setTesterOpen(false); }} startSession={(sec) => { startSession(sec); setTesterOpen(false); }} onClose={() => setTesterOpen(false)} />
          </div>
        </div>
      ) : null}
    </div>
  );

  return (
    <LpContext.Provider value={ctx}>
      {wide ? (
        <div className="flex h-full w-full items-center justify-center gap-8 px-6" style={{ background: "radial-gradient(900px 600px at 30% 40%, #13232c, #090f14 70%)" }}>
          <div className="flex flex-col items-center gap-3">
            <div className="overflow-hidden" style={{ width: 375, height: 812, borderRadius: 44, border: "10px solid #1b242b", boxShadow: "0 40px 100px -30px rgba(0,0,0,0.9), inset 0 0 0 1px var(--lp-well)" }}>
              {phone}
            </div>
            <div className="text-[11px] uppercase tracking-[0.18em]" style={{ color: "#6f7c84" }}>375 × 812 · Learning Path prototype</div>
          </div>
          <div className="h-[812px] w-[440px] overflow-hidden rounded-2xl" style={{ background: "#0e161d", border: "1px solid var(--lp-track)" }}>
            <Tester screen={screen} go={setScreen} startSession={startSession} />
          </div>
        </div>
      ) : (
        <div className="h-full w-full">{phone}</div>
      )}
    </LpContext.Provider>
  );
}
