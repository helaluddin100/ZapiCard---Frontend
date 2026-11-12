'use client'

import { motion } from 'framer-motion'
import { Clock, Ban, FileQuestion } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function ProblemSection() {
  const { t, lang } = useLanguage()
  const icons = [Clock, Ban, FileQuestion]

  return (
    <section className={`py-14 md:py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 ${lang === 'bn' ? 'font-bengali' : ''}`}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-12"
        >
          <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 text-xs sm:text-sm font-semibold">
            {t.problem.badge}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-gray-900 dark:text-white">
            {t.problem.title}
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {t.problem.subtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {t.problem.items.map((item, idx) => {
            const Icon = icons[idx] || Clock
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="p-6 rounded-2xl border border-rose-100 dark:border-gray-700 bg-rose-50/60 dark:bg-gray-800"
              >
                <div className="w-11 h-11 rounded-xl bg-rose-600 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
