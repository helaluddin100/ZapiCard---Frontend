'use client'

import { motion } from 'framer-motion'

export default function TrustedBySection() {
    const trustedBy = [
        "City Hospital", "Metro Clinic", "TechCorp Solutions", "Creative Agency",
        "Global Sales Inc", "Healthcare Plus", "Digital Marketing Pro", "Wellness Center"
    ]

    return (
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
    )
}

