import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { generateWorld } from "@/lib/worlds.functions";
import { StudioHeader } from "@/components/StudioHeader";
import { MapGrid } from "@/components/MapGrid";
import { WorldViewer3D } from "@/components/WorldViewer3D";
import { ElementLegend, type LegendEntry } from "@/components/ElementLegend";
import { ELEMENTS, emptyGrid, normalizeGrid, setCell, type ElementCode } from "@/lib/elements";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/studio/$worldId")({
  head: () => ({
    meta: [
      { title: "World forge — Horadric Atlas" },
      { name: "description", content: "Paint elemental tiles, read the legend and view the world in 3D." },
      { property: "og:title", content: "World forge — Horadric Atlas" },
      { property: "og:description", content: "Paint elemental tiles, read the legend and view the world in 3D." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WorldForge,
});

const STAGES = [
  { key: "gather", label: "AI agent gatherer", note: "Reads the artifact document" },
  { key: "mesh", label: "Mesh generator agent", note: "Lays out the elemental grid" },
  { key: "modal", label: "Modal grid agent", note: "Extrudes 2D space into 3D" },
] as const;

function WorldForge() {
  const { worldId } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const runGenerate = useServerFn(generateWorld);

  const { data: world, isLoading } = useQuery({
    queryKey: ["world", worldId],
    queryFn: async () => {
      const { data, error } = await supabase.from("worlds").select("*").eq("id", worldId).single();
      if (error) throw error;
      return data;
    },
  });

  const [title, setTitle] = useState("");
  const [lore, setLore] = useState("");
  const [grid, setGrid] = useState<string[]>(emptyGrid(16, 16));
  const [legend, setLegend] = useState<LegendEntry[]>([]);
  const [published, setPublished] = useState(false);
  const [brush, setBrush] = useState<ElementCode>("E");
  const [stage, setStage] = useState<number>(-1);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!world) return;
    setTitle(world.title);
    setLore(world.lore);
    setGrid(normalizeGrid(world.grid, world.width, world.height));
    setLegend(((world.legend as LegendEntry[]) ?? []).filter(Boolean));
    setPublished(world.published);
  }, [world]);

  async function save(extra?: Record<string, unknown>) {
    setSaving(true);
    const { error } = await supabase
      .from("worlds")
      .update({ title, lore, grid, legend, published, ...extra })
      .eq("id", worldId);
    setSaving(false);
    if (error) {
      toast.error("Could not save this world.");
      return;
    }
    qc.invalidateQueries({ queryKey: ["my-worlds"] });
    toast.success("World saved.");
  }

  async function generate() {
    if (!lore.trim()) {
      toast.error("Add an artifact description first.");
      return;
    }
    try {
      setStage(0);
      const timer = setTimeout(() => setStage(1), 1200);
      const result = await runGenerate({
        data: { lore, width: world?.width ?? 16, height: world?.height ?? 16 },
      });
      clearTimeout(timer);
      setStage(2);
      setGrid(result.grid);
      setLegend(result.legend.map((l) => ({ code: l.code.toUpperCase(), name: l.name, meaning: l.meaning })));
      if (result.title) setTitle(result.title);
      toast.success("World generated. Save it to keep it.");
      setTimeout(() => setStage(-1), 900);
    } catch (err) {
      setStage(-1);
      toast.error(
        err instanceof Error && err.message.includes("402")
          ? "The AI forge is out of credits."
          : "The forge could not read that artifact. Try again.",
      );
    }
  }

  async function remove() {
    const { error } = await supabase.from("worlds").delete().eq("id", worldId);
    if (error) {
      toast.error("Could not delete this world.");
      return;
    }
    qc.invalidateQueries({ queryKey: ["my-worlds"] });
    navigate({ to: "/studio" });
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <StudioHeader />
        <p className="p-10 text-sm text-muted-foreground">Opening the world…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <StudioHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-11 max-w-md border-0 bg-transparent px-0 font-display text-2xl focus-visible:ring-0"
          />
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Switch checked={published} onCheckedChange={setPublished} />
              Public
            </label>
            <Button variant="secondary" onClick={remove}>
              Delete
            </Button>
            <Button onClick={() => save()} disabled={saving}>
              {saving ? "Saving…" : "Save world"}
            </Button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[22rem_1fr]">
          <aside className="space-y-6">
            <section className="panel p-5">
              <Label htmlFor="lore" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Artifact document
              </Label>
              <Textarea
                id="lore"
                value={lore}
                onChange={(e) => setLore(e.target.value)}
                rows={10}
                className="mt-3 resize-none bg-background/40 text-sm"
                placeholder="Paste a gem, relic or place description…"
              />
              <Button className="mt-4 w-full" onClick={generate} disabled={stage >= 0}>
                {stage >= 0 ? "Forging…" : "Generate world"}
              </Button>
              <ol className="mt-4 space-y-2">
                {STAGES.map((s, i) => (
                  <li key={s.key} className="flex items-start gap-3 text-xs">
                    <span
                      className={`mt-1 size-2 rounded-full ${
                        stage >= i ? "bg-primary glow-ring" : "bg-muted"
                      }`}
                    />
                    <span>
                      <span className={stage >= i ? "text-foreground" : "text-muted-foreground"}>
                        {s.label}
                      </span>
                      <span className="block text-muted-foreground">{s.note}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </section>

            <section className="panel p-5">
              <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Legend</h2>
              <div className="mt-4">
                <ElementLegend grid={grid} entries={legend} />
              </div>
            </section>
          </aside>

          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {ELEMENTS.map((el) => (
                <button
                  key={el.code}
                  onClick={() => setBrush(el.code)}
                  className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                    brush === el.code ? "border-primary text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <span
                    className="size-3 rounded-sm"
                    style={{ backgroundColor: `var(${el.token})` }}
                  />
                  {el.name}
                </button>
              ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <MapGrid
                grid={grid}
                brush={brush}
                onPaint={(x, y) => setGrid((g) => setCell(g, x, y, brush))}
              />
              <WorldViewer3D grid={grid} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
