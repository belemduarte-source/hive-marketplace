const CACHE_NAME = 'hive-v333';
const HTML_FALLBACK = '/index.html';
const ASSETS = [
  '/manifest.json',
  '/api.js'
];

// Install: cache static assets and a stale-but-loadable HTML fallback so a
// transient network blip never produces the browser's "offline" page.
self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(ASSETS);
    try {
      const html = await fetch(HTML_FALLBACK, { cache: 'no-store' });
      if (html.ok) await cache.put(HTML_FALLBACK, html.clone());
    } catch (_) {}
  })());
  self.skipWaiting();
});

// Activate: clean old caches and take control of every open page immediately.
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

// Fetch: HTML and assets are both network-first with a cached fallback;
// API requests bypass the SW entirely. Cross-origin requests (Unsplash images,
// map tiles, CDN scripts, etc.) also bypass — the previous behaviour wrapped
// every cross-origin GET, and on a flaky mobile network a transient fetch
// failure would hard-fail the resource because opaque responses are never
// cached, so the cache-fallback returned undefined. Letting the browser handle
// these directly keeps images and tiles loading even on bad signal.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (e.request.url.includes('/api/')) return;

  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;

  const isHtml = url.pathname === '/' || url.pathname.endsWith('.html') ||
                 e.request.mode === 'navigate';

  if (isHtml) {
    e.respondWith((async () => {
      try {
        const fresh = await fetch(e.request);
        if (fresh.ok) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(HTML_FALLBACK, fresh.clone()).catch(() => {});
        }
        return fresh;
      } catch (_) {
        const cached = await caches.match(HTML_FALLBACK);
        if (cached) return cached;
        return new Response(
          '<!doctype html><meta charset=utf-8><title>Hivex</title>' +
          '<body style="font-family:system-ui;padding:40px;text-align:center;background:#0f172a;color:#e2e8f0">' +
          '<h1>Sem ligação</h1><p>Verifique a sua ligação à internet e tente novamente.</p>' +
          '<button onclick="location.reload()" style="margin-top:16px;padding:10px 20px;background:#f97316;color:#fff;border:0;border-radius:8px;font-weight:700;cursor:pointer">Tentar de novo</button></body>',
          { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
        );
      }
    })());
    return;
  }

  e.respondWith(
    fetch(e.request)
      .then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(e.request))
  );
});

// ── Web Push ──────────────────────────────────────────────────────────────────
self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) {}
  e.waitUntil(self.registration.showNotification(d.title || 'Hivex', {
    body: d.body || '',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: { url: d.url || '/' },
  }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || '/';
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const c of list) { if ('focus' in c) { c.navigate(url); return c.focus(); } }
    return clients.openWindow(url);
  }));
});
