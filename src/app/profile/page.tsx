"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export const dynamic = 'force-dynamic'
import BikeSelector from '@/components/BikeSelector'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { motion } from 'framer-motion'
import { User, Bike, Mail, LogOut, Save, CheckCircle, AlertCircle, UserCircle } from 'lucide-react'
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
    // Don't redirect while loading - wait for status to be determined
    if (status === 'loading') {
      return // Still loading, don't do anything
    }
    
    // Only redirect if definitely unauthenticated
    if (status === 'unauthenticated') {
      router.push('/auth/login')
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
        setNameMessage({ type: 'success', text: 'Name updated successfully!' })
        // Update session to reflect new name
        await updateSession()
      } else {
        const { error } = await res.json()
        setNameMessage({ type: 'error', text: error || 'Failed to update name' })
      }
    } catch (error: any) {
      setNameMessage({ type: 'error', text: error.message || 'Failed to update name' })
    } finally {
      setSavingName(false)
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-6 sm:py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex p-3 sm:p-4 rounded-2xl bg-gradient-accent/20 mb-3 sm:mb-4">
            <User className="w-6 h-6 sm:w-8 sm:h-8 text-wrench-accent" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4">
            Your <span className="gradient-text">Profile</span>
          </h1>
          <p className="text-base sm:text-xl text-gray-400">
            Manage your account and bike information
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Account Info */}
          <Card>
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="p-2 rounded-lg bg-gradient-accent/20">
                <Mail className="w-5 h-5 text-wrench-accent" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold">Account Information</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <UserCircle className="w-4 h-4 inline mr-2" />
                  Display Name
                </label>
                <form onSubmit={handleUpdateName} className="flex gap-2">
                  <Input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Your name"
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    isLoading={savingName}
                    size="sm"
                    variant="outline"
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                </form>
                {nameMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center gap-2 p-2 rounded-lg mt-2 text-sm ${
                      nameMessage.type === 'success'
                        ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                        : 'bg-red-500/20 border border-red-500/30 text-red-400'
                    }`}
                  >
                    {nameMessage.type === 'success' ? (
                      <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    )}
                    <span>{nameMessage.text}</span>
                  </motion.div>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p className="text-gray-200 font-medium text-sm sm:text-base">{user.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">User ID</p>
                <p className="text-gray-400 text-xs font-mono break-all">{(user as any)?.id || 'N/A'}</p>
              </div>
              <Button
                variant="outline"
                onClick={async () => {
                  await nextAuthSignOut({ redirect: false })
                  router.push('/')
                }}
                className="w-full mt-4"
              >
                <LogOut className="w-4 h-4 inline mr-2" />
                Sign Out
              </Button>
            </div>
          </Card>

          {/* Bike Profile */}
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gradient-accent/20">
                <Bike className="w-5 h-5 text-wrench-accent" />
              </div>
              <h2 className="text-xl font-bold">My Bike</h2>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Save your primary bike to filter searches and use voice queries hands-free.
            </p>
            <BikeSelector onChange={(bike) => setProfile(bike)} />
          </Card>
        </div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <Card className="border-wrench-accent/30">
            <h3 className="text-lg font-bold mb-2">Why save your bike?</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-wrench-accent mt-1">•</span>
                <span>Get personalized search results filtered for your bike</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-wrench-accent mt-1">•</span>
                <span>Use voice queries without specifying your bike each time</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-wrench-accent mt-1">•</span>
                <span>Submit specs that are automatically tagged with your bike model</span>
              </li>
            </ul>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
