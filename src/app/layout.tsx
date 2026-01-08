import './globals.css'
import React from 'react'
import { Inter } from 'next/font/google'
import ClientProviders from '@/components/ClientProviders'
import Sidebar from '@/components/Sidebar'
import HeaderActions from '@/components/HeaderActions'
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata = {
  title: 'WrenchMC Goliath - Ultimate Harley-Davidson Technical Database',
  description: 'AI-powered Harley-Davidson maintenance database. Find torque specs, tutorials, and community knowledge for all models from 1903 to now.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans bg-wrench-dark text-wrench-chrome min-h-screen`}>
        <ClientProviders>
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 lg:ml-64">
              {/* Top Header */}
              <header className="sticky top-0 z-30 backdrop-blur-xl bg-wrench-dark/80 border-b border-white/5 shadow-elevated">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-4">
                      <h2 className="text-base sm:text-lg font-semibold text-wrench-text-primary">WrenchMC Goliath</h2>
                    </div>
                    <HeaderActions />
                  </div>
                </div>
              </header>

              {/* Main Content */}
              <main className="relative flex-grow">
                {children}
              </main>

              {/* Footer */}
              <footer className="border-t border-white/5 mt-16 sm:mt-24 py-8 sm:py-10 bg-wrench-dark/30 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-wrench-text-muted font-medium">WrenchMC Goliath</span>
                    </div>
                    <p className="text-xs text-wrench-text-muted text-center px-4 max-w-2xl">
                      Community-submitted specs — always verify with official Harley-Davidson manual
                    </p>
                    <div className="text-xs text-wrench-text-muted">
                      Built for the community
                    </div>
                  </div>
                </div>
              </footer>
            </div>
          </div>
          {/* Keeps SW updated so users don't get stale cached UI across deploys */}
          <ServiceWorkerRegister />
        </ClientProviders>
      </body>
    </html>
  )
}
