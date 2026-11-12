'use client'

import { motion } from 'framer-motion'
import { Calendar, Heart, Radio, Users } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function FeaturesSection() {
  const { t, lang } = useLanguage()
  const items = t.features.items

  const features = [
    { icon: Heart, title: items.health.title, description: items.health.desc, highlight: true },
    { icon: Calendar, title: items.appointment.title, description: items.appointment.desc, highlight: false },
    { icon: Radio, title: items.nfc.title, description: items.nfc.desc, highlight: false },
    { icon: Users, title: items.family.title, description: items.family.desc, highlight: false },
  ]

  return (
    <section id="features" className={`py-14 md:py-24 px-4 sm:px-6 lg:px-8 bg-teal-50 dark:bg-gray-950 ${lang === 'bn' ? 'font-bengali' : ''}`}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-teal-700 text-white text-xs sm:text-sm font-semibold">
            {t.features.badge}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-teal-900 dark:text-teal-200">
            {t.features.title}
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {t.features.subtitle}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.07 }}
                className={`p-5 sm:p-6 rounded-2xl border ${
                  feature.highlight
                    ? 'bg-teal-700 border-teal-700 text-white'
                    : 'bg-white dark:bg-gray-900 border-teal-100 dark:border-gray-700'
                }`}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${
                  feature.highlight ? 'bg-white/20' : 'bg-teal-700'
                }`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className={`text-lg font-bold mb-2 ${feature.highlight ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  {feature.title}
                </h3>
                <p className={`text-sm leading-relaxed ${feature.highlight ? 'text-teal-50' : 'text-gray-600 dark:text-gray-400'}`}>
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
