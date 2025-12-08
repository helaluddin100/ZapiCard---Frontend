'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
    FileText,
    Video,
    Building2,
    Link2,
    Send,
    MessageSquare
} from 'lucide-react'
import DashboardLayout from '@/components/DashboardLayout'
import { appointmentListAPI } from '@/lib/api'

export default function AppointmentsListPage() {
    const [appointments, setAppointments] = useState([])
    const [filteredAppointments, setFilteredAppointments] = useState([])
    const [activeTab, setActiveTab] = useState('pending')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [selectedAppointment, setSelectedAppointment] = useState(null)
    
    // Modal states
    const [showApproveModal, setShowApproveModal] = useState(false)
    const [showRejectModal, setShowRejectModal] = useState(false)
    const [modalLoading, setModalLoading] = useState(false)
    
    // Form states for modals
    const [meetingLink, setMeetingLink] = useState('')
    const [approveNote, setApproveNote] = useState('')
    const [rejectReason, setRejectReason] = useState('')

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

    // Open Approve Modal
    const openApproveModal = (appointment) => {
        setSelectedAppointment(appointment)
        setMeetingLink('')
        setApproveNote('')
        setShowApproveModal(true)
    }

    // Open Reject Modal
    const openRejectModal = (appointment) => {
        setSelectedAppointment(appointment)
        setRejectReason('')
        setShowRejectModal(true)
    }

    // Handle Approve Submit
    const handleApproveSubmit = async () => {
        if (!selectedAppointment) return
        
        // Validate meeting link for online meetings
        if (selectedAppointment.meeting_type === 'online' && !meetingLink.trim()) {
            setError('Please provide a meeting link for online appointments')
            return
        }

        try {
            setModalLoading(true)
            setError('')
            
            // Build the note with meeting link if online
            let note = approveNote.trim()
            if (selectedAppointment.meeting_type === 'online' && meetingLink.trim()) {
                note = `Meeting Link: ${meetingLink.trim()}${note ? '\n\n' + note : ''}`
            } else if (selectedAppointment.preferred_location) {
                note = `Location: ${selectedAppointment.preferred_location}${note ? '\n\n' + note : ''}`
            }
            
            const response = await appointmentListAPI.updateAppointmentStatus(
                selectedAppointment.id, 
                'approved',
                note || 'Your appointment has been approved.'
            )
            
            if (response.status === 'success') {
                await fetchAppointments()
                setShowApproveModal(false)
                setSelectedAppointment(null)
            }
        } catch (err) {
            setError(err.message || 'Failed to approve appointment')
            console.error('Error approving:', err)
        } finally {
            setModalLoading(false)
        }
    }

    // Handle Reject Submit
    const handleRejectSubmit = async () => {
        if (!selectedAppointment) return
        
        if (!rejectReason.trim()) {
            setError('Please provide a reason for rejection')
            return
        }

        try {
            setModalLoading(true)
            setError('')
            
            const response = await appointmentListAPI.updateAppointmentStatus(
                selectedAppointment.id, 
                'rejected',
                rejectReason.trim()
            )
            
            if (response.status === 'success') {
                await fetchAppointments()
                setShowRejectModal(false)
                setSelectedAppointment(null)
            }
        } catch (err) {
            setError(err.message || 'Failed to reject appointment')
            console.error('Error rejecting:', err)
        } finally {
            setModalLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this appointment?')) {
            try {
                setError('')
                const response = await appointmentListAPI.deleteAppointment(id)
                if (response.status === 'success') {
                    await fetchAppointments()
                }
            } catch (err) {
                setError(err.message || 'Failed to delete appointment')
                console.error('Error deleting appointment:', err)
            }
        }
    }

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
            approved: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800',
            rejected: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800',
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

    const getMeetingTypeBadge = (meetingType) => {
        if (meetingType === 'online') {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    <Video className="w-3.5 h-3.5" />
                    Online Meeting
                </span>
            )
        }
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                <Building2 className="w-3.5 h-3.5" />
                In-Person
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
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Appointments List</h1>
                    <p className="text-gray-600 dark:text-gray-400">Manage all your appointment requests</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-700 dark:text-red-300">
                        <AlertCircle className="w-5 h-5" />
                        <span>{error}</span>
                        <button onClick={() => setError('')} className="ml-auto">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Tabs - Scrollable on Mobile */}
                <div className="mb-6">
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition whitespace-nowrap flex-shrink-0
                                    ${activeTab === tab.id
                                        ? 'gradient-primary text-white shadow-lg'
                                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
                                    }
                                `}
                            >
                                {tab.label}
                                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                                    activeTab === tab.id ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                }`}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
                        <span className="ml-3 text-gray-600 dark:text-gray-400">Loading appointments...</span>
                    </div>
                )}

                {/* Appointments List */}
                {!loading && (
                    <>
                        {filteredAppointments.length === 0 ? (
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No Appointments</h3>
                                <p className="text-gray-600 dark:text-gray-400">
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
                                        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 hover:shadow-md transition"
                                    >
                                        {/* Mobile Layout: Stack everything vertically */}
                                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                {/* Header Section */}
                                                <div className="flex items-start gap-3 sm:gap-4 mb-4">
                                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
                                                        <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                                                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 truncate">
                                                                {appointment.patient_name}
                                                            </h3>
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                {getStatusBadge(appointment.status)}
                                                                {getMeetingTypeBadge(appointment.meeting_type)}
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                                            {appointment.patient_email && (
                                                                <div className="flex items-center gap-2 min-w-0">
                                                                    <Mail className="w-4 h-4 flex-shrink-0" />
                                                                    <span className="truncate">{appointment.patient_email}</span>
                                                                </div>
                                                            )}
                                                            {appointment.patient_phone && (
                                                                <div className="flex items-center gap-2 min-w-0">
                                                                    <Phone className="w-4 h-4 flex-shrink-0" />
                                                                    <span className="truncate">{appointment.patient_phone}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Info Grid - Responsive */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">
                                                    <div className="flex items-start gap-2 text-sm">
                                                        <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                                                        <div className="min-w-0">
                                                            <div className="text-gray-500 dark:text-gray-400 text-xs">Location</div>
                                                            <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                                                {appointment.meeting_type === 'online' 
                                                                    ? 'Online Meeting' 
                                                                    : (appointment.preferred_location || appointment.location?.name || 'N/A')
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-2 text-sm">
                                                        <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                                                        <div className="min-w-0">
                                                            <div className="text-gray-500 dark:text-gray-400 text-xs">Date</div>
                                                            <div className="font-medium text-gray-900 dark:text-gray-100">
                                                                {new Date(appointment.appointment_date).toLocaleDateString('en-US', {
                                                                    weekday: 'short',
                                                                    year: 'numeric',
                                                                    month: 'short',
                                                                    day: 'numeric'
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-2 text-sm sm:col-span-2 lg:col-span-1">
                                                        <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                                                        <div className="min-w-0">
                                                            <div className="text-gray-500 dark:text-gray-400 text-xs">Time</div>
                                                            <div className="font-medium text-gray-900 dark:text-gray-100">
                                                                {appointment.appointment_time}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Notes */}
                                                {appointment.notes && (
                                                    <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                                                            <FileText className="w-4 h-4 flex-shrink-0" />
                                                            <span className="font-medium">Notes</span>
                                                        </div>
                                                        <p className="text-sm text-gray-700 dark:text-gray-300 break-words whitespace-pre-line">{appointment.notes}</p>
                                                    </div>
                                                )}

                                                {/* No Email Warning */}
                                                {!appointment.patient_email && (
                                                    <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                                                        <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300">
                                                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                                            <span>No email provided - notification won&apos;t be sent</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Action Buttons - Responsive */}
                                            <div className="flex flex-row lg:flex-col gap-2 flex-shrink-0 lg:ml-4">
                                                {appointment.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => openApproveModal(appointment)}
                                                            className="flex-1 lg:flex-none px-3 sm:px-4 py-2 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 transition flex items-center justify-center gap-2 text-sm font-medium"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                            <span className="hidden sm:inline">Approve</span>
                                                        </button>
                                                        <button
                                                            onClick={() => openRejectModal(appointment)}
                                                            className="flex-1 lg:flex-none px-3 sm:px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition flex items-center justify-center gap-2 text-sm font-medium"
                                                        >
                                                            <X className="w-4 h-4" />
                                                            <span className="hidden sm:inline">Reject</span>
                                                        </button>
                                                    </>
                                                )}
                                                {appointment.status === 'approved' && (
                                                    <button
                                                        onClick={() => openRejectModal(appointment)}
                                                        className="flex-1 lg:flex-none px-3 sm:px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition flex items-center justify-center gap-2 text-sm font-medium"
                                                    >
                                                        <X className="w-4 h-4" />
                                                        <span className="hidden sm:inline">Reject</span>
                                                    </button>
                                                )}
                                                {appointment.status === 'rejected' && (
                                                    <button
                                                        onClick={() => openApproveModal(appointment)}
                                                        className="flex-1 lg:flex-none px-3 sm:px-4 py-2 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 transition flex items-center justify-center gap-2 text-sm font-medium"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                        <span className="hidden sm:inline">Approve</span>
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(appointment.id)}
                                                    className="flex-1 lg:flex-none px-3 sm:px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-400 transition flex items-center justify-center gap-2 text-sm font-medium"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    <span className="hidden sm:inline">Delete</span>
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

            {/* Approve Modal */}
            <AnimatePresence>
                {showApproveModal && selectedAppointment && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/20 rounded-lg">
                                            <CheckCircle2 className="w-6 h-6 text-white" />
                                        </div>
                                        <h2 className="text-xl font-bold text-white">Approve Appointment</h2>
                                    </div>
                                    <button
                                        onClick={() => setShowApproveModal(false)}
                                        className="p-2 hover:bg-white/20 rounded-full transition"
                                    >
                                        <X className="w-5 h-5 text-white" />
                                    </button>
                                </div>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 space-y-5">
                                {/* Appointment Info */}
                                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                        {selectedAppointment.patient_name}
                                    </h3>
                                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                        <p>📅 {new Date(selectedAppointment.appointment_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                        <p>🕐 {selectedAppointment.appointment_time}</p>
                                        <p className="flex items-center gap-1">
                                            {selectedAppointment.meeting_type === 'online' ? '💻 Online Meeting' : '🏢 In-Person Meeting'}
                                        </p>
                                    </div>
                                </div>

                                {/* Meeting Link (for online meetings) */}
                                {selectedAppointment.meeting_type === 'online' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            <Link2 className="w-4 h-4 inline mr-2" />
                                            Meeting Link <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="url"
                                            value={meetingLink}
                                            onChange={(e) => setMeetingLink(e.target.value)}
                                            placeholder="https://meet.google.com/xxx-xxxx-xxx"
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400"
                                        />
                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                            Google Meet, Zoom, or any video conferencing link
                                        </p>
                                    </div>
                                )}

                                {/* Additional Note */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        <MessageSquare className="w-4 h-4 inline mr-2" />
                                        Additional Message (Optional)
                                    </label>
                                    <textarea
                                        value={approveNote}
                                        onChange={(e) => setApproveNote(e.target.value)}
                                        rows={3}
                                        placeholder="Any additional information for the patient..."
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 resize-none"
                                    />
                                </div>

                                {/* Email Notice */}
                                {selectedAppointment.patient_email ? (
                                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                                        <div className="flex items-start gap-2 text-sm text-blue-700 dark:text-blue-300">
                                            <Mail className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                            <span>Notification will be sent to <strong>{selectedAppointment.patient_email}</strong></span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                                        <div className="flex items-start gap-2 text-sm text-amber-700 dark:text-amber-300">
                                            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                            <span>No email provided - status will be updated but no notification will be sent</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 flex gap-3">
                                <button
                                    onClick={() => setShowApproveModal(false)}
                                    disabled={modalLoading}
                                    className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleApproveSubmit}
                                    disabled={modalLoading || (selectedAppointment.meeting_type === 'online' && !meetingLink.trim())}
                                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-xl hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {modalLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Approving...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" />
                                            Approve & Notify
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Reject Modal */}
            <AnimatePresence>
                {showRejectModal && selectedAppointment && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="bg-gradient-to-r from-rose-500 via-red-500 to-orange-500 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/20 rounded-lg">
                                            <XCircle className="w-6 h-6 text-white" />
                                        </div>
                                        <h2 className="text-xl font-bold text-white">Reject Appointment</h2>
                                    </div>
                                    <button
                                        onClick={() => setShowRejectModal(false)}
                                        className="p-2 hover:bg-white/20 rounded-full transition"
                                    >
                                        <X className="w-5 h-5 text-white" />
                                    </button>
                                </div>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 space-y-5">
                                {/* Appointment Info */}
                                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                        {selectedAppointment.patient_name}
                                    </h3>
                                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                        <p>📅 {new Date(selectedAppointment.appointment_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                        <p>🕐 {selectedAppointment.appointment_time}</p>
                                    </div>
                                </div>

                                {/* Rejection Reason */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        <MessageSquare className="w-4 h-4 inline mr-2" />
                                        Reason for Rejection <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={rejectReason}
                                        onChange={(e) => setRejectReason(e.target.value)}
                                        rows={4}
                                        placeholder="Please provide a reason for rejecting this appointment..."
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 resize-none"
                                    />
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        This message will be sent to the patient explaining why the appointment was rejected.
                                    </p>
                                </div>

                                {/* Quick Reasons */}
                                <div>
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quick Reasons:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            'Schedule conflict',
                                            'Not available on this date',
                                            'Time slot already booked',
                                            'Need more information',
                                            'Outside service area'
                                        ].map((reason) => (
                                            <button
                                                key={reason}
                                                type="button"
                                                onClick={() => setRejectReason(reason)}
                                                className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                                            >
                                                {reason}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Email Notice */}
                                {selectedAppointment.patient_email ? (
                                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                                        <div className="flex items-start gap-2 text-sm text-blue-700 dark:text-blue-300">
                                            <Mail className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                            <span>Rejection notice will be sent to <strong>{selectedAppointment.patient_email}</strong></span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                                        <div className="flex items-start gap-2 text-sm text-amber-700 dark:text-amber-300">
                                            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                            <span>No email provided - status will be updated but no notification will be sent</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 flex gap-3">
                                <button
                                    onClick={() => setShowRejectModal(false)}
                                    disabled={modalLoading}
                                    className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleRejectSubmit}
                                    disabled={modalLoading || !rejectReason.trim()}
                                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-rose-500 via-red-500 to-orange-500 text-white rounded-xl hover:from-rose-600 hover:via-red-600 hover:to-orange-600 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {modalLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Rejecting...
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="w-4 h-4" />
                                            Reject & Notify
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    )
}
