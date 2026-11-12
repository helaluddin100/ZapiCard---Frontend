'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Star, Search, CheckCircle2, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function TestimonialsPage() {
  const { t, lang } = useLanguage()
  const p = t.testimonialsPage
  const [searchQuery, setSearchQuery] = useState('')
  const [ratingFilter, setRatingFilter] = useState('all')

  const filtered = useMemo(() => {
    return p.items.filter((item) => {
      const q = searchQuery.trim().toLowerCase()
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.role.toLowerCase().includes(q) ||
        item.company.toLowerCase().includes(q) ||
        item.text.toLowerCase().includes(q)
      const matchesRating = ratingFilter === 'all' || item.rating === Number(ratingFilter)
      return matchesSearch && matchesRating
    })
  }, [p.items, searchQuery, ratingFilter])

  return (
    <div className={`min-h-screen bg-white dark:bg-gray-900 ${lang === 'bn' ? 'font-bengali' : ''}`}>
      <section className="relative pt-36 pb-16 px-4 sm:px-6 lg:px-8 bg-teal-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white/15 border border-white/20 text-sm font-semibold">
            {p.badge}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{p.title}</h1>
          <p className="text-lg text-teal-50">{p.subtitle}</p>
        </div>
      </section>

      <section className="py-10 md:py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={p.search}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-teal-100 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-teal-100 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              <option value="all">{p.allRatings}</option>
              <option value="5">5 {p.stars}</option>
              <option value="4">4 {p.stars}</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-500 dark:text-gray-400">{p.noResults}</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((item, idx) => (
                <motion.div
                  key={`${item.name}-${idx}`}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.04 }}
                  className="p-5 rounded-2xl bg-teal-50 dark:bg-gray-800 border border-teal-100 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs text-teal-700 dark:text-teal-300 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {p.verified}
                    </span>
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
          )}
        </div>
      </section>

      <section className="py-14 md:py-20 px-4 sm:px-6 lg:px-8 bg-teal-700">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-3">{p.ctaTitle}</h2>
          <p className="text-teal-50 mb-7">{p.ctaSubtitle}</p>
          <Link
            href="/health-dashboard/create"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-teal-800 rounded-xl font-bold hover:bg-teal-50 transition"
          >
            {p.ctaButton}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
