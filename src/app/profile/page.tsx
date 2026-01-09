"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export const dynamic = 'force-dynamic'
import BikeSelector from '@/components/BikeSelector'
import Garage from '@/components/Garage'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { motion } from 'framer-motion'
import { User, Bike, Mail, LogOut, Save, CheckCircle, AlertCircle, UserCircle, Crown, ChevronRight } from 'lucide-react'
import { signOut as nextAuthSignOut } from 'next-auth/react'

export default function ProfilePage() {
  const { data: session, status, update: updateSession } = useSession()
  const user = session?.user
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [userName, setUserName] = useState(user?.name || '')
  const [savingName, setSavingName] = useState(false)
  const [nameMessage, setNameMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    if (status === 'loading') {
      return
    }
    
    if (status === 'unauthenticated') {
      // Only redirect if we're actually on the profile page
      const currentPath = window.location.pathname
      if (currentPath === '/profile') {
        router.push('/auth/login?callbackUrl=' + encodeURIComponent('/profile'))
      }
    } else if (status === 'authenticated' && user) {
      setUserName(user.name || '')
    }
  }, [status, user, router])

  async function handleUpdateName(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return

    setSavingName(true)
    setNameMessage(null)

    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: userName }),
      })

      if (res.ok) {
        setNameMessage({ type: 'success', text: 'Name updated!' })
        await updateSession()
      } else {
        const { error } = await res.json()
        setNameMessage({ type: 'error', text: error || 'Failed to update' })
      }
    } catch (error: any) {
      setNameMessage({ type: 'error', text: error.message || 'Failed to update' })
    } finally {
      setSavingName(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="page-container flex items-center justify-center min-h-screen">
        <div className="flame-spinner" />
      </div>
    )
  }

  if (!user || status === 'unauthenticated') {
    return (
      <div className="page-container flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="flame-spinner mx-auto mb-4" />
          <p className="text-wrench-text-muted">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      {/* Header */}
      <section className="px-4 pt-6 pb-4 sm:pt-10 sm:pb-6">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            {/* Avatar */}
            <div className="relative inline-block mb-4">
              <div className="avatar w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center bg-gradient-flame">
                <User className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-wrench-surface border-2 border-wrench-accent flex items-center justify-center">
                <Bike className="w-4 h-4 text-wrench-accent" />
              </div>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-bold text-wrench-text-primary mb-1">
              {user.name || 'Rider'}
            </h1>
            <p className="text-wrench-text-secondary text-sm mb-4">
              {user.email}
            </p>

            {/* Pro badge placeholder */}
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-flame/20 border border-wrench-accent/30 text-wrench-accent text-sm font-medium haptic">
              <Crown className="w-4 h-4" />
              <span>Upgrade to Pro</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 pb-8 space-y-4">
        {/* Account Info */}
        <Card padding="lg">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-wrench-accent/15 flex items-center justify-center">
              <UserCircle className="w-5 h-5 text-wrench-accent" />
            </div>
            <h2 className="text-lg font-bold text-wrench-text-primary">Account</h2>
          </div>

          <form onSubmit={handleUpdateName} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-wrench-text-secondary mb-2">
                Display Name
              </label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Your name"
                  size="md"
                  className="flex-1"
                />
                <Button
                  type="submit"
                  isLoading={savingName}
                  size="md"
                  variant="secondary"
                >
                  <Save className="w-4 h-4" />
                </Button>
              </div>
              {nameMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-center gap-2 mt-2 text-sm ${
                    nameMessage.type === 'success' ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {nameMessage.type === 'success' ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                  <span>{nameMessage.text}</span>
                </motion.div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-wrench-text-secondary mb-1">
                Email
              </label>
              <p className="text-wrench-text-primary font-medium">{user.email || 'N/A'}</p>
            </div>
          </form>
        </Card>

        {/* Garage */}
        {true && (
          <Card padding="lg">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-wrench-accent/15 flex items-center justify-center">
                <Bike className="w-5 h-5 text-wrench-accent" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-wrench-text-primary">Garage</h2>
                <p className="text-xs text-wrench-text-muted">Manage your bikes and select the active one</p>
              </div>
            </div>
            <Garage onChange={(activeBike) => {
              if (activeBike) {
                setProfile({
                  year: activeBike.bikeYear,
                  model: activeBike.bikeModel,
                  variant: activeBike.bikeVariant,
                })
              }
            }} />
          </Card>
        )}

        {/* Legacy Bike Profile - Keep for backward compatibility */}
        <Card padding="lg" className="opacity-60">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-wrench-accent/15 flex items-center justify-center">
              <Bike className="w-5 h-5 text-wrench-accent" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-wrench-text-primary">Legacy Bike Profile</h2>
              <p className="text-xs text-wrench-text-muted">Use Garage above instead</p>
            </div>
          </div>
          <BikeSelector onChange={(bike) => setProfile(bike)} />
        </Card>

        {/* Sign Out */}
        <Button
          variant="secondary"
          size="lg"
          onClick={async () => {
            await nextAuthSignOut({ redirect: false })
            router.push('/')
          }}
          className="w-full"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </Button>
      </div>
    </div>
  )
}
