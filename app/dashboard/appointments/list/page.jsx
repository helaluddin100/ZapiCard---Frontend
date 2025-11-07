'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    Calendar,
    Clock,
    MapPin,
    User,
    Mail,
    Phone,
    CheckCircle2,
    XCircle,
    Clock as ClockIcon,
    Edit2,
    Trash2,
    Check,
    X,
    Loader2,
    AlertCircle,
    FileText
} from 'lucide-react'
import DashboardLayout from '@/components/DashboardLayout'
import { appointmentListAPI } from '@/lib/api'

export default function AppointmentsListPage() {
    const [appointments, setAppointments] = useState([])
    const [filteredAppointments, setFilteredAppointments] = useState([])
    const [activeTab, setActiveTab] = useState('pending') // 'pending', 'approved', 'rejected', 'all'
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [selectedAppointment, setSelectedAppointment] = useState(null)
    const [showDetailsModal, setShowDetailsModal] = useState(false)

    useEffect(() => {
        fetchAppointments()
    }, [])

    useEffect(() => {
        filterAppointments()
    }, [appointments, activeTab])

    const fetchAppointments = async () => {
        try {
            setLoading(true)
            setError('')
            const response = await appointmentListAPI.getAppointments()
            if (response.status === 'success') {
                setAppointments(response.data || [])
            }
        } catch (err) {
            setError(err.message || 'Failed to load appointments')
            console.error('Error fetching appointments:', err)
        } finally {
            setLoading(false)
        }
    }

    const filterAppointments = () => {
        if (activeTab === 'all') {
            setFilteredAppointments(appointments)
        } else {
            setFilteredAppointments(appointments.filter(apt => apt.status === activeTab))
        }
    }

    const handleStatusChange = async (id, newStatus) => {
        try {
            setError('')
            const response = await appointmentListAPI.updateAppointmentStatus(id, newStatus)
            if (response.status === 'success') {
                await fetchAppointments() // Refresh list
            }
        } catch (err) {
            setError(err.message || 'Failed to update appointment status')
            console.error('Error updating status:', err)
        }
    }

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this appointment?')) {
            try {
                setError('')
                const response = await appointmentListAPI.deleteAppointment(id)
                if (response.status === 'success') {
                    await fetchAppointments() // Refresh list
                }
            } catch (err) {
                setError(err.message || 'Failed to delete appointment')
                console.error('Error deleting appointment:', err)
            }
        }
    }

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            approved: 'bg-green-100 text-green-800 border-green-200',
            rejected: 'bg-red-100 text-red-800 border-red-200',
        }

        const icons = {
            pending: <ClockIcon className="w-4 h-4" />,
            approved: <CheckCircle2 className="w-4 h-4" />,
            rejected: <XCircle className="w-4 h-4" />,
        }

        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
                {icons[status]}
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        )
    }

    const tabs = [
        { id: 'all', label: 'All', count: appointments.length },
        { id: 'pending', label: 'Pending', count: appointments.filter(a => a.status === 'pending').length },
        { id: 'approved', label: 'Approved', count: appointments.filter(a => a.status === 'approved').length },
        { id: 'rejected', label: 'Rejected', count: appointments.filter(a => a.status === 'rejected').length },
    ]

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Appointments List</h1>
                    <p className="text-gray-600">Manage all your appointment requests</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                        <AlertCircle className="w-5 h-5" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Tabs */}
                <div className="mb-6 flex gap-2 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                px-6 py-3 rounded-lg font-medium transition whitespace-nowrap
                                ${activeTab === tab.id
                                    ? 'gradient-primary text-white shadow-lg'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                                }
                            `}
                        >
                            {tab.label}
                            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                                activeTab === tab.id ? 'bg-white/20' : 'bg-gray-100'
                            }`}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        <span className="ml-3 text-gray-600">Loading appointments...</span>
                    </div>
                )}

                {/* Appointments List */}
                {!loading && (
                    <>
                        {filteredAppointments.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Appointments</h3>
                                <p className="text-gray-600">
                                    {activeTab === 'all' 
                                        ? 'You don\'t have any appointments yet.'
                                        : `You don't have any ${activeTab} appointments.`
                                    }
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredAppointments.map((appointment) => (
                                    <motion.div
                                        key={appointment.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-start gap-4 mb-4">
                                                    <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
                                                        <User className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h3 className="text-xl font-bold text-gray-900">
                                                                {appointment.patient_name}
                                                            </h3>
                                                            {getStatusBadge(appointment.status)}
                                                        </div>
                                                        <div className="space-y-1 text-sm text-gray-600">
                                                            <div className="flex items-center gap-2">
                                                                <Mail className="w-4 h-4" />
                                                                <span>{appointment.patient_email}</span>
                                                            </div>
                                                            {appointment.patient_phone && (
                                                                <div className="flex items-center gap-2">
                                                                    <Phone className="w-4 h-4" />
                                                                    <span>{appointment.patient_phone}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <MapPin className="w-4 h-4 text-gray-500" />
                                                        <div>
                                                            <div className="text-gray-500">Location</div>
                                                            <div className="font-medium text-gray-900">
                                                                {appointment.location?.name || 'N/A'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Calendar className="w-4 h-4 text-gray-500" />
                                                        <div>
                                                            <div className="text-gray-500">Date</div>
                                                            <div className="font-medium text-gray-900">
                                                                {new Date(appointment.appointment_date).toLocaleDateString('en-US', {
                                                                    weekday: 'short',
                                                                    year: 'numeric',
                                                                    month: 'short',
                                                                    day: 'numeric'
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Clock className="w-4 h-4 text-gray-500" />
                                                        <div>
                                                            <div className="text-gray-500">Time</div>
                                                            <div className="font-medium text-gray-900">
                                                                {appointment.appointment_time}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {appointment.notes && (
                                                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                                            <FileText className="w-4 h-4" />
                                                            <span className="font-medium">Notes</span>
                                                        </div>
                                                        <p className="text-sm text-gray-700">{appointment.notes}</p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-col gap-2 ml-4">
                                                {appointment.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatusChange(appointment.id, 'approved')}
                                                            className="px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition flex items-center gap-2 text-sm font-medium"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusChange(appointment.id, 'rejected')}
                                                            className="px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition flex items-center gap-2 text-sm font-medium"
                                                        >
                                                            <X className="w-4 h-4" />
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                                {appointment.status === 'approved' && (
                                                    <button
                                                        onClick={() => handleStatusChange(appointment.id, 'rejected')}
                                                        className="px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition flex items-center gap-2 text-sm font-medium"
                                                    >
                                                        <X className="w-4 h-4" />
                                                        Reject
                                                    </button>
                                                )}
                                                {appointment.status === 'rejected' && (
                                                    <button
                                                        onClick={() => handleStatusChange(appointment.id, 'approved')}
                                                        className="px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition flex items-center gap-2 text-sm font-medium"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                        Approve
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(appointment.id)}
                                                    className="px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-700 transition flex items-center gap-2 text-sm font-medium"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </DashboardLayout>
    )
}

