"use client"
import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'

interface ImageUploadProps {
  currentImage?: string | null
  onUpload: (url: string) => void
  onRemove?: () => void
  type: 'profile' | 'bike'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function ImageUpload({ 
  currentImage, 
  onUpload, 
  onRemove,
  type,
  size = 'md',
  className = ''
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32 sm:w-40 sm:h-40'
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB')
      return
    }

    // Show preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload file
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        const { url } = await res.json()
        setPreview(url)
        onUpload(url)
      } else {
        const { error } = await res.json()
        alert(error || 'Failed to upload image')
        setPreview(currentImage || null)
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload image')
      setPreview(currentImage || null)
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  function handleRemove() {
    setPreview(null)
    onRemove?.()
  }

  return (
    <div className={`relative ${className}`}>
      <div className={`${sizeClasses[size]} relative rounded-full overflow-hidden border-2 border-glass-border bg-wrench-light/50 flex items-center justify-center group cursor-pointer`}>
        {preview ? (
          <>
            <img 
              src={preview} 
              alt={type === 'profile' ? 'Profile' : 'Bike'} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Upload className="w-6 h-6 text-white" />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-wrench-text-muted">
            {uploading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <ImageIcon className="w-6 h-6" />
            )}
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />
      </div>

      {preview && onRemove && (
        <button
          onClick={handleRemove}
          className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors tap-target"
          type="button"
        >
          <X className="w-3 h-3 text-white" />
        </button>
      )}
    </div>
  )
}
