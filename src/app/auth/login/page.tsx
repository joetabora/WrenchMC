"use client"
import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { motion } from 'framer-motion'
import { LogIn, UserPlus, Mail, Lock, CheckCircle, AlertCircle, Flame } from 'lucide-react'

export const dynamic = 'force-dynamic'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status, update } = useSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)

  // Redirect if already logged in - but only after a delay to ensure session is stable
  useEffect(() => {
    if (status === 'loading') {
      return
    }
    if (status === 'authenticated' && session?.user) {
      const callbackUrl = searchParams.get('callbackUrl') || '/profile'
      const currentPath = window.location.pathname
      
      // Only redirect if we're actually on the login page
      if (currentPath === '/auth/login' && callbackUrl !== '/auth/login') {
        // Use router.push instead of window.location for smoother transition
        router.push(callbackUrl)
      }
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
      } else if (result?.ok) {
        setSuccess(isSignUp ? 'Account created!' : 'Welcome back!')
        
        // Update session
        await update()
        
        // Use router.push for smoother navigation
        setTimeout(() => {
          router.push(callbackUrl)
        }, 500)
      } else {
        setError('Unexpected error. Please try again.')
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
      setError(err.message || 'Google sign-in failed')
      setLoading(false)
    }
  }

  return (
    <div className="page-container min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            className="inline-flex p-4 rounded-3xl bg-gradient-flame mb-4 shadow-glow"
          >
            {isSignUp ? (
              <UserPlus className="w-8 h-8 text-white" />
            ) : (
              <LogIn className="w-8 h-8 text-white" />
            )}
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-wrench-text-primary">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-wrench-text-secondary">
            {isSignUp ? 'Join the WrenchMC community' : 'Sign in to continue'}
          </p>
        </motion.div>

        <Card padding="lg">
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-wrench-text-secondary mb-2">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                icon={<Mail className="w-5 h-5" />}
                size="lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-wrench-text-secondary mb-2">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                icon={<Lock className="w-5 h-5" />}
                size="lg"
                required
                minLength={6}
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 rounded-xl bg-green-500/15 border border-green-500/30 text-green-400"
              >
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{success}</span>
              </motion.div>
            )}

            <Button
              type="submit"
              isLoading={loading}
              variant="flame"
              size="lg"
              className="w-full"
            >
              {isSignUp ? (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Create Account</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Sign In</span>
                </>
              )}
            </Button>

            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError('')
                setSuccess('')
              }}
              className="w-full text-center text-sm text-wrench-accent hover:underline py-2"
            >
              {isSignUp
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"}
            </button>
          </form>

          <div className="relative flex items-center py-6">
            <div className="flex-grow border-t border-glass-border"></div>
            <span className="flex-shrink mx-4 text-wrench-text-muted text-sm">or</span>
            <div className="flex-grow border-t border-glass-border"></div>
          </div>

          <Button
            onClick={handleGoogleSignIn}
            isLoading={loading}
            variant="secondary"
            size="lg"
            className="w-full"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Continue with Google</span>
          </Button>
        </Card>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="page-container min-h-screen flex items-center justify-center">
        <div className="flame-spinner" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
