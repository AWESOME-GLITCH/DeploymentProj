"use client";

// Classmates: see who is here, send a challenge. No messaging surface exists.
// A challenge is a same-level 5-item sprint; the result is private to both.

import { useMemo, useState } from "react";
import { ITEMS } from "@/lib/learning-path/content";
import { useNow, useStore } from "@/lib/learning-path/store";
import { ItemRenderer, type ItemResult } from "./items";
import { Avatar, GlowButton, Pill, useLp } from "./ui";

const PEOPLE = [
  { name: "Fatima", emoji: "🧕", city: "Dubai" }, { name: "Arjun", emoji: "🧑🏽‍💼", city: "Dubai" }, { name: "Elena", emoji: "👩🏻‍🎓", city: "London" },
  { name: "Yusuf", emoji: "👨🏽‍💻", city: "Riyadh" }, { name: "Ana", emoji: "👩🏾‍🍳", city: "London" }, { name: "Olena", emoji: "👩🏼‍⚕️", city: "London" },
];

export function Classmates() {
  const { state, dispatch } = useStore();
  const { t } = useLp();
  const now = useNow();
  const slot = Math.floor(now / 900_000);
  const online = PEOPLE.filter((_, i) => (slot + i) % 3 !== 0);
  const [challenge, setChallenge] = useState<{ with: string; items: string[]; idx: number; mine: number; last: boolean | null } | null>(null);
  const pool = useMemo(() => {
    const known = Object.values(state.items).filter((m) => m.state !== "new").map((m) => m.item_id);
    const list = ITEMS.filter((i) => ["gap_fill", "pick_picture", "tfng", "detail_gap", "gist_mcq", "inference_mcq", "tap_order"].includes(i.item_type) && known.includes(i.item_id));
    return (list.length >= 5 ? list : ITEMS.filter((i) => ["gap_fill", "pick_picture", "tfng"].includes(i.item_type))).slice(0, 12);
  }, [state.items]);

  const start = (name: string) => {
    const items = [...pool].sort(() => Math.random() - 0.5).slice(0, 5).map((i) => i.item_id);
    setChallenge({ with: name, items, idx: 0, mine: 0, last: null });
    dispatch({ type: "event", name: "challenge_sent", data: { with: name } });
  };

  if (challenge) {
    const done = challenge.idx >= challenge.items.length;
    if (done) {
      const theirs = 2 + ((slot + challenge.with.length) % 4);
      return (
        <div className="flex h-full flex-col items-center justify-center px-5 text-center">
          <div className="lp-eyebrow mb-3">{t("challenge_result")}</div>
          <div className="flex items-center gap-8">
            <div><div className="lp-head">{challenge.mine}</div><div className="lp-small" style={{ color: "var(--lp-paper-faint)" }}>{t("you")}</div></div>
            <div className="lp-small" style={{ color: "var(--lp-paper-faint)" }}>/ 5</div>
            <div><div className="lp-head">{theirs}</div><div className="lp-small" style={{ color: "var(--lp-paper-faint)" }}>{challenge.with}</div></div>
          </div>
          <div className="mt-10 w-full"><GlowButton onClick={() => { dispatch({ type: "challenge", with: challenge.with, mine: challenge.mine, theirs }); setChallenge(null); }}>{t("done")}</GlowButton></div>
        </div>
      );
    }
    const item = ITEMS.find((i) => i.item_id === challenge.items[challenge.idx])!;
    const onAnswer = (r: ItemResult) => setChallenge((c) => c && { ...c, last: r.correct, mine: c.mine + (r.correct ? 1 : 0) });
    return (
      <div className="flex h-full flex-col px-5 pb-5 pt-4">
        <div className="mb-3 flex items-center justify-between"><div className="lp-eyebrow">{t("challenge")} · {challenge.with}</div><span className="lp-small tabular-nums" style={{ color: "var(--lp-paper-faint)" }}>{challenge.idx + 1} / 5</span></div>
        <div className="min-h-0 flex-1"><ItemRenderer key={item.item_id + challenge.idx} item={item} onAnswer={onAnswer} onNext={() => setChallenge((c) => c && { ...c, idx: c.idx + 1, last: null })} mode="challenge" /></div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col px-5 pb-4 pt-4">
      <div className="flex items-center justify-between">
        <div><div className="lp-eyebrow">{t("classmates")}</div><div className="lp-small" style={{ color: "var(--lp-paper-faint)" }}>{online.length} {t("online_now")}</div></div>
        <Pill>{state.learner.confirmed_sublevel ?? "A2.1"}</Pill>
      </div>
      {online.length ? (
        <div className="mt-5 grid grid-cols-2 gap-3">
          {online.slice(0, 8).map((p) => (
            <div key={p.name} className="lp-glass flex flex-col items-center gap-2 p-4">
              <Avatar emoji={p.emoji} name={`${p.name} · ${p.city}`} online />
              <GlowButton size="normal" secondary onClick={() => start(p.name)}>{t("challenge")}</GlowButton>
            </div>
          ))}
        </div>
      ) : (
        <div className="lp-body mt-10 text-center" style={{ color: "var(--lp-paper-soft)" }}>{t("no_one")}</div>
      )}
      {state.challenges.length ? <div className="lp-small mt-auto" style={{ color: "var(--lp-paper-faint)" }}>{state.challenges.length} challenges · last {state.challenges[state.challenges.length - 1].mine} / 5</div> : null}
    </div>
  );
}
