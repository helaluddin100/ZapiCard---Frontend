'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
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
  List
} from 'lucide-react'
import { useAuth } from '@/lib/auth'

export default function DashboardLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/my-cards', label: 'My Cards', icon: CreditCard },
    { href: '/dashboard/create', label: 'Create New Card', icon: Plus },
    { href: '/dashboard/appointments', label: 'Time Slots', icon: Calendar },
    { href: '/dashboard/appointments/list', label: 'Appointments List', icon: List },
    { href: '/nfc-order', label: 'Order NFC Card', icon: ShoppingCart },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold gradient-primary bg-clip-text text-transparent">
          Zapi Card
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <div className="flex relative">
        {/* Sidebar - Fixed on all screens */}
        <aside className={`
          fixed inset-y-0 left-0 z-40
          w-64 bg-white border-r border-gray-200
          h-screen overflow-y-auto
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-gray-200 flex-shrink-0">
              <Link href="/" className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
                Zapi Card
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
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            <div className="p-4 border-t border-gray-200 flex-shrink-0">
              {user && (
                <>
                  <div className="flex items-center space-x-3 px-4 py-3 mb-2">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-semibold">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">{user.name || 'User'}</div>
                      <div className="text-xs text-gray-500 truncate">{user.email || ''}</div>
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      await logout()
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
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
          <div className="hidden lg:block bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-30">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
                <p className="text-sm text-gray-600">
                  Welcome back, {user?.name || 'User'}
                </p>
              </div>
              {user && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-50 transition">
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
                      <div className="font-semibold text-sm">{user.name || 'User'}</div>
                      <div className="text-xs text-gray-500">{user.email || ''}</div>
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      await logout()
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                  </button>
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

