"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { motion } from 'framer-motion'
import { LogIn, UserPlus, Mail, Lock, CheckCircle, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const { signIn, signUp, user, signOut } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    
    try {
      const { error } = await signIn(email, password)
      if (error) {
        setError(error.message || 'Failed to sign in')
      } else {
        setSuccess('Signed in successfully!')
        setTimeout(() => router.push('/profile'), 1000)
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    
    try {
      const { data, error } = await signUp(email, password)
      if (error) {
        setError(error.message || 'Failed to sign up')
      } else {
        // Check if email confirmation is required
        if (data.user && !data.session) {
          setSuccess('Account created! Please check your email (including spam folder) to verify your account. If you don\'t receive an email, email confirmation may be disabled in Supabase settings.')
        } else {
          // Email confirmation disabled - user is automatically signed in
          setSuccess('Account created successfully!')
          setTimeout(() => router.push('/profile'), 1000)
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (user) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-md mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="text-center">
              <div className="inline-flex p-4 rounded-2xl bg-gradient-accent/20 mb-4">
                <CheckCircle className="w-8 h-8 text-wrench-accent" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Already Signed In</h2>
              <p className="text-gray-400 mb-6">You're signed in as {user.email}</p>
              <div className="flex gap-3">
                <Button onClick={() => router.push('/profile')} className="flex-1">
                  Go to Profile
                </Button>
                <Button variant="outline" onClick={() => signOut()} className="flex-1">
                  Sign Out
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-md mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex p-4 rounded-2xl bg-gradient-accent/20 mb-4">
            {isSignUp ? (
              <UserPlus className="w-8 h-8 text-wrench-accent" />
            ) : (
              <LogIn className="w-8 h-8 text-wrench-accent" />
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-xl text-gray-400">
            {isSignUp ? 'Join the WrenchMC community' : 'Sign in to your account'}
          </p>
        </motion.div>

        <Card>
          <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Lock className="w-4 h-4 inline mr-2" />
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-2 p-4 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-semibold">{success}</span>
                </div>
                {success.includes('check your email') && (
                  <div className="text-xs text-green-300/80 ml-7 space-y-1">
                    <p>• Check your spam/junk folder</p>
                    <p>• Email confirmation can be disabled in Supabase Dashboard → Authentication → Settings</p>
                    <p>• For development, you can disable "Enable email confirmations"</p>
                  </div>
                )}
              </motion.div>
            )}

            <Button
              type="submit"
              isLoading={loading}
              className="w-full"
              size="lg"
            >
              {isSignUp ? (
                <>
                  <UserPlus className="w-5 h-5 inline mr-2" />
                  Create Account
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 inline mr-2" />
                  Sign In
                </>
              )}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setError('')
                  setSuccess('')
                }}
                className="text-sm text-wrench-accent hover:underline"
              >
                {isSignUp
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Sign up"}
              </button>
            </div>
          </form>
        </Card>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center"
        >
          <p className="text-xs text-gray-500">
            By signing in, you agree to our terms of service and privacy policy
          </p>
        </motion.div>
      </div>
    </div>
  )
}
