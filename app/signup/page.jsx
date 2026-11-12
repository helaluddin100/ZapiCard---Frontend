'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, User, ArrowRight, AlertCircle, Eye, EyeOff, Phone } from 'lucide-react'
import authAPI from '@/lib/api'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import logo from '../assets/images/logo.png'

export default function SignupPage() {
  const router = useRouter()
  const { t, lang } = useLanguage()
  const a = t.auth

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [googleLoginRequired, setGoogleLoginRequired] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
    password: false,
    confirmPassword: false,
  })

  const validateName = (name) => {
    if (!name) return a.errors.nameRequired
    if (name.length < 2) return a.errors.nameMin
    return ''
  }

  const validateEmail = (email) => {
    if (!email) return a.errors.emailRequired
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return a.errors.emailInvalid
    return ''
  }

  const validatePhone = (phone) => {
    if (!phone) return a.errors.phoneRequired
    if (!/^[\d\s\-\+\(\)]+$/.test(phone)) return a.errors.phoneInvalid
    if (phone.replace(/\D/g, '').length < 10) return a.errors.phoneInvalid
    return ''
  }

  const validatePassword = (password) => {
    if (!password) return a.errors.passwordRequired
    if (password.length < 6) return a.errors.passwordMin6
    return ''
  }

  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) return a.errors.passwordRequired
    if (confirmPassword !== password) return a.errors.passwordMismatch
    return ''
  }

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true })
    const next = { ...fieldErrors }
    if (field === 'name') next.name = validateName(formData.name)
    if (field === 'email') next.email = validateEmail(formData.email)
    if (field === 'phone') next.phone = validatePhone(formData.phone)
    if (field === 'password') next.password = validatePassword(formData.password)
    if (field === 'confirmPassword') next.confirmPassword = validateConfirmPassword(formData.confirmPassword, formData.password)
    setFieldErrors(next)
  }

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
    if (fieldErrors[field]) setFieldErrors({ ...fieldErrors, [field]: '' })
    if (error) {
      setError('')
      setGoogleLoginRequired(false)
    }
    if (field === 'password' && touched.confirmPassword) {
      setFieldErrors({
        ...fieldErrors,
        confirmPassword: validateConfirmPassword(formData.confirmPassword, value),
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const nameError = validateName(formData.name)
    const emailError = validateEmail(formData.email)
    const phoneError = validatePhone(formData.phone)
    const passwordError = validatePassword(formData.password)
    const confirmError = validateConfirmPassword(formData.confirmPassword, formData.password)

    setFieldErrors({
      name: nameError,
      email: emailError,
      phone: phoneError,
      password: passwordError,
      confirmPassword: confirmError,
    })
    setTouched({ name: true, email: true, phone: true, password: true, confirmPassword: true })

    if (nameError || emailError || phoneError || passwordError || confirmError) return

    setLoading(true)
    try {
      const response = await authAPI.register(formData)
      if (response.status === 'success') {
        router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`)
      }
    } catch (err) {
      const errorMessage = err.message || 'Registration failed. Please try again.'
      if (
        err.response?.data?.google_login_required ||
        (errorMessage.toLowerCase().includes('google') && errorMessage.toLowerCase().includes('login'))
      ) {
        setGoogleLoginRequired(true)
        setError(errorMessage)
        setFieldErrors({ ...fieldErrors, email: errorMessage })
      } else {
        setGoogleLoginRequired(false)
        setError(errorMessage)
        if (errorMessage.toLowerCase().includes('email') &&
          (errorMessage.toLowerCase().includes('already') ||
            errorMessage.toLowerCase().includes('exists') ||
            errorMessage.toLowerCase().includes('taken'))) {
          setFieldErrors({ ...fieldErrors, email: errorMessage })
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = async (provider) => {
    setError('')
    setLoading(true)
    try {
      if (provider === 'google') {
        const isProduction = typeof window !== 'undefined' &&
          (window.location.hostname === 'zapycard.com' ||
            window.location.hostname === 'www.zapycard.com' ||
            window.location.hostname === 'admin.zapycard.com' ||
            window.location.hostname === 'www.admin.zapycard.com')
        const backendUrl = isProduction ? 'https://admin.zapycard.com' : 'http://localhost:8000'
        window.location.href = `${backendUrl}/login/google`
      }
    } catch (err) {
      setError(err.message || a.errors.googleFailed)
      setLoading(false)
    }
  }

  const inputClass = (hasError) =>
    `w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-400 focus:border-transparent outline-none transition disabled:bg-gray-100 dark:disabled:bg-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
      hasError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'
    }`

  return (
    <div className={`min-h-screen bg-teal-50 dark:bg-gray-900 flex items-center justify-center px-4 py-12 pt-24 ${lang === 'bn' ? 'font-bengali' : ''}`}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-xl">
        <div className="rounded-2xl p-8 shadow-xl bg-white dark:bg-gray-800 border border-teal-100 dark:border-gray-700">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-4 hover:opacity-80 transition-opacity">
              <Image src={logo} alt="Zapy Card Logo" width={80} height={40} className="h-auto mx-auto" priority />
            </Link>
            <h2 className="text-2xl font-bold text-teal-900 dark:text-teal-200">{a.createAccount}</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{a.signupSubtitle}</p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {googleLoginRequired && (
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              className="w-full mb-4 btn-primary"
            >
              {a.continueGoogle}
            </button>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{a.name}</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  onBlur={() => handleBlur('name')}
                  disabled={loading}
                  className={inputClass(touched.name && fieldErrors.name)}
                  placeholder={a.namePlaceholder}
                />
              </div>
              {touched.name && fieldErrors.name && <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{a.email}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  disabled={loading}
                  className={inputClass(touched.email && fieldErrors.email)}
                  placeholder={a.emailPlaceholder}
                />
              </div>
              {touched.email && fieldErrors.email && <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{a.phone}</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  onBlur={() => handleBlur('phone')}
                  disabled={loading}
                  className={inputClass(touched.phone && fieldErrors.phone)}
                  placeholder={a.phonePlaceholder}
                />
              </div>
              {touched.phone && fieldErrors.phone && <p className="mt-1 text-sm text-red-600">{fieldErrors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{a.password}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  onBlur={() => handleBlur('password')}
                  disabled={loading}
                  className={`${inputClass(touched.password && fieldErrors.password)} pr-12`}
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {touched.password && fieldErrors.password && <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{a.confirmPassword}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  onBlur={() => handleBlur('confirmPassword')}
                  disabled={loading}
                  className={`${inputClass(touched.confirmPassword && fieldErrors.confirmPassword)} pr-12`}
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {touched.confirmPassword && fieldErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400">{a.termsAgree}</p>

            <button type="submit" disabled={loading} className="w-full btn-primary flex items-center justify-center disabled:opacity-50">
              {loading ? a.creating : a.createAccountBtn}
              {!loading && <ArrowRight className="ml-2 w-5 h-5" />}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">{a.orContinue}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleSocialLogin('google')}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl font-semibold border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-teal-500 disabled:opacity-50 transition"
          >
            <div className="w-9 h-9 rounded-full bg-red-500 flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="white" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="white" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="white" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </div>
            <span className="text-gray-700 dark:text-gray-300">{a.continueGoogle}</span>
          </button>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              {a.haveAccount}{' '}
              <Link href="/login" className="text-teal-700 dark:text-teal-300 font-semibold hover:underline">
                {a.signIn}
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
