'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { notificationAPI } from '@/lib/api'
import {
  LayoutDashboard,
  CreditCard,
  Plus,
  Menu,
  X,
  LogOut,
  User,
  ShoppingCart,
  Calendar,
  List,
  Bell,
  Store,
  Heart
} from 'lucide-react'
import { useAuth } from '@/lib/auth'
import ThemeToggle from '@/components/ThemeToggle'
import logo from '../app/assets/images/logo.png'

export default function DashboardLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [loadingNotifications, setLoadingNotifications] = useState(false)

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  const loadNotifications = useCallback(async () => {
    if (!user) return

    try {
      setLoadingNotifications(true)
      const [notificationsRes, countRes] = await Promise.all([
        notificationAPI.getNotifications(),
        notificationAPI.getUnreadCount()
      ])

      if (notificationsRes.status === 'success') {
        setNotifications(notificationsRes.data || [])
      } else {
        console.error('Notification response error:', notificationsRes)
      }

      if (countRes.status === 'success') {
        setUnreadCount(countRes.data?.count || 0)
      } else {
        console.error('Unread count response error:', countRes)
      }
    } catch (err) {
      console.error('Error loading notifications:', err)
      // Set empty arrays on error
      setNotifications([])
      setUnreadCount(0)
    } finally {
      setLoadingNotifications(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      loadNotifications()
      // Poll for new notifications every 30 seconds
      const interval = setInterval(loadNotifications, 30000)
      return () => clearInterval(interval)
    }
  }, [user, loadNotifications])

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId)
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read_at: new Date().toISOString() } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (err) {
      console.error('Error marking notification as read:', err)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead()
      setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })))
      setUnreadCount(0)
    } catch (err) {
      console.error('Error marking all as read:', err)
    }
  }

  const formatNotificationTime = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/my-cards', label: 'My Cards', icon: CreditCard },
    { href: '/dashboard/create', label: 'Create New Card', icon: Plus },
    { href: '/health-dashboard', label: 'Health Cards', icon: Heart },
    { href: '/dashboard/products', label: 'Card Shop', icon: Store },
    { href: '/dashboard/appointments', label: 'Time Slots', icon: Calendar },
    { href: '/dashboard/appointments/list', label: 'Appointments List', icon: List },
    { href: '/nfc-order', label: 'Order NFC Card', icon: ShoppingCart },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={logo}
            alt="Zapy Card Logo"
            width={80}
            height={40}
            className="h-8 w-auto"
            priority
          />
          <span className="text-xl font-bold gradient-primary bg-clip-text text-transparent">
            Zapy Card
          </span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <div className="flex relative">
        {/* Sidebar - Fixed on all screens */}
        <aside className={`
          fixed inset-y-0 left-0 z-40
          w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
          h-screen overflow-y-auto
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <Link href="/" className="flex items-center gap-3">
                <Image
                  src={logo}
                  alt="Zapy Card Logo"
                  width={100}
                  height={40}
                  className="h-8 md:h-10 w-auto"
                  priority
                />
                <span className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
                  Zapy Card
                </span>
              </Link>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {menuItems.map((item) => {
                const Icon = item.icon
                // For dashboard, check if pathname starts with the href
                const isActive = item.href === '/dashboard'
                  ? pathname === '/dashboard' || pathname === '/dashboard/'
                  : pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-lg transition
                      ${isActive
                        ? 'gradient-primary text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
              {user && (
                <>
                  <div className="flex items-center space-x-3 px-4 py-3 mb-2">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-semibold">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate text-gray-900 dark:text-gray-100">{user.name || 'User'}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email || ''}</div>
                    </div>
                  </div>
                  <div className="mb-2 px-4">
                    <ThemeToggle />
                  </div>
                  <button
                    onClick={async () => {
                      await logout()
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 w-full lg:ml-64">
          {/* Desktop Header */}
          <div className="hidden lg:block bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-4 sticky top-0 z-30">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Dashboard</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Welcome back, {user?.name || 'User'}
                </p>
              </div>
              {user && (
                <div className="flex items-center gap-4">
                  {/* Theme Toggle */}
                  <ThemeToggle />

                  {/* Notification Bell */}
                  <div className="relative">
                    <button
                      onClick={() => setNotificationOpen(!notificationOpen)}
                      className="relative p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      <Bell className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </button>

                    {/* Notification Dropdown */}
                    <AnimatePresence>
                      {notificationOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setNotificationOpen(false)}
                          />
                          <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-[500px] overflow-hidden flex flex-col"
                          >
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
                              {unreadCount > 0 && (
                                <button
                                  onClick={handleMarkAllAsRead}
                                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                                >
                                  Mark all as read
                                </button>
                              )}
                            </div>
                            <div className="overflow-y-auto flex-1">
                              {loadingNotifications ? (
                                <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading...</div>
                              ) : notifications.length === 0 ? (
                                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                  <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                                  <p>No notifications</p>
                                </div>
                              ) : (
                                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                  {notifications.map((notification) => {
                                    const isUnread = !notification.read_at
                                    const data = notification.data || {}

                                    return (
                                      <div
                                        key={notification.id}
                                        className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer ${isUnread ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''
                                          }`}
                                        onClick={() => {
                                          if (isUnread) {
                                            handleMarkAsRead(notification.id)
                                          }
                                          if (data.appointment_id) {
                                            router.push('/dashboard/appointments/list')
                                            setNotificationOpen(false)
                                          }
                                        }}
                                      >
                                        <div className="flex items-start gap-3">
                                          <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${isUnread ? 'bg-blue-500' : 'bg-transparent'
                                            }`} />
                                          <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                              {notification.data?.message || 'New notification'}
                                            </p>
                                            {data.patient_name && (
                                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                Name: {data.patient_name}
                                              </p>
                                            )}
                                            {data.appointment_date && (
                                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                {new Date(data.appointment_date).toLocaleDateString()} at {data.appointment_time}
                                              </p>
                                            )}
                                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                              {formatNotificationTime(notification.created_at)}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                              )}
                            </div>
                            {notifications.length > 0 && (
                              <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                                <Link
                                  href="/dashboard/appointments/list"
                                  onClick={() => setNotificationOpen(false)}
                                  className="block text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                                >
                                  View All Appointments
                                </Link>
                              </div>
                            )}
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>

                  <Link
                    href="/dashboard/profile"
                    className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer"
                  >
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white font-semibold text-sm">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-sm text-gray-900 dark:text-gray-100">{user.name || 'User'}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{user.email || ''}</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="p-4 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

