'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState, Suspense } from 'react'
import { Lock, CheckCircle2, ArrowLeft } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

function ResetPasswordForm() {
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    })
    const [isSuccess, setIsSuccess] = useState(false)
    const [errors, setErrors] = useState({})

    const handleSubmit = (e) => {
        e.preventDefault()

        // Validation
        const newErrors = {}
        if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters'
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match'
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        // Mock reset password - no backend
        console.log('Reset password with token:', token)
        console.log('New password:', formData.password)
        setIsSuccess(true)
        setErrors({})
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4 py-12 pt-24">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md"
                >
                    <div className="glass-effect rounded-2xl p-8 shadow-2xl text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', duration: 0.5 }}
                            className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center"
                        >
                            <CheckCircle2 className="w-8 h-8 text-green-600" />
                        </motion.div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset Successful!</h2>
                        <p className="text-gray-600 mb-6">
                            Your password has been successfully reset. You can now login with your new password.
                        </p>
                        <Link href="/login" className="btn-primary inline-flex items-center">
                            Go to Login
                            <ArrowLeft className="ml-2 w-5 h-5 rotate-180" />
                        </Link>
                    </div>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4 py-12 pt-24">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="glass-effect rounded-2xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <Link href="/" className="text-3xl font-bold gradient-primary bg-clip-text text-transparent inline-block mb-2">
                            Zapi Card
                        </Link>
                        <h2 className="text-2xl font-bold text-gray-900">Reset Your Password</h2>
                        <p className="text-gray-600 mt-2">Enter your new password below</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                New Password *
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => {
                                        setFormData({ ...formData, password: e.target.value })
                                        if (errors.password) setErrors({ ...errors, password: '' })
                                    }}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${errors.password ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && (
                                <p className="text-xs text-red-600 mt-1">{errors.password}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm New Password *
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={(e) => {
                                        setFormData({ ...formData, confirmPassword: e.target.value })
                                        if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' })
                                    }}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full btn-primary flex items-center justify-center"
                        >
                            Reset Password
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link href="/login" className="text-blue-600 font-semibold hover:text-blue-700 inline-flex items-center">
                            <ArrowLeft className="mr-2 w-4 h-4" />
                            Back to Login
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        }>
            <ResetPasswordForm />
        </Suspense>
    )
}

