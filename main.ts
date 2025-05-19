import { serve } from "https://deno.land/std/http/server.ts";

serve(async (req) => {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const page = searchParams.get("page");

  if (!category || !page) {
    return new Response("Missing query parameters", { status: 400 });
  }

  const targetUrl = `https://www.approvedbusiness.co.uk/${category}/list_${page}.aspx`;
  try {
    const response = await fetch(targetUrl);
    const html = await response.text();

    return new Response(html, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "text/html",
      },
    });
  } catch (error) {
    return new Response("Failed to fetch", { status: 500 });
  }
});
