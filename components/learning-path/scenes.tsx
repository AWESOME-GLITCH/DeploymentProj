"use client";

// Animated concept scenes for the input phase. Simple but clear: one idea per
// shot, the target language shown on screen, everything else neutral.
// Animation handles time, quantity, availability and word order.

import type { ReactNode } from "react";

export type SceneSpec =
  | { type: "counter"; item?: "coffee" | "tea" | "water" | "latte"; count?: number; size?: "large"; bubble?: string; who?: "me" | "them"; mood?: "happy" | "sorry" | "neutral"; empty?: boolean }
  | { type: "stress"; words: { word: string; syllables: string[]; stressed: number }[] }
  | { type: "count"; emoji: string; count: number; label: string; uncountable?: boolean }
  | { type: "timeline"; position: "past" | "present" | "future"; verb: string; label: string; all?: boolean }
  | { type: "chat"; bubbles: { who: "me" | "them"; text: string }[] }
  | { type: "letter"; title: string; lines: string[]; highlight?: number[] }
  | { type: "person"; emoji: string; name: string; facts: { icon: string; text: string }[]; show: number }
  | { type: "card"; text: string; emoji?: string };

const ITEM_EMOJI = { coffee: "☕", tea: "🍵", water: "💧", latte: "🥛" } as const;

function Bubble({ text, side, tone }: { text: string; side: "left" | "right"; tone?: "sorry" }) {
  return (
    <div className={`lp-scene-bubble ${side === "right" ? "lp-scene-bubble-right" : ""}`} style={tone === "sorry" ? { borderColor: "var(--lp-sand)" } : undefined}>
      {text.split(/(I'd like|Could I have|instead|out of|please|That's fine)/).map((part, i) => /I'd like|Could I have|instead|out of|please|That's fine/.test(part) ? <span key={i} className="lp-target">{part}</span> : <span key={i}>{part}</span>)}
    </div>
  );
}

export function Scene({ spec }: { spec?: SceneSpec }) {
  if (!spec) return <div className="lp-scene-wrap" />;
  switch (spec.type) {
    case "counter": {
      const n = spec.count ?? 0;
      return (
        <div className="lp-scene-wrap">
          <div className="lp-scene-floor" />
          <div className="lp-scene-char" style={{ left: 22 }}><span>👩🏽</span><small>Leo</small></div>
          <div className="lp-scene-char" style={{ right: 22 }}><span>🧑</span><small>You</small></div>
          <div className="lp-scene-counter">
            {spec.empty ? <div className="lp-scene-empty lp-anim-pop">🥛<i /></div> : null}
            {Array.from({ length: n }).map((_, i) => (
              <span key={i} className="lp-anim-pop" style={{ animationDelay: `${0.25 + i * 0.3}s`, fontSize: spec.size === "large" ? 44 : 32 }}>{ITEM_EMOJI[spec.item ?? "coffee"]}</span>
            ))}
          </div>
          {spec.bubble ? <Bubble text={spec.bubble} side={spec.who === "them" ? "left" : "right"} tone={spec.mood === "sorry" ? "sorry" : undefined} /> : null}
          {spec.mood === "happy" ? <div className="lp-scene-react lp-anim-pop" style={{ animationDelay: "0.9s" }}>😊</div> : null}
          {spec.mood === "sorry" ? <div className="lp-scene-react lp-anim-pop" style={{ animationDelay: "0.6s" }}>🙏</div> : null}
        </div>
      );
    }
    case "stress":
      return (
        <div className="lp-scene-wrap lp-scene-center" style={{ gap: 18 }}>
          {spec.words.map((w, wi) => (
            <div key={w.word} className="lp-stress-word lp-anim-rise" style={{ animationDelay: `${wi * 0.6}s` }}>
              <div className="flex items-end justify-center gap-2" style={{ height: 70 }}>
                {w.syllables.map((s, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className="lp-stress-bar" style={{ height: i === w.stressed ? 56 : 22, background: i === w.stressed ? "var(--lp-glow)" : "var(--lp-fog)", animationDelay: `${wi * 0.6 + 0.2 + i * 0.15}s` }} />
                    <span className={i === w.stressed ? "lp-target" : ""} style={{ fontSize: i === w.stressed ? 26 : 18, fontWeight: i === w.stressed ? 700 : 500 }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    case "count":
      return (
        <div className="lp-scene-wrap lp-scene-center">
          <div className="flex items-end justify-center gap-2" style={{ minHeight: 70 }}>
            {spec.uncountable ? (
              <div className="lp-pour"><div className="lp-pour-glass"><div className="lp-pour-fill" /></div><span style={{ fontSize: 34 }}>{spec.emoji}</span></div>
            ) : Array.from({ length: spec.count }).map((_, i) => <span key={i} className="lp-anim-pop" style={{ fontSize: 44, animationDelay: `${0.3 + i * 0.35}s` }}>{spec.emoji}</span>)}
          </div>
          <div className="lp-lesson mt-3 lp-anim-rise" style={{ animationDelay: "0.9s" }}>
            {spec.uncountable ? <><span className="lp-target">some</span> {spec.label}</> : <>{spec.count === 1 ? "a" : <span className="lp-target">{["", "one", "two", "three", "four", "five"][spec.count]}</span>} {spec.label}{spec.count > 1 ? <span className="lp-target lp-anim-pop" style={{ animationDelay: "1.1s", display: "inline-block" }}>s</span> : null}</>}
          </div>
        </div>
      );
    case "timeline": {
      const pos = spec.position === "past" ? 14 : spec.position === "present" ? 50 : 86;
      return (
        <div className="lp-scene-wrap lp-scene-center">
          <div className="lp-timeline">
            <div className="lp-timeline-line" />
            {[["past", "⏮️", "yesterday"], ["present", "📍", "today"], ["future", "⏭️", "tomorrow"]].map(([k, e, l], i) => (
              <div key={k} className="lp-timeline-stop" style={{ left: `${14 + i * 36}%`, opacity: spec.all || k === spec.position ? 1 : 0.45 }}><span>{e}</span><small>{l}</small></div>
            ))}
            <div className="lp-timeline-marker" style={{ left: `${pos}%` }} />
          </div>
          <div className="lp-lesson mt-2 lp-anim-rise" style={{ animationDelay: "0.5s" }}>{spec.label} I <span className="lp-target">{spec.verb}</span></div>
        </div>
      );
    }
    case "chat":
      return (
        <div className="lp-scene-wrap lp-scene-center" style={{ justifyContent: "flex-start", paddingTop: 18 }}>
          <div className="lp-phone">
            {spec.bubbles.map((b, i) => (
              <div key={i} className={`lp-chat ${b.who === "me" ? "lp-chat-me" : ""} lp-anim-rise`} style={{ animationDelay: `${0.2 + i * 0.7}s` }}>{b.text}</div>
            ))}
          </div>
        </div>
      );
    case "letter":
      return (
        <div className="lp-scene-wrap lp-scene-center">
          <div className="lp-letter lp-anim-rise">
            <div className="lp-letter-title">{spec.title}</div>
            {spec.lines.map((l, i) => (
              <div key={i} className={`lp-letter-line ${spec.highlight?.includes(i) ? "lp-letter-hi" : ""}`} style={{ animationDelay: `${0.4 + i * 0.25}s` }}>{l}</div>
            ))}
          </div>
        </div>
      );
    case "person":
      return (
        <div className="lp-scene-wrap lp-scene-center" style={{ gap: 10 }}>
          <div style={{ fontSize: 64 }} className="lp-anim-pop">{spec.emoji}</div>
          <div className="lp-body" style={{ fontWeight: 600 }}>{spec.name}</div>
          <div className="flex flex-col gap-1.5">
            {spec.facts.slice(0, spec.show).map((f, i) => (
              <div key={i} className="lp-fact lp-anim-rise" style={{ animationDelay: `${0.3 + i * 0.3}s` }}><span>{f.icon}</span><span>{f.text}</span></div>
            ))}
          </div>
        </div>
      );
    case "card":
      return (
        <div className="lp-scene-wrap lp-scene-center">
          {spec.emoji ? <div style={{ fontSize: 56 }} className="lp-anim-pop">{spec.emoji}</div> : null}
          <div className="lp-lesson mt-2 text-center lp-anim-rise" style={{ animationDelay: "0.3s", maxWidth: 260 }}>{spec.text}</div>
        </div>
      );
  }
}

/** Storyboards: one scene per caption line of each video atom. */
export const SCENES: Record<string, SceneSpec[]> = {
  "ATM-A2-INT-0001": [
    { type: "card", text: "Monday morning. Shoreditch.", emoji: "🏙️" },
    { type: "counter", item: "coffee", count: 1, bubble: "I'd like a coffee, please.", who: "me", mood: "happy" },
    { type: "counter", item: "coffee", count: 2, bubble: "I'd like two coffees, please.", who: "me", mood: "happy" },
    { type: "counter", item: "tea", count: 1, bubble: "Could I have a tea?", who: "me", mood: "happy" },
    { type: "card", text: "I want → I'd like", emoji: "🙂" },
    { type: "counter", item: "coffee", count: 1, bubble: "I'd like a coffee, please.", who: "me" },
    { type: "card", text: "I'd like ... please.", emoji: "☕" },
  ],
  "ATM-A2-LST-0004": [
    { type: "card", text: "Dubai Metro, Friday evening.", emoji: "🚇" },
    { type: "stress", words: [{ word: "fourteen", syllables: ["four", "TEEN"], stressed: 1 }] },
    { type: "stress", words: [{ word: "four", syllables: ["FOUR"], stressed: 0 }] },
    { type: "stress", words: [{ word: "forty", syllables: ["FOR", "ty"], stressed: 0 }] },
    { type: "stress", words: [{ word: "fourteen", syllables: ["four", "TEEN"], stressed: 1 }, { word: "forty", syllables: ["FOR", "ty"], stressed: 0 }] },
    { type: "stress", words: [{ word: "fourteen", syllables: ["four", "TEEN"], stressed: 1 }, { word: "forty", syllables: ["FOR", "ty"], stressed: 0 }] },
    { type: "stress", words: [{ word: "thirteen", syllables: ["thir", "TEEN"], stressed: 1 }, { word: "thirty", syllables: ["THIR", "ty"], stressed: 0 }] },
  ],
  "ATM-A1-SPK-0005": [
    { type: "person", emoji: "🧕", name: "Fatima", facts: [{ icon: "👋", text: "I'm Fatima." }, { icon: "📍", text: "I live in Dubai." }, { icon: "🏪", text: "I work in a shop." }, { icon: "🍵", text: "I like tea." }], show: 1 },
    { type: "person", emoji: "🧕", name: "Fatima", facts: [{ icon: "👋", text: "I'm Fatima." }, { icon: "📍", text: "I live in Dubai." }, { icon: "🏪", text: "I work in a shop." }, { icon: "🍵", text: "I like tea." }], show: 2 },
    { type: "person", emoji: "🧕", name: "Fatima", facts: [{ icon: "👋", text: "I'm Fatima." }, { icon: "📍", text: "I live in Dubai." }, { icon: "🏪", text: "I work in a shop." }, { icon: "🍵", text: "I like tea." }], show: 3 },
    { type: "person", emoji: "🧕", name: "Fatima", facts: [{ icon: "👋", text: "I'm Fatima." }, { icon: "📍", text: "I live in Dubai." }, { icon: "🏪", text: "I work in a shop." }, { icon: "🍵", text: "I like tea, not coffee." }], show: 4 },
    { type: "card", text: "I'm ... I live in ... I work in ...", emoji: "🙋" },
    { type: "person", emoji: "🧑", name: "You", facts: [{ icon: "📍", text: "I live in ..." }, { icon: "💼", text: "I work in ..." }], show: 2 },
    { type: "card", text: "Three sentences. That is you.", emoji: "✨" },
  ],
  "ATM-A2-MED-0008": [
    { type: "card", text: "Sami has a letter. He cannot read it.", emoji: "✉️" },
    { type: "letter", title: "GAS BILL", lines: ["Pay by 30 May", "Pay online or at the shop", "Reference 4471"], highlight: [] },
    { type: "letter", title: "GAS BILL", lines: ["Pay by 30 May", "Pay online or at the shop", "Reference 4471"], highlight: [0] },
    { type: "letter", title: "GAS BILL", lines: ["Pay by 30 May", "Pay online or at the shop", "Reference 4471"], highlight: [1] },
    { type: "letter", title: "GAS BILL", lines: ["Pay by 30 May", "Pay online or at the shop", "Reference 4471"], highlight: [2] },
    { type: "card", text: "When. How. The number.", emoji: "3️⃣" },
    { type: "letter", title: "GAS BILL", lines: ["Pay by 30 May", "Pay online or at the shop", "Reference 4471"], highlight: [0, 1, 2] },
  ],
  "ATM-A2-INT-0009": [
    { type: "counter", item: "latte", count: 1, bubble: "A latte with oat milk, please.", who: "me" },
    { type: "counter", empty: true, bubble: "Sorry, we're out of oat milk.", who: "them", mood: "sorry" },
    { type: "counter", bubble: "Do you have soy milk instead?", who: "me" },
    { type: "counter", item: "latte", count: 1, bubble: "Yes, we do.", who: "them", mood: "happy" },
    { type: "counter", item: "latte", count: 1, bubble: "That's fine, thank you.", who: "me", mood: "happy" },
    { type: "card", text: "out of = none left · instead = in its place", emoji: "🔁" },
    { type: "counter", bubble: "Do you have soy milk instead?", who: "me" },
    { type: "card", text: "Do you have ... instead? That's fine.", emoji: "🥛" },
  ],
  "ATM-A2-GRM-0003": [
    { type: "timeline", position: "past", verb: "worked", label: "Yesterday" },
    { type: "timeline", position: "present", verb: "work", label: "Today" },
    { type: "timeline", position: "future", verb: "will work", label: "Tomorrow" },
    { type: "card", text: "Past: + ed · Future: will +", emoji: "🕰️" },
    { type: "timeline", position: "present", verb: "worked · work · will work", label: "", all: true },
    { type: "timeline", position: "present", verb: "worked · work · will work", label: "", all: true },
  ],
};

export function sceneFor(atomId: string, lineIdx: number): SceneSpec | undefined {
  return SCENES[atomId]?.[lineIdx];
}

export function SceneFrame({ children }: { children: ReactNode }) {
  return <div className="lp-scene-wrap">{children}</div>;
}
