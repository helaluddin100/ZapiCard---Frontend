'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState, useEffect, Suspense } from 'react'
import { Mail, CheckCircle2, XCircle, ArrowRight, RefreshCw } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

function VerifyEmailForm() {
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    const email = searchParams.get('email')
    const [status, setStatus] = useState('verifying') // 'verifying', 'success', 'error', 'expired'
    const [countdown, setCountdown] = useState(60)

    useEffect(() => {
        // Mock email verification - no backend
        // Simulate API call
        const timer = setTimeout(() => {
            if (token) {
                // Mock: token validation
                if (token === 'valid') {
                    setStatus('success')
                } else if (token === 'expired') {
                    setStatus('expired')
                } else {
                    setStatus('error')
                }
            } else {
                setStatus('error')
            }
        }, 2000)

        return () => clearTimeout(timer)
    }, [token])

    useEffect(() => {
        if (status === 'expired' || status === 'error') {
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

    const handleResend = () => {
        // Mock resend email
        console.log('Resending verification email to:', email)
        setStatus('verifying')
        setCountdown(60)
        // Simulate API call
        setTimeout(() => {
            alert('Verification email sent! Please check your inbox.')
        }, 1000)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4 py-12 pt-24">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="glass-effect rounded-2xl p-8 shadow-2xl">
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
                            <p className="text-gray-600 mb-6">
                                The verification link is invalid or has expired. Please request a new verification email.
                            </p>
                            <div className="space-y-3">
                                <button
                                    onClick={handleResend}
                                    disabled={countdown > 0}
                                    className={`w-full ${countdown > 0 ? 'btn-outline opacity-50 cursor-not-allowed' : 'btn-primary'} flex items-center justify-center`}
                                >
                                    {countdown > 0 ? (
                                        <>
                                            <Mail className="mr-2 w-5 h-5" />
                                            Resend in {countdown}s
                                        </>
                                    ) : (
                                        <>
                                            <Mail className="mr-2 w-5 h-5" />
                                            Resend Verification Email
                                        </>
                                    )}
                                </button>
                                <Link href="/login" className="block text-center text-blue-600 font-semibold hover:text-blue-700">
                                    Back to Login
                                </Link>
                            </div>
                        </motion.div>
                    )}

                    {status === 'expired' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', duration: 0.5 }}
                                className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-100 flex items-center justify-center"
                            >
                                <XCircle className="w-8 h-8 text-yellow-600" />
                            </motion.div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Link Expired</h2>
                            <p className="text-gray-600 mb-6">
                                This verification link has expired. Please request a new verification email.
                            </p>
                            <div className="space-y-3">
                                <button
                                    onClick={handleResend}
                                    disabled={countdown > 0}
                                    className={`w-full ${countdown > 0 ? 'btn-outline opacity-50 cursor-not-allowed' : 'btn-primary'} flex items-center justify-center`}
                                >
                                    {countdown > 0 ? (
                                        <>
                                            <Mail className="mr-2 w-5 h-5" />
                                            Resend in {countdown}s
                                        </>
                                    ) : (
                                        <>
                                            <Mail className="mr-2 w-5 h-5" />
                                            Resend Verification Email
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

