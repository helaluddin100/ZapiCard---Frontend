'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Star, Quote, ArrowRight } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

export default function TestimonialsSection({ mounted }) {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)
    const intervalRef = useRef(null)
    const testimonials = [
        {
            id: 1,
            name: "Dr. Sarah Ahmed",
            role: "Cardiologist",
            company: "City Hospital",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
            rating: 5,
            text: "Smart Health Cards have revolutionized how we access patient information in emergencies. Life-saving technology!",
            type: "health"
        },
        {
            id: 2,
            name: "Ayesha Rahman",
            role: "Expecting Mother",
            company: "Healthcare User",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
            rating: 5,
            text: "The pregnancy tracking feature is amazing! All my prenatal records in one place with instant access.",
            type: "health"
        },
        {
            id: 3,
            name: "Michael Chen",
            role: "Sales Manager",
            company: "TechCorp Ltd",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
            rating: 5,
            text: "The appointment booking feature in my visiting card increased my bookings by 300%!",
            type: "business"
        },
        {
            id: 4,
            name: "Rafiq Ahmed",
            role: "Chronic Patient",
            company: "Healthcare User",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
            rating: 5,
            text: "Managing my diabetes has never been easier. AI prescription reading saves so much time!",
            type: "health"
        },
        {
            id: 5,
            name: "Emily Rodriguez",
            role: "Freelance Designer",
            company: "Creative Studio",
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
            rating: 5,
            text: "Professional, modern NFC card. My clients are impressed every time I tap to share!",
            type: "business"
        },
        {
            id: 6,
            name: "Dr. Rahman Khan",
            role: "General Physician",
            company: "Metro Clinic",
            image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop",
            rating: 5,
            text: "Recommending Smart Health Cards to all my patients. Quick access to medical history is crucial.",
            type: "health"
        }
    ]

    // Auto-slide functionality
    useEffect(() => {
        if (isAutoPlaying && mounted) {
            intervalRef.current = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % testimonials.length)
            }, 5000) // Auto-slide every 5 seconds
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [isAutoPlaying, mounted, testimonials.length])

    const goToSlide = (index) => {
        setCurrentSlide(index)
        setIsAutoPlaying(false)
        // Resume auto-play after 10 seconds
        setTimeout(() => setIsAutoPlaying(true), 10000)
    }

    const nextSlide = () => {
        goToSlide((currentSlide + 1) % testimonials.length)
    }

    const prevSlide = () => {
        goToSlide((currentSlide - 1 + testimonials.length) % testimonials.length)
    }

    return (
        <section id="testimonials" className="py-16 md:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-96 h-96 bg-blue-200 dark:bg-blue-900/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-40 right-10 w-96 h-96 bg-purple-200 dark:bg-purple-900/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-pink-200 dark:bg-pink-900/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center  md:mb-12 lg:mb-16"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        className="inline-block mb-4 md:mb-5 lg:mb-6"
                    >
                        <span className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 text-sm font-semibold border border-blue-200 dark:border-blue-800">
                            ✨ Testimonials
                        </span>
                    </motion.div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-3 lg:mb-4 gradient-primary bg-clip-text text-transparent leading-tight px-2">
                        What Our Users Say
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base md:text-lg mb-3 md:mb-4 lg:mb-5 px-2">Join thousands of satisfied professionals</p>
                    <Link
                        href="/testimonials"
                        className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold group mb-6 md:mb-8 lg:mb-10"
                    >
                        View All Testimonials
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>

                {/* Desktop Grid View */}
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {testimonials.map((testimonial, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30, scale: 0.9 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.15, type: 'spring', stiffness: 100 }}
                            whileHover={{ y: -10, scale: 1.02 }}
                            className="relative group"
                        >
                            {/* Decorative gradient background on hover */}
                            <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity blur-xl ${testimonial.type === 'health'
                                ? 'bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500'
                                : 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500'
                                }`}></div>

                            <div className={`relative glass-effect p-6 md:p-8 rounded-2xl card-hover shadow-lg hover:shadow-2xl transition-all ${testimonial.type === 'health'
                                ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200/50 dark:border-green-700/50'
                                : 'bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50'
                                }`}>
                                {/* Quote Icon */}
                                <div className="absolute top-4 right-4 opacity-10 dark:opacity-20">
                                    <Quote className="w-16 h-16 text-blue-500 dark:text-blue-400" />
                                </div>

                                {/* Rating Stars */}
                                {mounted && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.15 + 0.2 }}
                                        className="flex items-center gap-1 mb-6"
                                    >
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, scale: 0 }}
                                                whileInView={{ opacity: 1, scale: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: idx * 0.15 + 0.3 + i * 0.1, type: 'spring' }}
                                            >
                                                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                )}
                                {!mounted && (
                                    <div className="flex items-center gap-1 mb-6">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
                                        ))}
                                    </div>
                                )}

                                {/* Testimonial Text */}
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.15 + 0.3 }}
                                    className="text-gray-700 dark:text-gray-300 mb-6 italic text-base md:text-lg leading-relaxed relative z-10"
                                >
                                    &ldquo;{testimonial.text}&rdquo;
                                </motion.p>

                                {/* Author Info */}
                                <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <motion.div
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        className="relative w-14 h-14 flex-shrink-0"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur opacity-50"></div>
                                        <Image
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            width={56}
                                            height={56}
                                            className="relative w-14 h-14 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-lg"
                                            quality={85}
                                        />
                                    </motion.div>
                                    <div className="flex-1">
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: idx * 0.15 + 0.4 }}
                                            className="font-bold text-gray-900 dark:text-gray-100 text-lg"
                                        >
                                            {testimonial.name}
                                        </motion.div>
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: idx * 0.15 + 0.5 }}
                                            className="text-sm text-gray-600 dark:text-gray-400 font-medium"
                                        >
                                            {testimonial.role}
                                        </motion.div>
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: idx * 0.15 + 0.6 }}
                                            className="text-xs text-gray-500 dark:text-gray-500"
                                        >
                                            {testimonial.company}
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Decorative bottom accent */}
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Mobile Slider View */}
                <div className="md:hidden relative">
                    <div className="overflow-hidden rounded-2xl">
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                        >
                            {testimonials.map((testimonial, idx) => (
                                <div key={idx} className="min-w-full px-3">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3 }}
                                        className="relative group"
                                    >
                                        {/* Decorative gradient background on hover */}
                                        <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity blur-xl ${testimonial.type === 'health'
                                            ? 'bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500'
                                            : 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500'
                                            }`}></div>

                                        <div className={`relative glass-effect p-6 rounded-2xl card-hover shadow-lg ${testimonial.type === 'health'
                                            ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200/50 dark:border-green-700/50'
                                            : 'bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50'
                                            }`}>
                                            {/* Quote Icon */}
                                            <div className="absolute top-4 right-4 opacity-10 dark:opacity-20">
                                                <Quote className="w-16 h-16 text-blue-500 dark:text-blue-400" />
                                            </div>

                                            {/* Rating Stars */}
                                            {mounted && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: 0.2 }}
                                                    className="flex items-center gap-1 mb-6"
                                                >
                                                    {[...Array(testimonial.rating)].map((_, i) => (
                                                        <motion.div
                                                            key={i}
                                                            initial={{ opacity: 0, scale: 0 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            transition={{ delay: 0.3 + i * 0.1, type: 'spring' }}
                                                        >
                                                            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
                                                        </motion.div>
                                                    ))}
                                                </motion.div>
                                            )}
                                            {!mounted && (
                                                <div className="flex items-center gap-1 mb-6">
                                                    {[...Array(testimonial.rating)].map((_, i) => (
                                                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
                                                    ))}
                                                </div>
                                            )}

                                            {/* Testimonial Text */}
                                            <motion.p
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.3 }}
                                                className="text-gray-700 dark:text-gray-300 mb-5 md:mb-6 italic text-sm sm:text-base leading-relaxed relative z-10"
                                            >
                                                &ldquo;{testimonial.text}&rdquo;
                                            </motion.p>

                                            {/* Author Info */}
                                            <div className="flex items-center gap-3 sm:gap-4 pt-3 md:pt-4 border-t border-gray-200 dark:border-gray-700">
                                                <motion.div
                                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                                    className="relative w-14 h-14 flex-shrink-0"
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur opacity-50"></div>
                                                    <Image
                                                        src={testimonial.image}
                                                        alt={testimonial.name}
                                                        width={56}
                                                        height={56}
                                                        className="relative w-14 h-14 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-lg"
                                                        quality={85}
                                                    />
                                                </motion.div>
                                                <div className="flex-1">
                                                    <motion.div
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.4 }}
                                                        className="font-bold text-gray-900 dark:text-gray-100 text-base sm:text-lg"
                                                    >
                                                        {testimonial.name}
                                                    </motion.div>
                                                    <motion.div
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.5 }}
                                                        className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium mt-0.5"
                                                    >
                                                        {testimonial.role}
                                                    </motion.div>
                                                    <motion.div
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.6 }}
                                                        className="text-xs text-gray-500 dark:text-gray-500 mt-0.5"
                                                    >
                                                        {testimonial.company}
                                                    </motion.div>
                                                </div>
                                            </div>

                                            {/* Decorative bottom accent */}
                                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        </div>
                                    </motion.div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Dots Indicator */}
                    <div className="flex justify-center items-center gap-2 mt-4 md:mt-5 lg:mt-6">
                        {testimonials.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => goToSlide(idx)}
                                className="relative group"
                                aria-label={`Go to slide ${idx + 1}`}
                            >
                                {idx === currentSlide ? (
                                    <motion.div
                                        layoutId="activeDot"
                                        className="w-10 h-2.5 sm:w-12 sm:h-3 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/60 ring-2 ring-purple-400/40 dark:ring-purple-500/60"
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                ) : (
                                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gray-400/60 dark:bg-gray-500/60 group-hover:bg-gray-500 dark:group-hover:bg-gray-400 transition-all duration-300 group-hover:scale-125" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

