import type { Flyer } from "@/lib/flyer";
import { Icon } from "./Icon";

/** Canonical ES World flyer layout — used by both Flow and the Marketing module
 *  so every flyer follows the same template. */
export function FlyerView({ f }: { f: Flyer }) {
  return (
    <div className="space-y-4">
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-soft">{f.courseName}</div>
        <h2 className="mt-1 text-xl font-bold text-ink">{f.headline}</h2>
        {f.subheadline && <p className="mt-1 text-sm text-ink-soft">{f.subheadline}</p>}
      </div>

      {f.keyFacts?.length ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {f.keyFacts.map((k, i) => (
            <div key={i} className="rounded-lg border border-line bg-bg-soft/50 px-2.5 py-1.5">
              <div className="text-[10px] font-semibold uppercase tracking-wide text-ink-faint">{k.label}</div>
              <div className="text-sm text-ink">{k.value}</div>
            </div>
          ))}
        </div>
      ) : null}

      {f.included?.length ? (
        <FlyerList title="What's included" items={f.included} accent="text-accent-teal" icon="Check" />
      ) : null}
      {f.benefits?.length ? (
        <FlyerList title="Why choose" items={f.benefits} accent="text-brand-soft" icon="Sparkles" />
      ) : null}

      <div className="grid gap-2 sm:grid-cols-2">
        {f.audience && (
          <div className="rounded-lg border border-line bg-bg-soft/50 p-2.5">
            <div className="text-[10px] font-semibold uppercase tracking-wide text-ink-faint">Who it's for</div>
            <div className="text-sm text-ink-soft">{f.audience}</div>
          </div>
        )}
        {f.accreditations?.length ? (
          <div className="rounded-lg border border-line bg-bg-soft/50 p-2.5">
            <div className="text-[10px] font-semibold uppercase tracking-wide text-ink-faint">Accreditation</div>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {f.accreditations.map((a, i) => (
                <span key={i} className="rounded-full border border-brand/25 bg-brand/10 px-2 py-0.5 text-[11px] text-brand-soft">{a}</span>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {f.offer && (
        <div className="rounded-lg border border-accent-amber/30 bg-accent-amber/10 px-3 py-2 text-sm text-accent-amber">
          <span className="font-semibold">Offer:</span> {f.offer}
        </div>
      )}

      <div className="rounded-xl border border-brand/25 bg-brand/10 p-3">
        <div className="text-sm font-semibold text-ink">{f.cta}</div>
        <div className="mt-0.5 text-xs text-ink-soft">{f.contact}</div>
      </div>
      <div className="text-center text-sm font-semibold text-brand-soft">{f.motif}</div>
    </div>
  );
}

function FlyerList({ title, items, accent, icon }: { title: string; items: string[]; accent: string; icon: string }) {
  return (
    <div>
      <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-faint">{title}</div>
      <ul className="space-y-1">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2 text-sm text-ink-soft">
            <Icon name={icon} className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${accent}`} />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
