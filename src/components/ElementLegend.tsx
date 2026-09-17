import { ELEMENTS, elementCounts } from "@/lib/elements";

export interface LegendEntry {
  code: string;
  name: string;
  meaning: string;
}

export function ElementLegend({
  grid,
  entries,
}: {
  grid: string[];
  entries?: LegendEntry[];
}) {
  const counts = elementCounts(grid);
  const total = Math.max(
    1,
    grid.reduce((sum, row) => sum + row.length, 0),
  );

  return (
    <ul className="space-y-3">
      {ELEMENTS.map((el) => {
        const entry = entries?.find((e) => e.code.toUpperCase().startsWith(el.code));
        const pct = Math.round(((counts[el.code] ?? 0) / total) * 100);
        return (
          <li key={el.code} className="flex items-start gap-3">
            <span
              className="mt-1 size-4 shrink-0 rounded-sm"
              style={{
                backgroundColor: `var(${el.token})`,
                boxShadow: `0 0 12px -2px var(${el.token})`,
              }}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-sm font-medium">{entry?.name || el.name}</span>
                <span className="text-xs tabular-nums text-muted-foreground">{pct}%</span>
              </div>
              <p className="text-xs leading-snug text-muted-foreground">
                {entry?.meaning || el.blurb}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
