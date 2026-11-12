'use client'

import { motion } from 'framer-motion'
import { FileText, Scale, AlertCircle, CreditCard, Shield, Users, Ban, CheckCircle2, XCircle } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function TermsOfServicePage() {
    const { t, lang } = useLanguage()
    const legal = t.legal

    const sections = [
        {
            icon: <FileText className="w-6 h-6" />,
            title: "1. Acceptance of Terms",
            content: [
                "By accessing and using Zapy Card services, you accept and agree to be bound by these Terms and Conditions.",
                "These terms are governed by the laws of the People's Republic of Bangladesh.",
                "If you do not agree with any part of these terms, you must not use our services.",
                "We reserve the right to modify these terms at any time, and such modifications will be effective immediately upon posting."
            ]
        },
        {
            icon: <Users className="w-6 h-6" />,
            title: "2. Service Description",
            content: [
                "Zapy Card provides smart health cards accessible via NFC technology and QR codes.",
                "We offer physical NFC cards, digital health card management, appointment booking, and health record management services.",
                "Services include AI-powered prescription reading and health card creation.",
                "We reserve the right to modify, suspend, or discontinue any part of our services at any time."
            ]
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "3. User Accounts and Registration",
            content: [
                "You must be at least 18 years old to create an account or use our services.",
                "You are responsible for maintaining the confidentiality of your account credentials.",
                "You agree to provide accurate, current, and complete information during registration.",
                "You are responsible for all activities that occur under your account.",
                "You must immediately notify us of any unauthorized use of your account.",
                "We reserve the right to suspend or terminate accounts that violate these terms."
            ]
        },
        {
            icon: <CreditCard className="w-6 h-6" />,
            title: "4. Payment Terms",
            content: [
                "All prices are in Bangladeshi Taka (BDT) unless otherwise stated.",
                "Payment must be made in full before order processing and card production.",
                "We accept payment through credit/debit cards, mobile banking, and other approved payment methods.",
                "All sales are final except as provided in our Return Policy.",
                "Refunds will be processed according to our Return Policy and applicable Bangladeshi consumer protection laws.",
                "We reserve the right to change pricing with 30 days' notice to existing customers."
            ]
        },
        {
            icon: <AlertCircle className="w-6 h-6" />,
            title: "5. User Responsibilities and Prohibited Uses",
            content: [
                "You agree not to use our services for any illegal or unauthorized purpose.",
                "You must not violate any laws in your jurisdiction, including Bangladeshi law.",
                "You must not transmit any viruses, malware, or harmful code.",
                "You must not attempt to gain unauthorized access to our systems or other users' accounts.",
                "You must not use our services to harass, abuse, or harm others.",
                "You must not use our services to store or transmit illegal content.",
                "You are responsible for the accuracy of information you provide, including card design details."
            ]
        },
        {
            icon: <Scale className="w-6 h-6" />,
            title: "6. Intellectual Property Rights",
            content: [
                "All content, features, and functionality of Zapy Card are owned by us and protected by Bangladeshi copyright and trademark laws.",
                "You may not copy, modify, distribute, or create derivative works from our content without written permission.",
                "You retain ownership of content you create using our services, but grant us a license to use it for service provision.",
                "You grant us the right to use your name, logo, and business information for card creation and delivery."
            ]
        },
        {
            icon: <Ban className="w-6 h-6" />,
            title: "7. Limitation of Liability",
            content: [
                "To the maximum extent permitted by Bangladeshi law, Zapy Card shall not be liable for any indirect, incidental, special, or consequential damages.",
                "Our total liability shall not exceed the amount you paid for our services in the 12 months preceding the claim.",
                "We are not liable for any loss or damage resulting from unauthorized access to your account.",
                "We are not responsible for any third-party services or websites linked from our platform.",
                "We do not guarantee uninterrupted or error-free service."
            ]
        },
        {
            icon: <CheckCircle2 className="w-6 h-6" />,
            title: "8. Health Card Specific Terms",
            content: [
                "Health cards are for informational purposes and do not replace professional medical advice.",
                "You are solely responsible for the accuracy of health information stored in your health card.",
                "We are not liable for any medical decisions made based on information in your health card.",
                "You must ensure that health information is kept up to date.",
                "In case of medical emergencies, always consult healthcare professionals."
            ]
        },
        {
            icon: <XCircle className="w-6 h-6" />,
            title: "9. Termination",
            content: [
                "We may terminate or suspend your account immediately, without prior notice, for breach of these terms.",
                "Upon termination, your right to use our services will cease immediately.",
                "You may terminate your account at any time by contacting customer support.",
                "All provisions of these terms that by their nature should survive termination shall survive."
            ]
        },
        {
            icon: <Scale className="w-6 h-6" />,
            title: "10. Dispute Resolution",
            content: [
                "Any disputes arising from these terms shall be governed by the laws of Bangladesh.",
                "Disputes shall first be attempted to be resolved through good faith negotiation.",
                "If negotiation fails, disputes shall be subject to the exclusive jurisdiction of the courts of Dhaka, Bangladesh.",
                "You agree to waive any right to a jury trial in any dispute."
            ]
        }
    ]

    return (
        <div className={`min-h-screen bg-white dark:bg-gray-900 pt-16 md:pt-20 ${lang === 'bn' ? 'font-bengali' : ''}`}>
            <div className="bg-teal-700 text-white py-14 md:py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-3xl md:text-5xl font-bold mb-3">{legal.termsTitle}</h1>
                        <p className="text-lg text-teal-50 mb-2">{legal.termsSubtitle}</p>
                        <p className="text-teal-100/80">
                            {legal.lastUpdated}: {new Date().toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-teal-50 dark:bg-gray-800 rounded-2xl border border-teal-100 dark:border-gray-700 p-6 md:p-8 mb-8"
                >
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                        Welcome to <strong>Zapy Card</strong>. These Terms and Conditions (&quot;Terms&quot;) govern your use of our website, mobile applications, and services, including smart health cards, NFC cards, and related services.
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        These Terms are governed by the laws of the <strong>People&apos;s Republic of Bangladesh</strong>, including the Contract Act, 1872, the Sale of Goods Act, 1930, the Consumer Rights Protection Act, 2009, and other applicable laws. By using our services, you agree to comply with these Terms and all applicable Bangladeshi laws.
                    </p>
                </motion.div>

                {/* Sections */}
                {sections.map((section, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl border border-teal-100 dark:border-gray-700 p-6 md:p-8 mb-6"
                    >
                        <div className="flex items-start gap-4 mb-4">
                            <div className="p-3 rounded-xl bg-teal-700 text-white">
                                {section.icon}
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex-1">
                                {section.title}
                            </h2>
                        </div>
                        <ul className="space-y-3 ml-0 md:ml-16">
                            {section.content.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                    <span className="text-teal-700 dark:text-teal-300 mt-1">•</span>
                                    <span className="text-gray-700 dark:text-gray-300 leading-relaxed">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                ))}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-teal-700 rounded-2xl p-6 md:p-8 text-white"
                >
                    <h2 className="text-2xl font-bold mb-4">{t.nav.contact}</h2>
                    <p className="mb-4">{legal.contactCta}</p>
                    <ul className="space-y-2">
                        <li><strong>Email:</strong> legal@zapycard.com</li>
                        <li><strong>Phone:</strong> +880 1744220807</li>
                        <li><strong>Address:</strong> Dhaka, Bangladesh</li>
                    </ul>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl border border-teal-100 dark:border-gray-700 p-6 md:p-8 mt-6"
                >
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Changes to Terms</h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        We reserve the right to modify these Terms at any time. We will notify users of significant changes via email or through our website. Your continued use of our services after such modifications constitutes acceptance of the updated Terms.
                    </p>
                </motion.div>

                <div className="mt-8 text-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-lg transition"
                    >
                        ← {legal.backHome}
                    </Link>
                </div>
            </div>
        </div>
    )
}

