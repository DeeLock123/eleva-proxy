const handler = async (req: Request): Promise<Response> => {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || "accountants";
  const page = searchParams.get("page") || "1";
  const targetUrl = `https://www.approvedbusiness.co.uk/search/${category}/?page=${page}`;

  const browserlessApiKey = "2SLAHnqluSvXeMpd5f5659d8ca58eb54c3a5ac4068999d1f9";
  const browserlessUrl = "https://chrome.browserless.io/content";

  const response = await fetch(browserlessUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: targetUrl,
      waitFor: "div#searchResults",
      elements: ["div.searchResult"],
      options: {
        headless: true
      }
    }),
  });

  const html = await response.text();

  return new Response(html, {
    headers: { "Content-Type": "text/html" },
  });
};

Deno.serve(handler);

