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
          // Ask the browser to check for an updated SW in the background.
          // Helps ensure old caching logic is replaced quickly.
          reg.update().catch(() => {})
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
