'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { X, Check, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function ComparisonSection() {
  const { t, lang } = useLanguage()

  return (
    <section className={`py-14 md:py-24 px-4 sm:px-6 lg:px-8 bg-teal-50 dark:bg-gray-950 ${lang === 'bn' ? 'font-bengali' : ''}`}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-teal-700 text-white text-xs sm:text-sm font-semibold">
            {t.comparison.badge}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-teal-900 dark:text-teal-200">
            {t.comparison.title}
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {t.comparison.subtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5 md:gap-8 mb-10">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-5">{t.comparison.traditional}</h3>
            <ul className="space-y-3">
              {t.comparison.traditionalItems.map((text, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                    <X className="w-3.5 h-3.5 text-red-600" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-teal-700 bg-teal-700 p-6 text-white">
            <h3 className="text-xl font-bold mb-5">{t.comparison.smart}</h3>
            <ul className="space-y-3">
              {t.comparison.smartItems.map((text, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-teal-50">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/health-dashboard/create"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold transition-colors"
          >
            {t.comparison.cta}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
