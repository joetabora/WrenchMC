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
          <Link href="/profile" passHref>
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <User className="w-4 h-4 mr-2" />
              {session.user.name || session.user.email}
            </Button>
          </Link>
          <Button
            onClick={() => signOut({ callbackUrl: '/' })}
            variant="outline"
            size="sm"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </>
      ) : (
        <Button onClick={() => router.push('/auth/login')} variant="primary" size="sm">
          <LogIn className="w-4 h-4 mr-2" />
          Sign In
        </Button>
      )}
    </div>
  )
}
