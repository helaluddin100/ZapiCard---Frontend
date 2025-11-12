'use client'

import { FileText } from 'lucide-react'

export default function ProductDescription({ description, showHeader = false }) {
    if (!description) return null

    return (
        <div>
            {showHeader && (
                <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Product Description</h3>
                </div>
            )}

            <div className="prose prose-sm max-w-none dark:prose-invert">
                <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {description}
                </div>
            </div>
        </div>
    )
}

