import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { StudioHeader } from "@/components/StudioHeader";
import { MapGrid } from "@/components/MapGrid";
import { Button } from "@/components/ui/button";
import { emptyGrid } from "@/lib/elements";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/studio")({
  head: () => ({
    meta: [
      { title: "World library — Horadric Atlas" },
      { name: "description", content: "Your saved elemental maps, legends and 3D worlds." },
      { property: "og:title", content: "World library — Horadric Atlas" },
      { property: "og:description", content: "Your saved elemental maps, legends and 3D worlds." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StudioIndex,
});

const STARTER_LORE = `A crystalline manifestation of an ancient horadric mechanism. This gemstone holds extracted spatial energy, resonating with the power that unlocks forbidden passageways.

Type: Horadric Artifact
Shape: Octagonal (8-Point Focus)
Color: Ancient Topaz / Ember Core
Composition: Arcane Crystal, Horadric Essence, Imbued Flame
Properties: Resonates with the Horadric Orifice. Reacts to the Horadric Staff.`;

function StudioIndex() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [creating, setCreating] = useState(false);

  const { data: worlds, isLoading } = useQuery({
    queryKey: ["my-worlds"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("worlds")
        .select("*")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  async function createWorld() {
    setCreating(true);
    const { data: userRes } = await supabase.auth.getUser();
    const uid = userRes.user?.id;
    if (!uid) return;
    const { data, error } = await supabase
      .from("worlds")
      .insert({
        user_id: uid,
        title: "Untitled World",
        lore: STARTER_LORE,
        width: 16,
        height: 16,
        grid: emptyGrid(16, 16),
        legend: [],
      })
      .select()
      .single();
    setCreating(false);
    if (error || !data) {
      toast.error("Could not create the world.");
      return;
    }
    qc.invalidateQueries({ queryKey: ["my-worlds"] });
    navigate({ to: "/studio/$worldId", params: { worldId: data.id } });
  }

  return (
    <div className="min-h-screen">
      <StudioHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl">World library</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Every artifact document you feed the forge becomes a map, a legend and a 3D world.
            </p>
          </div>
          <Button onClick={createWorld} disabled={creating}>
            {creating ? "Forging…" : "New world"}
          </Button>
        </div>

        {isLoading ? (
          <p className="mt-10 text-sm text-muted-foreground">Reading the archive…</p>
        ) : !worlds?.length ? (
          <div className="panel mt-10 p-10 text-center">
            <h2 className="text-xl">The archive is empty</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Start a world, paste an artifact description, and the forge will gather it into an
              elemental grid you can walk through in 3D.
            </p>
            <Button className="mt-6" onClick={createWorld}>
              Forge the first world
            </Button>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {worlds.map((w) => (
              <Link
                key={w.id}
                to="/studio/$worldId"
                params={{ worldId: w.id }}
                className="group panel overflow-hidden p-4 transition-shadow hover:glow-ring"
              >
                <MapGrid grid={(w.grid as string[]) ?? []} interactive={false} />
                <div className="mt-4 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base leading-tight">{w.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {w.width} × {w.height} grid
                    </p>
                  </div>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-widest ${
                      w.published ? "border-primary text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {w.published ? "Public" : "Draft"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
