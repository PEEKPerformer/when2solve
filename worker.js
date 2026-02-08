/**
 * When2Solve Cloudflare Worker
 * Fetches a When2Meet page and extracts scheduling data as JSON.
 *
 * Deploy: npx wrangler deploy worker.js --name when2solve-api
 * Usage:  GET https://when2solve-api.<you>.workers.dev/?url=https://when2meet.com/?12345-XXXXX
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const { searchParams } = new URL(request.url);
    const w2mUrl = searchParams.get('url');

    if (!w2mUrl) {
      return json({ error: 'Missing ?url= parameter' }, 400);
    }

    // Validate it's a when2meet URL
    const match = w2mUrl.match(/when2meet\.com\/?\?(\d+-\w+)/i);
    if (!match) {
      return json({ error: 'Not a valid When2Meet URL' }, 400);
    }

    try {
      const resp = await fetch(w2mUrl, {
        headers: { 'User-Agent': 'When2Solve/1.0 (scheduling optimizer)' },
      });

      if (!resp.ok) {
        return json({ error: `When2Meet returned ${resp.status}` }, 502);
      }

      const html = await resp.text();
      const data = parse(html);

      if (!data) {
        return json({ error: 'Could not parse scheduling data from this page' }, 422);
      }

      return json(data, 200);
    } catch (e) {
      return json({ error: 'Failed to fetch When2Meet page: ' + e.message }, 502);
    }
  },
};

function parse(html) {
  // Extract event title from <title> tag
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const rawTitle = titleMatch ? titleMatch[1].trim() : '';
  // When2Meet titles are just the event name (no prefix to strip)
  const eventName = rawTitle;

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

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}
