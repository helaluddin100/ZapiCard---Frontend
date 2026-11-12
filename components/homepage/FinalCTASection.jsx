'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle2, ArrowRight, Smartphone } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const ANDROID_URL = process.env.NEXT_PUBLIC_ANDROID_APP_URL || 'https://play.google.com/store/apps'

export default function FinalCTASection() {
  const { t, lang } = useLanguage()
  const appUrl = ANDROID_URL

  return (
    <section className={`py-14 md:py-24 px-4 sm:px-6 lg:px-8 bg-teal-700 ${lang === 'bn' ? 'font-bengali' : ''}`}>
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4">
            {t.cta.title}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-teal-50 mb-8 max-w-2xl mx-auto">
            {t.cta.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8">
            <Link
              href="/signup"
              className="group w-full sm:w-auto px-7 py-3.5 bg-white text-teal-800 rounded-xl font-bold text-base sm:text-lg shadow-lg hover:bg-teal-50 transition-all text-center"
            >
              <span className="flex items-center justify-center gap-2">
                {t.cta.primary}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <a
              href={appUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-7 py-3.5 bg-teal-800 text-white border border-teal-500 rounded-xl font-bold text-base sm:text-lg hover:bg-teal-900 transition-all text-center inline-flex items-center justify-center gap-2"
            >
              <Smartphone className="w-5 h-5" />
              {t.cta.secondary}
            </a>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-teal-50 text-xs sm:text-sm">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              {t.cta.note1}
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              {t.cta.note2}
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              {t.cta.note3}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
