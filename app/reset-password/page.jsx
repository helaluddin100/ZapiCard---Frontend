'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState, Suspense } from 'react'
import { Lock, CheckCircle2, ArrowLeft } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import logo from '../assets/images/logo.png'

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const { t, lang } = useLanguage()
  const a = t.auth

  const [formData, setFormData] = useState({ password: '', confirmPassword: '' })
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState({})

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}
    if (formData.password.length < 8) newErrors.password = a.errors.passwordMin8
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = a.errors.passwordMismatch
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    console.log('Reset password with token:', token)
    setIsSuccess(true)
    setErrors({})
  }

  if (isSuccess) {
    return (
      <div className={`min-h-screen bg-teal-50 dark:bg-gray-900 flex items-center justify-center px-4 py-12 pt-24 ${lang === 'bn' ? 'font-bengali' : ''}`}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
          <div className="rounded-2xl p-8 shadow-xl text-center bg-white dark:bg-gray-800 border border-teal-100 dark:border-gray-700">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-teal-700 dark:text-teal-300" />
            </div>
            <h2 className="text-2xl font-bold text-teal-900 dark:text-teal-200 mb-2">{a.resetSuccessTitle}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{a.resetSuccessDesc}</p>
            <Link href="/login" className="btn-primary inline-flex items-center">
              {a.goToLogin}
              <ArrowLeft className="ml-2 w-5 h-5 rotate-180" />
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-teal-50 dark:bg-gray-900 flex items-center justify-center px-4 py-12 pt-24 ${lang === 'bn' ? 'font-bengali' : ''}`}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="rounded-2xl p-8 shadow-xl bg-white dark:bg-gray-800 border border-teal-100 dark:border-gray-700">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-4 hover:opacity-80 transition-opacity">
              <Image src={logo} alt="Zapy Card Logo" width={80} height={40} className="h-auto mx-auto" priority />
            </Link>
            <h2 className="text-2xl font-bold text-teal-900 dark:text-teal-200">{a.resetTitle}</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{a.resetSubtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{a.newPassword}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value })
                    if (errors.password) setErrors({ ...errors, password: '' })
                  }}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-600 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                    errors.password ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
              <p className="text-xs text-gray-500 mt-1">{a.passwordHint}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{a.confirmNewPassword}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData({ ...formData, confirmPassword: e.target.value })
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' })
                  }}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-600 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>}
            </div>

            <button type="submit" className="w-full btn-primary flex items-center justify-center">
              {a.resetBtn}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/login" className="text-teal-700 dark:text-teal-300 font-semibold hover:underline inline-flex items-center">
              <ArrowLeft className="mr-2 w-4 h-4" />
              {a.backToLogin}
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-teal-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-700 mx-auto" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  )
}
