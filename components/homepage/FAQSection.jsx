'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function FAQSection({ openFaq, setOpenFaq }) {
  const { t, lang } = useLanguage()
  const faqs = t.faq.items

  return (
    <section id="faq" className={`py-14 md:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 ${lang === 'bn' ? 'font-bengali' : ''}`}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-12"
        >
          <span className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-300 text-xs sm:text-sm font-semibold">
            <HelpCircle className="w-4 h-4" />
            {t.faq.badge}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-teal-900 dark:text-teal-200">
            {t.faq.title}
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400">
            {t.faq.subtitle}
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx
            return (
              <div
                key={idx}
                className="rounded-2xl border border-teal-100 dark:border-gray-700 bg-teal-50/50 dark:bg-gray-800 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-teal-700 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-5 pb-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-teal-700 dark:text-teal-300 font-semibold hover:underline"
          >
            {t.faq.contact}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
