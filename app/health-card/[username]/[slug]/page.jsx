'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Script from 'next/script'
import { Download, Share2, ChevronDown, ChevronUp, Calendar, Stethoscope, TestTube, Pill, Utensils, Sun, Moon, Clock, Phone, Droplet, AlertTriangle } from 'lucide-react'

export default function PublicHealthCardPage() {
  const params = useParams()
  const { username, slug } = params
  const [cardData, setCardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [expandedEntries, setExpandedEntries] = useState({})
  const [lightboxImage, setLightboxImage] = useState(null)

  useEffect(() => {
    loadPublicCard()
  }, [username, slug])

  const loadPublicCard = async () => {
    try {
      setLoading(true)
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      
      const response = await fetch(`${apiBase}/api/health-cards/public/${username}/${slug}`, {
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

  const formatBanglaDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const months = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 
                   'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর']
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10b981] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading health card...</p>
        </div>
      </div>
    )
  }

  if (!cardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Health Card Not Found</h1>
          <p className="text-gray-600">The health card you're looking for doesn't exist.</p>
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
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          {/* Header Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={downloadVCard}
              className="flex items-center gap-2 px-4 py-2 bg-[#10b981] text-white rounded-lg hover:bg-[#059669] transition shadow-lg"
            >
              <Download className="w-4 h-4" />
              Save Contact
            </button>
            <div className="flex items-center gap-3">
              <div id="qr-code-container" className="hidden print:block"></div>
              <button
                onClick={shareWhatsApp}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition shadow-lg"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>

          {/* Main Card */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8 space-y-6">
            {/* Person Info */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="flex-shrink-0">
                {cardData.person_photo ? (
                  <img
                    src={cardData.person_photo}
                    alt={cardData.person_name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-[#10b981] shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-[#10b981] flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                    {cardData.person_name?.charAt(0) || 'H'}
                  </div>
                )}
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{cardData.person_name}</h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-600">
                  {cardData.blood_group && (
                    <div className="flex items-center gap-1">
                      <Droplet className="w-4 h-4 text-red-500" />
                      <span>Blood Group: {cardData.blood_group}</span>
                    </div>
                  )}
                  {cardData.gender && (
                    <div className="flex items-center gap-1">
                      <span className="capitalize">{cardData.gender}</span>
                    </div>
                  )}
                  {cardData.date_of_birth && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>DOB: {formatBanglaDate(cardData.date_of_birth)}</span>
                    </div>
                  )}
                </div>
                {cardData.emergency_contact && (
                  <div className="mt-3 flex items-center justify-center md:justify-start gap-2 text-gray-700">
                    <Phone className="w-4 h-4" />
                    <span>{cardData.emergency_contact}</span>
                  </div>
                )}
                {cardData.allergies && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 text-red-700 font-medium">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Allergies: {cardData.allergies}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Pregnancy Progress */}
            {pregnancyWeeks !== null && (
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 border border-pink-200">
                <div className="flex items-center justify-center">
                  <div className="relative w-48 h-48">
                    <svg className="transform -rotate-90 w-48 h-48">
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="#e5e7eb"
                        strokeWidth="16"
                        fill="none"
                      />
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="#10b981"
                        strokeWidth="16"
                        fill="none"
                        strokeDasharray={`${(pregnancyWeeks / 40) * 552} 552`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-4xl font-bold text-[#10b981]">Week {pregnancyWeeks}</p>
                        <p className="text-sm text-gray-600">of 40 weeks</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Timeline */}
            {cardData.entries && cardData.entries.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Health Timeline</h2>
                {cardData.entries.map((entry, index) => (
                  <div
                    key={entry.id}
                    className="border border-gray-200 rounded-xl overflow-hidden bg-white"
                  >
                    <button
                      onClick={() => toggleEntry(entry.id)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-[#10b981] rounded-full flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-gray-900">
                            {formatBanglaDate(entry.entry_date)}
                          </div>
                          {entry.doctor_name && (
                            <div className="text-sm text-gray-600 flex items-center gap-1">
                              <Stethoscope className="w-3 h-3" />
                              {entry.doctor_name}
                              {entry.doctor_specialty && ` - ${entry.doctor_specialty}`}
                            </div>
                          )}
                        </div>
                      </div>
                      {expandedEntries[entry.id] ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>

                    {expandedEntries[entry.id] && (
                      <div className="px-6 py-4 border-t border-gray-200 space-y-4 bg-gray-50">
                        {/* Tests */}
                        {entry.tests && entry.tests.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                              <TestTube className="w-4 h-4 text-[#10b981]" />
                              Tests
                            </h4>
                            <div className="space-y-2">
                              {entry.tests.map((test, testIndex) => (
                                <div key={testIndex} className="bg-white p-3 rounded-lg border border-gray-200">
                                  <div className="font-medium text-gray-900">{test.name}</div>
                                  {test.result && (
                                    <div className="text-sm text-gray-600 mt-1">Result: {test.result}</div>
                                  )}
                                </div>
                              ))}
                            </div>
                            {entry.test_report_images && entry.test_report_images.length > 0 && (
                              <div className="grid grid-cols-4 gap-2 mt-3">
                                {entry.test_report_images.map((img, imgIndex) => (
                                  <img
                                    key={imgIndex}
                                    src={img}
                                    alt={`Test report ${imgIndex + 1}`}
                                    onClick={() => setLightboxImage(img)}
                                    className="w-full h-20 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 transition"
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Medicines */}
                        {entry.medicines && entry.medicines.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                              <Pill className="w-4 h-4 text-[#10b981]" />
                              Medicines
                            </h4>
                            <div className="space-y-2">
                              {entry.medicines.map((medicine, medIndex) => (
                                <div key={medIndex} className="bg-white p-3 rounded-lg border border-gray-200">
                                  <div className="font-medium text-gray-900">{medicine.name}</div>
                                  <div className="text-sm text-gray-600 mt-1">
                                    {medicine.dosage && <span>Dosage: {medicine.dosage}</span>}
                                    {medicine.duration && <span className="ml-3">Duration: {medicine.duration}</span>}
                                  </div>
                                  {medicine.timing && medicine.timing.length > 0 && (
                                    <div className="flex gap-2 mt-2">
                                      {medicine.timing.includes('morning') && (
                                        <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                                          <Sun className="w-3 h-3" />
                                          Morning
                                        </span>
                                      )}
                                      {medicine.timing.includes('noon') && (
                                        <span className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">
                                          <Clock className="w-3 h-3" />
                                          Noon
                                        </span>
                                      )}
                                      {medicine.timing.includes('night') && (
                                        <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
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
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                              <Utensils className="w-4 h-4 text-[#10b981]" />
                              Diet Schedule
                            </h4>
                            <div className="space-y-2">
                              {entry.diet_routine.map((diet, dietIndex) => (
                                <div key={dietIndex} className="bg-white p-3 rounded-lg border border-gray-200 flex items-center gap-3">
                                  <Clock className="w-4 h-4 text-gray-400" />
                                  <span className="font-medium text-gray-700">{diet.time}</span>
                                  <span className="text-gray-600">-</span>
                                  <span className="text-gray-900">{diet.food}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Recommendations */}
                        {entry.recommendations && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Notes</h4>
                            <div className="bg-white p-3 rounded-lg border border-gray-200 text-gray-700">
                              {entry.recommendations}
                            </div>
                          </div>
                        )}

                        {/* Prescription */}
                        {entry.prescription_image && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Prescription</h4>
                            <img
                              src={entry.prescription_image}
                              alt="Prescription"
                              onClick={() => setLightboxImage(entry.prescription_image)}
                              className="max-w-full rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 transition"
                            />
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
          className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition flex items-center justify-center z-50 print:hidden"
        >
          <Share2 className="w-6 h-6" />
        </button>

        {/* Lightbox */}
        {lightboxImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => setLightboxImage(null)}
          >
            <img
              src={lightboxImage}
              alt="Full size"
              className="max-w-full max-h-full rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
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

