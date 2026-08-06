import { Icon } from "./Icon";

export type Source = { url: string; title: string; age?: string };

function host(u: string) {
  try {
    return new URL(u).hostname.replace(/^www\./, "");
  } catch {
    return u;
  }
}

/** Shows exactly where researched facts came from, the live web sources the
 *  agent consulted. When nothing was searched, says so plainly. */
export function Sources({ sources, searched }: { sources?: Source[]; searched?: boolean }) {
  const list = sources || [];
  return (
    <div className="rounded-xl border border-line bg-bg-soft/50 p-4">
      <div className="mb-2 flex items-center gap-2">
        <Icon name="Search" className="h-4 w-4 text-accent-teal" />
        <h4 className="text-sm font-semibold text-ink">Where this came from</h4>
        <span className="ml-auto text-[11px] text-ink-faint">
          {list.length ? `${list.length} source${list.length > 1 ? "s" : ""}` : searched ? "no web sources returned" : "no live search"}
        </span>
      </div>
      {list.length > 0 ? (
        <ol className="space-y-1.5">
          {list.map((s, i) => (
            <li key={s.url} className="flex items-start gap-2.5">
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded bg-accent-teal/15 text-[10px] font-bold text-accent-teal">{i + 1}</span>
              <div className="min-w-0">
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-sm text-ink hover:text-accent-teal hover:underline">
                  {s.title}
                </a>
                <div className="truncate text-[11px] text-ink-faint">{host(s.url)}{s.age ? ` · ${s.age}` : ""}</div>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-xs text-ink-faint">
          {searched
            ? "The agent ran a web search but returned no citable pages, treat these figures as directional and verify before publishing."
            : "This ran from your Knowledge only, without a live web search. Add credits / enable research for sourced competitor and pricing figures."}
        </p>
      )}
    </div>
  );
}
