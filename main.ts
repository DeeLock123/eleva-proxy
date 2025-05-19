// main.ts
const BROWSERLESS_KEY = "2SLAHnqluSvXeMpd5f5659d8ca58eb54c3a5ac4068999d1f9";

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const category = url.searchParams.get("category");
  const page = url.searchParams.get("page") || "1";

  if (!category) {
    return new Response("Missing 'category' query param", { status: 400 });
  }

  const targetUrl = `https://www.approvedbusiness.co.uk/search/${category}?page=${page}`;
  const browserlessUrl = "https://chrome.browserless.io/content?token=" + BROWSERLESS_KEY;

  const response = await fetch(browserlessUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: targetUrl,
      waitForSelector: ".listing",
    }),
  });

  const html = await response.text();

  const companyRegex = /<a class="title_link" href="([^"]+)">([^<]+)<\/a>[\s\S]*?<a class="button" href="(https?:\/\/[^"]+)"[^>]*>Website<\/a>/g;
  const matches = [...html.matchAll(companyRegex)];

  const results = matches.map((m) => ({
    company: m[2].trim(),
    website: m[3].trim(),
    source: "https://www.approvedbusiness.co.uk" + m[1].trim(),
  }));

  return new Response(JSON.stringify(results, null, 2), {
    headers: { "Content-Type": "application/json" },
  });
});
