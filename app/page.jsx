'use client'

import Link from 'next/link'
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
  Linkedin
} from 'lucide-react'
import { useState } from 'react'

export default function Home() {
  const [openFaq, setOpenFaq] = useState(null)

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

  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-primary bg-clip-text text-transparent">
              Your Smart Visiting Card
              <br />
              <span className="text-gray-900">In Your Pocket</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Create, share, and manage your digital business card with QR codes and NFC technology.
              Network smarter, not harder.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" className="btn-primary text-lg">
                Create Your Card
              </Link>
              <Link href="/nfc-order" className="btn-secondary text-lg">
                Order NFC Card
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
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
                className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 card-hover"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center text-white text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-2xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Powerful Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass-effect p-6 rounded-xl card-hover"
              >
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Simple, Transparent Pricing</h2>
          <p className="text-center text-gray-600 mb-12">Choose the plan that&rsquo;s right for you</p>
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
                  : 'bg-white border-2 border-gray-200'
                  } card-hover`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-yellow-400 text-gray-900 rounded-full text-sm font-bold">
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
                      <CheckCircle2 className={`w-5 h-5 mr-2 flex-shrink-0 ${plan.popular ? 'text-white' : 'text-green-500'}`} />
                      <span>{feature}</span>
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
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-gray-600 mb-6">Join thousands of satisfied professionals</p>
            <Link href="/testimonials" className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center">
              View All Testimonials →
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass-effect p-6 rounded-xl card-hover"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">&ldquo;{testimonial.text}&ldquo;</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-3 object-cover"
                  />
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}, {testimonial.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                  className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-gray-50 transition"
                >
                  <span className="font-semibold text-lg">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${openFaq === faq.id ? 'transform rotate-180' : ''}`}
                  />
                </button>
                {openFaq === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 py-4 bg-gray-50 text-gray-700"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

