// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

// Helper function to get auth token from localStorage
export const getAuthToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('auth_token')
    }
    return null
}

// Helper function to set auth token
export const setAuthToken = (token) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', token)
    }
}

// Helper function to remove auth token
export const removeAuthToken = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
    }
}

// API request helper
const apiRequest = async (endpoint, options = {}) => {
    const token = getAuthToken()

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers,
        },
        ...options,
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.message || 'An error occurred')
        }

        return data
    } catch (error) {
        throw error
    }
}

// Auth API functions
export const authAPI = {
    // Register user
    register: async (userData) => {
        return apiRequest('/register', {
            method: 'POST',
            body: JSON.stringify({
                name: userData.name,
                email: userData.email,
                password: userData.password,
                password_confirmation: userData.confirmPassword,
            }),
        })
    },

    // Login user
    login: async (email, password) => {
        const data = await apiRequest('/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        })

        if (data.data?.token) {
            setAuthToken(data.data.token)
        }

        return data
    },

    // Social login (Google/Facebook)
    socialLogin: async (provider, providerData) => {
        const data = await apiRequest('/social-login', {
            method: 'POST',
            body: JSON.stringify({
                provider,
                provider_id: providerData.id,
                email: providerData.email,
                name: providerData.name,
                image: providerData.picture || providerData.photoURL,
            }),
        })

        if (data.data?.token) {
            setAuthToken(data.data.token)
        }

        return data
    },

    // Verify email with 6-digit code
    verifyEmail: async (email, verificationCode) => {
        const data = await apiRequest('/auth/verify', {
            method: 'POST',
            body: JSON.stringify({
                email,
                verification_code: verificationCode,
            }),
        })

        if (data.data?.token) {
            setAuthToken(data.data.token)
        }

        return data
    },

    // Resend verification code
    resendVerificationCode: async (email) => {
        return apiRequest('/resend-verification-code', {
            method: 'POST',
            body: JSON.stringify({ email }),
        })
    },

    // Logout
    logout: async () => {
        try {
            await apiRequest('/logout', {
                method: 'POST',
            })
        } catch (error) {
            console.error('Logout error:', error)
        } finally {
            removeAuthToken()
        }
    },

    // Get current user
    getCurrentUser: async () => {
        return apiRequest('/user', {
            method: 'GET',
        })
    },
}

// Appointment API functions
export const appointmentAPI = {
    // Locations
    getLocations: async () => {
        return apiRequest('/appointments/locations', {
            method: 'GET',
        })
    },

    createLocation: async (locationData) => {
        return apiRequest('/appointments/locations', {
            method: 'POST',
            body: JSON.stringify(locationData),
        })
    },

    updateLocation: async (id, locationData) => {
        return apiRequest(`/appointments/locations/${id}`, {
            method: 'PUT',
            body: JSON.stringify(locationData),
        })
    },

    deleteLocation: async (id) => {
        return apiRequest(`/appointments/locations/${id}`, {
            method: 'DELETE',
        })
    },

    // Time Slots
    getTimeSlots: async (locationId) => {
        return apiRequest(`/appointments/locations/${locationId}/time-slots`, {
            method: 'GET',
        })
    },

    createTimeSlot: async (timeSlotData) => {
        return apiRequest('/appointments/time-slots', {
            method: 'POST',
            body: JSON.stringify(timeSlotData),
        })
    },

    updateTimeSlot: async (id, timeSlotData) => {
        return apiRequest(`/appointments/time-slots/${id}`, {
            method: 'PUT',
            body: JSON.stringify(timeSlotData),
        })
    },

    deleteTimeSlot: async (id) => {
        return apiRequest(`/appointments/time-slots/${id}`, {
            method: 'DELETE',
        })
    },
}

// Appointment List API functions
export const appointmentListAPI = {
    // Get appointments (with optional status filter)
    getAppointments: async (status = null) => {
        const url = status
            ? `/appointments/list?status=${status}`
            : '/appointments/list'
        return apiRequest(url, {
            method: 'GET',
        })
    },

    createAppointment: async (appointmentData) => {
        return apiRequest('/appointments/list', {
            method: 'POST',
            body: JSON.stringify(appointmentData),
        })
    },

    updateAppointment: async (id, appointmentData) => {
        return apiRequest(`/appointments/list/${id}`, {
            method: 'PUT',
            body: JSON.stringify(appointmentData),
        })
    },

    updateAppointmentStatus: async (id, status) => {
        return apiRequest(`/appointments/list/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        })
    },

    deleteAppointment: async (id) => {
        return apiRequest(`/appointments/list/${id}`, {
            method: 'DELETE',
        })
    },
}

// Card API
export const cardAPI = {
    // Get all cards for authenticated user
    getCards: () => apiRequest('/cards', { method: 'GET' }),

    // Create a new card
    createCard: (cardData) => apiRequest('/cards', {
        method: 'POST',
        body: JSON.stringify(cardData),
    }),

    // Get a specific card by ID
    getCard: (id) => apiRequest(`/cards/${id}`, { method: 'GET' }),

    // Update a card
    updateCard: (id, cardData) => apiRequest(`/cards/${id}`, {
        method: 'PUT',
        body: JSON.stringify(cardData),
    }),

    // Delete a card
    deleteCard: (id) => apiRequest(`/cards/${id}`, { method: 'DELETE' }),

    // Get card by slug (public)
    getCardBySlug: (slug) => apiRequest(`/cards/slug/${slug}`, { method: 'GET' }),
}

// Public Appointment API (no authentication required)
export const publicAppointmentAPI = {
    // Get appointment data for a card (locations and time slots)
    getCardAppointmentData: (slug) => apiRequest(`/cards/${slug}/appointments`, { method: 'GET' }),

    // Create appointment (public)
    createAppointment: (appointmentData) => apiRequest('/appointments/public', {
        method: 'POST',
        body: JSON.stringify(appointmentData),
    }),
}

export default authAPI

