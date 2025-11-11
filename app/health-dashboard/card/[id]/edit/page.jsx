'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import DashboardLayout from '@/components/DashboardLayout'
import { ArrowLeft, Upload, User, Calendar, Droplet, Users, Phone, AlertTriangle } from 'lucide-react'
import { useToast } from '@/lib/toast'
import { healthCardAPI } from '@/lib/api'

export default function EditHealthCardPage() {
  const router = useRouter()
  const params = useParams()
  const cardId = params.id
  const { success, error: showError } = useToast()
  const [loading, setLoading] = useState(false)
  const [loadingCard, setLoadingCard] = useState(true)
  const [formData, setFormData] = useState({
    person_name: '',
    person_photo: '',
    date_of_birth: '',
    blood_group: '',
    gender: '',
    card_type: '',
    expected_delivery_date: '',
    emergency_contact: '',
    allergies: ''
  })
  const [previewPhoto, setPreviewPhoto] = useState(null)
  const [pregnancyWeeks, setPregnancyWeeks] = useState(null)

  useEffect(() => {
    loadHealthCard()
  }, [cardId])

  const loadHealthCard = async () => {
    try {
      setLoadingCard(true)
      const response = await healthCardAPI.getHealthCard(cardId)

      if (response.status === 'success' && response.data) {
        const card = response.data
        // Format dates for input fields (YYYY-MM-DD)
        const formatDateForInput = (dateString) => {
          if (!dateString) return ''
          const date = new Date(dateString)
          const year = date.getFullYear()
          const month = String(date.getMonth() + 1).padStart(2, '0')
          const day = String(date.getDate()).padStart(2, '0')
          return `${year}-${month}-${day}`
        }

        setFormData({
          person_name: card.person_name || '',
          person_photo: card.person_photo || '',
          date_of_birth: formatDateForInput(card.date_of_birth),
          blood_group: card.blood_group || '',
          gender: card.gender || '',
          card_type: card.card_type || '',
          expected_delivery_date: formatDateForInput(card.expected_delivery_date),
          emergency_contact: card.emergency_contact || '',
          allergies: card.allergies || ''
        })

        if (card.person_photo) {
          setPreviewPhoto(card.person_photo)
        }

        // Calculate pregnancy weeks if expected delivery date exists
        if (card.expected_delivery_date && card.card_type === 'pregnant') {
          const delivery = new Date(card.expected_delivery_date)
          const today = new Date()
          const totalDays = Math.floor((delivery - today) / (1000 * 60 * 60 * 24))
          const weeks = Math.floor((280 - totalDays) / 7)
          setPregnancyWeeks(Math.max(0, Math.min(40, weeks)))
        }
      } else {
        throw new Error(response.message || 'Failed to load health card')
      }
    } catch (error) {
      console.error('Error loading health card:', error)
      showError(error.message || 'Failed to load health card. Please try again.')
      router.push('/health-dashboard')
    } finally {
      setLoadingCard(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Calculate pregnancy weeks if expected delivery date changes
    if (name === 'expected_delivery_date' && value) {
      const delivery = new Date(value)
      const today = new Date()
      const totalDays = Math.floor((delivery - today) / (1000 * 60 * 60 * 24))
      const weeks = Math.floor((280 - totalDays) / 7)
      setPregnancyWeeks(Math.max(0, Math.min(40, weeks)))
    }
  }

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewPhoto(reader.result)
        setFormData(prev => ({ ...prev, person_photo: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Clean up form data - convert empty strings to null for optional fields
      const cleanedData = {
        person_name: formData.person_name.trim(),
        person_photo: formData.person_photo || null,
        date_of_birth: formData.date_of_birth || null,
        blood_group: formData.blood_group || null,
        gender: formData.gender || null,
        card_type: formData.card_type,
        expected_delivery_date: formData.expected_delivery_date || null,
        emergency_contact: formData.emergency_contact?.trim() || null,
        allergies: formData.allergies?.trim() || null,
      }

      // Validate required fields
      if (!cleanedData.person_name) {
        throw new Error('Person name is required')
      }
      if (!cleanedData.card_type) {
        throw new Error('Card type is required')
      }
      if (cleanedData.card_type === 'pregnant' && !cleanedData.expected_delivery_date) {
        throw new Error('Expected delivery date is required for pregnant card type')
      }

      console.log('Sending data to backend:', cleanedData)

      // Use the API helper function to update
      const response = await healthCardAPI.updateHealthCard(cardId, cleanedData)

      if (response.status === 'success') {
        success('Health card updated successfully!')
        // Redirect after a short delay to show the success message
        setTimeout(() => {
          router.push('/health-dashboard')
        }, 500)
      } else {
        // Handle validation errors
        let errorMessage = response.message || 'Failed to update health card'
        if (response.errors) {
          const errorMessages = Object.values(response.errors).flat()
          errorMessage = errorMessages.join(', ') || errorMessage
        }
        console.error('Backend error:', response)
        throw new Error(errorMessage)
      }
    } catch (error) {
      console.error('Error updating health card:', error)
      const errorMessage = error.message || 'Failed to update health card. Please try again.'
      showError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (loadingCard) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/health-dashboard" className="hover:text-[#10b981]">
              Health Dashboard
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Edit Health Card</span>
          </div>

          {/* Header */}
          <div className="flex items-center gap-4">
            <Link
              href="/health-dashboard"
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Edit Health Card</h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
            {/* Person Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Person Name *
              </label>
              <input
                type="text"
                name="person_name"
                value={formData.person_name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent"
                placeholder="Enter person's full name"
              />
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Upload className="w-4 h-4 inline mr-1" />
                Person Photo
              </label>
              <div className="flex items-center gap-6">
                <div className="flex-shrink-0">
                  {previewPhoto ? (
                    <img
                      src={previewPhoto}
                      alt="Preview"
                      className="w-32 h-32 rounded-full object-cover border-4 border-[#10b981]"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-100 border-4 border-gray-200 flex items-center justify-center">
                      <User className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#10b981] file:text-white hover:file:bg-[#059669]"
                  />
                  <p className="text-xs text-gray-500 mt-1">Upload a clear photo of the person</p>
                </div>
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date of Birth
              </label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent"
              />
            </div>

            {/* Blood Group & Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Droplet className="w-4 h-4 inline mr-1" />
                  Blood Group
                </label>
                <select
                  name="blood_group"
                  value={formData.blood_group}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent"
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="w-4 h-4 inline mr-1" />
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Card Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Type *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['pregnant', 'child', 'adult', 'senior'].map(type => (
                  <label
                    key={type}
                    className={`relative flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition ${
                      formData.card_type === type
                        ? 'border-[#10b981] bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="card_type"
                      value={type}
                      checked={formData.card_type === type}
                      onChange={handleInputChange}
                      required
                      className="sr-only"
                    />
                    <span className="text-sm font-medium capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Expected Delivery Date (if Pregnant) */}
            {formData.card_type === 'pregnant' && (
              <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Expected Delivery Date *
                </label>
                <input
                  type="date"
                  name="expected_delivery_date"
                  value={formData.expected_delivery_date}
                  onChange={handleInputChange}
                  required={formData.card_type === 'pregnant'}
                  className="w-full px-4 py-2 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                {pregnancyWeeks !== null && (
                  <p className="text-sm text-pink-700 mt-2 font-medium">
                    Currently: Week {pregnancyWeeks} of 40
                  </p>
                )}
              </div>
            )}

            {/* Emergency Contact */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                Emergency Contact
              </label>
              <input
                type="text"
                name="emergency_contact"
                value={formData.emergency_contact}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent"
                placeholder="Name and phone number"
              />
            </div>

            {/* Allergies */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <AlertTriangle className="w-4 h-4 inline mr-1" />
                Allergies
              </label>
              <textarea
                name="allergies"
                value={formData.allergies}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent"
                placeholder="List any known allergies (e.g., Penicillin, Peanuts, etc.)"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 gradient-primary text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : 'Update Health Card'}
              </button>
              <Link
                href="/health-dashboard"
                className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </DashboardLayout>
  )
}

