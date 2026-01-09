"use client"
import { useEffect, useState } from 'react'

export default function ServiceWorkerRegister() {
  const [registered, setRegistered] = useState(false)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          setRegistered(true)
          // Force update to get new service worker immediately
          reg.update().catch(() => {})
          
          // Clear old caches when service worker updates
          if (reg.waiting || reg.installing) {
            // New service worker available - skip waiting and activate
            navigator.serviceWorker.addEventListener('controllerchange', () => {
              // When new service worker takes control, clear old caches
              caches.keys().then((cacheNames) => {
                cacheNames.forEach((cacheName) => {
                  if (cacheName.startsWith('wrenchmc-') && cacheName !== 'wrenchmc-v3') {
                    caches.delete(cacheName)
                  }
                })
              })
            })
          }
        })
        .catch(() => setRegistered(false))
    }
  }, [])

  return (
    <div aria-hidden className="sr-only">
      {registered ? 'Service worker registered' : 'Service worker not registered'}
    </div>
  )
}
