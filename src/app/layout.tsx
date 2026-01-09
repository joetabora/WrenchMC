import './globals.css'
import React from 'react'
import { Inter } from 'next/font/google'
import ClientProviders from '@/components/ClientProviders'
import Sidebar from '@/components/Sidebar'
import BottomNav from '@/components/BottomNav'
import HeaderActions from '@/components/HeaderActions'
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-sf',
  display: 'swap',
})

export const metadata = {
  title: 'WrenchMC Mobile Edition - Harley-Davidson Technical Database',
  description: 'AI-powered Harley-Davidson maintenance database. Find torque specs, tutorials, and community knowledge for all models.',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    viewportFit: 'cover',
  },
  themeColor: '#000000',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'WrenchMC',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.variable} font-sans bg-wrench text-wrench-text-primary min-h-screen`}>
        <ClientProviders>
          <div className="flex min-h-screen overflow-x-hidden max-w-full">
            {/* Desktop Sidebar */}
            <Sidebar />
            
            {/* Main Content */}
            <div className="flex-1 lg:ml-64 overflow-x-hidden max-w-full min-w-0">
              {/* Top Header - Desktop only */}
              <header className="hidden lg:flex sticky top-0 z-40 px-6 py-4 items-center justify-between border-b border-glass-border bg-wrench/80 backdrop-blur-xl">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-semibold text-wrench-text-primary">WrenchMC</h2>
                  <span className="chip chip-accent text-xs">Mobile Edition</span>
                </div>
                <HeaderActions />
              </header>

              {/* Mobile Header */}
              <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 border-b border-glass-border bg-wrench/90 backdrop-blur-xl pt-safe overflow-x-hidden">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-gradient-flame flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                    </svg>
                  </div>
                  <span className="font-semibold text-wrench-text-primary truncate">WrenchMC</span>
                </div>
                <HeaderActions />
              </header>

              {/* Main Content Area */}
              <main className="relative flex-grow pb-nav-safe lg:pb-0 overflow-x-hidden max-w-full">
                {children}
              </main>

              {/* Footer - Desktop only */}
              <footer className="hidden lg:block border-t border-glass-border mt-16 py-8 bg-wrench-surface">
                <div className="max-w-7xl mx-auto px-6">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-flame/50 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-wrench-text-secondary">WrenchMC Mobile Edition</span>
                    </div>
                    <p className="text-xs text-wrench-text-muted text-center">
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
          
          {/* Mobile Bottom Navigation */}
          <BottomNav />
          
          <ServiceWorkerRegister />
        </ClientProviders>
      </body>
    </html>
  )
}
