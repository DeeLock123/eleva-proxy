import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.36/deno-dom-wasm.ts";

serve(async (req) => {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const page = searchParams.get("page");

  if (!category || !page) {
    return new Response("Missing query parameters", { status: 400 });
  }

  const targetUrl = `https://www.approvedbusiness.co.uk/${category}/list_${page}.aspx`;
  const res = await fetch(targetUrl);
  const html = await res.text();

  const doc = new DOMParser().parseFromString(html, "text/html");
  if (!doc) {
    return new Response("Failed to parse HTML", { status: 500 });
  }

  const results: { company: string; website: string; source: string }[] = [];

  const items = doc.querySelectorAll(".listingDetails");
  items.forEach((item) => {
    const companyAnchor = item.querySelector(".title_link");
    const websiteAnchor = item.querySelector("a.button");

    const company = companyAnchor?.textContent?.trim();
    const website = websiteAnchor?.getAttribute("href");

    if (company && website) {
      results.push({
        company,
        website,
        source: targetUrl,
      });
    }
  });

  return new Response(JSON.stringify(results, null, 2), {
    headers: { "Content-Type": "application/json" },
  });
});
