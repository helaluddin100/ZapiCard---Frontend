'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import { useRouter } from 'next/navigation'
import authAPI, { getAuthToken, removeAuthToken } from './api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        const token = getAuthToken()
        if (!token) {
            setUser(null)
            setLoading(false)
            return
        }

        try {
            const response = await authAPI.getCurrentUser()
            // Handle different response formats
            if (response.data) {
                setUser(response.data)
            } else if (response.id) {
                setUser(response)
            } else {
                setUser(null)
            }
        } catch (error) {
            // Token invalid, remove it
            removeAuthToken()
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    const logout = async () => {
        try {
            await authAPI.logout()
        } catch (error) {
            console.error('Logout error:', error)
        } finally {
            removeAuthToken()
            setUser(null)
            router.push('/')
        }
    }

    const updateUser = (userData) => {
        setUser(userData)
    }

    return (
        <AuthContext.Provider value={{ user, loading, logout, checkAuth, updateUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}

