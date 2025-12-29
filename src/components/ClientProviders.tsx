"use client"
import React from 'react'
import ServiceWorkerRegister from './ServiceWorkerRegister'
import AuthProvider from './AuthProvider'

export default function ClientProviders({ children }: { children?: React.ReactNode }) {
  return (
    <AuthProvider>
      <ServiceWorkerRegister />
      {children}
    </AuthProvider>
  )
}
