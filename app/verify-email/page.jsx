'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, CheckCircle2, XCircle, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import authAPI from '@/lib/api'

function VerifyEmailForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const email = searchParams.get('email')
    const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', ''])
    const [status, setStatus] = useState('input') // 'input', 'verifying', 'success', 'error'
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
        if (value.length > 1) return // Only allow single digit

        const newCode = [...verificationCode]
        newCode[index] = value.replace(/[^0-9]/g, '') // Only numbers
        setVerificationCode(newCode)
        setError('')

        // Auto-focus next input
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
            setError('Please enter the complete 6-digit code')
            return
        }

        if (!email) {
            setError('Email is required')
            return
        }

        setLoading(true)
        setStatus('verifying')
        setError('')

        try {
            const response = await authAPI.verifyEmail(email, code)

            if (response.status === 'success') {
                setStatus('success')
                // Redirect to dashboard after 2 seconds
                setTimeout(() => {
                    router.push('/dashboard')
                }, 2000)
            }
        } catch (err) {
            setStatus('error')
            setError(err.message || 'Invalid verification code. Please try again.')
            setCountdown(60)
        } finally {
            setLoading(false)
        }
    }

    const handleResend = async () => {
        if (!email) {
            setError('Email is required')
            return
        }

        setLoading(true)
        setError('')
        setCountdown(60)

        try {
            await authAPI.resendVerificationCode(email)
            setStatus('input')
            setVerificationCode(['', '', '', '', '', ''])
            // Focus first input
            const firstInput = document.getElementById('code-0')
            if (firstInput) firstInput.focus()
        } catch (err) {
            setError(err.message || 'Failed to resend verification code')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4 py-12 pt-24">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="glass-effect rounded-2xl p-8 shadow-2xl">
                    {status === 'input' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
                            <p className="text-gray-600 mb-6">
                                We&apos;ve sent a 6-digit verification code to <strong>{email}</strong>
                            </p>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 mb-6"
                                >
                                    <AlertCircle className="w-5 h-5" />
                                    <span className="text-sm">{error}</span>
                                </motion.div>
                            )}

                            <div className="flex justify-center gap-3 mb-6">
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
                                        className="w-12 h-12 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    />
                                ))}
                            </div>

                            <button
                                onClick={handleVerify}
                                disabled={loading || verificationCode.join('').length !== 6}
                                className="w-full btn-primary flex items-center justify-center mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Verifying...' : 'Verify Email'}
                                {!loading && <ArrowRight className="ml-2 w-5 h-5" />}
                            </button>

                            <div className="text-center">
                                <p className="text-sm text-gray-600 mb-2">Didn&apos;t receive the code?</p>
                                <button
                                    onClick={handleResend}
                                    disabled={loading || countdown > 0}
                                    className="text-blue-600 font-semibold hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {status === 'verifying' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center"
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center"
                            >
                                <RefreshCw className="w-8 h-8 text-blue-600" />
                            </motion.div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Your Email</h2>
                            <p className="text-gray-600">
                                Please wait while we verify your email address...
                            </p>
                        </motion.div>
                    )}

                    {status === 'success' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', duration: 0.5 }}
                                className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center"
                            >
                                <CheckCircle2 className="w-8 h-8 text-green-600" />
                            </motion.div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h2>
                            <p className="text-gray-600 mb-6">
                                Your email address has been successfully verified. You can now access all features.
                            </p>
                            <Link href="/dashboard" className="btn-primary inline-flex items-center">
                                Go to Dashboard
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                        </motion.div>
                    )}

                    {status === 'error' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', duration: 0.5 }}
                                className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center"
                            >
                                <XCircle className="w-8 h-8 text-red-600" />
                            </motion.div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
                            <p className="text-gray-600 mb-4">
                                {error || 'Invalid verification code. Please try again.'}
                            </p>
                            <div className="space-y-3">
                                <button
                                    onClick={() => {
                                        setStatus('input')
                                        setVerificationCode(['', '', '', '', '', ''])
                                        setError('')
                                        const firstInput = document.getElementById('code-0')
                                        if (firstInput) firstInput.focus()
                                    }}
                                    className="w-full btn-primary flex items-center justify-center"
                                >
                                    Try Again
                                </button>
                                <button
                                    onClick={handleResend}
                                    disabled={countdown > 0 || loading}
                                    className={`w-full ${countdown > 0 || loading ? 'btn-outline opacity-50 cursor-not-allowed' : 'btn-outline'} flex items-center justify-center`}
                                >
                                    {countdown > 0 ? (
                                        <>
                                            <Mail className="mr-2 w-5 h-5" />
                                            Resend in {countdown}s
                                        </>
                                    ) : (
                                        <>
                                            <Mail className="mr-2 w-5 h-5" />
                                            Resend Verification Code
                                        </>
                                    )}
                                </button>
                                <Link href="/login" className="block text-center text-blue-600 font-semibold hover:text-blue-700">
                                    Back to Login
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    )
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        }>
            <VerifyEmailForm />
        </Suspense>
    )
}

