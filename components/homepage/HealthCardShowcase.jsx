'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Camera, BellRing, CheckCircle2, Activity, History, Shield } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function HealthCardShowcase() {
  const { t, lang } = useLanguage()
  const f = t.showcase.features

  const healthCardFeatures = [
    { title: f.ai.title, description: f.ai.desc, icon: Camera },
    { title: f.manual.title, description: f.manual.desc, icon: BellRing },
    { title: f.emergency.title, description: f.emergency.desc, icon: CheckCircle2 },
    { title: f.pregnancy.title, description: f.pregnancy.desc, icon: Activity },
    { title: f.history.title, description: f.history.desc, icon: History },
    { title: f.secure.title, description: f.secure.desc, icon: Shield },
  ]

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
            {t.showcase.badge}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-teal-900 dark:text-teal-200">
            {t.showcase.title}
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {t.showcase.subtitle}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10">
          {healthCardFeatures.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.06 }}
                className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-gray-900 border border-teal-100 dark:border-gray-700"
              >
                <div className="w-11 h-11 rounded-xl bg-teal-700 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            )
          })}
        </div>

        <div className="text-center">
          <Link
            href="/health-dashboard/create"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold transition-colors"
          >
            {t.showcase.cta}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
