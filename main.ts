import { serve } from "https://deno.land/std/http/server.ts";

serve(async (req) => {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const page = searchParams.get("page");

  if (!category || !page) {
    return new Response("Missing query parameters", { status: 400 });
  }

  const targetUrl = `https://www.approvedbusiness.co.uk/${category}/list_${page}.aspx`;
  console.log(`🔍 Fetching: ${targetUrl}`);

  try {
    const rawHtml = await fetch(targetUrl).then(res => res.text());

    return new Response(rawHtml, {
      headers: { "Content-Type": "text/html" },
    });
  } catch (err) {
    return new Response(`❌ Error fetching target: ${err.message}`, { status: 500 });
  }
});
