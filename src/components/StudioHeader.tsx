import { Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export function StudioHeader() {
  const navigate = useNavigate();

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 px-4 py-4 sm:px-8">
      <Link to="/studio" className="flex items-center gap-3">
        <span className="size-3 rotate-45 rounded-[2px] bg-primary glow-ring" />
        <span className="font-display text-sm uppercase tracking-[0.3em]">Horadric Atlas</span>
      </Link>
      <nav className="flex items-center gap-2 text-sm">
        <Link to="/atlas" className="px-3 py-1.5 text-muted-foreground hover:text-foreground">
          Public atlas
        </Link>
        <Link to="/studio" className="px-3 py-1.5 text-muted-foreground hover:text-foreground">
          My worlds
        </Link>
        <Button
          variant="secondary"
          size="sm"
          onClick={async () => {
            await supabase.auth.signOut();
            navigate({ to: "/" });
          }}
        >
          Sign out
        </Button>
      </nav>
    </header>
  );
}
