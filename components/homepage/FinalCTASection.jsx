'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle2, ArrowRight } from 'lucide-react'

export default function FinalCTASection() {
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
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
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        Ready to Go Smart?
                    </h2>
                    <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
                        Join 15,000+ users who have already made the switch to smart digital cards
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                        <Link
                            href="/signup"
                            className="group px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg shadow-2xl hover:shadow-white/50 transition-all transform hover:scale-105"
                        >
                            <span className="flex items-center gap-2">
                                Create Free Account
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>
                        <Link
                            href="/nfc-order"
                            className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border-2 border-white/30 rounded-xl font-bold text-lg hover:bg-white/20 transition-all transform hover:scale-105"
                        >
                            Order NFC Card
                        </Link>
                    </div>

                    <div className="flex flex-wrap justify-center items-center gap-6 text-white/80 text-sm">
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

