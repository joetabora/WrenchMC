"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import BikeSelector from '@/components/BikeSelector'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { motion } from 'framer-motion'
import { User, Bike, Mail, LogOut } from 'lucide-react'

export default function ProfilePage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
    }
  }, [user, router])

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
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex p-4 rounded-2xl bg-gradient-accent/20 mb-4">
            <User className="w-8 h-8 text-wrench-accent" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Your <span className="gradient-text">Profile</span>
          </h1>
          <p className="text-xl text-gray-400">
            Manage your account and bike information
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Account Info */}
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gradient-accent/20">
                <Mail className="w-5 h-5 text-wrench-accent" />
              </div>
              <h2 className="text-xl font-bold">Account Information</h2>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p className="text-gray-200 font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">User ID</p>
                <p className="text-gray-400 text-xs font-mono">{user.id}</p>
              </div>
              <Button
                variant="outline"
                onClick={async () => {
                  await signOut()
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
