"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import IconButton from '@/components/ui/IconButton'
import DarkModeToggle from '@/components/ui/DarkModeToggle'
import Button from '@/components/ui/Button'
import { Mic, User, LogOut } from 'lucide-react'

export default function HeaderActions() {
  const router = useRouter()
  const { user, signOut } = useAuth()
  
  return (
    <div className="flex items-center gap-2">
      <IconButton icon={Mic} label="Voice" onClick={() => router.push('/voice')} />
      {user ? (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/profile')}
            className="hidden sm:flex"
          >
            <User className="w-4 h-4 mr-2" />
            Profile
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              await signOut()
              router.push('/')
            }}
          >
            <LogOut className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Sign Out</span>
            <span className="sm:hidden">Out</span>
          </Button>
        </>
      ) : (
        <Button
          size="sm"
          onClick={() => router.push('/auth/login')}
        >
          <User className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Sign In</span>
          <span className="sm:hidden">Login</span>
        </Button>
      )}
      <DarkModeToggle />
    </div>
  )
}
