'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import DashboardLayout from '@/components/DashboardLayout'
import { ArrowLeft, Plus, X, Upload, Stethoscope, TestTube, Pill, Utensils, Sun, Moon, Clock } from 'lucide-react'
import Script from 'next/script'

export default function AddEntryPage() {
  const router = useRouter()
  const params = useParams()
  const cardId = params.id
  const [loading, setLoading] = useState(false)
  const [cardData, setCardData] = useState(null)
  const [formData, setFormData] = useState({
    entry_date: new Date().toISOString().split('T')[0],
    doctor_name: '',
    doctor_specialty: '',
    doctor_hospital: '',
    doctor_phone: '',
    tests: [{ name: '', result: '' }],
    recommendations: '',
    medicines: [{ name: '', dosage: '', duration: '', timing: [] }],
    diet_routine: [{ time: '', food: '' }],
    prescription_image: '',
    test_report_images: [],
    whatsapp_reminder: false
  })

  useEffect(() => {
    loadCardData()
  }, [cardId])

  const loadCardData = async () => {
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const token = localStorage.getItem('auth_token')
      
      const response = await fetch(`${apiBase}/api/health-cards/${cardId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.status === 'success') {
          setCardData(data.data)
        }
      }
    } catch (error) {
      console.error('Error loading card data:', error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleTestChange = (index, field, value) => {
    const newTests = [...formData.tests]
    newTests[index][field] = value
    setFormData(prev => ({ ...prev, tests: newTests }))
  }

  const addTest = () => {
    setFormData(prev => ({
      ...prev,
      tests: [...prev.tests, { name: '', result: '' }]
    }))
  }

  const removeTest = (index) => {
    setFormData(prev => ({
      ...prev,
      tests: prev.tests.filter((_, i) => i !== index)
    }))
  }

  const handleMedicineChange = (index, field, value) => {
    const newMedicines = [...formData.medicines]
    newMedicines[index][field] = value
    setFormData(prev => ({ ...prev, medicines: newMedicines }))
  }

  const handleMedicineTiming = (index, timing) => {
    const newMedicines = [...formData.medicines]
    const currentTiming = newMedicines[index].timing || []
    if (currentTiming.includes(timing)) {
      newMedicines[index].timing = currentTiming.filter(t => t !== timing)
    } else {
      newMedicines[index].timing = [...currentTiming, timing]
    }
    setFormData(prev => ({ ...prev, medicines: newMedicines }))
  }

  const addMedicine = () => {
    setFormData(prev => ({
      ...prev,
      medicines: [...prev.medicines, { name: '', dosage: '', duration: '', timing: [] }]
    }))
  }

  const removeMedicine = (index) => {
    setFormData(prev => ({
      ...prev,
      medicines: prev.medicines.filter((_, i) => i !== index)
    }))
  }

  const handleDietChange = (index, field, value) => {
    const newDiet = [...formData.diet_routine]
    newDiet[index][field] = value
    setFormData(prev => ({ ...prev, diet_routine: newDiet }))
  }

  const addDiet = () => {
    setFormData(prev => ({
      ...prev,
      diet_routine: [...prev.diet_routine, { time: '', food: '' }]
    }))
  }

  const removeDiet = (index) => {
    setFormData(prev => ({
      ...prev,
      diet_routine: prev.diet_routine.filter((_, i) => i !== index)
    }))
  }

  const handlePrescriptionUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, prescription_image: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleTestReportUpload = (e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          test_report_images: [...prev.test_report_images, reader.result]
        }))
      }
      reader.readAsDataURL(file)
    })
  }

  const removeTestReport = (index) => {
    setFormData(prev => ({
      ...prev,
      test_report_images: prev.test_report_images.filter((_, i) => i !== index)
    }))
  }

  const handleOCR = async () => {
    if (!formData.prescription_image) {
      if (window.showToast) {
        window.showToast('Please upload a prescription image first', 'error')
      }
      return
    }

    try {
      setLoading(true)
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const token = localStorage.getItem('auth_token')

      const response = await fetch(`${apiBase}/api/health-cards/ocr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({ image: formData.prescription_image })
      })

      const data = await response.json()
      if (response.ok && data.status === 'success') {
        // Auto-fill form with OCR data
        if (data.data.medicines) {
          setFormData(prev => ({
            ...prev,
            medicines: data.data.medicines.map(m => ({
              name: m.name || '',
              dosage: m.dosage || '',
              duration: m.duration || '',
              timing: m.timing || []
            }))
          }))
        }
        if (window.showToast) {
          window.showToast('Prescription read successfully!', 'success')
        }
      } else {
        throw new Error(data.message || 'OCR failed')
      }
    } catch (error) {
      console.error('OCR error:', error)
      if (window.showToast) {
        window.showToast(error.message || 'Failed to read prescription', 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const token = localStorage.getItem('auth_token')

      const response = await fetch(`${apiBase}/api/health-cards/${cardId}/entries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok && data.status === 'success') {
        if (window.showToast) {
          window.showToast('Entry added successfully!', 'success')
        }
        router.push('/health-dashboard')
      } else {
        throw new Error(data.message || 'Failed to add entry')
      }
    } catch (error) {
      console.error('Error adding entry:', error)
      if (window.showToast) {
        window.showToast(error.message || 'Failed to add entry', 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Script src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js" defer />
      
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/health-dashboard" className="hover:text-[#10b981]">
              Health Dashboard
            </Link>
            <span>/</span>
            {cardData && (
              <>
                <Link href={`/health-dashboard`} className="hover:text-[#10b981]">
                  {cardData.person_name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-gray-900 font-medium">Add Entry</span>
          </div>

          {/* Header */}
          <div className="flex items-center gap-4">
            <Link
              href="/health-dashboard"
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Add New Entry</h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
            {/* Entry Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Entry Date *
              </label>
              <input
                type="date"
                name="entry_date"
                value={formData.entry_date}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent"
              />
            </div>

            {/* Doctor Information */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-[#10b981]" />
                Doctor Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Doctor Name
                  </label>
                  <input
                    type="text"
                    name="doctor_name"
                    value={formData.doctor_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent"
                    placeholder="Dr. Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialty
                  </label>
                  <input
                    type="text"
                    name="doctor_specialty"
                    value={formData.doctor_specialty}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent"
                    placeholder="Cardiology, Pediatrics, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hospital/Clinic
                  </label>
                  <input
                    type="text"
                    name="doctor_hospital"
                    value={formData.doctor_hospital}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="doctor_phone"
                    value={formData.doctor_phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Tests */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <TestTube className="w-5 h-5 text-[#10b981]" />
                  Tests
                </h3>
                <button
                  type="button"
                  onClick={addTest}
                  className="flex items-center gap-2 px-4 py-2 bg-[#10b981] text-white rounded-lg hover:bg-[#059669] transition"
                >
                  <Plus className="w-4 h-4" />
                  Add Test
                </button>
              </div>
              <div className="space-y-3">
                {formData.tests.map((test, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={test.name}
                        onChange={(e) => handleTestChange(index, 'name', e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent"
                        placeholder="Test name"
                      />
                      <input
                        type="text"
                        value={test.result}
                        onChange={(e) => handleTestChange(index, 'result', e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent"
                        placeholder="Result"
                      />
                    </div>
                    {formData.tests.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTest(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recommendations
              </label>
              <textarea
                name="recommendations"
                value={formData.recommendations}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent"
                placeholder="Doctor's recommendations and notes..."
              />
            </div>

            {/* Medicines */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Pill className="w-5 h-5 text-[#10b981]" />
                  Medicines
                </h3>
                <button
                  type="button"
                  onClick={addMedicine}
                  className="flex items-center gap-2 px-4 py-2 bg-[#10b981] text-white rounded-lg hover:bg-[#059669] transition"
                >
                  <Plus className="w-4 h-4" />
                  Add Medicine
                </button>
              </div>
              <div className="space-y-4">
                {formData.medicines.map((medicine, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                          type="text"
                          value={medicine.name}
                          onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent"
                          placeholder="Medicine name"
                        />
                        <input
                          type="text"
                          value={medicine.dosage}
                          onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent"
                          placeholder="Dosage (e.g., 500mg)"
                        />
                        <input
                          type="text"
                          value={medicine.duration}
                          onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent"
                          placeholder="Duration (e.g., 7 days)"
                        />
                      </div>
                      {formData.medicines.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMedicine(index)}
                          className="ml-3 p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timing
                      </label>
                      <div className="flex gap-3">
                        {['morning', 'noon', 'night'].map(timing => (
                          <label
                            key={timing}
                            className={`flex items-center gap-2 px-4 py-2 border-2 rounded-lg cursor-pointer transition ${
                              medicine.timing?.includes(timing)
                                ? 'border-[#10b981] bg-green-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={medicine.timing?.includes(timing) || false}
                              onChange={() => handleMedicineTiming(index, timing)}
                              className="sr-only"
                            />
                            {timing === 'morning' && <Sun className="w-4 h-4" />}
                            {timing === 'noon' && <Clock className="w-4 h-4" />}
                            {timing === 'night' && <Moon className="w-4 h-4" />}
                            <span className="text-sm capitalize">{timing}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Diet Routine */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-[#10b981]" />
                  Diet Routine
                </h3>
                <button
                  type="button"
                  onClick={addDiet}
                  className="flex items-center gap-2 px-4 py-2 bg-[#10b981] text-white rounded-lg hover:bg-[#059669] transition"
                >
                  <Plus className="w-4 h-4" />
                  Add Diet
                </button>
              </div>
              <div className="space-y-3">
                {formData.diet_routine.map((diet, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <input
                        type="time"
                        value={diet.time}
                        onChange={(e) => handleDietChange(index, 'time', e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent"
                      />
                      <input
                        type="text"
                        value={diet.food}
                        onChange={(e) => handleDietChange(index, 'food', e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent"
                        placeholder="Food items"
                      />
                    </div>
                    {formData.diet_routine.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDiet(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Uploads */}
            <div className="border-t border-gray-200 pt-6 space-y-4">
              {/* Prescription */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prescription Image
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePrescriptionUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#10b981] file:text-white hover:file:bg-[#059669]"
                  />
                  {formData.prescription_image && (
                    <button
                      type="button"
                      onClick={handleOCR}
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      {loading ? 'Reading...' : 'Read with AI'}
                    </button>
                  )}
                </div>
                {formData.prescription_image && (
                  <img
                    src={formData.prescription_image}
                    alt="Prescription"
                    className="mt-3 max-w-xs rounded-lg border border-gray-200"
                  />
                )}
              </div>

              {/* Test Reports */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test Report Images
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleTestReportUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#10b981] file:text-white hover:file:bg-[#059669]"
                />
                {formData.test_report_images.length > 0 && (
                  <div className="grid grid-cols-4 gap-3 mt-3">
                    {formData.test_report_images.map((img, index) => (
                      <div key={index} className="relative">
                        <img
                          src={img}
                          alt={`Test report ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeTestReport(index)}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* WhatsApp Reminder */}
            <div className="border-t border-gray-200 pt-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="whatsapp_reminder"
                  checked={formData.whatsapp_reminder}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-[#10b981] border-gray-300 rounded focus:ring-[#10b981]"
                />
                <span className="text-sm font-medium text-gray-700">
                  Send WhatsApp reminder for medicines & diet
                </span>
              </label>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-[#10b981] text-white font-semibold rounded-lg hover:bg-[#059669] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save Entry'}
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
    </>
  )
}

