// Dependency-free client-side exports: PDF (print), Word (.doc), Excel (.xls), CSV.
// Word/Excel use the long-standing HTML-wrapper trick so files open cleanly in
// Microsoft Office without any bundled library.

const DOC_STYLES = `
  <style>
    * { font-family: Calibri, 'Segoe UI', Arial, sans-serif; color: #111; }
    body { margin: 32px; }
    h1 { color: #FF8300; font-size: 22px; margin: 0 0 4px; }
    h2 { color: #FF8300; font-size: 15px; margin: 18px 0 6px; }
    h3 { font-size: 13px; margin: 12px 0 4px; }
    p, li, td, th { font-size: 12px; line-height: 1.5; }
    .muted { color: #666; font-size: 11px; }
    table { border-collapse: collapse; width: 100%; margin: 8px 0; }
    th { background: #FF8300; color: #fff; text-align: left; padding: 6px 8px; }
    td { border-bottom: 1px solid #ddd; padding: 6px 8px; vertical-align: top; }
    .brandbar { background:#FF8300; color:#fff; padding:14px 18px; border-radius:8px; margin-bottom:18px; }
    ul { margin: 4px 0 4px 18px; padding: 0; }
  </style>`;

function slug(s: string) {
  return (s || "export").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 60) || "export";
}

function download(filename: string, mime: string, content: string) {
  const blob = new Blob(["﻿", content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function wrap(title: string, bodyHtml: string) {
  return `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title>${DOC_STYLES}</head><body>${bodyHtml}</body></html>`;
}

/** Opens a clean, brand-styled print window scoped to just this content → Save as PDF. */
export function exportPDF(title: string, bodyHtml: string) {
  const w = window.open("", "_blank", "width=900,height=1100");
  if (!w) return;
  w.document.write(wrap(title, bodyHtml));
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 300);
}

/** Downloads a Word-compatible .doc built from the same HTML. */
export function exportDOC(title: string, bodyHtml: string) {
  download(`${slug(title)}.doc`, "application/msword", wrap(title, bodyHtml));
}

/** Downloads an Excel-compatible .xls from rows (first row treated as header). */
export function exportXLS(title: string, rows: (string | number)[][]) {
  const esc = (v: string | number) => String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const [head, ...body] = rows;
  const thead = head ? `<tr>${head.map((c) => `<th>${esc(c)}</th>`).join("")}</tr>` : "";
  const tbody = body.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`).join("");
  download(`${slug(title)}.xls`, "application/vnd.ms-excel", wrap(title, `<table>${thead}${tbody}</table>`));
}

/** Simple HTML builders so modules can describe output declaratively. */
export const H = {
  brandTitle: (t: string, sub?: string) => `<div class="brandbar"><h1 style="color:#fff;margin:0">${t}</h1>${sub ? `<div>${sub}</div>` : ""}</div>`,
  h2: (t: string) => `<h2>${t}</h2>`,
  p: (t: string) => `<p>${t ?? ""}</p>`,
  muted: (t: string) => `<p class="muted">${t ?? ""}</p>`,
  ul: (items: string[]) => `<ul>${(items || []).map((i) => `<li>${i}</li>`).join("")}</ul>`,
  kv: (label: string, value: string) => `<p><b>${label}:</b> ${value ?? ""}</p>`,
};
