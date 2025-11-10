'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import DashboardLayout from '@/components/DashboardLayout'
import { ArrowLeft, Plus, X, Upload, Stethoscope, TestTube, Pill, Utensils, Sun, Moon, Clock, Sparkles, Check, Edit2 } from 'lucide-react'
import { useToast } from '@/lib/toast'
import { healthCardAPI } from '@/lib/api'

export default function AddEntryPage() {
  const router = useRouter()
  const params = useParams()
  const cardId = params.id
  const { success, error: showError } = useToast()
  const [loading, setLoading] = useState(false)
  const [ocrLoading, setOcrLoading] = useState(false)
  const [cardData, setCardData] = useState(null)
  const [showAIPreview, setShowAIPreview] = useState(false)
  const [aiOutput, setAiOutput] = useState(null)
  const [editableAiOutput, setEditableAiOutput] = useState(null)
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
    prescription_images: [],
    test_report_images: [],
    whatsapp_reminder: false
  })

  useEffect(() => {
    loadCardData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardId])

  const loadCardData = async () => {
    try {
      const response = await healthCardAPI.getHealthCard(cardId)
      if (response.status === 'success') {
        setCardData(response.data)
      }
    } catch (error) {
      console.error('Error loading card data:', error)
      showError('Failed to load card data')
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
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      const newImages = []
      let loadedCount = 0

      files.forEach(file => {
        const reader = new FileReader()
        reader.onloadend = () => {
          newImages.push(reader.result)
          loadedCount++

          if (loadedCount === files.length) {
            setFormData(prev => ({
              ...prev,
              prescription_images: [...prev.prescription_images, ...newImages]
            }))
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removePrescriptionImage = (index) => {
    setFormData(prev => ({
      ...prev,
      prescription_images: prev.prescription_images.filter((_, i) => i !== index)
    }))
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
    if (!formData.prescription_images || formData.prescription_images.length === 0) {
      showError('Please upload at least one prescription image first')
      return
    }

    try {
      setOcrLoading(true)

      const response = await healthCardAPI.ocrPrescription(formData.prescription_images)

      if (response.status === 'success' && response.data) {
        const data = response.data

        // Prepare editable output
        const editableData = {
          doctor_info: {
            doctor_name: data.doctor_info?.doctor_name || '',
            doctor_specialty: data.doctor_info?.doctor_specialty || '',
            doctor_hospital: data.doctor_info?.doctor_hospital || '',
            doctor_phone: data.doctor_info?.doctor_phone || '',
          },
          medicines: (data.medicines || []).map(m => ({
            name: m.name || '',
            dosage: m.dosage || '',
            duration: m.duration || '',
            timing: Array.isArray(m.timing) ? m.timing : []
          })),
          tests: (data.tests || []).map(t => ({
            name: t.name || '',
            result: t.result || ''
          })),
          recommendations: data.recommendations || ''
        }

        setAiOutput(data)
        setEditableAiOutput(editableData)
        setShowAIPreview(true)
        success('Prescription analyzed successfully! Please review and edit if needed.')
      } else {
        throw new Error(response.message || 'OCR failed')
      }
    } catch (error) {
      console.error('OCR error:', error)
      showError(error.message || 'Failed to analyze prescription. Please try again.')
    } finally {
      setOcrLoading(false)
    }
  }

  const applyAIDataToForm = () => {
    if (!editableAiOutput) return

    // Apply doctor info
    if (editableAiOutput.doctor_info) {
      setFormData(prev => ({
        ...prev,
        doctor_name: editableAiOutput.doctor_info.doctor_name || prev.doctor_name,
        doctor_specialty: editableAiOutput.doctor_info.doctor_specialty || prev.doctor_specialty,
        doctor_hospital: editableAiOutput.doctor_info.doctor_hospital || prev.doctor_hospital,
        doctor_phone: editableAiOutput.doctor_info.doctor_phone || prev.doctor_phone,
      }))
    }

    // Apply medicines
    if (editableAiOutput.medicines && editableAiOutput.medicines.length > 0) {
      setFormData(prev => ({
        ...prev,
        medicines: editableAiOutput.medicines
      }))
    }

    // Apply tests
    if (editableAiOutput.tests && editableAiOutput.tests.length > 0) {
      setFormData(prev => ({
        ...prev,
        tests: editableAiOutput.tests
      }))
    }

    // Apply recommendations
    if (editableAiOutput.recommendations) {
      setFormData(prev => ({
        ...prev,
        recommendations: prev.recommendations
          ? `${prev.recommendations}\n\n${editableAiOutput.recommendations}`
          : editableAiOutput.recommendations
      }))
    }

    setShowAIPreview(false)
    success('AI data applied to form successfully!')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Convert prescription_images array to single prescription_image for backend compatibility
      const submitData = {
        ...formData,
        prescription_image: formData.prescription_images.length > 0 ? formData.prescription_images[0] : null
      }

      const response = await healthCardAPI.addEntry(cardId, submitData)

      if (response.status === 'success') {
        success('Entry added successfully!')
        setTimeout(() => {
          router.push('/health-dashboard')
        }, 500)
      } else {
        throw new Error(response.message || 'Failed to add entry')
      }
    } catch (error) {
      console.error('Error adding entry:', error)
      showError(error.message || 'Failed to add entry. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
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
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#10b981] to-[#059669] text-white rounded-lg hover:from-[#059669] hover:to-[#047857] transition shadow-md"
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
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#10b981] to-[#059669] text-white rounded-lg hover:from-[#059669] hover:to-[#047857] transition shadow-md"
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
                            className={`flex items-center gap-2 px-4 py-2 border-2 rounded-lg cursor-pointer transition ${medicine.timing?.includes(timing)
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
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#10b981] to-[#059669] text-white rounded-lg hover:from-[#059669] hover:to-[#047857] transition shadow-md"
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
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Prescription Images (Multiple pages supported)
                  </label>
                  {formData.prescription_images.length > 0 && (
                    <button
                      type="button"
                      onClick={handleOCR}
                      disabled={ocrLoading}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#10b981] to-[#059669] text-white rounded-lg hover:from-[#059669] hover:to-[#047857] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                    >
                      <Sparkles className="w-4 h-4" />
                      {ocrLoading ? 'Analyzing with AI...' : 'Read with AI (Gemini)'}
                    </button>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePrescriptionUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#10b981] file:text-white hover:file:bg-[#059669]"
                />
                <p className="text-xs text-gray-500 mt-1">
                  You can upload multiple images for multi-page prescriptions
                </p>
                {formData.prescription_images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                    {formData.prescription_images.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img}
                          alt={`Prescription page ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border-2 border-[#10b981]"
                        />
                        <div className="absolute top-1 left-1 bg-[#10b981] text-white text-xs px-2 py-1 rounded font-semibold">
                          Page {index + 1}
                        </div>
                        <button
                          type="button"
                          onClick={() => removePrescriptionImage(index)}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 opacity-0 group-hover:opacity-100 transition"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
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
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#10b981] to-[#059669] text-white font-semibold rounded-lg hover:from-[#059669] hover:to-[#047857] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
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

      {/* AI Output Preview Modal */}
      {showAIPreview && editableAiOutput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#10b981] to-[#059669] text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6" />
                <h2 className="text-2xl font-bold">AI Analysis Result - Review & Edit</h2>
              </div>
              <button
                onClick={() => setShowAIPreview(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Doctor Information */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-[#10b981]" />
                  Doctor Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Name</label>
                    <input
                      type="text"
                      value={editableAiOutput.doctor_info.doctor_name}
                      onChange={(e) => setEditableAiOutput(prev => ({
                        ...prev,
                        doctor_info: { ...prev.doctor_info, doctor_name: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
                    <input
                      type="text"
                      value={editableAiOutput.doctor_info.doctor_specialty}
                      onChange={(e) => setEditableAiOutput(prev => ({
                        ...prev,
                        doctor_info: { ...prev.doctor_info, doctor_specialty: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hospital/Clinic</label>
                    <input
                      type="text"
                      value={editableAiOutput.doctor_info.doctor_hospital}
                      onChange={(e) => setEditableAiOutput(prev => ({
                        ...prev,
                        doctor_info: { ...prev.doctor_info, doctor_hospital: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="text"
                      value={editableAiOutput.doctor_info.doctor_phone}
                      onChange={(e) => setEditableAiOutput(prev => ({
                        ...prev,
                        doctor_info: { ...prev.doctor_info, doctor_phone: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Medicines */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Pill className="w-5 h-5 text-[#10b981]" />
                    Medicines ({editableAiOutput.medicines.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditableAiOutput(prev => ({
                      ...prev,
                      medicines: [...prev.medicines, { name: '', dosage: '', duration: '', timing: [] }]
                    }))}
                    className="flex items-center gap-2 px-3 py-1.5 bg-[#10b981] text-white rounded-lg hover:bg-[#059669] transition text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
                <div className="space-y-3">
                  {editableAiOutput.medicines.map((medicine, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3 space-y-2">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={medicine.name}
                          onChange={(e) => {
                            const newMedicines = [...editableAiOutput.medicines]
                            newMedicines[index].name = e.target.value
                            setEditableAiOutput(prev => ({ ...prev, medicines: newMedicines }))
                          }}
                          placeholder="Medicine name"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent text-sm"
                        />
                        <input
                          type="text"
                          value={medicine.dosage}
                          onChange={(e) => {
                            const newMedicines = [...editableAiOutput.medicines]
                            newMedicines[index].dosage = e.target.value
                            setEditableAiOutput(prev => ({ ...prev, medicines: newMedicines }))
                          }}
                          placeholder="Dosage"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent text-sm"
                        />
                        <input
                          type="text"
                          value={medicine.duration}
                          onChange={(e) => {
                            const newMedicines = [...editableAiOutput.medicines]
                            newMedicines[index].duration = e.target.value
                            setEditableAiOutput(prev => ({ ...prev, medicines: newMedicines }))
                          }}
                          placeholder="Duration"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent text-sm"
                        />
                      </div>
                      <div className="flex gap-2">
                        {['morning', 'noon', 'night'].map(timing => (
                          <label
                            key={timing}
                            className={`flex items-center gap-1 px-3 py-1 border-2 rounded-lg cursor-pointer text-sm transition ${medicine.timing?.includes(timing)
                              ? 'border-[#10b981] bg-green-50 text-[#10b981]'
                              : 'border-gray-200 hover:border-gray-300'
                              }`}
                          >
                            <input
                              type="checkbox"
                              checked={medicine.timing?.includes(timing) || false}
                              onChange={(e) => {
                                const newMedicines = [...editableAiOutput.medicines]
                                const currentTiming = newMedicines[index].timing || []
                                if (e.target.checked) {
                                  newMedicines[index].timing = [...currentTiming, timing]
                                } else {
                                  newMedicines[index].timing = currentTiming.filter(t => t !== timing)
                                }
                                setEditableAiOutput(prev => ({ ...prev, medicines: newMedicines }))
                              }}
                              className="sr-only"
                            />
                            <span className="capitalize">{timing}</span>
                          </label>
                        ))}
                        {editableAiOutput.medicines.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newMedicines = editableAiOutput.medicines.filter((_, i) => i !== index)
                              setEditableAiOutput(prev => ({ ...prev, medicines: newMedicines }))
                            }}
                            className="ml-auto px-2 py-1 text-red-600 hover:bg-red-50 rounded text-sm"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tests */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <TestTube className="w-5 h-5 text-[#10b981]" />
                    Tests ({editableAiOutput.tests.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditableAiOutput(prev => ({
                      ...prev,
                      tests: [...prev.tests, { name: '', result: '' }]
                    }))}
                    className="flex items-center gap-2 px-3 py-1.5 bg-[#10b981] text-white rounded-lg hover:bg-[#059669] transition text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
                <div className="space-y-2">
                  {editableAiOutput.tests.map((test, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={test.name}
                        onChange={(e) => {
                          const newTests = [...editableAiOutput.tests]
                          newTests[index].name = e.target.value
                          setEditableAiOutput(prev => ({ ...prev, tests: newTests }))
                        }}
                        placeholder="Test name"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent text-sm"
                      />
                      <input
                        type="text"
                        value={test.result}
                        onChange={(e) => {
                          const newTests = [...editableAiOutput.tests]
                          newTests[index].result = e.target.value
                          setEditableAiOutput(prev => ({ ...prev, tests: newTests }))
                        }}
                        placeholder="Result"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent text-sm"
                      />
                      {editableAiOutput.tests.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newTests = editableAiOutput.tests.filter((_, i) => i !== index)
                            setEditableAiOutput(prev => ({ ...prev, tests: newTests }))
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
                <textarea
                  value={editableAiOutput.recommendations}
                  onChange={(e) => setEditableAiOutput(prev => ({
                    ...prev,
                    recommendations: e.target.value
                  }))}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent"
                  placeholder="Doctor recommendations and notes..."
                />
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowAIPreview(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={applyAIDataToForm}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#10b981] to-[#059669] text-white rounded-lg hover:from-[#059669] hover:to-[#047857] transition shadow-md"
              >
                <Check className="w-5 h-5" />
                Apply to Form
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

