// Redirect old /search to /ask
'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function SearchPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/ask')
  }, [router])

  return (
    <div className="min-h-screen py-6 sm:py-12 px-4 sm:px-6 flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-wrench-accent animate-spin" />
    </div>
  )
}
