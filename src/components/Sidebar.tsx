"use client"
import React, { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  Sparkles,
  Video,
  Mic,
  FilePlus,
  Menu,
  X,
  User,
  Wrench,
} from 'lucide-react'
import Link from 'next/link'

const navItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Sparkles, label: 'Ask AI', href: '/ask' },
  { icon: Mic, label: 'Voice', href: '/voice' },
  { icon: Video, label: 'Tutorials', href: '/tutorials' },
  { icon: FilePlus, label: 'Submit Spec', href: '/specs/new' },
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
      {/* Mobile Menu Button - Only show on tablet */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hidden md:flex lg:hidden fixed top-4 left-4 z-50 p-3 rounded-2xl glass-card haptic"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile/Tablet Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-72 z-40 glass-card rounded-r-3xl overflow-y-auto"
            >
              <div className="p-6 pt-safe">
                {/* Logo */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-gradient-flame flex items-center justify-center">
                    <Wrench className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-wrench-text-primary">WrenchMC</h2>
                    <p className="text-xs text-wrench-text-muted">Mobile Edition</p>
                  </div>
                </div>
                
                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                      <button
                        key={item.href}
                        onClick={() => handleNavClick(item.href)}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all haptic ${
                          isActive
                            ? 'bg-wrench-accent/15 text-wrench-accent'
                            : 'text-wrench-text-secondary hover:bg-glass-light hover:text-wrench-text-primary'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                        {isActive && (
                          <motion.div
                            layoutId="sidebar-active"
                            className="ml-auto w-1.5 h-1.5 rounded-full bg-wrench-accent"
                          />
                        )}
                      </button>
                    )
                  })}
                </nav>

                {/* Profile shortcut */}
                <div className="mt-8 pt-6 border-t border-glass-border">
                  <button
                    onClick={() => handleNavClick('/profile')}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-wrench-text-secondary hover:bg-glass-light transition-all haptic"
                  >
                    <div className="avatar w-8 h-8">
                      <User className="w-4 h-4 m-auto" />
                    </div>
                    <span className="font-medium">Profile</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 glass-card rounded-none border-r border-glass-border flex-col z-30">
        <div className="p-6 flex-1 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-xl bg-gradient-flame flex items-center justify-center shadow-glow">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-wrench-text-primary">WrenchMC</h2>
              <p className="text-xs text-wrench-text-muted">Mobile Edition</p>
            </div>
          </div>
          
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                    isActive
                      ? 'bg-wrench-accent/15 text-wrench-accent shadow-inner-glow'
                      : 'text-wrench-text-secondary hover:bg-glass-light hover:text-wrench-text-primary'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="desktop-sidebar-active"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-wrench-accent"
                    />
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Profile section */}
        <div className="p-4 border-t border-glass-border">
          <Link
            href="/profile"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-wrench-text-secondary hover:bg-glass-light transition-all"
          >
            <div className="avatar w-9 h-9">
              <User className="w-4 h-4 m-auto" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-wrench-text-primary truncate">Profile</p>
              <p className="text-xs text-wrench-text-muted">View & Edit</p>
            </div>
          </Link>
        </div>
      </aside>
    </>
  )
}
