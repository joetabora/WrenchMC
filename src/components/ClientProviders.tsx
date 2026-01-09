'use client'
import React from 'react'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider 
      refetchInterval={5 * 60} // Refetch session every 5 minutes
      refetchOnWindowFocus={true}
      basePath="/api/auth"
    >
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        {children}
      </ThemeProvider>
    </SessionProvider>
  )
}
