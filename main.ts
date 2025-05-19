// main.ts (Deno Proxy - Hardcoded API Key)

const API_KEY = "2SLAHnqluSvXeMpd5f5659d8ca58eb54c3a5ac4068999d1f9";

Deno.serve(async (req) => {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || "accountants";
  const page = searchParams.get("page") || "1";

  const url = `https://www.approvedbusiness.co.uk/search/${category}?page=${page}`;

  const browserlessRes = await fetch("https://chrome.browserless.io/content", {
    method: "POST",
    headers: {
      "Cache-Control": "no-cache",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      url,
      waitForSelector: "a.button[href^='http']",
      elements: "a.title_link",
    }),
  });

  const data = await browserlessRes.json();

  if (!Array.isArray(data)) {
    return new Response(JSON.stringify({ error: "No data returned" }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }

  const leads = data.map((el: any) => {
    const title = el.innerText?.trim();
    const websiteBtn = el.nextElementSibling?.href || null;
    return title && websiteBtn ? { company: title, website: websiteBtn } : null;
  }).filter(Boolean);

  return new Response(JSON.stringify(leads, null, 2), {
    headers: { "Content-Type": "application/json" },
  });
});
