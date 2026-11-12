'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { UserPlus, FileEdit, Share2, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function HowItWorksSection() {
  const { t, lang } = useLanguage()

  const steps = [
    { step: '1', title: t.howItWorks.steps[1].title, desc: t.howItWorks.steps[1].desc, icon: UserPlus },
    { step: '2', title: t.howItWorks.steps[2].title, desc: t.howItWorks.steps[2].desc, icon: FileEdit },
    { step: '3', title: t.howItWorks.steps[3].title, desc: t.howItWorks.steps[3].desc, icon: Share2 },
  ]

  return (
    <section id="how-it-works" className={`py-14 md:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 ${lang === 'bn' ? 'font-bengali' : ''}`}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-300 text-xs sm:text-sm font-semibold">
            {t.howItWorks.badge}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-teal-900 dark:text-teal-200">
            {t.howItWorks.title}
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {t.howItWorks.subtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 md:gap-6 mb-10">
          {steps.map((item, idx) => {
            const Icon = item.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="relative p-6 rounded-2xl border border-teal-100 dark:border-gray-700 bg-teal-50/70 dark:bg-gray-800"
              >
                <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-teal-700 text-white text-xs font-bold">
                  {item.step}
                </div>
                <div className="w-12 h-12 rounded-xl bg-teal-700 flex items-center justify-center mb-4 mt-2">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            )
          })}
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
