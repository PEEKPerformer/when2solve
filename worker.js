/**
 * When2Solve Cloudflare Worker
 * Fetches a When2Meet page and extracts scheduling data as JSON.
 *
 * Deploy: npx wrangler deploy worker.js --name when2solve-api
 * Usage:  GET https://when2solve-api.<you>.workers.dev/?url=https://when2meet.com/?12345-XXXXX
 */

const ALLOWED_ORIGINS = [
  'https://bfer.land',
  'https://www.bfer.land',
  'https://peekperformer.github.io',
  'http://localhost',
  'http://127.0.0.1',
];

// In-memory rate limit: max requests per IP per window
const RATE_LIMIT = 30;
const RATE_WINDOW_MS = 60_000; // 1 minute
const ipHits = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = ipHits.get(ip);
  if (!entry || now - entry.start > RATE_WINDOW_MS) {
    ipHits.set(ip, { start: now, count: 1 });
    return true;
  }
  entry.count++;
  return entry.count <= RATE_LIMIT;
}

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.some(o => origin && origin.startsWith(o));
  return {
    'Access-Control-Allow-Origin': allowed ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
}

export default {
  async fetch(request) {
    const origin = request.headers.get('Origin') || '';
    const headers = corsHeaders(origin);

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers });
    }

    // Referer/Origin check — block requests not from our sites
    const referer = request.headers.get('Referer') || '';
    const originAllowed = ALLOWED_ORIGINS.some(o => origin.startsWith(o));
    const refererAllowed = ALLOWED_ORIGINS.some(o => referer.startsWith(o));
    if (!originAllowed && !refererAllowed) {
      return json({ error: 'Unauthorized origin' }, 403, headers);
    }

    // Rate limit by IP
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    if (!checkRateLimit(ip)) {
      return json({ error: 'Rate limit exceeded. Try again in a minute.' }, 429, headers);
    }

    const { searchParams } = new URL(request.url);
    const w2mUrl = searchParams.get('url');

    if (!w2mUrl) {
      return json({ error: 'Missing ?url= parameter' }, 400, headers);
    }

    // Validate it's a when2meet URL
    const match = w2mUrl.match(/when2meet\.com\/?\?(\d+-\w+)/i);
    if (!match) {
      return json({ error: 'Not a valid When2Meet URL' }, 400, headers);
    }

    try {
      const resp = await fetch(w2mUrl, {
        headers: { 'User-Agent': 'When2Solve/1.0 (scheduling optimizer)' },
      });

      if (!resp.ok) {
        return json({ error: `When2Meet returned ${resp.status}` }, 502, headers);
      }

      const html = await resp.text();
      const data = parse(html);

      if (!data) {
        return json({ error: 'Could not parse scheduling data from this page' }, 422, headers);
      }

      return json(data, 200, headers);
    } catch (e) {
      return json({ error: 'Failed to fetch When2Meet page: ' + e.message }, 502, headers);
    }
  },
};

function parse(html) {
  // Extract event title from <title> tag, strip "- When2meet" suffix
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const rawTitle = titleMatch ? titleMatch[1].trim() : '';
  const eventName = rawTitle.replace(/\s*[-–—]\s*when2meet\s*$/i, '').trim();

  // PeopleNames[N] = 'Name';
  const names = [];
  const nameRe = /PeopleNames\[(\d+)\]\s*=\s*'([^']+)'/g;
  let m;
  while ((m = nameRe.exec(html))) {
    names[parseInt(m[1])] = m[2];
  }

  // PeopleIDs[N] = 12345;
  const ids = [];
  const idRe = /PeopleIDs\[(\d+)\]\s*=\s*(\d+)/g;
  while ((m = idRe.exec(html))) {
    ids[parseInt(m[1])] = parseInt(m[2]);
  }

  // TimeOfSlot[N] = 12345;
  const times = [];
  const timeRe = /TimeOfSlot\[(\d+)\]\s*=\s*(\d+)/g;
  while ((m = timeRe.exec(html))) {
    times[parseInt(m[1])] = parseInt(m[2]);
  }

  // AvailableAtSlot[N].push(12345);
  const available = [];
  // Initialize arrays for all time slots
  for (let i = 0; i < times.length; i++) {
    available[i] = [];
  }
  const availRe = /AvailableAtSlot\[(\d+)\]\.push\((\d+)\)/g;
  while ((m = availRe.exec(html))) {
    const idx = parseInt(m[1]);
    if (!available[idx]) available[idx] = [];
    available[idx].push(parseInt(m[2]));
  }

  // Validate we got meaningful data
  if (names.length === 0 || times.length === 0) {
    return null;
  }

  return {
    v: 1,
    e: eventName,
    n: names,
    i: ids,
    a: available,
    t: times,
  };
}

function json(data, status, headers) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}
