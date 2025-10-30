// Netlify Function to proxy OMDb API requests and keep API key secret
// Expects either `q` (search term) or `i` (imdbID) as query parameters.

exports.handler = async function (event) {
  const API_KEY = process.env.OMDB_API_KEY || process.env.MOVIE_API_KEY;
  if (!API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "API key not configured on server" }),
    };
  }

  const qs = event.queryStringParameters || {};
  const q = qs.q || "";
  const i = qs.i || "";

  // Build OMDb URL
  const base = "https://www.omdbapi.com/";
  const params = new URLSearchParams();
  params.set("apikey", API_KEY);
  if (q) params.set("s", q);
  if (i) params.set("i", i);

  const url = `${base}?${params.toString()}`;

  try {
    const res = await fetch(url);
    const text = await res.text();
    const status = res.status || 200;

    if (status >= 400) {
      return { statusCode: status, body: text };
    }

    // Return raw JSON from OMDb
    return {
      statusCode: 200,
      body: text,
      headers: { "Content-Type": "application/json" },
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
