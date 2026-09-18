import { createFileRoute, Link } from "@tanstack/react-router";
import heroGem from "@/assets/hero-gem.jpg";
import { ELEMENTS } from "@/lib/elements";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Horadric Atlas — 2D elemental maps forged into 3D worlds" },
      {
        name: "description",
        content:
          "Feed an artifact description to the forge and watch it become a 2D elemental map with a legend of water, fire, earth and air — then walk it in 3D.",
      },
      { property: "og:title", content: "Horadric Atlas — 2D elemental maps forged into 3D worlds" },
      {
        property: "og:description",
        content:
          "Feed an artifact description to the forge and watch it become a 2D elemental map with a legend of water, fire, earth and air — then walk it in 3D.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const PIPELINE = [
  {
    n: "01",
    title: "AI agent gatherer",
    body: "Reads your artifact document — lore, composition, colour, properties — and distils its elemental signature.",
  },
  {
    n: "02",
    title: "Mesh generator agent",
    body: "Lays that signature out as a 2D grid of water, fire, earth and air, with a legend explaining every symbol.",
  },
  {
    n: "03",
    title: "Modal grid agent",
    body: "Extrudes the grid into a 3D world you can rotate, where each element rises to its own elevation.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen gradient-cosmos">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 sm:px-8">
        <span className="flex items-center gap-3">
          <span className="size-3 rotate-45 rounded-[2px] bg-primary glow-ring" />
          <span className="font-display text-sm uppercase tracking-[0.3em]">Horadric Atlas</span>
        </span>
        <nav className="flex items-center gap-2 text-sm">
          <Link to="/atlas" className="px-3 py-1.5 text-muted-foreground hover:text-foreground">
            Public atlas
          </Link>
          <Link to="/auth">
            <Button size="sm">Enter the forge</Button>
          </Link>
        </nav>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-10 sm:px-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
              Gather · Generate · Organize
            </p>
            <h1 className="mt-5 text-4xl leading-tight sm:text-5xl">
              Turn an artifact into a <span className="text-ember">living elemental world</span>
            </h1>
            <p className="mt-5 max-w-lg text-muted-foreground">
              Describe a gem, a relic or a place. Three agents read it, map it into a 2D grid of
              water, fire, earth and air, and lift that flat space into terrain you can rotate.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/auth">
                <Button size="lg">Start forging</Button>
              </Link>
              <Link to="/atlas">
                <Button size="lg" variant="secondary">
                  Browse the atlas
                </Button>
              </Link>
            </div>
            <dl className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {ELEMENTS.filter((e) => e.code !== ".").map((el) => (
                <div key={el.code} className="panel p-3">
                  <span
                    className="block size-3 rounded-sm"
                    style={{ backgroundColor: `var(${el.token})` }}
                  />
                  <dt className="mt-2 text-sm">{el.name}</dt>
                  <dd className="text-xs text-muted-foreground">{el.blurb}</dd>
                </div>
              ))}
            </dl>
          </div>
          <img
            src={heroGem}
            alt="Octagonal topaz gem with an ember core above a wireframe landscape"
            width={1600}
            height={1008}
            className="w-full rounded-xl border border-border/60 glow-ring"
          />
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-8">
          <h2 className="text-2xl">The pipeline</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {PIPELINE.map((p) => (
              <article key={p.n} className="panel p-6">
                <span className="font-display text-sm text-ember">{p.n}</span>
                <h3 className="mt-2 text-lg">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 px-4 py-8 text-center text-xs text-muted-foreground sm:px-8">
        Horadric Atlas — 2D space, transformed.
      </footer>
    </div>
  );
}
