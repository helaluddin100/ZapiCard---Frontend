'use client'

import Script from 'next/script'
import { useState, useEffect } from 'react'
import { generateFAQSchema } from './metadata'
import { useLanguage } from '@/lib/i18n/LanguageContext'

import {
  HeroSection,
  StatsSection,
  HealthCardShowcase,
  HowItWorksSection,
  FeaturesSection,
  BenefitsSection,
  TestimonialsSection,
  ComparisonSection,
  FinalCTASection,
  FAQSection
} from '@/components/homepage'

export default function HomePageContent() {
  const [openFaq, setOpenFaq] = useState(null)
  const [mounted, setMounted] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    setMounted(true)
  }, [])

  const faqsForSchema = t.faq.items.map((item, idx) => ({
    id: idx + 1,
    question: item.q,
    answer: item.a,
  }))

  const faqSchema = generateFAQSchema(faqsForSchema)

  return (
    <>
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <HeroSection mounted={mounted} />
      <StatsSection />
      <HealthCardShowcase />
      <HowItWorksSection />
      <FeaturesSection />
      <BenefitsSection />
      <TestimonialsSection mounted={mounted} />
      <ComparisonSection />
      <FinalCTASection />
      <FAQSection openFaq={openFaq} setOpenFaq={setOpenFaq} />
    </>
  )
}
