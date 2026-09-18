import type { LegendEntry } from "@/components/ElementLegend";

/** Safely read a jsonb legend column into typed legend entries. */
export function toLegend(value: unknown): LegendEntry[] {
  if (!Array.isArray(value)) return [];
  return (value as unknown[]).filter(
    (v): v is LegendEntry =>
      typeof v === "object" && v !== null && "code" in (v as Record<string, unknown>),
  );
}
