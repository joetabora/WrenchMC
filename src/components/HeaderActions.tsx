"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import IconButton from '@/components/ui/IconButton'
import DarkModeToggle from '@/components/ui/DarkModeToggle'
import { Mic } from 'lucide-react'

export default function HeaderActions() {
  const router = useRouter()
  
  return (
    <div className="flex items-center gap-2">
      <IconButton icon={Mic} label="Voice" onClick={() => router.push('/voice')} />
      <DarkModeToggle />
    </div>
  )
}
