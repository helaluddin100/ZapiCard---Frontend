'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, MessageCircle, AlertCircle, CheckCircle2, Send } from 'lucide-react'
import { contactAPI } from '@/lib/api'
import Image from 'next/image'
import logo from '../assets/images/logo.png'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
    if (fieldErrors[field]) {
      setFieldErrors({ ...fieldErrors, [field]: '' })
    }
    if (error) setError('')
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required'
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required'
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required'
    }

    if (!formData.message.trim()) {
      errors.message = 'Message is required'
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError('')

    try {
      await contactAPI.submitContactForm(formData)
      setSubmitted(true)
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: ''
      })
    } catch (err) {
      setError(err.message || 'Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center border border-gray-200 dark:border-gray-700"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center"
          >
            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Message Sent!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Thank you for contacting us. We&apos;ll get back to you within 24 hours.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="btn-primary"
          >
            Send Another Message
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl md:text-2xl text-white/90">
            We&apos;re here to help! Reach out to us anytime
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              {
                icon: <Mail className="w-8 h-8" />,
                title: 'Email',
                content: 'support@zapycard.com',
                link: 'mailto:support@zapycard.com',
              },
              {
                icon: <Phone className="w-8 h-8" />,
                title: 'Phone',
                content: '+880 1744220807',
                link: 'tel:+8801744220807',
                note: 'Sunday-Thursday, 9AM-5PM EST',
              },
              {
                icon: <MapPin className="w-8 h-8" />,
                title: 'Office',
                content: 'Dhaka, Bangladesh',
                link: null,
                note: 'Remote-first company',
              },
              {
                icon: <MessageCircle className="w-8 h-8" />,
                title: 'Support',
                content: 'Email or Contact Form',
                link: null,
                note: 'We respond within 24 hours',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 hover:shadow-lg transition-shadow"
              >
                <div className="text-blue-600 dark:text-blue-400 mb-4 flex justify-center">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                  {item.title}
                </h3>
                {item.link ? (
                  <a
                    href={item.link}
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {item.content}
                  </a>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">{item.content}</p>
                )}
                {item.note && (
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">{item.note}</p>
                )}
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100 text-center">
              Send us a Message
            </h2>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg flex items-center gap-2 mb-6"
              >
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${fieldErrors.firstName
                      ? 'border-red-500 dark:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                      }`}
                    required
                  />
                  {fieldErrors.firstName && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${fieldErrors.lastName
                      ? 'border-red-500 dark:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                      }`}
                    required
                  />
                  {fieldErrors.lastName && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.lastName}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${fieldErrors.email
                    ? 'border-red-500 dark:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                    }`}
                  required
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${fieldErrors.subject
                    ? 'border-red-500 dark:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                    }`}
                  required
                />
                {fieldErrors.subject && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.subject}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  rows="5"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${fieldErrors.message
                    ? 'border-red-500 dark:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                    }`}
                  required
                ></textarea>
                {fieldErrors.message && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.message}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 text-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
