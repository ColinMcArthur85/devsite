export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // CORS headers for development
  const corsHeaders = {
    'Access-Control-Allow-Origin': 'http://localhost:5173',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const query = url.searchParams.get("query");
  const page = url.searchParams.get("page") || "1";
  const perPage = url.searchParams.get("per_page") || "12";
  const orientation = url.searchParams.get("orientation");
  const color = url.searchParams.get("color");
  const orderBy = url.searchParams.get("order_by") || "relevant";

  if (!query) {
    return new Response(JSON.stringify({ error: "Missing query parameter" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      },
    });
  }

  const unsplashUrl = new URL("https://api.unsplash.com/search/photos");
  unsplashUrl.searchParams.set("query", query);
  unsplashUrl.searchParams.set("page", page);
  unsplashUrl.searchParams.set("per_page", perPage);
  unsplashUrl.searchParams.set("order_by", orderBy);
  if (orientation) unsplashUrl.searchParams.set("orientation", orientation);
  if (color) unsplashUrl.searchParams.set("color", color);

  try {
    const response = await fetch(unsplashUrl.toString(), {
      headers: {
        Authorization: `Client-ID ${env.UNSPLASH_ACCESS_KEY}`,
      },
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      },
    });
  } catch (err) {
    return new Response(`Error: ${err && err.message ? err.message : err}`, { status: 500, headers: corsHeaders });
  }
}
