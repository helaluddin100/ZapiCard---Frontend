'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  X,
  Check,
  ArrowRight,
  BellOff,
  BellRing,
  FileX2,
  Camera,
  Ban,
  ClipboardCheck,
  HelpCircle,
  History,
  Users,
  UserCheck,
  Frown,
  Smile,
} from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const pairIcons = [
  { without: BellOff, with: BellRing },
  { without: FileX2, with: Camera },
  { without: Ban, with: ClipboardCheck },
  { without: HelpCircle, with: History },
  { without: Users, with: UserCheck },
  { without: Frown, with: Smile },
]

export default function ComparisonSection() {
  const { t, lang } = useLanguage()
  const pairs = t.comparison.pairs || []

  return (
    <section
      className={`py-14 md:py-24 px-4 sm:px-6 lg:px-8 bg-teal-50 dark:bg-gray-950 ${
        lang === 'bn' ? 'font-bengali' : ''
      }`}
    >
      <div className="max-w-6xl mx-auto">
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
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t.comparison.subtitle}
          </p>
        </motion.div>

        {/* Column headers */}
        <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] gap-4 mb-4 px-1">
          <div className="rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/40 px-5 py-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-rose-600 dark:text-rose-300 mb-1">
              {t.comparison.withoutLabel}
            </p>
            <p className="text-lg font-bold text-rose-800 dark:text-rose-200">
              {t.comparison.traditional}
            </p>
            <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-rose-700 dark:text-rose-300">
              <X className="w-4 h-4" />
              {t.comparison.withoutResult}
            </p>
          </div>
          <div className="flex items-center justify-center">
            <span className="w-12 h-12 rounded-full bg-white dark:bg-gray-900 border-2 border-teal-700 text-teal-800 dark:text-teal-300 font-black text-sm flex items-center justify-center shadow-sm">
              VS
            </span>
          </div>
          <div className="rounded-2xl border border-teal-700 bg-teal-700 px-5 py-4 text-center text-white">
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-100 mb-1">
              {t.comparison.withLabel}
            </p>
            <p className="text-lg font-bold">{t.comparison.smart}</p>
            <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-50">
              <Check className="w-4 h-4" />
              {t.comparison.withResult}
            </p>
          </div>
        </div>

        {/* Mobile headers */}
        <div className="md:hidden grid grid-cols-2 gap-3 mb-5">
          <div className="rounded-xl border border-rose-200 bg-rose-50 dark:bg-rose-950/40 dark:border-rose-900/50 p-3 text-center">
            <p className="text-sm font-bold text-rose-800 dark:text-rose-200">{t.comparison.traditional}</p>
            <p className="text-xs text-rose-600 dark:text-rose-300 mt-1">{t.comparison.withoutResult}</p>
          </div>
          <div className="rounded-xl bg-teal-700 p-3 text-center text-white">
            <p className="text-sm font-bold">{t.comparison.smart}</p>
            <p className="text-xs text-teal-100 mt-1">{t.comparison.withResult}</p>
          </div>
        </div>

        {/* Paired rows */}
        <div className="space-y-3 md:space-y-4 mb-10">
          {pairs.map((pair, idx) => {
            const icons = pairIcons[idx] || pairIcons[0]
            const WithoutIcon = icons.without
            const WithIcon = icons.with

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="grid md:grid-cols-[1fr_auto_1fr] gap-3 md:gap-4 items-stretch"
              >
                {/* Without */}
                <div className="rounded-2xl border border-rose-100 dark:border-rose-900/40 bg-white dark:bg-gray-900 p-4 md:p-5 flex items-start gap-3">
                  <span className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center flex-shrink-0">
                    <WithoutIcon className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  </span>
                  <div className="min-w-0">
                    <span className="md:hidden inline-block mb-1 text-[11px] font-bold uppercase tracking-wide text-rose-500">
                      {t.comparison.withoutLabel}
                    </span>
                    <p className="text-sm md:text-base font-medium text-gray-700 dark:text-gray-300 leading-snug">
                      {pair.without}
                    </p>
                  </div>
                </div>

                {/* Arrow / VS */}
                <div className="hidden md:flex items-center justify-center">
                  <span className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300 flex items-center justify-center">
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </div>

                {/* With */}
                <div className="rounded-2xl border border-teal-600 bg-teal-700 p-4 md:p-5 flex items-start gap-3 text-white shadow-sm">
                  <span className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                    <WithIcon className="w-5 h-5 text-white" />
                  </span>
                  <div className="min-w-0">
                    <span className="md:hidden inline-block mb-1 text-[11px] font-bold uppercase tracking-wide text-teal-100">
                      {t.comparison.withLabel}
                    </span>
                    <p className="text-sm md:text-base font-semibold leading-snug text-teal-50">
                      {pair.with}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Conversion CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-teal-700 bg-white dark:bg-gray-900 p-6 md:p-8 text-center"
        >
          <p className="text-base md:text-lg font-semibold text-teal-900 dark:text-teal-200 mb-2">
            {t.comparison.ctaTitle}
          </p>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-5 max-w-xl mx-auto">
            {t.comparison.ctaSubtitle}
          </p>
          <Link
            href="/health-dashboard/create"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold transition-colors"
          >
            {t.comparison.cta}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
