"use client"
import { useEffect, useState } from 'react'

export default function ServiceWorkerRegister() {
  const [registered, setRegistered] = useState(false)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(() => setRegistered(true))
        .catch(() => setRegistered(false))
    }
  }, [])

  return (
    <div aria-hidden className="sr-only">
      {registered ? 'Service worker registered' : 'Service worker not registered'}
    </div>
  )
}
