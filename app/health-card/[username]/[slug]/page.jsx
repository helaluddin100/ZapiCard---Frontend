'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Script from 'next/script'
import { Download, Share2, ChevronDown, ChevronUp, Calendar, Stethoscope, TestTube, Pill, Utensils, Sun, Moon, Clock, Phone, Droplet, AlertTriangle, User, MapPin, Building2, Monitor } from 'lucide-react'
import { useTheme } from '@/lib/theme'

export default function PublicHealthCardPage() {
  const params = useParams()
  const { username, slug } = params
  const { theme, actualTheme, setThemeMode } = useTheme()
  const [cardData, setCardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [expandedEntries, setExpandedEntries] = useState({})
  const [lightboxImage, setLightboxImage] = useState(null)
  const [mounted, setMounted] = useState(false)
  const [showThemeMenu, setShowThemeMenu] = useState(false)

  // Get API URL from environment variable first (primary source of truth)
  const getApiBase = () => {
    let base = process.env.NEXT_PUBLIC_API_URL

    // If env variable is not set, check if we're on production by hostname
    if (!base && typeof window !== 'undefined') {
      const isProduction = window.location.hostname === 'smart.buytiq.store' ||
        window.location.hostname === 'www.smart.buytiq.store' ||
        window.location.hostname.includes('buytiq.store')

      if (isProduction) {
        base = 'https://smart.buytiq.store/api'
      }
    }

    // Fallback to localhost only if nothing else is available
    if (!base) {
      base = 'http://localhost:8000/api'
    }

    return base
  }

  const apiBase = getApiBase()

  // Get base URL for images (remove /api if present, as images are served from public directory)
  const getImageBaseUrl = () => {
    let base = apiBase
    // Remove /api from the end if present
    if (base.endsWith('/api')) {
      base = base.slice(0, -4)
    } else if (base.endsWith('/api/')) {
      base = base.slice(0, -5)
    }
    return base
  }

  // Helper function to convert relative image paths to full URLs
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null

    const imageBase = getImageBaseUrl()

    // Replace localhost URLs with production URL (handle backend returning localhost URLs)
    if (imagePath.startsWith('http://localhost:8000') || imagePath.startsWith('http://127.0.0.1:8000')) {
      return imagePath.replace(/http:\/\/(localhost|127\.0\.0\.1):8000/, imageBase)
    }

    // If it's already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath
    }

    // If it's a relative path, prepend image base URL (without /api)
    // Remove leading slash if present
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath
    return `${imageBase}/${cleanPath}`
  }

  useEffect(() => {
    setMounted(true)
    loadPublicCard()
  }, [username, slug])

  const loadPublicCard = async () => {
    try {
      setLoading(true)

      const response = await fetch(`${apiBase}/health-cards/public/${username}/${slug}`, {
        headers: {
          'Accept': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.status === 'success') {
          setCardData(data.data)
          // Expand first entry by default
          if (data.data.entries && data.data.entries.length > 0) {
            setExpandedEntries({ [data.data.entries[0].id]: true })
          }
        }
      }
    } catch (error) {
      console.error('Error loading public card:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleEntry = (entryId) => {
    setExpandedEntries(prev => ({
      ...prev,
      [entryId]: !prev[entryId]
    }))
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December']
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
  }

  const getCardTypeLabel = (type) => {
    const types = {
      'pregnant': 'Pregnant',
      'child': 'Child',
      'adult': 'Adult',
      'senior': 'Senior'
    }
    return types[type] || type
  }

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null

    const birthDate = new Date(dateOfBirth)
    const today = new Date()

    let years = today.getFullYear() - birthDate.getFullYear()
    let months = today.getMonth() - birthDate.getMonth()
    let days = today.getDate() - birthDate.getDate()

    // Adjust for negative days
    if (days < 0) {
      months--
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0)
      days += lastMonth.getDate()
    }

    // Adjust for negative months
    if (months < 0) {
      years--
      months += 12
    }

    return { years, months, days }
  }

  const calculatePregnancyWeeks = (expectedDeliveryDate) => {
    if (!expectedDeliveryDate) return null
    const delivery = new Date(expectedDeliveryDate)
    const today = new Date()
    const totalDays = Math.floor((delivery - today) / (1000 * 60 * 60 * 24))
    const weeks = Math.floor((280 - totalDays) / 7)
    return Math.max(0, Math.min(40, weeks))
  }

  const downloadVCard = () => {
    if (!cardData) return

    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${cardData.person_name}
N:${cardData.person_name};;;;
${cardData.emergency_contact ? `TEL:${cardData.emergency_contact}` : ''}
${cardData.blood_group ? `NOTE:Blood Group: ${cardData.blood_group}` : ''}
${cardData.allergies ? `NOTE:Allergies: ${cardData.allergies}` : ''}
END:VCARD`

    const blob = new Blob([vcard], { type: 'text/vcard' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${cardData.person_name.replace(/\s+/g, '_')}.vcf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const shareWhatsApp = () => {
    const url = window.location.href
    const text = `Check out ${cardData?.person_name}'s health card: ${url}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  const generateQRCode = () => {
    if (typeof window !== 'undefined' && window.QRCode) {
      const qrContainer = document.getElementById('qr-code-container')
      if (qrContainer) {
        qrContainer.innerHTML = ''
        new window.QRCode(qrContainer, {
          text: window.location.href,
          width: 200,
          height: 200,
          colorDark: '#10b981',
          colorLight: '#ffffff'
        })
      }
    }
  }

  // Theme options
  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 font-medium">Loading health card...</p>
        </div>
      </div>
    )
  }

  if (!cardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Health Card Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400">The health card you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    )
  }

  const pregnancyWeeks = cardData.card_type === 'pregnant' && cardData.expected_delivery_date
    ? calculatePregnancyWeeks(cardData.expected_delivery_date)
    : null

  return (
    <>
      <Script src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js" defer />
      <Script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js" onLoad={generateQRCode} />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-4 sm:space-y-6">
          {/* Theme Toggle - Fixed Position */}
          {mounted && (
            <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 print:hidden">
              <div className="relative">
                <button
                  onClick={() => setShowThemeMenu(!showThemeMenu)}
                  className="p-2.5 sm:p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200"
                  aria-label="Toggle theme"
                >
                  {actualTheme === 'dark' ? (
                    <Moon className="w-5 h-5 text-blue-500" />
                  ) : (
                    <Sun className="w-5 h-5 text-yellow-500" />
                  )}
                </button>

                {/* Theme Dropdown */}
                {showThemeMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowThemeMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50 overflow-hidden">
                      {themeOptions.map((option) => {
                        const Icon = option.icon
                        const isActive = theme === option.value
                        return (
                          <button
                            key={option.value}
                            onClick={() => {
                              setThemeMode(option.value)
                              setShowThemeMenu(false)
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition text-left ${isActive
                              ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                              : 'text-gray-700 dark:text-gray-300'
                              }`}
                          >
                            <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                            <span className="text-sm font-medium">{option.label}</span>
                            {isActive && (
                              <div className="ml-auto w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400" />
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Main Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 transition-colors duration-300">
            {/* Person Info */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-6 md:gap-8">
              <div className="flex-shrink-0">
                {cardData.person_photo ? (
                  <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full mx-auto p-1 gradient-primary">
                    <img
                      src={getImageUrl(cardData.person_photo)}
                      alt={cardData.person_name}
                      className="w-full h-full rounded-full object-cover"
                      onError={(e) => { e.target.style.display = 'none' }}
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full gradient-primary mx-auto flex items-center justify-center text-white text-3xl sm:text-4xl md:text-5xl font-bold shadow-xl">
                    {cardData.person_name?.charAt(0) || 'H'}
                  </div>
                )}
              </div>
              <div className="flex-1 text-center md:text-left space-y-3 sm:space-y-4 w-full">
                <div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2 break-words">{cardData.person_name}</h1>
                  <span className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-pink-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700 text-xs sm:text-sm font-semibold rounded-full">
                    {getCardTypeLabel(cardData.card_type)}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mt-3 sm:mt-4">
                  {cardData.blood_group && (
                    <div className="flex items-center gap-2 p-2.5 sm:p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800">
                      <Droplet className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs text-gray-500 dark:text-gray-400">Blood Group</div>
                        <div className="font-semibold text-gray-900 dark:text-gray-100 truncate">{cardData.blood_group}</div>
                      </div>
                    </div>
                  )}
                  {cardData.gender && (
                    <div className="flex items-center gap-2 p-2.5 sm:p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs text-gray-500 dark:text-gray-400">Gender</div>
                        <div className="font-semibold text-gray-900 dark:text-gray-100 capitalize truncate">{cardData.gender}</div>
                      </div>
                    </div>
                  )}
                  {cardData.date_of_birth && (() => {
                    const age = calculateAge(cardData.date_of_birth)
                    return (
                      <div className="flex items-center gap-2 p-2.5 sm:p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs text-gray-500 dark:text-gray-400">Date of Birth</div>
                          <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">{formatDate(cardData.date_of_birth)}</div>
                          {age && (
                            <div className="text-xs text-purple-600 dark:text-purple-400 font-medium mt-1 leading-tight">
                              Age: {age.years} {age.years === 1 ? 'year' : 'years'}, {age.months} {age.months === 1 ? 'month' : 'months'}, {age.days} {age.days === 1 ? 'day' : 'days'}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })()}
                  {cardData.emergency_contact && (
                    <div className="flex items-center gap-2 p-2.5 sm:p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs text-gray-500 dark:text-gray-400">Emergency Contact</div>
                        <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base break-words">{cardData.emergency_contact}</div>
                      </div>
                    </div>
                  )}
                </div>

                {cardData.allergies && (
                  <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 rounded-lg">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs sm:text-sm font-semibold text-red-900 dark:text-red-300 mb-1">Allergies</div>
                        <div className="text-sm sm:text-base text-red-700 dark:text-red-400 break-words">{cardData.allergies}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Pregnancy Progress */}
            {pregnancyWeeks !== null && mounted && (
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl p-4 sm:p-6 md:p-8 border border-pink-200 dark:border-pink-800">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 text-center">Pregnancy Progress</h3>
                <div className="flex items-center justify-center">
                  <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56">
                    <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                      <defs>
                        <linearGradient id={`pregnancyGradient-${username}-${slug}`} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="50%" stopColor="#a855f7" />
                          <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                      </defs>
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke={actualTheme === 'dark' ? '#374151' : '#e5e7eb'}
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke={`url(#pregnancyGradient-${username}-${slug})`}
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${(pregnancyWeeks / 40) * 283} 283`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-primary bg-clip-text text-transparent">{pregnancyWeeks}</p>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">of 40 weeks</p>
                        {cardData.expected_delivery_date && (
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 sm:mt-2 px-2">
                            EDD: {formatDate(cardData.expected_delivery_date)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Timeline */}
            {cardData.entries && cardData.entries.length > 0 && (
              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Health Timeline</h2>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs sm:text-sm font-semibold">
                    {cardData.entries.length} {cardData.entries.length === 1 ? 'Entry' : 'Entries'}
                  </span>
                </div>
                {cardData.entries.map((entry, index) => (
                  <div
                    key={entry.id}
                    className="border-2 border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl overflow-hidden bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600 transition-all shadow-sm hover:shadow-md"
                  >
                    <button
                      onClick={() => toggleEntry(entry.id)}
                      className="w-full px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5 flex items-center justify-between hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition gap-2 sm:gap-4"
                    >
                      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0 flex-1">
                        <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 gradient-primary rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base md:text-lg shadow-lg">
                          {index + 1}
                        </div>
                        <div className="text-left min-w-0 flex-1">
                          <div className="font-bold text-base sm:text-lg text-gray-900 dark:text-gray-100 mb-1 break-words">
                            {formatDate(entry.entry_date || entry.created_at)}
                          </div>
                          {entry.doctor_name && (
                            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1.5 sm:gap-2 flex-wrap">
                              <Stethoscope className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                              <span className="font-medium break-words">{entry.doctor_name}</span>
                              {entry.doctor_specialty && (
                                <span className="text-gray-500 dark:text-gray-500 break-words">- {entry.doctor_specialty}</span>
                              )}
                            </div>
                          )}
                          {entry.doctor_hospital && (
                            <div className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1 mt-1 break-words">
                              <Building2 className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{entry.doctor_hospital}</span>
                            </div>
                          )}
                          {entry.doctor_phone && (
                            <div className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1 mt-1">
                              <Phone className="w-3 h-3 flex-shrink-0" />
                              <span className="break-all">{entry.doctor_phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {expandedEntries[entry.id] ? (
                          <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 dark:text-gray-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 dark:text-gray-500" />
                        )}
                      </div>
                    </button>

                    {expandedEntries[entry.id] && (
                      <div className="px-3 sm:px-4 md:px-6 py-4 sm:py-5 md:py-6 border-t border-gray-200 dark:border-gray-700 space-y-4 sm:space-y-6 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
                        {/* Tests */}
                        {entry.tests && entry.tests.length > 0 && (
                          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 md:p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
                            <h4 className="font-bold text-base sm:text-lg text-gray-900 dark:text-gray-100 mb-3 sm:mb-4 flex items-center gap-2">
                              <TestTube className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                              Tests ({entry.tests.length})
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                              {entry.tests.map((test, testIndex) => (
                                <div key={testIndex} className="bg-purple-50 dark:bg-purple-900/20 p-3 sm:p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                                  <div className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100 mb-1 break-words">{test.name}</div>
                                  {test.result && (
                                    <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mt-2 p-2 bg-white dark:bg-gray-800 rounded border border-purple-100 dark:border-purple-800 break-words">
                                      <span className="font-medium">Result: </span>
                                      {test.result}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                            {/* Test Report Images Gallery */}
                            {((entry.test_report_images && Array.isArray(entry.test_report_images) && entry.test_report_images.length > 0) || entry.test_report_image) && (
                              <div className="mt-3 sm:mt-4">
                                <h5 className="font-semibold text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">Test Report Images</h5>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                                  {entry.test_report_images && Array.isArray(entry.test_report_images) && entry.test_report_images.length > 0 ? (
                                    entry.test_report_images.map((img, imgIndex) => {
                                      const imageUrl = getImageUrl(img)
                                      return imageUrl ? (
                                        <div key={imgIndex} className="relative group">
                                          <img
                                            src={imageUrl}
                                            alt={`Test report ${imgIndex + 1}`}
                                            onClick={() => setLightboxImage(imageUrl)}
                                            className="w-full h-24 sm:h-28 md:h-32 object-cover rounded-lg border-2 border-purple-200 dark:border-purple-700 cursor-pointer hover:opacity-80 transition shadow-sm hover:shadow-md"
                                            onError={(e) => { e.target.style.display = 'none' }}
                                          />
                                          <div className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-purple-600 text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded font-semibold">
                                            {imgIndex + 1}
                                          </div>
                                        </div>
                                      ) : null
                                    })
                                  ) : entry.test_report_image ? (
                                    (() => {
                                      const imageUrl = getImageUrl(entry.test_report_image)
                                      return imageUrl ? (
                                        <div className="relative group">
                                          <img
                                            src={imageUrl}
                                            alt="Test report"
                                            onClick={() => setLightboxImage(imageUrl)}
                                            className="w-full h-24 sm:h-28 md:h-32 object-cover rounded-lg border-2 border-purple-200 dark:border-purple-700 cursor-pointer hover:opacity-80 transition shadow-sm hover:shadow-md"
                                            onError={(e) => { e.target.style.display = 'none' }}
                                          />
                                        </div>
                                      ) : null
                                    })()
                                  ) : null}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Medicines */}
                        {entry.medicines && entry.medicines.length > 0 && (
                          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 md:p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
                            <h4 className="font-bold text-base sm:text-lg text-gray-900 dark:text-gray-100 mb-3 sm:mb-4 flex items-center gap-2">
                              <Pill className="w-4 h-4 sm:w-5 sm:h-5 text-pink-600 dark:text-pink-400 flex-shrink-0" />
                              Medicines ({entry.medicines.length})
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                              {entry.medicines.map((medicine, medIndex) => (
                                <div key={medIndex} className="bg-pink-50 dark:bg-pink-900/20 p-3 sm:p-4 rounded-lg border border-pink-200 dark:border-pink-800">
                                  <div className="font-bold text-sm sm:text-base text-gray-900 dark:text-gray-100 mb-2 break-words">{medicine.name}</div>
                                  <div className="space-y-1 text-xs sm:text-sm">
                                    {medicine.dosage && (
                                      <div className="text-gray-700 dark:text-gray-300 break-words">
                                        <span className="font-medium">Dosage: </span>
                                        {medicine.dosage}
                                      </div>
                                    )}
                                    {medicine.duration && (
                                      <div className="text-gray-700 dark:text-gray-300 break-words">
                                        <span className="font-medium">Duration: </span>
                                        {medicine.duration}
                                      </div>
                                    )}
                                  </div>
                                  {medicine.timing && medicine.timing.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-3">
                                      {medicine.timing.includes('morning') && (
                                        <span className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-lg text-xs font-semibold shadow-sm">
                                          <Sun className="w-3 h-3" />
                                          Morning
                                        </span>
                                      )}
                                      {medicine.timing.includes('noon') && (
                                        <span className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 rounded-lg text-xs font-semibold shadow-sm">
                                          <Clock className="w-3 h-3" />
                                          Noon
                                        </span>
                                      )}
                                      {medicine.timing.includes('night') && (
                                        <span className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-lg text-xs font-semibold shadow-sm">
                                          <Moon className="w-3 h-3" />
                                          Night
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Diet Schedule */}
                        {entry.diet_routine && entry.diet_routine.length > 0 && (
                          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 md:p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
                            <h4 className="font-bold text-base sm:text-lg text-gray-900 dark:text-gray-100 mb-3 sm:mb-4 flex items-center gap-2">
                              <Utensils className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                              Diet Schedule ({entry.diet_routine.length})
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                              {entry.diet_routine.map((diet, dietIndex) => (
                                <div key={dietIndex} className="bg-orange-50 dark:bg-orange-900/20 p-3 sm:p-4 rounded-lg border border-orange-200 dark:border-orange-800 flex items-start gap-2 sm:gap-3">
                                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                                  <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100 mb-1 break-words">{diet.time}</div>
                                    <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 break-words">{diet.food}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Recommendations */}
                        {entry.recommendations && (
                          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 md:p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
                            <h4 className="font-bold text-base sm:text-lg text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 flex items-center gap-2">
                              <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                              <span className="break-words">Doctor&apos;s Notes & Recommendations</span>
                            </h4>
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 sm:p-4 rounded-lg border border-blue-200 dark:border-blue-800 text-sm sm:text-base text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
                              {entry.recommendations}
                            </div>
                          </div>
                        )}

                        {/* Prescription Images Gallery */}
                        {((entry.prescription_images && Array.isArray(entry.prescription_images) && entry.prescription_images.length > 0) || entry.prescription_image) && (
                          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 md:p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
                            <h4 className="font-bold text-base sm:text-lg text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">Prescription Images</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                              {entry.prescription_images && Array.isArray(entry.prescription_images) && entry.prescription_images.length > 0 ? (
                                entry.prescription_images.map((img, imgIndex) => {
                                  const imageUrl = getImageUrl(img)
                                  return imageUrl ? (
                                    <div key={imgIndex} className="relative group">
                                      <img
                                        src={imageUrl}
                                        alt={`Prescription ${imgIndex + 1}`}
                                        onClick={() => setLightboxImage(imageUrl)}
                                        className="w-full h-24 sm:h-28 md:h-40 object-cover rounded-lg border-2 border-blue-200 dark:border-blue-700 cursor-pointer hover:opacity-80 transition shadow-sm hover:shadow-md"
                                        onError={(e) => { e.target.style.display = 'none' }}
                                      />
                                      <div className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-blue-600 text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded font-semibold">
                                        {imgIndex + 1}
                                      </div>
                                    </div>
                                  ) : null
                                })
                              ) : entry.prescription_image ? (
                                (() => {
                                  const imageUrl = getImageUrl(entry.prescription_image)
                                  return imageUrl ? (
                                    <div className="relative group">
                                      <img
                                        src={imageUrl}
                                        alt="Prescription"
                                        onClick={() => setLightboxImage(imageUrl)}
                                        className="w-full h-24 sm:h-28 md:h-40 object-cover rounded-lg border-2 border-blue-200 dark:border-blue-700 cursor-pointer hover:opacity-80 transition shadow-sm hover:shadow-md"
                                        onError={(e) => { e.target.style.display = 'none' }}
                                      />
                                    </div>
                                  ) : null
                                })()
                              ) : null}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Floating WhatsApp Button */}
        <button
          onClick={shareWhatsApp}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 gradient-primary text-white rounded-full shadow-xl hover:shadow-2xl transition flex items-center justify-center z-50 print:hidden"
          aria-label="Share"
        >
          <Share2 className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Lightbox */}
        {lightboxImage && (
          <div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-2 sm:p-4"
            onClick={() => setLightboxImage(null)}
          >
            <img
              src={getImageUrl(lightboxImage) || lightboxImage}
              alt="Full size"
              className="max-w-full max-h-full rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              onError={(e) => {
                console.error('Failed to load image:', lightboxImage)
                e.target.style.display = 'none'
              }}
            />
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white text-xl sm:text-2xl hover:text-gray-300 bg-white/20 hover:bg-white/30 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
          .print\\:block {
            display: block !important;
          }
        }
      `}</style>
    </>
  )
}

