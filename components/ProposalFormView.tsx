import { PROPOSAL_FORM_LAYOUT, type ProposalForm } from "@/lib/proposalForm";

/** Renders the official ES World Product Proposal Form in section order —
 *  used by the Proposal generator and by Flow/Think Lab for new products. */
export function ProposalFormView({ f }: { f: ProposalForm }) {
  return (
    <div className="space-y-4">
      <div className="border-b border-line pb-2">
        <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-soft">ES World · Product Proposal Form</div>
        <h2 className="mt-1 text-lg font-bold text-ink">{f.title}</h2>
      </div>

      {PROPOSAL_FORM_LAYOUT.map((grp) => (
        <div key={grp.section}>
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-faint">{grp.section}</div>
          <div className="grid gap-2 sm:grid-cols-2">
            {grp.fields.map((fl) => {
              const v = f[fl.key];
              return (
                <div key={String(fl.key)} className="rounded-lg border border-line bg-bg-soft/50 p-2.5">
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-ink-faint">{fl.label}</div>
                  <div className="mt-0.5 whitespace-pre-line text-sm text-ink-soft">{Array.isArray(v) ? v.join(", ") : String(v ?? "[TBC]")}</div>
                </div>
              );
            })}
          </div>
          {grp.section.startsWith("3.") && f.learningOutcomes?.length ? (
            <div className="mt-2 rounded-lg border border-line bg-bg-soft/50 p-2.5">
              <div className="text-[10px] font-semibold uppercase tracking-wide text-ink-faint">Learning outcomes</div>
              <ul className="mt-1 space-y-0.5">
                {f.learningOutcomes.map((o, i) => (
                  <li key={i} className="text-sm text-ink-soft">• {o}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ))}

      <div>
        <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-faint">8. Risk &amp; mitigation</div>
        <div className="space-y-1.5">
          {f.risks?.map((r, i) => (
            <div key={i} className="rounded-lg border border-line bg-bg-soft/50 p-2.5">
              <div className="text-sm font-medium text-ink">{r.risk}</div>
              <div className="text-xs text-ink-soft">Mitigation: {r.mitigation}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-accent-teal/25 bg-accent-teal/10 p-3">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-accent-teal">9–10 · Approval & recommended decision</div>
        <p className="mt-1 text-sm text-ink">{f.recommendation}</p>
      </div>
    </div>
  );
}
