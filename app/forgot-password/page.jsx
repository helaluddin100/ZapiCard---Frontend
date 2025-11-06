'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Mail, ArrowLeft, ArrowRight } from 'lucide-react'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        // Mock forgot password - no backend
        console.log('Forgot password request for:', email)
        setIsSubmitted(true)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4 py-12 pt-24">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="glass-effect rounded-2xl p-8 shadow-2xl">
                    {!isSubmitted ? (
                        <>
                            <div className="text-center mb-8">
                                <Link href="/" className="text-3xl font-bold gradient-primary bg-clip-text text-transparent inline-block mb-2">
                                    Zapi Card
                                </Link>
                                <h2 className="text-2xl font-bold text-gray-900">Forgot Password?</h2>
                                <p className="text-gray-600 mt-2">
                                    No worries! Enter your email address and we&apos;ll send you a link to reset your password.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full btn-primary flex items-center justify-center"
                                >
                                    Send Reset Link
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </button>
                            </form>

                            <div className="mt-6 text-center">
                                <Link href="/login" className="text-blue-600 font-semibold hover:text-blue-700 inline-flex items-center">
                                    <ArrowLeft className="mr-2 w-4 h-4" />
                                    Back to Login
                                </Link>
                            </div>
                        </>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center"
                        >
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                                <Mail className="w-8 h-8 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h2>
                            <p className="text-gray-600 mb-6">
                                We&apos;ve sent a password reset link to <span className="font-semibold text-gray-900">{email}</span>
                            </p>
                            <p className="text-sm text-gray-500 mb-6">
                                Didn&apos;t receive the email? Check your spam folder or try again.
                            </p>
                            <div className="space-y-3">
                                <button
                                    onClick={() => setIsSubmitted(false)}
                                    className="w-full btn-outline"
                                >
                                    Resend Email
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

