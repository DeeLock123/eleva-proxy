// main.ts
Deno.serve(async (req) => {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const page = searchParams.get("page") || "1";

  if (!category) {
    return new Response(JSON.stringify({ error: "Missing category" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const targetUrl = `https://www.approvedbusiness.co.uk/search/${category}?page=${page}`;

  try {
    const res = await fetch(targetUrl);
    const html = await res.text();

    const companyBlocks = [...html.matchAll(/<a class="title_link" href="\/company\/\d+\/[^"]+">([^<]+)<\/a>[\s\S]+?<a class="button" href="(https?:\/\/[^"]+)"/g)];

    const results = companyBlocks.map(([, name, website]) => ({
      name: name.trim(),
      website: website.trim(),
      source: targetUrl
    }));

    return new Response(JSON.stringify(results, null, 2), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
