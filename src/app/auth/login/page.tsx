"use client"
import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { motion } from 'framer-motion'
import { LogIn, UserPlus, Mail, Lock, CheckCircle, AlertCircle, Chrome, Loader2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const callbackUrl = searchParams.get('callbackUrl') || '/profile'
      router.push(callbackUrl)
    }
  }, [status, session, router, searchParams])

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    
    try {
      const callbackUrl = searchParams.get('callbackUrl') || '/profile'
      
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl,
      })

      if (result?.error) {
        setError(result.error || 'Failed to sign in. Please check your credentials.')
        setLoading(false)
      } else if (result?.ok || result?.url) {
        setSuccess(isSignUp ? 'Account created successfully! Redirecting...' : 'Signed in successfully! Redirecting...')
        
        // Wait a moment for session to be created, then redirect
        setTimeout(() => {
          // Force a refresh to get the new session
          window.location.href = callbackUrl
        }, 800)
      } else {
        setError('Unexpected error occurred')
        setLoading(false)
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
      setLoading(false)
    }
  }

  async function handleGoogleSignIn() {
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      await signIn('google', { callbackUrl: '/profile' })
    } catch (err: any) {
      setError(err.message || 'An error occurred during Google sign-in')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-12 flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 w-full">
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-wrench-chrome">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-xl text-wrench-chrome-dark">
            {isSignUp ? 'Join the WrenchMC Goliath community' : 'Sign in to your account'}
          </p>
        </motion.div>

        <Card>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-wrench-chrome-dark mb-2">
                <Mail className="w-4 h-4 inline mr-2 text-wrench-chrome-dark" />
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
              <label className="block text-sm font-medium text-wrench-chrome-dark mb-2">
                <Lock className="w-4 h-4 inline mr-2 text-wrench-chrome-dark" />
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
                className="flex items-center gap-2 p-3 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400"
              >
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{success}</span>
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

            <div className="text-center mt-4">
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

          <div className="relative flex items-center py-5">
            <div className="flex-grow border-t border-wrench-chrome-dark/20"></div>
            <span className="flex-shrink mx-4 text-wrench-chrome-dark text-sm">OR</span>
            <div className="flex-grow border-t border-wrench-chrome-dark/20"></div>
          </div>

          <Button
            onClick={handleGoogleSignIn}
            isLoading={loading}
            variant="secondary"
            className="w-full bg-wrench-chrome text-wrench-dark hover:bg-wrench-chrome-dark"
            size="lg"
          >
            <Chrome className="w-5 h-5 inline mr-2" />
            Continue with Google
          </Button>
        </Card>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen py-12 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-wrench-accent animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
