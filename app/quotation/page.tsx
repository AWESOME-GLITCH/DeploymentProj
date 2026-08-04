"use client";

import { useMemo, useState } from "react";
import { getModule } from "@/lib/modules";
import { PRODUCTS } from "@/lib/knowledge";
import { PageHeader } from "@/components/PageHeader";
import { Card, Button, SectionLabel } from "@/components/ui";
import { Icon } from "@/components/Icon";

const M = getModule("quotation")!;

type Line = { id: number; desc: string; qty: number; price: number };

const CURRENCIES: Record<string, string> = { AED: "AED", USD: "$", GBP: "£", EUR: "€" };

let nextId = 4;

function fmt(n: number, sym: string) {
  const v = n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  return sym.length > 1 ? `${sym} ${v}` : `${sym}${v}`;
}

export default function QuotationPage() {
  const [currency, setCurrency] = useState("AED");
  const [quoteNo, setQuoteNo] = useState("ESL-QT-001");
  const [date, setDate] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [client, setClient] = useState("");
  const [clientDetail, setClientDetail] = useState("");
  const [discount, setDiscount] = useState(0);
  const [vatIncluded, setVatIncluded] = useState(true);
  const [notes, setNotes] = useState(
    "Prices are per the terms above and valid until the date shown. Payment plans available on request."
  );
  const [lines, setLines] = useState<Line[]>([
    { id: 1, desc: "Tailor-Made General English (Dubai) — 10 lessons", qty: 10, price: 200 },
    { id: 2, desc: "Initial level assessment", qty: 1, price: 0 },
  ]);

  const sym = CURRENCIES[currency];
  const subtotal = useMemo(() => lines.reduce((s, l) => s + l.qty * l.price, 0), [lines]);
  const discountAmt = (subtotal * discount) / 100;
  const total = subtotal - discountAmt;
  // UAE VAT is 5% and is INCLUDED in ES World 2026 prices, so back it out for display.
  const vatPortion = vatIncluded ? total * (5 / 105) : 0;

  function update(id: number, patch: Partial<Line>) {
    setLines((ls) => ls.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }
  function remove(id: number) {
    setLines((ls) => ls.filter((l) => l.id !== id));
  }
  function addBlank() {
    setLines((ls) => [...ls, { id: nextId++, desc: "", qty: 1, price: 0 }]);
  }
  function addProduct(pid: string) {
    const p = PRODUCTS.find((x) => x.id === pid);
    if (!p) return;
    setLines((ls) => [...ls, { id: nextId++, desc: `${p.name} (${p.campus})`, qty: 1, price: 0 }]);
  }

  return (
    <div className="mx-auto max-w-6xl px-8 py-10">
      <div className="no-print">
        <PageHeader
          icon={M.icon}
          accent={M.accent}
          glow={M.glow}
          title={M.name}
          tagline="Build a branded ES World quotation — then print it or save as PDF."
          status={M.status}
          agent={M.agent}
          right={
            <Button onClick={() => window.print()}>
              <Icon name="Printer" className="h-4 w-4" />
              Print / Save PDF
            </Button>
          }
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Builder */}
        <div className="no-print space-y-4">
          <Card className="p-4">
            <SectionLabel>Quote details</SectionLabel>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Quote No." value={quoteNo} onChange={setQuoteNo} />
              <Select label="Currency" value={currency} onChange={setCurrency} options={Object.keys(CURRENCIES)} />
              <Input label="Date" value={date} onChange={setDate} placeholder="e.g. 4 Aug 2026" />
              <Input label="Valid until" value={validUntil} onChange={setValidUntil} placeholder="e.g. 31 Aug 2026" />
            </div>
          </Card>

          <Card className="p-4">
            <SectionLabel>Client</SectionLabel>
            <div className="space-y-3">
              <Input label="Name" value={client} onChange={setClient} placeholder="Student / company name" />
              <Input label="Email / phone / company" value={clientDetail} onChange={setClientDetail} placeholder="Contact details" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="mb-2 flex items-center justify-between">
              <SectionLabel>Line items</SectionLabel>
              <select
                onChange={(e) => {
                  if (e.target.value) addProduct(e.target.value);
                  e.target.value = "";
                }}
                className="rounded-lg border border-line bg-bg-soft px-2 py-1 text-xs text-ink-soft focus:outline-none"
                defaultValue=""
              >
                <option value="" className="bg-bg-soft">+ Add from catalogue</option>
                {PRODUCTS.map((p) => (
                  <option key={p.id} value={p.id} className="bg-bg-soft">
                    {p.name} · {p.campus}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              {lines.map((l) => (
                <div key={l.id} className="flex items-center gap-2">
                  <input
                    value={l.desc}
                    onChange={(e) => update(l.id, { desc: e.target.value })}
                    placeholder="Description"
                    className="min-w-0 flex-1 rounded-lg border border-line bg-bg-soft px-2.5 py-1.5 text-sm text-ink placeholder:text-ink-faint focus:border-brand/40 focus:outline-none"
                  />
                  <input
                    type="number"
                    value={l.qty}
                    onChange={(e) => update(l.id, { qty: Number(e.target.value) })}
                    className="w-14 rounded-lg border border-line bg-bg-soft px-2 py-1.5 text-center text-sm text-ink focus:border-brand/40 focus:outline-none"
                  />
                  <input
                    type="number"
                    value={l.price}
                    onChange={(e) => update(l.id, { price: Number(e.target.value) })}
                    className="w-24 rounded-lg border border-line bg-bg-soft px-2 py-1.5 text-right text-sm text-ink focus:border-brand/40 focus:outline-none"
                  />
                  <button onClick={() => remove(l.id)} className="rounded-lg p-1.5 text-ink-faint hover:bg-bg-hover hover:text-accent-rose">
                    <Icon name="Trash2" className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <button onClick={addBlank} className="mt-3 inline-flex items-center gap-1.5 text-xs text-brand-soft hover:text-brand">
              <Icon name="Plus" className="h-3.5 w-3.5" /> Add line
            </button>

            <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
              <span className="text-sm text-ink-soft">Discount %</span>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="w-20 rounded-lg border border-line bg-bg-soft px-2 py-1.5 text-right text-sm text-ink focus:border-brand/40 focus:outline-none"
              />
            </div>
            <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-ink-soft">
              <input type="checkbox" checked={vatIncluded} onChange={(e) => setVatIncluded(e.target.checked)} className="accent-[#ff8300]" />
              Prices include 5% VAT (UAE, 2026)
            </label>
          </Card>

          <Card className="p-4">
            <SectionLabel>Notes / terms</SectionLabel>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="h-24 w-full resize-none rounded-lg border border-line bg-bg-soft p-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-brand/40 focus:outline-none"
            />
          </Card>
        </div>

        {/* Preview — a white ES-brand paper document */}
        <div>
          <div className="no-print">
            <SectionLabel>Live preview</SectionLabel>
          </div>
          <div className="print-area overflow-hidden rounded-2xl bg-white text-black shadow-xl">
            {/* Header band */}
            <div className="flex items-center justify-between px-8 py-6" style={{ background: "#FF8300" }}>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 text-lg font-bold lowercase text-white">
                  es
                </div>
                <div>
                  <div className="text-lg font-bold text-white">ES World</div>
                  <div className="text-[11px] text-white/90">Experience · Grow · Enjoy</div>
                </div>
              </div>
              <div className="text-right text-white">
                <div className="text-2xl font-bold tracking-tight">QUOTATION</div>
                <div className="text-[11px]">{quoteNo || "ESL-QT-001"}</div>
              </div>
            </div>

            <div className="px-8 py-6">
              {/* Meta row */}
              <div className="mb-6 flex flex-wrap justify-between gap-4 text-sm">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">Prepared for</div>
                  <div className="font-semibold">{client || "—"}</div>
                  <div className="text-neutral-600">{clientDetail}</div>
                </div>
                <div className="text-right">
                  <div>
                    <span className="text-neutral-400">Date: </span>
                    {date || "—"}
                  </div>
                  <div>
                    <span className="text-neutral-400">Valid until: </span>
                    {validUntil || "—"}
                  </div>
                </div>
              </div>

              {/* Table */}
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "#FF8300" }} className="text-left text-white">
                    <th className="rounded-l-md px-3 py-2 font-semibold">Description</th>
                    <th className="px-3 py-2 text-center font-semibold">Qty</th>
                    <th className="px-3 py-2 text-right font-semibold">Unit</th>
                    <th className="rounded-r-md px-3 py-2 text-right font-semibold">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {lines.map((l, i) => (
                    <tr key={l.id} className={i % 2 ? "bg-neutral-50" : ""}>
                      <td className="px-3 py-2 align-top">{l.desc || <span className="text-neutral-300">—</span>}</td>
                      <td className="px-3 py-2 text-center align-top">{l.qty}</td>
                      <td className="px-3 py-2 text-right align-top">{fmt(l.price, sym)}</td>
                      <td className="px-3 py-2 text-right align-top font-medium">{fmt(l.qty * l.price, sym)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="mt-4 flex justify-end">
                <div className="w-56 space-y-1 text-sm">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal</span>
                    <span>{fmt(subtotal, sym)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-neutral-600">
                      <span>Discount ({discount}%)</span>
                      <span>−{fmt(discountAmt, sym)}</span>
                    </div>
                  )}
                  <div
                    className="mt-1 flex justify-between rounded-md px-2 py-1.5 text-base font-bold text-white"
                    style={{ background: "#FF8300" }}
                  >
                    <span>Total</span>
                    <span>{fmt(total, sym)}</span>
                  </div>
                  {vatIncluded && (
                    <div className="flex justify-between px-2 text-[11px] text-neutral-500">
                      <span>Incl. 5% VAT</span>
                      <span>{fmt(vatPortion, sym)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              {notes && (
                <div className="mt-6 border-t border-neutral-200 pt-4 text-xs text-neutral-600">
                  <div className="mb-1 font-semibold text-neutral-800">Notes &amp; terms</div>
                  <p className="whitespace-pre-line">{notes}</p>
                </div>
              )}

              <div className="mt-6 text-center text-[11px] text-neutral-400">
                ES World · esworld.com · Dubai &amp; London
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg border border-line bg-bg-soft px-2.5 py-1.5 text-sm text-ink placeholder:text-ink-faint focus:border-brand/40 focus:outline-none"
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-line bg-bg-soft px-2.5 py-1.5 text-sm text-ink focus:border-brand/40 focus:outline-none"
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-bg-soft">
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
