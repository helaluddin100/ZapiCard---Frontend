'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react'

export default function Error({ error, reset }) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Application error:', error)
    }, [error])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
            <div className="max-w-md w-full text-center">
                {/* Error Icon */}
                <div className="mb-8">
                    <div className="relative inline-flex">
                        <div className="absolute inset-0 bg-red-500 dark:bg-red-600 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                        <div className="relative bg-red-100 dark:bg-red-900/30 rounded-full p-6">
                            <AlertTriangle className="w-16 h-16 text-red-600 dark:text-red-400" />
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    Oops! Something went wrong
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                    We encountered an unexpected error. Don&apos;t worry, our team has been notified.
                </p>

                {/* Error Details (only in development) */}
                {process.env.NODE_ENV === 'development' && error && (
                    <details className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-left">
                        <summary className="cursor-pointer font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">
                            Error Details (Development Only)
                        </summary>
                        <pre className="text-xs text-red-600 dark:text-red-400 overflow-auto whitespace-pre-wrap break-words">
                            {error.message}
                            {error.stack && `\n\n${error.stack}`}
                        </pre>
                    </details>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                    <button
                        onClick={reset}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
                    >
                        <RefreshCcw className="w-5 h-5" />
                        Try Again
                    </button>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-semibold rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-all transform hover:scale-105"
                    >
                        <Home className="w-5 h-5" />
                        Go Home
                    </Link>
                </div>

                {/* Help Text */}
                <p className="mt-8 text-sm text-gray-500 dark:text-gray-500">
                    If the problem persists, please{' '}
                    <Link href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">
                        contact our support team
                    </Link>
                </p>
            </div>
        </div>
    )
}

