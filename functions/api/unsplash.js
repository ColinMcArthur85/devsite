/**
 * Unsplash API Proxy
 * 
 * Cloudflare Pages Function that proxies requests to Unsplash API.
 * Includes security hardening: input validation, CORS, error sanitization.
 */

// Import helper functions (for Cloudflare Workers, these are bundled)
// For local testing, we use require(); in production, the bundler handles it
const helpers = require('./unsplash-helpers');

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  
  // Determine environment
  const environment = env.ENVIRONMENT || 'development';
  
  // Get origin for CORS
  const origin = request.headers.get('Origin') || '';
  const corsHeaders = helpers.getCorsHeaders(origin, environment);

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    });
  }

  // Only allow GET requests
  if (request.method !== 'GET') {
    return jsonResponse(
      { error: 'Method not allowed' },
      405,
      corsHeaders
    );
  }

  // Validate and sanitize query parameter
  const queryParam = url.searchParams.get("query");
  const queryResult = helpers.validateQuery(queryParam);
  
  if (!queryResult.valid) {
    return jsonResponse(
      { error: queryResult.error },
      400,
      corsHeaders
    );
  }

  // Validate pagination
  const pageParam = url.searchParams.get("page");
  const perPageParam = url.searchParams.get("per_page");
  const paginationResult = helpers.validatePagination(pageParam, perPageParam);
  
  if (!paginationResult.valid) {
    return jsonResponse(
      { error: paginationResult.error },
      400,
      corsHeaders
    );
  }

  // Optional parameters (validated)
  const orientation = url.searchParams.get("orientation");
  const color = url.searchParams.get("color");
  const orderBy = url.searchParams.get("order_by") || "relevant";

  // Validate orientation if provided
  const validOrientations = ['landscape', 'portrait', 'squarish'];
  if (orientation && !validOrientations.includes(orientation)) {
    return jsonResponse(
      { error: 'Invalid orientation value' },
      400,
      corsHeaders
    );
  }

  // Validate orderBy
  const validOrderBy = ['relevant', 'latest'];
  if (!validOrderBy.includes(orderBy)) {
    return jsonResponse(
      { error: 'Invalid order_by value' },
      400,
      corsHeaders
    );
  }

  // Build Unsplash API URL
  const unsplashUrl = new URL("https://api.unsplash.com/search/photos");
  unsplashUrl.searchParams.set("query", queryResult.sanitized);
  unsplashUrl.searchParams.set("page", String(paginationResult.page));
  unsplashUrl.searchParams.set("per_page", String(paginationResult.perPage));
  unsplashUrl.searchParams.set("order_by", orderBy);
  if (orientation) unsplashUrl.searchParams.set("orientation", orientation);
  if (color) unsplashUrl.searchParams.set("color", color);

  try {
    const response = await fetch(unsplashUrl.toString(), {
      headers: {
        Authorization: `Client-ID ${env.UNSPLASH_ACCESS_KEY}`,
      },
    });

    // Check for Unsplash API errors
    if (!response.ok) {
      const status = response.status;
      
      // Rate limiting
      if (status === 403) {
        return jsonResponse(
          { error: 'Rate limit exceeded. Please try again later.' },
          429,
          corsHeaders
        );
      }
      
      // Other errors
      return jsonResponse(
        { error: 'Unable to fetch images. Please try again.' },
        status >= 500 ? 502 : status,
        corsHeaders
      );
    }

    const data = await response.json();
    return jsonResponse(data, 200, corsHeaders);
    
  } catch (err) {
    // Sanitize error message before sending to client
    const safeMessage = helpers.sanitizeErrorMessage(
      err && err.message ? err.message : String(err)
    );
    
    return jsonResponse(
      { error: safeMessage },
      500,
      corsHeaders
    );
  }
}

/**
 * Helper to create JSON responses with consistent headers
 */
function jsonResponse(data, status, corsHeaders) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders
    },
  });
}
