// main.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

// Replace this with your real Browserless token:
const BROWSERLESS_TOKEN = "2SLAHnqluSvXeMp18be79ff955e357e44cfce17df6fb1bd23";

serve(async (req) => {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const page = searchParams.get("page") || "1";

  if (!category) {
    return new Response("Missing category parameter", { status: 400 });
  }

  const targetUrl = `https://www.approvedbusiness.co.uk/search/${category}?page=${page}`;
  const browserlessUrl = `https://chrome.browserless.io/content?token=${BROWSERLESS_TOKEN}`;

  // Get fully rendered HTML from Browserless
  const response = await fetch(browserlessUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: targetUrl })
  });

  const html = await response.text();

  // Match company name and website button
  const regex = /<a class="title_link" href="[^"]*">(.*?)<\/a>[\s\S]*?<a class="button" href="(https?:\/\/[^"]+)"/g;
  const matches = [...html.matchAll(regex)];

  const companies = matches.map(match => ({
    name: match[1].trim(),
    website: match[2].trim(),
    source: targetUrl
  }));

  return new Response(JSON.stringify(companies, null, 2), {
    headers: { "Content-Type": "application/json" }
  });
});

