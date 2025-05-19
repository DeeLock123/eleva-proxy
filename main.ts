import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const page = searchParams.get("page") || "1";

  if (!category) {
    return new Response("Missing category", { status: 400 });
  }

  const targetURL = `https://www.approvedbusiness.co.uk/search/${category}?page=${page}`;

  try {
    const response = await fetch(targetURL);
    const html = await response.text();

    return new Response(html, {
      headers: {
        "Content-Type": "text/html",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    return new Response("Error fetching target page", { status: 500 });
  }
});
