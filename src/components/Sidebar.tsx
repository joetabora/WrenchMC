'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Home,
  Search,
  Database,
  Video,
  MessageSquare,
  Bike,
  Settings,
  Mic,
  Wrench,
  TrendingUp,
} from 'lucide-react'

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/query', label: 'AI Query', icon: Search },
  { href: '/database', label: 'Database', icon: Database },
  { href: '/tutorials', label: 'Tutorials', icon: Video },
  { href: '/forum', label: 'Community', icon: MessageSquare },
  { href: '/models', label: 'Models', icon: Bike },
  { href: '/voice', label: 'Voice', icon: Mic },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-wrench-dark border-r border-wrench-chrome-dark/20 z-40 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-wrench-chrome-dark/20">
        <Link href="/" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="p-2 rounded-lg bg-gradient-accent/20 group-hover:bg-gradient-accent/30 transition-colors"
          >
            <Wrench className="w-6 h-6 text-wrench-accent" />
          </motion.div>
          <div>
            <h1 className="text-xl font-bold gradient-text">WrenchMC</h1>
            <p className="text-xs text-wrench-chrome-dark">Goliath</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href))
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                ${
                  isActive
                    ? 'bg-gradient-accent/20 text-wrench-accent border-l-2 border-wrench-accent'
                    : 'text-wrench-chrome-dark hover:text-wrench-chrome hover:bg-wrench-light/30'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-wrench-chrome-dark/20">
        <div className="flex items-center gap-2 text-xs text-wrench-chrome-dark">
          <TrendingUp className="w-4 h-4" />
          <span>Powered by AI</span>
        </div>
      </div>
    </aside>
  )
}

