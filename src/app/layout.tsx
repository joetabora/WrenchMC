import './globals.css'
import React from 'react'
import { Inter } from 'next/font/google'
import ClientProviders from '@/components/ClientProviders'
import HeaderActions from '@/components/HeaderActions'
import AnimatedLogo from '@/components/AnimatedLogo'
import { Search, Mic, Wrench, User, FilePlus } from 'lucide-react'
import Link from 'next/link'

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata = {
  title: 'WrenchMC - Harley-Davidson Technical Specs Database',
  description: 'Community-driven Harley-Davidson technical specs database. Find torque specs, bolt sizes, and more.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { href: '/search', label: 'Search', icon: Search },
    { href: '/voice', label: 'Voice', icon: Mic },
    { href: '/specs/new', label: 'Submit', icon: FilePlus },
    { href: '/profile', label: 'Profile', icon: User },
  ]

  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans min-h-screen`}>
        <ClientProviders>
          <div className="min-h-screen">
            {/* Header - Industrial/Edgy Design */}
            <header className="sticky top-0 z-50 backdrop-blur-md bg-wrench/95 border-b-2 border-wrench-chrome/20 shadow-elevated">
              <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16 md:h-20">
                  {/* Logo */}
                  <Link href="/" className="flex items-center gap-3 group">
                    <AnimatedLogo />
                    <span className="text-2xl md:text-3xl font-black gradient-text uppercase tracking-tight">WrenchMC</span>
                  </Link>

                  {/* Navigation - Bold and Aggressive */}
                  <nav className="hidden md:flex items-center gap-2">
                    {navItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider text-wrench-text-secondary hover:text-wrench-accent hover:bg-wrench-accent/10 border border-transparent hover:border-wrench-accent/30 transition-all duration-200"
                        >
                          <Icon size={18} className="stroke-[2.5]" />
                          {item.label}
                        </Link>
                      )
                    })}
                  </nav>

                  {/* Auth Actions */}
                  <div className="flex items-center gap-4">
                    <HeaderActions />
                  </div>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="relative">
              {children}
            </main>

            {/* Footer - Industrial Style */}
            <footer className="border-t-2 border-wrench-chrome/20 mt-20 py-8 bg-wrench/50">
              <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-wrench-accent" />
                    <span className="text-sm font-bold text-wrench-text-secondary uppercase tracking-wider">WrenchMC</span>
                  </div>
                  <p className="text-xs text-wrench-text-muted text-center font-medium">
                    Community-submitted specs — always verify with official Harley-Davidson manual
                  </p>
                  <div className="text-xs text-wrench-text-muted font-bold uppercase">
                    Built for riders
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </ClientProviders>
      </body>
    </html>
  )
}
