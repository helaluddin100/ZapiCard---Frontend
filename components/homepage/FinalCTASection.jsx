'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle2, ArrowRight } from 'lucide-react'

export default function FinalCTASection() {
  return (
    <section className="py-16 md:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
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
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-4 md:mb-6 px-2">
                        Ready to Go Smart?
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-6 md:mb-8 max-w-2xl mx-auto px-2">
                        Join 15,000+ users who have already made the switch to smart digital cards
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-6 md:mb-8 px-2">
                        <Link
                            href="/signup"
                            className="group w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 rounded-xl font-bold text-base sm:text-lg shadow-2xl hover:shadow-white/50 transition-all transform hover:scale-105 text-center"
                        >
                            <span className="flex items-center justify-center gap-2">
                                Create Free Account
                                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>
                        <Link
                            href="/nfc-order"
                            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-md text-white border-2 border-white/30 rounded-xl font-bold text-base sm:text-lg hover:bg-white/20 transition-all transform hover:scale-105 text-center"
                        >
                            Order NFC Card
                        </Link>
                    </div>

                    <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-white/80 text-xs sm:text-sm px-2">
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
    )
}

