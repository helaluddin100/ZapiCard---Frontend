'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    Calendar,
    Clock,
    MapPin,
    Plus,
    Edit2,
    Trash2,
    Save,
    X,
    CheckCircle2,
    Building2,
    CalendarDays,
    Loader2,
    AlertCircle,
    ChevronLeft,
    ChevronRight
} from 'lucide-react'
import DashboardLayout from '@/components/DashboardLayout'
import { appointmentAPI } from '@/lib/api'

export default function AppointmentsPage() {
    const [locations, setLocations] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [saving, setSaving] = useState(false)

    const [selectedLocation, setSelectedLocation] = useState(null)
    const [showLocationModal, setShowLocationModal] = useState(false)
    const [showTimeSlotModal, setShowTimeSlotModal] = useState(false)
    const [editingLocation, setEditingLocation] = useState(null)
    const [editingTimeSlot, setEditingTimeSlot] = useState(null)
    const [viewMode, setViewMode] = useState('locations') // 'locations' or 'calendar'
    const [selectedDate, setSelectedDate] = useState(new Date())

    const daysOfWeek = [
        { value: 'monday', label: 'Mon' },
        { value: 'tuesday', label: 'Tue' },
        { value: 'wednesday', label: 'Wed' },
        { value: 'thursday', label: 'Thu' },
        { value: 'friday', label: 'Fri' },
        { value: 'saturday', label: 'Sat' },
        { value: 'sunday', label: 'Sun' }
    ]

    const [locationForm, setLocationForm] = useState({
        name: '',
        address: ''
    })

    const [timeSlotForm, setTimeSlotForm] = useState({
        start: '09:00',
        end: '17:00',
        days: [],
        applyToAllDays: false,
        specificDate: null,
        applyToMonth: false
    })

    // Fetch locations on component mount
    useEffect(() => {
        fetchLocations()
    }, [])

    const fetchLocations = async () => {
        try {
            setLoading(true)
            setError('')
            const response = await appointmentAPI.getLocations()
            if (response.status === 'success') {
                // Transform API response to match frontend format
                const transformedLocations = response.data.map(location => ({
                    ...location,
                    timeSlots: location.time_slots?.map(slot => ({
                        id: slot.id,
                        start: slot.start_time,
                        end: slot.end_time,
                        days: slot.days,
                        specificDate: slot.specific_date,
                        applyToMonth: slot.apply_to_month,
                        isActive: slot.is_active
                    })) || []
                }))
                setLocations(transformedLocations)
            }
        } catch (err) {
            setError(err.message || 'Failed to load locations')
            console.error('Error fetching locations:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleAddLocation = () => {
        setEditingLocation(null)
        setLocationForm({ name: '', address: '', phone: '', email: '' })
        setShowLocationModal(true)
    }

    const handleEditLocation = (location) => {
        setEditingLocation(location)
        setLocationForm({
            name: location.name,
            address: location.address || '',
            phone: location.phone || '',
            email: location.email || ''
        })
        setShowLocationModal(true)
    }

    const handleSaveLocation = async () => {
        try {
            setSaving(true)
            setError('')

            if (editingLocation) {
                const response = await appointmentAPI.updateLocation(editingLocation.id, {
                    name: locationForm.name,
                    address: locationForm.address,
                    phone: locationForm.phone || null,
                    email: locationForm.email || null,
                })

                if (response.status === 'success') {
                    await fetchLocations() // Refresh locations
                    setShowLocationModal(false)
                    setLocationForm({ name: '', address: '', phone: '', email: '' })
                }
            } else {
                const response = await appointmentAPI.createLocation({
                    name: locationForm.name,
                    address: locationForm.address,
                    phone: locationForm.phone || null,
                    email: locationForm.email || null,
                })

                if (response.status === 'success') {
                    await fetchLocations() // Refresh locations
                    setShowLocationModal(false)
                    setLocationForm({ name: '', address: '', phone: '', email: '' })
                }
            }
        } catch (err) {
            setError(err.message || 'Failed to save location')
            console.error('Error saving location:', err)
        } finally {
            setSaving(false)
        }
    }

    const handleDeleteLocation = async (id) => {
        if (confirm('Are you sure you want to delete this location? This will also delete all associated time slots.')) {
            try {
                setSaving(true)
                setError('')
                const response = await appointmentAPI.deleteLocation(id)

                if (response.status === 'success') {
                    await fetchLocations() // Refresh locations
                    if (selectedLocation?.id === id) {
                        setSelectedLocation(null)
                    }
                }
            } catch (err) {
                setError(err.message || 'Failed to delete location')
                console.error('Error deleting location:', err)
            } finally {
                setSaving(false)
            }
        }
    }

    const handleAddTimeSlot = (location) => {
        setSelectedLocation(location)
        setEditingTimeSlot(null)
        setTimeSlotForm({
            start: '09:00',
            end: '17:00',
            days: [],
            applyToAllDays: false,
            specificDate: null,
            applyToMonth: false
        })
        setShowTimeSlotModal(true)
    }

    const handleEditTimeSlot = (location, timeSlot) => {
        setSelectedLocation(location)
        setEditingTimeSlot(timeSlot)
        setTimeSlotForm({
            start: timeSlot.start || timeSlot.start_time || '09:00',
            end: timeSlot.end || timeSlot.end_time || '17:00',
            days: timeSlot.days || [],
            applyToAllDays: timeSlot.days && timeSlot.days.length === 7,
            specificDate: timeSlot.specificDate || timeSlot.specific_date || null,
            applyToMonth: timeSlot.applyToMonth || timeSlot.apply_to_month || false
        })
        setShowTimeSlotModal(true)
    }

    const handleSaveTimeSlot = async () => {
        if (!selectedLocation) return

        try {
            setSaving(true)
            setError('')

            const timeSlotData = {
                location_id: selectedLocation.id,
                start_time: timeSlotForm.start,
                end_time: timeSlotForm.end,
                days: timeSlotForm.applyToAllDays ? daysOfWeek.map(d => d.value) : (timeSlotForm.days.length > 0 ? timeSlotForm.days : null),
                specific_date: timeSlotForm.specificDate || null,
                apply_to_month: timeSlotForm.applyToMonth || false,
            }

            if (editingTimeSlot) {
                const response = await appointmentAPI.updateTimeSlot(editingTimeSlot.id, timeSlotData)
                if (response.status === 'success') {
                    await fetchLocations() // Refresh locations
                    setShowTimeSlotModal(false)
                    setTimeSlotForm({
                        start: '09:00',
                        end: '17:00',
                        days: [],
                        applyToAllDays: false,
                        specificDate: null,
                        applyToMonth: false
                    })
                }
            } else {
                const response = await appointmentAPI.createTimeSlot(timeSlotData)
                if (response.status === 'success') {
                    await fetchLocations() // Refresh locations
                    setShowTimeSlotModal(false)
                    setTimeSlotForm({
                        start: '09:00',
                        end: '17:00',
                        days: [],
                        applyToAllDays: false,
                        specificDate: null,
                        applyToMonth: false
                    })
                }
            }
        } catch (err) {
            setError(err.message || 'Failed to save time slot')
            console.error('Error saving time slot:', err)
        } finally {
            setSaving(false)
        }
    }

    const handleDeleteTimeSlot = async (location, timeSlot) => {
        if (confirm('Are you sure you want to delete this time slot?')) {
            try {
                setSaving(true)
                setError('')
                const response = await appointmentAPI.deleteTimeSlot(timeSlot.id)

                if (response.status === 'success') {
                    await fetchLocations() // Refresh locations
                }
            } catch (err) {
                setError(err.message || 'Failed to delete time slot')
                console.error('Error deleting time slot:', err)
            } finally {
                setSaving(false)
            }
        }
    }

    const toggleDay = (day) => {
        setTimeSlotForm(prev => ({
            ...prev,
            days: prev.days.includes(day)
                ? prev.days.filter(d => d !== day)
                : [...prev.days, day]
        }))
    }

    // Calendar View Component
    function CalendarView({ locations, selectedDate, setSelectedDate, daysOfWeek }) {
        const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1))

        // Sync currentMonth when selectedDate changes externally
        useEffect(() => {
            setCurrentMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1))
        }, [selectedDate])

        const getDaysInMonth = (date) => {
            const year = date.getFullYear()
            const month = date.getMonth()
            const firstDay = new Date(year, month, 1)
            const lastDay = new Date(year, month + 1, 0)
            const daysInMonth = lastDay.getDate()
            const startingDayOfWeek = firstDay.getDay()

            const days = []

            // Add empty cells for days before the first day of the month
            for (let i = 0; i < startingDayOfWeek; i++) {
                days.push(null)
            }

            // Add all days of the month
            for (let day = 1; day <= daysInMonth; day++) {
                days.push(new Date(year, month, day))
            }

            return days
        }

        const getDayName = (date) => {
            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
            return dayNames[date.getDay()]
        }

        const getTimeSlotsForDate = (date) => {
            if (!date) return []

            const dayName = getDayName(date).toLowerCase()
            const dateString = date.toISOString().split('T')[0]
            const slots = []

            locations.forEach(location => {
                location.timeSlots?.forEach(slot => {
                    // Check if slot applies to this date
                    let applies = false

                    // Priority 1: Specific date slot (highest priority)
                    if (slot.specificDate || slot.specific_date) {
                        const slotDate = new Date(slot.specificDate || slot.specific_date).toISOString().split('T')[0]
                        if (slotDate === dateString) {
                            applies = true
                        }
                    }
                    // Priority 2: Monthly slot with specific days
                    else if (slot.applyToMonth || slot.apply_to_month) {
                        // If days are specified, only apply to those days
                        if (slot.days && slot.days.length > 0) {
                            const dayMap = {
                                'sunday': 'sunday',
                                'monday': 'monday',
                                'tuesday': 'tuesday',
                                'wednesday': 'wednesday',
                                'thursday': 'thursday',
                                'friday': 'friday',
                                'saturday': 'saturday'
                            }
                            if (slot.days.includes(dayMap[dayName])) {
                                applies = true
                            }
                        } else {
                            // No days specified, apply to all days in the month
                            applies = true
                        }
                    }
                    // Priority 3: Weekly slot (specific days, not monthly)
                    else if (slot.days && slot.days.length > 0) {
                        const dayMap = {
                            'sunday': 'sunday',
                            'monday': 'monday',
                            'tuesday': 'tuesday',
                            'wednesday': 'wednesday',
                            'thursday': 'thursday',
                            'friday': 'friday',
                            'saturday': 'saturday'
                        }
                        if (slot.days.includes(dayMap[dayName])) {
                            applies = true
                        }
                    }

                    if (applies && slot.isActive !== false) {
                        slots.push({
                            ...slot,
                            locationName: location.name,
                            locationId: location.id
                        })
                    }
                })
            })

            return slots
        }

        const navigateMonth = (direction) => {
            setCurrentMonth(prev => {
                const newDate = new Date(prev)
                if (direction === 'prev') {
                    newDate.setMonth(prev.getMonth() - 1)
                } else {
                    newDate.setMonth(prev.getMonth() + 1)
                }
                return newDate
            })
        }

        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ]

        const days = getDaysInMonth(currentMonth)
        const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => navigateMonth('prev')}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </h2>
                    <button
                        onClick={() => navigateMonth('next')}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                    {weekDays.map(day => (
                        <div key={day} className="text-center font-semibold text-gray-700 dark:text-gray-300 py-2">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                    {days.map((date, index) => {
                        const timeSlots = getTimeSlotsForDate(date)
                        const isToday = date &&
                            date.toDateString() === new Date().toDateString()
                        const isSelected = date &&
                            date.toDateString() === selectedDate.toDateString()

                        return (
                            <div
                                key={index}
                                className={`
                                    min-h-[100px] border rounded-lg p-2
                                    ${date ? 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer' : 'bg-gray-50 dark:bg-gray-700/50'}
                                    ${isToday ? 'border-blue-500 dark:border-blue-400 border-2' : 'border-gray-200 dark:border-gray-600'}
                                    ${isSelected ? 'ring-2 ring-blue-300 dark:ring-blue-600' : ''}
                                    transition
                                `}
                                onClick={() => date && setSelectedDate(date)}
                            >
                                {date && (
                                    <>
                                        <div className={`
                                            text-sm font-medium mb-1
                                            ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'}
                                        `}>
                                            {date.getDate()}
                                        </div>
                                        <div className="space-y-1">
                                            {timeSlots.slice(0, 3).map((slot, slotIndex) => (
                                                <div
                                                    key={slotIndex}
                                                    className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1 py-0.5 rounded truncate"
                                                    title={`${slot.locationName}: ${slot.start || slot.start_time} - ${slot.end || slot.end_time}`}
                                                >
                                                    <div className="font-medium truncate">{slot.locationName}</div>
                                                    <div className="text-blue-600 dark:text-blue-400">
                                                        {slot.start || slot.start_time} - {slot.end || slot.end_time}
                                                    </div>
                                                </div>
                                            ))}
                                            {timeSlots.length > 3 && (
                                                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                                    +{timeSlots.length - 3} more
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Selected Date Details */}
                {selectedDate && (
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                            {getDayName(selectedDate)}, {selectedDate.toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                            })}
                        </h3>

                        {getTimeSlotsForDate(selectedDate).length === 0 ? (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>No appointments scheduled for this day</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {getTimeSlotsForDate(selectedDate).map((slot, index) => (
                                    <div
                                        key={index}
                                        className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                                                        <MapPin className="w-4 h-4 text-white" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">{slot.locationName}</h4>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            {locations.find(l => l.id === slot.locationId)?.address || ''}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                                    <Clock className="w-4 h-4" />
                                                    <span className="font-medium">
                                                        {slot.start || slot.start_time} - {slot.end || slot.end_time}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Legend */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-blue-500 dark:border-blue-400 rounded"></div>
                            <span className="text-gray-600 dark:text-gray-400">Today</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded"></div>
                            <span className="text-gray-600 dark:text-gray-400">Has Appointments</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Appointment Management</h1>
                    <p className="text-gray-600 dark:text-gray-400">Manage your availability and time slots across different locations</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-700 dark:text-red-300">
                        <AlertCircle className="w-5 h-5" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
                        <span className="ml-3 text-gray-600 dark:text-gray-400">Loading locations...</span>
                    </div>
                )}

                {/* View Toggle */}
                <div className="mb-6 flex gap-4">
                    <button
                        onClick={() => setViewMode('locations')}
                        className={`px-6 py-2 rounded-lg font-medium transition border ${viewMode === 'locations'
                            ? 'gradient-primary text-white border-transparent'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600'
                            }`}
                    >
                        <Building2 className="w-4 h-4 inline mr-2" />
                        Locations
                    </button>
                    <button
                        onClick={() => setViewMode('calendar')}
                        className={`px-6 py-2 rounded-lg font-medium transition border ${viewMode === 'calendar'
                            ? 'gradient-primary text-white border-transparent'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600'
                            }`}
                    >
                        <CalendarDays className="w-4 h-4 inline mr-2" />
                        Calendar View
                    </button>
                </div>

                {!loading && viewMode === 'locations' ? (
                    <div className="space-y-6">
                        {/* Add Location Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleAddLocation}
                            className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 transition flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 bg-white dark:bg-gray-800"
                        >
                            <Plus className="w-5 h-5" />
                            <span className="font-medium">Add New Location</span>
                        </motion.button>

                        {/* Locations List */}
                        <div className="grid gap-6">
                            {locations.map((location) => (
                                <motion.div
                                    key={location.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
                                >
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center">
                                                        <MapPin className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{location.name}</h3>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-1">
                                                            <MapPin className="w-4 h-4" />
                                                            {location.address}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEditLocation(location)}
                                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                                >
                                                    <Edit2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteLocation(location.id)}
                                                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                                                >
                                                    <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Time Slots */}
                                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                                    <Clock className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                                    Time Slots
                                                </h4>
                                                <button
                                                    onClick={() => handleAddTimeSlot(location)}
                                                    className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition flex items-center gap-2 text-sm font-medium"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                    Add Time Slot
                                                </button>
                                            </div>

                                            {location.timeSlots.length === 0 ? (
                                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                                    <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                                    <p>No time slots added yet</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    {location.timeSlots.map((timeSlot) => (
                                                        <div
                                                            key={timeSlot.id}
                                                            className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-center justify-between"
                                                        >
                                                            <div className="flex items-center gap-4">
                                                                <div className="flex items-center gap-2">
                                                                    <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                                                    <span className="font-medium text-gray-900 dark:text-gray-100">
                                                                        {timeSlot.start || timeSlot.start_time} - {timeSlot.end || timeSlot.end_time}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    {timeSlot.days && timeSlot.days.length > 0 ? (
                                                                        <div className="flex gap-1 flex-wrap">
                                                                            {timeSlot.days.map((day, i) => (
                                                                                <span
                                                                                    key={i}
                                                                                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs font-medium"
                                                                                >
                                                                                    {daysOfWeek.find(d => d.value === day)?.label}
                                                                                </span>
                                                                            ))}
                                                                        </div>
                                                                    ) : timeSlot.specificDate || timeSlot.specific_date ? (
                                                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                                                            {new Date(timeSlot.specificDate || timeSlot.specific_date).toLocaleDateString()}
                                                                        </span>
                                                                    ) : (
                                                                        <span className="text-sm text-gray-500 dark:text-gray-400">Monthly</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => handleEditTimeSlot(location, timeSlot)}
                                                                    className="p-2 rounded-lg hover:bg-white dark:hover:bg-gray-600 transition"
                                                                >
                                                                    <Edit2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteTimeSlot(location, timeSlot)}
                                                                    className="p-2 rounded-lg hover:bg-white dark:hover:bg-gray-600 transition"
                                                                >
                                                                    <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <CalendarView
                        locations={locations}
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                        daysOfWeek={daysOfWeek}
                    />
                )}

                {/* Location Modal */}
                {showLocationModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-700"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                    {editingLocation ? 'Edit Location' : 'Add New Location'}
                                </h3>
                                <button
                                    onClick={() => setShowLocationModal(false)}
                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Location Name
                                    </label>
                                    <input
                                        type="text"
                                        value={locationForm.name}
                                        onChange={(e) => setLocationForm({ ...locationForm, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                                        placeholder="e.g., Hospital A"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Address
                                    </label>
                                    <textarea
                                        value={locationForm.address}
                                        onChange={(e) => setLocationForm({ ...locationForm, address: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                                        placeholder="Enter full address"
                                        rows={3}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Phone (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={locationForm.phone}
                                        onChange={(e) => setLocationForm({ ...locationForm, phone: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                                        placeholder="e.g., +1234567890"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Email (Optional)
                                    </label>
                                    <input
                                        type="email"
                                        value={locationForm.email}
                                        onChange={(e) => setLocationForm({ ...locationForm, email: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                                        placeholder="location@example.com"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowLocationModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveLocation}
                                    disabled={saving}
                                    className="flex-1 px-4 py-2 gradient-primary text-white rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 inline mr-2" />
                                            Save
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Time Slot Modal */}
                {showTimeSlotModal && selectedLocation && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                    {editingTimeSlot ? 'Edit Time Slot' : 'Add Time Slot'} - {selectedLocation.name}
                                </h3>
                                <button
                                    onClick={() => setShowTimeSlotModal(false)}
                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Time Range */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Start Time
                                        </label>
                                        <input
                                            type="time"
                                            value={timeSlotForm.start}
                                            onChange={(e) => setTimeSlotForm({ ...timeSlotForm, start: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            End Time
                                        </label>
                                        <input
                                            type="time"
                                            value={timeSlotForm.end}
                                            onChange={(e) => setTimeSlotForm({ ...timeSlotForm, end: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        />
                                    </div>
                                </div>

                                {/* Apply Options */}
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={timeSlotForm.applyToAllDays}
                                            onChange={(e) => {
                                                setTimeSlotForm({
                                                    ...timeSlotForm,
                                                    applyToAllDays: e.target.checked,
                                                    days: e.target.checked ? daysOfWeek.map(d => d.value) : []
                                                })
                                            }}
                                            className="w-5 h-5 text-blue-600 dark:text-blue-400 rounded focus:ring-blue-500"
                                        />
                                        <span className="font-medium text-gray-700 dark:text-gray-300">Apply to all days of the week</span>
                                    </label>

                                    {!timeSlotForm.applyToAllDays && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                                Select Days
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {daysOfWeek.map((day) => (
                                                    <button
                                                        key={day.value}
                                                        type="button"
                                                        onClick={() => toggleDay(day.value)}
                                                        className={`px-4 py-2 rounded-lg font-medium transition border ${timeSlotForm.days.includes(day.value)
                                                            ? 'gradient-primary text-white border-transparent'
                                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border-gray-200 dark:border-gray-600'
                                                            }`}
                                                    >
                                                        {day.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={timeSlotForm.applyToMonth}
                                            onChange={(e) => setTimeSlotForm({
                                                ...timeSlotForm,
                                                applyToMonth: e.target.checked,
                                                specificDate: e.target.checked ? null : timeSlotForm.specificDate
                                            })}
                                            className="w-5 h-5 text-blue-600 dark:text-blue-400 rounded focus:ring-blue-500"
                                        />
                                        <span className="font-medium text-gray-700 dark:text-gray-300">Apply to entire month</span>
                                    </label>

                                    {!timeSlotForm.applyToMonth && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Specific Date (Optional)
                                            </label>
                                            <input
                                                type="date"
                                                value={timeSlotForm.specificDate || ''}
                                                onChange={(e) => setTimeSlotForm({ ...timeSlotForm, specificDate: e.target.value || null })}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                            />
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                Leave empty to apply to selected days weekly
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowTimeSlotModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveTimeSlot}
                                    disabled={saving}
                                    className="flex-1 px-4 py-2 gradient-primary text-white rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 inline mr-2" />
                                            Save Time Slot
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}

