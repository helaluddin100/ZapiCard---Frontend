'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Facebook, Twitter, Instagram, Linkedin, Mail, ArrowUp, CheckCircle2, AlertCircle, Smartphone } from 'lucide-react'
import { useState } from 'react'
import { subscriptionAPI } from '@/lib/api'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import logo from '../app/assets/images/logo.png'

const ANDROID_URL = process.env.NEXT_PUBLIC_ANDROID_APP_URL || 'https://play.google.com/store/apps'
const IOS_URL = process.env.NEXT_PUBLIC_IOS_APP_URL || 'https://apps.apple.com'

export default function Footer() {
  const { t, lang } = useLanguage()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const validateEmail = (value) => {
    const trimmedEmail = value.trim().toLowerCase()
    if (!trimmedEmail) return { valid: false, message: lang === 'bn' ? 'ইমেইল লিখুন' : 'Please enter your email address' }
    const emailRegex = /^[a-zA-Z0-9][a-zA-Z0-9._-]*@[a-zA-Z0-9][a-zA-Z0-9.-]*\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(trimmedEmail)) {
      return { valid: false, message: lang === 'bn' ? 'সঠিক ইমেইল দিন' : 'Please enter a valid email address' }
    }
    return { valid: true, message: '' }
  }

  const handleSubscribe = async (e) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })
    const validation = validateEmail(email)
    if (!validation.valid) {
      setMessage({ type: 'error', text: validation.message })
      return
    }

    const normalizedEmail = email.trim().toLowerCase()
    setLoading(true)

    try {
      const response = await subscriptionAPI.subscribe(normalizedEmail)
      if (response.status === 'success') {
        setMessage({ type: 'success', text: response.message || (lang === 'bn' ? 'সাবস্ক্রাইব হয়েছে!' : 'Thank you for subscribing!') })
        setEmail('')
        setTimeout(() => setMessage({ type: '', text: '' }), 5000)
      }
    } catch (error) {
      if (error.response?.data?.errors?.email) {
        const errorMsg = Array.isArray(error.response.data.errors.email)
          ? error.response.data.errors.email[0]
          : error.response.data.errors.email
        setMessage({ type: 'error', text: errorMsg })
      } else {
        setMessage({
          type: 'error',
          text: error.response?.data?.message || error.message || (lang === 'bn' ? 'সাবস্ক্রাইব ব্যর্থ হয়েছে' : 'Failed to subscribe. Please try again.'),
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <footer className={`relative bg-teal-950 text-white overflow-hidden ${lang === 'bn' ? 'font-bengali' : ''}`}>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid md:grid-cols-4 gap-8 md:gap-12 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-1"
          >
            <Link href="/" className="inline-block mb-4">
              <div className="flex items-center gap-2">
                <Image src={logo} alt="Zapy Card Logo" width={40} height={50} className="h-auto" priority />
                <span className="text-2xl font-bold text-teal-300">{t.brand}</span>
              </div>
            </Link>
            <p className="text-teal-100/80 mb-6 leading-relaxed text-sm">
              {t.footer.tagline}
            </p>
            <div className="flex space-x-3 mb-6">
              {[
                { icon: Facebook, href: 'https://facebook.com/zapycards', label: 'Facebook' },
                { icon: Twitter, href: 'https://x.com/zapycardbd', label: 'Twitter' },
                { icon: Instagram, href: 'https://www.instagram.com/zapycardbd', label: 'Instagram' },
                { icon: Linkedin, href: 'https://www.linkedin.com/in/zapycard', label: 'LinkedIn' },
              ].map((social, idx) => {
                const Icon = social.icon
                return (
                  <a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 rounded-lg bg-teal-900 flex items-center justify-center text-teal-200 hover:bg-teal-700 hover:text-white transition border border-teal-800"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-sm text-teal-100 flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                {t.footer.downloadApp}
              </h4>
              <div className="flex flex-col sm:flex-row gap-2">
                <a
                  href={ANDROID_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-teal-700 hover:bg-teal-600 text-white text-sm font-semibold transition"
                >
                  {t.footer.downloadAndroid}
                </a>
                <a
                  href={IOS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white text-teal-900 hover:bg-teal-50 text-sm font-semibold transition"
                >
                  {t.footer.downloadIos}
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <h4 className="font-bold text-lg mb-6 text-white">{t.footer.product}</h4>
            <ul className="space-y-3">
              {[
                { href: '/about', label: t.footer.about },
                { href: '/#features', label: t.footer.features },
                { href: '/testimonials', label: t.footer.testimonials },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link href={link.href} className="text-teal-100/70 hover:text-white transition flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <h4 className="font-bold text-lg mb-6 text-white">{t.footer.company}</h4>
            <ul className="space-y-3">
              {[
                { href: '/contact', label: t.footer.contact },
                { href: '/testimonials', label: t.footer.testimonials },
                { href: '/#faq', label: t.footer.faq },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link href={link.href} className="text-teal-100/70 hover:text-white transition flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
            <h4 className="font-bold text-lg mb-6 text-white">{t.footer.stayUpdated}</h4>
            <p className="text-teal-100/70 mb-4 text-sm">{t.footer.newsletter}</p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setMessage({ type: '', text: '' })
                  }}
                  placeholder={t.footer.emailPlaceholder}
                  className="flex-1 px-4 py-2.5 bg-teal-900 border border-teal-800 rounded-lg text-white placeholder-teal-300/50 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 rounded-lg transition disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Mail className="w-5 h-5" />
                  )}
                </button>
              </div>
              {message.text && (
                <div className={`flex items-center gap-2 text-sm p-2 rounded-lg ${
                  message.type === 'success'
                    ? 'bg-emerald-900/50 text-emerald-200 border border-emerald-700'
                    : 'bg-red-900/50 text-red-200 border border-red-700'
                }`}>
                  {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  <span>{message.text}</span>
                </div>
              )}
            </form>
          </motion.div>
        </div>

        <div className="border-t border-teal-900 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-teal-200/70 text-sm">
              &copy; {new Date().getFullYear()} {t.brand}. {t.footer.rights}
            </p>
            <div className="flex items-center gap-6 text-sm text-teal-200/70">
              <Link href="/privacy-policy" className="hover:text-white transition">{t.footer.privacy}</Link>
              <Link href="/terms-of-service" className="hover:text-white transition">{t.footer.terms}</Link>
              <Link href="/return-policy" className="hover:text-white transition">{t.footer.returnPolicy}</Link>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-teal-700 hover:bg-teal-600 text-white shadow-xl flex items-center justify-center z-50 transition"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-6 h-6" />
      </button>
    </footer>
  )
}
