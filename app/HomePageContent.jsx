'use client'

import Script from 'next/script'
import { useState, useEffect } from 'react'
import { generateFAQSchema } from './metadata'
import { useLanguage } from '@/lib/i18n/LanguageContext'

import {
  HeroSection,
  ProblemSection,
  HowItWorksSection,
  FeaturesSection,
  HealthCardShowcase,
  BenefitsSection,
  ComparisonSection,
  StatsSection,
  TestimonialsSection,
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

      {/* 1. Hook: problem + solution */}
      <HeroSection mounted={mounted} />

      {/* 2. Real-life problem people know */}
      <ProblemSection />

      {/* 3. Step-by-step journey */}
      <HowItWorksSection />

      {/* 4. Clear benefits from using the system */}
      <FeaturesSection />

      {/* 5. Detailed capabilities */}
      <HealthCardShowcase />

      {/* 6. Ways users benefit */}
      <BenefitsSection />

      {/* 7. Before vs after */}
      <ComparisonSection />

      {/* 8. Social proof */}
      <StatsSection />
      <TestimonialsSection mounted={mounted} />

      {/* 9. Convert */}
      <FinalCTASection />
      <FAQSection openFaq={openFaq} setOpenFaq={setOpenFaq} />
    </>
  )
}
