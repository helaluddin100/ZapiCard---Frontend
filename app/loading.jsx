import { Loader2 } from 'lucide-react'

export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="text-center">
                {/* Animated Logo/Spinner */}
                <div className="relative mb-8">
                    <div className="w-24 h-24 mx-auto">
                        <Loader2 className="w-24 h-24 text-blue-600 dark:text-blue-400 animate-spin" />
                    </div>
                    {/* Pulsing ring effect */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-ping opacity-20"></div>
                    </div>
                </div>

                {/* Loading text */}
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Loading Zapy Card...
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Please wait while we prepare your experience
                </p>

                {/* Loading bar */}
                <div className="mt-8 w-64 mx-auto">
                    <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-loading-bar"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

