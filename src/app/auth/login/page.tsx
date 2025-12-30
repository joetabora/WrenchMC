"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { motion } from 'framer-motion'
import { LogIn, UserPlus, Mail, Lock, CheckCircle, AlertCircle } from 'lucide-react'

// Google icon SVG component
function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

export default function LoginPage() {
  const { signIn, signUp, signInWithGoogle, user, signOut } = useAuth()
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

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-wrench-DEFAULT text-gray-400">Or continue with</span>
            </div>
          </div>

          {/* Google Sign In */}
          <Button
            type="button"
            variant="outline"
            onClick={async () => {
              setLoading(true)
              setError('')
              try {
                await signInWithGoogle()
                // Redirect will happen automatically via OAuth callback
              } catch (err: any) {
                setError(err.message || 'Failed to sign in with Google')
                setLoading(false)
              }
            }}
            isLoading={loading}
            className="w-full"
            size="lg"
          >
            <GoogleIcon />
            <span className="ml-2">Continue with Google</span>
          </Button>
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
