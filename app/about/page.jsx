'use client'

import { motion } from 'framer-motion'
import { Target, Heart, Zap, Shield, Users, Radio, Brain, Baby, RefreshCw, Globe } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function AboutPage() {
  const { t, lang } = useLanguage()
  const a = t.about

  const values = [
    { icon: Target, title: a.missionTitle, description: a.missionDesc },
    { icon: Heart, title: a.visionTitle, description: a.visionDesc },
    { icon: Zap, title: a.innovationTitle, description: a.innovationDesc },
    { icon: Shield, title: a.securityTitle, description: a.securityDesc },
  ]

  const whyIcons = [Radio, Brain, Users, Baby, RefreshCw, Globe]

  return (
    <div className={`min-h-screen bg-white dark:bg-gray-900 ${lang === 'bn' ? 'font-bengali' : ''}`}>
      <section className="relative pt-36 pb-20 px-4 sm:px-6 lg:px-8 bg-teal-700 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-16 -right-10 w-72 h-72 rounded-full bg-teal-600/50" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-teal-800/40" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10 text-center text-white">
          <span className="inline-block mb-6 px-5 py-2 rounded-full bg-white/15 border border-white/20 text-sm font-semibold">
            {a.badge}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-5">{a.title}</h1>
          <p className="text-lg md:text-xl text-teal-50 max-w-3xl mx-auto">{a.subtitle}</p>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-teal-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-teal-900 dark:text-teal-200">{a.valuesTitle}</h2>
            <p className="text-gray-600 dark:text-gray-400">{a.valuesSubtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-5 md:gap-6">
            {values.map((value, idx) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.06 }}
                  className="p-6 md:p-8 bg-white dark:bg-gray-900 rounded-2xl border border-teal-100 dark:border-gray-700"
                >
                  <div className="w-12 h-12 rounded-xl bg-teal-700 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-900 dark:text-white">{value.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{value.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-teal-900 dark:text-teal-200">{a.whyTitle}</h2>
            <p className="text-gray-600 dark:text-gray-400">{a.whySubtitle}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {a.why.map((item, idx) => {
              const Icon = whyIcons[idx] || Heart
              return (
                <div key={idx} className="p-5 rounded-2xl bg-teal-50 dark:bg-gray-800 border border-teal-100 dark:border-gray-700">
                  <div className="w-11 h-11 rounded-xl bg-teal-700 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-teal-50 dark:bg-gray-950">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-teal-900 dark:text-teal-200">{a.techTitle}</h2>
            <p className="text-gray-600 dark:text-gray-400">{a.techSubtitle}</p>
          </div>
          <div className="p-6 md:p-8 bg-white dark:bg-gray-900 rounded-2xl border border-teal-100 dark:border-gray-700">
            <p className="text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-5">
              {a.techP1.split('NFC').map((part, i, arr) =>
                i < arr.length - 1 ? (
                  <span key={i}>
                    {part}
                    <strong className="text-teal-700 dark:text-teal-300">NFC</strong>
                  </span>
                ) : (
                  <span key={i}>{part}</span>
                )
              )}
            </p>
            <p className="text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-300">{a.techP2}</p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-teal-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{a.ctaTitle}</h2>
          <p className="text-lg text-teal-50 mb-8">{a.ctaSubtitle}</p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-teal-800 rounded-xl font-bold text-lg hover:bg-teal-50 transition"
          >
            {a.ctaButton}
          </Link>
        </div>
      </section>
    </div>
  )
}
