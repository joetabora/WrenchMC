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
      <body className={`${inter.variable} font-sans bg-gradient-to-br from-wrench-dark via-wrench to-wrench-light text-gray-100 min-h-screen`}>
        <ClientProviders>
          <div className="min-h-screen">
            {/* Header */}
            <header className="sticky top-0 z-50 backdrop-blur-md bg-wrench/80 border-b border-white/10">
              <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16 md:h-20">
                  {/* Logo */}
                  <Link href="/" className="flex items-center gap-3 group">
                    <AnimatedLogo />
                    <span className="text-2xl font-bold gradient-text">WrenchMC</span>
                  </Link>

                  {/* Navigation */}
                  <nav className="hidden md:flex items-center gap-1">
                    {navItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-wrench-accent hover:bg-white/5 transition-all duration-200"
                        >
                          <Icon size={16} />
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

            {/* Footer */}
            <footer className="border-t border-white/10 mt-20 py-8">
              <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-wrench-accent" />
                    <span className="text-sm text-gray-400">WrenchMC</span>
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    Community-submitted specs — always verify with official Harley-Davidson manual
                  </p>
                  <div className="text-xs text-gray-500">
                    Built for the community
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
