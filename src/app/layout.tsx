import './globals.css'
import React from 'react'
import ClientProviders from '@/components/ClientProviders'
import HeaderActions from '@/components/HeaderActions'
import { Search, Mic } from 'lucide-react'

export const metadata = {
  title: 'WrenchMC',
  description: 'Community-driven Harley-Davidson technical specs'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <ClientProviders>
          <div className="min-h-screen max-w-5xl mx-auto p-4">
            <header className="flex items-center justify-between py-4">
              <h1 className="text-2xl font-bold">WrenchMC</h1>
              <div className="flex items-center gap-4">
                <nav className="space-x-2 hidden md:flex items-center">
                  <a href="/search" className="hover:underline flex items-center gap-2"><Search size={16} /> Search</a>
                  <a href="/voice" className="hover:underline flex items-center gap-2"><Mic size={16} /> Voice</a>
                  <a href="/profile" className="hover:underline">Profile</a>
                  <a href="/specs/new" className="hover:underline">Submit</a>
                </nav>
                <HeaderActions />
              </div>
            </header>
            <main>{children}</main>
            <footer className="mt-8 text-sm text-gray-500">Community-submitted specs — verify with official manual.</footer>
          </div>
        </ClientProviders>
      </body>
    </html>
  )
}
