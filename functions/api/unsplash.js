export async function onRequest(context) {
  const { request, env } = context;
  const incomingUrl = new URL(request.url);

  const unsplashUrl = new URL("https://api.unsplash.com/search/photos");

  for (const [key, value] of incomingUrl.searchParams.entries()) {
    if (["page", "query", "per_page", "orientation", "color", "order_by"].includes(key)) {
      unsplashUrl.searchParams.set(key, value);
    }
  }

  unsplashUrl.searchParams.set("client_id", env.UNSPLASH_ACCESS_KEY);

  const res = await fetch(unsplashUrl.toString(), {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  const data = await res.text();

  return new Response(data, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}
