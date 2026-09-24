// Cloudflare Worker: proxies OpenSky Network's REST API and adds CORS
// headers, since OpenSky doesn't send them and browsers can't call it
// directly. Deploy with `npx wrangler deploy` from this directory.

export default {
  async fetch(request) {
    const url = new URL(request.url)

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders() })
    }

    const target = `https://opensky-network.org/api${url.pathname}${url.search}`

    const upstream = await fetch(target, {
      headers: { 'User-Agent': 'ops-control-demo (github.com)' },
    })

    const body = await upstream.arrayBuffer()

    return new Response(body, {
      status: upstream.status,
      headers: {
        'Content-Type': upstream.headers.get('Content-Type') ?? 'application/json',
        'Cache-Control': 'public, max-age=8',
        ...corsHeaders(),
      },
    })
  },
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}
