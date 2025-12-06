'use client'

import { motion } from 'framer-motion'
import { Shield, Lock, Eye, FileText, Users, Database, Globe, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function PrivacyPolicyPage() {
    const sections = [
        {
            icon: <Shield className="w-6 h-6" />,
            title: "1. Information We Collect",
            content: [
                "Personal Information: Name, email address, phone number, postal address, and payment information when you register or make a purchase.",
                "Health Information: Medical records, prescriptions, health history, and other health-related data you choose to store in your health card.",
                "Business Information: Professional details, contact information, and business card data.",
                "Usage Data: Information about how you use our services, including device information, IP address, browser type, and access times.",
                "Cookies and Tracking: We use cookies and similar technologies to enhance your experience and analyze service usage."
            ]
        },
        {
            icon: <Lock className="w-6 h-6" />,
            title: "2. How We Use Your Information",
            content: [
                "To provide and maintain our services, including NFC and QR code functionality.",
                "To process your orders and deliver physical cards.",
                "To manage your account and provide customer support.",
                "To send important updates, service notifications, and marketing communications (with your consent).",
                "To improve our services through data analysis and research.",
                "To comply with legal obligations under Bangladeshi law."
            ]
        },
        {
            icon: <Eye className="w-6 h-6" />,
            title: "3. Data Security",
            content: [
                "We implement industry-standard security measures including SSL encryption (256-bit) to protect your data.",
                "All health information is encrypted at rest and in transit.",
                "Access to personal data is restricted to authorized personnel only.",
                "We regularly update our security protocols to protect against unauthorized access, alteration, disclosure, or destruction.",
                "Despite our efforts, no method of transmission over the internet is 100% secure."
            ]
        },
        {
            icon: <Database className="w-6 h-6" />,
            title: "4. Data Storage and Retention",
            content: [
                "Your data is stored on secure servers located in Bangladesh and may be backed up in secure cloud storage.",
                "We retain your personal information for as long as necessary to provide our services and comply with legal obligations.",
                "Health card data is retained until you delete your account or request deletion.",
                "Upon account deletion, we will delete or anonymize your data within 30 days, except where retention is required by law."
            ]
        },
        {
            icon: <Users className="w-6 h-6" />,
            title: "5. Sharing of Information",
            content: [
                "We do not sell your personal information to third parties.",
                "We may share data with service providers who assist in operations (payment processors, hosting providers) under strict confidentiality agreements.",
                "We may disclose information if required by Bangladeshi law or legal process.",
                "Your health card information is only accessible to individuals you explicitly authorize through the sharing features.",
                "In case of business transfer or merger, your data may be transferred with proper notice."
            ]
        },
        {
            icon: <Globe className="w-6 h-6" />,
            title: "6. Your Rights Under Bangladeshi Law",
            content: [
                "Right to Access: You can request a copy of your personal data.",
                "Right to Correction: You can update or correct inaccurate information.",
                "Right to Deletion: You can request deletion of your data, subject to legal requirements.",
                "Right to Object: You can object to processing of your data for marketing purposes.",
                "Right to Data Portability: You can request your data in a portable format.",
                "Right to Withdraw Consent: You can withdraw consent for data processing at any time."
            ]
        },
        {
            icon: <FileText className="w-6 h-6" />,
            title: "7. Cookies and Tracking Technologies",
            content: [
                "We use cookies to enhance user experience, analyze usage, and personalize content.",
                "You can control cookies through your browser settings.",
                "Essential cookies are necessary for service functionality and cannot be disabled.",
                "Analytics cookies help us understand how users interact with our services."
            ]
        },
        {
            icon: <CheckCircle2 className="w-6 h-6" />,
            title: "8. Children's Privacy",
            content: [
                "Our services are not intended for children under 13 years of age.",
                "We do not knowingly collect personal information from children under 13.",
                "If we become aware that we have collected data from a child under 13, we will take steps to delete such information."
            ]
        }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-16 md:pt-20">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
                        <p className="text-xl text-blue-100">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </motion.div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Introduction */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8"
                >
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                        At <strong>Zapy Card</strong>, we are committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services, including our website, mobile applications, and physical NFC/QR cards.
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        This policy is governed by the laws of Bangladesh, including but not limited to the <strong>Digital Security Act, 2018</strong> and other applicable data protection regulations. By using our services, you consent to the collection and use of information in accordance with this policy.
                    </p>
                </motion.div>

                {/* Sections */}
                {sections.map((section, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-6"
                    >
                        <div className="flex items-start gap-4 mb-4">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                                {section.icon}
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex-1">
                                {section.title}
                            </h2>
                        </div>
                        <ul className="space-y-3 ml-16">
                            {section.content.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                    <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                                    <span className="text-gray-700 dark:text-gray-300 leading-relaxed">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                ))}

                {/* Contact Information */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.9 }}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-lg p-8 text-white"
                >
                    <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
                    <p className="mb-4">If you have questions about this Privacy Policy or wish to exercise your rights, please contact us:</p>
                    <ul className="space-y-2">
                        <li><strong>Email:</strong> privacy@zapycard.com</li>
                        <li><strong>Phone:</strong> +880 1744220807</li>
                        <li><strong>Address:</strong> Dhaka, Bangladesh</li>
                    </ul>
                </motion.div>

                {/* Changes to Policy */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.0 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mt-6"
                >
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Changes to This Privacy Policy</h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
                    </p>
                </motion.div>

                {/* Back to Home */}
                <div className="mt-8 text-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all"
                    >
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    )
}

