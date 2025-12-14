'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, User, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react'
import authAPI from '@/lib/api'
import { useAuth } from '@/lib/auth'
import logo from '../assets/images/logo.png'

export default function SignupPage() {
  const router = useRouter()
  const { updateUser } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [googleLoginRequired, setGoogleLoginRequired] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false
  })

  const validateName = (name) => {
    if (!name) {
      return 'Name is required'
    }
    if (name.length < 2) {
      return 'Name must be at least 2 characters'
    }
    return ''
  }

  const validateEmail = (email) => {
    if (!email) {
      return 'Email is required'
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address'
    }
    return ''
  }

  const validatePassword = (password) => {
    if (!password) {
      return 'Password is required'
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters'
    }
    return ''
  }

  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) {
      return 'Please confirm your password'
    }
    if (confirmPassword !== password) {
      return 'Passwords do not match'
    }
    return ''
  }

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true })

    if (field === 'name') {
      const nameError = validateName(formData.name)
      setFieldErrors({ ...fieldErrors, name: nameError })
    } else if (field === 'email') {
      const emailError = validateEmail(formData.email)
      setFieldErrors({ ...fieldErrors, email: emailError })
    } else if (field === 'password') {
      const passwordError = validatePassword(formData.password)
      setFieldErrors({ ...fieldErrors, password: passwordError })
      // Also validate confirm password if it's been touched
      if (touched.confirmPassword) {
        const confirmError = validateConfirmPassword(formData.confirmPassword, formData.password)
        setFieldErrors({ ...fieldErrors, confirmPassword: confirmError })
      }
    } else if (field === 'confirmPassword') {
      const confirmError = validateConfirmPassword(formData.confirmPassword, formData.password)
      setFieldErrors({ ...fieldErrors, confirmPassword: confirmError })
    }
  }

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
    // Clear error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors({ ...fieldErrors, [field]: '' })
    }
    // Clear general error when user starts typing
    if (error) {
      setError('')
      setGoogleLoginRequired(false)
    }
    // Re-validate confirm password if password changes
    if (field === 'password' && touched.confirmPassword) {
      const confirmError = validateConfirmPassword(formData.confirmPassword, value)
      setFieldErrors({ ...fieldErrors, confirmPassword: confirmError })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validate all fields
    const nameError = validateName(formData.name)
    const emailError = validateEmail(formData.email)
    const passwordError = validatePassword(formData.password)
    const confirmError = validateConfirmPassword(formData.confirmPassword, formData.password)

    setFieldErrors({
      name: nameError,
      email: emailError,
      password: passwordError,
      confirmPassword: confirmError
    })

    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true
    })

    // If there are validation errors, don't submit
    if (nameError || emailError || passwordError || confirmError) {
      return
    }

    setLoading(true)

    try {
      const response = await authAPI.register(formData)

      if (response.status === 'success') {
        // Redirect to email verification page
        router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`)
      }
    } catch (err) {
      const errorMessage = err.message || 'Registration failed. Please try again.'

      // Check if this is a Google login required error
      if (err.response?.data?.google_login_required ||
        (errorMessage.toLowerCase().includes('google') &&
          errorMessage.toLowerCase().includes('login'))) {
        setGoogleLoginRequired(true)
        setError('This email is already registered with Google. Please login with Google instead.')
        setFieldErrors({ ...fieldErrors, email: 'This email is already registered with Google. Please login with Google instead.' })
      } else {
        setGoogleLoginRequired(false)
        setError(errorMessage)
        // Check if email already exists
        if (errorMessage.toLowerCase().includes('email') &&
          (errorMessage.toLowerCase().includes('already') ||
            errorMessage.toLowerCase().includes('exists') ||
            errorMessage.toLowerCase().includes('taken'))) {
          setFieldErrors({ ...fieldErrors, email: 'This email is already registered' })
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
        // Detect if production based on hostname
        const isProduction = typeof window !== 'undefined' &&
          (window.location.hostname === 'zapycard.com' ||
            window.location.hostname === 'www.zapycard.com' ||
            window.location.hostname === 'smart.buytiq.store' ||
            window.location.hostname === 'www.smart.buytiq.store')

        // Use appropriate backend URL
        const backendUrl = isProduction
          ? 'https://smart.buytiq.store'
          : 'http://localhost:8000'

        // Redirect to backend Google OAuth endpoint
        window.location.href = `${backendUrl}/login/google`
      }
    } catch (err) {
      setError(err.message || `${provider} signup failed`)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 py-12 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl"
      >
        <div className="glass-effect rounded-2xl p-8 shadow-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-4 hover:opacity-80 transition-opacity">
              <Image
                src={logo}
                alt="Zapy Card Logo"
                width={80}
                height={40}
                className="h-auto mx-auto"
                priority
              />
            </Link>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Create Your Account</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Start building your smart visiting card</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${googleLoginRequired
                ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400'
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'} px-4 py-3 rounded-lg flex items-center gap-2 mb-6`}
            >
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  onBlur={() => handleBlur('name')}
                  disabled={loading}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 ${touched.name && fieldErrors.name
                    ? 'border-red-500 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                    }`}
                  placeholder="John Doe"
                />
              </div>
              {touched.name && fieldErrors.name && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  {fieldErrors.name}
                </motion.p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  disabled={loading}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 ${touched.email && fieldErrors.email
                    ? 'border-red-500 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                    }`}
                  placeholder="you@example.com"
                />
              </div>
              {touched.email && fieldErrors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  {fieldErrors.email}
                </motion.p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  onBlur={() => handleBlur('password')}
                  disabled={loading}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 ${touched.password && fieldErrors.password
                    ? 'border-red-500 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                    }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {touched.password && fieldErrors.password ? (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  {fieldErrors.password}
                </motion.p>
              ) : (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Must be at least 6 characters</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  onBlur={() => handleBlur('confirmPassword')}
                  disabled={loading}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 ${touched.confirmPassword && fieldErrors.confirmPassword
                    ? 'border-red-500 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                    }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {touched.confirmPassword && fieldErrors.confirmPassword && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  {fieldErrors.confirmPassword}
                </motion.p>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
              {!loading && <ArrowRight className="ml-2 w-5 h-5" />}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or continue with</span>
            </div>
          </div>

          {/* Social Login Buttons - Moved below Create Account */}
          <div className="space-y-3">
            <motion.button
              type="button"
              onClick={() => handleSocialLogin('google')}
              disabled={loading}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 hover:border-red-400 dark:hover:border-red-500 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 dark:hover:from-red-900/20 dark:hover:to-orange-900/20 shadow-md hover:shadow-lg group"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 via-red-600 to-orange-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="white"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="white"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="white"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="white"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </div>
              <span className="text-gray-700 dark:text-gray-300 font-medium">Continue with Google</span>
            </motion.button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
