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
    <div className="flex items-center gap-1 sm:gap-2">
      {session?.user ? (
        <>
          <Link href="/profile" passHref>
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <User className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">{session.user.name || session.user.email}</span>
            </Button>
          </Link>
          <Button
            onClick={() => signOut({ callbackUrl: '/' })}
            variant="outline"
            size="sm"
            className="text-xs sm:text-sm"
          >
            <LogOut className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </>
      ) : (
        <Button onClick={() => router.push('/auth/login')} variant="primary" size="sm" className="text-xs sm:text-sm">
          <LogIn className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">Sign In</span>
        </Button>
      )}
    </div>
  )
}
