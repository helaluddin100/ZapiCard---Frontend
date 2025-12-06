'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { UserPlus, FileEdit, Share2, Sparkles, ArrowRight } from 'lucide-react'

export default function HowItWorksSection() {
  const steps = [
    {
      step: "1",
      title: "Create Account",
      desc: "Sign up for free and choose your card type - Visiting or Health Card",
      icon: UserPlus,
      iconColor: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800'
    },
    {
      step: "2",
      title: "Add Information",
      desc: "Fill in your details or upload prescriptions for AI to read automatically",
      icon: FileEdit,
      iconColor: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
      borderColor: 'border-purple-200 dark:border-purple-800'
    },
    {
      step: "3",
      title: "Share & Access",
      desc: "Share via QR code, NFC tap, or direct link - instant access anywhere!",
      icon: Share2,
      iconColor: 'from-pink-500 to-rose-500',
      bgColor: 'from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20',
      borderColor: 'border-pink-200 dark:border-pink-800'
    }
  ]

  return (
    <section className="py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
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
            <span className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-300/30 dark:border-blue-600/30 text-blue-600 dark:text-blue-400 text-sm md:text-base font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Simple Process
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 dark:from-white dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Create your smart card in 3 simple steps - whether it&apos;s for business or health
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 dark:from-blue-800 dark:via-purple-800 dark:to-pink-800 transform -translate-y-1/2 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative z-10">
            {steps.map((item, idx) => {
              const IconComponent = item.icon
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.2 }}
                  whileHover={{ y: -10, scale: 1.05 }}
                  className="relative"
                >
                  {/* Step Card */}
                  <div className={`relative h-full p-8 md:p-10 rounded-3xl border-2 transition-all duration-300 bg-gradient-to-br ${item.bgColor} ${item.borderColor} shadow-lg hover:shadow-2xl dark:bg-gray-800/50`}>
                    {/* Step Number Badge */}
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20">
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.2 + 0.3, type: "spring", stiffness: 200 }}
                        className={`w-14 h-14 rounded-full bg-gradient-to-br ${item.iconColor} flex items-center justify-center text-white text-2xl font-bold shadow-2xl border-4 border-white dark:border-gray-900`}
                      >
                        {item.step}
                      </motion.div>
                    </div>

                    {/* Icon */}
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 mt-4 bg-gradient-to-br ${item.iconColor} shadow-lg`}
                    >
                      <IconComponent className="w-10 h-10 text-white" />
                    </motion.div>

                    {/* Content */}
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                      {item.title}
                    </h3>
                    <p className="text-base md:text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                      {item.desc}
                    </p>

                    {/* Decorative element */}
                    <div className={`absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br ${item.iconColor} opacity-10 rounded-full blur-2xl`}></div>
                  </div>

                  {/* Arrow between steps (Desktop) */}
                  {idx < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-6 lg:-right-12 transform -translate-y-1/2 z-20">
                      <motion.div
                        animate={{ x: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: idx * 0.3 }}
                        className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg"
                      >
                        <ArrowRight className="w-6 h-6 text-white" />
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16"
        >
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-6">
            Ready to get started? It only takes a few minutes!
          </p>
          <Link href="/signup">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold text-lg rounded-xl shadow-2xl hover:shadow-blue-500/50 transition-all cursor-pointer"
            >
              <span>Get Started Now</span>
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.span>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

