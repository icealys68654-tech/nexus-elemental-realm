import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText, Output } from "ai";
import { z } from "zod";
import { normalizeGrid } from "./elements";

const GenerateInput = z.object({
  lore: z.string().min(1),
  width: z.number(),
  height: z.number(),
});

const WorldSchema = z.object({
  title: z.string(),
  summary: z.string(),
  legend: z.array(
    z.object({
      code: z.string(),
      name: z.string(),
      meaning: z.string(),
    }),
  ),
  rows: z.array(z.string()),
});

/**
 * AI AGENT GATHERER -> MESH GENERATOR -> MODAL GRID
 * Reads an artifact document (Gem Maker style lore) and returns an elemental
 * tile grid plus a legend that the mesh/modal stages extrude into 3D.
 */
export const generateWorld = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => GenerateInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("AI is not configured for this project.");

    const lovable = createOpenAI({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey: key,
      headers: { "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    });

    const result = streamText({
      model: lovable.responses("openai/gpt-6-astra"),
      output: Output.object({ schema: WorldSchema }),
      system: [
        "You are the Gatherer agent of a world-forge pipeline.",
        "You read an artifact document and translate it into a 2D elemental tile map.",
        `Return exactly ${data.height} rows, each exactly ${data.width} characters long.`,
        "Allowed characters only: W (water), F (fire), E (earth), A (air), . (void).",
        "Compose a coherent landmass: contiguous regions, coastlines, a fire core if the lore implies flame, airy spires at high ground, void only as outer space or chasms.",
        "Legend entries must use those same codes and explain what each element means inside THIS world's lore.",
        "Keep the title under 6 words and the summary to 2 sentences.",
      ].join(" "),
      prompt: `Artifact document:\n\n${data.lore}`,
      providerOptions: {
        openai: {
          forceReasoning: true,
          reasoningEffort: "low",
          reasoningSummary: "auto",
          store: false,
          include: ["reasoning.encrypted_content"],
        },
      },
    });

    const output = await result.output;

    return {
      title: output.title,
      summary: output.summary,
      legend: output.legend.filter((l) => "WFEA.".includes(l.code.toUpperCase().charAt(0))),
      grid: normalizeGrid(output.rows, data.width, data.height),
    };
  });
