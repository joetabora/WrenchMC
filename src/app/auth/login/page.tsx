"use client"
import React, { useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default function LoginPage() {
  const { signIn, signUp, user, signOut } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await signIn(email, password)
    setLoading(false)
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await signUp(email, password)
    setLoading(false)
  }

  return (
    <section>
      <h2 className="text-lg font-semibold">Sign in / Sign up</h2>
      <div className="mt-4 space-y-3 max-w-md">
        {user ? (
          <Card className="p-4">
            <p>Signed in as {user.email}</p>
            <Button className="mt-2" onClick={() => signOut()}>Sign out</Button>
          </Card>
        ) : (
          <Card className="p-4">
            <form className="space-y-3">
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
              <Input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" type="password" />
              <div className="flex gap-2">
                <Button onClick={handleSignIn}>Sign in</Button>
                <Button className="bg-white text-wrench-accent border" onClick={handleSignUp}>Sign up</Button>
              </div>
            </form>
          </Card>
        )}
      </div>
      <p className="mt-4 text-sm text-gray-500">Or sign in with Google via Supabase (enable provider in Supabase settings).</p>
    </section>
  )
}
