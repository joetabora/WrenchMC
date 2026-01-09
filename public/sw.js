const CACHE_NAME = 'wrenchmc-mobile-v1'
const OFFLINE_URL = '/offline.html'

// Assets to precache
const PRECACHE_ASSETS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
]

// Install - precache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME)
      await cache.addAll(PRECACHE_ASSETS)
      await self.skipWaiting()
    })()
  )
})

// Activate - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys()
      await Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
      await self.clients.claim()
    })()
  )
})

// Fetch - network-first for navigation, cache-first for assets
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return

  const req = event.request
  const url = new URL(req.url)

  // Never cache auth-related requests
  if (url.pathname.startsWith('/auth/') || 
      url.pathname.startsWith('/api/auth/') ||
      url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(req))
    return
  }

  // Navigation requests: network-first
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req)
          const cache = await caches.open(CACHE_NAME)
          cache.put(req, fresh.clone())
          return fresh
        } catch (err) {
          const cached = await caches.match(req)
          return cached || (await caches.match(OFFLINE_URL))
        }
      })()
    )
    return
  }

  // Static assets: cache-first
  event.respondWith(
    (async () => {
      const cached = await caches.match(req)
      if (cached) return cached
      
      try {
        const fresh = await fetch(req)
        // Only cache successful responses
        if (fresh.ok) {
          const cache = await caches.open(CACHE_NAME)
          cache.put(req, fresh.clone())
        }
        return fresh
      } catch (err) {
        return Response.error()
      }
    })()
  )
})

// Background sync for offline queries (future feature)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-queries') {
    // Handle offline query sync
  }
})

// Push notifications (future feature)
self.addEventListener('push', (event) => {
  if (!event.data) return
  
  const data = event.data.json()
  const options = {
    body: data.body,
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    vibrate: [100, 50, 100],
    data: { url: data.url || '/' },
  }
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'WrenchMC', options)
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      if (clientList.length > 0) {
        return clientList[0].focus()
      }
      return clients.openWindow(event.notification.data.url || '/')
    })
  )
})
