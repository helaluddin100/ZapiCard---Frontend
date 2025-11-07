'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle2, XCircle, RefreshCw } from 'lucide-react'
import { setAuthToken } from '@/lib/api'

function GoogleCallbackHandler() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    const status = searchParams.get('status')
    const message = searchParams.get('message')

    useEffect(() => {
        if (status === 'success' && token) {
            // Store token
            setAuthToken(token)

            // Redirect to dashboard after a short delay
            setTimeout(() => {
                router.push('/dashboard')
            }, 2000)
        } else if (status === 'error') {
            // Redirect to login with error after a delay
            setTimeout(() => {
                router.push(`/login?error=${encodeURIComponent(message || 'Google login failed')}`)
            }, 3000)
        }
    }, [token, status, message, router])

    if (status === 'success') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4">
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
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Successful!</h2>
                    <p className="text-gray-600">Redirecting to dashboard...</p>
                </motion.div>
            </div>
        )
    }

    if (status === 'error') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4">
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
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Failed</h2>
                    <p className="text-gray-600 mb-4">{message || 'An error occurred during Google login'}</p>
                    <p className="text-sm text-gray-500">Redirecting to login page...</p>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4">
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
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing...</h2>
                <p className="text-gray-600">Please wait while we complete your login</p>
            </motion.div>
        </div>
    )
}

export default function GoogleCallbackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        }>
            <GoogleCallbackHandler />
        </Suspense>
    )
}

