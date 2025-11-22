'use client'

import { motion } from 'framer-motion'
import { Zap, Shield, Clock, Users, TrendingUp, Heart, Sparkles, Star } from 'lucide-react'

export default function BenefitsSection() {
    const benefits = [
        {
            icon: Zap,
            title: "Instant Access",
            description: "Share or access information in seconds with NFC tap or QR scan",
            iconColor: 'from-blue-500 to-cyan-500',
            bgColor: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
            borderColor: 'border-blue-200 dark:border-blue-800'
        },
        {
            icon: Shield,
            title: "Secure & Private",
            description: "Bank-level encryption protects your sensitive data",
            iconColor: 'from-purple-500 to-pink-500',
            bgColor: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
            borderColor: 'border-purple-200 dark:border-purple-800'
        },
        {
            icon: Clock,
            title: "24/7 Available",
            description: "Your digital card works anytime, anywhere",
            iconColor: 'from-indigo-500 to-purple-500',
            bgColor: 'from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20',
            borderColor: 'border-indigo-200 dark:border-indigo-800'
        },
        {
            icon: Users,
            title: "Easy to Share",
            description: "No app required - works with any smartphone",
            iconColor: 'from-pink-500 to-rose-500',
            bgColor: 'from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20',
            borderColor: 'border-pink-200 dark:border-pink-800'
        },
        {
            icon: TrendingUp,
            title: "Analytics Included",
            description: "Track views, scans, and engagement metrics",
            iconColor: 'from-blue-500 to-cyan-500',
            bgColor: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
            borderColor: 'border-blue-200 dark:border-blue-800'
        },
        {
            icon: Heart,
            title: "Eco-Friendly",
            description: "Save paper and reduce environmental impact",
            iconColor: 'from-emerald-500 to-teal-500',
            bgColor: 'from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20',
            borderColor: 'border-emerald-200 dark:border-emerald-800'
        }
    ]

  return (
    <section className="py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"
        ></motion.div>
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-purple-200/20 rounded-full blur-3xl"
        ></motion.div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block mb-6"
          >
            <span className="px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-300/30 dark:border-blue-600/30 text-blue-600 dark:text-blue-400 text-sm md:text-base font-semibold flex items-center gap-2">
              <Star className="w-4 h-4" />
              Key Benefits
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 dark:from-white dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent leading-tight">
            Why Choose Zapi Card?
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Trusted by thousands of professionals and healthcare users worldwide
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {benefits.map((benefit, idx) => {
            const IconComponent = benefit.icon
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
                {/* Card */}
                <div className={`relative h-full p-8 rounded-3xl border-2 transition-all duration-300 bg-gradient-to-br ${benefit.bgColor} ${benefit.borderColor} shadow-lg hover:shadow-2xl dark:bg-gray-800/50`}>
                  {/* Icon with gradient background */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 bg-gradient-to-br ${benefit.iconColor} shadow-lg`}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">
                    {benefit.title}
                  </h3>
                  <p className="text-base md:text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                    {benefit.description}
                  </p>

                  {/* Decorative element */}
                  <div className={`absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br ${benefit.iconColor} opacity-10 rounded-full blur-2xl`}></div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom Stats/Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { number: "15K+", label: "Active Users", icon: Users },
            { number: "80K+", label: "Cards Created", icon: TrendingUp },
            { number: "4.9★", label: "User Rating", icon: Star },
            { number: "99.9%", label: "Uptime", icon: Shield }
          ].map((stat, idx) => {
            const IconComponent = stat.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 + idx * 0.1 }}
                className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 mb-3 shadow-lg">
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-1">
                  {stat.number}
                </div>
                <div className="text-sm md:text-base text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

