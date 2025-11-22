'use client'

import { motion } from 'framer-motion'
import { Calendar, Heart, Radio, Sparkles, CheckCircle2, CreditCard } from 'lucide-react'

export default function FeaturesSection() {
    const features = [
        {
            icon: CreditCard,
            iconColor: 'from-blue-500 to-cyan-500',
            bgColor: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
            borderColor: 'border-blue-200 dark:border-blue-800',
            title: "Smart Visiting Card",
            description: "Create professional digital business cards with QR and NFC technology",
            highlight: false
        },
        {
            icon: Calendar,
            iconColor: 'from-purple-500 to-pink-500',
            bgColor: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
            borderColor: 'border-purple-200 dark:border-purple-800',
            title: "Appointment Booking",
            description: "Let visitors book appointments directly - schedule management made easy",
            highlight: false
        },
        {
            icon: Heart,
            iconColor: 'from-pink-500 to-rose-500',
            bgColor: 'from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20',
            borderColor: 'border-pink-200 dark:border-pink-800',
            title: "Smart Health Card",
            description: "Revolutionary health cards for patients, pregnant women with AI prescription scanning",
            highlight: true
        },
        {
            icon: Radio,
            iconColor: 'from-indigo-500 to-purple-500',
            bgColor: 'from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20',
            borderColor: 'border-indigo-200 dark:border-indigo-800',
            title: "NFC & QR Technology",
            description: "Instant access - tap NFC or scan QR to view complete health/contact information",
            highlight: false
        }
    ]

  return (
    <section id="features" className="py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-pink-50/50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block mb-6"
          >
            <span className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-300/30 dark:border-blue-600/30 text-blue-600 dark:text-blue-400 text-sm font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Core Features
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 dark:from-white dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            Powerful Features for Every Need
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Two revolutionary card systems in one platform - Business networking and Healthcare management
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, idx) => {
            const IconComponent = feature.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative group"
              >
                {/* Glow effect for highlight */}
                {feature.highlight && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity"></div>
                )}

                <div className={`relative h-full p-8 rounded-3xl border-2 transition-all duration-300 ${
                  feature.highlight
                    ? 'bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 border-purple-400 shadow-2xl text-white'
                    : `bg-gradient-to-br ${feature.bgColor} ${feature.borderColor} shadow-lg hover:shadow-xl dark:bg-gray-800/50`
                }`}>
                  {/* Icon with gradient background */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 ${
                      feature.highlight
                        ? 'bg-white/20 backdrop-blur-sm border border-white/30'
                        : `bg-gradient-to-br ${feature.iconColor} shadow-lg`
                    }`}
                  >
                    <IconComponent className={`w-8 h-8 ${
                      feature.highlight ? 'text-white' : 'text-white'
                    }`} />
                  </motion.div>

                  <h3 className={`text-xl md:text-2xl font-bold mb-3 ${
                    feature.highlight ? 'text-white' : 'text-gray-900 dark:text-gray-100'
                  }`}>
                    {feature.title}
                    {feature.highlight && (
                      <motion.span
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="ml-2 inline-block"
                      >
                        ⭐
                      </motion.span>
                    )}
                  </h3>
                  <p className={`text-base leading-relaxed ${
                    feature.highlight ? 'text-white/90' : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {feature.description}
                  </p>

                  {/* Decorative element */}
                  {feature.highlight && (
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Use Cases */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-20 grid md:grid-cols-2 gap-8 lg:gap-12"
        >
          {/* Visiting Card Use Case */}
          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className="relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative bg-white dark:bg-gray-800 p-8 md:p-10 rounded-3xl shadow-xl border-2 border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">Smart Visiting Card</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Perfect for professionals</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">Ideal for business networking and professional connections</p>
              <ul className="space-y-4">
                {[
                  "QR Code & NFC instant sharing",
                  "Appointment booking system",
                  "Schedule management for clients",
                  "Professional digital presence"
                ].map((item, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    <CheckCircle2 className="w-5 h-5 text-blue-500 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Health Card Use Case */}
          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className="relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-8 md:p-10 rounded-3xl shadow-2xl border-2 border-purple-400">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white">Smart Health Card</h3>
                  <p className="text-sm text-white/80">Essential for healthcare</p>
                </div>
              </div>
              <p className="text-white/90 mb-6 text-lg">Revolutionary solution for patients and healthcare providers</p>
              <ul className="space-y-4">
                {[
                  "AI prescription reading & data entry",
                  "Complete medical history tracking",
                  "Emergency access via NFC/QR scan",
                  "Pregnancy & chronic condition support"
                ].map((item, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors border border-white/20"
                  >
                    <CheckCircle2 className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                    <span className="text-white font-medium">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>
            </div>
        </section>
    )
}

