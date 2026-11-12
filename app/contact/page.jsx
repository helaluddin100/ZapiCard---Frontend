'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, MessageCircle, AlertCircle, CheckCircle2, Send } from 'lucide-react'
import { contactAPI } from '@/lib/api'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function ContactPage() {
  const { t, lang } = useLanguage()
  const c = t.contact

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
    if (fieldErrors[field]) setFieldErrors({ ...fieldErrors, [field]: '' })
    if (error) setError('')
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.firstName.trim()) errors.firstName = c.errors.firstName
    if (!formData.lastName.trim()) errors.lastName = c.errors.lastName
    if (!formData.email.trim()) errors.email = c.errors.email
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = c.errors.emailInvalid
    if (!formData.subject.trim()) errors.subject = c.errors.subject
    if (!formData.message.trim()) errors.message = c.errors.message
    else if (formData.message.trim().length < 10) errors.message = c.errors.messageShort
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    setError('')
    try {
      await contactAPI.submitContactForm(formData)
      setSubmitted(true)
      setFormData({ firstName: '', lastName: '', email: '', subject: '', message: '' })
    } catch (err) {
      setError(err.message || c.errors.failed)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = (hasError) =>
    `w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
      hasError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'
    }`

  if (submitted) {
    return (
      <div className={`min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4 ${lang === 'bn' ? 'font-bengali' : ''}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center border border-teal-100 dark:border-gray-700"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-teal-700 dark:text-teal-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{c.successTitle}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{c.successDesc}</p>
          <button onClick={() => setSubmitted(false)} className="btn-primary">
            {c.sendAnother}
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-white dark:bg-gray-900 ${lang === 'bn' ? 'font-bengali' : ''}`}>
      <section className="relative pt-36 pb-16 px-4 sm:px-6 lg:px-8 bg-teal-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{c.title}</h1>
          <p className="text-lg md:text-xl text-teal-50">{c.subtitle}</p>
        </div>
      </section>

      <section className="py-14 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
            {[
              { icon: Mail, title: c.email, content: 'zapycardbd@gmail.com', link: 'mailto:zapycardbd@gmail.com' },
              { icon: Phone, title: c.phone, content: '+880 1744220807', link: 'tel:+8801744220807', note: c.phoneNote },
              { icon: MapPin, title: c.office, content: 'Dhaka, Bangladesh', note: c.officeNote },
              { icon: MessageCircle, title: c.support, content: c.supportContent, note: c.supportNote },
            ].map((item, idx) => {
              const Icon = item.icon
              return (
                <div key={idx} className="text-center p-6 rounded-2xl bg-teal-50 dark:bg-gray-800 border border-teal-100 dark:border-gray-700">
                  <div className="text-teal-700 dark:text-teal-300 mb-3 flex justify-center">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">{item.title}</h3>
                  {item.link ? (
                    <a href={item.link} className="text-gray-600 dark:text-gray-400 hover:text-teal-700 transition-colors">
                      {item.content}
                    </a>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400">{item.content}</p>
                  )}
                  {item.note && <p className="text-sm text-gray-500 mt-1">{item.note}</p>}
                </div>
              )
            })}
          </div>

          <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 border border-teal-100 dark:border-gray-700">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-teal-900 dark:text-teal-200 text-center">
              {c.formTitle}
            </h2>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg flex items-center gap-2 mb-6">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{c.firstName}</label>
                  <input type="text" value={formData.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} className={inputClass(fieldErrors.firstName)} required />
                  {fieldErrors.firstName && <p className="mt-1 text-sm text-red-600">{fieldErrors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{c.lastName}</label>
                  <input type="text" value={formData.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)} className={inputClass(fieldErrors.lastName)} required />
                  {fieldErrors.lastName && <p className="mt-1 text-sm text-red-600">{fieldErrors.lastName}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{c.emailLabel}</label>
                <input type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} className={inputClass(fieldErrors.email)} required />
                {fieldErrors.email && <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{c.subject}</label>
                <input type="text" value={formData.subject} onChange={(e) => handleInputChange('subject', e.target.value)} className={inputClass(fieldErrors.subject)} required />
                {fieldErrors.subject && <p className="mt-1 text-sm text-red-600">{fieldErrors.subject}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{c.message}</label>
                <textarea rows="5" value={formData.message} onChange={(e) => handleInputChange('message', e.target.value)} className={inputClass(fieldErrors.message)} required />
                {fieldErrors.message && <p className="mt-1 text-sm text-red-600">{fieldErrors.message}</p>}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 text-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    {c.sending}
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    {c.send}
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
