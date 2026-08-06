"use client";

import { useRef, useState } from "react";
import { Icon } from "./Icon";

/** Drop or pick a file (PDF, image, text/CSV) → parsed text passed to onText. */
export function FileDrop({ onText, label = "Drop a file or click, PDF, image, CSV or text" }: { onText: (text: string) => void; label?: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  async function handle(file: File) {
    setBusy(true);
    setNote(null);
    try {
      const dataUrl: string = await new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result as string);
        r.onerror = rej;
        r.readAsDataURL(file);
      });
      const data = dataUrl.split(",")[1];
      const resp = await fetch("/api/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data, mediaType: file.type, name: file.name }),
      });
      const j = await resp.json();
      if (j.text && j.text.trim()) onText(j.text.trim());
      else setNote(j.note || "Couldn't read that file.");
    } catch {
      setNote("Couldn't read that file.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files?.[0]; if (f) handle(f); }}
        onClick={() => ref.current?.click()}
        className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed px-3 py-2.5 text-xs transition-colors ${drag ? "border-brand bg-brand/5 text-brand-soft" : "border-line text-ink-faint hover:border-brand/40 hover:text-ink-soft"}`}
      >
        <Icon name={busy ? "Loader2" : "Download"} className={`h-4 w-4 ${busy ? "animate-spin" : ""}`} />
        {busy ? "Reading file…" : label}
        <input
          ref={ref}
          type="file"
          className="hidden"
          accept=".pdf,.png,.jpg,.jpeg,.webp,.gif,.txt,.md,.csv,.tsv,.json,.html,image/*,application/pdf,text/*"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handle(f); e.currentTarget.value = ""; }}
        />
      </div>
      {note && <div className="mt-1 text-[11px] text-accent-amber">{note}</div>}
    </div>
  );
}
