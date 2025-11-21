// এটি আপনার updated app/page.jsx এর example
// এই code টা app/page.jsx তে replace করুন

'use client'

import Script from 'next/script'
import { useState, useEffect } from 'react'
import { generateFAQSchema } from './metadata'

// Import all homepage components
import {
    HeroSection,
    HealthCardShowcase,
    HowItWorksSection,
    FeaturesSection,
    PricingSection,
    BenefitsSection,
    VideoDemoSection,
    TrustedBySection,
    TestimonialsSection,
    ComparisonSection,
    FinalCTASection,
    FAQSection
} from '@/components/homepage'

export default function Home() {
    const [openFaq, setOpenFaq] = useState(null)
    const [mounted, setMounted] = useState(false)

    // FAQ data
    const faqs = [
        {
            id: 1,
            question: "What is a Smart Health Card?",
            answer: "A Smart Health Card is a digital card that stores your complete medical information including prescriptions, medical history, allergies, and emergency contacts. It can be accessed instantly via NFC tap or QR code scan, making it perfect for emergencies and doctor visits."
        },
        {
            id: 2,
            question: "How does AI prescription reading work?",
            answer: "Simply take a photo of your prescription. Our AI technology automatically reads and extracts information like medication names, dosages, and instructions, then populates your health card. You can also manually edit or add information as needed."
        },
        {
            id: 3,
            question: "Is my health data secure and private?",
            answer: "Absolutely! We use bank-level encryption (256-bit SSL) to protect your data. Your health information is only accessible by people you authorize. You have complete control over who can view your card."
        },
        {
            id: 4,
            question: "Can pregnant women use the health card?",
            answer: "Yes! We have specialized features for expectant mothers including prenatal visit tracking, medication logs, ultrasound records, and emergency contact information. It's perfect for keeping all pregnancy-related health information in one place."
        },
        {
            id: 5,
            question: "How does the appointment booking system work?",
            answer: "Card owners can set their available time slots in the dashboard. When someone views your visiting card, they can instantly book an appointment from your available schedule. You'll receive notifications and can manage all bookings from your dashboard."
        },
        {
            id: 6,
            question: "Do I need an app to view someone's card?",
            answer: "No! That's the beauty of Zapi Card. Recipients don't need any app. They simply tap their phone on your NFC card or scan the QR code, and your card opens instantly in their web browser. It works on any smartphone."
        },
        {
            id: 7,
            question: "Can I have both a visiting card and health card?",
            answer: "Yes! You can create and manage multiple cards of both types. The Free plan includes 1 of each, while Pro and Healthcare+ plans offer unlimited cards. Perfect for managing both your professional and personal health needs."
        },
        {
            id: 8,
            question: "What happens if I lose my NFC card?",
            answer: "Your digital card is cloud-based, so it's never really lost! You can deactivate the physical NFC card from your dashboard and order a replacement. Your digital card link and QR code continue working normally."
        }
    ]

    useEffect(() => {
        setMounted(true)
    }, [])

    // Generate FAQ structured data
    const faqSchema = generateFAQSchema(faqs)

    return (
        <>
            {/* Structured Data for FAQs */}
            <Script
                id="faq-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            {/* All Sections as Components - Clean & organized! */}
            <HeroSection mounted={mounted} />
            <HealthCardShowcase />
            <HowItWorksSection />
            <FeaturesSection />
            <PricingSection />
            <BenefitsSection />
            <VideoDemoSection />
            <TrustedBySection />
            <TestimonialsSection mounted={mounted} />
            <ComparisonSection />
            <FinalCTASection />
            <FAQSection faqs={faqs} openFaq={openFaq} setOpenFaq={setOpenFaq} />
        </>
    )
}

