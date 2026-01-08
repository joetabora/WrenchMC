// Redirect old /query to /ask
'use client'
import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

function QueryRedirect() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const q = searchParams.get('q')

  useEffect(() => {
    if (q) {
      router.replace(`/ask?q=${encodeURIComponent(q)}`)
    } else {
      router.replace('/ask')
    }
  }, [router, q])

  return (
    <div className="min-h-screen py-6 sm:py-12 px-4 sm:px-6 flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-wrench-accent animate-spin" />
    </div>
  )
}

export default function QueryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen py-6 sm:py-12 px-4 sm:px-6 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-wrench-accent animate-spin" />
      </div>
    }>
      <QueryRedirect />
    </Suspense>
  )
}
