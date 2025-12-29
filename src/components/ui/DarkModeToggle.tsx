"use client"
import React, { useEffect, useState } from 'react'

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false)
  useEffect(() => {
    const root = document.documentElement
    const initial = root.classList.contains('dark')
    setIsDark(initial)
  }, [])

  function toggle() {
    const root = document.documentElement
    root.classList.toggle('dark')
    setIsDark(root.classList.contains('dark'))
  }

  return (
    <button onClick={toggle} className="px-2 py-1 border rounded">
      {isDark ? 'Light' : 'Dark'}
    </button>
  )
}
