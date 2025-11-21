'use client'

/**
 * Lazy loaded Framer Motion wrapper for better performance
 * Only loads animation features when needed
 */
import { LazyMotion, domAnimation, m } from 'framer-motion'

export function OptimizedMotion({ children }) {
    return (
        <LazyMotion features={domAnimation} strict>
            {children}
        </LazyMotion>
    )
}

// Export motion component with lazy loading
export { m as motion }

/**
 * Fade In Animation - Optimized version
 */
export const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: 'easeOut' },
}

export const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.4 },
}

export const scaleIn = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.4, ease: 'easeOut' },
}

export const slideInLeft = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, ease: 'easeOut' },
}

export const slideInRight = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, ease: 'easeOut' },
}

/**
 * Stagger Animation for lists
 */
export const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1,
        },
    },
}

export const staggerItem = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
}

/**
 * Reduced motion support
 */
export function useReducedMotion() {
    if (typeof window === 'undefined') return false

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    return mediaQuery.matches
}

/**
 * Conditional Animation Wrapper
 * Respects user's reduced motion preferences
 */
export function ConditionalMotion({ children, animation, ...props }) {
    const prefersReducedMotion = useReducedMotion()

    if (prefersReducedMotion) {
        return <div {...props}>{children}</div>
    }

    return (
        <m.div {...animation} {...props}>
            {children}
        </m.div>
    )
}

