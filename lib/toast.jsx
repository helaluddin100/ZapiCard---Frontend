'use client'

import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random()
    const newToast = {
      id,
      type: toast.type || 'info',
      message: toast.message,
      title: toast.title,
      duration: toast.duration || 3000, // 3 seconds default
    }

    setToasts((prev) => [...prev, newToast])

    // Auto remove after duration
    if (newToast.duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, newToast.duration)
    }

    return id
  }, [])

  const success = useCallback((message, title = null, duration = 3000) => {
    return addToast({ type: 'success', message, title, duration })
  }, [addToast])

  const error = useCallback((message, title = null, duration = 3000) => {
    return addToast({ type: 'error', message, title, duration })
  }, [addToast])

  const warning = useCallback((message, title = null, duration = 3000) => {
    return addToast({ type: 'warning', message, title, duration })
  }, [addToast])

  const info = useCallback((message, title = null, duration = 3000) => {
    return addToast({ type: 'info', message, title, duration })
  }, [addToast])

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        success,
        error,
        warning,
        info,
      }}
    >
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

