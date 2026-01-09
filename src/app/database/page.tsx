// Redirect old /database to /ask
'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default function DatabasePage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/ask')
  }, [router])

  return (
    <div className="page-container flex items-center justify-center min-h-screen">
      <div className="flame-spinner" />
    </div>
  )
}
