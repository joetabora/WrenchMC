"use client"
import React from 'react'

export default function IconButton({ icon: Icon, label, className = '', ...props }: any) {
  return (
    <button aria-label={label} className={`p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 ${className}`} {...props}>
      {Icon ? <Icon size={18} /> : null}
    </button>
  )
}
