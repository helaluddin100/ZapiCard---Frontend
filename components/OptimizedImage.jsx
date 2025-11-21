import Image from 'next/image'
import { useState } from 'react'

/**
 * Optimized Image Component with Next.js Image optimization
 * Features:
 * - Automatic lazy loading
 * - Responsive images
 * - Blur placeholder
 * - Error handling
 * - Fallback support
 */
export default function OptimizedImage({
    src,
    alt,
    width,
    height,
    className = '',
    priority = false,
    fill = false,
    sizes,
    fallbackSrc = '/placeholder.png',
    objectFit = 'cover',
    quality = 75,
    onError,
    ...props
}) {
    const [imgSrc, setImgSrc] = useState(src)
    const [isLoading, setIsLoading] = useState(true)

    const handleError = () => {
        setImgSrc(fallbackSrc)
        if (onError) onError()
    }

    const handleLoadingComplete = () => {
        setIsLoading(false)
    }

    // For data URLs or blob URLs, use regular img tag (Next.js Image doesn't support these)
    if (src?.startsWith('data:') || src?.startsWith('blob:')) {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={src}
                alt={alt}
                className={className}
                style={{ objectFit }}
                {...props}
            />
        )
    }

    if (fill) {
        return (
            <div className={`relative ${className}`}>
                <Image
                    src={imgSrc || fallbackSrc}
                    alt={alt}
                    fill
                    sizes={sizes || '100vw'}
                    style={{ objectFit }}
                    quality={quality}
                    priority={priority}
                    onError={handleError}
                    onLoadingComplete={handleLoadingComplete}
                    className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'
                        }`}
                    {...props}
                />
                {isLoading && (
                    <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
                )}
            </div>
        )
    }

    return (
        <div className={`relative ${className}`}>
            <Image
                src={imgSrc || fallbackSrc}
                alt={alt}
                width={width}
                height={height}
                quality={quality}
                priority={priority}
                sizes={sizes}
                style={{ objectFit }}
                onError={handleError}
                onLoadingComplete={handleLoadingComplete}
                className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'
                    }`}
                {...props}
            />
            {isLoading && (
                <div
                    className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"
                    style={{ width, height }}
                />
            )}
        </div>
    )
}

/**
 * Optimized Avatar Component
 */
export function OptimizedAvatar({
    src,
    alt,
    size = 40,
    className = '',
    fallback = null,
}) {
    const [imgError, setImgError] = useState(false)

    if (!src || imgError) {
        return (
            <div
                className={`flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold rounded-full ${className}`}
                style={{ width: size, height: size }}
            >
                {fallback || alt?.charAt(0)?.toUpperCase() || '?'}
            </div>
        )
    }

    return (
        <OptimizedImage
            src={src}
            alt={alt}
            width={size}
            height={size}
            className={`rounded-full ${className}`}
            objectFit="cover"
            onError={() => setImgError(true)}
        />
    )
}

/**
 * Optimized Background Image with gradient overlay
 */
export function OptimizedBackground({
    src,
    alt = 'Background',
    overlay = true,
    overlayClass = 'bg-gradient-to-br from-blue-600/80 via-purple-600/80 to-pink-600/80',
    children,
    className = '',
}) {
    return (
        <div className={`relative ${className}`}>
            {src && (
                <>
                    <OptimizedImage
                        src={src}
                        alt={alt}
                        fill
                        objectFit="cover"
                        quality={60}
                        priority={false}
                        sizes="100vw"
                    />
                    {overlay && <div className={`absolute inset-0 ${overlayClass}`} />}
                </>
            )}
            <div className="relative z-10">{children}</div>
        </div>
    )
}

