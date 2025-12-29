import React from 'react'

export default function Button({ children, className = '', ...props }: any) {
  return (
    <button
      className={`px-4 py-2 rounded-md bg-wrench-accent text-white hover:brightness-95 disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
