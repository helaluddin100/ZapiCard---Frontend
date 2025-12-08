'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Clock, MapPin, Video, User, Phone, Mail, FileText, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { publicAppointmentAPI } from '@/lib/api'
import { useToast } from '@/lib/toast'

export default function AppointmentModal({ isOpen, onClose, cardSlug, cardId, trackingId }) {
    const { success: showSuccess, error: showError } = useToast()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)

    const [appointmentData, setAppointmentData] = useState(null)
    const [locations, setLocations] = useState([])
    const [timeSlots, setTimeSlots] = useState([])
    const [selectedLocation, setSelectedLocation] = useState(null)
    const [selectedDate, setSelectedDate] = useState('')
    const [availableSlots, setAvailableSlots] = useState([])
    const [selectedTimeSlots, setSelectedTimeSlots] = useState([]) // Array of selected time slots

    const [formData, setFormData] = useState({
        patient_name: '',
        patient_phone: '',
        patient_email: '',
        appointment_date: '',
        appointment_time: '',
        notes: '',
        meeting_type: 'online', // 'online' or 'location'
        preferred_location: '',
        location_id: null,
    })

    const loadAppointmentData = useCallback(async () => {
        if (!isOpen || !cardSlug) return

        try {
            setLoading(true)
            setError(null)
            const response = await publicAppointmentAPI.getCardAppointmentData(cardSlug)

            if (response.status === 'success' && response.data) {
                setAppointmentData(response.data)
                const locationsData = response.data.locations || []
                setLocations(locationsData)

                // If only one location, auto-select it
                if (locationsData.length === 1) {
                    const location = locationsData[0]
                    setSelectedLocation(location)
                    setTimeSlots(location.time_slots || [])
                    setFormData(prev => ({ ...prev, location_id: location.id }))
                }
            } else {
                setError('No appointment slots available')
            }
        } catch (err) {
            console.error('Error loading appointment data:', err)
            setError(err.message || 'Failed to load appointment data')
        } finally {
            setLoading(false)
        }
    }, [isOpen, cardSlug])

    useEffect(() => {
        loadAppointmentData()
    }, [loadAppointmentData])


    const handleLocationSelect = (location) => {
        setSelectedLocation(location)
        const slots = location.time_slots || []
        setTimeSlots(slots)
        setFormData({ ...formData, location_id: location.id })
        setStep(2)
    }

    // Generate 30-minute intervals from time slot range
    const generateTimeSlots = (startTime, endTime) => {
        const slots = []
        const [startHour, startMin] = startTime.split(':').map(Number)
        const [endHour, endMin] = endTime.split(':').map(Number)

        let currentHour = startHour
        let currentMin = startMin
        const endTotalMinutes = endHour * 60 + endMin
        let currentTotalMinutes = startHour * 60 + startMin

        while (currentTotalMinutes < endTotalMinutes) {
            const timeString = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`
            slots.push(timeString)

            // Add 30 minutes
            currentTotalMinutes += 30
            currentHour = Math.floor(currentTotalMinutes / 60)
            currentMin = currentTotalMinutes % 60
        }

        return slots
    }

    const handleDateSelect = (date) => {
        setSelectedDate(date)
        setFormData({ ...formData, appointment_date: date })

        // Filter available time slots for selected date and generate 30-min intervals
        if (selectedLocation && timeSlots.length > 0) {
            const selectedDateObj = new Date(date)
            const dayName = selectedDateObj.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()

            const matchingSlots = timeSlots.filter(slot => {
                // Check if slot is active
                if (!slot.is_active) return false

                // Check for specific date match
                if (slot.specific_date) {
                    const slotDate = new Date(slot.specific_date).toISOString().split('T')[0]
                    return slotDate === date
                }

                // Check for day match
                if (slot.days && Array.isArray(slot.days) && slot.days.length > 0) {
                    return slot.days.includes(dayName)
                }

                // If no specific date or days, show all active slots
                return true
            })

            // Generate 30-minute intervals from matching slots
            const generatedSlots = []
            matchingSlots.forEach(slot => {
                if (slot.start_time && slot.end_time) {
                    const intervals = generateTimeSlots(slot.start_time, slot.end_time)
                    intervals.forEach(time => {
                        // Avoid duplicates
                        if (!generatedSlots.includes(time)) {
                            generatedSlots.push(time)
                        }
                    })
                }
            })

            // Sort slots by time
            generatedSlots.sort((a, b) => {
                const [hourA, minA] = a.split(':').map(Number)
                const [hourB, minB] = b.split(':').map(Number)
                return (hourA * 60 + minA) - (hourB * 60 + minB)
            })

            setAvailableSlots(generatedSlots.map(time => ({ start_time: time })))
        } else {
            // If no location selected, show all slots
            setAvailableSlots(timeSlots)
        }
        setStep(3)
    }

    // Convert time string to minutes for comparison
    const timeToMinutes = (time) => {
        const [hours, minutes] = time.split(':').map(Number)
        return hours * 60 + minutes
    }

    // Check if two time slots are consecutive
    const areConsecutive = (time1, time2) => {
        const diff = Math.abs(timeToMinutes(time1) - timeToMinutes(time2))
        return diff === 30 // 30 minutes apart
    }

    // Sort time slots
    const sortTimeSlots = (slots) => {
        return [...slots].sort((a, b) => {
            return timeToMinutes(a) - timeToMinutes(b)
        })
    }

    const handleTimeSelect = (time) => {
        setSelectedTimeSlots(prev => {
            // If already selected, remove it
            if (prev.includes(time)) {
                const newSlots = prev.filter(t => t !== time)
                // Update form data with first slot as start time
                if (newSlots.length > 0) {
                    const sorted = sortTimeSlots(newSlots)
                    setFormData({ ...formData, appointment_time: sorted[0] })
                } else {
                    setFormData({ ...formData, appointment_time: '' })
                }
                return newSlots
            } else {
                // Add new slot
                const newSlots = [...prev, time]
                const sorted = sortTimeSlots(newSlots)

                // Check if all slots are consecutive
                let allConsecutive = true
                for (let i = 1; i < sorted.length; i++) {
                    if (!areConsecutive(sorted[i - 1], sorted[i])) {
                        allConsecutive = false
                        break
                    }
                }

                // If not consecutive, only keep the new one and previous consecutive ones
                if (!allConsecutive && prev.length > 0) {
                    // Find the group that includes the new time
                    const allSlots = sortTimeSlots(newSlots)
                    const newTimeIndex = allSlots.indexOf(time)

                    // Find consecutive group around the new time
                    const consecutiveGroup = [time]

                    // Check previous slots
                    for (let i = newTimeIndex - 1; i >= 0; i--) {
                        if (areConsecutive(allSlots[i], consecutiveGroup[0])) {
                            consecutiveGroup.unshift(allSlots[i])
                        } else {
                            break
                        }
                    }

                    // Check next slots
                    for (let i = newTimeIndex + 1; i < allSlots.length; i++) {
                        if (areConsecutive(consecutiveGroup[consecutiveGroup.length - 1], allSlots[i])) {
                            consecutiveGroup.push(allSlots[i])
                        } else {
                            break
                        }
                    }

                    setFormData({ ...formData, appointment_time: consecutiveGroup[0] })
                    return consecutiveGroup
                } else {
                    // All consecutive, keep all
                    setFormData({ ...formData, appointment_time: sorted[0] })
                    return sorted
                }
            }
        })
    }

    const handleContinueToDetails = () => {
        if (selectedTimeSlots.length > 0) {
            setStep(4)
        }
    }

    const getDuration = () => {
        if (selectedTimeSlots.length === 0) return 0
        if (selectedTimeSlots.length === 1) return 30 // Single slot = 30 min
        
        // For multiple slots: duration = last slot time - first slot time
        // Last slot is the END time, not another 30-min slot
        const sorted = sortTimeSlots(selectedTimeSlots)
        const firstTime = sorted[0]
        const lastTime = sorted[sorted.length - 1]
        
        const firstMinutes = timeToMinutes(firstTime)
        const lastMinutes = timeToMinutes(lastTime)
        
        return lastMinutes - firstMinutes // Direct difference
    }

    const getEndTime = () => {
        if (selectedTimeSlots.length === 0) return ''
        const sorted = sortTimeSlots(selectedTimeSlots)
        
        if (sorted.length === 1) {
            // Single slot: end time = start + 30 min
            const [hours, minutes] = sorted[0].split(':').map(Number)
            const totalMinutes = hours * 60 + minutes + 30
            const endHours = Math.floor(totalMinutes / 60)
            const endMins = totalMinutes % 60
            return `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`
        }
        
        // Multiple slots: last slot IS the end time
        return sorted[sorted.length - 1]
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        setError(null)

        try {
            // Calculate duration from selected slots
            const duration = getDuration() // Use the corrected getDuration function
            const endTime = getEndTime()

            // Add duration info to notes
            const notesWithDuration = formData.notes +
                (selectedTimeSlots.length > 1 ? `\n\nDuration: ${duration} minutes (${formatTime(sortTimeSlots(selectedTimeSlots)[0])} - ${formatTime(endTime)})` : '')

            const appointmentPayload = {
                card_id: cardId,
                location_id: formData.location_id,
                patient_name: formData.patient_name,
                patient_phone: formData.patient_phone,
                patient_email: formData.patient_email || null,
                appointment_date: formData.appointment_date,
                appointment_time: formData.appointment_time, // Start time
                notes: notesWithDuration,
                meeting_type: formData.meeting_type,
                preferred_location: formData.preferred_location || null,
                tracking_id: trackingId, // Include tracking ID for visitor tracking
            }

            const response = await publicAppointmentAPI.createAppointment(appointmentPayload)

            if (response.status === 'success') {
                setSuccess(true)
                showSuccess('Appointment request submitted successfully!')
                setTimeout(() => {
                    handleClose()
                }, 2000)
            } else {
                throw new Error(response.message || 'Failed to create appointment')
            }
        } catch (err) {
            console.error('Error creating appointment:', err)
            const errorMessage = err.message || 'Failed to submit appointment. Please try again.'
            setError(errorMessage)
            showError(errorMessage)
        } finally {
            setSubmitting(false)
        }
    }

    const handleClose = () => {
        setStep(1)
        setFormData({
            patient_name: '',
            patient_phone: '',
            patient_email: '',
            appointment_date: '',
            appointment_time: '',
            notes: '',
            meeting_type: 'online',
            preferred_location: '',
            location_id: null,
        })
        setSelectedLocation(null)
        setSelectedDate('')
        setAvailableSlots([])
        setSelectedTimeSlots([])
        setError(null)
        setSuccess(false)
        onClose()
    }

    const formatTime = (time) => {
        if (!time) return ''
        const [hours, minutes] = time.split(':')
        const hour = parseInt(hours)
        const ampm = hour >= 12 ? 'PM' : 'AM'
        const displayHour = hour % 12 || 12
        return `${displayHour}:${minutes} ${ampm}`
    }

    const getNext7Days = () => {
        const days = []
        for (let i = 0; i < 14; i++) {
            const date = new Date()
            date.setDate(date.getDate() + i)
            days.push(date)
        }
        return days
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Book Appointment</h2>
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
                        >
                            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {loading ? (
                            <div className="text-center py-12">
                                <Loader2 className="w-12 h-12 mx-auto text-blue-600 dark:text-blue-400 animate-spin mb-4" />
                                <p className="text-gray-600 dark:text-gray-400">Loading appointment options...</p>
                            </div>
                        ) : error && !appointmentData ? (
                            <div className="text-center py-12">
                                <AlertCircle className="w-12 h-12 mx-auto text-red-400 dark:text-red-500 mb-4" />
                                <p className="text-gray-600 dark:text-gray-400">{error}</p>
                                <button onClick={handleClose} className="mt-4 btn-outline">
                                    Close
                                </button>
                            </div>
                        ) : success ? (
                            <div className="text-center py-12">
                                <CheckCircle2 className="w-16 h-16 mx-auto text-green-500 dark:text-green-400 mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Appointment Request Submitted!</h3>
                                <p className="text-gray-600 dark:text-gray-400">We&apos;ll get back to you soon.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                {/* Step 1: Select Location */}
                                {step === 1 && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="space-y-4"
                                    >
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Select Location</h3>
                                        {locations.length === 0 ? (
                                            <div className="text-center py-8">
                                                <MapPin className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                                                <p className="text-gray-600 dark:text-gray-400">No locations available</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {locations.map((location) => (
                                                    <button
                                                        key={location.id}
                                                        type="button"
                                                        onClick={() => handleLocationSelect(location)}
                                                        className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition text-left bg-white dark:bg-gray-700"
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                                                            <div className="flex-1">
                                                                <h4 className="font-semibold text-gray-900 dark:text-gray-100">{location.name}</h4>
                                                                {location.address && (
                                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{location.address}</p>
                                                                )}
                                                                {location.phone && (
                                                                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">{location.phone}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                {/* Step 2: Select Date */}
                                {step === 2 && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="space-y-4"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Select Date</h3>
                                            <button
                                                type="button"
                                                onClick={() => setStep(1)}
                                                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                                            >
                                                ← Back
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {getNext7Days().map((date) => {
                                                const dateStr = date.toISOString().split('T')[0]
                                                const isSelected = selectedDate === dateStr
                                                const isToday = dateStr === new Date().toISOString().split('T')[0]

                                                return (
                                                    <button
                                                        key={dateStr}
                                                        type="button"
                                                        onClick={() => handleDateSelect(dateStr)}
                                                        className={`p-3 rounded-lg border-2 transition ${isSelected
                                                            ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30'
                                                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-700'
                                                            }`}
                                                    >
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                                            {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                                        </div>
                                                        <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                            {date.getDate()}
                                                        </div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                                            {date.toLocaleDateString('en-US', { month: 'short' })}
                                                        </div>
                                                        {isToday && (
                                                            <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">Today</div>
                                                        )}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 3: Select Time */}
                                {step === 3 && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="space-y-4"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Select Time</h3>
                                            <button
                                                type="button"
                                                onClick={() => setStep(2)}
                                                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                                            >
                                                ← Back
                                            </button>
                                        </div>
                                        {availableSlots.length === 0 ? (
                                            <div className="text-center py-8">
                                                <Clock className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                                                <p className="text-gray-600 dark:text-gray-400">No available time slots for this date</p>
                                                <button
                                                    type="button"
                                                    onClick={() => setStep(2)}
                                                    className="mt-4 btn-outline"
                                                >
                                                    Select Another Date
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                                    <p className="text-sm text-blue-800 dark:text-blue-300">
                                                        💡 <strong>Tip:</strong> Select your <span className="text-emerald-600 dark:text-emerald-400 font-semibold">START</span> time and <span className="text-rose-600 dark:text-rose-400 font-semibold">END</span> time. For 1 hour appointment, select 9:00 AM → 10:00 AM.
                                                    </p>
                                                </div>
                                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                                    {availableSlots.map((slot, idx) => {
                                                        // Handle both object format (slot.start_time) and string format
                                                        const timeStr = typeof slot === 'string' ? slot : (slot.start_time || slot)
                                                        const isSelected = selectedTimeSlots.includes(timeStr)

                                                        // Check if this is part of consecutive selection
                                                        const sortedSelected = sortTimeSlots(selectedTimeSlots)
                                                        const selectedIndex = sortedSelected.indexOf(timeStr)
                                                        const isFirst = selectedIndex === 0
                                                        const isLast = selectedIndex === sortedSelected.length - 1
                                                        const isMiddle = selectedIndex > 0 && selectedIndex < sortedSelected.length - 1

                                                        return (
                                                            <button
                                                                key={idx}
                                                                type="button"
                                                                onClick={() => handleTimeSelect(timeStr)}
                                                                className={`p-3 rounded-lg border-2 transition relative bg-white dark:bg-gray-700 ${isSelected
                                                                    ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30 ring-2 ring-blue-200 dark:ring-blue-800'
                                                                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                                                                    }`}
                                                            >
                                                                <Clock className="w-4 h-4 mx-auto mb-1 text-gray-600 dark:text-gray-400" />
                                                                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                                    {formatTime(timeStr)}
                                                                </div>
                                                                {isSelected && (
                                                                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 dark:bg-blue-400 rounded-full flex items-center justify-center">
                                                                        <span className="text-white text-xs">✓</span>
                                                                    </div>
                                                                )}
                                                                {isSelected && isFirst && sortedSelected.length > 1 && (
                                                                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-100 dark:bg-emerald-900/50 px-1.5 py-0.5 rounded">
                                                                        START
                                                                    </div>
                                                                )}
                                                                {isSelected && isLast && sortedSelected.length > 1 && (
                                                                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-[10px] text-rose-600 dark:text-rose-400 font-bold bg-rose-100 dark:bg-rose-900/50 px-1.5 py-0.5 rounded">
                                                                        END
                                                                    </div>
                                                                )}
                                                            </button>
                                                        )
                                                    })}
                                                </div>

                                                {/* Selected Time Summary */}
                                                {selectedTimeSlots.length > 0 && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
                                                    >
                                                        <div className="flex items-center justify-between mb-2">
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Selected Time:</p>
                                                                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                                    {formatTime(sortTimeSlots(selectedTimeSlots)[0])} - {formatTime(getEndTime())}
                                                                </p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Duration:</p>
                                                                <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                                                                    {getDuration()} min
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                                                            {selectedTimeSlots.length === 1 
                                                                ? '1 slot selected (30 minutes)' 
                                                                : `From ${formatTime(sortTimeSlots(selectedTimeSlots)[0])} to ${formatTime(getEndTime())} (${getDuration()} minutes)`
                                                            }
                                                        </p>
                                                        <button
                                                            type="button"
                                                            onClick={handleContinueToDetails}
                                                            className="w-full btn-primary"
                                                        >
                                                            Continue to Details
                                                        </button>
                                                    </motion.div>
                                                )}
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                {/* Step 4: Fill Details */}
                                {step === 4 && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="space-y-4"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Your Details</h3>
                                            <button
                                                type="button"
                                                onClick={() => setStep(3)}
                                                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                                            >
                                                ← Back
                                            </button>
                                        </div>

                                        {/* Selected Time Summary Card */}
                                        {selectedTimeSlots.length > 0 && (
                                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Appointment Time</p>
                                                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                            {formatTime(sortTimeSlots(selectedTimeSlots)[0])} - {formatTime(getEndTime())}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Duration</p>
                                                        <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                                                            {getDuration()} min
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {error && (
                                            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                                                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                                <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
                                            </div>
                                        )}

                                        <div className="space-y-4">
                                            {/* Name */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    <User className="w-4 h-4 inline mr-1" />
                                                    Full Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.patient_name}
                                                    onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                                                    placeholder="John Doe"
                                                />
                                            </div>

                                            {/* Phone */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    <Phone className="w-4 h-4 inline mr-1" />
                                                    Phone Number *
                                                </label>
                                                <input
                                                    type="tel"
                                                    required
                                                    value={formData.patient_phone}
                                                    onChange={(e) => setFormData({ ...formData, patient_phone: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                                                    placeholder="+1 (555) 123-4567"
                                                />
                                            </div>

                                            {/* Email */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    <Mail className="w-4 h-4 inline mr-1" />
                                                    Email (Optional)
                                                </label>
                                                <input
                                                    type="email"
                                                    value={formData.patient_email}
                                                    onChange={(e) => setFormData({ ...formData, patient_email: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                                                    placeholder="john@example.com"
                                                />
                                            </div>

                                            {/* Meeting Type */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Meeting Type *
                                                </label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, meeting_type: 'online' })}
                                                        className={`p-4 border-2 rounded-lg transition bg-white dark:bg-gray-700 ${formData.meeting_type === 'online'
                                                            ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30'
                                                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                                                            }`}
                                                    >
                                                        <Video className="w-6 h-6 mx-auto mb-2 text-gray-600 dark:text-gray-400" />
                                                        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">Online</div>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, meeting_type: 'location' })}
                                                        className={`p-4 border-2 rounded-lg transition bg-white dark:bg-gray-700 ${formData.meeting_type === 'location'
                                                            ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30'
                                                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                                                            }`}
                                                    >
                                                        <MapPin className="w-6 h-6 mx-auto mb-2 text-gray-600 dark:text-gray-400" />
                                                        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">Location</div>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Preferred Location (if location type) */}
                                            {formData.meeting_type === 'location' && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        <MapPin className="w-4 h-4 inline mr-1" />
                                                        Preferred Location (Optional)
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formData.preferred_location}
                                                        onChange={(e) => setFormData({ ...formData, preferred_location: e.target.value })}
                                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                                                        placeholder="Enter preferred location or address"
                                                    />
                                                    {formData.preferred_location && (
                                                        <div className="mt-2">
                                                            <a
                                                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formData.preferred_location)}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 inline-flex items-center"
                                                            >
                                                                <MapPin className="w-4 h-4 mr-1" />
                                                                View on Map
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Notes */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    <FileText className="w-4 h-4 inline mr-1" />
                                                    Reason for Appointment *
                                                </label>
                                                <textarea
                                                    required
                                                    value={formData.notes}
                                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                                    rows={4}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                                                    placeholder="Please describe the reason for your appointment..."
                                                />
                                            </div>
                                        </div>

                                        {/* Submit Button */}
                                        <div className="flex gap-3 pt-4">
                                            <button
                                                type="button"
                                                onClick={() => setStep(3)}
                                                className="flex-1 btn-outline"
                                            >
                                                Back
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={submitting}
                                                className="flex-1 btn-primary flex items-center justify-center"
                                            >
                                                {submitting ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                        Submitting...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Calendar className="w-5 h-5 mr-2" />
                                                        Book Appointment
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </form>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}

