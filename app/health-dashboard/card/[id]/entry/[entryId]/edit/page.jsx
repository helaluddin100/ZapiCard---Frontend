'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import DashboardLayout from '@/components/DashboardLayout'
import { ArrowLeft, Plus, X, Upload, Stethoscope, TestTube, Pill, Utensils, Sun, Moon, Clock, Sparkles, Check, Edit2 } from 'lucide-react'
import { useToast } from '@/lib/toast'
import { healthCardAPI } from '@/lib/api'

export default function EditEntryPage() {
  const router = useRouter()
  const params = useParams()
  const cardId = params.id
  const entryId = params.entryId
  const { success, error: showError } = useToast()
  const [loading, setLoading] = useState(false)
  const [loadingEntry, setLoadingEntry] = useState(true)
  const [ocrLoading, setOcrLoading] = useState(false)
  const [cardData, setCardData] = useState(null)
  const [showAIPreview, setShowAIPreview] = useState(false)
  const [aiOutput, setAiOutput] = useState(null)
  const [editableAiOutput, setEditableAiOutput] = useState(null)
  const [validationErrors, setValidationErrors] = useState({})
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
    loadEntryData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardId, entryId])

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

  const loadEntryData = async () => {
    try {
      setLoadingEntry(true)
      const response = await healthCardAPI.getEntry(cardId, entryId)
      if (response.status === 'success' && response.data) {
        const entry = response.data
        setFormData({
          entry_date: entry.entry_date ? entry.entry_date.split('T')[0] : new Date().toISOString().split('T')[0],
          doctor_name: entry.doctor_name || '',
          doctor_specialty: entry.doctor_specialty || '',
          doctor_hospital: entry.doctor_hospital || '',
          doctor_phone: entry.doctor_phone || '',
          tests: entry.tests && entry.tests.length > 0 ? entry.tests : [{ name: '', result: '' }],
          recommendations: entry.recommendations || '',
          medicines: entry.medicines && entry.medicines.length > 0 ? entry.medicines : [{ name: '', dosage: '', duration: '', timing: [] }],
          diet_routine: entry.diet_routine && entry.diet_routine.length > 0 ? entry.diet_routine : [{ time: '', food: '' }],
          prescription_images: entry.prescription_images && Array.isArray(entry.prescription_images) && entry.prescription_images.length > 0
            ? entry.prescription_images
            : (entry.prescription_image ? [entry.prescription_image] : []),
          test_report_images: entry.test_report_images && Array.isArray(entry.test_report_images) && entry.test_report_images.length > 0
            ? entry.test_report_images
            : (entry.test_report_image ? [entry.test_report_image] : []),
          whatsapp_reminder: entry.whatsapp_reminder || false
        })
      } else {
        throw new Error('Entry not found')
      }
    } catch (error) {
      console.error('Error loading entry data:', error)
      showError('Failed to load entry data')
      router.push(`/health-dashboard`)
    } finally {
      setLoadingEntry(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
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

    // Prevent multiple simultaneous requests
    if (ocrLoading) {
      return
    }

    // Warn if too many images
    if (formData.prescription_images.length > 5) {
      showError('Too many images. Please upload maximum 5 images at once to avoid API quota limits.')
      return
    }

    try {
      setOcrLoading(true)

      const response = await healthCardAPI.ocrPrescription(formData.prescription_images)

      if (response.status === 'success' && response.data) {
        const data = response.data

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

    if (editableAiOutput.doctor_info) {
      setFormData(prev => ({
        ...prev,
        doctor_name: editableAiOutput.doctor_info.doctor_name || prev.doctor_name,
        doctor_specialty: editableAiOutput.doctor_info.doctor_specialty || prev.doctor_specialty,
        doctor_hospital: editableAiOutput.doctor_info.doctor_hospital || prev.doctor_hospital,
        doctor_phone: editableAiOutput.doctor_info.doctor_phone || prev.doctor_phone,
      }))
    }

    if (editableAiOutput.medicines && editableAiOutput.medicines.length > 0) {
      setFormData(prev => ({
        ...prev,
        medicines: editableAiOutput.medicines
      }))
    }

    if (editableAiOutput.tests && editableAiOutput.tests.length > 0) {
      setFormData(prev => ({
        ...prev,
        tests: editableAiOutput.tests
      }))
    }

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
    setValidationErrors({})

    try {
      const submitData = {
        ...formData,
        prescription_image: formData.prescription_images.length > 0 ? formData.prescription_images[0] : null, // Keep for backward compatibility
        prescription_images: formData.prescription_images.length > 0 ? formData.prescription_images : [],
        test_report_image: formData.test_report_images.length > 0 ? formData.test_report_images[0] : null, // Keep for backward compatibility
        test_report_images: formData.test_report_images.length > 0 ? formData.test_report_images : []
      }

      // Remove frontend-only fields
      delete submitData.prescription_images
      delete submitData.test_report_images

      // Re-add as arrays for backend
      submitData.prescription_images = formData.prescription_images.length > 0 ? formData.prescription_images : []
      submitData.test_report_images = formData.test_report_images.length > 0 ? formData.test_report_images : []

      // Filter out empty items
      if (submitData.diet_routine) {
        submitData.diet_routine = submitData.diet_routine.filter(item => item.time || item.food)
        if (submitData.diet_routine.length === 0) {
          submitData.diet_routine = []
        }
      }

      if (submitData.medicines) {
        submitData.medicines = submitData.medicines.filter(item => item.name)
        if (submitData.medicines.length === 0) {
          submitData.medicines = []
        }
      }

      if (submitData.tests) {
        submitData.tests = submitData.tests.filter(item => item.name)
        if (submitData.tests.length === 0) {
          submitData.tests = []
        }
      }

      const response = await healthCardAPI.updateEntry(cardId, entryId, submitData)

      if (response.status === 'success') {
        success('Entry updated successfully!')
        router.push(`/health-dashboard`)
      } else {
        throw new Error(response.message || 'Failed to update entry')
      }
    } catch (error) {
      console.error('Update error:', error)
      if (error.response && error.response.data && error.response.data.errors) {
        setValidationErrors(error.response.data.errors)
        // Scroll to first error
        const firstErrorField = Object.keys(error.response.data.errors)[0]
        const element = document.querySelector(`[name="${firstErrorField}"]`)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
          element.focus()
        }
      } else {
        showError(error.message || 'Failed to update entry. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (loadingEntry) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <>
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Link href="/health-dashboard" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
              Health Dashboard
            </Link>
            <span>/</span>
            {cardData && (
              <>
                <Link href={`/health-dashboard`} className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                  {cardData.person_name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-gray-900 dark:text-gray-100 font-medium">Edit Entry</span>
          </div>

          {/* Header */}
          <div className="flex items-center gap-4">
            <Link
              href="/health-dashboard"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Edit Health Entry</h1>
          </div>

          {/* Form - Same as entry page, just with update instead of create */}
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-6">
            {/* Rest of the form is the same as entry page - I'll copy the structure */}
            {/* Entry Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Entry Date *
              </label>
              <input
                type="date"
                name="entry_date"
                value={formData.entry_date}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${validationErrors.entry_date ? 'border-red-500 dark:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
              />
              {validationErrors.entry_date && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.entry_date[0]}</p>
              )}
            </div>

            {/* Doctor Information */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Doctor Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Doctor Name
                  </label>
                  <input
                    type="text"
                    name="doctor_name"
                    value={formData.doctor_name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 ${validationErrors.doctor_name ? 'border-red-500 dark:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    placeholder="Dr. Name"
                  />
                  {validationErrors.doctor_name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.doctor_name[0]}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Specialty
                  </label>
                  <input
                    type="text"
                    name="doctor_specialty"
                    value={formData.doctor_specialty}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 ${validationErrors.doctor_specialty ? 'border-red-500 dark:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    placeholder="Cardiology, Pediatrics, etc."
                  />
                  {validationErrors.doctor_specialty && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.doctor_specialty[0]}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Hospital/Clinic
                  </label>
                  <input
                    type="text"
                    name="doctor_hospital"
                    value={formData.doctor_hospital}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 ${validationErrors.doctor_hospital ? 'border-red-500 dark:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                  />
                  {validationErrors.doctor_hospital && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.doctor_hospital[0]}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="doctor_phone"
                    value={formData.doctor_phone}
                    onChange={(e) => {
                      handleInputChange(e)
                      if (validationErrors.doctor_phone) {
                        setValidationErrors(prev => {
                          const newErrors = { ...prev }
                          delete newErrors.doctor_phone
                          return newErrors
                        })
                      }
                    }}
                    maxLength={20}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 ${validationErrors.doctor_phone ? 'border-red-500 dark:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                  />
                  {validationErrors.doctor_phone && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.doctor_phone[0]}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Maximum 20 characters. If multiple numbers, use only the first one.</p>
                </div>
              </div>
            </div>

            {/* Tests Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <TestTube className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  Tests
                </h3>
                <button
                  type="button"
                  onClick={addTest}
                  className="flex items-center gap-2 px-4 py-2 gradient-primary text-white rounded-lg hover:shadow-lg transition shadow-md"
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
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                        placeholder="Test name"
                      />
                      <input
                        type="text"
                        value={test.result}
                        onChange={(e) => handleTestChange(index, 'result', e.target.value)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                        placeholder="Result"
                      />
                    </div>
                    {formData.tests.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTest(index)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Recommendations
              </label>
              <textarea
                name="recommendations"
                value={formData.recommendations}
                onChange={handleInputChange}
                rows="4"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 ${validationErrors.recommendations ? 'border-red-500 dark:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                placeholder="Doctor's recommendations and notes..."
              />
              {validationErrors.recommendations && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.recommendations[0]}</p>
              )}
            </div>

            {/* Medicines Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Pill className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  Medicines
                </h3>
                <button
                  type="button"
                  onClick={addMedicine}
                  className="flex items-center gap-2 px-4 py-2 gradient-primary text-white rounded-lg hover:shadow-lg transition shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  Add Medicine
                </button>
              </div>
              <div className="space-y-4">
                {formData.medicines.map((medicine, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3 bg-gray-50 dark:bg-gray-700/30">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                          type="text"
                          value={medicine.name}
                          onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                          placeholder="Medicine name"
                        />
                        <input
                          type="text"
                          value={medicine.dosage}
                          onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                          placeholder="Dosage (e.g., 500mg)"
                        />
                        <input
                          type="text"
                          value={medicine.duration}
                          onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                          placeholder="Duration (e.g., 7 days)"
                        />
                      </div>
                      {formData.medicines.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMedicine(index)}
                          className="ml-3 p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Timing
                      </label>
                      <div className="flex gap-3">
                        {['morning', 'noon', 'night'].map(timing => (
                          <label
                            key={timing}
                            className={`flex items-center gap-2 px-4 py-2 border-2 rounded-lg cursor-pointer transition ${medicine.timing?.includes(timing)
                              ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'
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
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                  Diet Routine
                </h3>
                <button
                  type="button"
                  onClick={addDiet}
                  className="flex items-center gap-2 px-4 py-2 gradient-primary text-white rounded-lg hover:shadow-lg transition shadow-md"
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
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                      <input
                        type="text"
                        value={diet.food}
                        onChange={(e) => handleDietChange(index, 'food', e.target.value)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                        placeholder="Food items"
                      />
                    </div>
                    {formData.diet_routine.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDiet(index)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Uploads */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">
              {/* Prescription */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Prescription Images (Multiple pages supported)
                  </label>
                  {formData.prescription_images.length > 0 && (
                    <button
                      type="button"
                      onClick={handleOCR}
                      disabled={ocrLoading}
                      className="flex items-center gap-2 px-4 py-2 gradient-primary text-white rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
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
                  className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:gradient-primary file:text-white hover:file:shadow-lg"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  You can upload multiple images for multi-page prescriptions (max 5 images at once to avoid API quota limits)
                </p>
                {formData.prescription_images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                    {formData.prescription_images.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img}
                          alt={`Prescription page ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border-2 border-blue-500 dark:border-blue-400"
                        />
                        <div className="absolute top-1 left-1 gradient-primary text-white text-xs px-2 py-1 rounded font-semibold">
                          Page {index + 1}
                        </div>
                        <button
                          type="button"
                          onClick={() => removePrescriptionImage(index)}
                          className="absolute top-1 right-1 p-1 bg-red-600 dark:bg-red-500 text-white rounded-full hover:bg-red-700 dark:hover:bg-red-600 opacity-0 group-hover:opacity-100 transition"
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Test Report Images
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleTestReportUpload}
                  className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:gradient-primary file:text-white hover:file:shadow-lg"
                />
                {formData.test_report_images.length > 0 && (
                  <div className="grid grid-cols-4 gap-3 mt-3">
                    {formData.test_report_images.map((img, index) => (
                      <div key={index} className="relative">
                        <img
                          src={img}
                          alt={`Test report ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                        />
                        <button
                          type="button"
                          onClick={() => removeTestReport(index)}
                          className="absolute top-1 right-1 p-1 bg-red-600 dark:bg-red-500 text-white rounded-full hover:bg-red-700 dark:hover:bg-red-600"
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
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="whatsapp_reminder"
                  checked={formData.whatsapp_reminder}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-blue-600 dark:text-blue-400 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Send WhatsApp reminder for medicines & diet
                </span>
              </label>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : 'Update Entry'}
              </button>
              <Link
                href="/health-dashboard"
                className="btn-outline"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </DashboardLayout>

      {/* AI Output Preview Modal */}
      {showAIPreview && editableAiOutput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-gray-200 dark:border-gray-700">
            <div className="gradient-primary text-white p-6 flex items-center justify-between">
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

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Doctor Information */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-700/30">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Doctor Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Doctor Name</label>
                    <input
                      type="text"
                      value={editableAiOutput.doctor_info.doctor_name}
                      onChange={(e) => setEditableAiOutput(prev => ({
                        ...prev,
                        doctor_info: { ...prev.doctor_info, doctor_name: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Specialty</label>
                    <input
                      type="text"
                      value={editableAiOutput.doctor_info.doctor_specialty}
                      onChange={(e) => setEditableAiOutput(prev => ({
                        ...prev,
                        doctor_info: { ...prev.doctor_info, doctor_specialty: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hospital/Clinic</label>
                    <input
                      type="text"
                      value={editableAiOutput.doctor_info.doctor_hospital}
                      onChange={(e) => setEditableAiOutput(prev => ({
                        ...prev,
                        doctor_info: { ...prev.doctor_info, doctor_hospital: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                    <input
                      type="text"
                      value={editableAiOutput.doctor_info.doctor_phone}
                      onChange={(e) => setEditableAiOutput(prev => ({
                        ...prev,
                        doctor_info: { ...prev.doctor_info, doctor_phone: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
              </div>

              {/* Medicines */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-700/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Pill className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    Medicines ({editableAiOutput.medicines.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditableAiOutput(prev => ({
                      ...prev,
                      medicines: [...prev.medicines, { name: '', dosage: '', duration: '', timing: [] }]
                    }))}
                    className="flex items-center gap-2 px-3 py-1.5 gradient-primary text-white rounded-lg hover:shadow-lg transition text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
                <div className="space-y-3">
                  {editableAiOutput.medicines.map((medicine, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-2 bg-white dark:bg-gray-800">
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={medicine.name}
                          onChange={(e) => {
                            const newMedicines = [...editableAiOutput.medicines]
                            newMedicines[index].name = e.target.value
                            setEditableAiOutput(prev => ({ ...prev, medicines: newMedicines }))
                          }}
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                          placeholder="Name"
                        />
                        <input
                          type="text"
                          value={medicine.dosage}
                          onChange={(e) => {
                            const newMedicines = [...editableAiOutput.medicines]
                            newMedicines[index].dosage = e.target.value
                            setEditableAiOutput(prev => ({ ...prev, medicines: newMedicines }))
                          }}
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                          placeholder="Dosage"
                        />
                        <input
                          type="text"
                          value={medicine.duration}
                          onChange={(e) => {
                            const newMedicines = [...editableAiOutput.medicines]
                            newMedicines[index].duration = e.target.value
                            setEditableAiOutput(prev => ({ ...prev, medicines: newMedicines }))
                          }}
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                          placeholder="Duration"
                        />
                      </div>
                      <div className="flex gap-2">
                        {['morning', 'noon', 'night'].map(timing => (
                          <label
                            key={timing}
                            className={`flex items-center gap-1 px-3 py-1 border-2 rounded-lg cursor-pointer text-sm transition ${medicine.timing?.includes(timing)
                              ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'
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
                            className="ml-auto px-2 py-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-sm"
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
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-700/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <TestTube className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    Tests ({editableAiOutput.tests.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditableAiOutput(prev => ({
                      ...prev,
                      tests: [...prev.tests, { name: '', result: '' }]
                    }))}
                    className="flex items-center gap-2 px-3 py-1.5 gradient-primary text-white rounded-lg hover:shadow-lg transition text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
                <div className="space-y-2">
                  {editableAiOutput.tests.map((test, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={test.name}
                        onChange={(e) => {
                          const newTests = [...editableAiOutput.tests]
                          newTests[index].name = e.target.value
                          setEditableAiOutput(prev => ({ ...prev, tests: newTests }))
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                        placeholder="Test name"
                      />
                      <input
                        type="text"
                        value={test.result}
                        onChange={(e) => {
                          const newTests = [...editableAiOutput.tests]
                          newTests[index].result = e.target.value
                          setEditableAiOutput(prev => ({ ...prev, tests: newTests }))
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                        placeholder="Result"
                      />
                      {editableAiOutput.tests.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditableAiOutput(prev => ({
                              ...prev,
                              tests: prev.tests.filter((_, i) => i !== index)
                            }))
                          }}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-700/30">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Recommendations</h3>
                <textarea
                  value={editableAiOutput.recommendations}
                  onChange={(e) => setEditableAiOutput(prev => ({
                    ...prev,
                    recommendations: e.target.value
                  }))}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="Doctor recommendations and notes..."
                />
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowAIPreview(false)}
                className="btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={applyAIDataToForm}
                className="btn-primary flex items-center gap-2"
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

