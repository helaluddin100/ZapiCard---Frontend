'use client'

import { motion } from 'framer-motion'
import { Zap, Shield, Clock, Users, Brain, Heart } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function BenefitsSection() {
  const { t, lang } = useLanguage()
  const items = t.benefits.items

  const benefits = [
    { icon: Zap, title: items.instant.title, description: items.instant.desc },
    { icon: Shield, title: items.secure.title, description: items.secure.desc },
    { icon: Clock, title: items.always.title, description: items.always.desc },
    { icon: Users, title: items.share.title, description: items.share.desc },
    { icon: Brain, title: items.ai.title, description: items.ai.desc },
    { icon: Heart, title: items.family.title, description: items.family.desc },
  ]

  return (
    <section className={`py-14 md:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 ${lang === 'bn' ? 'font-bengali' : ''}`}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-300 text-xs sm:text-sm font-semibold">
            {t.benefits.badge}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-teal-900 dark:text-teal-200">
            {t.benefits.title}
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {t.benefits.subtitle}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.06 }}
                className="p-5 sm:p-6 rounded-2xl bg-teal-50 dark:bg-gray-800 border border-teal-100 dark:border-gray-700"
              >
                <div className="w-11 h-11 rounded-xl bg-teal-700 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{benefit.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
