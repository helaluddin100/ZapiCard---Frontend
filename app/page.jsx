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
  ArrowRight
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { generateFAQSchema } from './metadata'

export default function Home() {
  const [openFaq, setOpenFaq] = useState(null)
  const [mounted, setMounted] = useState(false)

  const faqs = [
    {
      id: 1,
      question: "What is a smart visiting card?",
      answer: "A smart visiting card combines traditional business card information with modern technology like QR codes and NFC chips, allowing instant digital sharing and contact saving."
    },
    {
      id: 2,
      question: "How does NFC technology work?",
      answer: "NFC (Near Field Communication) allows two devices to communicate when they're close together. Simply tap your NFC card on a smartphone to instantly share your contact information."
    },
    {
      id: 3,
      question: "Can I customize my QR code?",
      answer: "Yes! You can customize your QR code's color, shape, and even add your logo in the center to match your brand identity."
    },
    {
      id: 4,
      question: "What happens if I lose my NFC card?",
      answer: "Don't worry! You can deactivate the lost card from your dashboard and order a replacement. Your digital card will continue to work normally."
    },
    {
      id: 5,
      question: "Is there a mobile app?",
      answer: "Currently, our platform is web-based and fully responsive. A mobile app is in development and will be available soon."
    }
  ]

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Marketing Director",
      company: "TechCorp",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      rating: 5,
      text: "Zapi Card transformed how I network. The NFC feature is a game-changer at events!"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Sales Manager",
      company: "Global Sales Inc",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      rating: 5,
      text: "Professional, modern, and incredibly easy to use. My clients love the digital experience."
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Freelance Designer",
      company: "Creative Studio",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
      rating: 5,
      text: "The customization options are amazing. I can match my card to my brand perfectly!"
    }
  ]

  useEffect(() => {
    setMounted(true)
  }, [])

  const features = [
    {
      icon: <QrCode className="w-8 h-8" />,
      title: "Digital Card",
      description: "Create beautiful digital business cards that work on any device"
    },
    {
      icon: <QrCode className="w-8 h-8" />,
      title: "QR Code",
      description: "Generate customizable QR codes for instant contact sharing"
    },
    {
      icon: <Radio className="w-8 h-8" />,
      title: "NFC Tap",
      description: "Tap to share - NFC technology for seamless networking"
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Appointments",
      description: "Let clients book appointments directly from your card"
    }
  ]

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      period: "/month",
      features: [
        "1 Digital Card",
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
      features: [
        "Unlimited Cards",
        "Custom QR Codes",
        "NFC Card Included",
        "Premium Templates",
        "Analytics Dashboard",
        "Priority Support"
      ],
      cta: "Go Pro",
      popular: true
    },
    {
      name: "Business",
      price: "$29.99",
      period: "/month",
      features: [
        "Everything in Pro",
        "Team Management",
        "Custom Branding",
        "API Access",
        "Appointment Booking",
        "Advanced Analytics",
        "Dedicated Support"
      ],
      cta: "Contact Sales",
      popular: false
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
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-white drop-shadow-2xl"
            >
              Your Smart Visiting Card
              <br />
              <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent animate-gradient">
                In Your Pocket
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-xl md:text-2xl lg:text-3xl text-white/90 mb-8 max-w-3xl mx-auto font-medium drop-shadow-lg"
            >
              Create, share, and manage your digital business card with QR codes and NFC technology.
              <br />
              <span className="text-white/80 text-lg md:text-xl">Network smarter, not harder.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                href="/signup"
                className="group relative px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg shadow-2xl hover:shadow-white/50 transition-all duration-300 transform hover:scale-105 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Create Your Card
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={false}
                />
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
              className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
            >
              {[
                { number: '10K+', label: 'Active Users' },
                { number: '50K+', label: 'Cards Created' },
                { number: '4.9★', label: 'User Rating' }
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.2 + idx * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-white/80 text-sm md:text-base">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-gray-100">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Sign Up", desc: "Create your free account in seconds" },
              { step: "2", title: "Design Your Card", desc: "Customize your card with your info and branding" },
              { step: "3", title: "Share & Network", desc: "Share via QR, NFC, or link - it's that simple!" }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 card-hover"
              >
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
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-gray-100">Powerful Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass-effect p-6 rounded-xl card-hover bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              >
                <div className="text-blue-600 dark:text-blue-400 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900 dark:text-gray-100">Simple, Transparent Pricing</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12">Choose the plan that&rsquo;s right for you</p>
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`relative p-8 rounded-2xl ${plan.popular
                  ? 'gradient-primary text-white scale-105'
                  : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700'
                  } card-hover`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-yellow-400 dark:bg-yellow-500 text-gray-900 dark:text-gray-900 rounded-full text-sm font-bold">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-lg">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start">
                      <CheckCircle2 className={`w-5 h-5 mr-2 flex-shrink-0 ${plan.popular ? 'text-white' : 'text-green-500 dark:text-green-400'}`} />
                      <span className={plan.popular ? '' : 'text-gray-700 dark:text-gray-300'}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={`block text-center py-3 rounded-lg font-semibold transition ${plan.popular
                    ? 'bg-white text-blue-600 hover:bg-gray-100'
                    : 'btn-primary'
                    }`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
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

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
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
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity blur-xl"></div>

                <div className="relative glass-effect p-6 md:p-8 rounded-2xl card-hover bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-2xl transition-all">
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

