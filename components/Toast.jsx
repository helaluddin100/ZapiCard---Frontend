'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react'
import { useToast } from '@/lib/toast'

export default function Toast() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className={`relative flex items-start gap-3 p-4 rounded-lg shadow-lg border ${
              toast.type === 'success'
                ? 'bg-green-50 border-green-200'
                : toast.type === 'error'
                ? 'bg-red-50 border-red-200'
                : toast.type === 'warning'
                ? 'bg-yellow-50 border-yellow-200'
                : 'bg-blue-50 border-blue-200'
            }`}
          >
            {/* Icon */}
            <div className="flex-shrink-0 mt-0.5">
              {toast.type === 'success' && (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              )}
              {toast.type === 'error' && (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              {toast.type === 'warning' && (
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              )}
              {toast.type === 'info' && (
                <Info className="w-5 h-5 text-blue-600" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {toast.title && (
                <h4
                  className={`text-sm font-semibold mb-1 ${
                    toast.type === 'success'
                      ? 'text-green-900'
                      : toast.type === 'error'
                      ? 'text-red-900'
                      : toast.type === 'warning'
                      ? 'text-yellow-900'
                      : 'text-blue-900'
                  }`}
                >
                  {toast.title}
                </h4>
              )}
              <p
                className={`text-sm ${
                  toast.type === 'success'
                    ? 'text-green-800'
                    : toast.type === 'error'
                    ? 'text-red-800'
                    : toast.type === 'warning'
                    ? 'text-yellow-800'
                    : 'text-blue-800'
                }`}
              >
                {toast.message}
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => removeToast(toast.id)}
              className={`flex-shrink-0 p-1 rounded-full hover:bg-opacity-20 transition ${
                toast.type === 'success'
                  ? 'text-green-600 hover:bg-green-600'
                  : toast.type === 'error'
                  ? 'text-red-600 hover:bg-red-600'
                  : toast.type === 'warning'
                  ? 'text-yellow-600 hover:bg-yellow-600'
                  : 'text-blue-600 hover:bg-blue-600'
              }`}
            >
              <X className="w-4 h-4" />
            </button>

            {/* Progress Bar */}
            {toast.duration && (
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: toast.duration / 1000, ease: 'linear' }}
                className={`absolute bottom-0 left-0 h-1 rounded-b-lg ${
                  toast.type === 'success'
                    ? 'bg-green-500'
                    : toast.type === 'error'
                    ? 'bg-red-500'
                    : toast.type === 'warning'
                    ? 'bg-yellow-500'
                    : 'bg-blue-500'
                }`}
              />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

