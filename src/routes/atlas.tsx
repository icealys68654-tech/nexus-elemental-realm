import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MapGrid } from "@/components/MapGrid";
import { WorldViewer3D } from "@/components/WorldViewer3D";
import { ElementLegend, type LegendEntry } from "@/components/ElementLegend";
import { useState } from "react";

export const Route = createFileRoute("/atlas")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Public atlas — Horadric Atlas" },
      {
        name: "description",
        content: "Browse published elemental maps of water, fire, earth and air rendered as 3D worlds.",
      },
      { property: "og:title", content: "Public atlas — Horadric Atlas" },
      {
        property: "og:description",
        content: "Browse published elemental maps of water, fire, earth and air rendered as 3D worlds.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Atlas,
});

function Atlas() {
  const [openId, setOpenId] = useState<string | null>(null);

  const { data: worlds, isLoading } = useQuery({
    queryKey: ["public-worlds"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("worlds")
        .select("*")
        .eq("published", true)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const open = worlds?.find((w) => w.id === openId);

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-8">
      <Link to="/" className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
        ← Horadric Atlas
      </Link>
      <h1 className="mt-4 text-3xl">Public atlas</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Worlds published by other forge-keepers. Open one to read its legend and rotate the 3D
        terrain.
      </p>

      {open ? (
        <section className="panel mt-8 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl">{open.title}</h2>
              <p className="text-xs text-muted-foreground">
                {open.width} × {open.height} elemental grid
              </p>
            </div>
            <button
              onClick={() => setOpenId(null)}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Close
            </button>
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <MapGrid grid={(open.grid as string[]) ?? []} interactive={false} />
            <div className="lg:col-span-1">
              <ElementLegend
                grid={(open.grid as string[]) ?? []}
                entries={(open.legend as LegendEntry[]) ?? []}
              />
            </div>
            <WorldViewer3D grid={(open.grid as string[]) ?? []} />
          </div>
        </section>
      ) : null}

      {isLoading ? (
        <p className="mt-10 text-sm text-muted-foreground">Scanning the atlas…</p>
      ) : !worlds?.length ? (
        <p className="mt-10 text-sm text-muted-foreground">
          No worlds have been published yet. Yours could be the first.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {worlds.map((w) => (
            <button
              key={w.id}
              onClick={() => setOpenId(w.id)}
              className="panel p-4 text-left transition-shadow hover:glow-ring"
            >
              <MapGrid grid={(w.grid as string[]) ?? []} interactive={false} />
              <h3 className="mt-4 text-base">{w.title}</h3>
              <p className="text-xs text-muted-foreground">
                {w.width} × {w.height} grid
              </p>
            </button>
          ))}
        </div>
      )}
    </main>
  );
}
