"use client"
import React from 'react'
import Button from '@/components/ui/Button'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  
  return (
    <section>
      <h2 className="text-xl font-semibold">Welcome to WrenchMC</h2>
      <p className="mt-4 text-gray-600 dark:text-gray-300">Find torque specs, bolt sizes, and more for your Harley.</p>
      <div className="mt-6 space-x-3">
        <Button onClick={() => router.push('/search')}>Search Specs</Button>
        <Button className="bg-white text-wrench-accent border" onClick={() => router.push('/voice')}>Hands-free Voice</Button>
      </div>
    </section>
  )
}
