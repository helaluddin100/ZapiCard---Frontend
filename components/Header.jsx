'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Zap, LayoutDashboard, User, LogOut, Home, Sparkles, Award, MessageSquare, Info, Phone } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import authAPI from '@/lib/api'
import ThemeToggle from '@/components/ThemeToggle'
import logo from '../app/assets/images/logo.png'

export default function Header() {
    const router = useRouter()
    const { user, loading, logout } = useAuth()
    const [scrolled, setScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [mobileMenuOpen])

    const navLinks = [
        { href: '/', label: 'Home', icon: Home },
        { href: '/#features', label: 'Features', icon: Sparkles },
        // { href: '/#pricing', label: 'Pricing', icon: Award },
        { href: '/testimonials', label: 'Testimonials', icon: MessageSquare },
        { href: '/about', label: 'About', icon: Info },
        { href: '/contact', label: 'Contact', icon: Phone }
    ]

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed top-0 w-full z-[60] transition-all duration-300 bg-blur ${scrolled
                ? 'bg-white/95 dark:bg-gray-900/95 shadow-lg border-b border-gray-200/50 dark:border-gray-700/50'
                : 'bg-white/80 dark:bg-gray-900/80'
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
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-center"
                        >
                            <Image
                                src={logo}
                                alt="Zapy Card Logo"
                                width={100}
                                height={40}
                                className="h-8 md:h-10 w-auto"
                                priority
                            />
                        </motion.div>
                        <span className="text-2xl md:text-3xl font-bold gradient-primary bg-clip-text text-transparent group-hover:scale-105 transition-transform">
                            Zapy Card
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        {navLinks.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.href}
                                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 font-medium relative group"
                            >
                                {link.label}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 group-hover:w-full transition-all duration-300"></span>
                            </Link>
                        ))}

                        {/* Theme Toggle - Single instance */}
                        <ThemeToggle />

                        {!loading && (
                            <>
                                {user ? (
                                    <div className="relative">
                                        <button
                                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                                            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                                        >
                                            {user.image ? (
                                                <img
                                                    src={user.image}
                                                    alt={user.name}
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white font-semibold text-sm">
                                                    {user.name?.charAt(0).toUpperCase() || 'U'}
                                                </div>
                                            )}
                                            <span className="font-medium text-gray-700 dark:text-gray-300">{user.name || 'User'}</span>
                                        </button>

                                        <AnimatePresence>
                                            {userMenuOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50"
                                                >
                                                    <Link
                                                        href="/dashboard"
                                                        onClick={() => setUserMenuOpen(false)}
                                                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300"
                                                    >
                                                        <LayoutDashboard className="w-4 h-4" />
                                                        <span>Dashboard</span>
                                                    </Link>
                                                    <button
                                                        onClick={async () => {
                                                            setUserMenuOpen(false)
                                                            await logout()
                                                        }}
                                                        className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition text-red-600 dark:text-red-400"
                                                    >
                                                        <LogOut className="w-4 h-4" />
                                                        <span>Logout</span>
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ) : (
                                    <>
                                        <Link
                                            href="/login"
                                            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
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
                                    </>
                                )}
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Click outside to close user menu */}
            {userMenuOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserMenuOpen(false)}
                />
            )}

            {/* Mobile Menu - App Style */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] md:hidden"
                            style={{ touchAction: 'none' }}
                        />

                        {/* Slide-in Panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-900 shadow-2xl z-[60] md:hidden overflow-y-auto"
                            style={{ touchAction: 'auto' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header with Gradient */}
                            <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-6 pb-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg">
                                            <Image
                                                src={logo}
                                                alt="Zapy Card Logo"
                                                width={40}
                                                height={40}
                                                className="h-auto"
                                                priority
                                            />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-white">Menu</h2>
                                            <p className="text-xs text-white/80">Navigation</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center hover:bg-white/30 transition-colors"
                                    >
                                        <X className="w-6 h-6 text-white" />
                                    </button>
                                </div>

                                {/* User Profile Card (if logged in) */}
                                {!loading && user && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20"
                                    >
                                        <div className="flex items-center gap-3">
                                            {user.image ? (
                                                <img
                                                    src={user.image}
                                                    alt={user.name}
                                                    className="w-12 h-12 rounded-full object-cover border-2 border-white/50"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/50 flex items-center justify-center text-white font-bold text-lg">
                                                    {user.name?.charAt(0).toUpperCase() || 'U'}
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <div className="font-bold text-white text-sm">{user.name || 'User'}</div>
                                                <div className="text-xs text-white/80 truncate">{user.email}</div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            {/* Menu Items */}
                            <div className="p-4 space-y-2">
                                {navLinks.map((link, idx) => {
                                    const IconComponent = link.icon
                                    return (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                        >
                                            <Link
                                                href={link.href}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="flex items-center gap-4 px-4 py-4 rounded-2xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 group"
                                            >
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                                    <IconComponent className="w-6 h-6 text-white" />
                                                </div>
                                                <span className="flex-1 font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                    {link.label}
                                                </span>
                                                <motion.div
                                                    initial={{ x: -10, opacity: 0 }}
                                                    whileHover={{ x: 0, opacity: 1 }}
                                                    className="text-blue-600 dark:text-blue-400"
                                                >
                                                    →
                                                </motion.div>
                                            </Link>
                                        </motion.div>
                                    )
                                })}

                                {/* Divider */}
                                <div className="my-6 border-t border-gray-200 dark:border-gray-700"></div>

                                {/* Auth Section */}
                                {!loading && (
                                    <>
                                        {user ? (
                                            <>
                                                {/* Dashboard Button */}
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: navLinks.length * 0.05 + 0.1 }}
                                                >
                                                    <Link
                                                        href="/dashboard"
                                                        onClick={() => setMobileMenuOpen(false)}
                                                        className="flex items-center gap-4 px-4 py-4 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold shadow-lg hover:shadow-xl transition-all"
                                                    >
                                                        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                                                            <LayoutDashboard className="w-6 h-6 text-white" />
                                                        </div>
                                                        <span>Dashboard</span>
                                                    </Link>
                                                </motion.div>

                                                {/* Logout Button */}
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: navLinks.length * 0.05 + 0.15 }}
                                                >
                                                    <button
                                                        onClick={async () => {
                                                            setMobileMenuOpen(false)
                                                            await logout()
                                                        }}
                                                        className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-semibold border-2 border-red-200 dark:border-red-800"
                                                    >
                                                        <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                                            <LogOut className="w-6 h-6 text-red-600 dark:text-red-400" />
                                                        </div>
                                                        <span>Logout</span>
                                                    </button>
                                                </motion.div>
                                            </>
                                        ) : (
                                            <>
                                                {/* Login Button */}
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: navLinks.length * 0.05 + 0.1 }}
                                                >
                                                    <Link
                                                        href="/login"
                                                        onClick={() => setMobileMenuOpen(false)}
                                                        className="flex items-center gap-4 px-4 py-4 rounded-2xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-colors font-semibold"
                                                    >
                                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                                                            <User className="w-6 h-6 text-white" />
                                                        </div>
                                                        <span className="text-gray-900 dark:text-gray-100">Login</span>
                                                    </Link>
                                                </motion.div>

                                                {/* Sign Up Button */}
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: navLinks.length * 0.05 + 0.15 }}
                                                >
                                                    <Link
                                                        href="/signup"
                                                        onClick={() => setMobileMenuOpen(false)}
                                                        className="flex items-center gap-4 px-4 py-4 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold shadow-lg hover:shadow-xl transition-all"
                                                    >
                                                        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                                                            <Sparkles className="w-6 h-6 text-white" />
                                                        </div>
                                                        <span>Sign Up</span>
                                                    </Link>
                                                </motion.div>

                                                {/* Theme Toggle */}
                                                {/* <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: navLinks.length * 0.05 + 0.2 }}
                                                    className="flex justify-center pt-4"
                                                >
                                                    <ThemeToggle />
                                                </motion.div> */}
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </motion.nav>
    )
}

