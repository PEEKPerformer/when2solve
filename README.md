# When2Solve

**When2Meet finds times. We find answers.**

A client-side When2Meet optimizer that takes your group's availability and instantly recommends optimal meeting times — with constraints, multi-meeting coverage, and 30 scheduling insights.

**[Try it live](https://bfer.land/when2solve/)**

## What it does

When2Meet shows you a heatmap. When2Solve tells you *what to do with it*:

- **Constraint solver** — set meeting duration (15min–2hr), mark required attendees, block out unavailable slots
- **Smart recommendations** — ranked meeting options scored by attendance, with dismiss-and-resurface
- **Multi-meeting plans** — when no single slot covers everyone, automatically finds two-meeting combos that do
- **30 scheduling insights** — from useful ("Ships in the Night: Alex and Dana never overlap") to fun ("Schedule Tetris: Blake and Casey together cover every slot")

## How to use

Go to [bfer.land/when2solve](https://bfer.land/when2solve/), paste your When2Meet link, and hit enter.

## Architecture

Everything runs in the browser. One HTML file, no build step, no framework.

```
index.html     Single-file app (HTML + CSS + JS)
worker.js      Cloudflare Worker proxy for fetching When2Meet data
wrangler.toml  Worker deployment config
INSIGHTS.md    Documentation for all 30 scheduling insights
```

The Cloudflare Worker exists only to fetch When2Meet pages server-side (avoiding CORS). It extracts the four JS arrays (`PeopleNames`, `PeopleIDs`, `AvailableAtSlot`, `TimeOfSlot`) and returns clean JSON. No data is stored or logged.

## Privacy

- All solving happens client-side in your browser
- The Worker proxies When2Meet pages to bypass CORS — it parses and discards, nothing is stored
- This app includes no tracking scripts or cookies. The site is served through Cloudflare, which collects its own server-side metrics and may set cookies — see their [privacy policy](https://www.cloudflare.com/privacypolicy/)

## Self-hosting

Clone the repo and open `index.html`. That's it — it works as a local file.

For the URL-paste feature, deploy your own Worker:

```bash
# Edit WORKER_URL in index.html to point to your worker
npx wrangler deploy worker.js --name when2solve-api
```

## License

MIT
