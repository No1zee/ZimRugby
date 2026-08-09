import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/admin/auth";

export async function POST(request: NextRequest) {
  try {
    try {
      await requirePermission("EDIT");
    } catch (e: any) {
      if (e.message === "Forbidden") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { prompt, action, contextData } = await request.json();

    if (!prompt && !action) {
      return NextResponse.json({ error: "Missing prompt or action" }, { status: 400 });
    }

    // Directus AI / OpenAI key handling or fallback generation logic
    const openaiApiKey = process.env.OPENAI_API_KEY || process.env.DIRECTUS_AI_KEY;

    if (openaiApiKey) {
      const systemMessage =
        action === "match_summary"
          ? "You are an official Zimbabwe Rugby Union (ZRU) sports journalist. Create a compelling, professional match recap with key highlights."
          : action === "tags"
          ? "Generate concise, comma-separated SEO tags for Zimbabwe Rugby Union content."
          : "You are the Directus AI Assistant for the Zimbabwe Rugby Union (ZRU) CMS. Help write, polish, and structure clean content.";

      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemMessage },
            { role: "user", content: `Context: ${JSON.stringify(contextData || {})}\n\nTask: ${prompt}` },
          ],
          temperature: 0.7,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const output = json.choices?.[0]?.message?.content || "";
        return NextResponse.json({ result: output, status: "success" });
      }
    }

    // Fallback synthesis when external API key is not present (Demo Smart Synthesis Mode)
    let generatedContent = "";
    if (action === "match_summary") {
      generatedContent = `### Match Recap: ${prompt || "ZRU Championship Clash"}

In a high-intensity encounter powered by the Zimbabwe Rugby Union, both squads showed relentless determination on the pitch.

**Key Highlights:**
- Rapid opening try set early momentum.
- Defensively solid performance in the second half.
- Final Score reflective of tactical precision and physical dominance.

*Generated via Directus AI Assistant for ZRU Admin.*`;
    } else if (action === "tags") {
      generatedContent = "Zimbabwe Rugby Union, ZRU, Sables, Cheetahs, Rugby Africa, Match Recap, Harare Sports Club";
    } else {
      generatedContent = `### Directus AI Draft: ${prompt}

${prompt} - Official statement and media release from the Zimbabwe Rugby Union (ZRU). The union remains committed to high-performance rugby development across all provinces.

#### Key Announcements:
1. Updated fixture scheduling and ticket availability.
2. Grassroots player pathway support and technical workshops.
3. Live coverage details on the official ZRU Match Centre.`;
    }

    return NextResponse.json({
      result: generatedContent,
      status: "fallback",
      note: "Smart Directus AI Synthesis (Configure OPENAI_API_KEY for live LLM completions)",
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
