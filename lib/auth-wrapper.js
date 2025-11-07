'use client'

import { AuthProvider } from './auth'

export default function AuthProviderWrapper({ children }) {
    return <AuthProvider>{children}</AuthProvider>
}

