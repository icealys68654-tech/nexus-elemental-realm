export type ElementCode = "W" | "F" | "E" | "A" | ".";

export interface ElementDef {
  code: ElementCode;
  name: string;
  token: string; // css var name
  height: number; // 3D extrusion height
  blurb: string;
}

export const ELEMENTS: ElementDef[] = [
  { code: "W", name: "Water", token: "--water", height: 0.15, blurb: "Seas, rivers and flooded hollows" },
  { code: "F", name: "Fire", token: "--fire", height: 0.9, blurb: "Ember cores, calderas and forges" },
  { code: "E", name: "Earth", token: "--earth", height: 0.55, blurb: "Stone, soil and rooted terrain" },
  { code: "A", name: "Air", token: "--air", height: 1.35, blurb: "Spires, drifting shelves and open sky" },
  { code: ".", name: "Void", token: "--void", height: 0.02, blurb: "Unwritten space awaiting emergence" },
];

export const ELEMENT_BY_CODE: Record<string, ElementDef> = Object.fromEntries(
  ELEMENTS.map((e) => [e.code, e]),
) as Record<string, ElementDef>;

export function elementAt(grid: string[], x: number, y: number): ElementDef {
  const row = grid[y] ?? "";
  const code = row[x] ?? ".";
  return ELEMENT_BY_CODE[code] ?? ELEMENT_BY_CODE["."]!;
}

export function emptyGrid(width: number, height: number): string[] {
  return Array.from({ length: height }, () => ".".repeat(width));
}

export function normalizeGrid(rows: unknown, width: number, height: number): string[] {
  const src = Array.isArray(rows) ? rows.map((r) => String(r ?? "")) : [];
  return Array.from({ length: height }, (_, y) => {
    const raw = (src[y] ?? "").toUpperCase().replace(/[^WFEA.]/g, ".");
    return raw.padEnd(width, ".").slice(0, width);
  });
}

export function setCell(grid: string[], x: number, y: number, code: ElementCode): string[] {
  return grid.map((row, i) => (i === y ? row.slice(0, x) + code + row.slice(x + 1) : row));
}

export function elementCounts(grid: string[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const row of grid) {
    for (const ch of row) counts[ch] = (counts[ch] ?? 0) + 1;
  }
  return counts;
}
