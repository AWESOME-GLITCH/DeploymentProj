"use client";

import { useCallback, useEffect, useState } from "react";

/** A PM correction — ground truth the agent must obey on future runs. */
export type Correction = {
  id: string;
  productId: string; // programme this applies to ("__new__" for a not-yet-saved offering)
  kind: string; // artifact it came from: brief/pricing/flyer/presentation/website/proposal, or "general"
  note: string; // what was wrong + the correct version
  ts: number;
};

const KEY = "es-corrections-v1";

function readAll(): Correction[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]") as Correction[];
  } catch {
    return [];
  }
}
function writeAll(list: Correction[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new Event("es-corrections-changed"));
}

/** Synchronous read for building an API payload (not a hook). */
export function correctionsForProduct(productId: string): Correction[] {
  return readAll().filter((c) => c.productId === productId);
}

function cid() {
  const t = typeof performance !== "undefined" ? performance.now() : 0;
  return "cor-" + Math.abs(String(t).split("").reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 5)).toString(36) + "-" + Math.floor(t).toString(36);
}

export function useCorrections(productId?: string) {
  const [all, setAll] = useState<Correction[]>([]);
  useEffect(() => {
    const sync = () => setAll(readAll());
    sync();
    window.addEventListener("es-corrections-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("es-corrections-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const add = useCallback((c: { productId: string; kind: string; note: string }) => {
    if (!c.note.trim()) return;
    writeAll([{ id: cid(), ts: Math.floor(typeof performance !== "undefined" ? performance.now() : 0), ...c, note: c.note.trim() }, ...readAll()]);
  }, []);
  const remove = useCallback((id: string) => writeAll(readAll().filter((c) => c.id !== id)), []);
  const clearFor = useCallback((pid: string) => writeAll(readAll().filter((c) => c.productId !== pid)), []);

  const list = productId ? all.filter((c) => c.productId === productId) : all;
  return { corrections: list, add, remove, clearFor };
}
