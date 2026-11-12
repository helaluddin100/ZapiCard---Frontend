'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function StatsSection() {
  const { t, lang } = useLanguage()

  const stats = [
    { number: '10K+', label: t.stats.users },
    { number: '8K+', label: t.stats.cards },
    { number: '25K+', label: t.stats.scans },
    { number: '4.9★', label: t.stats.rating },
  ]

  return (
    <section className={`py-14 md:py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 ${lang === 'bn' ? 'font-bengali' : ''}`}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-14"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-teal-800 dark:text-teal-300">
            {t.stats.title}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400">
            {t.stats.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="text-center p-5 sm:p-7 rounded-2xl bg-teal-50 dark:bg-gray-800 border border-teal-100 dark:border-gray-700"
            >
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 text-teal-700 dark:text-teal-300">
                {stat.number}
              </div>
              <div className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
