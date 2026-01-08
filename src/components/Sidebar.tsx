"use client"
import React, { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  Video,
  Mic,
  FilePlus,
  Menu,
  X,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'

const navItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Sparkles, label: 'Ask', href: '/ask' },
  { icon: Mic, label: 'Voice', href: '/voice' },
  { icon: Video, label: 'Tutorials', href: '/tutorials' },
  { icon: FilePlus, label: 'Submit Spec', href: '/specs/new' },
  // Removed: AI Query, Search, Database (combined into Ask)
  // Removed: Forum (focusing on AI help, not social)
]

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleNavClick = (href: string) => {
    router.push(href)
    setIsOpen(false)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-wrench-light/50 backdrop-blur-md border border-white/10 hover:bg-wrench-light text-wrench-text-primary transition-all"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-64 z-40 bg-wrench-dark/95 backdrop-blur-xl border-r border-white/5 shadow-elevated-lg overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-semibold text-wrench-text-primary">WrenchMC</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-xl hover:bg-wrench-light/20 text-wrench-text-muted transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <nav className="space-y-1.5">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                      <button
                        key={item.href}
                        onClick={() => handleNavClick(item.href)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                          isActive
                            ? 'bg-wrench-accent/15 text-wrench-accent border border-wrench-accent/20 shadow-sm'
                            : 'text-wrench-text-secondary hover:bg-wrench-light/10 hover:text-wrench-text-primary'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    )
                  })}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-wrench-dark/95 backdrop-blur-xl border-r border-white/5 flex-col z-30">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-wrench-text-primary mb-8">WrenchMC Goliath</h2>
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? 'bg-wrench-accent/15 text-wrench-accent border border-wrench-accent/20 shadow-sm'
                      : 'text-wrench-text-secondary hover:bg-wrench-light/10 hover:text-wrench-text-primary'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>
    </>
  )
}
