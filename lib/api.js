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

export default authAPI

