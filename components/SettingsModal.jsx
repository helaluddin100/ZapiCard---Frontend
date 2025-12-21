'use client'

import { useState, useEffect, useRef } from 'react'
import { X, User, Moon, Sun, Monitor, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/lib/auth'
import { useToast } from '@/lib/toast'
import { useTheme } from '@/lib/theme'
import { authAPI } from '@/lib/api'

export default function SettingsModal({ isOpen, onClose }) {
    const { user, checkAuth } = useAuth()
    const { success, error: showError } = useToast()
    const { theme, setThemeMode } = useTheme()
    const [activeTab, setActiveTab] = useState('account')
    const [saving, setSaving] = useState(false)
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    
    const [accountData, setAccountData] = useState({
        name: '',
        email: '',
        current_password: '',
        password: '',
        password_confirmation: ''
    })

    useEffect(() => {
        if (isOpen && user) {
            setAccountData({
                name: user.name || '',
                email: user.email || '',
                current_password: '',
                password: '',
                password_confirmation: ''
            })
        }
    }, [isOpen, user])

    const handleAccountChange = (e) => {
        const { name, value } = e.target
        setAccountData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handlePasswordChange = async (e) => {
        e.preventDefault()
        
        if (!accountData.password) {
            showError('Please enter a new password')
            return
        }

        if (accountData.password !== accountData.password_confirmation) {
            showError('Passwords do not match')
            return
        }

        if (accountData.password.length < 6) {
            showError('Password must be at least 6 characters')
            return
        }

        setSaving(true)
        try {
            const response = await authAPI.updateUser({
                name: accountData.name,
                email: accountData.email,
                current_password: accountData.current_password,
                password: accountData.password,
                password_confirmation: accountData.password_confirmation
            })

            if (response.status === 'success') {
                success('Password changed successfully!')
                setAccountData(prev => ({
                    ...prev,
                    current_password: '',
                    password: '',
                    password_confirmation: ''
                }))
                await checkAuth()
            } else {
                showError(response.message || 'Failed to change password')
            }
        } catch (error) {
            console.error('Password change error:', error)
            if (error.response?.data?.errors) {
                const errors = error.response.data.errors
                const firstError = Object.values(errors)[0]
                showError(Array.isArray(firstError) ? firstError[0] : firstError)
            } else {
                showError(error.response?.data?.message || 'Failed to change password. Please try again.')
            }
        } finally {
            setSaving(false)
        }
    }

    const themes = [
        { value: 'light', label: 'Light', icon: Sun },
        { value: 'dark', label: 'Dark', icon: Moon },
        { value: 'system', label: 'System', icon: Monitor }
    ]

    if (!isOpen) return null

    return (
      <AnimatePresence>
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                Settings
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row flex-1 overflow-hidden">
              {/* Sidebar Navigation - Horizontal on mobile, Vertical on desktop */}
              <div className="sm:w-64 border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-3 sm:p-4">
                <nav className="flex sm:flex-col gap-2 sm:space-y-2">
                  <button
                    onClick={() => setActiveTab("account")}
                    className={`flex-1 sm:w-full flex items-center justify-center sm:justify-start gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition text-sm sm:text-base ${
                      activeTab === "account"
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <User className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="font-medium">Account</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("appearance")}
                    className={`flex-1 sm:w-full flex items-center justify-center sm:justify-start gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition text-sm sm:text-base ${
                      activeTab === "appearance"
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <Monitor className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="font-medium">Appearance</span>
                  </button>
                </nav>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                {/* Account Tab */}
                {activeTab === "account" && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        Account
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                        Manage your account information and password
                      </p>
                    </div>

                    {/* User Info */}
                    {user && (
                      <div className="flex flex-col sm:flex-row items-center sm:items-center gap-3 sm:gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name}
                            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl sm:text-2xl font-bold">
                            {user.name?.charAt(0).toUpperCase() || "U"}
                          </div>
                        )}
                        <div className="flex-1 text-center sm:text-left">
                          <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                            {user.name || "User"}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 break-all">
                            {user.email || ""}
                          </div>
                        </div>
                        <a
                          href="/dashboard/profile"
                          className="w-full sm:w-auto px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium text-sm text-center"
                        >
                          Manage
                        </a>
                      </div>
                    )}

                    {/* Password Change Form */}
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      <div>
                        <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                          <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                          Change Password
                        </h4>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? "text" : "password"}
                            name="current_password"
                            value={accountData.current_password}
                            onChange={handleAccountChange}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm sm:text-base"
                            placeholder="Enter current password"
                            required={!!accountData.password}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowCurrentPassword(!showCurrentPassword)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                            ) : (
                              <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            name="password"
                            value={accountData.password}
                            onChange={handleAccountChange}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm sm:text-base"
                            placeholder="Enter new password"
                            minLength={6}
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            {showNewPassword ? (
                              <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                            ) : (
                              <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="password_confirmation"
                            value={accountData.password_confirmation}
                            onChange={handleAccountChange}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm sm:text-base"
                            placeholder="Confirm new password"
                            minLength={6}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                            ) : (
                              <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                        <button
                          type="button"
                          onClick={() => {
                            setAccountData((prev) => ({
                              ...prev,
                              current_password: "",
                              password: "",
                              password_confirmation: "",
                            }));
                          }}
                          className="w-full sm:w-auto px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-sm sm:text-base"
                        >
                          Clear
                        </button>
                        <button
                          type="submit"
                          disabled={saving || !accountData.password}
                          className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                        >
                          {saving ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Changing...
                            </>
                          ) : (
                            "Change Password"
                          )}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* Appearance Tab */}
                {activeTab === "appearance" && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        Appearance
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                        Choose your preferred theme
                      </p>
                    </div>

                    <div className="space-y-2">
                      {themes.map((themeOption) => {
                        const Icon = themeOption.icon;
                        const isActive = theme === themeOption.value;

                        return (
                          <button
                            key={themeOption.value}
                            onClick={() => setThemeMode(themeOption.value)}
                            className={`w-full flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 sm:py-4 rounded-lg border-2 transition text-left ${
                              isActive
                                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                            }`}
                          >
                            <Icon
                              className={`w-4 h-4 sm:w-5 sm:h-5 ${
                                isActive
                                  ? "text-blue-600 dark:text-blue-400"
                                  : ""
                              }`}
                            />
                            <span className="font-medium flex-1 text-sm sm:text-base">
                              {themeOption.label}
                            </span>
                            {isActive && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400"
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-6 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-200">
                        <strong>Tip:</strong> Select "Dark" for night mode or
                        "System" to match your device settings.
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    );
}

