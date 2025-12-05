'use client'

import { motion } from 'framer-motion'
import { Target, Heart, Zap, Shield, Users, TrendingUp, Sparkles, Globe, Award, Lightbulb } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description: "Transform traditional business cards into smart, eco-friendly digital solutions that make networking effortless and sustainable.",
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Heart,
      title: "Our Vision",
      description: "To become the global leader in digital networking solutions, connecting professionals worldwide through innovative technology.",
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "We continuously push boundaries with cutting-edge NFC and QR technology to deliver seamless user experiences.",
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: Shield,
      title: "Security First",
      description: "Your data is protected with bank-level encryption. Privacy and security are at the core of everything we build.",
      color: 'from-indigo-500 to-purple-500'
    }
  ]

  const features = [
    {
      icon: Globe,
      title: "Eco-Friendly",
      description: "Reduce paper waste with digital cards"
    },
    {
      icon: Zap,
      title: "Always Updated",
      description: "Change your information anytime, anywhere"
    },
    {
      icon: Award,
      title: "Professional",
      description: "Make a lasting impression with modern technology"
    },
    {
      icon: TrendingUp,
      title: "Analytics",
      description: "Track who views your card and when"
    },
    {
      icon: Users,
      title: "Integration",
      description: "Connect with CRM systems and appointment booking"
    },
    {
      icon: Lightbulb,
      title: "Smart Technology",
      description: "NFC and QR code technology for instant sharing"
    }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
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

        {/* Background Icons */}
        <div className="absolute inset-0 z-5 overflow-hidden pointer-events-none opacity-10">
          {[Sparkles, Target, Heart, Zap].map((Icon, i) => (
            <motion.div
              key={i}
              className="absolute text-8xl"
              initial={{
                scale: 0,
                opacity: 0,
                rotate: 0,
              }}
              animate={{
                scale: [0.8, 1.2, 0.8],
                opacity: [0.2, 0.4, 0.2],
                rotate: [0, 10, -10, 0],
                y: [0, -20, 0],
              }}
              transition={{
                duration: 8 + i,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut",
              }}
              style={{
                left: `${20 + i * 25}%`,
                top: `${20 + i * 20}%`,
              }}
            >
              <Icon className="w-full h-full" />
            </motion.div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-block mb-8"
            >
              <span className="px-6 py-3 rounded-full bg-white/20 backdrop-blur-md text-white text-sm md:text-base font-semibold border border-white/30 shadow-lg">
                ✨ Our Story
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 drop-shadow-2xl leading-tight"
            >
              About Zapy Card
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-xl md:text-2xl lg:text-3xl text-white/90 max-w-3xl mx-auto leading-relaxed"
            >
              Revolutionizing the way professionals network and share information
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 dark:from-white dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, idx) => {
              const IconComponent = value.icon
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="relative group"
                >
                  <div className="relative h-full p-8 md:p-10 bg-white dark:bg-gray-800 rounded-3xl border-2 border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 bg-gradient-to-br ${value.color} shadow-lg`}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                      {value.title}
                    </h3>
                    <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-28 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Why Choose Zapy Card?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover what makes us different
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, idx) => {
              const IconComponent = feature.icon
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 mb-4 shadow-lg">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-pink-50/50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-10 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-200/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 dark:from-white dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Our Technology
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Cutting-edge solutions for modern networking
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-8 md:p-10 bg-white dark:bg-gray-800 rounded-3xl border-2 border-gray-200 dark:border-gray-700 shadow-xl"
          >
            <p className="text-lg md:text-xl leading-relaxed text-gray-700 dark:text-gray-300 mb-6">
              We leverage cutting-edge <strong className="text-blue-600 dark:text-blue-400">NFC</strong> and <strong className="text-purple-600 dark:text-purple-400">QR code</strong> technology to deliver instant information sharing. With just a tap or scan, your contacts can save your information, visit your website, or book an appointment - all without downloading any apps.
            </p>
            <p className="text-lg md:text-xl leading-relaxed text-gray-700 dark:text-gray-300">
              Our platform is built with security, scalability, and user experience in mind, ensuring that every interaction is smooth, fast, and secure.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Join Us?
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Start creating your smart card today and experience the future of networking
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-3 px-10 py-5 bg-white text-blue-600 rounded-xl font-bold text-lg md:text-xl shadow-2xl hover:shadow-white/50 transition-all transform hover:scale-105"
            >
              Get Started Free
              <Sparkles className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
