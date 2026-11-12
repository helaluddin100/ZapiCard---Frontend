'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, ArrowRight, ShieldCheck } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function HeroSection({ mounted }) {
  const { t, lang } = useLanguage()

  return (
    <section className={`relative pt-32 pb-16 md:pt-40 md:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-teal-700 min-h-[560px] md:min-h-[680px] ${lang === 'bn' ? 'font-bengali' : ''}`}>
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-20 -right-16 w-72 h-72 rounded-full bg-teal-600/50" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-teal-800/40" />
        {mounted && (
          <motion.div
            className="absolute top-1/3 right-1/4 w-40 h-40 rounded-full border-2 border-white/10"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </div>

      <div className="relative z-20 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-white/15 text-white text-sm font-semibold border border-white/20">
            <ShieldCheck className="w-4 h-4" />
            {t.hero.badge}
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-5 text-white leading-tight">
            <span className="block">{t.hero.titleLine1}</span>
            <span className="block text-teal-100 mt-2">{t.hero.titleLine2}</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-teal-50 mb-3 max-w-3xl mx-auto leading-relaxed">
            {t.hero.subtitle}
          </p>
          <p className="text-sm sm:text-base text-teal-100/90 mb-8 max-w-2xl mx-auto">
            {t.hero.support}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-2">
            <Link
              href="/health-dashboard/create"
              className="group w-full sm:w-auto px-7 sm:px-10 py-3.5 sm:py-4 bg-white text-teal-800 rounded-xl font-bold text-base sm:text-lg shadow-lg hover:bg-teal-50 transition-all text-center"
            >
              <span className="flex items-center justify-center gap-2">
                <Heart className="w-5 h-5 text-teal-700" />
                {t.hero.ctaPrimary}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link
              href="/#how-it-works"
              className="w-full sm:w-auto px-7 sm:px-10 py-3.5 sm:py-4 bg-teal-800 text-white border border-teal-500 rounded-xl font-bold text-base sm:text-lg hover:bg-teal-900 transition-all text-center"
            >
              {t.hero.ctaSecondary}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
