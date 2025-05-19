// Import the working version of DOMParser
import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

Deno.serve(async (req) => {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const page = searchParams.get("page") || "1";

  if (!category) {
    return new Response("Missing category parameter", { status: 400 });
  }

  const targetUrl = `https://www.approvedbusiness.co.uk/search/${category}/list_${page}.aspx`;

  try {
    const rawHtml = await fetch(targetUrl).then((res) => res.text());
    const doc = new DOMParser().parseFromString(rawHtml, "text/html");

    if (!doc) {
      return new Response("Failed to parse HTML", { status: 500 });
    }

    const results = [];
    const companyBlocks = doc.querySelectorAll(".search-listing");

    companyBlocks.forEach((block) => {
      const titleAnchor = block.querySelector(".title_link");
      const websiteButton = block.querySelector('a.button[href^="http"]');

      if (titleAnchor && websiteButton) {
        results.push({
          company: titleAnchor.textContent.trim(),
          website: websiteButton.getAttribute("href").trim(),
        });
      }
    });

    return new Response(JSON.stringify({ results }, null, 2), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response("Error fetching or parsing data: " + err.message, {
      status: 500,
    });
  }
});
