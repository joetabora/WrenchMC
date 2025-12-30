"use client"
import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type User = any

type AuthContext = {
  user: User | null
  signUp: (email: string, password: string) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  signInWithGoogle: () => Promise<any>
  signOut: () => Promise<any>
}

const ctx = createContext<AuthContext | undefined>(undefined)

export function useAuth() {
  const c = useContext(ctx)
  if (!c) throw new Error('useAuth must be used within AuthProvider')
  return c
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    let mounted = true
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setUser((data.session as any)?.user || null)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser((session as any)?.user || null)
    })

    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string) => {
    const emailRedirectTo = typeof window !== 'undefined' 
      ? `${window.location.origin}/auth/login`
      : undefined
    const result = await supabase.auth.signUp({ 
      email, 
      password,
      options: emailRedirectTo ? {
        emailRedirectTo
      } : undefined
    })
    if (result.error) throw result.error
    return result
  }
  
  const signIn = async (email: string, password: string) => {
    const result = await supabase.auth.signInWithPassword({ email, password })
    if (result.error) throw result.error
    return result
  }
  
  const signInWithGoogle = async () => {
    const redirectTo = typeof window !== 'undefined' 
      ? `${window.location.origin}/auth/login`
      : undefined
    const result = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })
    if (result.error) throw result.error
    return result
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <ctx.Provider value={{ user, signUp, signIn, signInWithGoogle, signOut }}>{children}</ctx.Provider>
  )
}
