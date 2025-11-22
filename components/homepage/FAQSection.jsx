'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronDown, HelpCircle, Sparkles, ArrowRight, MessageCircle } from 'lucide-react'

export default function FAQSection({ faqs, openFaq, setOpenFaq }) {
  return (
    <section id="faq" className="py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-pink-50/50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl"
        ></motion.div>
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.15, 0.1],
            x: [0, -30, 0],
            y: [0, 50, 0]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-purple-300/20 rounded-full blur-3xl"
        ></motion.div>
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl"
        ></motion.div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
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
              <HelpCircle className="w-4 h-4" />
              Got Questions?
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 dark:from-white dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent leading-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Everything you need to know about Zapi Card
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4 md:space-y-6">
          {faqs.map((faq, idx) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative group"
            >
              {/* Glow effect on hover */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity blur-xl"></div>

              {/* FAQ Card */}
              <div className="relative bg-white dark:bg-gray-800 rounded-3xl border-2 border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                {/* Question Button */}
                <motion.button
                  onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                  className="w-full px-6 md:px-8 py-6 md:py-7 flex justify-between items-center text-left group/button hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 dark:hover:from-blue-900/10 dark:hover:to-purple-900/10 transition-all"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-start gap-4 flex-1">
                    {/* Question Number Badge */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-lg ${openFaq === faq.id ? 'scale-110' : ''} transition-transform`}>
                      {idx + 1}
                    </div>
                    
                    {/* Question Text */}
                    <span className={`font-bold text-lg md:text-xl text-gray-900 dark:text-gray-100 pr-4 group-hover/button:text-blue-600 dark:group-hover/button:text-blue-400 transition-colors flex-1 ${openFaq === faq.id ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                      {faq.question}
                    </span>
                  </div>

                  {/* Chevron Icon */}
                  <motion.div
                    animate={{ 
                      rotate: openFaq === faq.id ? 180 : 0,
                      scale: openFaq === faq.id ? 1.1 : 1
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg group-hover/button:shadow-xl transition-all ${openFaq === faq.id ? 'ring-2 ring-purple-300 dark:ring-purple-700' : ''}`}
                  >
                    <ChevronDown className="w-6 h-6" />
                  </motion.div>
                </motion.button>

                {/* Answer Content */}
                <motion.div
                  initial={false}
                  animate={{
                    height: openFaq === faq.id ? 'auto' : 0,
                    opacity: openFaq === faq.id ? 1 : 0
                  }}
                  transition={{
                    height: { duration: 0.4, ease: "easeInOut" },
                    opacity: { duration: 0.3, ease: "easeInOut" }
                  }}
                  className="overflow-hidden"
                >
                  <div className="px-6 md:px-8 pb-6 md:pb-7 pt-2">
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{
                        opacity: openFaq === faq.id ? 1 : 0,
                        y: openFaq === faq.id ? 0 : -10
                      }}
                      transition={{ delay: 0.1 }}
                      className="relative p-6 rounded-2xl bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 border-l-4 border-blue-500 dark:border-blue-400 shadow-inner"
                    >
                      {/* Decorative icon */}
                      <div className="absolute top-4 right-4 opacity-20">
                        <Sparkles className="w-8 h-8 text-blue-500" />
                      </div>
                      
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base md:text-lg relative z-10">
                        {faq.answer}
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-block p-8 md:p-10 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl border-2 border-blue-200 dark:border-blue-800 shadow-2xl max-w-2xl">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 mb-4 shadow-lg"
            >
              <MessageCircle className="w-8 h-8 text-white" />
            </motion.div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              Still have questions?
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              We&apos;re here to help! Get in touch with our support team
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold text-lg rounded-xl shadow-2xl hover:shadow-blue-500/50 transition-all transform hover:scale-105"
            >
              <span>Contact Us</span>
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

