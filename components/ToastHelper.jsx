'use client'

import { useEffect } from 'react'
import { useToast } from '@/lib/toast'

export default function ToastHelper() {
  const { success, error } = useToast()

  useEffect(() => {
    // Expose global toast functions for Alpine.js and vanilla JS
    if (typeof window !== 'undefined') {
      window.showToast = (message, type = 'info') => {
        if (type === 'success') {
          success(message)
        } else if (type === 'error') {
          error(message)
        } else {
          // Default to info
          success(message)
        }
      }
    }

    return () => {
      if (typeof window !== 'undefined') {
        delete window.showToast
      }
    }
  }, [success, error])

  return null
}

