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
            // Create error object with response data for validation errors
            const error = new Error(data.message || 'An error occurred')
            error.response = {
                status: response.status,
                data: data
            }
            throw error
        }

        return data
    } catch (error) {
        // If it's already our custom error, re-throw it
        if (error.response) {
            throw error
        }
        // Otherwise wrap it
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

    // Update user profile
    updateUser: async (userData) => {
        const formData = new FormData()

        // Append all fields to FormData
        if (userData.name) formData.append('name', userData.name)
        if (userData.email) formData.append('email', userData.email)
        if (userData.address) formData.append('address', userData.address)
        if (userData.phone) formData.append('phone', userData.phone)
        if (userData.about) formData.append('about', userData.about)
        if (userData.city) formData.append('city', userData.city)
        if (userData.Region) formData.append('Region', userData.Region)
        if (userData.country) formData.append('country', userData.country)
        if (userData.image && userData.image instanceof File) {
            formData.append('image', userData.image)
        }

        // Use FormData for file upload
        const token = getAuthToken()
        const response = await fetch(`${API_BASE_URL}/update/user`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
            },
            body: formData,
        })

        const data = await response.json()

        if (!response.ok) {
            const error = new Error(data.message || 'An error occurred')
            error.response = {
                status: response.status,
                data: data
            }
            throw error
        }

        return data
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

    updateAppointmentStatus: async (id, status, note = null) => {
        const payload = { status }
        if (note) {
            payload.note = note
        }
        return apiRequest(`/appointments/list/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify(payload),
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
    getCardBySlug: (slug, visitorData = null) => {
        const url = `/cards/slug/${slug}`

        // If visitor data is provided, send it via POST body instead of query params
        if (visitorData && Object.keys(visitorData).length > 0) {
            return apiRequest(url, {
                method: 'POST',
                body: JSON.stringify(visitorData),
            })
        }

        // Otherwise use GET
        return apiRequest(url, { method: 'GET' })
    },
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

// Visitor Tracking API (public)
export const visitorTrackingAPI = {
    // Mark contact as saved
    markContactSaved: (trackingId) => apiRequest('/visitor-tracking/contact-saved', {
        method: 'POST',
        body: JSON.stringify({ tracking_id: trackingId }),
    }),

    // Update visitor information
    updateVisitorInfo: (trackingId, info) => apiRequest('/visitor-tracking/update-info', {
        method: 'POST',
        body: JSON.stringify({
            tracking_id: trackingId,
            ...info,
        }),
    }),
}

// Notification API
export const notificationAPI = {
    // Get all notifications
    getNotifications: () => apiRequest('/notifications', { method: 'GET' }),

    // Get unread count
    getUnreadCount: () => apiRequest('/notifications/unread-count', { method: 'GET' }),

    // Mark notification as read
    markAsRead: (id) => apiRequest(`/notifications/${id}/read`, { method: 'PUT' }),

    // Mark all as read
    markAllAsRead: () => apiRequest('/notifications/read-all', { method: 'PUT' }),
}

// Dashboard API
export const dashboardAPI = {
    // Get dashboard statistics
    getStatistics: () => apiRequest('/dashboard/statistics', { method: 'GET' }),
}

// Product API (Public - no authentication required)
export const productAPI = {
    // Get all public products
    getPublicProducts: (params = {}) => {
        const queryString = new URLSearchParams(params).toString()
        const url = queryString ? `/products/public?${queryString}` : '/products/public'
        return apiRequest(url, { method: 'GET' })
    },

    // Get product by slug (public)
    getProductBySlug: (slug) => apiRequest(`/products/slug/${slug}`, { method: 'GET' }),

    // Get product by ID (protected)
    getProduct: (id) => apiRequest(`/products/${id}`, { method: 'GET' }),

    // Get user's products (protected)
    getUserProducts: (params = {}) => {
        const queryString = new URLSearchParams(params).toString()
        const url = queryString ? `/products?${queryString}` : '/products'
        return apiRequest(url, { method: 'GET' })
    },
}

// Category API (Public - no authentication required)
export const categoryAPI = {
    // Get all active categories
    getCategories: (params = {}) => {
        const queryString = new URLSearchParams(params).toString()
        const url = queryString ? `/categories?${queryString}` : '/categories'
        return apiRequest(url, { method: 'GET' })
    },

    // Get category by slug
    getCategoryBySlug: (slug) => apiRequest(`/categories/${slug}`, { method: 'GET' }),
}

// Order API
export const orderAPI = {
    // Get all orders for authenticated user
    getOrders: (params = {}) => {
        const queryString = new URLSearchParams(params).toString()
        const url = queryString ? `/orders?${queryString}` : '/orders'
        return apiRequest(url, { method: 'GET' })
    },

    // Create a new order
    createOrder: (orderData) => apiRequest('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
    }),

    // Get a specific order by ID
    getOrder: (id) => apiRequest(`/orders/${id}`, { method: 'GET' }),

    // Get order by order number
    getOrderByOrderNumber: (orderNumber) => apiRequest(`/orders/order-number/${orderNumber}`, { method: 'GET' }),

    // Update order status
    updateOrderStatus: (id, status) => apiRequest(`/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ order_status: status }),
    }),

    // Update payment status
    updatePaymentStatus: (id, paymentStatus, transactionId = null, notes = null) => {
        const data = { payment_status: paymentStatus }
        if (transactionId) data.payment_transaction_id = transactionId
        if (notes) data.payment_notes = notes
        return apiRequest(`/orders/${id}/payment-status`, {
            method: 'PUT',
            body: JSON.stringify(data),
        })
    },

    // Cancel an order
    cancelOrder: (id) => apiRequest(`/orders/${id}/cancel`, {
        method: 'POST',
    }),
}

// Payment API
export const paymentAPI = {
    // Create Nagad payment
    createNagadPayment: (orderId) => apiRequest('/payments/nagad/create-payment', {
        method: 'POST',
        body: JSON.stringify({ order_id: orderId }),
    }),

    // Verify Nagad payment
    verifyNagadPayment: (orderId, paymentRefId) => apiRequest('/payments/nagad/verify', {
        method: 'POST',
        body: JSON.stringify({
            order_id: orderId,
            payment_ref_id: paymentRefId,
        }),
    }),
}

// Health Card API
export const healthCardAPI = {
    // Get all health cards for authenticated user
    getHealthCards: () => apiRequest('/health-cards', { method: 'GET' }),

    // Get specific health card
    getHealthCard: (id) => apiRequest(`/health-cards/${id}`, { method: 'GET' }),

    // Create new health card
    createHealthCard: (cardData) => apiRequest('/health-cards', {
        method: 'POST',
        body: JSON.stringify(cardData),
    }),

    // Update health card
    updateHealthCard: (id, cardData) => apiRequest(`/health-cards/${id}`, {
        method: 'PUT',
        body: JSON.stringify(cardData),
    }),

    // Delete health card
    deleteHealthCard: (id) => apiRequest(`/health-cards/${id}`, { method: 'DELETE' }),

    // Get public health card
    getPublicHealthCard: (username, slug) => apiRequest(`/health-cards/public/${username}/${slug}`, {
        method: 'GET',
    }),

    // Add entry to health card
    addEntry: (cardId, entryData) => apiRequest(`/health-cards/${cardId}/entries`, {
        method: 'POST',
        body: JSON.stringify(entryData),
    }),

    // Get entries for health card
    getEntries: (cardId) => apiRequest(`/health-cards/${cardId}/entries`, { method: 'GET' }),

    // Get single entry
    getEntry: (cardId, entryId) => apiRequest(`/health-cards/${cardId}/entries/${entryId}`, { method: 'GET' }),

    // Update entry
    updateEntry: (cardId, entryId, entryData) => apiRequest(`/health-cards/${cardId}/entries/${entryId}`, {
        method: 'PUT',
        body: JSON.stringify(entryData),
    }),

    // Delete entry
    deleteEntry: (cardId, entryId) => apiRequest(`/health-cards/${cardId}/entries/${entryId}`, {
        method: 'DELETE',
    }),

    // OCR for prescription (accepts array of images)
    ocrPrescription: (images) => apiRequest('/health-cards/ocr', {
        method: 'POST',
        body: JSON.stringify({ images: Array.isArray(images) ? images : [images] }),
    }),
}

// Contact API (Public - no authentication required for submission)
export const contactAPI = {
    // Submit contact form
    submitContactForm: (contactData) => apiRequest('/contact', {
        method: 'POST',
        body: JSON.stringify({
            first_name: contactData.firstName,
            last_name: contactData.lastName,
            email: contactData.email,
            subject: contactData.subject,
            message: contactData.message,
        }),
    }),

    // Get all contact messages (Admin only)
    getContactMessages: (params = {}) => {
        const queryString = new URLSearchParams(params).toString()
        const url = queryString ? `/admin/contact-messages?${queryString}` : '/admin/contact-messages'
        return apiRequest(url, { method: 'GET' })
    },

    // Get single contact message (Admin only)
    getContactMessage: (id) => apiRequest(`/admin/contact-messages/${id}`, { method: 'GET' }),

    // Mark contact message as read (Admin only)
    markAsRead: (id) => apiRequest(`/admin/contact-messages/${id}/read`, { method: 'PUT' }),

    // Delete contact message (Admin only)
    deleteContactMessage: (id) => apiRequest(`/admin/contact-messages/${id}`, { method: 'DELETE' }),
}

// Subscription API (Public - no authentication required)
export const subscriptionAPI = {
    // Subscribe to newsletter
    subscribe: (email) => apiRequest('/subscribe', {
        method: 'POST',
        body: JSON.stringify({ email }),
    }),

    // Unsubscribe from newsletter
    unsubscribe: (email) => apiRequest('/unsubscribe', {
        method: 'POST',
        body: JSON.stringify({ email }),
    }),
}

export default authAPI

