"use client";

import { useCallback, useEffect, useState } from "react";
import { PRODUCTS as SEED, type Product } from "./knowledge";

const KEY = "es-products-v1";

type Overrides = { added: Product[]; edits: Record<string, Partial<Product>>; deleted: string[] };
const EMPTY: Overrides = { added: [], edits: {}, deleted: [] };

function read(): Overrides {
  if (typeof window === "undefined") return EMPTY;
  try {
    return { ...EMPTY, ...(JSON.parse(localStorage.getItem(KEY) || "{}") as Overrides) };
  } catch {
    return EMPTY;
  }
}
function write(o: Overrides) {
  localStorage.setItem(KEY, JSON.stringify(o));
  window.dispatchEvent(new Event("es-products-changed"));
}

function merge(o: Overrides): Product[] {
  const custom = o.added.filter((p) => !o.deleted.includes(p.id)).map((p) => ({ ...p, ...(o.edits[p.id] || {}) }));
  const base = SEED.filter((p) => !o.deleted.includes(p.id)).map((p) => ({ ...p, ...(o.edits[p.id] || {}) }));
  return [...custom, ...base];
}

export function useProducts() {
  const [o, setO] = useState<Overrides>(EMPTY);
  useEffect(() => {
    const sync = () => setO(read());
    sync();
    window.addEventListener("es-products-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("es-products-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const add = useCallback((p: Product) => {
    const c = read();
    c.added = [p, ...c.added.filter((x) => x.id !== p.id)];
    c.deleted = c.deleted.filter((d) => d !== p.id);
    write(c);
  }, []);
  const update = useCallback((id: string, patch: Partial<Product>) => {
    const c = read();
    if (c.added.some((a) => a.id === id)) c.added = c.added.map((a) => (a.id === id ? { ...a, ...patch } : a));
    else c.edits[id] = { ...(c.edits[id] || {}), ...patch };
    write(c);
  }, []);
  const remove = useCallback((id: string) => {
    const c = read();
    c.added = c.added.filter((a) => a.id !== id);
    if (SEED.some((s) => s.id === id)) c.deleted = Array.from(new Set([...c.deleted, id]));
    delete c.edits[id];
    write(c);
  }, []);
  const reset = useCallback(() => write(EMPTY), []);

  return { products: merge(o), add, update, remove, reset, customIds: o.added.map((a) => a.id) };
}

export function newId() {
  // deterministic-ish unique id without Date.now/Math.random (blocked in some envs → use perf/time-safe fallback)
  return "cus-" + Math.abs(Array.from(String(typeof performance !== "undefined" ? performance.now() : ""))
    .reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 7)).toString(36) + "-" + Math.floor((typeof performance !== "undefined" ? performance.now() : 0)).toString(36);
}
