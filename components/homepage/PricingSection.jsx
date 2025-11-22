'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle2, ArrowRight, Sparkles, TrendingUp, Heart, Zap } from 'lucide-react'

export default function PricingSection() {
    const pricingPlans = [
        {
            name: "Free",
            price: "$0",
            period: "/month",
            type: "Basic",
            icon: Zap,
            iconColor: 'from-gray-400 to-gray-600',
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
            icon: TrendingUp,
            iconColor: 'from-blue-500 to-purple-500',
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
            icon: Heart,
            iconColor: 'from-pink-500 to-rose-500',
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

  return (
    <section id="pricing" className="py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
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
              <Sparkles className="w-4 h-4" />
              Choose Your Plan
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 dark:from-white dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent leading-tight">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Choose the perfect plan for your needs - Business, Health, or Both
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {pricingPlans.map((plan, idx) => {
            const IconComponent = plan.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                whileHover={{ y: -10, scale: plan.popular ? 1.05 : 1.02 }}
                className={`relative group ${plan.popular ? 'md:scale-105 z-10' : ''}`}
              >
                {/* Glow effect for popular plan */}
                {plan.popular && (
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                )}

                {/* Card */}
                <div className={`relative h-full p-8 md:p-10 rounded-3xl border-2 transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 border-purple-400 shadow-2xl text-white'
                    : plan.highlight
                      ? 'bg-gradient-to-br from-pink-600 via-rose-600 to-purple-600 border-pink-400 shadow-2xl text-white'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl'
                }`}>
                  {/* Badge */}
                  {(plan.popular || plan.highlight) && (
                    <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-20">
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className={`px-6 py-2 rounded-full text-sm font-bold shadow-lg ${
                          plan.popular
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 border-2 border-white/50'
                            : 'bg-white text-pink-600 border-2 border-pink-300'
                        }`}
                      >
                        {plan.popular && <Sparkles className="w-4 h-4 inline mr-2" />}
                        {plan.highlight && <Heart className="w-4 h-4 inline mr-2" />}
                        {plan.type}
                      </motion.div>
                    </div>
                  )}

                  {/* Icon */}
                  <div className="text-center mb-6">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 bg-gradient-to-br ${plan.iconColor} shadow-lg ${
                        !plan.popular && !plan.highlight ? 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800' : ''
                      }`}
                    >
                      <IconComponent className={`w-10 h-10 ${
                        plan.popular || plan.highlight ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                      }`} />
                    </motion.div>
                    <h3 className={`text-3xl md:text-4xl font-bold mb-2 ${
                      plan.popular || plan.highlight ? 'text-white' : 'text-gray-900 dark:text-gray-100'
                    }`}>
                      {plan.name}
                    </h3>
                    {!plan.popular && !plan.highlight && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">{plan.type}</p>
                    )}
                  </div>

                  {/* Price */}
                  <div className={`text-center mb-8 pb-8 border-b-2 ${
                    plan.popular || plan.highlight ? 'border-white/20' : 'border-gray-200 dark:border-gray-700'
                  }`}>
                    <div className="flex items-baseline justify-center gap-2">
                      <span className={`text-5xl md:text-6xl font-bold ${
                        plan.popular || plan.highlight ? 'text-white' : 'text-gray-900 dark:text-gray-100'
                      }`}>
                        {plan.price}
                      </span>
                      <span className={`text-xl ${
                        plan.popular || plan.highlight ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {plan.period}
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, fIdx) => (
                      <motion.li
                        key={fIdx}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.15 + fIdx * 0.05 }}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle2 className={`w-6 h-6 flex-shrink-0 mt-0.5 ${
                          plan.popular || plan.highlight 
                            ? 'text-white' 
                            : 'text-blue-500 dark:text-blue-400'
                        }`} />
                        <span className={`text-base md:text-lg ${
                          plan.popular || plan.highlight 
                            ? 'text-white/90' 
                            : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {feature}
                        </span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Link
                    href="/signup"
                    className={`block text-center py-4 rounded-xl font-bold text-lg transition-all ${
                      plan.popular || plan.highlight
                        ? 'bg-white text-blue-600 hover:bg-gray-50 shadow-xl hover:shadow-2xl transform hover:scale-105'
                        : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:shadow-xl transform hover:scale-105'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Enterprise CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-block p-8 md:p-10 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl border-2 border-blue-200 dark:border-blue-800 shadow-2xl max-w-2xl">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              Need a Custom Solution?
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              For hospitals or large organizations, we offer tailored enterprise solutions
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold text-lg rounded-xl shadow-2xl hover:shadow-blue-500/50 transition-all transform hover:scale-105"
            >
              <span>Contact Sales Team</span>
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

