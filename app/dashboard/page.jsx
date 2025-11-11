'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import DashboardLayout from '@/components/DashboardLayout'
import { motion } from 'framer-motion'
import {
  Plus,
  TrendingUp,
  Users,
  Calendar,
  Clock,
  ArrowUp,
  ArrowDown,
  Phone,
  Mail,
  Eye,
  CreditCard,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { dashboardAPI } from '@/lib/api'

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [analytics, setAnalytics] = useState({
    totalViews: 0,
    todayViews: 0,
    viewsChange: 0,
    totalAppointments: 0,
    todayAppointments: 0,
    appointmentsChange: 0,
    totalCards: 0,
    activeCards: 0,
  })
  const [dailyVisitors, setDailyVisitors] = useState([])
  const [dailyAppointments, setDailyAppointments] = useState([])
  const [recentAppointments, setRecentAppointments] = useState([])
  const [cards, setCards] = useState([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await dashboardAPI.getStatistics()

      if (response.status === 'success' && response.data) {
        setAnalytics(response.data.analytics)
        setDailyVisitors(response.data.dailyVisitors || [])
        setDailyAppointments(response.data.dailyAppointments || [])
        setRecentAppointments(response.data.recentAppointments || [])
        setCards(response.data.cards || [])
      } else {
        setError(response.message || 'Failed to load dashboard data')
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err)
      setError('Failed to load dashboard data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Calculate max values for charts (ensure minimum of 1 to avoid division by zero)
  const maxVisitors = dailyVisitors.length > 0
    ? Math.max(1, ...dailyVisitors.map(d => d.visitors || 0))
    : 1
  const maxAppointments = dailyAppointments.length > 0
    ? Math.max(1, ...dailyAppointments.map(d => d.appointments || 0))
    : 1

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
              <p className="text-gray-600">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-red-800 font-semibold mb-1">Error Loading Dashboard</h3>
              <p className="text-red-600 text-sm">{error}</p>
              <button
                onClick={loadDashboardData}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-8xl mx-auto">
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
              <p className="text-gray-600">Welcome back! Here&apos;s what&apos;s happening with your cards</p>
            </div>
            <Link href="/dashboard/create" className="btn-primary flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              Create New Card
            </Link>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Views */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
              {analytics.viewsChange !== 0 && (
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm font-semibold ${analytics.viewsChange > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {analytics.viewsChange > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                  {Math.abs(analytics.viewsChange).toFixed(1)}%
                </div>
              )}
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalViews.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">{analytics.todayViews} today</p>
            </div>
          </motion.div>

          {/* Total Appointments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              {analytics.appointmentsChange !== 0 && (
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm font-semibold ${analytics.appointmentsChange > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {analytics.appointmentsChange > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                  {Math.abs(analytics.appointmentsChange).toFixed(1)}%
                </div>
              )}
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Appointments</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalAppointments}</p>
              <p className="text-xs text-gray-500 mt-1">{analytics.todayAppointments} today</p>
            </div>
          </motion.div>

          {/* Total Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Cards</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalCards}</p>
              <p className="text-xs text-gray-500 mt-1">{analytics.activeCards} active</p>
            </div>
          </motion.div>

          {/* Unique Visitors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalViews.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">All time</p>
            </div>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Daily Visitors Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Daily Visitors</h3>
                <p className="text-sm text-gray-600">Last 7 days</p>
              </div>
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            {dailyVisitors.length > 0 ? (
              <div className="flex items-end justify-between gap-1 sm:gap-2 h-48 pb-4">
                {dailyVisitors.map((day, idx) => {
                  const height = day.visitors > 0 ? Math.max((day.visitors / maxVisitors) * 100, 5) : 0
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center group">
                      <div className="w-full flex flex-col items-center justify-end h-full relative">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ delay: 0.6 + idx * 0.05, duration: 0.6, ease: "easeOut" }}
                          className="w-full bg-gradient-to-t from-blue-600 via-blue-500 to-blue-400 rounded-t-lg mb-1 min-h-[8px] shadow-md hover:shadow-lg transition-all cursor-pointer group-hover:from-blue-700 group-hover:via-blue-600 group-hover:to-blue-500"
                          style={{
                            minHeight: day.visitors > 0 ? '8px' : '0px',
                            maxHeight: '100%'
                          }}
                        />
                        <span className="text-xs text-gray-700 font-semibold mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {day.visitors}
                        </span>
                      </div>
                      <span className="text-xs text-gray-600 font-medium mt-2">{day.day}</span>
                      <span className="text-xs text-gray-500 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        {day.visitors}
                      </span>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <Eye className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p>No visitor data available</p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Daily Appointments Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Daily Appointments</h3>
                <p className="text-sm text-gray-600">Last 7 days</p>
              </div>
              <Calendar className="w-5 h-5 text-purple-500" />
            </div>
            {dailyAppointments.length > 0 ? (
              <div className="flex items-end justify-between gap-1 sm:gap-2 h-48 pb-4">
                {dailyAppointments.map((day, idx) => {
                  const height = day.appointments > 0 ? Math.max((day.appointments / maxAppointments) * 100, 5) : 0
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center group">
                      <div className="w-full flex flex-col items-center justify-end h-full relative">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ delay: 0.7 + idx * 0.05, duration: 0.6, ease: "easeOut" }}
                          className="w-full bg-gradient-to-t from-purple-600 via-purple-500 to-purple-400 rounded-t-lg mb-1 min-h-[8px] shadow-md hover:shadow-lg transition-all cursor-pointer group-hover:from-purple-700 group-hover:via-purple-600 group-hover:to-purple-500"
                          style={{
                            minHeight: day.appointments > 0 ? '8px' : '0px',
                            maxHeight: '100%'
                          }}
                        />
                        <span className="text-xs text-gray-700 font-semibold mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {day.appointments}
                        </span>
                      </div>
                      <span className="text-xs text-gray-600 font-medium mt-2">{day.day}</span>
                      <span className="text-xs text-gray-500 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        {day.appointments}
                      </span>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <Calendar className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p>No appointment data available</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Recent Appointments Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Recent Appointments</h3>
              <p className="text-sm text-gray-600">Last 3 days</p>
            </div>
            <Link href="/dashboard/appointments/list" className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
              View All
            </Link>
          </div>
          {recentAppointments.length > 0 ? (
            <div className="space-y-4">
              {recentAppointments.map((appointment, idx) => (
                <motion.div
                  key={appointment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + idx * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                    {appointment.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{appointment.name}</h4>
                      {appointment.card_name && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                          {appointment.card_name}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      {appointment.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {appointment.email}
                        </span>
                      )}
                      {appointment.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {appointment.phone}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      {new Date(appointment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {appointment.time}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No recent appointments</p>
            </div>
          )}
        </motion.div>

      </div>
    </DashboardLayout>
  )
}
