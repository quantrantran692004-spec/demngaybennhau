// Speed test API + (production) static host.
// - /api/ping        -> immediate 200 for RTT / jitter
// - /api/download    -> streams N bytes for download throughput
// - /api/upload      -> accepts a POST body for upload throughput
// - /api/info        -> best-effort public IP / ISP / location
// Serves the built SPA from ../dist when present.

import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes } from 'node:crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 5174;

// CORS: allow any origin in dev (Vite on :5173). Harmless when same-origin in prod.
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  next();
});

// Keep the measurement endpoints out of the cache.
app.use('/api', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/octet-stream');
  next();
});

app.get('/api/ping', (_req, res) => {
  res.status(200).send('pong');
});

app.get('/api/download', (req, res) => {
  let bytes = Number.parseInt(String(req.query.bytes), 10);
  if (!Number.isFinite(bytes) || bytes <= 0) bytes = 1024 * 1024;
  bytes = Math.min(bytes, 100 * 1024 * 1024); // cap at 100 MB
  bytes = Math.max(bytes, 1024);

  const chunk = 64 * 1024;
  const buf = randomBytes(chunk);
  let remaining = bytes;

  const send = () => {
    const c = Math.min(chunk, remaining);
    res.write(buf.subarray(0, c));
    remaining -= c;
    if (remaining > 0) setImmediate(send);
    else res.end();
  };
  send();
});

app.post('/api/upload', (req, res) => {
  let received = 0;
  req.on('data', (d) => {
    received += d.length;
  });
  req.on('end', () => {
    res.status(200).json({ received });
  });
  req.on('error', (err) => {
    // eslint-disable-next-line no-console
    console.error('upload error', err);
    res.status(500).json({ error: 'upload failed' });
  });
});

// Best-effort connection info, cached for 60s to respect free IP APIs.
const infoCache = { data: null, ts: 0 };
app.get('/api/info', async (_req, res) => {
  const now = Date.now();
  if (infoCache.data && now - infoCache.ts < 60_000) {
    res.json(infoCache.data);
    return;
  }
  try {
    const r = await fetch('https://ipapi.co/json/');
    const j = await r.json();
    const info = {
      ip: j.ip ?? '',
      isp: j.org ?? '',
      location: [j.city, j.country_name].filter(Boolean).join(', '),
    };
    if (!info.ip) {
      res.status(204).end();
      return;
    }
    infoCache.data = info;
    infoCache.ts = now;
    res.json(info);
  } catch {
    res.status(204).end();
  }
});

// Health check.
app.get('/healthz', (_req, res) => res.json({ ok: true }));

// Production: serve the built SPA.
const dist = path.join(__dirname, '..', 'dist');
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get(/^\/(?!api\/|healthz).*/, (_req, res) => {
    res.sendFile(path.join(dist, 'index.html'));
  });
} else {
  app.get('/', (_req, res) => {
    res.type('text/plain').send('SPA not built yet. Run `npm run build`, or use `npm run dev`.');
  });
}

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[speedtest] server on http://localhost:${PORT}`);
});
