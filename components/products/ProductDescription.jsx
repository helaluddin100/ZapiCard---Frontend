'use client'

import { FileText } from 'lucide-react'

export default function ProductDescription({ description, showHeader = false }) {
    if (!description) return null

    return (
        <div>
            {showHeader && (
                <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <h3 className="text-xl font-bold text-gray-900">Product Description</h3>
                </div>
            )}
            
            <div className="prose prose-sm max-w-none">
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {description}
                </div>
            </div>
        </div>
    )
}

