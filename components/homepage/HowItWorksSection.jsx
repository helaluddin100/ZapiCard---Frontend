'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Stethoscope, Camera, BellRing, AlarmClock, ClipboardCheck, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function HowItWorksSection() {
  const { t, lang } = useLanguage()
  const icons = [Stethoscope, Camera, BellRing, AlarmClock, ClipboardCheck]
  const steps = Array.isArray(t.howItWorks.steps) ? t.howItWorks.steps : Object.values(t.howItWorks.steps || {})

  return (
    <section id="how-it-works" className={`py-14 md:py-24 px-4 sm:px-6 lg:px-8 bg-teal-50 dark:bg-gray-950 ${lang === 'bn' ? 'font-bengali' : ''}`}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-teal-700 text-white text-xs sm:text-sm font-semibold">
            {t.howItWorks.badge}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-teal-900 dark:text-teal-200">
            {t.howItWorks.title}
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {t.howItWorks.subtitle}
          </p>
        </motion.div>

        <div className="relative">
          <div className="hidden lg:block absolute top-10 left-[10%] right-[10%] h-0.5 bg-teal-200 dark:bg-teal-900" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5 md:gap-4 mb-10">
            {steps.map((item, idx) => {
              const Icon = icons[idx] || ClipboardCheck
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.07 }}
                  className="relative p-5 rounded-2xl border border-teal-100 dark:border-gray-700 bg-white dark:bg-gray-900"
                >
                  <div className="w-9 h-9 rounded-full bg-teal-700 text-white text-sm font-bold flex items-center justify-center mb-4">
                    {idx + 1}
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-teal-700 dark:text-teal-300" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold transition-colors"
          >
            {t.howItWorks.cta}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
