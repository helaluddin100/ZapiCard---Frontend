'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle2, XCircle, RefreshCw } from 'lucide-react'
import { setAuthToken } from '@/lib/api'
import { useAuth } from '@/lib/auth'
import authAPI from '@/lib/api'
import { useLanguage } from '@/lib/i18n/LanguageContext'

function GoogleCallbackHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { updateUser } = useAuth()
  const { t, lang } = useLanguage()
  const a = t.auth

  const token = searchParams.get('token')
  const status = searchParams.get('status')
  const message = searchParams.get('message')

  useEffect(() => {
    if (status === 'success' && token) {
      setAuthToken(token)

      const fetchUser = async () => {
        try {
          const response = await authAPI.getCurrentUser()
          let userData = null
          if (response?.data) userData = response.data
          else if (response?.id) userData = response
          else if (response) userData = response
          if (userData) updateUser(userData)
        } catch (error) {
          console.error('Failed to fetch user:', error)
        }
      }
      fetchUser()

      setTimeout(() => router.push('/dashboard'), 1500)
    } else if (status === 'error') {
      setTimeout(() => {
        router.push(`/login?error=${encodeURIComponent(message || a.errors.googleFailed)}`)
      }, 3000)
    }
  }, [token, status, message, router, updateUser, a.errors.googleFailed])

  const shell = `min-h-screen bg-teal-50 dark:bg-gray-900 flex items-center justify-center px-4 ${lang === 'bn' ? 'font-bengali' : ''}`

  if (status === 'success') {
    return (
      <div className={shell}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-teal-700 dark:text-teal-300" />
          </div>
          <h2 className="text-2xl font-bold text-teal-900 dark:text-teal-200 mb-2">{a.googleSuccess}</h2>
          <p className="text-gray-600 dark:text-gray-400">{a.googleRedirect}</p>
        </motion.div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className={shell}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{a.googleError}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{message || a.errors.googleFailed}</p>
          <p className="text-sm text-gray-500">{a.googleErrorDesc}</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className={shell}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center"
        >
          <RefreshCw className="w-8 h-8 text-teal-700 dark:text-teal-300" />
        </motion.div>
        <h2 className="text-2xl font-bold text-teal-900 dark:text-teal-200 mb-2">{a.googleProcessing}</h2>
        <p className="text-gray-600 dark:text-gray-400">{a.loading}</p>
      </motion.div>
    </div>
  )
}

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-teal-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-700 mx-auto" />
        </div>
      }
    >
      <GoogleCallbackHandler />
    </Suspense>
  )
}
