"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import Button from '@/components/ui/Button'
import { LogIn, LogOut, User } from 'lucide-react'
import Link from 'next/link'

export default function HeaderActions() {
  const router = useRouter()
  const { data: session } = useSession()

  return (
    <div className="flex items-center gap-2">
      {session?.user ? (
        <>
          <Link href="/profile" className="hidden sm:block">
            <Button variant="ghost" size="sm">
              <User className="w-4 h-4" />
              <span className="hidden md:inline ml-1">Profile</span>
            </Button>
          </Link>
          <Button
            onClick={() => signOut({ callbackUrl: '/' })}
            variant="secondary"
            size="sm"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline ml-1">Sign Out</span>
          </Button>
        </>
      ) : (
        <Button 
          onClick={() => router.push('/auth/login')} 
          variant="flame" 
          size="sm"
        >
          <LogIn className="w-4 h-4" />
          <span className="ml-1">Sign In</span>
        </Button>
      )}
    </div>
  )
}
