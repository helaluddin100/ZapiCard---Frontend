'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Mail, ArrowLeft, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import logo from '../assets/images/logo.png'

export default function ForgotPasswordPage() {
  const { t, lang } = useLanguage()
  const a = t.auth
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitted(true)
  }

  return (
    <div className={`min-h-screen bg-teal-50 dark:bg-gray-900 flex items-center justify-center px-4 py-12 pt-24 ${lang === 'bn' ? 'font-bengali' : ''}`}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="rounded-2xl p-8 shadow-xl bg-white dark:bg-gray-800 border border-teal-100 dark:border-gray-700">
          {!isSubmitted ? (
            <>
              <div className="text-center mb-8">
                <Link href="/" className="inline-block mb-4 hover:opacity-80 transition-opacity">
                  <Image src={logo} alt="Zapy Card Logo" width={80} height={40} className="h-auto mx-auto" priority />
                </Link>
                <h2 className="text-2xl font-bold text-teal-900 dark:text-teal-200">{a.forgotTitle}</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">{a.forgotSubtitle}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{a.email}</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-400 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder={a.emailPlaceholder}
                    />
                  </div>
                </div>

                <button type="submit" className="w-full btn-primary flex items-center justify-center">
                  {a.sendReset}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link href="/login" className="text-teal-700 dark:text-teal-300 font-semibold hover:underline inline-flex items-center">
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  {a.backToLogin}
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                <Mail className="w-8 h-8 text-teal-700 dark:text-teal-300" />
              </div>
              <h2 className="text-2xl font-bold text-teal-900 dark:text-teal-200 mb-2">{a.checkEmail}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {a.resetSent} <span className="font-semibold text-gray-900 dark:text-gray-100">{email}</span>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{a.spamHint}</p>
              <div className="space-y-3">
                <button onClick={() => setIsSubmitted(false)} className="w-full btn-outline">
                  {a.resendEmail}
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
