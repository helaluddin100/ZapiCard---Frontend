'use client'

import { useState } from 'react'
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
    CalendarDays
} from 'lucide-react'
import DashboardLayout from '@/components/DashboardLayout'

export default function AppointmentsPage() {
    const [locations, setLocations] = useState([
        {
            id: 1,
            name: 'Hospital A',
            address: '123 Medical Street',
            timeSlots: [
                { start: '09:00', end: '12:00', days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] }
            ]
        },
        {
            id: 2,
            name: 'Hospital B',
            address: '456 Health Avenue',
            timeSlots: [
                { start: '14:00', end: '17:00', days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] }
            ]
        },
        {
            id: 3,
            name: 'Hospital C',
            address: '789 Care Boulevard',
            timeSlots: [
                { start: '20:00', end: '22:00', days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] }
            ]
        }
    ])

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

    const handleAddLocation = () => {
        setEditingLocation(null)
        setLocationForm({ name: '', address: '' })
        setShowLocationModal(true)
    }

    const handleEditLocation = (location) => {
        setEditingLocation(location)
        setLocationForm({ name: location.name, address: location.address })
        setShowLocationModal(true)
    }

    const handleSaveLocation = () => {
        if (editingLocation) {
            setLocations(locations.map(loc =>
                loc.id === editingLocation.id
                    ? { ...loc, name: locationForm.name, address: locationForm.address }
                    : loc
            ))
        } else {
            const newLocation = {
                id: Date.now(),
                name: locationForm.name,
                address: locationForm.address,
                timeSlots: []
            }
            setLocations([...locations, newLocation])
        }
        setShowLocationModal(false)
        setLocationForm({ name: '', address: '' })
    }

    const handleDeleteLocation = (id) => {
        if (confirm('Are you sure you want to delete this location?')) {
            setLocations(locations.filter(loc => loc.id !== id))
            if (selectedLocation?.id === id) {
                setSelectedLocation(null)
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
            start: timeSlot.start,
            end: timeSlot.end,
            days: timeSlot.days || [],
            applyToAllDays: false,
            specificDate: timeSlot.specificDate || null,
            applyToMonth: false
        })
        setShowTimeSlotModal(true)
    }

    const handleSaveTimeSlot = () => {
        if (!selectedLocation) return

        const newTimeSlot = {
            start: timeSlotForm.start,
            end: timeSlotForm.end,
            days: timeSlotForm.applyToAllDays ? daysOfWeek.map(d => d.value) : timeSlotForm.days,
            specificDate: timeSlotForm.specificDate || null,
            applyToMonth: timeSlotForm.applyToMonth
        }

        if (editingTimeSlot) {
            setLocations(locations.map(loc =>
                loc.id === selectedLocation.id
                    ? { ...loc, timeSlots: loc.timeSlots.map(ts => ts === editingTimeSlot ? newTimeSlot : ts) }
                    : loc
            ))
        } else {
            setLocations(locations.map(loc =>
                loc.id === selectedLocation.id
                    ? { ...loc, timeSlots: [...loc.timeSlots, newTimeSlot] }
                    : loc
            ))
        }

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

    const handleDeleteTimeSlot = (location, timeSlot) => {
        if (confirm('Are you sure you want to delete this time slot?')) {
            setLocations(locations.map(loc =>
                loc.id === location.id
                    ? { ...loc, timeSlots: loc.timeSlots.filter(ts => ts !== timeSlot) }
                    : loc
            ))
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

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Appointment Management</h1>
                    <p className="text-gray-600">Manage your availability and time slots across different locations</p>
                </div>

                {/* View Toggle */}
                <div className="mb-6 flex gap-4">
                    <button
                        onClick={() => setViewMode('locations')}
                        className={`px-6 py-2 rounded-lg font-medium transition ${viewMode === 'locations'
                                ? 'gradient-primary text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <Building2 className="w-4 h-4 inline mr-2" />
                        Locations
                    </button>
                    <button
                        onClick={() => setViewMode('calendar')}
                        className={`px-6 py-2 rounded-lg font-medium transition ${viewMode === 'calendar'
                                ? 'gradient-primary text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <CalendarDays className="w-4 h-4 inline mr-2" />
                        Calendar View
                    </button>
                </div>

                {viewMode === 'locations' ? (
                    <div className="space-y-6">
                        {/* Add Location Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleAddLocation}
                            className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 transition flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600"
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
                                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                                >
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center">
                                                        <MapPin className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-bold text-gray-900">{location.name}</h3>
                                                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                                                            <MapPin className="w-4 h-4" />
                                                            {location.address}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEditLocation(location)}
                                                    className="p-2 rounded-lg hover:bg-gray-100 transition"
                                                >
                                                    <Edit2 className="w-5 h-5 text-blue-600" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteLocation(location.id)}
                                                    className="p-2 rounded-lg hover:bg-red-50 transition"
                                                >
                                                    <Trash2 className="w-5 h-5 text-red-600" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Time Slots */}
                                        <div className="border-t border-gray-200 pt-4">
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                                    <Clock className="w-5 h-5" />
                                                    Time Slots
                                                </h4>
                                                <button
                                                    onClick={() => handleAddTimeSlot(location)}
                                                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition flex items-center gap-2 text-sm font-medium"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                    Add Time Slot
                                                </button>
                                            </div>

                                            {location.timeSlots.length === 0 ? (
                                                <div className="text-center py-8 text-gray-500">
                                                    <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                                    <p>No time slots added yet</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    {location.timeSlots.map((timeSlot, index) => (
                                                        <div
                                                            key={index}
                                                            className="p-4 bg-gray-50 rounded-lg flex items-center justify-between"
                                                        >
                                                            <div className="flex items-center gap-4">
                                                                <div className="flex items-center gap-2">
                                                                    <Clock className="w-4 h-4 text-gray-500" />
                                                                    <span className="font-medium text-gray-900">
                                                                        {timeSlot.start} - {timeSlot.end}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    {timeSlot.days && timeSlot.days.length > 0 ? (
                                                                        <div className="flex gap-1">
                                                                            {timeSlot.days.map((day, i) => (
                                                                                <span
                                                                                    key={i}
                                                                                    className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium"
                                                                                >
                                                                                    {daysOfWeek.find(d => d.value === day)?.label}
                                                                                </span>
                                                                            ))}
                                                                        </div>
                                                                    ) : (
                                                                        <span className="text-sm text-gray-500">Specific date</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => handleEditTimeSlot(location, timeSlot)}
                                                                    className="p-2 rounded-lg hover:bg-white transition"
                                                                >
                                                                    <Edit2 className="w-4 h-4 text-blue-600" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteTimeSlot(location, timeSlot)}
                                                                    className="p-2 rounded-lg hover:bg-white transition"
                                                                >
                                                                    <Trash2 className="w-4 h-4 text-red-600" />
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
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Calendar View</h2>
                        <p className="text-gray-600">Calendar view coming soon...</p>
                    </div>
                )}

                {/* Location Modal */}
                {showLocationModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-gray-900">
                                    {editingLocation ? 'Edit Location' : 'Add New Location'}
                                </h3>
                                <button
                                    onClick={() => setShowLocationModal(false)}
                                    className="p-2 rounded-lg hover:bg-gray-100"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Location Name
                                    </label>
                                    <input
                                        type="text"
                                        value={locationForm.name}
                                        onChange={(e) => setLocationForm({ ...locationForm, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="e.g., Hospital A"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Address
                                    </label>
                                    <textarea
                                        value={locationForm.address}
                                        onChange={(e) => setLocationForm({ ...locationForm, address: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter full address"
                                        rows={3}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowLocationModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveLocation}
                                    className="flex-1 px-4 py-2 gradient-primary text-white rounded-lg hover:shadow-lg transition"
                                >
                                    <Save className="w-4 h-4 inline mr-2" />
                                    Save
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Time Slot Modal */}
                {showTimeSlotModal && selectedLocation && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-gray-900">
                                    {editingTimeSlot ? 'Edit Time Slot' : 'Add Time Slot'} - {selectedLocation.name}
                                </h3>
                                <button
                                    onClick={() => setShowTimeSlotModal(false)}
                                    className="p-2 rounded-lg hover:bg-gray-100"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Time Range */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Start Time
                                        </label>
                                        <input
                                            type="time"
                                            value={timeSlotForm.start}
                                            onChange={(e) => setTimeSlotForm({ ...timeSlotForm, start: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            End Time
                                        </label>
                                        <input
                                            type="time"
                                            value={timeSlotForm.end}
                                            onChange={(e) => setTimeSlotForm({ ...timeSlotForm, end: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                                        />
                                        <span className="font-medium text-gray-700">Apply to all days of the week</span>
                                    </label>

                                    {!timeSlotForm.applyToAllDays && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                                Select Days
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {daysOfWeek.map((day) => (
                                                    <button
                                                        key={day.value}
                                                        type="button"
                                                        onClick={() => toggleDay(day.value)}
                                                        className={`px-4 py-2 rounded-lg font-medium transition ${timeSlotForm.days.includes(day.value)
                                                                ? 'gradient-primary text-white'
                                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                                        />
                                        <span className="font-medium text-gray-700">Apply to entire month</span>
                                    </label>

                                    {!timeSlotForm.applyToMonth && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Specific Date (Optional)
                                            </label>
                                            <input
                                                type="date"
                                                value={timeSlotForm.specificDate || ''}
                                                onChange={(e) => setTimeSlotForm({ ...timeSlotForm, specificDate: e.target.value || null })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                Leave empty to apply to selected days weekly
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowTimeSlotModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveTimeSlot}
                                    className="flex-1 px-4 py-2 gradient-primary text-white rounded-lg hover:shadow-lg transition"
                                >
                                    <Save className="w-4 h-4 inline mr-2" />
                                    Save Time Slot
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}

