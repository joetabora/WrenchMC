import React from 'react'

export default function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`p-2 border rounded-md bg-white dark:bg-gray-800 dark:text-gray-100 ${props.className || ''}`}
    />
  )
}
