'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Zap } from 'lucide-react'

export default function Header() {
    const [scrolled, setScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navLinks = [
        { href: '/#features', label: 'Features' },
        { href: '/#pricing', label: 'Pricing' },
        { href: '/testimonials', label: 'Testimonials' },
        { href: '/about', label: 'About' },
        { href: '/contact', label: 'Contact' }
    ]

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
                ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200/50'
                : 'bg-white/80 backdrop-blur-lg'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 md:h-20">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 group"
                    >
                        <motion.div
                            whileHover={{ rotate: 360, scale: 1.1 }}
                            transition={{ duration: 0.5 }}
                            className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg"
                        >
                            <Zap className="w-6 h-6 text-white" />
                        </motion.div>
                        <span className="text-2xl md:text-3xl font-bold gradient-primary bg-clip-text text-transparent group-hover:scale-105 transition-transform">
                            Zapi Card
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        {navLinks.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.href}
                                className="text-gray-700 hover:text-blue-600 transition-colors duration-300 font-medium relative group"
                            >
                                {link.label}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                            </Link>
                        ))}
                        <Link
                            href="/login"
                            className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                        >
                            Login
                        </Link>
                        <Link
                            href="/signup"
                            className="ml-2 px-6 py-2.5 rounded-lg font-semibold text-white gradient-primary hover:shadow-lg transition-all duration-300 transform hover:scale-105 relative overflow-hidden group"
                        >
                            <span className="relative z-10">Sign Up</span>
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                initial={false}
                            />
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-gray-200"
                    >
                        <div className="px-4 py-4 space-y-2">
                            {navLinks.map((link, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <Link
                                        href={link.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block px-4 py-3 text-gray-700 hover:text-blue-600 transition-colors font-medium"
                                    >
                                        {link.label}
                                    </Link>
                                </motion.div>
                            ))}
                            <div className="pt-4 border-t border-gray-200 space-y-2">
                                <Link
                                    href="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-4 py-3 text-center text-gray-700 hover:text-blue-600 transition-colors font-medium"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/signup"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-4 py-3 text-center text-white gradient-primary rounded-lg font-semibold hover:shadow-lg transition"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    )
}

