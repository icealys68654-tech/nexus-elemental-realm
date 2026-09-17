import { useRef } from "react";
import { ELEMENT_BY_CODE, type ElementCode } from "@/lib/elements";

export function MapGrid({
  grid,
  brush,
  onPaint,
  interactive = true,
}: {
  grid: string[];
  brush?: ElementCode;
  onPaint?: (x: number, y: number) => void;
  interactive?: boolean;
}) {
  const painting = useRef(false);
  const width = grid[0]?.length ?? 0;

  return (
    <div
      className="panel aspect-square w-full overflow-hidden p-2 select-none"
      onPointerUp={() => (painting.current = false)}
      onPointerLeave={() => (painting.current = false)}
    >
      <div
        className="grid h-full w-full gap-px"
        style={{ gridTemplateColumns: `repeat(${Math.max(width, 1)}, minmax(0, 1fr))` }}
      >
        {grid.flatMap((row, y) =>
          Array.from(row).map((ch, x) => {
            const el = ELEMENT_BY_CODE[ch] ?? ELEMENT_BY_CODE["."]!;
            return (
              <div
                key={`${x}-${y}`}
                role={interactive ? "button" : undefined}
                aria-label={`${el.name} tile ${x + 1}, ${y + 1}`}
                onPointerDown={() => {
                  if (!interactive) return;
                  painting.current = true;
                  onPaint?.(x, y);
                }}
                onPointerEnter={() => {
                  if (interactive && painting.current) onPaint?.(x, y);
                }}
                className={
                  interactive
                    ? "cursor-crosshair rounded-[2px] transition-[filter] hover:brightness-150"
                    : "rounded-[2px]"
                }
                style={{
                  backgroundColor: `var(${el.token})`,
                  opacity: ch === "." ? 0.35 : 1,
                }}
              />
            );
          }),
        )}
      </div>
      {brush ? <span className="sr-only">Current brush: {ELEMENT_BY_CODE[brush]?.name}</span> : null}
    </div>
  );
}
