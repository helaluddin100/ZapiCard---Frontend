'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Mail, CheckCircle2, XCircle, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react'
import authAPI from '@/lib/api'
import { useAuth } from '@/lib/auth'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import logo from '../assets/images/logo.png'

function VerifyEmailForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { updateUser } = useAuth()
  const { t, lang } = useLanguage()
  const a = t.auth

  const email = searchParams.get('email')
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', ''])
  const [status, setStatus] = useState('input')
  const [countdown, setCountdown] = useState(60)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === 'error') {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [status])

  const handleCodeChange = (index, value) => {
    if (value.length > 1) return
    const newCode = [...verificationCode]
    newCode[index] = value.replace(/[^0-9]/g, '')
    setVerificationCode(newCode)
    setError('')
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`)
      if (nextInput) nextInput.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`)
      if (prevInput) prevInput.focus()
    }
  }

  const handleVerify = async () => {
    const code = verificationCode.join('')
    if (code.length !== 6) {
      setError(a.errors.codeIncomplete)
      return
    }
    if (!email) {
      setError(a.errors.emailRequired)
      return
    }

    setLoading(true)
    setStatus('verifying')
    setError('')

    try {
      const response = await authAPI.verifyEmail(email, code)
      if (response.status === 'success') {
        if (response.data?.user) updateUser(response.data.user)
        setStatus('success')
        setTimeout(() => router.push('/dashboard'), 2000)
      }
    } catch (err) {
      setStatus('error')
      setError(err.message || a.errors.codeInvalid)
      setCountdown(60)
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!email) {
      setError(a.errors.emailRequired)
      return
    }
    setLoading(true)
    setError('')
    setCountdown(60)
    try {
      await authAPI.resendVerificationCode(email)
      setStatus('input')
      setVerificationCode(['', '', '', '', '', ''])
      const firstInput = document.getElementById('code-0')
      if (firstInput) firstInput.focus()
    } catch (err) {
      setError(err.message || a.errors.resendFailed)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen bg-teal-50 dark:bg-gray-900 flex items-center justify-center px-4 py-12 pt-24 ${lang === 'bn' ? 'font-bengali' : ''}`}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="rounded-2xl p-8 shadow-xl bg-white dark:bg-gray-800 border border-teal-100 dark:border-gray-700">
          {status === 'input' && (
            <div className="text-center">
              <Link href="/" className="inline-block mb-6 hover:opacity-80">
                <Image src={logo} alt="Zapy Card Logo" width={80} height={40} className="h-auto mx-auto" priority />
              </Link>
              <h2 className="text-2xl font-bold text-teal-900 dark:text-teal-200 mb-2">{a.verifyTitle}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {a.verifySubtitle} <strong className="text-gray-900 dark:text-gray-100">{email}</strong>
              </p>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 mb-6">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <div className="flex justify-center gap-2 sm:gap-3 mb-6">
                {verificationCode.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    disabled={loading}
                    className="w-10 h-12 sm:w-12 sm:h-12 text-center text-xl sm:text-2xl font-bold border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-100"
                  />
                ))}
              </div>

              <button
                onClick={handleVerify}
                disabled={loading || verificationCode.join('').length !== 6}
                className="w-full btn-primary flex items-center justify-center mb-4 disabled:opacity-50"
              >
                {loading ? a.verifying : a.verifyBtn}
                {!loading && <ArrowRight className="ml-2 w-5 h-5" />}
              </button>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{a.noCode}</p>
              <button
                onClick={handleResend}
                disabled={loading || countdown > 0}
                className="text-teal-700 dark:text-teal-300 font-semibold hover:underline disabled:opacity-50"
              >
                {countdown > 0 ? `${a.resendIn} ${countdown}s` : a.resendCode}
              </button>
            </div>
          )}

          {status === 'verifying' && (
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 mx-auto mb-4 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center"
              >
                <RefreshCw className="w-8 h-8 text-teal-700 dark:text-teal-300" />
              </motion.div>
              <h2 className="text-2xl font-bold text-teal-900 dark:text-teal-200 mb-2">{a.verifyingTitle}</h2>
              <p className="text-gray-600 dark:text-gray-400">{a.verifyingDesc}</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-teal-700 dark:text-teal-300" />
              </div>
              <h2 className="text-2xl font-bold text-teal-900 dark:text-teal-200 mb-2">{a.verifiedTitle}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{a.verifiedDesc}</p>
              <Link href="/dashboard" className="btn-primary inline-flex items-center">
                {a.goDashboard}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{a.verifyFailed}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{error || a.errors.codeInvalid}</p>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setStatus('input')
                    setVerificationCode(['', '', '', '', '', ''])
                    setError('')
                    const firstInput = document.getElementById('code-0')
                    if (firstInput) firstInput.focus()
                  }}
                  className="w-full btn-primary"
                >
                  {a.tryAgain}
                </button>
                <button
                  onClick={handleResend}
                  disabled={countdown > 0 || loading}
                  className={`w-full btn-outline ${countdown > 0 || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span className="inline-flex items-center justify-center">
                    <Mail className="mr-2 w-5 h-5" />
                    {countdown > 0 ? `${a.resendIn} ${countdown}s` : a.resendCode}
                  </span>
                </button>
                <Link href="/login" className="block text-center text-teal-700 dark:text-teal-300 font-semibold hover:underline">
                  {a.backToLogin}
                </Link>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-teal-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-700 mx-auto" />
        </div>
      }
    >
      <VerifyEmailForm />
    </Suspense>
  )
}
