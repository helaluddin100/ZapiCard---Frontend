'use client'

import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'

export default function ThemeToggle() {
    const { theme, actualTheme, toggleTheme, setThemeMode } = useTheme()
    const [isOpen, setIsOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const dropdownRef = useRef(null)

    // Prevent hydration mismatch by only rendering after mount
    useEffect(() => {
        setMounted(true)
    }, [])

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    const themes = [
        { value: 'light', label: 'Light', icon: Sun },
        { value: 'dark', label: 'Dark', icon: Moon },
        { value: 'system', label: 'System', icon: Monitor }
    ]

    const currentTheme = themes.find(t => t.value === theme) || themes[0]
    const CurrentIcon = currentTheme.icon

    const handleThemeSelect = (themeValue) => {
        setThemeMode(themeValue)
        setIsOpen(false)
    }

    // Prevent hydration mismatch - show placeholder until mounted
    if (!mounted) {
        return (
            <div className="relative">
                <button
                    className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                    aria-label="Toggle theme"
                    disabled
                >
                    <div className="w-5 h-5" />
                </button>
            </div>
        )
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="Toggle theme"
            >
                <motion.div
                    initial={false}
                    animate={{ rotate: actualTheme === 'dark' ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {actualTheme === 'dark' ? (
                        <Sun className="w-5 h-5 text-yellow-500" />
                    ) : (
                        <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    )}
                </motion.div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />
                        {/* Dropdown */}
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50"
                        >
                            {themes.map((themeOption) => {
                                const Icon = themeOption.icon
                                const isActive = theme === themeOption.value
                                
                                return (
                                    <button
                                        key={themeOption.value}
                                        onClick={() => handleThemeSelect(themeOption.value)}
                                        className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition text-left ${
                                            isActive 
                                                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                                                : 'text-gray-700 dark:text-gray-300'
                                        }`}
                                    >
                                        <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                                        <span className="text-sm font-medium">{themeOption.label}</span>
                                        {isActive && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="ml-auto w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400"
                                            />
                                        )}
                                    </button>
                                )
                            })}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

