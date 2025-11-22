'use client'

import { motion } from 'framer-motion'

export default function StatsSection() {
    const stats = [
        { number: '15K+', label: 'Active Users', color: 'from-blue-500 to-cyan-500' },
        { number: '80K+', label: 'Cards Created', color: 'from-purple-500 to-pink-500' },
        { number: '5K+', label: 'Health Cards', color: 'from-pink-500 to-rose-500' },
        { number: '4.9★', label: 'User Rating', color: 'from-blue-500 to-purple-500' }
    ]

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Trusted by Thousands Worldwide
          </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Join the smart card revolution today
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                delay: idx * 0.1,
                                type: 'spring',
                                stiffness: 100
                            }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            className="relative group"
                        >
                            {/* Gradient background on hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity blur-xl`}></div>

                            {/* Card */}
                            <div className="relative text-center p-8 md:p-10 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all border-2 border-gray-200 dark:border-gray-700 group-hover:border-purple-300 dark:group-hover:border-purple-700">
                                {/* Number with gradient - No icons! */}
                                <div className={`text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                                    {stat.number}
                                </div>

                                {/* Label */}
                                <div className="text-base md:text-lg text-gray-600 dark:text-gray-400 font-medium">
                                    {stat.label}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

