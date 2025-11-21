'use client'

import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'
import { motion } from 'framer-motion'
import {
  QrCode,
  Radio,
  Calendar,
  CheckCircle2,
  Star,
  ChevronDown,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Quote,
  ArrowRight,
  Zap,
  Shield,
  Clock,
  Users,
  TrendingUp,
  Heart,
  Smartphone,
  Globe,
  Award,
  Target,
  PlayCircle
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { generateFAQSchema } from './metadata'

export default function Home() {
  const [openFaq, setOpenFaq] = useState(null)
  const [mounted, setMounted] = useState(false)

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

  const testimonials = [
    {
      id: 1,
      name: "Dr. Sarah Ahmed",
      role: "Cardiologist",
      company: "City Hospital",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      rating: 5,
      text: "Smart Health Cards have revolutionized how we access patient information in emergencies. Life-saving technology!",
      type: "health"
    },
    {
      id: 2,
      name: "Ayesha Rahman",
      role: "Expecting Mother",
      company: "Healthcare User",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
      rating: 5,
      text: "The pregnancy tracking feature is amazing! All my prenatal records in one place with instant access.",
      type: "health"
    },
    {
      id: 3,
      name: "Michael Chen",
      role: "Sales Manager",
      company: "TechCorp Ltd",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      rating: 5,
      text: "The appointment booking feature in my visiting card increased my bookings by 300%!",
      type: "business"
    },
    {
      id: 4,
      name: "Rafiq Ahmed",
      role: "Chronic Patient",
      company: "Healthcare User",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
      rating: 5,
      text: "Managing my diabetes has never been easier. AI prescription reading saves so much time!",
      type: "health"
    },
    {
      id: 5,
      name: "Emily Rodriguez",
      role: "Freelance Designer",
      company: "Creative Studio",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
      rating: 5,
      text: "Professional, modern NFC card. My clients are impressed every time I tap to share!",
      type: "business"
    },
    {
      id: 6,
      name: "Dr. Rahman Khan",
      role: "General Physician",
      company: "Metro Clinic",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop",
      rating: 5,
      text: "Recommending Smart Health Cards to all my patients. Quick access to medical history is crucial.",
      type: "health"
    }
  ]

  const benefits = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Access",
      description: "Share or access information in seconds with NFC tap or QR scan"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Private",
      description: "Bank-level encryption protects your sensitive data"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "24/7 Available",
      description: "Your digital card works anytime, anywhere"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Easy to Share",
      description: "No app required - works with any smartphone"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Analytics Included",
      description: "Track views, scans, and engagement metrics"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Eco-Friendly",
      description: "Save paper and reduce environmental impact"
    }
  ]

  const trustedBy = [
    "City Hospital", "Metro Clinic", "TechCorp Solutions", "Creative Agency",
    "Global Sales Inc", "Healthcare Plus", "Digital Marketing Pro", "Wellness Center"
  ]

  useEffect(() => {
    setMounted(true)
  }, [])

  const features = [
    {
      icon: <QrCode className="w-8 h-8" />,
      title: "Smart Visiting Card",
      description: "Create professional digital business cards with QR and NFC technology",
      highlight: false
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Appointment Booking",
      description: "Let visitors book appointments directly - schedule management made easy",
      highlight: false
    },
    {
      icon: <Radio className="w-8 h-8" />,
      title: "Smart Health Card",
      description: "Revolutionary health cards for patients, pregnant women with AI prescription scanning",
      highlight: true
    },
    {
      icon: <CheckCircle2 className="w-8 h-8" />,
      title: "NFC & QR Technology",
      description: "Instant access - tap NFC or scan QR to view complete health/contact information",
      highlight: false
    }
  ]

  const healthCardFeatures = [
    {
      title: "AI Prescription Reading",
      description: "Upload prescription images - AI automatically reads and inputs data",
      icon: "🤖"
    },
    {
      title: "Manual Data Entry",
      description: "Complete control - add health records, medications, and allergies manually",
      icon: "✍️"
    },
    {
      title: "Emergency Access",
      description: "Critical health info available instantly via NFC tap or QR scan",
      icon: "🚨"
    },
    {
      title: "Pregnancy Tracking",
      description: "Specialized cards for expectant mothers with prenatal records",
      icon: "🤰"
    },
    {
      title: "Medical History",
      description: "Complete health timeline - past treatments, surgeries, and conditions",
      icon: "📋"
    },
    {
      title: "Secure & Private",
      description: "Your health data encrypted and accessible only by authorized personnel",
      icon: "🔒"
    }
  ]

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      period: "/month",
      type: "Basic",
      features: [
        "1 Visiting Card",
        "1 Health Card",
        "Basic QR Code",
        "Standard Templates",
        "Email Support"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Pro",
      price: "$9.99",
      period: "/month",
      type: "Most Popular",
      features: [
        "Unlimited Visiting Cards",
        "Unlimited Health Cards",
        "NFC Card Included",
        "AI Prescription Reading",
        "Appointment Booking",
        "Premium Templates",
        "Analytics Dashboard",
        "Priority Support"
      ],
      cta: "Go Pro",
      popular: true
    },
    {
      name: "Healthcare+",
      price: "$19.99",
      period: "/month",
      type: "For Medical Professionals",
      features: [
        "Everything in Pro",
        "Advanced Health Features",
        "Patient Management",
        "Prescription History",
        "Emergency Contacts",
        "Family Health Cards",
        "Medical Records Storage",
        "24/7 Support"
      ],
      cta: "Get Healthcare+",
      popular: false,
      highlight: true
    }
  ]

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

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 z-0">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-500/50 via-purple-500/50 to-pink-500/50"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        </div>

        {/* Floating Elements */}
        {mounted && (
          <div className="absolute inset-0 z-5 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => {
              const randomLeft = 10 + (i * 13.33) % 80
              const randomTop = 10 + (i * 15) % 80
              return (
                <motion.div
                  key={i}
                  className="absolute w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/10 backdrop-blur-sm"
                  initial={{
                    scale: 0,
                    opacity: 0,
                  }}
                  animate={{
                    y: [0, -30, 0],
                    x: [0, 20, 0],
                    scale: [0, 1, 0.8],
                    opacity: [0, 0.5, 0],
                  }}
                  transition={{
                    duration: 8 + i * 2,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "easeInOut",
                  }}
                  style={{
                    left: `${randomLeft}%`,
                    top: `${randomTop}%`,
                  }}
                />
              )
            })}
          </div>
        )}

        {/* Content */}
        <div className="relative z-20 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center"
          >
            {/* Animated Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="inline-block mb-6"
            >
              <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-white text-sm font-semibold border border-white/30">
                ✨ Smart Networking Revolution
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white drop-shadow-2xl"
            >
              Smart Cards for
              <br />
              <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent animate-gradient">
                Business & Health
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-xl md:text-2xl lg:text-3xl text-white/90 mb-8 max-w-4xl mx-auto font-medium drop-shadow-lg"
            >
              Revolutionary digital cards with <span className="font-bold text-yellow-300">NFC & QR technology</span>
              <br />
              <span className="text-white/90 text-lg md:text-xl">
                📇 Smart Visiting Cards for Professionals | 🏥 Smart Health Cards for Patients
              </span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                href="/health-dashboard/create"
                className="group relative px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-lg shadow-2xl hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-105"
              >
                <span className="relative z-10 flex items-center gap-2">
                  🏥 Create Health Card
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </span>
              </Link>
              <Link
                href="/dashboard/create"
                className="group relative px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg shadow-2xl hover:shadow-white/50 transition-all duration-300 transform hover:scale-105 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  📇 Create Visiting Card
                </span>
              </Link>
              <Link
                href="/nfc-order"
                className="group px-8 py-4 bg-white/10 backdrop-blur-md text-white border-2 border-white/30 rounded-xl font-bold text-lg hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
              >
                Order NFC Card
              </Link>
            </motion.div>


            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto"
            >
              {[
                { number: '15K+', label: 'Active Users', icon: '👥' },
                { number: '80K+', label: 'Cards Created', icon: '📇' },
                { number: '5K+', label: 'Health Cards', icon: '🏥' },
                { number: '4.9★', label: 'User Rating', icon: '⭐' }
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.2 + idx * 0.1 }}
                  className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                >
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-white/80 text-sm md:text-base">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Smart Health Card Showcase - Main Feature */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 text-9xl">🏥</div>
          <div className="absolute bottom-20 right-10 text-9xl">💊</div>
          <div className="absolute top-40 right-20 text-7xl">🩺</div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-300 text-sm font-semibold border border-green-200 dark:border-green-800 mb-6">
              🏥 Revolutionary Healthcare Solution
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-primary bg-clip-text text-transparent">
              Smart Health Card
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Perfect for patients, pregnant women, and anyone who needs instant access to their medical information
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {healthCardFeatures.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 border border-gray-200 dark:border-gray-700"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link
              href="/health-dashboard/create"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg rounded-xl shadow-2xl hover:shadow-green-500/50 transition-all transform hover:scale-105"
            >
              🏥 Create Your Health Card Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900 dark:text-gray-100">How It Works</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Create your smart card in 3 simple steps - whether it&apos;s for business or health
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Create Account", desc: "Sign up for free and choose your card type - Visiting or Health Card", icon: "👤" },
              { step: "2", title: "Add Information", desc: "Fill in your details or upload prescriptions for AI to read automatically", icon: "✍️" },
              { step: "3", title: "Share & Access", desc: "Share via QR code, NFC tap, or direct link - instant access anywhere!", icon: "🚀" }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 card-hover border-2 border-transparent hover:border-blue-300 dark:hover:border-blue-700"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center text-white text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-100">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Powerful Features for Every Need
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Two revolutionary card systems in one platform - Business networking and Healthcare management
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`glass-effect p-6 rounded-xl card-hover border-2 transition-all ${feature.highlight
                  ? 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-400 text-white scale-105 shadow-2xl'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  }`}
              >
                <div className={`mb-4 ${feature.highlight ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`}>
                  {feature.icon}
                </div>
                <h3 className={`text-xl font-semibold mb-2 ${feature.highlight ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                  {feature.title}
                  {feature.highlight && <span className="ml-2 text-yellow-300">⭐</span>}
                </h3>
                <p className={feature.highlight ? 'text-white/90' : 'text-gray-600 dark:text-gray-400'}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Use Cases */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 grid md:grid-cols-2 gap-8"
          >
            {/* Visiting Card Use Case */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-4xl">📇</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Smart Visiting Card</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Perfect for professionals and businesses</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">QR Code & NFC instant sharing</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">Appointment booking system</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">Schedule management for clients</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">Professional digital presence</span>
                </li>
              </ul>
            </div>

            {/* Health Card Use Case */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-8 rounded-2xl shadow-xl border-2 border-green-400">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-4xl">🏥</div>
                <h3 className="text-2xl font-bold text-white">Smart Health Card</h3>
              </div>
              <p className="text-white/90 mb-4">Essential for patients and pregnant women</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                  <span className="text-white">AI prescription reading & data entry</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                  <span className="text-white">Complete medical history tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                  <span className="text-white">Emergency access via NFC/QR scan</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                  <span className="text-white">Pregnancy & chronic condition support</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Choose the perfect plan for your needs - Business, Health, or Both
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`relative p-8 rounded-2xl ${plan.popular
                  ? 'gradient-primary text-white scale-105 shadow-2xl'
                  : plan.highlight
                    ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white border-2 border-green-400 shadow-2xl'
                    : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700'
                  } card-hover`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-yellow-400 dark:bg-yellow-500 text-gray-900 rounded-full text-sm font-bold">
                    {plan.type}
                  </div>
                )}
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-white text-green-600 rounded-full text-sm font-bold shadow-lg">
                    🏥 {plan.type}
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                {!plan.popular && !plan.highlight && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{plan.type}</p>
                )}
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-lg">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start">
                      <CheckCircle2 className={`w-5 h-5 mr-2 flex-shrink-0 ${plan.popular || plan.highlight ? 'text-white' : 'text-green-500 dark:text-green-400'
                        }`} />
                      <span className={plan.popular || plan.highlight ? '' : 'text-gray-700 dark:text-gray-300'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={`block text-center py-3 rounded-lg font-semibold transition ${plan.popular || plan.highlight
                    ? 'bg-white text-blue-600 hover:bg-gray-100'
                    : 'btn-primary'
                    }`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Enterprise CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Need a custom solution for your hospital or large organization?
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105"
            >
              Contact Sales Team
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us / Benefits */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Why Choose Zapi Card?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Trusted by thousands of professionals and healthcare users worldwide
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-4 p-6 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 hover:shadow-lg transition-shadow"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center">
                  {benefit.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Demo Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              See Zapi Card in Action
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Watch how easy it is to create and share your smart cards
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-600 to-purple-600"
          >
            {/* Video Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="group relative">
                <div className="absolute inset-0 bg-white rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                  <PlayCircle className="w-12 h-12 text-blue-600" />
                </div>
              </button>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-8 left-8 text-white">
              <p className="text-2xl font-bold mb-2">3-Minute Quick Tour</p>
              <p className="text-white/80">Learn everything about Smart Cards</p>
            </div>
          </motion.div>

          {/* Key Stats Below Video */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {[
              { number: "2 Min", label: "Setup Time" },
              { number: "100%", label: "Digital" },
              { number: "∞", label: "Shares" },
              { number: "24/7", label: "Access" }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
              >
                <div className="text-3xl md:text-4xl font-bold gradient-primary bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              Trusted by leading organizations
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
              {trustedBy.map((company, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="text-gray-500 dark:text-gray-500 font-semibold text-sm md:text-base hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {company}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-200 dark:bg-blue-900/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-purple-200 dark:bg-purple-900/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-pink-200 dark:bg-pink-900/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-block mb-6"
            >
              <span className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 text-sm font-semibold border border-blue-200 dark:border-blue-800">
                ✨ Testimonials
              </span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-primary bg-clip-text text-transparent">
              What Our Users Say
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">Join thousands of satisfied professionals</p>
            <Link
              href="/testimonials"
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold group"
            >
              View All Testimonials
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, type: 'spring', stiffness: 100 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="relative group"
              >
                {/* Decorative gradient background on hover */}
                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity blur-xl ${testimonial.type === 'health'
                  ? 'bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500'
                  : 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500'
                  }`}></div>

                <div className={`relative glass-effect p-6 md:p-8 rounded-2xl card-hover shadow-lg hover:shadow-2xl transition-all ${testimonial.type === 'health'
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200/50 dark:border-green-700/50'
                  : 'bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50'
                  }`}>
                  {/* Quote Icon */}
                  <div className="absolute top-4 right-4 opacity-10 dark:opacity-20">
                    <Quote className="w-16 h-16 text-blue-500 dark:text-blue-400" />
                  </div>

                  {/* Rating Stars */}
                  {mounted && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.15 + 0.2 }}
                      className="flex items-center gap-1 mb-6"
                    >
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.15 + 0.3 + i * 0.1, type: 'spring' }}
                        >
                          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                  {!mounted && (
                    <div className="flex items-center gap-1 mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
                      ))}
                    </div>
                  )}

                  {/* Testimonial Text */}
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.15 + 0.3 }}
                    className="text-gray-700 dark:text-gray-300 mb-6 italic text-base md:text-lg leading-relaxed relative z-10"
                  >
                    &ldquo;{testimonial.text}&rdquo;
                  </motion.p>

                  {/* Author Info */}
                  <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="relative w-14 h-14 flex-shrink-0"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur opacity-50"></div>
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={56}
                        height={56}
                        className="relative w-14 h-14 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-lg"
                        quality={85}
                      />
                    </motion.div>
                    <div className="flex-1">
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.15 + 0.4 }}
                        className="font-bold text-gray-900 dark:text-gray-100 text-lg"
                      >
                        {testimonial.name}
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.15 + 0.5 }}
                        className="text-sm text-gray-600 dark:text-gray-400 font-medium"
                      >
                        {testimonial.role}
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.15 + 0.6 }}
                        className="text-xs text-gray-500 dark:text-gray-500"
                      >
                        {testimonial.company}
                      </motion.div>
                    </div>
                  </div>

                  {/* Decorative bottom accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison: Traditional vs Smart Cards */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Traditional vs Smart Cards
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              See why thousands are making the switch
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Traditional Cards */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 bg-gray-100 dark:bg-gray-800 rounded-2xl border-2 border-gray-300 dark:border-gray-700"
            >
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">📄</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Traditional Cards</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "❌ Limited information space",
                  "❌ Easily lost or damaged",
                  "❌ Need reprinting for updates",
                  "❌ No analytics or tracking",
                  "❌ Environmental waste",
                  "❌ One-way information sharing",
                  "❌ No appointment booking",
                  "❌ Manual data entry required"
                ].map((item, idx) => (
                  <li key={idx} className="text-gray-700 dark:text-gray-300 flex items-start gap-2">
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Smart Cards */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl border-2 border-green-400 shadow-2xl transform scale-105"
            >
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">✨</div>
                <h3 className="text-2xl font-bold text-white">Zapi Smart Cards</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "✅ Unlimited information storage",
                  "✅ Cloud-based, never lost",
                  "✅ Instant updates anytime",
                  "✅ Complete analytics dashboard",
                  "✅ 100% eco-friendly",
                  "✅ Two-way communication",
                  "✅ Built-in appointment system",
                  "✅ AI-powered data reading"
                ].map((item, idx) => (
                  <li key={idx} className="text-white font-medium flex items-start gap-2">
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-6 border-t border-white/20">
                <Link
                  href="/signup"
                  className="block text-center py-3 bg-white text-green-600 rounded-lg font-bold hover:bg-gray-100 transition-all transform hover:scale-105"
                >
                  Make the Switch Today →
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-500/50 via-purple-500/50 to-pink-500/50"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Ready to Go Smart?
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join 15,000+ users who have already made the switch to smart digital cards
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link
                href="/signup"
                className="group px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg shadow-2xl hover:shadow-white/50 transition-all transform hover:scale-105"
              >
                <span className="flex items-center gap-2">
                  Create Free Account
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link
                href="/nfc-order"
                className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border-2 border-white/30 rounded-xl font-bold text-lg hover:bg-white/20 transition-all transform hover:scale-105"
              >
                Order NFC Card
              </Link>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-6 text-white/80 text-sm">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                No credit card required
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Free forever plan
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Cancel anytime
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400 dark:bg-blue-900 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400 dark:bg-purple-900 rounded-full filter blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-block mb-4">
              <span className="px-4 py-1 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 text-sm font-semibold border border-blue-200 dark:border-blue-800">
                FAQ
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-primary bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Everything you need to know about Zapi Card</p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity blur-xl"></div>
                <div className="relative glass-effect rounded-2xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all bg-white dark:bg-gray-800">
                  <motion.button
                    onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                    className="w-full px-6 md:px-8 py-5 md:py-6 flex justify-between items-center text-left group/button"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <span className="font-bold text-lg md:text-xl text-gray-900 dark:text-gray-100 pr-4 group-hover/button:text-blue-600 dark:group-hover/button:text-blue-400 transition-colors">
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: openFaq === faq.id ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white shadow-lg group-hover/button:shadow-xl transition-all"
                    >
                      <ChevronDown className="w-5 h-5" />
                    </motion.div>
                  </motion.button>

                  <motion.div
                    initial={false}
                    animate={{
                      height: openFaq === faq.id ? 'auto' : 0,
                      opacity: openFaq === faq.id ? 1 : 0
                    }}
                    transition={{
                      height: { duration: 0.3, ease: "easeInOut" },
                      opacity: { duration: 0.2, ease: "easeInOut" }
                    }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 md:px-8 pb-5 md:pb-6 pt-2">
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{
                          opacity: openFaq === faq.id ? 1 : 0,
                          y: openFaq === faq.id ? 0 : -10
                        }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-700 dark:text-gray-300 leading-relaxed text-base md:text-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border-l-4 border-blue-500 dark:border-blue-400"
                      >
                        {faq.answer}
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <p className="text-gray-600 dark:text-gray-400 mb-4">Still have questions?</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105"
            >
              Contact Us
              <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}

