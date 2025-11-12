'use client'

import { useState, useEffect, createContext, useContext } from 'react'

const ThemeContext = createContext(null)

// Function to get system preference
const getSystemPreference = () => {
    if (typeof window === 'undefined') return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// Function to apply theme to document
const applyTheme = (mode) => {
    if (typeof document === 'undefined') return

    const actualTheme = mode === 'system' ? getSystemPreference() : mode

    if (actualTheme === 'dark') {
        document.documentElement.classList.add('dark')
    } else {
        document.documentElement.classList.remove('dark')
    }
}

export function ThemeProvider({ children }) {
    // Initialize with system preference if no saved theme, otherwise use saved theme
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme')
            return savedTheme || 'system'
        }
        return 'system'
    })
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)

        // Apply theme immediately on mount (for system mode, this will use system preference)
        applyTheme(theme)

        // Set up listener for system preference changes
        const setupSystemListener = () => {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
            const handleChange = () => {
                // Use current theme from closure
                if (theme === 'system') {
                    applyTheme('system')
                }
            }

            // Modern browsers
            if (mediaQuery.addEventListener) {
                mediaQuery.addEventListener('change', handleChange)
            } else {
                // Fallback for older browsers
                mediaQuery.addListener(handleChange)
            }

            return () => {
                if (mediaQuery.removeEventListener) {
                    mediaQuery.removeEventListener('change', handleChange)
                } else {
                    mediaQuery.removeListener(handleChange)
                }
            }
        }

        // Always set up listener, but it will only apply if theme is 'system'
        const cleanup = setupSystemListener()

        return cleanup
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        // Re-apply theme when it changes (only after mount)
        if (mounted) {
            applyTheme(theme)
            localStorage.setItem('theme', theme)

            // Set up listener for system preference changes
            const setupSystemListener = () => {
                if (theme === 'system') {
                    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
                    const handleChange = () => {
                        applyTheme('system')
                    }

                    if (mediaQuery.addEventListener) {
                        mediaQuery.addEventListener('change', handleChange)
                    } else {
                        mediaQuery.addListener(handleChange)
                    }

                    return () => {
                        if (mediaQuery.removeEventListener) {
                            mediaQuery.removeEventListener('change', handleChange)
                        } else {
                            mediaQuery.removeListener(handleChange)
                        }
                    }
                }
                return () => { } // No cleanup needed if not system mode
            }

            return setupSystemListener()
        }
    }, [theme, mounted])

    const toggleTheme = () => {
        // Cycle through: light -> dark -> system -> light
        let newTheme
        if (theme === 'light') {
            newTheme = 'dark'
        } else if (theme === 'dark') {
            newTheme = 'system'
        } else {
            newTheme = 'light'
        }

        setTheme(newTheme)
        localStorage.setItem('theme', newTheme)
        applyTheme(newTheme)
    }

    const setThemeMode = (mode) => {
        setTheme(mode)
        localStorage.setItem('theme', mode)
        applyTheme(mode)
    }

    // Get the actual theme being applied (for display purposes)
    const actualTheme = theme === 'system' ? getSystemPreference() : theme

    // Always provide the context, even before mounting
    // This prevents the "useTheme must be used within ThemeProvider" error
    return (
        <ThemeContext.Provider value={{ theme, actualTheme, toggleTheme, setThemeMode }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider')
    }
    return context
}

