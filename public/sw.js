// IMPORTANT:
// - Do NOT cache the homepage `/` aggressively. That can cause stale UI after deploys.
// - Use network-first for navigation (HTML) and cache-first for static assets.
// - Bump CACHE_NAME when changing SW behavior so old caches get cleaned up.
const CACHE_NAME = 'wrenchmc-v2'
const OFFLINE_URL = '/offline.html'

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Pre-cache minimal offline fallback + manifest.
      return cache.addAll([OFFLINE_URL, '/manifest.json'])
    })
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Clean up old caches.
      const keys = await caches.keys()
      await Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : Promise.resolve(true))))
      await self.clients.claim()
    })()
  )
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return

  const req = event.request

  // Navigation requests (page loads): network-first to avoid stale UI after deploys.
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req)
          // Cache a copy for offline fallback (but always prefer network).
          const cache = await caches.open(CACHE_NAME)
          cache.put(req, fresh.clone())
          return fresh
        } catch (err) {
          // Try cached page, then offline fallback.
          const cached = await caches.match(req)
          return cached || (await caches.match(OFFLINE_URL))
        }
      })()
    )
    return
  }

  // Static assets: cache-first, then network, and cache the result.
  event.respondWith(
    (async () => {
      const cached = await caches.match(req)
      if (cached) return cached
      try {
        const fresh = await fetch(req)
        const cache = await caches.open(CACHE_NAME)
        cache.put(req, fresh.clone())
        return fresh
      } catch (err) {
        // If asset fetch fails, don't force offline HTML except as a last resort.
        return (await caches.match(OFFLINE_URL)) || Response.error()
      }
    })()
  )
})
