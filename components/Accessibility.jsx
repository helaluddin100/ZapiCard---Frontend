/**
 * Accessibility Components and Utilities
 * Improve keyboard navigation, screen readers, and ARIA support
 */

/**
 * Skip to Content Link
 * Allows keyboard users to skip navigation
 */
export function SkipToContent() {
    return (
        <a
            href="#main-content"
            className="skip-to-content"
        >
            Skip to main content
        </a>
    )
}

/**
 * Accessible Button
 * Enhanced button with proper ARIA attributes
 */
export function AccessibleButton({
    children,
    onClick,
    disabled = false,
    ariaLabel,
    ariaPressed,
    className = '',
    variant = 'primary',
    ...props
}) {
    const baseClasses = 'focus-visible-ring transition-all'
    const variantClasses = {
        primary: 'btn-primary',
        secondary: 'btn-outline',
        ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800',
    }

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            aria-label={ariaLabel}
            aria-pressed={ariaPressed}
            aria-disabled={disabled}
            className={`${baseClasses} ${variantClasses[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            {...props}
        >
            {children}
        </button>
    )
}

/**
 * Accessible Link
 * Enhanced link with proper ARIA attributes
 */
export function AccessibleLink({
    href,
    children,
    external = false,
    ariaLabel,
    className = '',
    ...props
}) {
    const externalProps = external
        ? {
            target: '_blank',
            rel: 'noopener noreferrer',
            'aria-label': ariaLabel || `${children} (opens in new tab)`,
        }
        : { 'aria-label': ariaLabel }

    return (
        <a
            href={href}
            className={`focus-visible-ring ${className}`}
            {...externalProps}
            {...props}
        >
            {children}
        </a>
    )
}

/**
 * Accessible Form Label
 */
export function FormLabel({ htmlFor, required = false, children, className = '' }) {
    return (
        <label
            htmlFor={htmlFor}
            className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ${className}`}
        >
            {children}
            {required && (
                <span className="text-red-500 ml-1" aria-label="required">
                    *
                </span>
            )}
        </label>
    )
}

/**
 * Accessible Form Input
 */
export function FormInput({
    id,
    type = 'text',
    value,
    onChange,
    placeholder,
    required = false,
    error,
    ariaDescribedBy,
    className = '',
    ...props
}) {
    return (
        <div className="w-full">
            <input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                aria-required={required}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : ariaDescribedBy}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all ${error
                    ? 'border-red-500 dark:border-red-400'
                    : 'border-gray-300 dark:border-gray-600'
                    } ${className}`}
                {...props}
            />
            {error && (
                <p
                    id={`${id}-error`}
                    className="mt-1 text-sm text-red-600 dark:text-red-400"
                    role="alert"
                >
                    {error}
                </p>
            )}
        </div>
    )
}

/**
 * Accessible Modal/Dialog
 */
export function AccessibleModal({
    isOpen,
    onClose,
    title,
    children,
    className = '',
}) {
    if (!isOpen) return null

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={onClose}
        >
            <div
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 ${className}`}
                onClick={(e) => e.stopPropagation()}
            >
                {title && (
                    <h2
                        id="modal-title"
                        className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100"
                    >
                        {title}
                    </h2>
                )}
                {children}
                <button
                    onClick={onClose}
                    aria-label="Close modal"
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full focus-visible-ring"
                >
                    ✕
                </button>
            </div>
        </div>
    )
}

/**
 * Accessible Alert
 */
export function AccessibleAlert({ type = 'info', children, onClose, className = '' }) {
    const types = {
        info: 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800',
        success: 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800',
        warning: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
        error: 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800',
    }

    return (
        <div
            role="alert"
            aria-live="polite"
            className={`p-4 border rounded-lg ${types[type]} ${className}`}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">{children}</div>
                {onClose && (
                    <button
                        onClick={onClose}
                        aria-label="Close alert"
                        className="ml-4 p-1 hover:opacity-70 focus-visible-ring rounded"
                    >
                        ✕
                    </button>
                )}
            </div>
        </div>
    )
}

/**
 * Loading Spinner with Screen Reader Support
 */
export function AccessibleSpinner({ size = 'md', label = 'Loading...' }) {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    }

    return (
        <div
            role="status"
            aria-live="polite"
            aria-label={label}
            className="flex items-center justify-center"
        >
            <div
                className={`${sizes[size]} border-4 border-gray-200 dark:border-gray-700 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin`}
            />
            <span className="sr-only">{label}</span>
        </div>
    )
}

/**
 * Keyboard Navigation Hook
 */
export function useKeyboardNavigation(ref, onEscape, onEnter) {
    if (typeof window === 'undefined') return

    const handleKeyDown = (e) => {
        if (e.key === 'Escape' && onEscape) {
            onEscape()
        }
        if (e.key === 'Enter' && onEnter) {
            onEnter()
        }
    }

    if (ref && ref.current) {
        ref.current.addEventListener('keydown', handleKeyDown)
        return () => ref.current?.removeEventListener('keydown', handleKeyDown)
    }
}

