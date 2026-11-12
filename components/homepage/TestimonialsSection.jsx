'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Star, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function TestimonialsSection({ mounted }) {
  const { t, lang } = useLanguage()
  const testimonials = t.testimonials.items

  return (
    <section id="testimonials" className={`py-14 md:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 ${lang === 'bn' ? 'font-bengali' : ''}`}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-300 text-xs sm:text-sm font-semibold">
            {t.testimonials.badge}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-teal-900 dark:text-teal-200">
            {t.testimonials.title}
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-4">
            {t.testimonials.subtitle}
          </p>
          <Link
            href="/testimonials"
            className="inline-flex items-center gap-2 text-teal-700 dark:text-teal-300 font-semibold hover:underline"
          >
            {t.testimonials.viewAll}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {testimonials.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.07 }}
              className="p-5 rounded-2xl bg-teal-50 dark:bg-gray-800 border border-teal-100 dark:border-gray-700"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-5">
                &ldquo;{item.text}&rdquo;
              </p>
              <div className="pt-4 border-t border-teal-100 dark:border-gray-700">
                <div className="font-bold text-gray-900 dark:text-white text-sm">{item.name}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">{item.role}</div>
                <div className="text-xs text-teal-700 dark:text-teal-400">{item.company}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
