'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LayoutDashboard, User, LogOut, Home, Sparkles, MessageSquare, Info, Phone, Languages } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import ThemeToggle from '@/components/ThemeToggle'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import logo from '../app/assets/images/logo.png'

export default function Header() {
  const { user, loading, logout } = useAuth()
  const { t, lang, setLanguage } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileMenuOpen])

  const navLinks = [
    { href: '/', label: t.nav.home, icon: Home },
    { href: '/#features', label: t.nav.features, icon: Sparkles },
    { href: '/testimonials', label: t.nav.testimonials, icon: MessageSquare },
    { href: '/about', label: t.nav.about, icon: Info },
    { href: '/contact', label: t.nav.contact, icon: Phone },
  ]

  const LanguageSwitch = ({ compact = false }) => (
    <div className={`inline-flex items-center rounded-lg border border-teal-200 dark:border-teal-700 overflow-hidden ${compact ? 'text-xs' : 'text-sm'}`}>
      <button
        type="button"
        onClick={() => setLanguage('bn')}
        className={`px-2.5 py-1.5 font-semibold transition ${lang === 'bn' ? 'bg-teal-700 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
        aria-label="Bangla"
      >
        বাং
      </button>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-2.5 py-1.5 font-semibold transition ${lang === 'en' ? 'bg-teal-700 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
        aria-label="English"
      >
        EN
      </button>
    </div>
  )

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-[60] transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 dark:bg-gray-900/95 shadow-lg border-b border-teal-100 dark:border-gray-700'
          : 'bg-white/90 dark:bg-gray-900/90'
      } ${lang === 'bn' ? 'font-bengali' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <Link href="/" className="flex items-center gap-2 group">
            <Image src={logo} alt="Zapy Card Logo" width={100} height={40} className="h-8 md:h-10 w-auto" priority />
            <span className="text-xl md:text-2xl font-bold text-teal-700 dark:text-teal-300 group-hover:text-teal-800 transition-colors">
              {t.brand}
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-5">
            {navLinks.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className="text-gray-700 dark:text-gray-300 hover:text-teal-700 dark:hover:text-teal-300 transition-colors font-medium relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-700 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}

            <LanguageSwitch />
            <ThemeToggle />

            {!loading && (
              <>
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-teal-50 dark:hover:bg-gray-800 transition"
                    >
                      {user.image ? (
                        <img src={user.image} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-teal-700 flex items-center justify-center text-white font-semibold text-sm">
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
                            className="flex items-center gap-2 px-4 py-2 hover:bg-teal-50 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            <span>{t.nav.dashboard}</span>
                          </Link>
                          <button
                            onClick={async () => {
                              setUserMenuOpen(false)
                              await logout()
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 transition text-red-600 dark:text-red-400"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>{t.nav.logout}</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <>
                    <Link href="/login" className="text-gray-700 dark:text-gray-300 hover:text-teal-700 font-medium">
                      {t.nav.login}
                    </Link>
                    <Link
                      href="/signup"
                      className="ml-1 px-5 py-2.5 rounded-lg font-semibold text-white bg-teal-700 hover:bg-teal-800 transition-colors"
                    >
                      {t.nav.signup}
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-gray-800 transition"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {userMenuOpen && <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />}

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] md:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-900 shadow-2xl z-[60] md:hidden overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-teal-700 p-6 pb-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center">
                      <Image src={logo} alt="Zapy Card Logo" width={40} height={40} className="h-auto" priority />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">{t.nav.menu}</h2>
                      <p className="text-xs text-white/80">{t.nav.navigation}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-10 h-10 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/10 border border-white/20">
                  <span className="text-white text-sm font-medium flex items-center gap-2">
                    <Languages className="w-4 h-4" />
                    {lang === 'bn' ? t.lang.bn : t.lang.en}
                  </span>
                  <LanguageSwitch compact />
                </div>
              </div>

              <div className="p-4 space-y-2">
                {navLinks.map((link, idx) => {
                  const IconComponent = link.icon
                  return (
                    <Link
                      key={idx}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-4 px-4 py-3.5 rounded-xl bg-teal-50 dark:bg-gray-800 border border-teal-100 dark:border-gray-700 hover:border-teal-300 transition"
                    >
                      <div className="w-11 h-11 rounded-xl bg-teal-700 flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">{link.label}</span>
                    </Link>
                  )
                })}

                <div className="my-4 border-t border-gray-200 dark:border-gray-700" />

                {!loading && (
                  <>
                    {user ? (
                      <>
                        <Link
                          href="/dashboard"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-4 px-4 py-3.5 rounded-xl bg-teal-700 text-white font-bold"
                        >
                          <LayoutDashboard className="w-5 h-5" />
                          {t.nav.dashboard}
                        </Link>
                        <button
                          onClick={async () => {
                            setMobileMenuOpen(false)
                            await logout()
                          }}
                          className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-red-600 border border-red-200 font-semibold"
                        >
                          <LogOut className="w-5 h-5" />
                          {t.nav.logout}
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-4 px-4 py-3.5 rounded-xl bg-gray-100 dark:bg-gray-800 font-semibold"
                        >
                          <User className="w-5 h-5" />
                          {t.nav.login}
                        </Link>
                        <Link
                          href="/signup"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-4 px-4 py-3.5 rounded-xl bg-teal-700 text-white font-bold"
                        >
                          <Sparkles className="w-5 h-5" />
                          {t.nav.signup}
                        </Link>
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
